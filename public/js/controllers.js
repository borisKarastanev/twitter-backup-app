/**
 * Created by boris on 7/18/16.
 */

app.controller('appController', function ($scope,$http, $q, twitterService) {
    $scope.tweets = [];
    twitterService.initialize();

    $scope.refreshTimeline = function (maxId) {
        twitterService.getLatestTweets(maxId).then(function (data) {
            $scope.tweets = $scope.tweets.concat(data);
        }, function () {
            $scope.rateLimitError = true;
        });
    };

    $scope.getFavList = function (maxId) {
        $http.get('http://api.everlive.com/v1/xeobdoeq5x6vniee/favorite_tweeter_users').then(function(result){
            console.log(result);
        }, function(err) {
            console.log(err);
        });
        twitterService.getFavoriteTweets(maxId).then(function (data) {
            $scope.tweets.length = 0;
            $scope.tweets = $scope.tweets.concat(data);
        }, function () {
            $scope.rateLimitError = true;
        });
    };

    $scope.connectBtn = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {
                $('#connectBtn').fadeOut(function () {
                    $('#getTimelineBtn, #signOut').fadeIn();
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
        $('#getTimelineBtn, #signOut').fadeOut(function () {
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