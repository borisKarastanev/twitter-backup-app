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

    $scope.getFavList = function (maxId) {
        twitterService.getUserCredentials().then(function (userData) {
            var _usrId = userData.id_str;
            var _url = '/api/v1/favoriteUsers/' + _usrId;
            $http.get(_url).then(function (res) {
                console.log('Server data ', res);
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
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