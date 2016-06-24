var request = require('request');
var instagramToken = require('./../config/tokenConfig.js').instagramAPIToken;

var getCollection = function(req, res, next) {
  var tagName = req.params.tag_name;
  var startTime = req.query.start_time;
  var endTime = req.query.end_time;

  var options = {
    url: 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent',
    qs: {access_token: instagramToken},
    method: 'GET',
  };

  request(options, function(err, res, body) {
    if (err) {
      console.log('Request ERROR: ', err);
    }
    else {
      console.log(JSON.parse(body));
      res.json(body);
    }


  });
};

var saveCollection = function(req, res, next) {

};

module.exports = {
  getCollection: getCollection,
  saveCollection: saveCollection,
}