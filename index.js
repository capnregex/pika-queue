"use strict";

var redis = require('redis')
  , uuid = require('node-uuid');

var PikaQueue = function(conf) {
  var self = this;

  conf = conf || {};
  conf.port = conf.port || 6379;
  conf.host = conf.host || 'localhost';

  this.client = redis.createClient(conf.port, conf.host, conf);
  this.notificationClient = redis.createClient(conf.port, conf.host, conf);
  this.notify = {};

  this.notificationClient.on('message', function(channel, message) {
    message = JSON.parse(message);
    if (self.notify.hasOwnProperty(message.id)) {
      self.notify[message.id].call(null, null, message.message);
      delete self.notify[message.id];
    }
  });

}

PikaQueue.prototype.queueJob = function(queueName, jobDescription, cb) {
  var jobID = uuid.v4();
  try {
    var message = JSON.stringify({
      id: jobID,
      message: jobDescription
    });
    this.client.rpush(queueName, message);
    if (cb) {
      this.notificationClient.subscribe('notification:' + queueName);
      this.notify[jobID] = cb;
    }
  } catch(err) {
    cb(err);
  }

}

PikaQueue.prototype.monitorJobQueue = function(queueName, cb) {
  var self = this;
  self.client.blpop(queueName, 20, function(err, job) {
    job = JSON.parse(job[1]);
    if (job) {
      var id = job.id;
      var jobDescription = job.message;
      var notificationFunc = function(data) {
        var message = JSON.stringify({
          id: id,
          message: data
        });
        self.client.publish('notification:' + queueName, message);
      };
      cb(jobDescription, notificationFunc);
    }
    self.monitorJobQueue(queueName, cb);
  });
}

module.exports = PikaQueue;
