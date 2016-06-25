var request = require('request-promise');
var instagramToken = require('./../config/tokenConfig.js').instagramAPIToken;

// var endComparator;

// API Calls //////////////////////////////////////////////////////////////////

var getCollection = function(req, res, next) {
  var tagName = req.params.tag_name || "Test";
  var startTime = req.query.start_time;
  var endTime = req.query.end_time;
  
  findCollection(tagName, parseInt(startTime, 10), parseInt(endTime, 10))
  .then(function(collection) {
    console.log(collection.length);
    res.json(collection);
  });

};

var saveCollection = function(req, res, next) {

};

// EndPoint Requests ////////////////////////////////////////////////////////

var instagramRequest = function(tagName, opts) {

  var opts = opts || {};

  var qs = {access_token: instagramToken, count: 50};
  if (opts.minID) {
    qs.min_tag_id = opts.minID;
  }
  if (opts.maxID) {
    qs.max_tag_id = opts.maxID;
  }

  var options = {
    url: 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent',
    qs: qs,
    method: 'GET',
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

var instagramPaginate = function(nextURL) {
  var options = {
    url: nextURL,
    method: 'GET'
  };

  console.log('/ PAGE REQUEST -', options.url);

  return request(options)
  .then(function (body) {
    return JSON.parse(body);
  })
  .catch(function(err) {
    console.log('Request ERROR: ', err);
  });
};

// Helper Functions ///////////////////////////////////////////////////////////////////

var findCollection = function(tagName, startTime, endTime) {

  var collection = [];

  return getByTimeFrame(tagName, startTime, endTime)
  .then(function(obj) {
    if (obj.endIndex > 0) {
      collection = collection.concat(obj.body.data.slice(obj.endIndex));
      return getUpToStart(obj.endIndex, obj.body, startTime)
      .then(function(coll) {

        collection = collection.concat(coll);
        console.log("Collection Size:", collection.length);
        return collection
      });
      // console.log(collection);
      // return collection;
    }
    // console.log(obj.endIndex);
  }); 


}

var getByTimeFrame = function(tagName, startTime, endTime) {

  var endIndex;

  return instagramRequest(tagName)
  .then(function(body) {
    // endComparator = 0;
    endIndex = doesContainTime(endTime, body.data);
    if (endIndex >= 0) {
      // return console.log(endIndex, body.data[endIndex]);
      return {body: body, endIndex: endIndex}
    }
    else if (body.pagination.next_url) {

      return innerFunction(body.pagination.next_url, endTime);
    }
    else {
      return {endIndex: -1};
    }
  });

};

var innerFunction = function(nextURL, endTime) {

  var endIndex;

  return instagramPaginate(nextURL)
  .then(function(body) {
    endIndex = doesContainTime(endTime, body.data);
    if (endIndex >= 0) {
      return {body: body, endIndex: endIndex};
      // return console.log(endIndex, body.data[endIndex]);
    }
    else if (body.pagination.next_url) {

      return innerFunction(body.pagination.next_url, endTime);
    }
    else {
      return {endIndex: -1};
    }

  });

};

var getUpToStart = function(endIndex, body, startTime) {

  console.log("Searching for Start");

  var startIndex;
  var collection = [];

  startIndex = doesContainTime(startTime, body.data);
  if (startIndex >= 0 && startIndex != endIndex) {
    collection = collection.concat(body.data.slice(endIndex, startIndex - endIndex + 1));
    return collection;
  }
  else if (body.pagination.next_url) {
    collection = collection.concat(body.data.slice(endIndex));
    return paginateTillStart(body.pagination.next_url, startTime)
    .then(function (coll) {
      return collection.concat(coll);
    });
  }

};

var paginateTillStart = function(nextURL, startTime) {

  var startIndex;
  var collection = [];

  return instagramPaginate(nextURL)
  .then(function(body) {

    startIndex = doesContainTime(startTime, body.data)
    if (startIndex >= 0) {
      collection = collection.concat(body.data.slice(0, startIndex + 1));
      return collection;
    }
    else if (body.pagination.next_url) {
      collection = collection.concat(body.data);
      return paginateTillStart(body.pagination.next_url, startTime)
      .then(function(coll) {
        return collection.concat(coll);
      });
    }
    else {
      return console.log("ERROR")
    }
  })

};

var doesContainTime = function(time, data) {

  var createdTime = 0;
  // var createdTime = parseInt(data[data.length - 1].created_time, 10) * 1000;
  var lastTime = parseInt(data[data.length - 1].created_time, 10) * 1000;
  var endComparator = 0;
  // var endComparator = parseInt(data[data.length - 1].created_time, 10) * 1000;

  // We run into the problem that we have no way of easily knowing if the given
  // created_time is tag or comment 
  var l = data.length - 1;
  while (createdTime <= 0 && l >= 0) {
    if (data[l].comments.count === 0) {
      createdTime = parseInt(data[l].created_time,10) * 1000;
      // console.log("Selected time is", createdTime, data[l]);
    }
    else {
      l--;
      console.log("Passing to next time");
      
    }
  }

  if (createdTime > time || l < 0) {

    console.log(time, createdTime, endComparator, "Invalid End");
    return -1;
  }
  else {
    // createdTime <= time

    for (var i = l; i >= 0; i--) {

      createdTime = parseInt(data[i].created_time, 10) * 1000;

      console.log(time, createdTime, endComparator);

      if (createdTime >= endComparator) {

        if (createdTime > time) {
          console.log(time, createdTime, lastTime);
          return i + 1;
        }
        else {
          endComparator = createdTime;
        }

      }

    }

    return -1;

  }
}

// findCollection("Unicorn", Date.parse("6/24/2016 10:00:00"), Date.parse("6/24/2016 14:00:00"));

module.exports = {
  getCollection: getCollection,
  saveCollection: saveCollection,
}