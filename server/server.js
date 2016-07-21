/**
 * Created by boris on 7/15/16.
 */

'use strict';
// Node core modules
var path = require('path');
var fs = require('fs');

// Express modules
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var router = express.Router();
//Parse Config file

try {
    var config = JSON.parse(fs.readFileSync(
                    path.join(process.cwd(), 'config.json'), 'utf8')
    );
} catch (err) {
    console.error(new Error(err));
}

// App modules
var DbInteract = require(path.join(__dirname, 'dbInteract'));
var db = new DbInteract();

// Initialize the database
db.init(config.everlive_key);

app.use(express.static(path.join(process.cwd(), config.static_dir)));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

router.use(function (req, res, next) {
    next();
});


//Router API
router.route('/favoriteUsers/:uid')
        .get(function (req, res) {
            db.getAllFavUsers(req.params.uid).then(function (data) {
                res.json(data);
            }, function (err) {
                res.json(err);
            });
        })
        .post(function (req, res) {
            db.createFavUser(req.body).then(function (data) {
                res.json(data);
            }, function (err) {
                res.json(err);
            });
        });

router.route('/favoriteUsers/delUser/:uid')
        .post(function (req, res) {
            db.removeFavUser(req.body).then(function (data) {
                res.json(data);
            }, function (err) {
                res.json(err);
            });
        });

// Requests entry point (/api/v1)
app.use('/api/v1', router);
app.listen(config.port);
console.log('App is running at port:', config.port);


