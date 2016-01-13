var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner){
	
	//TEST VERSION (Default-Environment)
	mongoose.connect('mongodb://52.69.144.229:27017/test');
	
	//PRODUCTION VERSION (followus-production)
	//mongoose.connect('mongodb://localhost:27017/test');

	var User = mongoose.model('User', require('./user'), 'users');
	var SurveyResult = mongoose.model('SurveyResult', require('./surveyresult'), 'surveyResults');
	var SurveyTemplate = mongoose.model('SurveyTemplate', require('./surveytemplate'), 'surveyTemplates');

	var models = {
		User : User,
		SurveyResult : SurveyResult,
		SurveyTemplate : SurveyTemplate
	};

	_.each(models, function(value, key){
		wagner.factory(key, function(){
			return value;
		});	
	});
		
	return models;
};