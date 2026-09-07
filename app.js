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
  butternut: {
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
  },
  'paneer-angara': {
    title: 'Paneer Angara',
    url: 'https://app.notion.com/p/133e4e7470e58020af94ec4eefa63cb1',
    copy: `Roast paneer and cashews. Put them on the side.
Pan - Butter + bay leaf + cardommom + cinnamon + 2 cloves. Cook. Add onion. Add cashews.
Add ginger garlic paste. and tomatoes. Cook well. Grind the whole thing.
Put back in pan - add turmeric, dhania, red chili, garam masala. Add bell peppers.
Add the paneer and cashews. Add kasuri methi and salt. A little cream if you have.
(Add curd for a lighter creamier texture)`
  },
  'mix-veg': {
    title: 'Mix Veg / Bhindi',
    url: 'https://app.notion.com/p/133e4e7470e58071959ac1b1b4d8165b',
    copy: `Cut the veggies. Or Bhindi.
Pan - Oil + hing + green chili + Dhania + turmeric + red chili. Let cook.
Add the cut veggies or bhindi. Add salt and let it cook till soft.
(Bhindi needs more oil)
(Dum aloo is the same, except it needs to be boiled first and peeled.)`
  },
  sprouts: {
    title: 'Sprouts subzi',
    url: 'https://app.notion.com/p/133e4e7470e580758db5df1a6444390c',
    copy: `Water, sprouts in cooker. 3 whistles.
Cut onion and tomatoes meanwhile.
Pan - Oil + rai + jeera + hing + cut onions
After golden, put tomatoes and ginger garlic paste.
Add dhania, turmeric, red chilli.
Add sprouts and let cook.`
  },
  'beer-chicken': {
    title: 'Spicy Beer-Braised Chicken with Mushrooms',
    url: 'https://app.notion.com/p/1b1e4e7470e580d287ead5e241d16412',
    copy: `Here’s a **Spicy Beer-Braised Chicken with Mushrooms**—a unique, flavorful, and healthy dish with a rich, spicy sauce infused with beer. This recipe balances heat, umami, and depth from the beer and mushrooms while keeping the dish lean and nutritious.
**Spicy Beer-Braised Chicken with Mushrooms**
**Ingredients (Serves 3-4)**
**For the Chicken:**
• 500g (1 lb) chicken (cut into bite-sized pieces, bone-in or boneless)
• 1 tsp salt
• 1/2 tsp black pepper
• 1/2 tsp smoked paprika
• 1 tbsp oil (olive or avocado)
**For the Sauce:**
• 1 cup mushrooms (cremini or shiitake, sliced)
• 1 small onion (chopped)
• 3 cloves garlic (minced)
• 1-inch ginger (grated)
• 1 tbsp gochujang (or 1 tsp red chili flakes + 1 tsp tomato paste)
• 1 tsp cumin powder
• 1/2 tsp garam masala (or allspice)
• 1/2 tsp turmeric
• 1 cup beer (lager or ale, nothing too bitter)
• 1/2 cup chicken broth (or water)
• 1 tbsp soy sauce
• 1 tsp honey (optional, to balance flavors)
• 1/2 tsp mustard (optional, for depth)
• 1 tbsp fresh coriander (chopped, for garnish)
**Instructions**
**1. Sear the Chicken**
1. Heat 1 tbsp oil in a deep pan or Dutch oven over **medium-high heat**.
2. Add the chicken, sprinkle with **salt, black pepper, and smoked paprika**, and sear until golden brown (about **3-4 minutes per side**).
3. Remove and set aside.
**2. Sauté the Mushrooms & Aromatics**
1. In the same pan, add **mushrooms** and sauté until browned (about **3 minutes**).
2. Add **onions, garlic, and ginger**, cooking until soft and fragrant.
**3. Build the Sauce**
1. Stir in **gochujang, cumin, garam masala, and turmeric**—cook for **30 seconds** to release flavors.
2. Pour in **beer, chicken broth, soy sauce, honey, and mustard**, stirring well.
3. Bring to a simmer, then return the chicken to the pan.
**4. Simmer & Reduce**
1. Cover and simmer on **low heat for 20-25 minutes**, allowing flavors to develop.
2. Uncover and let the sauce reduce until thick and glossy (**another 5 minutes**).
**5. Garnish & Serve**
• Sprinkle with **fresh coriander** and serve hot!
**Serving Suggestions**
✔ Serve with **brown rice, quinoa, or whole wheat naan** for a healthy meal.
✔ For a **low-carb** option, pair with **cauliflower rice or roasted veggies**.
✔ Add extra **chili flakes** if you want more spice!
This dish is **spicy, rich, and packed with umami**—a delicious twist on a classic beer-braised dish! Let me know if you’d like adjustments.`
  },
  poha: {
    title: 'Poha',
    url: 'https://app.notion.com/p/140e4e7470e580f89b20cabb354ac107',
    copy: `Take poha. Wash it.
Oil + Rai + cut green chili + curry leaves + hing + cut onions
Add tomatoes and peas.
After 3-5 mins add turmeric. And then poha, salt, sugar and lime. Finally, coriander.`
  },
  misal: {
    title: 'Misal Recipe',
    url: 'https://app.notion.com/p/298e4e7470e58093a977c34e06c1d9b3',
    copy: `1. One night before - put Chawli, math and green whole moong dal in water
2. When making - boil and pressure cook the dal mix.
3. In pan, oil, curry leaves, onion. Let it cook. then add tomato and let it cook
4. When soft, add garlic, 2-3 cloves. Need good garlic in this.
5. Add misal masala after that and let it cook. add a tiny bit water if masala is burning
6. Add the dal and water mix. make sure its not too dry. and add salt and done. Let it simmer.`
  },
  'chicken-kebab': {
    title: 'Chicken Kebab',
    url: 'https://app.notion.com/p/14ce4e7470e58034be45eb927df6733f',
    copy: `Chicken Mince - 1/2 Kg
Onion - 1 No.
Tomato - 1 No.
Green Chilli - 2 Nos
Spring Onion - 2 Nos
Coriander Leaves
Ginger Garlic Paste - 2 Tsp
Salt - 1 1/2 Tsp
Red Chilli Powder - 1 Tsp
Crushed Cumin Seeds - 2 Tsp
Crushed Coriander Seeds - 2 Tsp
Anardana Powder - 1 1/2 Tsp
Garam Masala - 1 Tsp
Red Chilli Flakes - 1 Tsp
Egg - 1 No.
Method:
1. Take chicken mince in a bowl.
2. To this add onions, tomatoes, green chilies, spring onions, coriander leaves, ginger garlic paste, salt, red chili powder, cumin seeds, coriander seeds, anardana powder, garam masala powder, red chili flakes, besan flour and mix everything together.
3. Crack open an egg and beat it. Add it to the chicken mixture.
(Egg can be replaced by besan)
4. Let the mixture sit for 30 mins.
5. Rub the palms with oil and take some kebab mixture. Mould it into a patty. Keep it aside.
6. For another variation, place the tomato slice in the kebab. Keep it aside.
7. Pour some oil for shallow frying in a tawa/pan.
8. Gently place the kebabs on the tawa and cook for 5-6 mins each side on medium low flame.
9. Flip the kebab to another side once it is brown on one side.
10. After the kebabs are golden brown in colour on both the sides, remove from the pan.
11. Repeat the same with Kebabs with tomato slices too.
12. Serve these Peshawari Chicken Kebabs hot with some mint chutney, onions and lemon by the side.`
  },
  'red-potato': {
    title: 'Red Potato Curry',
    url: 'https://app.notion.com/p/133e4e7470e5802589c4f81196fd6771',
    copy: `Boil potato in cooker - 3 whistles. Cool it and slice it. Cut tomatoes
Utensil - oil + rai + jeera + green chilli + curry leaves + hing
Put tomatoes in the mix. After half soft - add turmeric + dhania + red chilli - cook for 2 mins.
Add potato slices and water + salt + garam masala - 10 mins`
  },
  harira: {
    title: 'Harira, Morrocan soup',
    url: 'https://app.notion.com/p/144e4e7470e580e1b894e4f188adcb08',
    copy: `Ingredients
1/4 cup olive oil
12 oz (340g) boneless lamb, chicken, or beef
1 large onion, finely chopped
5-6 garlic cloves, grated
28 oz (800g) crushed tomatoes
2 tablespoons tomato paste
2 ribs celery with leaves, finely chopped
15 oz (425g) canned cooked chickpeas, rinsed and drained
1 cup uncooked green lentils, soaked and rinsed
1/4 cup rice or vermicelli noodles
8 cups chicken broth or water
1 tablespoon all-purpose flour
lemon wedges
1 cup finely chopped fresh parsley or cilantro leaves
The Spices:
2 teaspoons salt, or to taste
1/2 teaspoon freshly ground black pepper, or to taste
1/2 teaspoon ground turmeric
1 teaspoon ground cumin
1/2 teaspoon ground cinnamon
1/4 teaspoon ground dried ginger
crushed red pepper flakes, to taste
Instructions
Cut the lamb into about 1/2-inch pieces, around the same size of the chickpeas. Add teh lamb to a large dutch oven pot along with the olive oil.
Cook the lamb over medium heat until browned. About 5-8 minutes.
Add the onion and a pinch of salt. Cook until the onion is soft. About 7-8 minutes over medium heat.
Add the garlic and warm through for a few seconds until fragrant.
Add the tomato paste and the spices and cook for about a minute taking care not to burn the spices.
Add the celery, broth, tomatoes, chickpeas, and lentils and bring to a boil. Reduce the heat to medium-low and cook for 45 minutes or until the chickpeas and meat is soft and tender.
Combine the flour with 3-4 tablespoons of water and mix together until smooth. Add to the soup along with the vermicelli noodles. Mix together and add more liquid if needed. Also taste and adjust the seasoning if needed. Cook for 10-15 minutes or until the noodles are cooked and the soup has thickened.
The soup should be thick but at a pourable constistency.
Top with the cilantro and serve with lemon wedges. Kali Orexi!
Notes
Make it vegan: Omit the lamb and follow the recipe.`
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
