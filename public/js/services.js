/**
 * Created by boris on 7/18/16.
 */
/**
 * @description Angular shared services
 */
angular.module('twitterBackup.services', []).factory('twitterService', function ($q, $http) {
    var authorized = false;
    var accountId = null;

    return {
        initialize: function () {
            OAuth.initialize('K82vp_nHrvfipJP_UMYQgNVLe90', {
                cache: true
            });
            authorized = OAuth.create('twitter');
        },
        isReady: function () {
            return (authorized);
        },
        connectTwitter: function () {
            var defer = $q.defer();
            OAuth.popup('twitter', {
                cache: true
            }, function (err, result) {
                if (err) {
                    alert(err);
                } else {
                    authorized = result;
                    defer.resolve();
                }
            });
            return defer.promise;
        },
        clearCache: function () {
            OAuth.clearCache('twitter');
            authorized = false;
        },
        storeAccountId: function (id) {
            accountId = id;
        },
        // Get API
        getLatestTweets: function (maxId) {
            var defer = $q.defer();
            var url = '/1.1/statuses/home_timeline.json';

            if (maxId) {
                url += '?max_id=' + maxId;
            }
            var promise = authorized.get(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getFavoriteTweets: function () {
            var defer = $q.defer();
            var url = '/1.1/favorites/list.json';
            var promise = authorized.get(url).done(function (data) {
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
            var promise = authorized.get(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getUserAccountData: function (screen_name) {
            var defer = $q.defer();
            var url = '/1.1/users/show.json?screen_name=' + screen_name;
            var promise = authorized.get(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getFavUserTimeline: function () {
            var defer = $q.defer();
            var url = '/1.1/statuses/user_timeline.json?user_id=' + accountId;
            var promise = authorized.get(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        //Create API
        addPostToFavoriteTweets: function (pid) {
            var defer = $q.defer();
            var url = '/1.1/favorites/create.json?id=' + pid;

            var promise = authorized.post(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },

        //Remove API
        removeFromFavoritePosts: function (pid) {
            var defer = $q.defer();
            var url = '/1.1/favorites/destroy.json?id=' + pid;

            var promise = authorized.post(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        //Posts interaction API
        retweetUserPost: function (pid) {
            var defer = $q.defer();
            var url = '/1.1/statuses/retweet/' + pid + '.json';
            var promise = authorized.post(url).done(function (data) {
                defer.resolve(data);
            }).fail(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },

        //Database API
        getAllFavoritesUsers: function (uid) {
            var defer = $q.defer();
            var _url = '/api/v1/favoriteUsers/' + uid;
            var promise = $http.get(_url).then(function (data) {
                defer.resolve(data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        addNewUserToFavorites: function (newUser) {
            var defer = $q.defer();
            var _url = '/api/v1/favoriteUsers/' + newUser.user_id;

            var promise = $http.post(_url, newUser).then(function (data) {
                defer.resolve(data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        delUserFromFavoriteUsers: function (delUser) {
            var defer = $q.defer();
            var _url = '/api/v1/favoriteUsers/delUser/' + delUser.uid;

            var promise = $http.post(_url, delUser).then(function (data) {
                defer.resolve(data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    }
});