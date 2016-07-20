/**
 * Created by boris on 7/18/16.
 */
var app = angular.module('twitterBackup', [
    'ngSanitize', 'ngRoute', 'twitterBackup.services'
]);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl:'timeline.html'
    }).when('/favoriteUsers', {
        templateUrl: 'favorite_users.html'

    }).otherwise({
        redirectTo: '/'
    })
});