var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://followus-jngwnmk.c9users.io:'+process.env.PORT;

describe('API TEST', function() {
  var server;
  var User;
  var SurveyResult;
  var SurveyTemplate;
  var models;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./model/models')(wagner);
    app.use(require('./routes/api-user.js')(wagner));
    app.use(require('./routes/api-survey.js')(wagner));


    server = app.listen(process.env.PORT);

    // Make User model available in tests
    User = models.User;
    SurveyResult = models.SurveyResult;
    SurveyTemplate = models.SurveyTemplate;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    User.remove({}, function(error) {
      assert.ifError(error);
      
    });
    SurveyTemplate.remove({}, function(error){
      assert.ifError(error);
    });
    
    SurveyResult.remove({}, function(error){
      assert.ifError(error);
    });
    
    var users = require('./json/user.json');
    
    User.create(users, function(error) {
         assert.ifError(error);
         
    });
    
    var surveytemplate = require('./json/surveytemplate.json');
    
    SurveyTemplate.create(surveytemplate, function(error) {
         assert.ifError(error);
         done();
         
    });
    
    
  });

  it('[USER API] can load all user with paging', function(done){
    var url = URL_ROOT + '/user';
    // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/user
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.users.length, 3);
        done();
     });
  });
  
  it('[USER API] can load a user by id', function(done) {
    User.findOne({username:'신민아'}, function(error, user){
            assert.ifError(error);
            var url = URL_ROOT + '/user/'+user._id;
            // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/user/userid
            superagent.get(url, function(error, res) {
                var result;
                assert.doesNotThrow(function() {
                  result = JSON.parse(res.text);
                });
                assert.equal(result.user.username, '신민아');
                done();
            });    
    }); 
  });
  
  it('[USER API] can login with id and password', function(done) {
      var url = URL_ROOT + '/login';
      // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/login
      superagent.get(url, function(error, res) {
          assert.ifError(error);
          done();
      });
  });
  
  it('[USER API] can change password', function(done) {
    var url = URL_ROOT + '/adminPwdChange';
    // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/pwdChange
    superagent.
      put(url).
      send({
        data : {
            cellphone : '010-0987-1234',
            newpwd : 'newpwd'
            
        }
      }).
      end(function(error, res) {
        assert.ifError(error);
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.msg,'OK');
        done();
      });
  });
  
  it('[USER API] can chagen introduction message', function(done) {
      var url = URL_ROOT + '/introMsgChange';
    // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/introMsgChange
    superagent.
      put(url).
      send({
        data : {
            cellphone : '010-0987-1234',
            introduction : 'newpwd'
            
        }
      }).
      end(function(error, res) {
        assert.ifError(error);
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.user.introduction,'newpwd');
        done();
      });
  });
  
  it('[USER API] can register user', function(done) {
     var url = URL_ROOT + '/register';
     // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/register
      var user = {
            user: {
              username: '홍길',
              usertype : 'USER',
              cellphone : '010-1234-5678',
              pwd : '5678',
              position : '사원',
              surveytype : 'NEW',
              organization : '신한생명',
              introduction : '안녕하세요',
              photo : 'http://test.com',
              paid : false
            }      
      };
      
      superagent.
      post(url).
      send(user).
      end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.msg,'OK');
        
        superagent.
        post(url).
        send(user).
        end(function(error, res) {
            assert.ifError(!error);
            done();
        });
      });
  });
  
  
  
  it('[SURVEY API] can load all survey tempalte with paging', function(done){
    var url = URL_ROOT + '/surveyTemplate';
    // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/surveyTempate
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.surveytemplates.length, 1);
        done();
     });
  });
  
  it('[SURVEY API] can load survey with user id', function(done) {
    User.findOne({username:'신민아'}, function(error, user){
            assert.ifError(error);
            var url = URL_ROOT + '/survey/'+user._id;
            // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/survey/userid
            superagent.get(url, function(error, res) {
                var result;
                assert.doesNotThrow(function() {
                  result = JSON.parse(res.text);
                });
                assert.equal(result.survey.type, 'NEW');
                done();
            });    
    }); 
  });
  
  it('[SURVEY API] can send survey result', function(done) {
     User.findOne({username:'신민아'}, function(error, user){
            assert.ifError(error);
            
            SurveyTemplate.findOne({type :user.surveytype}, function(error,surveytemplate){
              var url = URL_ROOT + '/survey';
              // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/survey
              //console.log(surveytemplate);
              var survey = {
                    survey: {
                      user : user._id,
                      surveytype : user.surveytype,
                      answers : [
                        {
                            no : 1,
                            desc : "정원묵"
                        },
                        {
                            no : 2,
                            desc : surveytemplate.questions[1].answer.options[0].no + "." +
                                   surveytemplate.questions[1].answer.options[0].desc
                        },
                        {
                            no : 3,
                            desc: surveytemplate.questions[2].answer.options[2].no + "." +
                                  surveytemplate.questions[2].answer.options[2].desc
                        },
                        {
                            no : 4,
                            desc : surveytemplate.questions[3].answer.options[0].no + "." +
                                  surveytemplate.questions[3].answer.options[0].desc
                        },
                        {
                            no : 5,
                            desc : surveytemplate.questions[4].answer.options[2].no + "." + 
                                  surveytemplate.questions[4].answer.options[2].desc
                        },
                        {
                            no : 6,
                            desc : surveytemplate.questions[5].answer.options[1].no + "." +
                                  surveytemplate.questions[5].answer.options[1].desc
                        },
                        {
                            no : 7,
                            desc : surveytemplate.questions[6].answer.options[0].no + "." +
                                  surveytemplate.questions[6].answer.options[0].desc
                        },
                        {
                            no : 8,
                            desc : surveytemplate.questions[7].answer.options[1].no+ "." +
                                  surveytemplate.questions[7].answer.options[1].desc
                        },
                        {
                            no : 9,
                            desc : surveytemplate.questions[8].answer.options[0].no+ "." +
                                  surveytemplate.questions[8].answer.options[0].desc
                        },
                        {
                            no : 10,
                            desc : surveytemplate.questions[9].answer.options[1].no + "." +
                                  surveytemplate.questions[9].answer.options[1].desc
                            
                        },
                        {
                            no : 11,
                            desc : surveytemplate.questions[10].answer.options[0].no + "." +
                                  surveytemplate.questions[10].answer.options[0].desc
                        },
                        {
                            no : 12,
                            desc : surveytemplate.questions[11].answer.options[0].no+ "." +
                                  surveytemplate.questions[11].answer.options[0].desc
                        },
                        {
                            no : 13,
                            desc : surveytemplate.questions[12].answer.options[0].no+ "." +
                                  surveytemplate.questions[12].answer.options[0].desc
                        },
                        {
                            no : 14,
                            desc : surveytemplate.questions[13].answer.options[0].no
                        },
                        {
                            no : 15,
                            desc : "정팔이 덕선이"
                        }
                        
                      ],
                      date : new Date()
                    }      
              };
              
              superagent.
              post(url).
              send(survey).
              end(function(error, res) {
                assert.ifError(error);
                var result;
                assert.doesNotThrow(function() {
                  result = JSON.parse(res.text);
                });
                assert.equal(result.msg,'OK');
                done();
                
              });
              
            });
            
    }); 
    
  });
  
  

});
