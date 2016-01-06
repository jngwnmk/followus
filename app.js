var express = require('express')
  , http = require('http')
  , app = express();

app.get(['/', '/index.html'], function (req, res){
    res.send('Hello Elastic Beanstalk - Git');
});

http.createServer(app).listen(process.env.PORT || 3000);
