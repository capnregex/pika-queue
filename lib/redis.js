"use strict";

var redis = require('redis')
  , util = require('util')
  , config = require('../config')
  , defaults = {
      port: 6379,
      host: '127.0.0.1',
      options: {}
    }
  , redisConf = config.redis || defaults;

// RedisError class
var RedisError = function(error, log) {
  Error.apply(this, arguments); // call parent constructor
  this.message = error;
  this.log = log || error;
};

// extend Error for magical stack traces
RedisError.prototype = new Error();

// RedisClient class
var RedisClient = function() {
  this.client = null;

  var port = redisConf.port
    , host = redisConf.host
    , options = redisConf.options
    , self = this; // keep reference to this for closures

  // create a client and make appropriate bindings
  var createClient = function() {
    self.client = redis.createClient(port, host, options);

    // throw errors for express to catch
    self.client.on('error', function(err) {
      throw new RedisError('A database error occurred. Check the logs.',
                           'REDIS ERROR: ' + err);
    });

   self.client.on('end', function() {
      // If the client closes, open a new one.
      createClient.call(self);
    });
  };
  createClient();

};

RedisClient.prototype.getClient = function() {
  return this.client;
};

RedisClient.prototype.error = function(err, log) {
  throw new RedisError(err, log);
};

// methods to wrap
var methods = [
  'append',
  'auth',
  'bgrewriteaof',
  'bgsave',
  'blpop',
  'brpop',
  'brpoplpush',
  'config get',
  'config set',
  'config resetstat',
  'dbsize',
  'debug object',
  'debug segfault',
  'decr',
  'decrby',
  'del',
  'discard',
  'echo',
  'exec',
  'exists',
  'expire',
  'expireat',
  'flushall',
  'flushdb',
  'get',
  'getbit',
  'getrange',
  'getset',
  'hdel',
  'hexists',
  'hget',
  'hgetall',
  'hincrby',
  'hkeys',
  'hlen',
  'hmget',
  'hmset',
  'hset',
  'hsetnx',
  'hvals',
  'incr',
  'incrby',
  'info',
  'keys',
  'lastsave',
  'lindex',
  'linsert',
  'llen',
  'lpop',
  'lpush',
  'lpushx',
  'lrange',
  'lrem',
  'lset',
  'ltrim',
  'mget',
  'monitor',
  'move',
  'mset',
  'msetnx',
  'multi',
  'object',
  'on',
  'persist',
  'ping',
  'psubscribe',
  'publish',
  'punsubscribe',
  'quit',
  'randomkey',
  'rename',
  'renamenx',
  'rpop',
  'rpoplpush',
  'rpush',
  'rpushx',
  'sadd',
  'save',
  'scard',
  'sdiff',
  'sdiffstore',
  'select',
  'set',
  'setbit',
  'setex',
  'setnx',
  'setrange',
  'shutdown',
  'sinter',
  'sinterstore',
  'sismember',
  'slaveof',
  'smembers',
  'smove',
  'sort',
  'spop',
  'srandmember',
  'srem',
  'strlen',
  'subscribe',
  'sunion',
  'sunionstore',
  'sync',
  'ttl',
  'type',
  'unsubscribe',
  'unwatch',
  'watch',
  'zadd',
  'zcard',
  'zcount',
  'zincrby',
  'zinterstore',
  'zrange',
  'zrangebyscore',
  'zrank',
  'zrem',
  'zremrangebyrank',
  'zremrangebyscore',
  'zrevrange',
  'zrevrangebyscore',
  'zrevrank',
  'zscore',
  'zunionstore'
];

// wrap client methods
for (var i = 0, l = methods.length; i < l; ++i) {
  var method = methods[i];
  RedisClient.prototype[method] = (function(method) {
    return function() {
      this.client[method].apply(this.client, arguments);
    };
  })(method);
};

module.exports = RedisClient;
