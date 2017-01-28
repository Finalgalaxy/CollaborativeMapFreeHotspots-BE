// Requires npm packages
var express = require('express');
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');

var config = require('./config');
var mailer = require('./mailer');
mailer.init();


// Require also internal backend node scripts
var connection = require('./connection'); // Note: exported 'class' Connection()
var mongoconnection = require('./mongoconnection'); // Note: exported 'class' MongoConnection()
var routes = require('./routes'); // Note: exported 'configure' function
 
// Init express
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cookieparser());

// Server cross-domain details for setting possible accesses
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.control_allow_origin_urls); // Allow cross-domain control access only to the server itself
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // Allow those operations
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');		 // Headers allowed
  next();
}
 
// Use cross domain config function inside the app
app.use(allowCrossDomain);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

connection.init(); // Init DB
mongoconnection.init();
routes.configure(app); // Give express to configure option for end-points configuration

// Start the server
var server = app.listen(config.server_port, config.server_ip_address, function() {
  console.log('Server active, listening on port ' + server.address().port + '.');
});
module.exports = server