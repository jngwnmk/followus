var express = require('express');
var wagner = require('wagner-core');
var passport = require('passport');
require('./model/models')(wagner);

var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials',true);

    next();
}

app.use(allowCrossDomain);

require('./config/passport')(passport);


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport

// required for passport session
app.use(session({ secret: 'ilovesfollowusfollowusfollowus',cookie: { maxAge: 10000 },key: 'sid', cookie: { secure: true }})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/api/v1', require('./routes/api-user.js')(wagner, passport));
app.use('/api/v1', require('./routes/api-survey.js')(wagner));
app.use('/api/v1', require('./routes/api-excel.js')(wagner));


app.listen(process.env.PORT);
console.log('Listening on port '+process.env.PORT);