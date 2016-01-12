var mongoose = require('mongoose');
var User = require('./user');
var SurveyTemplate = require('./surveytemplate');

var surveyResultSchema = {

	_id : { 
		type : String,
		required : true
	},

	user : User.userSchema,
	surveytemplate : SurveyTemplate.surveyTemplateSchema,
	date : {
		type : Date,
		required : true
	}
	 
};

module.exports = new mongoose.Schema(surveyResultSchema);
module.exports.surveyResultSchema = surveyResultSchema;