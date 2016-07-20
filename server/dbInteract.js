/**
 * Created by boris on 7/19/16.
 */
var Everlive = require('everlive-sdk');
var collections = {
    db_status: 'check_status',
    fav_accounts: 'fav_twitter_accounts'
};

function DbInteract() {
}

/**
 * @description A method for initialing and testing the database connection
 * @param key {String} - App ID
 */
DbInteract.prototype.init = function (key) {
    this.db = new Everlive(key);
    var testDb = this.db.data(collections.db_status);
    testDb.get(null).then(function (status) {
        var _status = status.result[0].is_alive;
        if (status !== null && _status === true) {
            console.log('Database connection created');
        }
    }, function (err) {
        console.error(err);
    });
};

/**
 * @description A method for querying all favorite users from the database
 * @param uid {String}
 * @returns {Promise}
 */
DbInteract.prototype.getAllFavUsers = function (uid) {
    var accounts = this.db.data(collections.fav_accounts);
    var _usrId = parseInt(uid);
    var query = new Everlive.Query();
    query.where().eq('user_id', _usrId).done().select(
            'account_id', 'account_name', 'profile_img_url', 'description'
    );
    return new Promise(function (resolve, reject) {
        accounts.get(query).then(function (data) {
            resolve(data.result);
        }, function (err) {
            reject(new Error(err));
        });
    });
};

/**
 * @description A method for adding new favorite user to the db collection
 * @param accountDetails {Object}
 * @returns {Promise}
 */
DbInteract.prototype.createFavUser = function (accountDetails) {
    accountDetails.user_id = parseInt(accountDetails.user_id);
    console.log(accountDetails);
    var accounts = this.db.data(collections.fav_accounts);
    return new Promise(function (resolve, reject) {
        accounts.create(accountDetails).then(function (response) {
            resolve(response);
        }, function (err) {
            console.error(err);
            reject(err);
        });
    });
};


/**
 * @description A method for deleting favorite users from a db collection
 * @param details {Object}
 */
DbInteract.prototype.removeFavUser = function (details) {
    console.log(this.db);
    var _usrId = parseInt(details.uid);
    var _accountId = parseInt(details.aid);
    var accounts = this.db.data(collections.fav_accounts);
    var query = new Everlive.Query();
    query.where().eq('user_id', _usrId).eq('account_id', _accountId);
    return new Promise(function (resolve, reject) {
        accounts.destroySingle(query).then(function (data) {
            console.log(data);
            resolve(data);
        }, function (err) {
            console.error(err);
            reject(err);
        });
    });
};

module.exports = DbInteract;