const axios = require('axios')
let API_KEY = process.env.REACT_APP_API_KEY;
let API_URL = "https://api.spoonacular.com/recipes/";

export const searchRecipes = (query, diet, offset) => {
    let new_offset = 12*offset;
    let request = API_URL+'search?number=12&apiKey='+API_KEY+'&query='+query+'&offset='+new_offset;
    if (diet.localeCompare('')!==0 && diet.localeCompare('undefined')!==0 ) {
        request += '&diet='+diet;
    } 
    console.log(request)
    return new Promise((resolve) => {
        axios.get(request).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
                resolve(response.data);
            }
        });
    })
}

export const searchInstructions = (id) => {
    let request = 'https://api.spoonacular.com/recipes/' + id + '/analyzedInstructions?apiKey='+API_KEY;
    return new Promise((resolve)=>{
        axios.get(request).then((response)=>{
            if (response.status === 200) {
                resolve(response.data[0].steps); // TODO : modify in case response.data[0] is undefined
            }
        });
    })
}