'use strict';

(function (appconfig) {

	var logger			= require("./utils/logger")(module),
		express			= require('express'),
		expressconfig	= require("./utils/expressconfig"),
		modelconfig		= require("./utils/modelconfig"),
		pageinfoconfig	= require("./utils/pageinfoconfig"),
		routesconfig	= require("./utils/routesconfig"),
		liquibase		= require("./utils/liquibase");

	appconfig.init = function (config, callback) {

		logger.info("Running liquibase");
		liquibase.init(config);

		var app = express(); 

		logger.info("Configuring express");
		expressconfig.init(app, express, config);

		logger.info("Configuring orm");
		modelconfig.init(app, express, config, callback);

		logger.info("Configuring user session");
		pageinfoconfig.session(app);

		logger.info("Configuring page params");
		pageinfoconfig.params(app);
		
		logger.info("Configuring routes");
		routesconfig.init(app); 

		logger.info("Configuring error routes");
		expressconfig.addErrorRoutes(app,logger); 
		
	};

})(module.exports);

