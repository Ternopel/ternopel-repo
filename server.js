var logger		= require("./utils/logger"),
	config		= require("./utils/config")(),
	app			= require("./app.js");

logger.info("Creating express app");
app.init(logger,config, function(app,db) {
	
	logger.info("Starting server");
	var server = app.listen(3000, function() {
		logger.info('Listening on port:'+server.address().port);
	});
	
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
