var angular = require('angular');

// module.exports = ['$scope', function($scope) {
//   $scope.test = "test";
// }];
// .controller('SearchController', function($scope) {
//   $scope.test = "Done";
// });

angular.module('pixleeApp')
.controller('SearchController', ['$scope', 'Requests', function($scope, Requests) {
  $scope.test = 'Done';

  $scope.submit = function() {


    // console.log($scope.search.startTime.getHours());

    // var query = {
    //   tagName: $scope.search.tagName,
    //   startTime : $scope.search.startDate.setHours($scope.search.startTime.getHours(), $scope.search.startTime.getMinutes()),
    //   endTime : $scope.search.endDate.setHours($scope.search.endTime.getHours(), $scope.search.endTime.getMinutes())
    // };

    query = {
      tagName: 'Unicorn',
      startTime : '1466827200000',
      endTime: '1466830800000'
    };


    console.log(query);
    return Requests.getCollection(query)
    .then(function(data) {
      $scope.test = data;
    });

  };

}]);

require('../services.js');