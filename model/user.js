var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = {

	  username: {
    	  type: String,
      	required: true
      	
    },
    usertype :{
        type : String,
        required : true,
        enum : ['ADMIN','USER']
    },
    cellphone :{
    	type : String,
    	required : true,
    	match : /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/,
    	unique : true
    },
    pwd : {
    	type : String,
    	required : true
    },

    position : {
      type : String  
    },
    
    surveytype : {
      type: String,
      enum: ['NEW', 'EXPERT', 'MANAGER'],
      required: true
    },

    organization :{
    	type : String
    },

    suffix_1 :{
      type : String
    },
    
    suffix_2 : {
      type : String
    },
    
    introduction : { 
    	type : String
    },

    photo: {
      type: String
    },

    paid :{
    	type : Boolean,
    	required : true,
    	default : false
    },
    date : {
		type : Date,
		required : true,
		default :  new Date()
	} 
};




var userMongooseScheme = new mongoose.Schema(userSchema, {versionKey: false});
userMongooseScheme.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};
userMongooseScheme.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.pwd);
};

userMongooseScheme.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.pwd, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userMongooseScheme.methods.isAdmin = function(){
  if(this.usertype=='ADMIN'){
    return true;
  } else {
    return false;
  }
}

module.exports  = userMongooseScheme;
module.exports.userSchema = userSchema;
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userMongooseScheme);
