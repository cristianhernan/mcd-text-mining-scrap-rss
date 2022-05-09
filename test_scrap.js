const { JSDOM } = require("jsdom")
// var xpath = require('xpath')
//   , domx = require('xmldom').DOMParser
const axios = require('axios')
let skipClass =['sp__Normal','ad-slot','ad-slot onlymobile'];
let skipID =['fusion-static-exit:f0fCBmZKDDwy5C7','fusion-static-enter:0fjOXQj5VzQq81lD'];

const upvoteFirstPost = async () => {
  try {
   
   const { data } = await axios.get('https://www.diariocronica.com.ar/noticias/2022/05/06/65416-mario-grinman-acuso-al-gobierno-de-ser-una-convencion-de-psicopatas-que-esta-destruyendo-al-pais');
    const dom = new JSDOM(data, {
      runScripts: "outside-only",
      contentType: "text/html",
      includeNodeLocations: true
    });
    const { document } = dom.window;
    //const firstPost = document.querySelector("#c4kw0vqy6 > div > div > div.col-md-8 > div > div > article > div.wrapper-editable-content > div:nth-child(2) > div.wrapper-editable-content > div > div > div > div > div.paragraph")
     //document.querySelector(".col-deskxl-10 > div:nth-child(1) > div:nth-child(1)");
  
     const firstPost=document.querySelector("#main > div > div:nth-child(2) > div > div > div > div.col-xs-12.col-sm-12.col-md-8.col-lg-8.no-padding > article > div.contenido")
    //  var xr = document.evaluate('/html/body/div[2]/div[7]/div[1]/article/div[3]/div[2]/div', document, null, 2, null );
  console.log(firstPost.textContent);

  
    //const dom2 = new JSDOM(strhtml);

  

   // console.log(dom2.window.document.querySelector("body > article > main").textContent)
    
    for (const child of firstPost.childNodes) {
      if(child.className === 'row FirmaAutor' || child.id ==='fusion-static-enter:f0fjRJgUEYmjaSn')
        break;
      
      if(!skipID.includes(child.id)){
        console.log(child.textContent);
      }
    }

  } catch (error) {
    throw error;
  }
};



upvoteFirstPost().then(msg => console.log(msg));

