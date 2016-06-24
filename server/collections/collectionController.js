var request = require('request-promise');
var instagramToken = require('./../config/tokenConfig.js').instagramAPIToken;

// var endComparator;

var getCollection = function(req, res, next) {
  var tagName = req.params.tag_name || "Test";
  var startTime = req.query.start_time;
  var endTime = req.query.end_time;
  
};

var saveCollection = function(req, res, next) {

};

var instagramRequest = function(tagName, maxTagID) {
  var options = {
    url: 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent',
    qs: {access_token: instagramToken, count: 50},
    method: 'GET',
  };

  console.log('/ GET REQUEST -', options.url);

  if (maxTagID) {
    options.qs.max_tag_id = maxTagID;
  }

  return request(options)
  .then(function (body) {
    return JSON.parse(body);
  })
  .catch(function(err) {
    console.log('Request ERROR: ', err);
  });
};

var instagramPaginate = function(nextURL) {
  var options = {
    url: nextURL,
    method: 'GET'
  };

  console.log('/ GET REQUEST -', options.url);

  return request(options)
  .then(function (body) {
    return JSON.parse(body);
  })
  .catch(function(err) {
    console.log('Request ERROR: ', err);
  });
};

var getByTimeFrame = function(tagName, startTime, endTime) {

  var endIndex;

  instagramRequest(tagName)
  .then(function(body) {
    // endComparator = 0;
    endIndex = doesContainEnd(endTime, body.data);
    if (endIndex >= 0) {
      return console.log(endIndex, body.data[endIndex]);
    }
    else if (body.pagination.next_url) {

      return innerFunction(body.pagination.next_url, endTime);
    }
    else {
      return {};
    }
  });

};

var innerFunction = function(nextURL, endTime) {

  var endIndex;

  instagramPaginate(nextURL)
  .then(function(body) {
    endIndex = doesContainEnd(endTime, body.data);
    if (endIndex >= 0) {
      // return {body: body, endIndex: endIndex};
      return console.log(endIndex, body.data[endIndex]);
    }
    else if (body.pagination.next_url) {

      return innerFunction(body.pagination.next_url, endTime);
    }
    else {
      return {};
    }

  });
};

var doesContainEnd = function(endTime, data) {

  var createTime;
  var endComparator = 0;
  // var endComparator = parseInt(data[data.length - 1].created_time, 10) * 1000;

  // We run into the problem that we have no way of easily knowing if the given
  // created_time is not

  for (var i = data.length - 1; i >= 0; i--) {

    createTime = parseInt(data[i].created_time, 10) * 1000;

    console.log(endTime, createTime, endComparator);

    if (createTime >= endComparator) {

      if (createTime <= endTime) {
        return i;
      }
      else {
        endComparator = createTime;
      }

    }

  }

  return -1;
}

getByTimeFrame("Unicorn", 0, Date.parse("6/24/2016 08:00:00"));

module.exports = {
  getCollection: getCollection,
  saveCollection: saveCollection,
}