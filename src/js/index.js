//https://recipesapi.herokuapp.com

//https://recipesapi.herokuapp.com/api/search
import axios from 'axios';

async function getResults(query){
    
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    
    try{
        const result = await axios(`${proxy}https://recipesapi.herokuapp.com/api/search?q=${query}`);
    
        const recipes = result.data.recipes;
        
        console.log(recipes);
    }catch(error){
        alert(error);
    }

    
}

getResults('tomato');