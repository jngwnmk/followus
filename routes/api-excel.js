var bodyparser = require('body-parser');
var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var csv = require('express-csv');

module.exports = function(wagner) {
    var api = express.Router();

     api.use(bodyparser.json());
     
     api.get('/exportUser',wagner.invoke(function(User) {
         return function(req, res){
            var csv = [];
            var fields = [];
            fields.push('이름');
            fields.push('전화번호');
            fields.push('직책');
            fields.push('설문종류');
            fields.push('조직');
            fields.push('결제여부');
            fields.push('가입일자');
            csv.push(fields);
            User.find({}).exec(function(err, users){
                
                for(var i = 0 ; i < users.length; ++i){
                    var values = [];
                    values.push(users[i].username);
                    values.push(users[i].cellphone);
                    values.push(users[i].position);
                    values.push(users[i].surveytype);
                    values.push(users[i].organization);
                    values.push(users[i].paid);
                    values.push(users[i].date);
                    csv.push(values);
                }
                res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\''+'userlist.csv');
                res.set('Content-Type', 'text/csv');
                res.csv(csv);
                
            });
         };
         
     }));
     
     /*api.get('/exportByType/:type', wagner.invoke(function(User, SurveyTemplate, SurveyResult) {
         return function(req,res){
                
         };
     }));
     */
 
     api.get('/exportByUser/:id',wagner.invoke(function(User,SurveyTemplate, SurveyResult) {
            return function(req, res){
                var csv = [];
                User.findOne({'_id': new ObjectId(req.params.id)},
                    function(error, user){
                    
                    var type = user.surveytype;
                    var filename = user.username+'('+user.cellphone+')';
                    SurveyTemplate.findOne({'type' : type}, function(error, template){
                        var fields = [];
                        for(var i = 0 ; i < template.questions.length ; ++i){
                            var field = template.questions[i].no +'.'+ template.questions[i].desc.replace(/{USER}/gi, user.username);;
                            fields.push(field);
                        }
                        fields.push('답변일시');
                        csv.push(fields);
                        SurveyResult.find({'user' : new ObjectId(req.params.id)}).exec(
                            function(error, surveyresults){
                            for(var j = 0 ; j  < surveyresults.length ; ++j){
                                var results = [];
                                for(var i = 0 ; i <surveyresults[j].answers.length ; ++i){
                                    var result =  surveyresults[j].answers[i].desc;
                                    results.push(result);
                                }
                                results.push(surveyresults[j].date);
                                csv.push(results);
                                     
                            }
                            console.log(csv);
                            var newFileName = encodeURIComponent(filename+'.csv');
                            res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\''+newFileName);
                            //res.header('content-disposition', 'attachment;filename*=UTF-8\'\''+newFileName);
                            //res.set('Content-Type', 'application/octet-stream');
                            res.set('Content-Type', 'text/csv');
                            res.csv(csv);
                        });
                    });
                    
                            
                });
               
            };   
    }));
    
    return api;
};
