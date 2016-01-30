var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('underscore');


module.exports = function(wagner) {
    var api = express.Router();

    api.use(bodyparser.json());
    
    
    api.get('/surveryResultInfo', wagner.invoke(function(SurveyResult) {
        return function(req,res){
             SurveyResult.count({}, function(err,totalCnt){
                 var info = {};
                 info['answer_num'] =totalCnt;
                 res.json(info);
             });  
        };
    }));
    
    
    //show all result for admin
    api.get('/surveyResult', wagner.invoke(function(SurveyResult) {
        return function(req,res){
            SurveyResult.find({}).exec(handleMany.bind(null,'surveyresults',res));
        };
    }));
    
    api.get('/surveyResult/:requestUser/:surveyUserId', wagner.invoke(function(SurveyResult, User) {
        return function(req,res){
            
            
            User.findOne({'_id': new ObjectId(req.params.requestUser)}, function(error, user){
                    console.log(error);
                    var userid = user._id;
                    var paid = user.paid;
                    var usertype = user.usertype;
                    console.log(user);
                    if(usertype=='ADMIN' || (usertype == 'USER' && paid)){
                        
                        SurveyResult.find({'user' : new ObjectId(req.params.surveyUserId)}, handleMany.bind(null, 'surveyresult', res));
                        
                        
                    } else {
                        return res.status(status.UNAUTHORIZED).
                            json({error : "Not Authorized"});
                    }
            });  
        };
    }));

    api.get('/surveyTemplate',wagner.invoke(function(SurveyTemplate) {
        return function(req,res){
           SurveyTemplate.find({}).exec(handleMany.bind(null,'surveytemplates',res));
        };
    }));
    
    api.get('/surveyTemplate/:type',wagner.invoke(function(SurveyTemplate) {
        return function(req,res){
          SurveyTemplate.findOne({'type' : req.params.type},handleOne.bind(null,'surveytemplate',res))  
        }; 
    }))

    api.get('/survey/:id',wagner.invoke(function(User,SurveyTemplate) {
            return function(req, res){
                
                var userid = "";
                var username = "";
                var surveytype = "";
                var introduction = "";
                var photo = "";
                User.findOne({'_id': new ObjectId(req.params.id)},
                    function(error, user){
                        
                        if(error){
                            return res.status(status.INTERNAL_SERVER_ERROR).
                            json({error : error.toString()});
                        } 
                        
                        if(!user){
                            return res.status(status.NOT_FOUND).json({error : 'Not found'});
                        }
                        
                        userid = user._id;
                        username = user.username;
                        surveytype = user.surveytype;
                        introduction = user.introduction;
                        photo = user.photo;
                        
                        SurveyTemplate.findOne({'type' : surveytype}, function(error, surveytemplate){
                            console.log(error);
                    
                            if (error) {
                              return res.
                                status(status.INTERNAL_SERVER_ERROR).
                                json({ error: error.toString() });
                            }
                            if (!surveytemplate) {
                              return res.
                                status(status.NOT_FOUND).
                                json({ error: 'Not found' });
                            }
                            
                            for(var i  = 0 ; i < surveytemplate.questions.length ; ++i){
                                surveytemplate.questions[i].desc = surveytemplate.questions[i].desc.replace('{USER}',username+'FB');
                            }
                            
                            res.json({ 
                                survey: surveytemplate ,
                                userid : userid,
                                introduction : introduction,
                                photo : photo
                            });
                        });
                        
                    }
                );
                
                
        };
    }));
    
    api.post('/survey/:id/:type',wagner.invoke(function(User,SurveyResult) {
        return function(req,res){
            
            User.findOne({cellphone : req.params.id}, function(error, user){
                console.log(error);
                    
                if(error){
                     return res.
                                status(status.INTERNAL_SERVER_ERROR).
                                json({ error: error.toString() });
                }
                
                 if (!user) {
                              return res.
                                status(status.NOT_FOUND).
                                json({ error: 'Not found' });
                }
                
                
                console.log(req.body);
                var surveyresult = new SurveyResult();
                surveyresult['user'] = user._id;
                surveyresult['surveytype'] = req.params.type;
                var newAnswers = [];
                for(var key in req.body.answers){
    	            var answer = {};
    	            answer['no'] = key;
    	            answer['desc'] = req.body.answers[key];
    	            newAnswers.push(answer);
                }
                surveyresult['answers'] = newAnswers;
                console.log(surveyresult);
                surveyresult.save(function(error){
                    console.log(error);
                    if(error){
                        return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: 'Error' }); 
                    } 
                    res.json({msg : 'OK'});    
                });

            });
            
            

        };
    }));
    
    

    return api;
};

function handleOne(key, res, error, result) {
    if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).
        json({
            error: error.toString()
        });
    }

    if (!result || result==JSON.undefined) {
        return res.status(status.NOT_FOUND).
        json({
            error: 'Not found'
        });
    }

    var json = {};
    json[key] = result;
    res.json(json);
}

function handleMany(key, res, error, result) {
    if (error) {
        return res.
        status(status.INTERNAL_SERVER_ERROR).
        json({
            error: error.toString()
        });
    }
    if (!result || result==JSON.undefined) {
        return res.status(status.NOT_FOUND).
        json({
            error: 'Not found'
        });
    }
    
    var json = {};
    json[key] = result;
    res.json(json);
}

function handleManySurvey(key, res, error, result) {
    if (error) {
        return res.
        status(status.INTERNAL_SERVER_ERROR).
        json({
            error: error.toString()
        });
    }
    if (!result || result==JSON.undefined) {
        return res.status(status.NOT_FOUND).
        json({
            error: 'Not found'
        });
    }
    
    result.populate({ path: 'user', model: 'User' }, handleOne.bind(null, 'user', res));
    var json = {};
    json[key] = result;
    res.json(json);
}