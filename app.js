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
  },
  'japanese-eggs': {
    title: 'Japanese Fried Eggs',
    url: 'https://app.notion.com/p/140e4e7470e58056bb2fe3ba2ce8355d',
    copy: `Make sunny side ups.
In pan, add ginger, vinegar, garlic, soy sauce. Dip eggs in these.`
  },
  'caabage-kootu': {
    title: 'Caabage Kootu',
    url: 'https://app.notion.com/p/1e4e7470e58016a1a8ce94baec18f9',
    copy: `### Ingredients 1x2x3x
- ½ small head cabbage (about four cups chopped), finely chopped
- ½ cup toor dal (split pigeon peas, also called toor dal or arhar dal)
- ¼ teaspoon turmeric
- About 10-15 curry leaves (one sprig approximately)
- 3 tablespoon shredded coconut (or ½ cup coconut milk. Fresh or canned are both good)
- 1 teaspoon coconut oil (divided)
- 1 teaspoon mustard seeds
### For the masala:
- 1 tablespoon coriander seeds
- 1 teaspoon cumin seeds
- 1 tablespoon urad dal (black gram dal)
- 1 tablespoon chana dal (Bengal gram dal)
- 1 dry red chili pepper (like arbol pepper or Kashmiri chili pepper. Use more or less based on your tolerance for heat)
- 1 teaspoon black peppercorns
### Instructions
- Pressure-cook the split yellow peas and cabbage with enough water to cover and turmeric. If you use an Indian pressure cooker that "whistles" allow the lentils to cook for three whistles. If cooking in a saucepan, cover by an inch of water and cook 30 minutes or until the dal is really soft. If cooking in an Instant Pot, set the pressure to high for 15 minutes.
- Heat ½ teaspoon of the oil and add the masala ingredients. Fry them until the dals turn golden, remove to a blender, and grind into a smooth paste along with coconut or coconut milk.
- Heat the remaining oil in a saucepan. Add the mustard seeds and curry leaves and when the mustard sputters, add the dal and masala and mix. Add water if too thick.
- Bring the dal to a boil, lower the heat to a simmer, and cook for another five minutes. Add salt to taste.
- Serve hot with rice and papad.`
  },
  'hyderabadi-red-chicken': {
    title: 'Hyderabadi Red Chicken',
    url: 'https://app.notion.com/p/1d5e7470e580a3b74edf9426146953',
    copy: `Recipe:
Step 1: Marination
1. Take 1kg chicken and thoroughly wash and cut into medium pieces.
2. Grind 15 almonds + 15 cashews + half cup coconut powder. Grind it with a bit of water or yoghurt into a smooth paste and add it to the chicken.
3. Add salt, 250 gm yoghurt, ginger garlic paste 3 tbsp, black pepper powder 2 tsp, red chilli powder 2 tsp, garam masala 2tsp,
turmeric powder 1/2 tsp, juice of a lemon, red chilli sauce 2 tbsp, green chilli sauce 2tbsp, soy sauce 1 tbsp,
4-5 whole/slit green chillies, ghee 2tbsp, 2 large onions fried, mint and cilantro chopped.
4. Set aside to marinate for 2 hours or overnight.
Step 2: Cooking
1. To a pan add some oil and transfer the chicken and cook on medium-high flame for 5-7 minutes while stirring frequently.
2. Cover the lid and cook on a low flame for around 30 more minutes or until the chicken is tender and the oil seperates.
3. Add 1-2 tbsp heavy cream and garnish with chopped cilantro.
4. Serve with naan!`
  },
  'paneer-bell-peppers': {
    title: 'Paneer Bell Peppers',
    url: 'https://app.notion.com/p/133e4e7470e5801daca1ee574db7b5fc',
    copy: `Cut onions, bell peppers in big slices.
Pan - oil + cardammom + cloves + cinnamon + onion and bell peppers.
Add cut tomatoes and cover it.
Add dhania, red chilli and turmeric. And then paneer.`
  },
  'potato-eggs': {
    title: 'Potato Eggs',
    url: 'https://app.notion.com/p/142e4e7470e580419c93d156659d8309',
    copy: `Cut potatoes, green chili. In pan, put that with curry leaves, hing and jeera.
Add water and cover it.
Add salt and turmeric when soft.
Add eggs.`
  },
  'moms-mix-dal': {
    title: "Mom's Mix dal",
    url: 'https://app.notion.com/p/180e4e7470e580eeab35c165578549c7',
    copy: `1. Mix masur, tur, and yellow mung dal and boil it.
2. Separately, in waghar - with ghee, add cinnamon, clove, pepper powder. Let it fry a bit, then jeera, curry leaves, hing, haldi, a bit red chilli powder and immediately add to the dal
3. add salt and let it simmer. `
  },
  'thai-red-curry': {
    title: 'Thai Red Curry',
    url: 'https://app.notion.com/p/133e4e7470e58098818cefae99f2fab8',
    copy: `### Thai Red Curry Paste Recipe
### Step-by-Step Process:
1. **Toast spices:** In a dry skillet, toast cumin and coriander seeds until fragrant. Remove from heat and let cool.
2. **Grind spices:** Using a spice grinder or mortar and pestle, grind the toasted spices into a fine powder.
3. **Prepare aromatics:** Roughly chop shallots, garlic, and lemongrass. Deseed and chop red chilies.
4. **Blend ingredients:** In a food processor, combine ground spices, chopped aromatics, ginger, lime zest, miso paste, and a pinch of salt.
5. **Process:** Pulse the mixture, gradually adding a small amount of neutral oil to help it blend smoothly.
6. **Adjust consistency:** Continue blending until you achieve a smooth, thick paste-like consistency.
7. **Taste and adjust:** Taste the paste and adjust seasoning if needed. Add more chilies for heat or lime zest for brightness.

### Step-by-Step Process:
1. **Prepare ingredients:** Chop all vegetables and protein. Have all ingredients measured and ready.
2. **Heat the pan:** In a large skillet or wok, heat coconut oil over medium heat.
3. **Sauté aromatics:** Add onion, garlic, and ginger. Cook until fragrant and onion is translucent, about 3-4 minutes.
4. **Add curry paste:** Stir in the Thai red curry paste and cook for 1-2 minutes until fragrant.
5. **Pour in liquids:** Add coconut milk and broth. Stir to combine and bring to a simmer.
6. **Cook protein:** Add your chosen protein (chicken, tofu, or shrimp) and simmer until cooked through.
7. **Add vegetables:** Stir in bell pepper, zucchini, and bamboo shoots. Simmer for 5-7 minutes until vegetables are tender-crisp.
8. **Finish:** Remove from heat and stir in fresh basil leaves.
9. **Serve:** Ladle the curry over steamed rice and serve with lime wedges on the side.`
  },
  'dosa-batter': {
    title: 'Dosa Batter',
    url: 'https://app.notion.com/p/140e4e7470e5800d959df89ef31a321c',
    copy: `With a 3:1 ratio - rice grains and Urad dal.
Mix it in the grinder with water to it.
Add a little bit of methi to it.`
  },
  'thai-veggie-soup': {
    title: "Saumya's Thai Veggie Soup",
    url: 'https://app.notion.com/p/22be4e7470e580039f01ff9aa52fd168',
    copy: `Saute in butter:
Green chillies, Onion, Bell peppers, Broccoli
Add salt and then vegetable broth
Let it come to a boil
Add peanut butter, a splash of milk and gochujang
Reduce, reduce, reduce
Servvvvve!`
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
  'dal-dhokdi': {
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
  chole: {
    title: 'Chole',
    url: 'https://app.notion.com/p/29ee4e7470e5804ca6a2fc128a5955ce',
    copy: `1. Overnight chana dal soak
2. In a handkerchief put - tea dried, cinnamon, big and small elaichi (only one big), cloves, whole pepper. Tie it in and put it in the cooker with chana dal. Put amla dried separately with the chana dal.
3. In pan, oil - let it heat. then add tomato.
4. Add red chili powder, chole powder. let it cook. (chole powder, 2 spoons). then add ginger
5. add the chole, then add salt and let it simmer.
simple and done.`
  },
  'nawabi-malai-chicken': {
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
  'banana-protein-bread': {
    title: 'Healthy Banana Protein Bread (2 Options)',
    url: 'https://app.notion.com/p/1d5e4e7470e5808d9220cf8c8c88da58',
    copy: `OPTION 1 -
When banana bread and coffee get married...
✅Flourless
✅5 ingredients
✅SO EASY
Enjoy 😉
DB x
INGREDIENTS
▪️3 ripe bananas, mashed
▪️1 cup of peanut butter, pourable
▪️1 tsp baking powder
▪️2 eggs
▪️4 tsp instant coffee, mixed with 3 tbsp hot water
Chocolate chips, optional
METHOD
▪️Preheat oven to 180c
▪️In a bowl mix together all the ingredients
▪️Pour into a prepared loaf tin
▪️Top with more chocolate chips (optional)
▪️Bake for 30-35 minutes
OPTION 2 -
Ingredients:
- 2 eggs
- 3 bananas
- 1/4 cup any milk (we used 1% skim)
- 1 tsp vanilla extract
- 2 tsp coconut oil (or olive oil)
- 1 heaping cup flour (we use blended rolled oats for lower calorie)
- 2 scoops vanilla protein powder
- 1 tsp cinnamon
- 1 tsp baking powder
- 1/4 cup any sweetener (we use stevia brown sugar)
- 1/2 tsp salt
- 1/3 cup dark chocolate (cut from a bar or chips)
- optional: add 1/4 cup low calorie maple syrup for a sweeter banana bread
-
Baking Time: 350°F for 35-40 minutes. The centre should still be soft but firm.
-
Approx. 10 servings. 143 calories, 9g protein, 16g carbs, 6g fat per serving`
  },
  'lahori-dal': {
    title: 'Lahori Dal',
    url: 'https://app.notion.com/p/1d5e4e7470e580f59e60f974b72a7166',
    copy: `Lahsuni dal recipe:-
- In a pressure cooker take soaked masoor dal add ginger garlic green chillies salt , turmeric big elaichi dalchini and water & take 4 whistle.
- ⁠In a pan dry roast kasuri methi and take out let it cool down .
- ⁠In a same pan take desi ghee jeera ginger garlic paste tomatoes purée & roasted kasuri methi Garam masala now add cooked dal adjust the consistency and add the cream in last and cook for few minutes and enjoy !`
  },
  'hainanese-chicken-rice': {
    title: 'One Pot Rice Cooker Hainanese Chicken and Rice',
    url: 'https://app.notion.com/p/3e7e4e7470e5813c8cfce9aa766f63b9',
    copy: `## Ingredients
Chicken & Rice
- 14 oz chicken thighs, skinless, boneless, raw
- 1.5 tsp sesame oil
- 1/4 tsp salt
- 1.5 tbsp minced garlic
- 1 tbsp minced ginger
- 1 cup chicken bone broth
- 2/3 cups jasmine rice, uncooked/raw
- 1 tsp chicken bouillon powder
- 1 persian cucumber
- green onions, thinly sliced
Chili Sauce
- 1.5 tbsp minced garlic
- 2 tbsp sambal chili paste
- 2 tbsp sriracha
- 2 tbsp chicken broth
- 1 tbsp lime juice
- 1/2 tsp brown sugar
## Steps
1. Dice your cucumbers into thin circles and thinly slice your green onions.
2. Wash your uncooked rice clean.
3. In your rice cooker pot, add your minced garlic, minced ginger, chicken bone broth, chicken bouillon powder, and uncooked rice and mix.
4. Marinate your raw chicken with salt and sesame oil then add into your rice cooker pot.
5. Cook in your rice cooker for 30-35 minutes on your rice cooker's quick cook setting.
6. In a small bowl, mix together minced garlic, sambal chili paste, sriracha, chicken broth, lime juice, and brown sugar to make your sauce.
7. Once cooked, plate half your chicken, half your rice, half the chili sauce, and half your cucumbers and enjoy!
## Notes
Macros per 1 serving (recipe makes 2 servings): Protein 49g, Carbs 63g, Fat 12g, Calories 583.`
  },
  'mix-veg-bhindi': {
    title: 'Mix Veg / Bhindi',
    url: 'https://app.notion.com/p/133e4e7470e58071959ac1b1b4d8165b',
    copy: `Cut the veggies. Or Bhindi.
Pan - Oil + hing + green chili + Dhania + turmeric + red chili. Let cook.
Add the cut veggies or bhindi. Add salt and let it cook till soft.
(Bhindi needs more oil)
(Dum aloo is the same, except it needs to be boiled first and peeled.)`
  },
  'sprouts-subzi': {
    title: 'Sprouts subzi',
    url: 'https://app.notion.com/p/142e4e7470e5802b85d6f47f5791a47d',
    copy: `Water, sprouts in cooker. 3 whistles.
Cut onion and tomatoes meanwhile.
Pan - Oil + rai + jeera + hing + cut onions
After golden, put tomatoes and ginger garlic paste.
Add dhania, turmeric, red chilli.
Add sprouts and let cook.`
  },
  'baigan-bhaat': {
    title: 'Baigan Bhaat',
    url: 'https://app.notion.com/p/133e4e7470e580a29a56f1626f6c96ab',
    copy: `Take rice and brinjal and soften it in cooker.
Then crush the soft brinjal and add it in a big bowl with cooked rice and add half cup curd, haldi, garlic, ginger chilli paste, salt - heat all it.
In the end, rai and red chilli - heat separately and add on the top. Add water if needed.`
  },
  'masala-tikkis': {
    title: 'Masala Tikkis',
    url: 'https://app.notion.com/p/142e4e7470e5800ea03beb4982796cc9',
    copy: `1. Boil the potatoes and mash them. Add some butter, salt, pepper, egg, some flour, with spices as per you desire.
2. Refrigerate it.
3. Take it out and mash it like a dough, add some cheese to the center of it and shallow fry till golden brown.
This can also be fried by coating it in some flour, panko bread crumbs and egg wash.`
  },
  'thai-green-curry': {
    title: 'Thai Green Curry',
    url: 'https://app.notion.com/p/133e4e7470e58088a278d94d988b04fc',
    copy: `Basil, coriander, spring onion, lemon grass, peppercorns, coriander seeds, cumin seeds - in mixture with water to make paste.
Add veggies as per you want in another pan. Cook and simmer. Then transfer to the paste + coconut milk and add some salt. Ready`
  },
  poha: {
    title: 'Poha',
    url: 'https://app.notion.com/p/140e4e7470e580f89b20cabb354ac107',
    copy: `Take poha. Wash it.
Oil + Rai + cut green chili + curry leaves + hing + cut onions
Add tomatoes and peas.
After 3-5 mins add turmeric. And then poha, salt, sugar and lime. Finally, coriander.`
  },
  upma: {
    title: 'Upma',
    url: 'https://app.notion.com/p/133e4e7470e5805daf3fd9727e204a7a',
    copy: `Slice onions, green chilli, lemon.
Pan - oil + rai + chana dal + curry leaves + green chilli + hing. Then sliced onions
Cook well and then add rawa.
Separate utensil, boil water with salt and lemon juice in it. Once boiling, add to the main pan.
Cook till dal softens.`
  },
  'yellow-dal': {
    title: 'Yellow Dal',
    url: 'https://app.notion.com/p/142e4e7470e580b5ae8de322db579c34',
    copy: `Soak tur and chana dal overnight.
In cooker - put both and boil it for about 3-4 whistles.
Pan - Oil + Rai + curry leaves + hing + onion.
When golden, add dal and a little water. Keep stirring. Add red chili + turmeric + dhania and salt. Adjust consistency.`
  },
  'nani-laal-bateta': {
    title: "Nani's laal bateta nu shaak",
    url: 'https://app.notion.com/p/187e4e7470e580b78a2fea39fbf6484d',
    copy: `1. Cut potatoes like fries, long.
2. In Oil, add hing and then put the potato in it and after half-cooking it, add red mirchi and dhana jeeru and salt. That’s it and mix it well.`
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
  'butternut-squash-rice': {
    title: 'Butternut Squash with rice',
    url: 'https://app.notion.com/p/16be4e7470e580aa9d7ac14c2079a754',
    copy: `### INGREDIENTS (2-3 servings)
- 1 butternut squash, cut into ½ in (1cm) cubes
- ¼ cup (56.7g) butter
- 2 sage leaves, minced (plus 3 or 4 more for garnish)
- 3 cups (709ml) vegetable broth
- ½ yellow onion, finely diced
- 5oz (140g) arborio rice
- ½ cup (118ml) dry white wine
- ½ cup (45g) parmesan cheese, freshly grated
- Zest of 1 lemon
- Extra virgin olive oil
- Salt and pepper
Roast the butternut squash. Preheat oven to 425F (210C). Spread the cubes of butternut squash over the pan (make sure to oil the pan well to avoid squash from sticking). Drizzle olive oil, salt and pepper. Toss to coat evenly, then spread the cubes back over the pan so they all sit in a single layer. Roast for 15-20 minutes, or until squash cubes feel soft when poked
1. Brown the butter. Heat up butter over medium heat in a small pot (stainless steel works best so you can check the color). Continue to stir until butter turns brown. If bubbles appear, briefly take the pan off the heat. Bubbles are normal and it means water is evaporating! Butter is ready when brown bits appear and it begins to smell nutty
2. Cook the risotto. Add brown butter to a large saute over medium/low heat (reserve a spoonful to coat the risotto at the end). Add a drizzle of olive oil and mix. Add onion and cook until soft, about 7 minutes
3. Add risotto rice and minced sage leaves. Mix well to combine for 2 minutes
4. Add wine and stir
5. When wine is fully absorbed, add 1 ladleful of warm vegetable broth. Continue to stir until the broth is almost absorbed. Continue adding broth, one laderful at a time, allowing each ladle to be absorbed before adding more
6. Take a quarter of the roasted squash cubes (about 70g/2.5oz) and mash them using a fork. When there’s about a cup left of broth, add the butternut squash paste. Mix well to combine. Then add the butternut squash cubes (reserve 5-6 for garnish). Keep adding the broth until absorbed
7. Stir in the grated parmesan and lemon zest. Stir until the cheese is fully melted. Then, add a spoonful of the remaining brown butter. Stir well to combine, and season with salt and pepper if needed
8. The risotto is best when served immediately. Garnish with roasted butternut squash cubes. I like to add dried sage for garnish as well`
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
