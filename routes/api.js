var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
    var api = express.Router();

    api.get('/users', wagner.invoke(function(User) {
        return function(req, res) {
            //Category.findOne({_id : req.params.id}, handleOne.bind(null, 'category', res));
            res.send("{user}");
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

    if (!result) {
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

    var json = {};
    json[key] = result;
    res.json(json);
}