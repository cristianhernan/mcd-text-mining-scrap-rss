import { JSDOM }  from 'jsdom'
 import axios  from 'axios'
import fs from 'fs';
let db = [];

export const scrap = async (url, diario) => {
    try {

        const { data } = await axios.get(url);
        const dom = new JSDOM(data, {
            runScripts: "outside-only"
        });
        switch (diario) {
            case 'Clarin':
                return await scrapClarin(dom.window.document);
            case 'Telam':
                return await scrapTelam(dom.window.document);
            case 'Pagina12':
                return await scrapPagina12(dom.window.document);
            case 'LaNacion':
                return await scrapLaNacion(dom.window.document);
            case 'Cronica':
                 return await scrapCronica(dom.window.document);
            default:
                return null;
        }

    } catch (error) {
        console.log(error);
    }
};

const scrapTelam = async (doc) => {
    let queryPath = "#c4kw0vqy6 > div > div > div.col-md-8 > div > div > article > div.wrapper-editable-content > div:nth-child(2) > div.wrapper-editable-content > div > div > div > div > div.paragraph";

    try {

        const reqData = doc.querySelector(queryPath)
        if(!reqData) return null;
        return reqData.textContent;

    } catch (error) {
        throw error;
    }
}

const scrapCronica = async (doc) => {
    let queryPath = "#main > div > div:nth-child(2) > div > div > div > div.col-xs-12.col-sm-12.col-md-8.col-lg-8.no-padding > article > div.contenido";

    try {

        const reqData = doc.querySelector(queryPath)
        if(!reqData) return null;
        return reqData.textContent;

    } catch (error) {
        throw error;
    }
}

const scrapPagina12 = async (doc) => {
    let queryPath = "div.article-main-content:nth-child(1)";
    try {

        const reqData = doc.querySelector(queryPath)
        if(!reqData) return null;
        
        return reqData.textContent;

    } catch (error) {
        throw error;
    }
}

const scrapClarin = async (doc) => {
    let skip_class = ['sp__Normal', 'ad-slot', 'ad-slot onlymobile'];
    let queryPath = "body > div.main-menu.off-canvas-wrap > div > section > div.mainPage > div.content-all > div.news.container.newsNormal.no-p.stickyBar.politica.nota-unica > div:nth-child(2) > div > div.entry-body.col-lg-6.col-md-8.col-sm-12.col-xs-12 > div.body-nota";
    let result = [];
    try {

        let reqData = doc.querySelector(queryPath)
        if(!reqData){
            reqData = doc.querySelector(queryPath.replace('politica','economia'));
            if(!reqData) return null;
        }

        for (const child of reqData.childNodes) {
            if (child.id === 'div-gpt-ad-inread2')
                break;
            if (child.nodeType === 1 && !skip_class.includes(child.className.trim())) {
                result.push(child.textContent.trim());
            }
        }
        return result.join(' ');


    } catch (error) {
        throw error;
    }
}

const scrapLaNacion = async (doc) => {
    let skip_ids = ['fusion-static-exit:f0fCBmZKDDwy5C7','fusion-static-enter:0fjOXQj5VzQq81lD'];
    let queryPath = ".col-deskxl-10 > div:nth-child(1) > div:nth-child(1)";
    let result = [];
    try {

        const reqData = doc.querySelector(queryPath)
        if(!reqData)
            return null;
        for (const child of reqData.childNodes) {
            if(child.className === 'row FirmaAutor' || child.id ==='fusion-static-enter:f0fjRJgUEYmjaSn')
                break;
            if (!skip_ids.includes(child.id)) {
                result.push(child.textContent.trim());
            }
        }
        return result.join(' ');


    } catch (error) {
        throw error;
    }
}

function writeData(file, data) {
    fs.writeFile(file, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log("Data saved ok");
    });
}

//lee el json con los datos
async function readData(file) {
    try {
        let res = await fs.readFileSync(file); 
        return JSON.parse(res);
        
    } catch (error) {
        throw error;
    }


}

async function run() {
    try {


        let i = 0;
        let j = 0;
        let rssNotas = await readData('datos.json');
        for (const item of rssNotas) {
            console.info(`scraping: ${i++} / ${rssNotas.length}`, item.diario);
            console.info('link ', item.link);
            let rNota = await scrap(item.link, item.diario);
            if (rNota) {
                console.info('scrping OK ',j++);
                db.push({
                    diario: item.diario,
                    link: item.link,
                    nota: rNota
                });
            }
            else
                console.info('scrping not defined');
        }
        if (db.length > 0) {
            writeData('notas.json', db);
        }
    } catch (error) {
        console.error(error);
    }
}
