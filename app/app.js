var angular = require('angular');

var ui_router = require('angular-ui-router');

const app = angular.module('pixleeApp', [ui_router])
// .controller('SearchController', function($scope) {

// })
.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/search');

  $stateProvider
  .state('/search', {
    url: '/search',
    templateUrl: 'html/search.html',
    controller: 'SearchController',
  })
  // $routeProvider
  // .when('/search', {
  //   templateURL: 'html/search.html',
  //   controller: 'SearchController',
  // })
  // .when('/collection', {
  //   templateURL: 'html/collection.html',
  //   controller: 'CollectionController',
  // })
  // .otherwise({redirectTo: '/search'}); 
})

require('./search/search.js');