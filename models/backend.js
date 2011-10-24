var mongoose = require('mongoose');

module.exports = Backend = function Backend() {

  // Connect to MongoDB
  mongoose.connect('mongodb://localhost/langex');
    
  return {
    User: require('./User.js'),
    Snippet: require('./Snippet.js'),
    Tag: require('./Tag.js')
  };
}();
