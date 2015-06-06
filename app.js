var logger			= require("./utils/logger"),
	express			= require('express'),
	expressconfig	= require("./utils/expressconfig"),
	modelconfig		= require("./utils/modelconfig"),
	sessionconfig	= require("./utils/sessionconfig"),
	routesconfig	= require("./utils/routesconfig"),
	liquibase		= require("./utils/liquibase");

logger.info("Running liquibase");
liquibase.init(logger);

var app = express(); 

logger.info("Configuring express");
expressconfig.init(app, express,logger);

logger.info("Configuring orm");
modelconfig.init(app, express, logger);

logger.info("Configuring user session");
sessionconfig.init(app);

logger.info("Configuring routes");
routesconfig.init(app); 

logger.info("Configuring error routes");
expressconfig.addErrorRoutes(app,logger); 

module.exports = app;
