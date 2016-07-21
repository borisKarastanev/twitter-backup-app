/**
 * Created by boris on 7/18/16.
 */
'use strict';

/**
 * @description App main controller
 */
app.controller('appController', function ($scope, $http, $q, twitterService) {
    $scope.tweets = [];
    twitterService.initialize();

    /**
     * @description When invoked, the method refreshes the user timeline
     * @param maxId
     */
    $scope.refreshTimeline = function (maxId) {
        twitterService.getLatestTweets(maxId).then(function (data) {
            $scope.tweets.length = 0;
            $scope.tweets = $scope.tweets.concat(data);
        }, function () {
            $scope.rateLimitError = true;
        });
    };

    /**
     * @description Method for re-twitting posts
     */
    $scope.retweetPost = function () {
        var _pid = this.tweet.id_str;
        twitterService.retweetUserPost(_pid).then(function (data) {
            if (data.retweeted === true) {
                alert('Successfully retweted post to timeline');
            }
        }, function (err) {
            console.log(err.responseJSON.errors[0].message);
        });
    };

    /**
     * @description The method adds a user to the favorite list
     */
    $scope.addToFavoriteTweets = function () {
        var _pid = this.tweet.id_str;
        twitterService.addPostToFavoriteTweets(_pid).then(function (data) {
            if (data.favorited === true) {
                alert('Successfully saved in favorites');
            }
        }, function (err) {
            console.log(err.responseJSON.errors[0].message);
        });
    };

    /**
     * @description Login method
     */
    $scope.connectBtn = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {
                $('#connectBtn, #login-msg').fadeOut(function () {
                    $('#getTimelineBtn, #signOut, #getFavoritesBtn, ' +
                            '#getFavoritePostsBtn').fadeIn();
                    $scope.refreshTimeline();
                    $scope.connectedTwitter = true;
                });
            } else {

            }
        });
    };
    /**
     * @description Logout method
     */
    $scope.signOut = function () {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#getTimelineBtn, #signOut, #getFavoritesBtn, ' +
                '#getFavoritePostsBtn').fadeOut(function () {
            $('#connectBtn, #login-msg').fadeIn();
            $scope.$apply(function () {
                $scope.connectedTwitter = false;
            });
        });
        $scope.rateLimitError = false;
    };

    // Handle those pesky already logged or returning users
    if (twitterService.isReady()) {
        $('#connectBtn, #login-msg').hide();
        $('#getTimelineBtn, #signOut, #getFavoritesBtn, ' +
                '#getFavoritePostsBtn').show();
        $scope.connectedTwitter = true;
        $scope.refreshTimeline();
    }
});

/**
 * @description Favorites controller DB API
 */
app.controller('favController', function ($scope, $http, $q, $location, twitterService) {
    $scope.favorites = [];
    twitterService.initialize();
    $scope.userId = null;

    // Handle bogus url attempts
    if (!twitterService.isReady()) {
        $location.path('#/');
    }

    /**
     * @description Get all favorite accounts Method
     */
    $scope.getFavList = function () {
        // Get current logged user id
        twitterService.getUserCredentials().then(function (userData) {
            $scope.userId = userData.id_str;
            var _url = '/api/v1/favoriteUsers/' + $scope.userId;
            $http.get(_url).then(function (result) {
                var serverResult = result.data;
                $scope.favorites.length = 0;
                $scope.favorites = $scope.favorites.concat(serverResult);
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            alert(err.responseJSON.errors[0].message);
            console.log(err);
        });
    };

    /**
     * @description Add new user to Everlive db
     * @param user {String}
     */
    $scope.addNewUser = function (user) {
        twitterService.getUserAccountData(user).then(function (data) {
            $('#addNewUserInput').val('');
            var newUserData = {
                user_id: $scope.userId,
                description: data.description,
                account_id: data.id,
                account_name: data.name,
                profile_img_url: data.profile_image_url
            };
            try {
                newUserData = JSON.stringify(newUserData);
            } catch (err) {
                alert(err);
            }
            var _url = '/api/v1/favoriteUsers/' + $scope.userId;
            $http.post(_url, newUserData).then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
                alert(err.responseJSON.errors[0].message);
                $scope.rateLimitError = true;
            });
            $scope.getFavList();
        }, function (err) {
            console.log(err.responseJSON.errors[0].message);
            $('#addNewUserInput').val(err.responseJSON.errors[0].message);
        });
    };

    /**
     * @description Method for removing users from the database collection
     */
    $scope.deleteUser = function () {
        var deleteUserDetails = {
            uid: $scope.userId,
            aid: this.fav.account_id
        };

        try {
            deleteUserDetails = JSON.stringify(deleteUserDetails);
        } catch (err) {
            alert(err);
        }
        var _url = '/api/v1/favoriteUsers/delUser/' + $scope.userId;
        $http.post(_url, deleteUserDetails).then(function (response) {
            console.log('Del response ', response.data.success);
            alert(response.data.success);
        }, function (err) {
            console.log(err);
            alert(err.responseJSON.errors[0].message);
        });
        $scope.getFavList();
    };

    $scope.storeAid = function () {
        twitterService.storeAccountId(this.fav.account_id);
    }

});

/**
 * @description Favorite user tweets controller
 */
app.controller('favUserTweets', function ($scope, $http, $q, $location, twitterService) {
    $scope.favUserTweets = [];
    $scope.favAccountName = '';

    if (!twitterService.isReady()) {
        $location.path('#/');
    }

    /**
     * @description Get all favorite users tweets
     */
    $scope.getFavUserTweets = function () {
        twitterService.getFavUserTimeline().then(function (data) {
            $scope.favUserTweets.length = 0;
            $scope.favUserTweets = $scope.favUserTweets.concat(data);
            $scope.favAccountName += data[0].user.name;
        }, function (err) {
            console.log(err);
            alert(err.responseJSON.errors[0].message);
            $scope.rateLimitError = true;
        });
    };

    /**
     * @description retweet post
     */
    $scope.retweetPost = function () {
        var _pid = this.tweet.id_str;
        twitterService.retweetUserPost(_pid).then(function (data) {
            if (data.retweeted === true) {
                alert('Successfully retweted post to timeline');
            }
        }, function (err) {
            console.log(err.responseJSON.errors[0].message);
            alert(err.responseJSON.errors[0].message);
        });
    };

    /**
     * @description Add to favorites(all liked tweets)
     */
    $scope.addToFavoriteTweets = function () {
        var _pid = this.tweet.id_str;
        twitterService.addPostToFavoriteTweets(_pid).then(function (data) {
            if (data.favorited === true) {
                alert('Successfully saved in favorites');
            }
        }, function (err) {
            console.log(err.responseJSON.errors[0].message);
        });
    }
});

/**
 * @description Favorite tweets controller
 */
app.controller('favPosts', function ($scope, $http, $q, $location, twitterService) {
    $scope.posts = [];
    /**
     * @description Get all liked tweets
     */
    $scope.getFavPosts = function () {
        twitterService.getFavoriteTweets().then(function (data) {
            $scope.posts.length = 0;
            $scope.posts = $scope.posts.concat(data);
        }, function (err) {
            console.log(err);
            alert(err.responseJSON.errors[0].message);
        });
    };

    /**
     * @description Remove from liked list
     */
    $scope.removePost = function () {
        var _pid = this.post.id_str;
        twitterService.removeFromFavoritePosts(_pid).then(function (data) {
            if (data.favorited === false) {
                alert('Successfully saved in favorites');
            }
        }, function (err) {
            console.log(err);
            alert(err.responseJSON.errors[0].message);
        });
        $scope.getFavPosts();
    }
});
