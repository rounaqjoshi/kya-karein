const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  }
};

const torontoDateParts = Object.fromEntries(
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date()).filter(part => part.type !== 'literal').map(part => [part.type, part.value])
);
const torontoToday = `${torontoDateParts.year}-${torontoDateParts.month}-${torontoDateParts.day}`;
document.querySelectorAll('[data-date]').forEach(card => {
  const isToday = card.dataset.date === torontoToday;
  card.classList.toggle('today', isToday);
  if (isToday) card.setAttribute('aria-current', 'date');
  else card.removeAttribute('aria-current');
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.event[data-tags]').forEach(event => {
      const tags = event.dataset.tags.split(' ');
      event.hidden = filter !== 'all' && !tags.includes(filter);
    });
  });
});

const recipes = {
  mushroom: {
    title: 'Mushroom Ghee Roast Subzi',
    url: 'https://app.notion.com/p/1d5e4e7470e580709c22d8e9cc41420b',
    copy: `Ingredients
5–8 garlic cloves; 8–10 cashews; 5–6 Kashmiri dried red chillies; 1 tbsp tamarind pulp; ½–1 tbsp sugar or jaggery; 250 g mushrooms; jeera powder; coriander powder; pepper; turmeric; salt; 2 tbsp ghee; curry leaves; fresh coriander.

Method
Blend cashews, Kashmiri chillies, garlic, tamarind and sugar with water into a smooth paste. Sauté sliced mushrooms in 1 tbsp ghee for 4–5 minutes, then remove. In the same pan, cook the remaining ghee, paste and spices for 4–6 minutes. Add water if needed, then curry leaves and mushrooms. Finish with coriander and serve with roti.`
  },
  pudina: {
    title: 'Pudina Coriander Gravy — paneer or chicken',
    url: 'https://app.notion.com/p/292e4e7470e580a2b071de1b4ad31119',
    copy: `Blend garlic, ginger, plenty of pudina and coriander, cashews, curd, chilli-garlic paste and a little water.

Cook onion in oil until golden. Add the ground paste, salt and garam masala. Add paneer or chicken and cook until done.`
  },
  'thai-soup': {
    title: 'Saumya’s Thai Veggie Soup',
    url: 'https://app.notion.com/p/22be4e7470e580039f01ff9aa52fd168',
    copy: `Sauté green chillies, onion, bell peppers and broccoli in butter. Add salt and vegetable broth, then bring to a boil. Add peanut butter, a splash of milk and gochujang. Reduce until the flavour and consistency are right. Serve.`
  },
  'thai-green': {
    title: 'Thai Green Curry',
    url: 'https://app.notion.com/p/133e4e7470e58088a278d94d988b04fc',
    copy: `Blend basil, coriander, spring onion, lemongrass, peppercorns, coriander seeds and cumin seeds with water to make a paste.

Cook the vegetables separately and simmer. Transfer them to the paste, add coconut milk and salt, then cook through.`
  },
  'thai-red': {
    title: 'Thai Red Curry',
    url: 'https://app.notion.com/p/133e4e7470e58098818cefae99f2fab8',
    copy: `Toast cumin and coriander seeds, then grind. Blend them with shallots, garlic, lemongrass, red chillies, ginger, lime zest, miso, salt and a little oil into a thick paste.

Sauté onion, garlic and ginger. Add curry paste for 1–2 minutes, then coconut milk and broth. Add chicken, tofu or shrimp and cook through. Add bell pepper, zucchini and bamboo shoots for 5–7 minutes. Finish with basil and serve with rice and lime.`
  },
  broccoli: {
    title: 'Broccoli Cheddar Soup with Miso',
    url: 'https://app.notion.com/p/16be4e7470e5802f92defc1d8f0cfd8b',
    copy: `Sauté onion and garlic in olive oil or butter for 3–4 minutes. Add carrot and broccoli; cook 5 minutes. Add low-sodium vegetable broth and simmer 10–12 minutes until tender.

Blend smooth or leave partly chunky. Dissolve white or yellow miso in a ladle of hot broth, then stir it back in with milk. Heat gently without boiling. Stir in grated cheddar, season and serve.`
  },
  'dal-dhokli': {
    title: 'Dal Dhokli',
    url: 'https://app.notion.com/p/369e4e7470e58028a248d18ac8e2dc34',
    copy: `Dal
Soak tur dal 4–5 hours, pressure cook and blend slightly while keeping it thin. Add dhana jeeru, red chilli, turmeric, salt, tamarind paste, jaggery and crushed ginger. Make a ghee tempering with mustard seeds, green chilli, curry leaves and hing; add it to the dal.

Dhokli
Mix wheat flour with ajwain, hing, turmeric, red chilli, salt and oil. Roll very thin raw rotis—do not cook them. Cut into pieces, add to boiling dal and keep stirring so they do not stick.`
  },
  'tomato-chutney': {
    title: 'Tomato Chutney',
    url: 'https://app.notion.com/p/294e4e7470e58079b936c78215d4db7c',
    copy: `Halve two tomatoes. Place cut-side down in an oiled pan with sliced green chilli, curry leaves, jeera, peanuts and two garlic cloves. Cook slowly, stirring, until the tomato is soft.

Blend with salt, lemon and red chilli powder.`
  },
  thepla: {
    title: 'Thepla',
    url: 'https://app.notion.com/p/369e4e7470e580b09a9be712652f977c',
    copy: `Use wheat flour with turmeric, red chilli, dhana jeeru, salt, garlic, curd, methi, sugar, white sesame and oil. Season the dough more strongly than a sabzi because the spices become milder once mixed into the flour.`
  }
};

const modal = document.querySelector('#recipe-modal');
const modalTitle = document.querySelector('#recipe-title');
const modalCopy = document.querySelector('#recipe-copy');
const modalSource = document.querySelector('#recipe-source');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-recipe]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    const recipe = recipes[button.dataset.recipe];
    if (!recipe || !modal) return;
    modalTitle.textContent = recipe.title;
    modalCopy.textContent = recipe.copy;
    modalSource.href = recipe.url;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  });
});

modal?.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.querySelectorAll('[data-scroll-restaurants]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#restaurants')?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
