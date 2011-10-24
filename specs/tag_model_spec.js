var Backend = require('../models/backend.js');
var Tag = Backend.Tag;

describe("Tags Model", function() {

  it("Adds a new comment to a tag", function(){

    Tag.createOrFind("tag1", function(err, tag){
    
      expect(tag).toNotBe(null);
    
      Tag.addActivity(tag, "comment", "Hello, world!", null, null, function(err, data){
      
        expect(err).toEqual(null);
        expect(data.activities[0].text).toEqual("Hello, world!");
      
        asyncSpecDone();
      });
    
    });
    asyncSpecWait();
  });
  
});