/**
 * Web storage API : it allows us to save key
    value pairs in the browser,
    and they stay intact,
    even after the page reloads 
 * **/

export default class Likes{

    constructor(){

        this.likes = [];
    }

    addLike(id,title,author,img){

        const like = {id,title,author,img};
        
        this.likes.push(like);

        // Persit data in localStorage
        this.persisteData();

        return like;
    }

    deleteLike(id){

        const index = this.likes.findIndex(el => el.id === id);

        this.likes.splice(index,1);

        // Persit data in localStorage
        this.persisteData();
    }

    isLiked(id){
        
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberLikes(){

        return this.likes.length;
    }

    readStorage(){

        const storage = JSON.parse(localStorage.getItem('likes'));

        //restore likes from the local storage
        if(storage){

            this.likes = storage;
        }
    }

    persisteData(){

        localStorage.setItem('likes',JSON.stringify(this.likes));
    }
}