/**
 *
 * User: leon
 * Date: 10/17/12
 * Time: 4:23 PM
 *
 */

'use strict';

console.log('\nHow to test:\n');
console.log('curl -i -X GET http://localhost:3000/users');
console.log('curl -i -X DELETE http://localhost:3000/users');
console.log('curl -i -X GET http://localhost:3000/users/Leon');
console.log('curl -i -X GET http://localhost:3000/users/Leon/pets');
console.log('curl -i -X GET http://localhost:3000/users/Leon/pets/Jack');
console.log('curl -i -X DELETE http://localhost:3000/users/Leon/pets/Jack');
console.log('\n');

console.log('... not yet ...');
console.log('curl -i -X POST -H \'Content-Type: application/json\' -d\'{"name": "New Wine", "year": "2009"}\' http://localhost:3000/wines');
console.log('curl -i -X PUT -H \'Content-Type: application/json\' -d\'{"name": "New Wine", "year": "2010"}\'http://localhost:3000/wines/5069b47aa892630aae000007');
console.log('\n');


var express = require('express');
var verbose = process.env.NODE_ENV != 'test';
var app = module.exports = express();



app.map = function(map, route) {
    route = route || '';

    Object.keys(map).some(function (key) {
        var handler = map[key];

        switch (typeof handler) {
            // { '/path': { ... }}
            case 'object':
                app.map(handler, route + key);
                break;

            // get: function(){ ... }
            case 'function':
                app[key](route, function (req, res) {
                    handler(req, res);
                });
                break;
        }
    });
};


var users = {
    list: function(req, res) {
        res.send('user list\n');
    },

    get: function(req, res) {
        res.send('user ' + req.param('uid') + '\n');
    },

    del: function(req, res) {
        res.send('delete users\n');
    }
};

var pets = {
    list: function(req, res) {
        res.send('user ' + req.param('uid') + '\'s pets\n');
    },

    get: function(req, res) {
        res.send('user ' + req.param('uid') + '\'s pet ' + req.param('pid')
+ '\n');
    },

    del: function(req, res) {
        res.send('delete ' + req.param('uid') + '\'s pet ' +
req.param('pid') + '\n');
    }
};


app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use('/public',express.static('./public'));

app.map(
    {
        '/': {
            get: function (req, res) { res.send('root\n');  }
        },
        '/users': {
            get: users.list,
            del: users.del,
            '/:uid': {
                get: users.get,
                '/pets': {
                    get: pets.list,
                    '/:pid': {
                        del: pets.del,
                        get: pets.get
                    }
                }
            }
        },
        '/other': {
            '/stuff': {
                '/done': {
                    get: function(req, res) { res.send('other!\n'); }
                }
            }
        }
    }
);


app.listen(3000);
