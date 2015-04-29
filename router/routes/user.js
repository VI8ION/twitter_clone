var db = require('../../db')
var ensureAuthentication = require('../../middleware/ensureAuthentication');

var express = require('express')
  , router = express.Router()

router.post('/', function (req, res) { 
    var user = req.body.user
    ,   User = db.model('User');

    User.create(user, function(err, createdUser) {     
        if (err) {
            var code = err.code === 11000 ? 409 : 500
            return res.sendStatus(code)
        }
        req.login(createdUser, function(err) {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        });
    });
});

router.post('/:userId/follow', ensureAuthentication, function (req, res) { 
    var User = db.model('User')
    ,   query = { id: req.params.userId }
    ,   loggedOnQuery = { id: req.user.id }
    ,   update = { $addToSet: { followingIds: req.params.userId } }

    User.findOne(query, function(err, user) {
       if (err) {
           return res.sendStatus(500)
       }
       if (!user) {
           return res.sendStatus(403)
       }
       if (req.params.userId == req.user.id) {
           return res.sendStatus(403)
       }
       User.findOneAndUpdate(loggedOnQuery, update, function (err, user) {
          if (err) {
              return res.sendStatus(500)
          }
          return res.sendStatus(200) 
       })        
    })    
});

router.post('/:userId/unfollow', ensureAuthentication, function (req, res) { 
    req.user.unfollow(req.params.userId, function(err) {
       if (err) {
           return res.sendStatus(500)
       }
       res.sendStatus(200)
    })
});

router.get('/:userId', function (req, res) {
    var User = db.model('User');

    User.findOne({ id: req.params.userId }, function(err, user) {
       if (err) {
           return res.sendStatus(500)
       }
       if (!user) {
           return res.sendStatus(404)
       }
       res.send({ user: user.toClient() })
    })
});

router.get('/:userId/friends', function (req, res) {
    var User = db.model('User')
    , userId = req.params.userId

    User.findByUserId(userId, function(err, user) {
       if (err) {
           return res.sendStatus(500)
       }
       if (!user) {
           return res.sendStatus(404)
       }
       user.getFriends(function(err, friends) {
          if (err) {
              return res.sendStatus(500)
          }
          var friendsList = friends.map(function(user) { return user.toClient() })
          res.send({ users: friendsList })
       })
    })
});

router.get('/:userId/followers', function (req, res) {
    var User = db.model('User')
    , userId = req.params.userId

    User.findByUserId(userId, function(err, user) {
       if (err) {
           return res.sendStatus(500)
       }
       if (!user) {
           return res.sendStatus(404)
       }
       user.getFollowers(function(err, followers) {        
          if (err) {
              return res.sendStatus(500)
          }
          var followerList = followers.map(function(user) { return user.toClient() })
          res.send({ users: followerList })       
       })
    })
});

router.put('/:userId', ensureAuthentication, function (req, res) {
    var User = db.model('User')
    ,   query = { id: req.params.userId }
    ,   update = { password: req.body.password }
    
    if (req.params.userId != req.user.id) {
        return res.sendStatus(403)
    } 
    
    User.findOneAndUpdate(query, update, function (err, user) {
        if (err) {
            return res.sendStatus(500)
        }
        res.sendStatus(200)
    })       
});

module.exports = router