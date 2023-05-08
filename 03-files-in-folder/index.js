const fs = require('fs');
const path = require('path');

const files = fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if(file.isFile()){
      const i = file.name.lastIndexOf('.');
      let fileSizeInkB = 0;
      fs.stat(path.join(__dirname, 'secret-folder', file.name),(err, stats) =>{
        if (err) throw err;
        fileSizeInkB = (stats.size/1024).toFixed(2);
        console.log(file.name.slice(0, i),' - ', file.name.slice(i+1), ' - ', fileSizeInkB, 'kB');
      });
    }
  });
})