const { JSDOM } = require("jsdom")
const axios = require('axios')


const scrap = async (site) => {
    try {

        const { data } = await axios.get(site.link);
        const dom = new JSDOM(data, {
            runScripts: "outside-only"
        });
        switch (site.diario) {
            case 'Clarin':
                scrapClarin(site,dom.window);
                break;
            case 'Telam':
                queryPath = "#c4kw0vqy6 > div > div > div.col-md-8 > div > div > article > div.wrapper-editable-content > div:nth-child(2) > div.wrapper-editable-content > div > div > div > div > div.paragraph";
                break;

            default:
                break;
        }

    } catch (error) {
        throw error;
    }
};

const scrapClarin = async(site, doc) =>{
    let skip_class = ['sp__Normal', 'ad-slot', 'ad-slot onlymobile'];
    let queryPath = "body > div.main-menu.off-canvas-wrap > div > section > div.mainPage > div.content-all > div.news.container.newsNormal.no-p.stickyBar.politica.nota-unica > div:nth-child(2) > div > div.entry-body.col-lg-6.col-md-8.col-sm-12.col-xs-12 > div.body-nota";
    try {

        const reqData = doc.querySelector(queryPath)

        for (const child of reqData.childNodes) {
            if (child.id === 'div-gpt-ad-inread2')
                break;
            if (child.nodeType === 1 && !skip_class.includes(child.className.trim())) {
                console.log(child.textContent.trim());
            }
        }

        
    } catch (error) {
        throw error;
    }
}

upvoteFirstPost().then(msg => console.log(msg));

