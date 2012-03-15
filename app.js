"use strict";

var ifitAuth = require('ifit-auth')
  , express = require('express')
  , connectRedis = require('connect-redis')
  , config = require('./config')
  , io = require('socket.io')
  , util = require('util')
  , model = require('./models')
  , controllers = require('./controllers')
  , menus = require('./config/menus')
  , Menu = require('./lib/menu')
  , app = express.createServer();

module.exports = app;

app.configure('local', function() {
  var re = /img|images/;
  app.use(function(req, res, next) {
    if (req.url.match(re)) {
      res.header('Cache-Control', 'max-age=3600, must-revalidate');
    } else {
      res.header('Cache-Control', 'no-cache');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 'Thu, 19 Nov 1981 08:52:00 GMT');
    }
    next();
  });
});

app.configure('test', 'production', function() {
  var re = /build/
    , date = new Date();

  date.setDate(date.getDate() + 365*5);
  date = date.toGMTString();

  app.use(function(req, res, next) {
    if (req.url.match(re)) {
      res.header('Cache-Control', 'public');
      res.header('Vary', 'Accept-Encoding');
      res.header('Expires', date);
    }
    next();
  });
});

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());

var RedisStore = connectRedis(express);
var sessOptions = {
  key: config.sessionName,
  secret: config.sessionSecret,
  store: new RedisStore(config.redis),
  cookie: {domain: config.cookieDomain},
  secure: true
};

// dev settings
app.configure('development', function() {
});

// test settings
app.configure('test', function() {
});

// prod settings
app.configure('production', function() {
});

// Config for every environment
app.configure(function() {
  app.use(express.session(sessOptions));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(function(req, res, next) {
    res.topMenu = new Menu();
    res.lowerMenu = new Menu();
    if (req.session && req.session.auth) {
      res.menu = menus.postLogin;
    } else {
      res.menu = menus.prelogin;
    }
    next();
  });

});

// Config for dev and test environments
app.configure('local', 'development', 'test', function() {
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

// Config for production environments
app.configure('production', function() {
  app.use(express.errorHandler());
});


// Setup the controllers (routes)
controllers.init(app);

// Start the server
app.listen(config.port);

//Setup Socket.IO
var io = io.listen(app);
io.sockets.on('connection', function(socket) {
  console.log('Client Connected');
  socket.on('message', function(message) {
    socket.broadcast.send(message);
    socket.send(message);
  });
  socket.on('disconnect', function() {
    console.log('Client Disconnected.');
  });
});

console.log('Listening on http://localhost:' + config.port +
            ' in ' + config.env + ' mode.');
