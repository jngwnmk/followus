var mongoose = require('mongoose');

var surveyResultSchema = {

	//usercellphone :
	//{
	//	type : String,
   // 	match : /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/
	//},
	user : mongoose.Schema.Types.ObjectId,
	surveytype : {
		type : String,
		enum: ['NEW', 'EXPERT', 'MANAGER']
      	
	},
	answers : 
	[
		{
			no : {
				type : String,
				required : true,
			},
			desc : {
				type :  String
			}
		}
	],
	date : {
		type : Date,
		required : true,
		default : new Date()
	} 
	 
};

module.exports = new mongoose.Schema(surveyResultSchema, {versionKey:false});
module.exports.surveyResultSchema = surveyResultSchema;