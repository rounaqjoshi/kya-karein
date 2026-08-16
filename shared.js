(() => {
  const config = window.KYA_CONFIG;
  const authGate = document.querySelector('#auth-gate');
  if (!config || !authGate) return;

  const sessionKey = 'qeera-household-session-v1';
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  let activeSession = null;
  let activeProfile = null;
  let selectedProfileKey = null;
  let syncTimer = null;
  let preferenceDirty = false;
  let preferenceInitialized = false;
  let preferenceEditVersion = 0;

  const loginForm = authGate.querySelector('#pin-login-form');
  const pinInput = authGate.querySelector('#pin-input');
  const authMessage = authGate.querySelector('#auth-message');
  const accountButton = document.querySelector('#account-button');
  const mealChecks = [...document.querySelectorAll('[data-meal]')];
  const note = document.querySelector('#preference-note');
  const saveState = document.querySelector('#save-state');
  const mealWeek = document.querySelector('.meal-week');
  const planWeekStart = mealWeek?.dataset.weekStart;

  function addDaysToIsoDate(isoDate, days) {
    if (!isoDate) return '';
    const date = new Date(`${isoDate}T12:00:00Z`);
    if (Number.isNaN(date.getTime())) return '';
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  const preferenceWeekStart = addDaysToIsoDate(planWeekStart, 7) || document.body.dataset.preferenceWeekStart;
  if (preferenceWeekStart) document.body.dataset.preferenceWeekStart = preferenceWeekStart;

  function readJson(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  }

  function setMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.classList.toggle('error', isError);
  }

  function sessionHeaders(extra = {}) {
    return {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${activeSession.access_token}`,
      ...extra
    };
  }

  async function refreshSession() {
    if (!activeSession?.refresh_token) throw new Error('No saved session');
    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: config.supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: activeSession.refresh_token })
    });
    if (!response.ok) throw new Error('Session expired');
    const refreshed = await response.json();
    activeSession = {
      ...refreshed,
      profileKey: activeSession.profileKey,
      trustedUntil: activeSession.trustedUntil
    };
    writeJson(sessionKey, activeSession);
  }

  async function authedFetch(url, options = {}, allowRefresh = true) {
    const response = await fetch(url, {
      ...options,
      headers: sessionHeaders(options.headers || {})
    });
    if (response.status === 401 && allowRefresh) {
      await refreshSession();
      return authedFetch(url, options, false);
    }
    return response;
  }

  async function rest(path, options = {}) {
    const response = await authedFetch(`${config.supabaseUrl}/rest/v1/${path}`, options);
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `Sync failed (${response.status})`);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  function openGate(message = '') {
    authGate.hidden = false;
    document.body.classList.add('auth-locked');
    accountButton?.setAttribute('hidden', '');
    if (message) setMessage(message, true);
  }

  function closeGate() {
    authGate.hidden = true;
    document.body.classList.remove('auth-locked');
    if (accountButton && activeProfile) {
      accountButton.textContent = activeProfile.display_name;
      accountButton.removeAttribute('hidden');
    }
  }

  function clearSession() {
    activeSession = null;
    activeProfile = null;
    localStorage.removeItem(sessionKey);
    if (syncTimer) window.clearInterval(syncTimer);
    syncTimer = null;
  }

  async function signIn(profileKey, pin) {
    const profile = config.profiles[profileKey];
    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: config.supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: profile.email, password: pin })
    });
    if (!response.ok) throw new Error('That PIN did not work. Please try again.');
    const session = await response.json();
    activeSession = {
      ...session,
      profileKey,
      trustedUntil: Date.now() + thirtyDays
    };
    writeJson(sessionKey, activeSession);
  }

  async function loadProfile() {
    const userId = activeSession?.user?.id;
    if (!userId) throw new Error('Profile session is incomplete');
    const rows = await rest(`profiles?select=user_id,household_id,display_name&user_id=eq.${encodeURIComponent(userId)}`);
    if (!rows?.length) throw new Error('This profile still needs to be connected to the household.');
    activeProfile = rows[0];
  }

  function updateProgress() {
    if (!mealChecks.length) return;
    const complete = mealChecks.filter(input => input.checked).length;
    const percent = Math.round(complete / mealChecks.length * 100);
    const fill = document.querySelector('#progress-fill');
    const count = document.querySelector('#progress-count');
    const percentage = document.querySelector('#progress-percent');
    if (fill) fill.style.width = `${percent}%`;
    if (count) count.textContent = `${complete} of ${mealChecks.length} checked`;
    if (percentage) percentage.textContent = `${percent}%`;
  }

  function applyCheckedState(state) {
    mealChecks.forEach(input => {
      input.checked = Boolean(state[input.dataset.meal]);
      input.closest('.meal')?.classList.toggle('done', input.checked);
    });
    updateProgress();
  }

  function cachedChecksKey() {
    return `qeera-meals-${planWeekStart}`;
  }

  function preferenceCacheKey() {
    return `qeera-preference-${preferenceWeekStart}`;
  }

  function preferenceDraftKey() {
    return `qeera-preference-draft-${preferenceWeekStart}`;
  }

  function initializePreferenceDraft() {
    if (!note || !preferenceWeekStart || preferenceInitialized) return;
    const draft = readJson(preferenceDraftKey());
    if (draft && typeof draft.value === 'string') {
      note.value = draft.value;
      preferenceDirty = true;
      if (saveState) saveState.textContent = 'Unsaved draft kept on this device';
    } else {
      note.value = readJson(preferenceCacheKey(), '');
    }
    preferenceInitialized = true;
  }

  async function loadMealChecks() {
    if (!mealChecks.length || !planWeekStart) return;
    const cached = readJson(cachedChecksKey(), {});
    applyCheckedState(cached);
    const rows = await rest(
      `meal_items?select=meal_key,checked&household_id=eq.${activeProfile.household_id}&week_start=eq.${planWeekStart}`
    );
    const state = Object.fromEntries((rows || []).map(row => [row.meal_key, row.checked]));
    writeJson(cachedChecksKey(), state);
    applyCheckedState(state);
  }

  function mealPayload(input) {
    const meal = input.closest('.meal');
    const day = input.closest('[data-date]');
    const slot = meal.querySelector('small').textContent.split('·')[0].trim().toLowerCase();
    return {
      household_id: activeProfile.household_id,
      week_start: planWeekStart,
      meal_key: input.dataset.meal,
      day_date: day.dataset.date,
      slot,
      title: meal.querySelector('b').textContent.trim(),
      recipe_key: meal.querySelector('[data-recipe]')?.dataset.recipe || null,
      checked: input.checked,
      checked_by: input.checked ? activeSession.user.id : null,
      checked_at: input.checked ? new Date().toISOString() : null
    };
  }

  async function saveMealCheck(input) {
    const cached = readJson(cachedChecksKey(), {});
    cached[input.dataset.meal] = input.checked;
    writeJson(cachedChecksKey(), cached);
    input.closest('.meal')?.classList.toggle('done', input.checked);
    updateProgress();
    await rest('meal_items?on_conflict=household_id,week_start,meal_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(mealPayload(input))
    });
  }

  async function loadPreference() {
    if (!note || !preferenceWeekStart) return;
    initializePreferenceDraft();
    const rows = await rest(
      `weekly_preferences?select=note,updated_at&household_id=eq.${activeProfile.household_id}&week_start=eq.${preferenceWeekStart}`
    );
    const sharedValue = rows?.length ? rows[0].note || '' : '';
    writeJson(preferenceCacheKey(), sharedValue);
    if (!preferenceDirty) {
      note.value = sharedValue;
      if (saveState) saveState.textContent = rows?.length ? 'Shared note loaded' : 'No shared note yet';
    } else if (saveState) {
      saveState.textContent = 'Unsaved draft kept on this device';
    }
  }

  async function savePreference() {
    if (!note || !preferenceWeekStart) return;
    const value = note.value.trim();
    const editVersionAtSave = preferenceEditVersion;
    if (saveState) saveState.textContent = 'Saving for both of you…';
    await rest('weekly_preferences?on_conflict=household_id,week_start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        household_id: activeProfile.household_id,
        week_start: preferenceWeekStart,
        note: value,
        submitted_by: activeSession.user.id
      })
    });
    writeJson(preferenceCacheKey(), value);
    if (preferenceEditVersion === editVersionAtSave) {
      note.value = value;
      preferenceDirty = false;
      localStorage.removeItem(preferenceDraftKey());
      if (saveState) saveState.textContent = `Saved for Ronnie + Saumya · ${new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' }).format(new Date())}`;
    } else if (saveState) {
      saveState.textContent = 'Saved. Newer unsaved draft kept on this device';
    }
  }

  async function syncSharedState() {
    try {
      await Promise.all([loadMealChecks(), loadPreference()]);
      document.querySelector('#sync-state')?.classList.remove('offline');
    } catch {
      document.querySelector('#sync-state')?.classList.add('offline');
      if (saveState) saveState.textContent = 'Offline — showing the last saved copy';
    }
  }

  async function enterApp() {
    await loadProfile();
    closeGate();
    await syncSharedState();
    syncTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') syncSharedState();
    }, 30000);
  }

  authGate.querySelectorAll('[data-profile]').forEach(button => {
    button.addEventListener('click', () => {
      selectedProfileKey = button.dataset.profile;
      authGate.querySelectorAll('[data-profile]').forEach(item => item.classList.toggle('selected', item === button));
      authGate.querySelector('#pin-panel').hidden = false;
      authGate.querySelector('#pin-person').textContent = config.profiles[selectedProfileKey].name;
      pinInput.value = '';
      setMessage('');
      pinInput.focus();
    });
  });

  pinInput.addEventListener('input', () => {
    pinInput.value = pinInput.value.replace(/\D/g, '').slice(0, 6);
  });

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!selectedProfileKey) return setMessage('Choose Ronnie or Saumya first.', true);
    if (!/^\d{6}$/.test(pinInput.value)) return setMessage('Enter your six-digit PIN.', true);
    const submit = loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    setMessage('Opening your shared plan…');
    try {
      await signIn(selectedProfileKey, pinInput.value);
      await enterApp();
    } catch (error) {
      clearSession();
      openGate(error.message);
    } finally {
      submit.disabled = false;
    }
  });

  mealChecks.forEach(input => {
    input.addEventListener('change', async () => {
      try {
        await saveMealCheck(input);
      } catch {
        if (saveState) saveState.textContent = 'Saved on this phone; shared sync will retry';
      }
    });
  });

  note?.addEventListener('input', () => {
    preferenceDirty = true;
    preferenceInitialized = true;
    preferenceEditVersion += 1;
    writeJson(preferenceDraftKey(), { value: note.value, updatedAt: new Date().toISOString() });
    if (saveState) saveState.textContent = 'Draft kept on this device. Save when ready';
  });

  document.querySelector('#save-note')?.addEventListener('click', async () => {
    try { await savePreference(); }
    catch { if (saveState) saveState.textContent = 'Could not share yet. Draft kept here. Save again when online'; }
  });

  document.querySelector('#reset-checks')?.addEventListener('click', async () => {
    if (!window.confirm('Clear all shared meal check-offs for this week?')) return;
    mealChecks.forEach(input => {
      input.checked = false;
      input.closest('.meal')?.classList.remove('done');
    });
    writeJson(cachedChecksKey(), {});
    updateProgress();
    try {
      await rest(`meal_items?household_id=eq.${activeProfile.household_id}&week_start=eq.${planWeekStart}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ checked: false, checked_by: null, checked_at: null })
      });
    } catch {
      if (saveState) saveState.textContent = 'Reset on this phone; shared sync will retry';
    }
  });

  accountButton?.addEventListener('click', async () => {
    if (!window.confirm(`Sign out ${activeProfile?.display_name || ''} on this device?`)) return;
    try {
      await authedFetch(`${config.supabaseUrl}/auth/v1/logout`, { method: 'POST' });
    } catch { /* Local sign-out still succeeds. */ }
    clearSession();
    selectedProfileKey = null;
    authGate.querySelectorAll('[data-profile]').forEach(item => item.classList.remove('selected'));
    authGate.querySelector('#pin-panel').hidden = true;
    openGate();
  });

  window.addEventListener('online', syncSharedState);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && activeProfile) syncSharedState();
  });

  (async () => {
    const saved = readJson(sessionKey);
    if (!saved || saved.trustedUntil < Date.now()) {
      clearSession();
      openGate();
      return;
    }
    activeSession = saved;
    try { await enterApp(); }
    catch {
      clearSession();
      openGate('Please enter your PIN again.');
    }
  })();
})();
