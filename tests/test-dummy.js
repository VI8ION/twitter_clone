var fs = require('fs');

describe("Simple tests", function() {

  it('check if dummy file exists', function(done) {
 
      fs.exists('dummy', function(exists) {
         if (!exists) {
             return done(new Error('File dummy doesn\'t exist'))
         }
         done(null)
      })   
  })

})