var angular = require('angular');

// module.exports = ['$scope', function($scope) {
//   $scope.test = "test";
// }];
// .controller('SearchController', function($scope) {
//   $scope.test = "Done";
// });

angular.module('pixleeApp')
.controller('SearchController', ['$scope', function($scope) {
  $scope.test = 'Done';
}]) ;