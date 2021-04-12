import Search from './models/Search';
import * as searchView from './views/SearchView';
import {elements} from './views/base';
/**Global state of the app
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 * 
 * **/

const state = {};

const controlSearch = async () => {


    //1. get query from view
    const query = searchView.getInput();

   if(query){

        //2. new search object and add it to state
        state.search = new Search(query);
        
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        //4. Search for recipes
        await state.search.getResults();

        //5. result results on UI
        searchView.renderResults(state.search.result);
  }
}

elements.searchForm.addEventListener('submit',e => {

    e.preventDefault();

    controlSearch();
});