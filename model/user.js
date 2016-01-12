var mongoose = require('mongoose');

var userSchema = {

	_id : { 
		type : String,
		required : true
	},
	username: {
    	type: String,
      	required: true,
      	lowercase: true
    },
    cellphone :{
    	type : String,
    	required : true,
    	match : /^/ //TODO : Update to regular expression of cellphone
    },
    pwd : {
    	type : String,
    	required : true
    },

    position : {
      type: String,
      enum: ['NEW', 'EXPERT', 'MANAGER'],
      required: true
    },

    organization :{
    	type : String
    },

    introduction : { 
    	type : String
    },

    photo: {
      type: String,
      required: true,
      match: /^http:\/\//i
    },

    padi :{
    	type : Boolean,
    	required : true,
    	default : false
    }
};

module.exports = new mongoose.Schema(userSchema);
module.exports.userSchema = userSchema;