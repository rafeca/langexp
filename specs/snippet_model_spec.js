var Backend = require('../models/backend.js');
var Snippet = Backend.Snippet;
var User = Backend.User;

describe("Snippets Model", function() {
  
  var snippetId = null;
  
  it("Creates a snippet correctly", function() {
    
    User.register('user1', 'password', 'email@email.com', function(err, user){

      Snippet.create(user._id, 'code1', 'description', 'var lala = "aa";', ["tag1", "tag2"], function(err, data){
    
        expect(err).toBe(null);
        expect(data.name).toEqual('code1');
        expect(data.tags[0].name).toEqual('tag1');
        expect(data.tags[1].name).toEqual('tag2');
        expect(data.creatorId).toEqual(user._id);
      
        snippetId = data._id;
    
        User.remove('user1', asyncSpecDone);
      });
    });
    
    asyncSpecWait();
  });  
  
  it('Removes a snippet correctly', function(){
    
    Snippet.remove(snippetId, function(err){
      expect(err).toBe(null);
      asyncSpecDone();
    });
    asyncSpecWait();
  });
});