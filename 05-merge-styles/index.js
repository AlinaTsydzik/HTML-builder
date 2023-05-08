const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));


fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) throw err;

  fs.truncate(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
    if(err) throw err;
 });

  files.forEach(file => {
      if(file.isFile()){
        const i = file.name.lastIndexOf('.');
        const fileExt = file.name.slice(i+1);
        if(fileExt === 'css'){
          const input = fs.createReadStream(path.join(__dirname, 'styles', file.name));
          input.on('data', data => {
            fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data.toString(), (err) => {
              if (err) throw err;
            })
          })
        }
      }
  });
})


