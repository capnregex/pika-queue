"use strict";

var optimus = require('optimus')
  , config = require('./config');

optimus.start(config.workers, __dirname);
