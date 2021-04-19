import axios from 'axios';
import {proxy} from '../Config';

export default class Search{

    constructor(query){

        this.query = query;
    }

    async getResults(){

        try{

            const res = await axios(`${proxy}https://recipesapi.herokuapp.com/api/search?q=${this.query}`);

            this.result = res.data.recipes;
        
        }catch(error){

            alert('Error, something went wrong');
        }
    
        
    }
}