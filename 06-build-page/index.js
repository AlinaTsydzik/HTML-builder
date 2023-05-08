const fs = require('fs');
const path = require('path');


fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  const outputHTML = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  const outputStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
});


fs.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, () => {
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
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
        console.log(file.name, ' was copied to assets');
      }
      if(file.isDirectory()){
        copyDir(srcPath, destPath);
      }
    });
  })
}

function copyStyles() {
  fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    fs.truncate(path.join(__dirname, 'project-dist', 'style.css'), err => {
      if(err) throw err;
    });

    files.forEach(file => {
      if(file.isFile()){
        const i = file.name.lastIndexOf('.');
        const fileExt = file.name.slice(i+1);
        if(fileExt === 'css'){
          const input = fs.createReadStream(path.join(__dirname, 'styles', file.name));
          input.on('data', data => {
              fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data.toString(), (err) => {
              if (err) throw err;
            })
          })
        }
      }
    });
  })
}


async function HTMLBuilder() {
  let templateHTML = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8');
  const componentMatches = templateHTML.matchAll(/{{(.*?)}}/g);

  for (let component of componentMatches) {
    const componentName = component[1];
    const componentHTML = await fs.promises.readFile(path.join(__dirname, 'components', `${componentName}.html`), 'utf8');
    templateHTML = templateHTML.replace(component[0], componentHTML);
  }
  
  await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateHTML, 'utf-8');
}

copyStyles();
HTMLBuilder();