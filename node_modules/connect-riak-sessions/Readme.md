# Connect Riak Sessions
[![Build Status](https://travis-ci.org/randysecrist/connect-riak-sessions.png)](https://travis-ci.org/randysecrist/connect-riak-sessions)
[![Gem Version](https://badge.fury.io/js/connect-riak-sessions.png)](http://badge.fury.io/js/connect-riak-sessions)

connect-riak-sessions is a Riak session store implemented as middleware for [connect](https://github.com/senchalabs/connect) & [expressjs](https://github.com/visionmedia/express) backed by [nodiak](https://github.com/nathanaschbacher/nodiak).  Any version of Riak will work.

For extra bang for your buck; see automatic key expiration using [bitcask](http://docs.basho.com/riak/latest/ops/advanced/backends/bitcask).

connect-riak-sessions `>= 0.0.1` developed on connect `2.9.2`.

## Installation

	  $ npm install connect-riak-sessions

## Options

  - `client` An existing nodiak client object you normally get from `riak.getClient()`
  - `bucket` Riak bucket to use defaulting to `expressjs_sessions`
  - `scheme` Riak scheme ('http'|'https')
  - `host` Riak server hostname
  - `port` Riak server tcp port #
  - ...    Remaining options passed to the riak `getClient()` method.

## Usage

To use with Connect or a Test Framework:

    var connect = require('express-session'),
        RiakStore = require('connect-riak-sessions')(connect);

    connect().use(connect.session({
      secret: 'keyboard cat',
      store: new RiakStore(options)
    }));

To use with ExpressJS:

    var RiakStore = require('connect-riak-sessions')(express);

    // Configure Middleware
    app.use(express.session({
      store: new RiakSessionStore({
        bucket: 'app_session_bucket',
        scheme: 'http',
        host: 'localhost',
        port: 8098,
      }),
      secret: 'keyboard cat'
    }));

## API Docs

The [API Docs](https://github.com/randysecrist/connect-riak-sessions/blob/master/API.md) are generated using [Dox](https://github.com/visionmedia/dox).

# License

  MIT
