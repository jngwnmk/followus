var express = require('express');
var wagner = require('wagner-core');

require('./model/models')(wagner);

var app = express();
/*app.use(wagner.invoke(function(User) {
  return function(req, res, next) {
    User.findOne({}, function(error, user) { req.user = user; next(); });
  };
}));*/

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://followus-front-jngwnmk.c9users.io');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use('/api/v1', require('./routes/api-user.js')(wagner));
app.use('/api/v1', require('./routes/api-survey.js')(wagner));

app.listen(process.env.PORT);
console.log('Listening on port '+process.env.PORT);