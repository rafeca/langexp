var Backend = require('../models/backend.js');
var Snippet = Backend.Snippet;

describe("Snippets Model", function() {
  
  var snippetId = null;
  
  it("Creates a snippet correctly", function() {
    
    Snippet.create('code1', 'description', 'var lala = "aa";', ["tag1", "tag2"], function(err, data){
    
      expect(err).toBe(null);
      expect(data.name).toEqual('code1');
      expect(data.tags[0].name).toEqual('tag1');
      expect(data.tags[1].name).toEqual('tag2');
      
      snippetId = data._id;
    
      asyncSpecDone();
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