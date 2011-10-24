var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Tag = require('./Tag.js');

var TagSchema = new Schema({
  name: String
});

var SnippetSchema = new Schema({
  name: String,
  description: String,
  code: String,
  date: Date,
  tags: [TagSchema]
});

// Associate the User Schema to a Mongoose model
mongoose.model('Snippet', SnippetSchema);

var SnippetBackend = function() {
  
  // Instanciate the Mongoose model
  var Snippet = mongoose.model('Snippet');

  var public = {
    
    findById: function(snippetId, callback){
      Snippet.find({_id: snippetId}, callback);
    },
    
    // Creates a new Code Snippet in DB
    create: function(name, description, code, tags, callback){
      
      // Find tags and create them if they don't exist yet
      var foundTags = [];
      
      tags.forEach(function(tagName){
        Tag.createOrFind(tagName, function(err, tag){
          if (err) {
            return callback(err);
          }
          
          foundTags.push(tag);
          
          if (foundTags.length === tags.length) {

            var snippet = new Snippet({
              name: name,
              description: description,
              code: code,
              tags: foundTags,
              date: new Date()
            });
            snippet.save(function(err){
              callback(err, snippet);
            });
          }
        })
      });
    },
    
    remove: function(snippetId, callback) {
      Snippet.remove({_id: snippetId}, callback);
    }
  };
  
  return public;
}();

// Export the Model
module.exports = SnippetBackend;