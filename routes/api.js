var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(wagner) {
    var api = express.Router();

    api.use(bodyparser.json());
    
    api.get('/login', wagner.invoke(function(User) {
        return function(req, res){
             res.send("{login}"); 
        };
    }));
    
    //TODO
    api.post('/register', wagner.invoke(function(User) {
        return function(req,res){
            User.create(req.body, function(error){
                res.send("OK");
            });
        };
    }));
    
    api.put('/pwdChange', wagner.invoke(function(User) {
        return function(req,res){
             res.send("{pwdChange}");
        };
    }));
    
    api.get('/user', wagner.invoke(function(User) {
        return function(req, res) {
            User.find({}).exec(handleMany.bind(null,'users',res));
        };
    }));
    
    api.get('/user/:id', wagner.invoke(function(User) {
        return function(req, res){
            User.findOne({'_id': new ObjectId(req.params.id)},handleOne.bind(null,'user',res));
        }; 
    }));
    
    api.get('/surveyResult', wagner.invoke(function(SurveyResult) {
        return function(req,res){
            res.send("{surveyResult}");
        };
    }));
    
    api.get('/surveyTemplate',wagner.invoke(function(SurveyTemplate) {
        return function(req,res){
            res.send("{surveyTemplate}");
        };
    }));

    api.post('/surveyCreate',wagner.invoke(function() {
        return function(req,res){
            res.send("{surveyCreate}");
        };
    }));
    
    api.put('/surveySend',wagner.invoke(function(SurveyResult) {
        return function(req,res){
            res.send("{surveySend}");
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