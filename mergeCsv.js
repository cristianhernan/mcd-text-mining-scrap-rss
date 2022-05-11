import path from 'path';
import csv from 'csv-merger';
import fs from 'fs';

const dirpath = path.join(__dirname, '/path')

fs.readdir(dirpath, function(err, files) {
  const txtFiles = files.filter(el => path.extname(el) === '.csv')
  // do something with your files, by the way they are just filenames...
})

