import { API_URL_PUB } from "./constant";

const requestAPI = (dictionary) =>{
    var str = [];
    for(var p in dictionary){
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dictionary[p]));
    }
    const request_url = API_URL_PUB + str.join("&");

    return fetch(request_url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
        }
    }).then((response) => response.json()).then((json) => {
        // console.log("response == ", json);            
        return json;
    }).catch((error) => {
        // console.error(error);
        return error;
    });
}

export const requestGETAPI = (url) =>{
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
        }
    }).then((response) => response.json()).then((json) => {          
        return json;
    }).catch((error) => { 
        return error;
    });
}


export default requestAPI