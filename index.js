/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Schmoopiie
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var async   = require('async');
var request = require('request');

function stringifyPrimitive(v) {
    switch (typeof v) {
        case 'string': return v;
        case 'boolean': return v ? 'true' : 'false';
        case 'number': return isFinite(v) ? v : '';
        default: return '';
    }
}

function queryString(object) {
    if (object === null || !object) { object = {}; }

    return Object.keys(object).map(function (param) {
        param = encodeURIComponent(stringifyPrimitive(param));
        if (typeof object[param] === 'object') {
            return Object.keys(object[param]).map(function (subparam) {
                subparam = encodeURIComponent(stringifyPrimitive(subparam));
                return (param + '[' + subparam + ']=').toLowerCase() + encodeURIComponent(stringifyPrimitive(object[param][subparam]));
            }).join('&');
        } else {
            return param.toLowerCase() + '=' + encodeURIComponent(stringifyPrimitive(object[param]));
        }
    }).join('&');
}

function call(opt, db, callback) {
    var channel        = typeof opt.channel !== 'undefined' ? opt.channel : 'no_channel_specified';
    var method         = typeof opt.method !== 'undefined' ? opt.method : 'GET';
    var options        = typeof opt.options !== 'undefined' ? opt.options : {};
    var path           = typeof opt.path === 'string' ? opt.path : '';
    var requestOptions = {};
    var token          = '';

    if (channel !== null) { channel = channel.toLowerCase().replace('#', ''); }

    callback = typeof callback === 'function' ? callback : function () {};

    async.series([
            function(cb){
                if (db !== null && typeof db !== 'function') {
                    db.where('tokens', {channel: channel}).then(function (result) {
                        if (result.items.length >= 1) {
                            token = result.items[0].token;
                        }
                        cb(null);
                    });
                } else { cb(null); }
            },
            function(cb){
                if (channel !== 'no_channel_specified' && token === '') { token = channel; }

                options = queryString(options);

                requestOptions = {
                    url: 'https://api.twitch.tv/kraken' + path + (options ? '?' + options : ''),
                    headers: {
                        'Accept':    'application/vnd.twitchtv.v3+json',
                        'Client-ID': ''
                    },
                    method: method
                };

                if (token !== '') { requestOptions.headers['Authorization'] = 'OAuth ' + token; }

                cb(null);
            }
        ],
        function() {
            request(requestOptions, function (error, response, body) {
                if (error) {
                    if (typeof db === 'function') { return db.call(this, error); }
                    return callback.call(this, error);
                }

                try { body = JSON.parse(body); }
                catch (error) {
                    if (typeof db === 'function') { return db.call(this, error); }
                    return callback.call(this, error);
                }

                if (typeof db === 'function') { return db.call(this, null, response.statusCode, body); }
                return callback.call(this, null, response.statusCode, body);
            });
        });
}

exports.call = call;