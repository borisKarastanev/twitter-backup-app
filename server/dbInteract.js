/**
 * Created by boris on 7/19/16.
 */
var Everlive = require('everlive-sdk');

var db = new Everlive('xeobdoeq5x6vniee');

function DbInteract() {

}

DbInteract.prototype.getAllFavUsers = function (uid) {
    var accounts = db.data('fav_twitter_accounts');
    var _usrId = parseInt(uid);
    var query = new Everlive.Query();
    query.where().eq('user_id', _usrId).done().select('account_id', 'account_name');
    return new Promise(function (resolve, reject) {
        accounts.get(query).then(function (data) {
            console.log('Query result ', data.result);
            resolve(data.result);
        }, function (err) {
            reject(new Error(err));
        });
    });
};

module.exports = DbInteract;