const path = require('path');
const Map = require('es6-map');
const npmResolve = require('resolve');

function find(file) {
  console.log(file);
  return new Promise((resolve) => {
    npmResolve(file, (err, res) => resolve(err ? file : res));
  });
}

module.exports = function(url, prev, done) {
  const aliases = new Map();

  if (aliases.has(url)) {
    return done({ file: aliases.get(url) });
  }

  find(url).then((file) => {
    aliases.set(url, file);
    done({ file });
  });

};

