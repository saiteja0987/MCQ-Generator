const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'public', 'styles.css');
const outputFile = path.join(__dirname, 'public', 'dist', 'styles.css');

const css = fs.readFileSync(inputFile, 'utf8');

postcss([
  tailwindcss,
  autoprefixer
])
  .process(css, { from: inputFile, to: outputFile })
  .then(result => {
    fs.writeFileSync(outputFile, result.css);
    if (result.map) {
      fs.writeFileSync(`${outputFile}.map`, result.map.toString());
    }
    console.log('CSS built successfully!');
    console.log(`Output: ${outputFile}`);
  })
  .catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
