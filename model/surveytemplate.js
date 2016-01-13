var mongoose = require('mongoose');

var surveyTemplateSchema = {

	type : {
      type: String,
      enum: ['NEW', 'EXPERT', 'MANAGER'],
      required: true
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

  		answer : 
  		[
  			{
  				no : {
  					type : Number,
  					required : true
  				},
  				desc : {
  					type : String,
  					required : true
  				},
  				mindesc :{
  					type : String
  				},
  				maxdesc : {
  					type : String
  				}


  			}
  		]
    }]
	 
};

module.exports = new mongoose.Schema(surveyTemplateSchema);
module.exports.surveyTemplateSchema = surveyTemplateSchema;