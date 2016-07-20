/**
 * Created by boris on 7/15/16.
 */


// Node core modules
var path = require('path');
var fs = require('fs');

// Express modules
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var router = express.Router();

// App modules
var DbInteract = require(path.join(__dirname, 'dbInteract'));
var db = new DbInteract();

//Parse Config file

try {
    var config = JSON.parse(fs.readFileSync(
                    path.join(process.cwd(), 'config.json'), 'utf8')
    );
} catch (err) {
    console.error(new Error(err));
}

app.use(express.static(path.join(process.cwd(), config.static_dir)));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

router.use(function (req, res, next) {
    next();
});

router.route('/favoriteUsers/:uid')
        .get(function (req, res) {
            db.getAllFavUsers(req.params.uid).then(function (data) {
                res.json(data);
            }, function (err) {
                res.json(err);
            });
        })
        .post(function (req, res) {

        });

app.use('/api/v1', router);
app.listen(config.port);
console.log('App is running at port:', config.port);


