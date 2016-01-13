var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://followus-jngwnmk.c9users.io:'+process.env.PORT;

describe('User API', function() {
  var server;
  var User;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./model/models')(wagner);
    app.use(require('./routes/api')(wagner));

    server = app.listen(process.env.PORT);

    // Make User model available in tests
    User = models.User;
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
    
    var users = [
      {
        username: '신민아',
        cellphone : '010-2232-3322',
        pwd : '3322',
        position : '대리',
        surveytype : 'NEW',
        organization : '교보생명',
        photo : 'http://',
        paid : false
      },
      {
        username: '구마적',
        cellphone : '010-1234-2335',
        pwd : '2335',
        position : '과장',
        surveytype : 'EXPERT',
        organization : '신한생명',
        photo : 'http://',
        paid : true
      },
      {
        username: '홍길동',
        cellphone : '010-0987-1234',
        pwd : '1234',
        position : '신입',
        surveytype : 'NEW',
        organization : '신한생명',
        photo : 'http://'
      }
    ];
    
    User.create(users, function(error) {
         assert.ifError(error);
         done();
         
    });
    
  });

  it('can load all user with paging', function(done){
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
        assert.equal(result.users[0].username, '신민아');
        assert.equal(result.users[1].username, '구마적');
        assert.equal(result.users[2].username, '홍길동');
        assert.equal(result.users[0].position, '대리');
        assert.equal(result.users[0].paid, false);
        assert.equal(result.users[1].paid, true);
        assert.equal(result.users[2].paid, false);
        done();
     });
  });
  
  it('can load a user by id', function(done) {
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
  
  it('can login with id and password', function(done) {
      var url = URL_ROOT + '/login';
      // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/login
      superagent.get(url, function(error, res) {
          assert.ifError(error);
          done();
      });
  });
  
  it('can change password', function(done) {
    var url = URL_ROOT + '/pwdChange';
    // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/pwdChange
    superagent.
      put(url).
      send({
        
      }).
      end(function(error, res) {
        assert.ifError(error);
        done();
      });
  });
  
  it('can register user', function(done) {
     var url = URL_ROOT + '/register';
     // Make an HTTP request to followus-jngwnmk.c9users.io:process.env.PORT/register
      superagent.
      post(url).
      send({
            user: {
              username: "홍길",
              cellphone : "010-1234-5678",
              pwd : "5678",
              position : "사원",
              surveytype : "NEW",
              organization : "신한생명",
              introduction : "안녕하세요",
              photo : "http://test.com",
              paid : false
            }      
      }).
      end(function(error, res) {
        assert.ifError(error);
        done();
      });
  });
  

});
