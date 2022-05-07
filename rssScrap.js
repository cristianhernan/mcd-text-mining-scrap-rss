let Parser = require("rss-parser");
let parser = new Parser();
const fs = require("fs");
//lee un json con los diarios que queremos scrapear
const lsSites = require('./sites.json');
let db = null;


async function scrapSite() {
  try {
    let i=0;
    for (const site of lsSites) {
      let feed = await parser.parseURL(site.url);
      //si no existe ese regristro (mira el link), lo inserta
      for (const item of feed.items) {
          if (!db.find(x=> x.link === item.link)) {
            i++;
            db.push({
              diario: site.diario,
              topico: site.feed,
              titulo: item.title,
              descripcion: `${item.content} ${item.contentSnippet}`,
              link: item.link,
            });
          }
      }
    }
    console.log("Data scrapped: ",i, ' records');
    return i;
  } catch (error) {
    console.log(error);
  }
}

//lee el json con los datos
async function readData(){
  fs.readFile("datos.json", (err, data) => {
    if (err) throw err;
    db = JSON.parse(data);
    console.log("Data red ok");
  });
  
}

//guarda el json con datos
function writeData(){
  fs.writeFile("datos.json", JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log("Data saved ok");
  });
}

async function run(){
  console.log("Run on",new Date().toUTCString());
  await readData();
  if(await scrapSite() > 0)
    writeData();
}

//aca esta puesto para que corra cada 1 min
setInterval(async function() {
  await run();
},1000*10*1);



