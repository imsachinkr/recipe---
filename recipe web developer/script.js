const searchBox = document.querySelector('.searchbox');
const searchBtn = document.querySelector('.searchbtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetails = document.querySelector('.recipe-details-content');
const recipeclosebtn = document.querySelector('.recipe-close-Btn');

const fetchRecipes = async (query) => {
  try {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    // Clear any previous recipes from the container
    recipeContainer.innerHTML = '';

    // Handle cases where no meals are found
    if (!response.meals) {
      recipeContainer.innerHTML = '<p>No recipes found. Please try another search.</p>';
      return;
    }

    // Loop through each meal and create the recipe div
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe'); // Add class to the individual recipe div

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="Recipe Image">
        
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea}</p>
        <p>${meal.strCategory}</p>
      `;
      const button = document.createElement('button');
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener('click', () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeContainer.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
  }
};

// Function to fetch and format ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredients += `<li>${measure} ${ingredient}</li>`;
    }
    else{
        break;
    }
  }
  return ingredients;
};

const openRecipePopup = (meal) => {
  recipeDetails.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${fetchIngredients(meal)}</ul>
    <h3>Instructions:</h3>
    <p class="recipeInstructions">${meal.strInstructions}</p>
  `;
  recipeDetails.parentElement.style.display = "block";
};

// Close the recipe popup when the close button is clicked
recipeclosebtn.addEventListener('click', () => {
  recipeDetails.parentElement.style.display = "none";
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchRecipes(searchInput);
  }
});
