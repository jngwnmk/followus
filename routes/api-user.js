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
    
    api.post('/register', wagner.invoke(function(User) {
        return function(req,res){
            User.create(req.body.user, function(error){
                if(error){
                     return res.
                            status(status.INTERNAL_SERVER_ERROR).
                            json({ error: 'Duplicated Cellphone' }); 
                } 
                res.json({msg : 'OK'});    
            });
        };
    }));
    
    api.put('/adminPwdChange', wagner.invoke(function(User) {
        return function(req,res){
            
            User.findOne({ cellphone : req.body.data.cellphone},
                function(error, user){
                    if (error) {
                      return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString() });
                    }
                    if (!user) {
                      return res.
                        status(status.NOT_FOUND).
                        json({ error: 'Not found' });
                    }
                    
                    if(user.usertype=='ADMIN'){
                        user.pwd = req.body.data.newpwd;
                            user.save(function(err, doc){
                            if (err){
                                return  res.status(status.INTERNAL_SERVER_ERROR).
                                        json({ error: err }); 
                            }
                            res.json({msg: 'OK'});    
                        });    
                    } else {
                            return  res.status(status.INTERNAL_SERVER_ERROR).
                                    json({ error: 'NOT ADMIN' });
                    }
            });
        };
    }));
    
    api.put('/introMsgChange', wagner.invoke(function(User) {
        return function(req,res){
            User.findOne({cellphone : req.body.data.cellphone},
                function(error, user){
                    if(error){
                        return res.status(status.INTERNAL_SERVER_ERROR).
                        json({error : error.toString()});
                    }
                    
                    if(!user){
                        return res.status(status.NOT_FOUND).
                        json({error : 'Not fount'});
                    }
                    
                    user.introduction = req.body.data.introduction;
                    user.save(function(err, doc){
                        if(err){
                            return res.status(status.INTERNAL_SERVER_ERROR).
                            json({error : err});
                        }
                        res.json({user : user});
                    });
                }    
            );  
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