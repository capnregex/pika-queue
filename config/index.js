"use strict";

var confrodo = require('confrodo') // one ring to rule them all
  , filename = __dirname + '/' + confrodo.env + '.json'
  , common = __dirname + '/common.json'
  , defaults = {}
  , config = confrodo(defaults, common, filename, 'ARGV');

module.exports = config;
