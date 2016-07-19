/**
 * Created by boris on 7/19/16.
 */
var Everlive = require('everlive-sdk');

var db = new Everlive('xeobdoeq5x6vniee');

function DbInteract() {

}

DbInteract.prototype.getAllFavUsers = function (uid, callback) {
    var accounts = db.data('fav_twitter_accounts');
    var _usrId = parseInt(uid);
    console.log('usr id ', _usrId);
    var filter = {
        'usr_id': _usrId
    };
    accounts.get(filter).then(function (data) {
        console.log(data);
        callback(null, data);
    }, function (err) {
        callback(err);
    });
};

module.exports = DbInteract;