import Search from './models/Search';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import * as listView from './views/ListView';
import {elements,renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

/**Global state of the app
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 * 
 * **/

const state = {};
window.state = state;

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
        if(state.search){
            searchView.highlightSelected(id);
        }

        // Create new Recipe Object
        state.recipe = new Recipe(id);

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

            console.log(error);
        }
    }
};


['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/**
 * LIST CONTROLLER
 * * */

const controlList = () => {

    // Create a new list if there is not yet

    if(!state.list) state.list = new List();

    //add ingredients to list
    state.recipe.ingredients.forEach(el => {

        const item = state.list.addItem(el.count,el.unit,el.ingredient);

        listView.renderItem(item);

    });
};


//Handle delete and update list item events
elements.shopping.addEventListener('click',e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // handle the delete button
    if(e.target.matches('.shopping__delete,.shopping__delete *')){

        alert('hello');
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);

    }else if(e.target.matches('.shopping__count-value')){

        const val = parseFloat(e.target.value,10);

        state.list.updateCount(id,val);
    }
});

/**
 * LIKE CONTROLLER
 * **/
const controlLike = () => {

    if(!state.likes){

        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID)){

        //add like to the state like data
        const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img)
        
        //Toggle the like button
        

        //add like to UI list
        console.log(state.likes);
    }else{

        //remove like from state
        state.likes.deleteLike(currentID);
        
        //Toggle the like button
        //remove like to UI list
        console.log(state.likes);
    }
};

// Handling recipe button clicks
elements.recipe.addEventListener('click',e => {

    if(e.target.matches('.btn-decrease, .btn-decrease *')){

        //Decrease button is clicked
        if(state.recipe.servings > 1){

            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    }else if(e.target.matches('.btn-increase, .btn-increase *')){

        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    
    }else if(e.target.matches('.recipe_btn--add, .recipe_btn--add *')){
        
        controlList();
    }else if(e.target.matches('.recipe__love,.recipe__love *')){

       //call the like controller
       controlLike();
    }
});



