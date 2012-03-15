"use strict";

var ifitAuth = require('ifit-auth')
  , login = ifitAuth.requireLoggedIn;

exports.init = function(app) {
  app.get('/secret', login, secret);
};

var secret = function (req, res) {
  var me = {};
  ifitAuth.me(req.headers, function(_me, _res) {
    if (!_me) return;
    me = _me;
  });
  res.render('secret');
};

