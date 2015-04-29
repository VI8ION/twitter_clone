var _ = require('lodash')
,   Schema = require('mongoose').Schema
,   bcrypt = require('bcryptjs')

var userSchema = new Schema({    
    id: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    followingIds: {type: [String], default: []}    
});

userSchema.pre('save', function (next) {
   var _this = this;

   if (!_this.isModified('password')) {    
       return next();
   }
   
   bcrypt.hash(_this.password, 10, function(err, hash){
      if (err) {
          return next(err)
      }
      _this.password = hash 
      next()           
   })  
});

userSchema.statics.findByUserId = function(userId, done) {
  this.model('User').findOne({id: userId}, done)
}

userSchema.methods.getFollowers = function(done) {
  this.model('User').find({followingIds:{$in: [this.id]}}, done)
}

userSchema.methods.toClient = function () {
    return _.pick(this, ['id', 'name'])    
}

userSchema.methods.unfollow = function(userId, done) {
  var update = { '$pull': { followingIds: userId } }
  this.model('User').findByIdAndUpdate(this._id, update, done)
}

userSchema.methods.getFriends = function(done) {
  this.model('User').find({id: {$in: this.followingIds}}, done)
}




module.exports = userSchema;