var RedisQueue = require('../index')
  ,	should = require('should')
  , async = require('async'); 

describe('Redis Queue', function() {
  it('End to End testing', function(done) {
    var queueName = "test-success";
    var successMessage = "Success";

    var producer = new RedisQueue();
    var worker = new RedisQueue();

    worker.monitorJobQueue(queueName, function(job) {
      worker.publishNotification(queueName, job, {message: successMessage});
    });

    producer.queueJob(queueName, {job: "First job"}, function(err, data) {
      data.message.should.equal(successMessage);
      done();
    })
  });
  
  it('Should throw an error', function(done) {
    var queueName = "test-failure";
    var producer = new RedisQueue();
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
    
    var producer = new RedisQueue();
    var worker = new RedisQueue();
  
    worker.monitorJobQueue(queueName, function(job) {
      worker.publishNotification(queueName, job, {message: successMessage});
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
    
    var producer = new RedisQueue();
    var worker = new RedisQueue();
     
    producer.queueJob(queueName, {job: "My test job"});
    
    worker.monitorJobQueue(queueName, function(job) {
      worker.publishNotification(queueName, job, {message: successMessage});
      done();
    });
  });
})
