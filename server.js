var logger		= require("./utils/logger"),
	config		= require("./utils/config")(),
	app			= require("./app.js");

logger.info("Creating express app");
var appref = app.init(logger,config);

logger.info("Starting server");
var server = appref.listen(3000, function() {
	logger.info('Listening on port:'+server.address().port);
});
