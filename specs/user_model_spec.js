var Backend = require('../models/backend.js');
var User = Backend.User;

describe("User Model", function() {
  
  /*
  beforeEach(function(){
    runs(function(){
      
      // Delete a possible created user from another test
      User.remove('user1', function(data){});
    });
  });*/
  
  it("register a user correctly", function() {
    
    User.register('user1', 'password', 'email@email.com', function(err, data){
    
      expect(err).toBe(null);
      expect(data.username).toEqual('user1');
    
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("removes a user correctly", function() {
    
    User.remove('user1', function(err, data){
      asyncSpecDone();
    });
    asyncSpecWait();
  });
  
  it("register a username already taken fails", function() {
    
    User.register('user1', 'password', 'email@email.com', function(err, data){
      
      User.register('user1', 'password', 'email@email.com', function(err, data){
      
        expect(err).toEqual("User already exists");
        asyncSpecDone();
      });
    });
    
    asyncSpecWait();
  });
  
  it("Authenticates OK", function() {
    
    User.authenticate('user1', 'password', function(err, data){
      
      expect(err).toEqual(null);
      expect(data.username).toEqual('user1');
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("Authentication fails when password is wrong", function() {
    
    User.authenticate('user1', 'password_wrong', function(err, data){
      expect(err).toEqual("Password is not correct");
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("Adds a new comment to a user from the same user", function(){
  
    User.findByUsername('user1', function(err, user){
      
      expect(user).toNotBe(null);
      
      User.addActivity(user, "comment", "Hello, world!", user._id, null, function(err, data){
        
        expect(err).toEqual(null);
        expect(data.activities[0].text).toEqual("Hello, world!");
        
        asyncSpecDone();
      });
      
    });
    asyncSpecWait();
  });
  
  
  it("removes a user correctly", function() {
    
    User.remove('user1', function(err, data){
      asyncSpecDone();
    });
    asyncSpecWait();
  });
});