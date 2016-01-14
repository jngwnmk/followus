var mongoose = require('mongoose');
var User = require('./user');
var SurveyTemplate = require('./surveytemplate');

var surveyResultSchema = {

	user : User.userSchema,
	surveytemplate : SurveyTemplate.surveyTemplateSchema,
	date : {
		type : Date,
		required : true
	} 
	 
};

module.exports = new mongoose.Schema(surveyResultSchema, {versionKey:false});
module.exports.surveyResultSchema = surveyResultSchema;