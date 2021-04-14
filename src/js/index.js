import Search from './models/Search';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import {elements,renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';


/**Global state of the app
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 * 
 * **/

const state = {};

/**SEARCH CONTROLLER **/
const controlSearch = async () => {


    //1. get query from view
    const query = searchView.getInput();

   if(query){

        //2. new search object and add it to state
        state.search = new Search(query);
        
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //4. Search for recipes
            await state.search.getResults();

            //5. result results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        
        }catch(error){

            console.log('something is wrong');
            clearLoader();
        }
  }
}

elements.searchForm.addEventListener('submit',e => {

    e.preventDefault();

    controlSearch();
});

window.addEventListener('load',e => {

    e.preventDefault();

    controlSearch();
});

elements.searchResPages.addEventListener('click',e => {

    const btn = e.target.closest('.btn-inline');

    if(btn){

        const goToPage = parseInt(btn.dataset.goto,10);
        
        searchView.clearResults();
        
        searchView.renderResults(state.search.result,goToPage);
    }
});

/**RECIPE CONTROLLER **/

/**
 * We need to add the hashchange eventListener to the window object, that is fired each time the hash in URL changes
 * We need to get the hash by using the window object
 * Window.location is the entire URL, and we use the .hash property on it, that will return the hash in the URL
 * 
 * Ex:http://localhost:8080/#41470 after the event is fired, the id will be equal to #41470 (i.e id = #41470)
 * 
 * The replace function is used to remove the # symbol from the id String, the id = 41470
 * **/
const controlRecipe = async () => {

    const id = window.location.hash.replace('#','');

    if(id){

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // hightlight
        if(state.search)searchView.highlightSelected(id);

        // Create new Recipe Object
        state.recipe = new Recipe(id);
        window.r = state.recipe;

        try{
            //Get Recipe data and parse Ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        
        }catch(error){

            alert(error);
           // console.log('Recipe : something is wrong');
        }
    }
};


['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));