/*!
 * Connect - Riak Sessions
 * Copyright(c) 2013 Randy Secrist <randy.secrist@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var riak = require('nodiak')
  , debug = require('debug')('connect:riak');

/**
 * Return the `RiakStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function(connect){

  /**
   * Connect's Store.
   */

  var Store = connect.Store;

  /**
   * Initialize RiakStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function RiakStore(options) {
    var self = this;

    options = options || {};
    Store.call(this, options);
    this.bucket = null == options.bucket
      ? 'expressjs_sessions'
      : options.bucket;

    debug('USING %s://%s:%s', options.scheme, options.host, options.port)
    this.client = options.client || new riak.getClient(options.scheme, options.host, options.port);
  };

  /**
   * Inherit from `Store`.
   */

  RiakStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  RiakStore.prototype.get = function(sid, fn){
    debug('GET "%s"', sid);
    var my_obj = this.client.bucket(this.bucket).objects.new(sid);
    my_obj.fetch(function(err, obj) {
      debug('GOT %s', obj.data);
      try {
        result = JSON.parse(obj.data); 
      }
      catch (err) {
        result = null;
      }
      return fn(null, result);
    });
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  RiakStore.prototype.set = function(sid, sess, fn){
    try {
      var maxAge = sess.cookie.maxAge
        , ttl = this.ttl
        , sess = JSON.stringify(sess);

      ttl = ttl || ('number' == typeof maxAge
          ? maxAge / 1000 | 0
          : 86400); // oneDay in seconds

      debug('SET "%s" ttl:%s %s', sid, ttl, sess);
      var my_obj = this.client.bucket(this.bucket).objects.new(sid, sess);
      my_obj.save(function(err, obj) {
          err || debug('SET complete');
          fn && fn.apply(this, arguments);
      });
    }
    catch (err) {
      fn && fn(err);
    }
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  RiakStore.prototype.destroy = function(sid, fn){
    debug('DESTROY "%s"', sid);
    var my_obj = this.client.bucket(this.bucket).objects.new(sid);
    my_obj.delete(function(err, obj) {
        debug('DESTROY complete');
    });
  };

  return RiakStore;
};
