var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var CommentSchema = new Schema({
  text: String,
  date: Date,
  origin: String
});

var UserActivitySchema = new Schema({
  type: {type: String, enum: ['new_snippet', 'edit_snippet', 'delete_snippet', 'comment']},
  text: String,
  date: Date,
  origin: String,
  referenceId: ObjectId,
  comments: [CommentSchema]
});

var UserSchema = new Schema({
  username: { type:String, index: { unique: true } },
  password: String,
  email: String,
  followingIds: [ObjectId],
  activities: [UserActivitySchema],
  dateLatestVisit: Date
});

// Associate the User Schema to a Mongoose model
mongoose.model('User', UserSchema);
mongoose.model('UserActivity', UserActivitySchema);
mongoose.model('Comment', CommentSchema);

var UserBackend = function() {
  
  // Instanciate the Mongoose model
  var User = mongoose.model('User');
  var UserActivity = mongoose.model('UserActivity');
  var Comment = mongoose.model('Comment');

  var public = {
    findById: function(userId, callback){
      User.findOne({_id: userId}, callback);
    },
    
    findByUsername: function(username, callback){
      User.findOne({username: username}, callback);
    },
    
    // Creates a new user in DB
    register: function(username, password, email, callback){
      public.findByUsername(username, function(err, user){
        
        if (user !== null) {
          return callback("User already exists");
        }
        
        var user = new User({
          username: username,
          password: password,
          email: email,
          dateLatestVisit: new Date()
        });
        user.save(function(err){
          callback(err, user);
        });
      });
    },
    
    remove: function(username, callback) {
      User.remove({username: username}, callback);
    },
    
    authenticate: function(username, password, callback) {
      public.findByUsername(username, function(err, data){
        if (err) {
          return callback(err);
        }
        
        if (!data) {
          return callback('User does not exist');
        }
        
        if (data.password !== password) {
          return callback('Password is not correct');
        }
        
        callback(null, data);
      });
    },
    
    updateDateLatestVisit: function(username, callback) {
      
      public.findByUsername(username, function(err, user){
        if(!user) {
          callback('User not found');
          return;
        }
        
        user.dateLatestVisit = new Date();
        user.save(callback);
      });
    },
    
    addActivity: function(user, type, text, origin, referenceId, callback){      
      
      var activity = new UserActivity({
        type: type,
        text: text,
        date: new Date(),
        origin: origin,
        referenceId: referenceId
      });
      
      user.activities.push(activity);
      
      user.save(function(err){
        callback(err, user);
      });
    },
    
    addCommentToActivity: function(user, activityId, text, origin, callback) {
      
      var comment = new Comment({
        text: text,
        origin: origin,
        date: new Date()
      });
      
      user.activities.id(activityId).comments.push(comment);
      user.save(function(err){
        callback(err, user);
      });
    }
  };
  
  return public;
}();

// Export the Model
module.exports = UserBackend;