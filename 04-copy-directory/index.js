const fs = require('fs');
const path = require('path');


fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, () => {
  copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
});

function copyDir(src, dest) {

  fs.mkdir(dest, { recursive: true }, (err) => {
     if (err) {
       return console.error(err);
     }
   });

  fs.readdir(src, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      if(file.isFile()){
        fs.promises.copyFile(srcPath, destPath);
        console.log(file.name, ' was copied to files-copy');
      }
      if(file.isDirectory()){
        copyDir(srcPath, destPath);
      }
    });
  })
}


