const fs = require('fs');
const path = require('path'); 
const { stdin, stdout } = process;

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), (err) => {
  if (err) throw err;
});

stdout.write('\nHello! Input your text:\n');
stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    sayBye();
  }

  else fs.appendFile(path.join(__dirname, 'text.txt'), data.toString(), (err) => {
      if (err) throw err;
  })
})

process.on('SIGINT', () => {
  sayBye();
})

function sayBye() {
  stdout.write('\nThank you! Goodbye!\n');
  process.exit();
}
