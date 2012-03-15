var fs = require('fs')
  , jsp = require('uglify-js').parser
  , pro = require('uglify-js').uglify
  , crypto = require('crypto')
  , jsConfig = require('../config').javascript
  , prefix = fs.realpathSync(__dirname + '/../public/js') + '/'
  , buff = new Buffer(9)
  , ast
  , output
  , outputFile
  , version
  , versionjson
  , js;

version = crypto.randomBytes(9).toString('base64')
                .replace('+', '0').replace('/', '1');
versionjson = JSON.stringify({'version': version});
fs.mkdirSync(prefix + '/.build/' + version, 0755);
fs.writeFileSync(prefix + '/version.json', versionjson);

for (var type in jsConfig) {
  if (jsConfig.hasOwnProperty(type) &&
      jsConfig[type].hasOwnProperty('length') &&
      jsConfig[type].length > 0) {
    js = '';
    console.log('compiling ' + type + ' js');
    for (var i = 0; i < jsConfig[type].length; ++i) {
      console.log('adding file ' + jsConfig[type][i]);
      js += fs.readFileSync(prefix + jsConfig[type][i], 'utf8');
    }
    ast = jsp.parse(js); // parse code and get the initial AST
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression
    output = pro.gen_code(ast); // compressed code here
    outputFile = prefix + '.build/' + version + '/' + type + '.js';
    console.log('writing ' + outputFile);
    fs.writeFileSync(outputFile, output);
  }
}
