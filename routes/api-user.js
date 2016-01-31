var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var ObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(wagner, passport) {
    var api = express.Router();

    api.use(bodyparser.json());
    

    var isAuthenticated = passport.authenticate('basic', { session : true });
    var isAdmin = passport.authenticate('basic-admin',{session : true});
    
    console.log(isAuthenticated);
    console.log(isAdmin);
    
    api.post('/register',isAuthenticated,wagner.invoke(function(User, SurveyTemplate) {
        return function(req,res){
            console.log(req.body.user);
            req.body.user.pwd = bcrypt.hashSync(req.body.user.pwd, bcrypt.genSaltSync(8),null);
            SurveyTemplate.findOne({type : req.body.user.surveytype}, function(error, surveytype){
                    
                    req.body.user.introduction  = replaceIntro(surveytype.defaultIntro,req.body.user.username,
                                                                req.body.user.position, req.body.user.organization, 
                                                                surveytype.questions.length);
                    User.create(req.body.user, function(error, user){
                    console.log(error);
                    console.log(user);
                    if(error){
                         return res.
                                status(status.INTERNAL_SERVER_ERROR).
                                json({ error: 'Duplicated Cellphone' }); 
                    } 
                    res.json(user);    
                });
                    
            });
            
        };
    }));
    
    api.get('/login_success', function(req, res){
        res.send(req.user);
        // res.render('users', { user: req.user });
    });
    
    api.get('/login_fail', function(req, res){
        res.send("{login fail}");
        // res.render('users', { user: req.user });
    });
    

    // process the login form
    
    api.post('/login', function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) { 
            console.log("error:"+err);
            return next(err); 
            
        }
        // Redirect if it fails
        console.log(user);
        
        if (!user) { 
            console.log('fail');
            return res.send("fail");
        }
        
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          // Redirect if it succeeds
          console.log('ok');
          return res.send({user:user});//redirect('/users/' + user.username);
        });
      })(req, res, next);
    });
    
    api.put('/changeUserPhoto/:id', isAuthenticated, wagner.invoke(function(User) {
         return function(req,res){
         console.log(req.params.id);
        User.findOne({ _id : req.params.id},
                function(error, user){
                    console.log(error);
                    console.log(user);
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
                    
                    user.photo = "https://s3-ap-northeast-1.amazonaws.com/followus-img-backup/"+req.params.id+".jpg";;
                    user.save(function(err, doc){
                        console.log(err);
                        console.log(doc);
                        if (err){
                            return  res.status(status.INTERNAL_SERVER_ERROR).
                                    json({ error: err }); 
                        }
                        res.json({msg: 'OK'});    
                    });    
                     
            });
        };
    }));
    
    api.put('/adminPwdChange',isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            
        User.findOne({ cellphone : req.body.user.cellphone},
                function(error, user){
                    console.log(error);
                    
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
                        user.pwd = req.body.user.newpwd;
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
    
    api.put('/edit',isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            console.log("edit:"+req.body.user.origin);
            User.findOne({cellphone : req.body.user.origin},
                function(error, user){
                    console.log(error);
                    
                    
                    if(error){
                        return res.status(status.INTERNAL_SERVER_ERROR).
                        json({error : error.toString()});
                    }
                    
                    if(!user){
                        return res.status(status.NOT_FOUND).
                        json({error : 'Not fount'});
                    }
                    
                    
                    user.username = req.body.user.username;
                    user.cellphone = req.body.user.cellphone;
                    user.pwd = bcrypt.hashSync(req.body.user.pwd, bcrypt.genSaltSync(8),null);
                    user.position = req.body.user.position;
                    user.organization = req.body.user.organization;
                    user.save(function(err, doc){
                        if(err){
                            return res.status(status.INTERNAL_SERVER_ERROR).
                            json({error : err});
                        }
                        res.json(user);
                    });
                }    
            );   
        };
    }));
    
    api.put('/introMsgChange',isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            User.findOne({cellphone : req.body.data.cellphone},
                function(error, user){
                    console.log(error);
                    
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
    
    api.put('/changePaidStatus', isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
             User.findOne({ cellphone : req.body.user.cellphone},
                function(error, user){
                    console.log(error);
                    console.log("origin : " + user);
                    
                    
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
                    
                        if(user.paid){
                            user.paid = false;
                        } else {
                            user.paid = true;
                        }
                        user.save(function(err, doc){
                            if (err){
                                return  res.status(status.INTERNAL_SERVER_ERROR).
                                        json({ error: err }); 
                            }
                            console.log("modified:"+doc);
                        
                            res.json({paid: doc.paid});    
                        });    
                    
            });
        };
    }));
    api.get('/userlist', isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            User.find({}).exec(handleMany.bind(null,'users',res));
        }
    }));
    
    api.get('/user', isAuthenticated,wagner.invoke(function(User) {
        return function(req, res) {
            User.find({'usertype':'USER'}).limit(20).sort({'_id':-1}).exec(handleMany.bind(null,'users',res));
        };
    }));
    
    api.get('/user/search/:keyword', isAuthenticated, wagner.invoke(function(User) {
        return function(req, res){
            User.find({'username' : req.params.keyword}).exec(handleMany.bind(null,'users',res));
        };
    }));
    
    api.get('/user/searchbyid/:id', isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            User.findOne({'_id':new ObjectId(req.params.id)}, handleOne.bind(null,'user',res));  
        };
    }));
    
    api.get('/user/:cellphone', isAuthenticated,wagner.invoke(function(User) {
        return function(req, res){
            User.findOne({'cellphone': req.params.cellphone},handleOne.bind(null,'user',res));
        }; 
    }));
    
    api.get('/user/next/:lastid',isAuthenticated,wagner.invoke(function(User) {
        return function(req, res){
            User.find({'_id': {$lt : req.params.lastid}, 'usertype':'USER'}).limit(20).sort({'_id':-1}).exec(handleMany.bind(null,'users',res));
        };
    }));
    
    api.get('/user/prev/:firstid',isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            User.find({'_id': {$gt : req.params.firstid}, 'usertype':'USER'}).limit(20).sort({'_id':1}).exec(handleMany.bind(null,'users',res));        }
    }));
    
    api.get('/info',isAuthenticated, wagner.invoke(function(User) {
        return function(req,res){
            var total = 0;
            var paid = 0;
            User.count({}, function(err,totalCnt){
                total = totalCnt;
                
                User.count({'paid':true}, function(err, paidCnt) {
                    paid = paidCnt;
                    var info = {};
                    info['total'] = total;
                    info['paid'] =paid;
                    console.log(info);
                    res.json(info);
                })
            });
            
            
        } 
    }));
    return api;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    console.log(req.user);
    console.log("isAuthenticated : " + req.isAuthenticated());
    
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    
    
    // if they aren't redirect them to the home page
    res.redirect('/');
}

function replaceIntro(intro, username, position, organization, question_num) {
    return intro.replace(/{{organization}}/gi, organization).replace(/{{username}}/gi, username)
                .replace(/{{position}}/gi, position).replace(/{{question_num}}/gi, question_num);
    
}

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