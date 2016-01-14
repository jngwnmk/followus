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
        // And make sure we got the LG G4 back
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
                // And make sure we got the LG G4 back
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
        // And make sure we got the LG G4 back
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
        // And make sure we got the LG G4 back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.surveytemplates.length, 1);
        done();
     });
  });

});
