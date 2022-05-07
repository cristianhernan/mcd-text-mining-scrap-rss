
const { JSDOM } = require("jsdom")
const axios = require('axios')
let skipClass =['sp__Normal','ad-slot','ad-slot onlymobile'];
let skipText =['googletag'];

const upvoteFirstPost = async () => {
  try {
   const { data } = await axios.get("https://www.telam.com.ar/notas/202205/591804-eva-peron-natalicio-humenajes.html");
    const dom = new JSDOM(data, {
      runScripts: "outside-only"
    });
    const { document } = dom.window;
    const firstPost = document.querySelector("#c4kw0vqy6 > div > div > div.col-md-8 > div > div > article > div.wrapper-editable-content > div:nth-child(2) > div.wrapper-editable-content > div > div > div > div > div.paragraph")
    let a = firstPost.textContent;

    // for (const child of firstPost.childNodes) {
    //     if(child.id === 'div-gpt-ad-inread2')
    //         break;
    //     if(child.nodeType===1 && !skipClass.includes(child.className.trim()) ){
    //         console.log(child.textContent.trim());
    //     }
    // }
    console.log(a);

  } catch (error) {
    throw error;
  }
};



upvoteFirstPost().then(msg => console.log(msg));

