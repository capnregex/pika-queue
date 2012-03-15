var Menu = require('../lib/menu')
  , config = require('./');

var loginUrl = config.ifitAuth.uri + '/login?next=' + config.ifitAuth.callbackUri;
var registerUrl = config.ifitAuth.uri + '/register';
  
var prelogin = exports.prelogin = new Menu(); 
prelogin.add('/', 'Home');
prelogin.add(registerUrl, 'Register');
prelogin.add(loginUrl, 'Login');

var postLogin = exports.postLogin = new Menu(); 
postLogin.add('/', 'Home');
postLogin.add('/logout', 'Logout');