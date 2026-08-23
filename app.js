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
    copy: `Saute in butter:
Green chillies, Onion, Bell peppers, Broccoli
Add salt and then vegetable broth
Let it come to a boil
Add peanut butter, a splash of milk and gochujang
Reduce, reduce, reduce
Servvvvve!`
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
    title: 'Broccoli Cheddar Soup with miso paste',
    url: 'https://app.notion.com/p/16be4e7470e5802f92defc1d8f0cfd8b',
    copy: `Here’s a healthy broccoli cheddar soup recipe with a unique twist using miso paste, which adds depth of flavor and makes it extra nourishing—perfect for combating a cold.
Broccoli Cheddar Miso Soup
Ingredients (Serves 4):
• Broccoli: 2 medium heads, cut into florets
• Carrots: 1 large, grated or finely chopped
• Onion: 1 medium, finely chopped
• Garlic: 2 cloves, minced
• Vegetable Broth: 4 cups (low sodium)
• Milk: 1 cup (or unsweetened non-dairy milk like almond or oat)
• Cheddar Cheese: 1 cup, grated (use sharp cheddar for extra flavor)
• Miso Paste: 2 tbsp (white or yellow miso)
• Olive Oil or Butter: 1 tbsp
• Salt and Black Pepper: To taste
• Optional Toppings: Croutons, chopped green onions, or extra grated cheese.
Instructions:
1. Sauté the Aromatics:
• In a large pot, heat olive oil or butter over medium heat. Add chopped onion and garlic. Sauté until translucent, about 3-4 minutes.
2. Cook the Vegetables:
• Add the grated carrot and broccoli florets. Stir and cook for 5 minutes until slightly softened.
3. Add Broth and Simmer:
• Pour in the vegetable broth and bring to a boil. Reduce heat to a simmer and cook until the broccoli is tender, about 10-12 minutes.
4. Blend the Soup:
• Use an immersion blender to puree the soup until smooth, or leave it slightly chunky if you prefer texture. (You can also blend in batches using a countertop blender—just be careful with the hot liquid.)
5. Add Miso and Milk:
• In a small bowl, mix miso paste with a ladle of hot soup broth to dissolve it fully. Stir the miso mixture back into the soup along with the milk. Heat gently but do not let it boil, as boiling can diminish the flavor of miso.
6. Incorporate the Cheese:
• Stir in the grated cheddar cheese until melted and well combined. Taste and adjust seasoning with salt and pepper as needed.
7. Serve and Garnish:
• Ladle the soup into bowls and garnish with croutons, green onions, or additional cheese if desired.
Why This Soup is Great for a Cold:
• Broccoli: Packed with vitamin C and antioxidants to boost immunity.
• Garlic and Onion: Natural anti-inflammatory and antibacterial properties.
• Miso Paste: Rich in probiotics, which can support gut health and immunity.
• Cheddar and Milk: Provide warmth and comfort, along with protein.
Enjoy this warm, nourishing soup, and feel better soon! Let me know if you’d like any variations.`
  },
  'dal-dhokli': {
    title: 'Dal Dhokdi',
    url: 'https://app.notion.com/p/369e4e7470e58028a248d18ac8e2dc34',
    copy: `THE DAL - 
Tur dal - soak for 4-5 hours first. 
Pressure cook the dal. Then blend it a little with a hand blender, make sure its a bit thin. 
Then put dhana jeeru, red mirchi, haldi, salt, imli paste, jaggery, crush ginger.
Separately, in ghee waghar - use rai, green chili cut, curry leaves and hing. and then add it to the dal. 
THE DHOKDI - 
Wheat atta - add ajwain, hing, haldi, red mirchi, salt, oil. 
Make very thin rotis - DON’T COOK! KEEP THEM RAW! 
Once dal is ready, cut the roti into pieces and put them in the BOILING DAL and KEEP STIRRING TO ENSURE THEY DO NOT STICK TOGETHER.`
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
  },
  'egg-fried-rice': {
    title: 'Spring Onion and Egg Fried Rice',
    url: 'https://app.notion.com/p/14ce4e7470e580f98769fcde0ae33776',
    copy: `Key ingredients
Cooked rice, eggs, spring onions, soy sauce and sesame oil.

Method
Scramble the eggs, then add cooked rice, soy sauce and chopped spring onions. Toss everything together and serve.`
  },
  'paneer-peppers': {
    title: 'Paneer Bell Peppers',
    url: 'https://app.notion.com/p/133e4e7470e5801daca1ee574db7b5fc',
    copy: `Cut onions, bell peppers in big slices.
Pan - oil + cardammom + cloves + cinnamon + onion and bell peppers.
Add cut tomatoes and cover it.
Add dhania, red chilli and turmeric. And then paneer.`
  },
  'nawabi-chicken': {
    title: 'Quick Nawabi Malai Chicken',
    url: 'https://app.notion.com/p/1e4e4e7470e58027a920f4a16f0bd64a',
    copy: `30-Minute and effortless Nawabi Malai Chicken
Ingredients:
For the Marinade/Gravy Base:
3-4 green chilies (adjust to taste)
10-12 cashews
1/2 cup plain yogurt
1 tbsp Kashmiri red chili powder
1 tsp coriander powder
1 tsp onion powder
1 tsp red chili powder
1/2 tsp cardamom powder
1 tsp garam masala powder
1 tbsp ginger garlic paste
2 tbsp fresh cream
1 tbsp coconut powder (or grated coconut)
Salt to taste
1 tsp cumin powder
For Cooking:
1 lb (450g) boneless chicken, cut into large pieces
2 tbsp oil
1 medium onion, finely chopped
2 tbsp tomato ketchup
Pinch of sugar
1 tbsp kasoori methi (dried fenugreek leaves)
Instructions:
Prepare the Marinade:
In a blender, combine the green chilies, cashews, yogurt, Kashmiri red chili powder, coriander powder, onion powder, red chili powder, cardamom powder, garam masala powder, ginger garlic paste, fresh cream, coconut powder, salt, and cumin powder.
Blend into a smooth paste.
Marinate the Chicken:
Coat the boneless chicken pieces with the prepared marinade. Ensure each piece is evenly covered.
Let it marinate for 10-15 minutes while you prepare the curry.
Cook the Chicken:
Heat oil in a large pan over medium heat. Add the finely chopped onions and sauté until they turn light golden brown.
Add the marinated chicken along with all of the marinade paste into the pan. Mix well.
Cover and cook for about 15 minutes on medium heat, stirring occasionally. The chicken will cook in its own juices, and the oil will start separating from the gravy.
Finish the Curry:
Once the oil starts to ooze out and the curry darkens, add 2 tablespoons of tomato ketchup and a pinch of sugar. Stir well.
Sprinkle kasoori methi (crush it between your palms before adding) and mix it into the gravy.
Let it cook on medium-low heat for another 5 minutes until the flavors meld together.
Serve:
Once done, the Nawabi Malai Chicken is ready to serve. Enjoy it with naan or rice for a delicious meal!
Tips:
You can also add a bit of red/orange food color for extra dark color of the gravy`
  },
  'vietnamese-pizza': {
    title: 'Vietnamese Pizza',
    url: 'https://app.notion.com/p/142e4e7470e580dbbb25ee1172c0e1ff',
    copy: `Place one sheet of rice paper in a non-stick pan. Add chilli oil, scallions and an egg in the centre, then whisk and spread it evenly. Season with salt and hot sauce and cook until crisp.`
  },
  'chicken-kebab': {
    title: 'Chicken Kebab',
    url: 'https://app.notion.com/p/14ce4e7470e58034be45eb927df6733f',
    copy: `Mix chicken mince with onion, tomato, green chilli, spring onion, coriander, ginger-garlic paste, salt, chilli, crushed cumin and coriander seeds, anardana, garam masala, chilli flakes and one egg. Rest for 30 minutes.

Shape into patties and shallow-fry over medium-low heat for 5 to 6 minutes per side. Serve with mint chutney, onion and lemon.`
  },
  'japanese-eggs': {
    title: 'Japanese Fried Eggs',
    url: 'https://app.notion.com/p/140e4e7470e58056bb2fe3ba2ce8355d',
    copy: `Make sunny side ups. 
In pan, add ginger, vinegar, garlic, soy sauce. Dip eggs in these.`
  },
  'med-yogurt': {
    title: 'Mediterranean Yogurt Dip',
    url: 'https://app.notion.com/p/143e4e7470e580cea8eff33534780bc0',
    copy: `Combine chopped garlic, bell peppers, cilantro, chilli flakes, olives, paprika and salt, then pour hot olive oil over the mixture. Spread plain yogurt on a plate and spoon the dressing on top.`
  },
  'oats-chilla': {
    title: 'Oats/Besan Chilla',
    url: 'https://app.notion.com/p/140e4e7470e580e1aa69ecbb0d9d9723',
    copy: `Mix oats and besan with water. Add onion, bell peppers and salt. Cook the batter on an oiled tawa until set and browned on both sides.`
  },
  'baigan-bhaat': {
    title: 'Baigan Bhaat',
    url: 'https://app.notion.com/p/133e4e7470e580a29a56f1626f6c96ab',
    copy: `Pressure-cook rice and brinjal until soft. Mash the brinjal and combine it with the rice, curd, turmeric, garlic, ginger-chilli paste and salt. Heat through, adding water if needed. Finish with a mustard-seed and red-chilli tempering.`
  },
  harira: {
    title: 'Harira, Moroccan Soup',
    url: 'https://app.notion.com/p/144e4e7470e580e1b894e4f188adcb08',
    copy: `For the vegetarian version, cook onion, garlic, tomato paste and spices in olive oil. Add celery, crushed tomatoes, chickpeas, green lentils and broth. Simmer until tender.

Stir in a smooth flour-and-water mixture plus rice or vermicelli. Cook until thick but pourable, then finish with parsley or cilantro and lemon.`
  },
  'aloo-palak': {
    title: 'Aloo Palak Subzi',
    url: 'https://app.notion.com/p/133e4e7470e58011aa46c5e5786f8cdf',
    copy: `Boil the potatoes. Blanch chopped spinach in hot water, move it to ice water and drain well.

Cook garlic, hing, crushed coriander and cumin seeds in oil. Add potatoes and spices with a little water, then add the spinach and cook until creamy. Finish with a tempering of dry fenugreek, whole red chilli, garlic and cumin.`
  },
  'thecha-paneer': {
    title: 'Thecha Paneer',
    url: 'https://app.notion.com/p/16be4e7470e58056b60ad7a2e6a74025',
    copy: `Recipe - 
1. Add oil and fry paneer on both sides
2. Same pan - add oil and add 2 tbsp cumin seeds, lot of garlic, green chillies, seasame seeds, dry coconut and fresh coriander, cook for 2-3 minutes
3. Transfer this in grinder and make paste
4. In pan - add sliced onion, cook until golden brown, add paste, cook and add some water then to mix it well
5. add haldi, coriander powder and salt
6. Add friend paneer and fresh green chillis
7. add garam masala and garnish with fresh coriander`
  },
  'chia-pudding': {
    title: 'Chia Seed Pudding',
    url: 'https://app.notion.com/p/140e4e7470e580f9b5a7f62baaf5782a',
    copy: `Add chia seeds and coconut milk to a bowl with grated cinnamon and nutmeg. Add maple syrup and a pinch of salt, mix well and let it sit overnight.`
  },
  'beer-chicken': {
    title: 'Spicy Beer-Braised Chicken with Mushrooms',
    url: 'https://app.notion.com/p/1b1e4e7470e580d287ead5e241d16412',
    copy: `Season chicken with salt, pepper and smoked paprika. Sear in oil for 3 to 4 minutes per side, then set aside.

Brown sliced mushrooms, then add onion, garlic and ginger. Stir in gochujang, cumin, garam masala and turmeric. Add beer, broth, soy sauce, honey and mustard.

Return the chicken. Cover and simmer on low for 20 to 25 minutes, then uncover and reduce for about 5 minutes. Finish with coriander and serve with brown rice.`
  },
  'pineapple-curry': {
    title: 'Pineapple Coconut Curry',
    url: 'https://app.notion.com/p/1d5e4e7470e5802883becb86b8fadcd3',
    copy: `Marinate 200 g pineapple for 5 to 10 minutes with chopped curry leaves, red chilli powder, turmeric and salt.

In coconut oil, cook chopped garlic, ginger, green chillies and curry leaves. Lower the heat and add 2 cups coconut milk, 1 tsp turmeric and 1 tsp rice flour while stirring. Add salt and 1 to 2 tsp lemon juice and cook until thick.

Cook the pineapple separately in coconut oil with coriander. Add it to the curry for the final minute and serve with hot rice.`
  },
  'cabbage-kootu': {
    title: 'Caabage Kootu',
    url: 'https://app.notion.com/p/1e4e4e7470e58016a1a8ce94baec18f9',
    copy: `Ingredients 1x2x3x
• ½ small head cabbage (about four cups chopped), finely chopped
• ½ cup toor dal (split pigeon peas, also called toor dal or arhar dal)
• ¼ teaspoon turmeric
• About 10-15 curry leaves (one sprig approximately)
• 3 tablespoon shredded coconut (or ½ cup coconut milk. Fresh or canned are both good)
• 1 teaspoon coconut oil (divided)
• 1 teaspoon mustard seeds
For the masala:
• 1 tablespoon coriander seeds
• 1 teaspoon cumin seeds
• 1 tablespoon urad dal (black gram dal)
• 1 tablespoon chana dal (Bengal gram dal)
• 1 dry red chili pepper (like arbol pepper or Kashmiri chili pepper. Use more or less based on your tolerance for heat)
• 1 teaspoon black peppercorns
Instructions
• Pressure-cook the split yellow peas and cabbage with enough water to cover and turmeric. If you use an Indian pressure cooker that "whistles" allow the lentils to cook for three whistles. If cooking in a saucepan, cover by an inch of water and cook 30 minutes or until the dal is really soft. If cooking in an Instant Pot, set the pressure to high for 15 minutes.
• Heat ½ teaspoon of the oil and add the masala ingredients. Fry them until the dals turn golden, remove to a blender, and grind into a smooth paste along with coconut or coconut milk.
• Heat the remaining oil in a saucepan. Add the mustard seeds and curry leaves and when the mustard sputters, add the dal and masala and mix. Add water if too thick.
• Bring the dal to a boil, lower the heat to a simmer, and cook for another five minutes. Add salt to taste.
• Serve hot with rice and papad.`
  },
  'aloo-gobi': {
    title: 'Aloo gobi / Aloo Matar gobi',
    url: 'https://app.notion.com/p/142e4e7470e580c197bed7ae4d1aaa67',
    copy: `Cut cauliflower, potatoes. or cabbage. 
In a pan - Oil + rai + green chili + hing. And add the sliced veggies. Add water and cover it. 
When soft, add turmeric, dhania and salt. 
Cook more and add cilantro.`
  },
  'moms-mix-dal': {
    title: 'Mom’s Mix dal',
    url: 'https://app.notion.com/p/180e4e7470e580eeab35c165578549c7',
    copy: `1. Mix masur, tur, and yellow mung dal and boil it. 
2. Separately, in waghar - with ghee, add cinnamon, clove, pepper powder. Let it fry a bit, then jeera, curry leaves, hing, haldi, a bit red chilli powder and immediately add to the dal
3. add salt and let it simmer.`
  },
  'potato-eggs': {
    title: 'Potato Eggs',
    url: 'https://app.notion.com/p/142e4e7470e580419c93d156659d8309',
    copy: `Cut potatoes, green chili. In pan, put that with curry leaves, hing and jeera. 
Add water and cover it. 
Add salt and turmeric when soft. 
Add eggs.`
  },
  'dal-fry': {
    title: 'Dal Fry - Tur/Masoor or mix',
    url: 'https://app.notion.com/p/134e4e7470e58034879bedf4ec211f7b',
    copy: `1- Rinse the dal (I used mix of toor and masoor) and transfer to an instant pot or pressure cooker. Add 1/2 teaspoon turmeric, 1/2 teaspoon salt and 3 cups water. Stir.
2- Boil the dal using either-
Instant Pot: cook on high pressure for 8 minutes with natural pressure release.
Stove-top pressure cooker: cook for 4 to 5 whistles on high then lower the heat and let it cook for 3 to 4 minutes. Set aside.
3- Heat oil in a pan on medium heat. Once hot, add the cumin seeds and let them sizzle. Then add dried red chili and hing and saute for few seconds.
4- Add onions (also add 1/4 teaspoon salt for the onions to cook faster) and cook for around 4 minutes until soft and light golden brown in color.
5- Add crushed garlic-ginger and sliced green chili. Cook for 1-2 minutes until the raw smell goes away.
6- Add chopped tomatoes and stir.
7- Then add the garam masala, red chili powder and mix. Cook for 6 to 7 minutes until tomatoes are very soft and cooked and oil oozes from the side of the masala.
8- This step is important, don’t rush it. Stir in between and I also added around 2 tablespoon water so that the masala doesn’t burn.
9- Now add the boiled dal to the pan and mix. Add water to thin out the dal at this pont, I added 1 cup water here, you can add as per your taste.
10- Add kasuri methi,
11- Also add the chopped cilantro. Add the remaining 1/4 teaspoon salt and mix.
12- Let the dal simmer for 3 to 4 minutes on low-medium heat.
You can serve the dal at this step or do the extra step of giving it a smokey flavor (dhungar method).
*Dhungar Method (Optional)*
13- For the dhungar method, place a steel bowl on top of the dal. Meanwhile heat a piece of charcoal over direct heat until it’s red hot.
14- Place hot charcoal in that steel bowl on top of trivet. Pour oil on top of charcoal. You will immediately see fumes coming out of charcoal.
15- Immediately close the pot with a lid. Let it remain like this for 5 to 10 minutes.
16- Then open the lid and remove the bowl from dal.
The longer you keep the lid closed, the smokier dal will get, so don’t do more than 10 minutes. I did for 7 minutes.`
  },
  chole: {
    title: 'Chole',
    url: 'https://app.notion.com/p/29ee4e7470e5804ca6a2fc128a5955ce',
    copy: `1. Overnight chana dal soak
2. In a handkerchief put - tea dried, cinnamon, big and small elaichi (only one big), cloves, whole pepper. Tie it in and put it in the cooker with chana dal. Put amla dried separately with the chana dal. 
3. In pan, oil - let it heat. then add tomato.
4. Add red chili powder, chole powder. let it cook. (chole powder, 2 spoons). then add ginger
5. add the chole, then add salt and let it simmer. 
simple and done.`
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
