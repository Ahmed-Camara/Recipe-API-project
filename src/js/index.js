import Search from './models/Search';

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
    const query = document.querySelector('.search__field').value;

    if(query){

        //2. new search object and add it to state
        state.search = new Search(query);
        
        //3. Prepare UI for results
        //4. Search for recipes
        await state.search.getResults();

        //5. result results on UI
        console.log(state.search.result);
    }
};

document.querySelector('.search').addEventListener('submit',e=>{

    e.preventDefault();

    controlSearch();
});