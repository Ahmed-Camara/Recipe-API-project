import axios from 'axios';
import {proxy} from '../Config';

export default class Recipe{

    constructor(id){

        this.id = id;
    }

    async getRecipe(){

        try{

            const res = await axios(`${proxy}https://recipesapi.herokuapp.com/api/get?rId=${this.id}`);
        
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            

        }catch(error){

            alert(error.message);
        }
    }

    calcTime(){

        const numIng = this.ingredients.length;

        const period = Math.ceil(numIng / 3);

        this.time = period * 15;
    }

    calcServings(){

        this.servings = 4;
    }

    parseIngredients(){

        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort,'kg','g'];

        const newIngredients = this.ingredients.map(el => {

            //1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {

                ingredient = ingredient.replace(unit,unitsShort[i]);
            });
            //2. remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIncredient;
            let count ;
            if(unitIndex > -1){

                const arrCount = arrIng.slice(0,unitIndex);
                

                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                }else{

                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIncredient = {
                    count:parseInt(arrIng[0],10),
                    unit:'',
                    ingredient:arrIng.slice(1).join(' ')
                }

            }else if(parseInt(arrIng[0],10)){

                objIncredient = {
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex + 1).join(' ')
                }

            }else if(unitIndex === -1){

                objIncredient = {
                    count : 1,
                    unit :'',
                    ingredient
                };
            }
            return objIncredient;
        });

        this.ingredients = newIngredients;
    }
}