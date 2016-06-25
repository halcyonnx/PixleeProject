var angular = require('angular');

angular.module('pixleeApp')
.factory('Requests', ['$http', function($http) {

  var getCollection = function(query) {
    return $http({
      url: '/collections/' + query.tagName,
      method: 'GET',
      params: {start_time: query.startTime, end_time: query.endTime},
    })
    .then(function(res) {
      console.log(res.data);
      return res.data;
    })
  }

  return {
    getCollection: getCollection,
  };

}])