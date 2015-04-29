var db = require('../../db')
var ensureAuthentication = require('../../middleware/ensureAuthentication');
var ObjectId = require('mongoose').Types.ObjectId

var express = require('express')
  , router = express.Router()

router.post('/', ensureAuthentication, function (req, res) {
    var tweet = req.body.tweet
    ,   Tweet = db.model('Tweet');
    
    tweet.userId = req.user.id;
    tweet.created = Date.now() / 1000 | 0;

    Tweet.create(tweet, function(err, tweet) {
        if (err) {
            var code = err.code === 11000 ? 409 : 500
            return res.sendStatus(code)
        } 
        res.send({tweet : tweet.toClient()});        
    });       
});

router.get('/:tweetId', function (req, res) {
    var Tweet = db.model('Tweet');

    Tweet.findById(req.params.tweetId, function(err, tweet) {
       if (err) {
           return res.sendStatus(500)
       }
       if (!tweet) {
           return res.sendStatus(404)
       }
       res.send({ tweet: tweet.toClient() })
    })
});

router.get('/', ensureAuthentication, function (req, res) {
   var Tweet = conn.model('Tweet')
     , stream = req.query.stream
     , userId = req.query.userId
     , options = { sort: { created: -1 } }
     , query = null
 

   if (stream === 'home_timeline') {
       query = { userId: { $in: req.user.followingIds }}
   } else if (stream === 'profile_timeline' && userId) {
       query = { userId: userId }
   } else {
       return res.sendStatus(400)
   }

   Tweet.find(query, null, options, function(err, tweets) {
      if (err) {
          return res.sendStatus(500)
      }
      var responseTweets = tweets.map(function(tweet) { return tweet.toClient() })
      res.send({ tweets: responseTweets })
   })    
}); 

router.delete('/:tweetId', ensureAuthentication, function (req, res) {

    var Tweet = db.model('Tweet')
    , tweetId = req.params.tweetId

    if (!ObjectId.isValid(tweetId)) {
        return res.sendStatus(400)
    }

    Tweet.findById(tweetId, function(err, tweet) {
       if (err) {
           return res.sendStatus(500)
       }
       if (!tweet) {
           return res.sendStatus(404)
       }
       if (tweet.userId != req.user.id){
           return res.sendStatus(403)
       }

       Tweet.findOneAndRemove(tweet._id, function (err) {
           if (err) {
               return res.sendStatus(404)
           }
           res.sendStatus(200)
       })   
    })     
     
});

module.exports = router 