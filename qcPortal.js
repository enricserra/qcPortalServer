var express = require('express');
var app = express();

var configure_app = function(app) {
 app.set('view engine', 'pug');
 app.set('./views/');
 app.use('/static', express.static('public'));
 };


configure_app(app);
require('./app/routes.js')(app);



app.listen(8200, function () {

    console.log('Node Server launched, listening on port 8200')

});
