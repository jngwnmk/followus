var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = function(wagner) {
    var api = express.Router();

    api.use(bodyparser.json());
    
    api.get('/surveyResult', wagner.invoke(function(SurveyResult) {
        return function(req,res){
            res.send("{surveyResult}");
        };
    }));
    
    api.get('/surveyTemplate',wagner.invoke(function(SurveyTemplate) {
        return function(req,res){
           SurveyTemplate.find({}).exec(handleMany.bind(null,'surveytemplates',res));
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