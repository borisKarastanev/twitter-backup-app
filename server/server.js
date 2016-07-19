/**
 * Created by boris on 7/15/16.
 */


// Node core modules
var path = require('path');

// Express modules
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var router = express.Router();

// App modules

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

router.use(function (req, res, next) {
    next();
});

app.use('/api', router);
app.listen(3000);


