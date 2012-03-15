"use strict";

// Not Found Error Type
function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
};

NotFound.prototype = new Error();

var renderError = function(err, req, res, next) {
  var defaultError = 'An error occured.'
    , format
    , message
    , log;
  if (err instanceof NotFound
    || err.message.toLowerCase().trim() == 'not found') {
    res.render('errors/404', {
      locals: {
        title: '404 - Not Found',
        url: req.url
      },
      status: 404
    });
  } else {
    if (typeof err == 'object') {
       if (err.hasOwnProperty('message')) {
          message = err.message;
       } else {
          message = defaultError;
       }
       if (err.hasOwnProperty('log')) {
          log = err.log;
       } else {
          log = message;
       }
    } else if (typeof err == 'string') {
       message = err;
       log = err;
    } else {
       message = defaultError;
       log = defaultError;
    }
    if (err instanceof Error) {
      log += '\n' + err.stack;
    }
    format = res.hasOwnProperty('format') ? res.format : 'html';
    if (format == 'json') {
      res.json({error: message});
    } else {
      res.render('errors/500', {
        locals: {
          title : 'The Server Encountered an Error',
          error: message
        },
        status: 500
      });
    }
    console.log('ERROR: ' + log);
  }
};

var init = function(app) {
  // 500 Page
  app.use(function(err, req, res, next) {
    throw err;
  });

  // 404 page
  app.use(function(req, res) {
    throw new NotFound();
  });

  //setup the errors
  app.error(renderError);
};

exports.NotFound = NotFound;
exports.init = init;

