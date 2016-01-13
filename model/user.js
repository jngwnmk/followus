var mongoose = require('mongoose');

var userSchema = {

	  username: {
    	  type: String,
      	required: true
    },
    cellphone :{
    	type : String,
    	required : true,
    	match : /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/ 
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

    introduction : { 
    	type : String
    },

    photo: {
      type: String,
      match: /^http:\/\//i
    },

    paid :{
    	type : Boolean,
    	required : true,
    	default : false
    }
};

module.exports = new mongoose.Schema(userSchema);
module.exports.userSchema = userSchema;