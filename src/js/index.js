//https://recipesapi.herokuapp.com

//https://recipesapi.herokuapp.com/api/search

import Search from './models/Search';

const search = new Search('pizza');

console.log(search);

search.getResults();