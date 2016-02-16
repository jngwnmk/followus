var mongoose = require('mongoose');

var surveyTemplateSchema = {

	 type : {
      type: String,
      enum: ['NEW', 'EXPERT', 'MANAGER','TRANSFER'],
      required: true
    },
    desc  : {
      type : String,
      required : true
    },
    
    defaultIntro : {
      type : String,
      required : true
    },
    
    questions : [{
  		no : {
  			type : Number,
  			required : true
  		},
  		desc :{
  			type : String,
  			required : true
  		},
  		type : {
  			type : String,
  			enum : ["SELECT","DESCRIPT","SCORE"],
  			required : true
  		},
  		required : {
    				  type : Boolean,
    				  default : false
    	},
    	answer : {
    		options: [
    			{
    				no : {
    					type : Number,
    					required : true
    				},
    				desc : {
    					type : String,
    					required : true
    				},
    				isEtc : {
    				  type : Boolean,
    				  default : false
    				}
    			}
    		],
    		mindesc :{
    					type : String
    		},
    		maxdesc : {
    					type : String
    		}
  		}
    }]
	 
};

module.exports = new mongoose.Schema(surveyTemplateSchema, {versionKey : false});
module.exports.surveyTemplateSchema = surveyTemplateSchema;