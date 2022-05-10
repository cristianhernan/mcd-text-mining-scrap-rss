import Parser from  'rss-parser';
let parser = new Parser();
import fs  from "fs/promises";
const regex = /\s+/g;
import {scrap} from './scrapNotes.js';
import csvParser  from 'json2csv';
import dayjs from 'dayjs';
let db = [];
let lsSites = null;
let lsLinks = [];
const json2csvParser = new csvParser.Parser({ delimiter: '|', headers:true })


async function scrapSite() {
  try {
    let i=0;
    for (const site of lsSites) {
      let feed = await parser.parseURL(site.url);
      //si no existe ese regristro (mira el link), lo inserta
      for (const item of feed.items) {
          if (!lsLinks.find(x=> x.link === item.link)) {
            i++;
            //si no tiene contenido lo busco en el link de la nota
            let nota = item["content:encodedSnippet"];
            //console.info('diario: ',site.diario);
            if(!nota){  
              console.info('scrapping link: ',item.link);
              nota = await scrap(item.link,site.diario);
              console.info('-- scrapped content: ',nota?.length, ' bytes');
              
            }
            lsLinks.push({
              link: item.link 
            })


            db.push({
              titulo: item.title.trim().replace(regex, ' '),
              descripcion: item.content?.trim().replace(regex, ' '),
              link: item.link,
              fecha : item.isoDate,
              topico: site.feed,
              diario: site.diario,
              contenido: nota?.trim().replace(regex, ' ')
            });
          }
      }
    }
    console.log("Data scrapped: ",i, ' new records, Total: ', db.length);
    return i;
  } catch (error) {
    console.log(error);
  }
}


//lee el json con los datos
async function writeData(file, data) {
  try {
    await fs.writeFile(file, data);
    console.info(file, data.length/1000, 'ok')
    
  } catch (error) {
    throw error;
  }
}

//lee el json con los datos
async function readData(file) {
  let f= await fs.readFile(file);
  return JSON.parse(f);
}

async function run(){
  try {
    console.log("Run on",new Date().toUTCString());
    lsLinks= await readData('links.json');
    lsSites=await readData('sites.json');
    if(await scrapSite() > 0){
      await writeData('links.json',JSON.stringify(lsLinks));
      let file = dayjs().format('YYMMDDhhmm');
      await writeData(`C:/Users/crist/OneDrive/texmining/notas_${file}.csv`,json2csvParser.parse(db));
    }
    
  } catch (error) {
    console.error(error);
  }

}

//aca esta puesto para que corra cada 1 min
run();
setInterval(async function() {
  await run();
},1000*60*15);



