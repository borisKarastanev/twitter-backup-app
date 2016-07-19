/**
 * Created by boris on 7/18/16.
 */
angular.module('twitterBackup.services', []).factory('twitterService', function ($q) {
    var authorized = false;

    return {
        initialize: function () {
            OAuth.initialize('K82vp_nHrvfipJP_UMYQgNVLe90', {
               cache: true
            });
            authorized = OAuth.create('twitter');
        },
        isReady: function() {
            return (authorized);
        },
        connectTwitter: function() {
            var defer = $q.defer();
            OAuth.popup('twitter', {
                cache: true
            }, function(err, result) {
                if(err) {
                    alert(err);
                } else {
                    authorized = result;
                    defer.resolve();
                }
            });
            return defer.promise;
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            authorized = false;
        },
        getLatestTweets: function (maxId) {
            var defer = $q.defer();
            var url = '/1.1/statuses/home_timeline.json';

            if (maxId) {
                url += '?max_id=' + maxId;
            }
            var promise = authorized.get(url).done(function(data) {
                console.log('Fav tweets ', data);
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getFavoriteTweets: function (maxId) {
            var defer = $q.defer();
            var url = '/1.1/favorites/list.json';
            var promise = authorized.get(url).done(function(data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getUserCredentials: function () {
            var token = authorized.oauth_token;
            var defer = $q.defer();
            var url = '/1.1/account/verify_credentials.json?' + token;
            var promise = authorized.get(url).done(function(data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    }
});