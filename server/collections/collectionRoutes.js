var collectionController = require('./collectionController.js');

module.exports = function(app) {

  app.get('/collections/:tag_name', collectionController.getCollection);

  app.post('/collections/:tag_name', collectionController.saveCollection);

};