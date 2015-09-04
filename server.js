'use strict';

var logger		= require("./utils/logger"),
	config		= require("./utils/config")(),
	cronconfig	= require("./utils/cronconfig"),
	app			= require("./app.js");

logger.info("Creating express app");
app.init(logger,config, function(app,db,models) {
	
	logger.info("Starting server");
	var server = app.listen(config.app_port, function() {
		logger.info('Listening on port:'+server.address().port);
	});

	logger.info("Configuring cron");
	cronconfig.init(logger, config, models); 
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
