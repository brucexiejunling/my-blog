var express = require('express');
var router = express.Router();
var debug = require('debug')('blog');
var config = require('./config/common');

var server = express();

var configServer = function() {
	require('./config/express')(server, router);
};

var initRouters = function() {
	require('./routes/index')(router);
	require('./routes/article')(router);
	require('./routes/admin')(router);
};

module.exports = {
	start: function() {
		configServer();
		initRouters();

		server.listen(config.port, function() {
			console.log('listening on' + config.port);
  		debug('Express server listening on port ' + config.port);
		});
	},
	stop: function() {
		server.close();
	}
};