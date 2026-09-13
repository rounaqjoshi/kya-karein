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
  chia: {
    title: 'Chia Seed Pudding',
    url: 'https://app.notion.com/p/140e4e7470e580f9b5a7f62baaf5782a',
    copy: `Add chia seeds to a bowl and coconut milk alongwith cinnamon - grated and nutmeg.

Add maple syrup with a pinch of salt and mix.

Let it sit overnight.`
  },
  'aloo-palak': {
    title: 'Aloo Palak Subzi',
    url: 'https://app.notion.com/p/133e4e7470e58011aa46c5e5786f8cdf',
    copy: `Boil potatoes one side. For blanching, chopped palak in hot water and then add them in ice chilled water.
Chill the leaves well. Cut the boiled potatoes and put them in water, add salt.
Chop garlic. Now in hot pan, add oil, hing, crushed coriander and cumin seeds and garlic chopped with aloo.
Add spices - the holy trifecta and a little water. Then add green palak leaves and over top of the palak paste. Add salt as per taste. Cook still this and creamy. Add the tadka separately, dry fenugreek, red chilli whole, garlic, cumin.`
  },
  'pudina-gravy': {
    title: 'Pudina Coriander Gravy with paneer/chicken',
    url: 'https://app.notion.com/p/292e4e7470e580a2b071de1b4ad31119',
    copy: `1. In a mixer - put garlic cubes, ginger pieces, Pudina and coriander - significant amount (two bunches), kaju, dahi, chili garlic paste, a little water
2. in pan, put oil, onion - cook till golden brown. and add the grind paste to it
3. Add salt, garam masala and paneer. good till done`
  },
  'oats-besan': {
    title: 'Oats/Besan Chilla ',
    url: 'https://app.notion.com/p/140e4e7470e580e1aa69ecbb0d9d9723',
    copy: `Make Oats/Besan - plain with water.
Add besan to oats and mix well.
Add onion, salt, bell peppers and mix.
Use tawa and on oil, cook it.`
  },
  'broccoli-soup': {
    title: 'Broccoli Cheddar Soup with miso paste',
    url: 'https://app.notion.com/p/16be4e7470e5802f92defc1d8f0cfd8b',
    copy: `Here’s a **healthy broccoli cheddar soup recipe** with a unique twist using **miso paste**, which adds depth of flavor and makes it extra nourishing—perfect for combating a cold.
**Broccoli Cheddar Miso Soup**
**Ingredients (Serves 4):**
•	**Broccoli**: 2 medium heads, cut into florets
•	**Carrots**: 1 large, grated or finely chopped
•	**Onion**: 1 medium, finely chopped
•	**Garlic**: 2 cloves, minced
•	**Vegetable Broth**: 4 cups (low sodium)
•	**Milk**: 1 cup (or unsweetened non-dairy milk like almond or oat)
•	**Cheddar Cheese**: 1 cup, grated (use sharp cheddar for extra flavor)
•	**Miso Paste**: 2 tbsp (white or yellow miso)
•	**Olive Oil or Butter**: 1 tbsp
•	**Salt and Black Pepper**: To taste
•	**Optional Toppings**: Croutons, chopped green onions, or extra grated cheese.
**Instructions:**
1.	**Sauté the Aromatics**:
•	In a large pot, heat olive oil or butter over medium heat. Add chopped onion and garlic. Sauté until translucent, about 3-4 minutes.
2.	**Cook the Vegetables**:
•	Add the grated carrot and broccoli florets. Stir and cook for 5 minutes until slightly softened.
3.	**Add Broth and Simmer**:
•	Pour in the vegetable broth and bring to a boil. Reduce heat to a simmer and cook until the broccoli is tender, about 10-12 minutes.
4.	**Blend the Soup**:
•	Use an immersion blender to puree the soup until smooth, or leave it slightly chunky if you prefer texture. (You can also blend in batches using a countertop blender—just be careful with the hot liquid.)
5.	**Add Miso and Milk**:
•	In a small bowl, mix miso paste with a ladle of hot soup broth to dissolve it fully. Stir the miso mixture back into the soup along with the milk. Heat gently but do not let it boil, as boiling can diminish the flavor of miso.
6.	**Incorporate the Cheese**:
•	Stir in the grated cheddar cheese until melted and well combined. Taste and adjust seasoning with salt and pepper as needed.
7.	**Serve and Garnish**:
•	Ladle the soup into bowls and garnish with croutons, green onions, or additional cheese if desired.
**Why This Soup is Great for a Cold:**
•	**Broccoli**: Packed with vitamin C and antioxidants to boost immunity.
•	**Garlic and Onion**: Natural anti-inflammatory and antibacterial properties.
•	**Miso Paste**: Rich in probiotics, which can support gut health and immunity.
•	**Cheddar and Milk**: Provide warmth and comfort, along with protein.
Enjoy this warm, nourishing soup, and feel better soon! Let me know if you’d like any variations.`
  },
  'overnight-oats': {
    title: 'Overnight Oats',
    url: 'https://app.notion.com/p/140e4e7470e5808bbf58e824d692e679',
    copy: `1. Mix rolled oats, cacao powder, honey, chia seeds, salt, shot of espresso and some milk.
2. Mix it all well. Refrigerate it overnight.
3. Put toppings of your choice next morning and enjoy.`
  },
  'dal-palak': {
    title: 'Dal Palak',
    url: 'https://app.notion.com/p/144e4e7470e580cab1c1c596b662cd56',
    copy: `soak tur daal for 2hrs, if you dnt hv time them soak in little hot water for 1 hr, then put it for boil, add chopped palak once daal half cook n add small cut tomato, haldi, garlic, salt, red chilli powder n let it boil withing few mnts it will be done, lastly oil n rai tadaka`
  },
  'egg-fried-rice': {
    title: 'Spring Onion and Egg Fried Rice',
    url: 'https://app.notion.com/p/14ce4e7470e580f98769fcde0ae33776',
    copy: `•	**Key Ingredients**: Cooked rice, eggs, spring onions, soy sauce, and sesame oil.
•	**Method**: Scramble eggs, add cooked rice, soy sauce, and chopped spring onions. Toss everything together for a quick and flavorful meal.`
  },
  dhokla: {
    title: 'Dhokla',
    url: 'https://app.notion.com/p/140e4e7470e58000970edbed12622f54',
    copy: `Besan, salt, sugar, turmeric - Mix.
Water - to get creamy batter, NO LUMPS.
Grease cake tin with oil
Add a little eno salt - to batter after 5 mins. Mix. Becomes foamy.
Pour in tin.
Steam cook it. Take pan, add water a bit, put stand and let it boil. Place tin on the stand inside pan. 20 mins on low medium flame.
Pan - oil, rai, green chilli, curry leaves, water, salt, sugar - keep mixing. Boil water. 1/2 lemon juice.
Pour the water solution on dhokla. Let it be for 10 mins and done.`
  },
  'vietnamese-pizza': {
    title: 'Vietnamese Pizza',
    url: 'https://app.notion.com/p/142e4e7470e580dbbb25ee1172c0e1ff',
    copy: `Add a sheet of rice paper to non-stick pan.
Add chilli oil, mix scallions and egg in the center and whisk it.
Spread it evenly.
Add salt and hot sauce or some or any kind of taste inducing sauces.`
  },
  'baingan-bharta': {
    title: 'Baingan Bharta',
    url: 'https://app.notion.com/p/17ae4e7470e58034a344ca40651182c6',
    copy: `**1. Roast the Eggplants:**
•	Wash and dry the eggplants. Prick them with a fork or knife in several places to ensure even cooking.
•	Roast them over an open flame (or in an oven at 225°C for 20-30 minutes) until the skin is charred and the flesh is soft.
•	Let them cool slightly, then peel off the charred skin and mash the flesh.
**2. Prepare the Masala:**
•	Heat oil in a pan. Add cumin seeds and let them splutter.
•	Add minced garlic, ginger, and green chilies. Sauté for a minute until fragrant.
•	Add onions and cook until golden brown.
•	Add turmeric, red chili powder, and coriander powder. Cook for another minute.
**3. Add Tomatoes:**
•	Stir in the chopped tomatoes and cook until they turn soft and the oil separates from the mixture.
**4. Combine and Cook:**
•	Add the mashed eggplant to the pan. Mix well with the masala.
•	Season with salt and cook for 5-7 minutes, stirring occasionally.
**5. Finish with Flavor:**
•	Stir in garam masala and chopped cilantro.
•	Cook for another minute and remove from heat.`
  },
  'palak-paneer': {
    title: 'Palak Paneer',
    url: 'https://app.notion.com/p/142e4e7470e580b4b818c4293c3a0cf6',
    copy: `Boil spinach with milk in cooker. Boil tomatoes in pan.
Cut onion and green chili and grind that first.
In another pan - Oil + cinnamon + pepper. Add onion paste. Let cook.
Grind tomatoes - add in the main pan.
Grind spinach - add in the main pan.
Add salt and garam masala. And then paneer.`
  },
  'mushroom-ghee': {
    title: 'Mushroom Ghee Roast Subzi',
    url: 'https://app.notion.com/p/1d5e4e7470e580709c22d8e9cc41420b',
    copy: `Mushroom Ghee Roast
The Hatke Sabzi recipe that you NEED to make 🔥
Recipe:
Ingredients:
5 to 8 Cloves of Garlic
8 to 10 Cashews
5 to 6 Kashmiri Dried Red Chillies
1 TBSP Tamarind Pulp
1/2 to 1 TBSP Sugar/Jaggery
250 GMs Mushrooms
1 TSP Jeera Powder
1 TSP Coriander Powder
1/2 TSP Pepper
A Pinch Of Turmeric
Salt To Taste
2 TBSP Ghee
6 to 8 Curry Leaves
1 TBSP Fresh Coriander
Step by Step Recipe
- Blend Cashews, Kashmiri Chillies, Garlic, Tamarind Pulp and Sugar with some water to form a smooth paste. (soak the cashews for a few minutes in hot water if possible)
In a pan, add 1 TBSP Ghee and sliced mushrooms, saute for 4 to 5 minutes until they are well cooked. Transfer to a bowl
In the same pan, add 1 TBSP Ghee and the blended paste, and the spices, cook for 4 to 6 minutes and keep stirring. Add some water if required.
Add the curry leaves and mix.
Add the cooked mushrooms and combine it well with the gravy, add water based on the consistency you want and cook well.
Top with fresh coriander and serve with roti or paratha.`
  },
  pasta: {
    title: 'Pasta',
    url: 'https://app.notion.com/p/133e4e7470e5808088e6c8daf87c08db',
    copy: `Boil Pasta.
In a pan - add butter + garlic + spices like red chili flakes, oregano. Add olives. Cook.
Add Pasta. And pour olive oil on top. (can also add wine.)
In red or white sauce, make sauce first, and then put pasta. (add veggies or meat, if you want.)`
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
    document.querySelector('#restaurants')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
