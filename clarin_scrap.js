const { JSDOM } = require("jsdom")
const axios = require('axios')
let skipClass =['sp__Normal','ad-slot','ad-slot onlymobile'];
let skipText =['googletag'];

const upvoteFirstPost = async () => {
  try {
   // const { data } = await axios.get("https://www.clarin.com/politica/martin-lousteau-lanzamiento-nacional-evolucion-peleamos-partido-salga-comodidad-abrace-gestion-_0_nZyrHLf2b2.html");
   const { data } = await axios.get('https://www.clarin.com/politica/denuncian-gobierno-olvido-incluir-antartida-islas-malvinas-opciones-censo-nacional_0_bJbvrpqK4Y.html');
    const dom = new JSDOM(data, {
      runScripts: "outside-only"
    });
    const { document } = dom.window;
    //const firstPost = document.querySelector("#c4kw0vqy6 > div > div > div.col-md-8 > div > div > article > div.wrapper-editable-content > div:nth-child(2) > div.wrapper-editable-content > div > div > div > div > div.paragraph")
    const firstPost= document.querySelector("body > div.main-menu.off-canvas-wrap > div > section > div.mainPage > div.content-all > div.news.container.newsNormal.no-p.stickyBar.politica.nota-unica > div:nth-child(2) > div > div.entry-body.col-lg-6.col-md-8.col-sm-12.col-xs-12 > div.body-nota")
    
    for (const child of firstPost.childNodes) {
        if(child.id === 'div-gpt-ad-inread2')
            break;
        if(child.nodeType===1 && !skipClass.includes(child.className.trim()) ){
            console.log(child.textContent.trim());
        }
    }

  } catch (error) {
    throw error;
  }
};



upvoteFirstPost().then(msg => console.log(msg));

