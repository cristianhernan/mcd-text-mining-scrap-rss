import Parser from  'rss-parser';
let parser = new Parser();
import fs  from "fs";
const regex = /[^a-zA-ZÀ-ÖØ-öø-ÿ0-9 ¿?(),.;-_!¡'"&-]/i;
import {scrap} from './scrapNotes.js';
let db = null;
let lsSites = null;


async function scrapSite() {
  try {
    let i=0;
    for (const site of lsSites) {
      let feed = await parser.parseURL(site.url);
      //si no existe ese regristro (mira el link), lo inserta
      for (const item of feed.items) {
          if (!db.find(x=> x.link === item.link)) {
            i++;
            //si no tiene contenido lo busco en el link de la nota
            let nota = item["content:encodedSnippet"];
            console.info('diario: ',site.diario);
            if(!nota){  
              console.info('scrapping link: ',item.link);
              nota = await scrap(item.link,site.diario);
              console.info('-- scrapped content: ',nota?.length, ' bytes');
              
            }
            
            db.push({
              titulo: item.title,
              descripcion: item.content,
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

async function run(){
  console.log("Run on",new Date().toUTCString());
  db=await readData('C:/Users/crist/OneDrive/datos.json');
  lsSites=await readData('sites.json');
  if(await scrapSite() > 0)
    writeData('C:/Users/crist/OneDrive/datos.json',JSON.stringify(db));
}

//aca esta puesto para que corra cada 1 min
run();
setInterval(async function() {
  await run();
},1000*60*5);



