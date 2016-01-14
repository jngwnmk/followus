var express = require('express');
var wagner = require('wagner-core');

require('./model/models')(wagner);

var app = express();
/*app.use(wagner.invoke(function(User) {
  return function(req, res, next) {
    User.findOne({}, function(error, user) { req.user = user; next(); });
  };
}));*/
app.use('/api/v1', require('./routes/api-user')(wagner));
app.use('/api/v1', require('./routes/api-survey')(wagner));

app.listen(process.env.PORT);
console.log('Listening on port '+process.env.PORT);