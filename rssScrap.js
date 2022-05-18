import Parser from 'rss-parser';
let parser = new Parser();
import fs from "fs/promises";
const regex = /\s+/g;
import { scrap } from './scrapNotes.js';
import csvParser from 'json2csv';
import dayjs from 'dayjs';
let db = [];
let lsSites = null;
let lsLinks = [];
const json2csvParser = new csvParser.Parser({ delimiter: '|', headers: true })

const minutes = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : 20  ;

async function scrapSite() {
  try {
    let i = 0;
    let feed =null;

    for (const site of lsSites) {
      try {
        feed = await parser.parseURL(site.url);
      } catch (error) {
        console.error(site.url,error?.code)
        continue;
      }

      //si no existe ese regristro (mira el link), lo inserta
      for (const item of feed.items) {
        if (site.diario === 'LaNacion' && !(item.categories.includes('Sociedad') || item.categories.includes('Economía') || item.categories.includes('Política')))
          continue;
        
        let topico = site.feed;
        if(item.categories)
          topico = item.categories[0];
        
        
        let yaProcesado = lsLinks.some(x => x.uri.trim() === item.link.trim());
        if (item.link && !yaProcesado) {
          i++;
          //si no tiene contenido lo busco en el link de la nota
          let nota = item["content:encodedSnippet"];
          //console.info('diario: ',site.diario);
          if (!nota) {
            console.info('scrapping link: ', item.link);
            nota = await scrap(item.link, site.diario);
            console.info('-- scrapped content: ', nota?.length, ' bytes');

          }
          lsLinks.push({uri:item.link})

          db.push({
            titulo: item.title.trim().replace(regex, ' '),
            descripcion: item.content?.trim().replace(regex, ' '),
            link: item.link,
            fecha: item.isoDate,
            topico: topico,
            diario: site.diario,
            contenido: nota?.trim().replace(regex, ' ')
          });
        }
      }
    }
    console.log("Data scrapped: ", i, ' new records, Total: ', lsLinks.length);
    return i;
  } catch (error) {
    console.log(error?.code ? error.code : error);
  }
}


//lee el json con los datos
async function writeData(file, data) {
  try {
    await fs.writeFile(file, data);
    console.info(file, data.length / 1000, 'ok')

  } catch (error) {
    throw error;
  }
}

//lee el json con los datos
async function readData(file) {
  let f = await fs.readFile(file);
  return JSON.parse(f);
}

async function run() {
  try {
    console.log("Run on", dayjs().format('YYYY-MM-DD hh:mm'), ' every ',minutes,'min');
    lsLinks = await readData('g:/My Drive/Maestría/MCD-TPs-Grupo/Test Mining/CrisV-scrap/links_descargados.json');
    lsSites = await readData('sites.json');
    if (await scrapSite() > 0) {
      await writeData('g:/My Drive/Maestría/MCD-TPs-Grupo/Test Mining/CrisV-scrap/links_descargados.json', JSON.stringify(lsLinks));
      let file = dayjs().format('YYMMDDhhmm');
      await writeData(`g:/My Drive/Maestría/MCD-TPs-Grupo/Test Mining/CrisV-scrap/notas_${file}.csv`, json2csvParser.parse(db));
    }

  } catch (error) {
    console.error(error);
  }

}

async function save_link_notes(links){
  let data =[];
  console.info('scrapping notes: ', links.length);
  for (const l of links.filter(x => x.link)) {

    let diario = '';

    if (l.link.includes('diariocronica'))
      diario = 'Cronica';
    else if (l.link.includes('telam'))
      diario = 'Telam';
    else if (l.link.includes('clarin'))
      diario = 'Clarin';
    else if (l.link.includes('Pagina12'))
      diario = 'Pagina12';

    if (link && diario) {
      console.info('scrapping link: ', l.link);
      let nota = await scrap(l.link, diario);
      console.info('-- scrapped content: ', nota?.length, ' bytes');

      data.push({
        link: l.link,
        diario: diario,
        contenido: nota?.trim().replace(regex, ' ')
      });
    }
  }

  if(data.length){
    let file = dayjs().format('YYMMDDhhmm');
    await writeData(`C:/Users/crist/OneDrive/texmining/notas_${file}.csv`, json2csvParser.parse(data));
  }
  else
    console.log('no data to save');
}

async function run_links() {
  try {
    console.log("Run on", dayjs().format('YYYY-MM-DD hh:mm'));
    lsLinks = await readData('./solo_links.json');
    let linkvalidos = lsLinks.filter(x => x.link);
    const cantVec = 8;
    let cantElem = Math.ceil(linkvalidos.length/cantVec);

    let result = [];
    for (let i = 1; i <= cantVec; i++) {
      let from = (i-1)*cantElem;
      let to = cantElem*i;
      result.push(linkvalidos.slice(from,to));
    }
    result.forEach((vec)=>{
      save_link_notes(vec);
    })

  } catch (error) {
    console.error(error);
  }

}
//aca esta puesto para que corra cada 1 min
run();
setInterval(async function () {
  await run();
}, 1000 * 60 *  minutes);
//run_links();


