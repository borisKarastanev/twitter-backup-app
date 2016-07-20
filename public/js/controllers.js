/**
 * Created by boris on 7/18/16.
 */

app.controller('appController', function ($scope, $http, $q, twitterService) {
    $scope.tweets = [];
    twitterService.initialize();

    $scope.refreshTimeline = function (maxId) {
        twitterService.getLatestTweets(maxId).then(function (data) {
            $scope.tweets.length = 0;
            $scope.tweets = $scope.tweets.concat(data);
        }, function () {
            $scope.rateLimitError = true;
        });
    };

    $scope.getFavPosts = function () {
        twitterService.getFavoriteTweets().then(function (data) {
            $scope.tweets.length = 0;
            $scope.tweets = $scope.tweets.concat(data);
        }, function (err) {
            console.log(err);
        });
    };

    $scope.connectBtn = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {
                $('#connectBtn').fadeOut(function () {
                    $('#getTimelineBtn, #signOut, #getFavoritesBtn, ' +
                            '#getFavoritePostsBtn').fadeIn();
                    $scope.refreshTimeline();
                    $scope.connectedTwitter = true;
                });
            } else {

            }
        });
    };
    $scope.signOut = function () {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#getTimelineBtn, #signOut, #getFavoritesBtn, ' +
                '#getFavoritePostsBtn').fadeOut(function () {
            $('#connectBtn').fadeIn();
            $scope.$apply(function () {
                $scope.connectedTwitter = false;
            })
        });

    };

    if (twitterService.isReady()) {
        $('#connectBtn').hide();
        $('#getTimelineBtn, #signOut').show();
        $scope.connectedTwitter = true;
        $scope.refreshTimeline();
    }
});

app.controller('favController', function ($scope, $http, $q, twitterService) {
    $scope.favorites = [];
    twitterService.initialize();
    $scope.userId = null;

    $scope.getFavList = function () {
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
            console.log(err);
        });
    };

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
            })
            $scope.getFavList();
        }, function (err) {
            console.log(err.responseJSON.errors[0].message);
            $('#addNewUserInput').val(err.responseJSON.errors[0].message);
        });
    }
});