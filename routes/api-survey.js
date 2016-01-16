var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('underscore');


module.exports = function(wagner) {
    var api = express.Router();

    api.use(bodyparser.json());
    
    
    
    //show all result for admin
    api.get('/surveyResult', wagner.invoke(function(SurveyResult) {
        return function(req,res){
            SurveyResult.find({}).exec(handleMany.bind(null,'surveyresults',res));
        };
    }));
    
    api.get('/surveyResult/:id', wagner.invoke(function(SurveyResult, User) {
        return function(req,res){
            User.findOne({'_id': new ObjectId(req.params.id)}, function(error, user){
                    var userid = user._id;
                    var paid = user.paid;
                    var usertype = user.usertype;
                    console.log(user);
                    if(usertype=='ADMIN' || (usertype == 'USER' && paid)){
                        SurveyResult.findOne({'user' : userid}, handleOne.bind(null, 'surveyresult', res));
                    } else {
                        return res.status(status.UNAUTHORIZED).
                            json({error : "Not Authorized"});
                    }
            });  
        };
    }));
    //surver probability (option)
    
    
    api.get('/surveyTemplate',wagner.invoke(function(SurveyTemplate) {
        return function(req,res){
           SurveyTemplate.find({}).exec(handleMany.bind(null,'surveytemplates',res));
        };
    }));

    api.get('/survey/:id/',wagner.invoke(function(User,SurveyTemplate) {
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
    
    api.post('/survey',wagner.invoke(function(SurveyResult) {
        return function(req,res){
            
            SurveyResult.create(req.body.survey, function(error){
                if(error){
                    return res.
                    status(status.INTERNAL_SERVER_ERROR).
                    json({ error: 'Error' }); 
                } 
                res.json({msg : 'OK'});    
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