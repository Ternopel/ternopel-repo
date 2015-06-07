var logger			= require("./utils/logger"),
	express			= require('express'),
	appconfig		= require("./utils/appconfig")(),
	expressconfig	= require("./utils/expressconfig"),
	modelconfig		= require("./utils/modelconfig"),
	sessionconfig	= require("./utils/sessionconfig"),
	routesconfig	= require("./utils/routesconfig"),
	liquibase		= require("./utils/liquibase");

logger.info("Running liquibase");
liquibase.init(logger,appconfig);

var app = express(); 

logger.info("Configuring express");
 expressconfig.init(app, express,logger, appconfig);

logger.info("Configuring orm");
modelconfig.init(app, express, logger, appconfig);

logger.info("Configuring user session");
sessionconfig.init(app);

logger.info("Configuring routes");
routesconfig.init(app); 

logger.info("Configuring error routes");
expressconfig.addErrorRoutes(app,logger); 

logger.info("Starting server");
var server = app.listen(3000, function() {
	logger.info('Listening on port:'+server.address().port);
});


module.exports = function () {
	return {
		stop: function() {
			logger.info("Closing server");
			server.close();
		},
		listen: function(ready) {
				logger.info("Listen");
				server.listen(3000, function() {
					return ready(appconfig);
				});
		},
		get_test_app: function () {
			appconfig.app_run_liquibase = 'false';
			return app;
		}
	};
};



