# PikaQueue

**PikaQueue** provides a simple abstraction to managing job queues in redis. 

There are two players involved in a job queue: a `producer` and a `worker`. 

A `producer` is an entity that submits a job to a queue to be completed. The `producer` may or may not be interested in being notified of the completion and status of job submitted. 

A `worker` in an entity that monitors a job queue, processes the job, and then sends a notification to any interested parties once the completed. 

### Example of a `producer`:

```javascript
var queueName = 'work-queue';
var producer = new PikaQueue();

// Pass in a callback if you wish to receive notification when the job is complete.
producer.queueJob(queueName, {data: "Job Data"}, function(err, notification) {
  // Do something with the notification
});

// If you do not wish to receive notification when the job is complete, simply omit the callback
producer.queueJob(queueName, {data: "Job Data"});
```

### Example of a `worker`: 
    
```javascript
var queueName = 'work-queue';
var worker = new PikaQueue();

worker.monitorJobQueue(queueName, function(job, notificationFunc) {
  // Do some work...
  notificationFunc({yourStatusMessage: "operation successful"});
});
```

