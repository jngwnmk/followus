var mongoose = require('mongoose');
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

module.exports = new mongoose.Schema(userSchema, {versionKey: false});
module.exports.userSchema = userSchema;