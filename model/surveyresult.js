var mongoose = require('mongoose');
var User = require('./user');
var SurveyTemplate = require('./surveytemplate');

var surveyResultSchema = {

	user : mongoose.Schema.Types.ObjectId,
	surveytype : {
		type : String,
		enum: ['NEW', 'EXPERT', 'MANAGER'],
      	required  : true,
	},
	answers : 
	[
		{
			no : {
				type : Number,
				required : true,
			},
			desc : {
				type :  String,
				required : true
			}
			
		}
	],
	date : {
		type : Date,
		required : true
	} 
	 
};

module.exports = new mongoose.Schema(surveyResultSchema, {versionKey:false});
module.exports.surveyResultSchema = surveyResultSchema;