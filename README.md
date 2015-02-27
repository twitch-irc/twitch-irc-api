# twitch-irc-api
[![Npm Version](http://img.shields.io/npm/v/twitch-irc-api.svg?style=flat)](https://www.npmjs.org/package/twitch-irc-api) [![Issues](http://img.shields.io/github/issues/twitch-irc/twitch-irc-api.svg?style=flat)](https://github.com/twitch-irc/twitch-irc-api/issues)

## Installation

```bash
$ npm install --save twitch-irc-api
```

## Configuration

```javascript
var irc = require('twitch-irc');

var clientOptions = {
    options: {
        exitOnError: false,
        database: './data',
    },
    channels: ['schmoopiie']
};

var client = new irc.client(clientOptions);
var db     = require('twitch-irc-db')(clientOptions);

var api    = require('twitch-irc-api');

var apiOptions = {
    channel: 'schmoopiie',
    method: 'GET',
    path: '/users/schmoopiie',
    options: {}
};

// Passing the db is optional.
api.call(apiOptions, db, function(err, statusCode, response) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Status code: ' + statusCode);
    console.log('Response from Twitch API:');
    console.log(JSON.stringify(response));
})
```

## Contributing Guidelines

Please review the [guidelines for contributing](https://github.com/twitch-irc/twitch-irc-api/blob/master/CONTRIBUTING.md) to this repository.

## Support

Feel free to [create an issue](https://github.com/twitch-irc/twitch-irc-api/issues/new). We are active on the development of twitch-irc and it's modules and we respond to each and every issues. When submitting an issue, please include your Node/NPM versions, your operating system and the log file or the error message. Please, do your best to explain how to reproduce the issue.

## License

The MIT License (MIT)

Copyright (c) 2015 Schmoopiie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
