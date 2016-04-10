'use strict';

var logger		= require("./utils/logger")(module),
	config		= require("./utils/config")(),
	cronconfig	= require("./utils/cronconfig"),
	app			= require("./app.js"),
	fs			= require('fs'),
	http		= require('http');
	

logger.info("Creating express app");
app.init(config, function(app,db,models) {
	
	logger.info("Creating server");
	var server = http.createServer();
	server.on('request',app);

	logger.info("Starting server");
	server.listen(config.app_port,function() {
		logger.info('Listening on port:'+server.address().port);
	});
	
	logger.info("Configuring cron");
	cronconfig.init(logger, config, models, db); 
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
