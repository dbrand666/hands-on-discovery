"use strict";

var discovery = require('discovery-services-client');

discovery.generateAPI({
    discoveryRestFile: 'restAPI.json'
}, function (err, rest) {
    rest.users.get({
        uid: 'Leon'
    }, function (err, res) {
        if (err) {
            console.log('ERROR:' , err);
        }
        console.log(res);
    });
});
