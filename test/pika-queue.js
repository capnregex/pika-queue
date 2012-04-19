var PikaQueue = require('../index')
  ,	should = require('should')
  , async = require('async');

describe('Pika Queue', function() {
  it('End to End testing', function(done) {
    var queueName = "test-success";
    var successMessage = "Success";

    var producer = new PikaQueue();
    var worker = new PikaQueue();

    worker.monitorJobQueue(queueName, function(job, fn) {
      fn({message: successMessage});
    });
    setTimeout(function() {
      producer.queueJob(queueName, {job: "First job"}, function(err, data) {
        data.message.should.equal(successMessage);
        done();
      });
    }, 5);
  });

  it('Should throw an error', function(done) {
    var queueName = "test-failure";
    var producer = new PikaQueue();
    var badObject = {};
    badObject.a = {b: badObject};
    producer.queueJob(queueName, badObject, function(err, jobID) {
      should.exist(err);
      done();
    });
  });

  it('Should handle more than one job', function(done) {
    var queueName = 'test-multiple-jobs';
    var successMessage = "Success";

    var producer = new PikaQueue();
    var worker = new PikaQueue();

    worker.monitorJobQueue(queueName, function(job, notificationFunc) {
      notificationFunc({message: successMessage});
    });

    async.parallel([
      function(cb) {
        producer.queueJob(queueName, {job: "First job"}, function(err, data) {
          cb(err, data);
        })
      },
      function(cb) {
        producer.queueJob(queueName, {job: "Second job"}, function(err, data) {
          cb(err, data);
        })
      }
    ], function(err, results) {
      results[0].message.should.equal(successMessage);
      results[1].message.should.equal(successMessage);
      done();
    });
  });


  it('Should make post to a queue, and not wait for a response', function(done) {
    var queueName = 'test-no-monitor';
    var successMessage = "Success";

    var producer = new PikaQueue();
    var worker = new PikaQueue();

    producer.queueJob(queueName, {job: "My test job"});

    worker.monitorJobQueue(queueName, function(job, fn) {
      fn({message: successMessage});
      done();
    });
  });
})
