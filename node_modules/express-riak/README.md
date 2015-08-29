# express-riak

[![Build Status](https://travis-ci.org/jussi-kalliokoski/express-riak.svg?branch=master)](https://travis-ci.org/jussi-kalliokoski/express-riak)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/express-riak.svg)](https://coveralls.io/r/jussi-kalliokoski/express-riak)

A [Riak](http://basho.com/riak/) adapter for [express-session](https://github.com/expressjs/session), built on [riakpbc](https://github.com/nlf/riakpbc).

## Installation

You can install `express-riak` via npm:

```bash
$ npm install --save express-riak
```


## Usage

Pass in the Express session module to get a constructor for a `RiakStore`:

```javascript
var Session = require("express-session");
var RiakStore = require("express-riak")(Session);

app.use(Session({
    store: new RiakStore({
        bucket: "myapp.sessions",
        connection: {
            // riakpbc options here
        },
    }),
}));
```

## Contributing

Contributions are most welcome! If you're having problems and don't know why, search the issues to see if someone's had the same issue. If not, file a new issue so we can solve it together and leave the solution visible to others facing the same problem as well. If you find bugs, file an issue, preferably with good reproduction steps. If you want to be totally awesome, you can make a PR to go with your issue, containing a new test case that fails currently!

### Development

Development is pretty straightforward, it's all JS and the standard node stuff works:

To install dependencies:

```bash
$ npm install
```

To run the tests:

```bash
$ npm test
```

Then just make your awesome feature and a PR for it. Don't forget to file an issue first, or start with an empty PR so others can see what you're doing and discuss it so there's a a minimal amount of wasted effort.

Do note that the test coverage is currently a whopping 100%. Let's keep it that way! Remember: if it's not in the requirements specification (i.e. the tests), it's not needed, and thus unnecessary bloat.
