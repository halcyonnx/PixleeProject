// var express = require('express');
var morgan = require('morgan');

module.exports = function(app, express) {

  var collectionRouter = express.Router();

  app.use(morgan('dev'));

  app.use(express.static(__dirname + '/../../build'));

  app.use('/collections', collectionRouter);

  require('../collections/collectionRoutes.js')(collectionRouter);


}