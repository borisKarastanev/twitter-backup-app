/**
 * Created by boris on 7/18/16.
 */
var app = angular.module('twitterBackup', [
    'ngSanitize', 'ngRoute', 'twitterBackup.services'
]);

// App routing
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl:'timeline.html'
    }).when('/favoriteUsers', {
        templateUrl: 'favorite_users.html'

    }).when('/favoriteUsers/tweets',{
        templateUrl: 'favorite_user_timeline.html'

    }).when('/favoritePosts',{
        templateUrl: 'favorite_posts.html'

    }).otherwise({
        redirectTo: '/'
    });
});