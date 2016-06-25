var collectionController = require('./collectionController.js');

module.exports = function(app) {

  app.get('/:tag_name', collectionController.getCollection);

  app.post('/:tag_name', collectionController.saveCollection);

};