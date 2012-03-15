"use strict";

var models = require('../models');

exports.init = function(app) {
  app.all('/user/chat', chat);
}

function chat(req, res) {
   if(!req.loggedIn) { 
    res.redirect('/');
    return;
  }
  res.render('user/chat', {
    title : 'User Chat'
  });
};
