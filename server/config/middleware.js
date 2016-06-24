var express = require('express');
var morgan = require('morgan');

module.exports = function(app) {

  var collectionRouter = express.Router();

  app.use(morgan('dev'));

  app.use(express.static(__dirname + '/../../build'));

  app.use('/api/collections', collectionRouter);

  require('../collections/collectionRoutes.js')(collectionRouter);


}