var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var TagActivitySchema = new Schema({
  type: {type: String, enum: ['new_snippet', 'edit_snippet', 'delete_snippet', 'comment']},
  text: String,
  date: Date,
  origin: ObjectId,
  referenceId: ObjectId
});

var TagSchema = new Schema({
  name: {type: String, trim: true},
  activities: [TagActivitySchema]
});

// Associate the User Schema to a Mongoose model
mongoose.model('Tag', TagSchema);
mongoose.model('TagActivity', TagActivitySchema);

var TagBackend = function() {
  
  // Instanciate the Mongoose model
  var Tag = mongoose.model('Tag');
  var TagActivity = mongoose.model('TagActivity');

  var public = {
    
    // Creates a new Code Snippet in DB
    createOrFind: function(name, callback){

      Tag.findOne({name: name}, function(err, data){
        
        if (err) {
          return callback(err);
        }
        
        if (data !== null) {
          return callback(null, data);
        } 
        
        // Create the tag
        var tag = new Tag({name: name});
        tag.save(function(err){
          callback(err, tag);
        });
      });
    },
    
    addActivity: function(tag, type, text, origin, referenceId, callback){      
      var activity = new TagActivity({
        type: type,
        text: text,
        date: new Date(),
        origin: origin,
        referenceId: referenceId 
      });
      
      tag.activities.push(activity);
      tag.save(function(err){
        callback(err, tag);
      });
    }
  };
  
  return public;
}();

// Export the Model
module.exports = TagBackend;