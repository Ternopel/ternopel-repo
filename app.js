var logger			= require("./utils/logger"),
	express			= require('express'),
	expressconfig	= require("./utils/expressconfig"),
	modelconfig		= require("./utils/modelconfig"),
	routesconfig	= require("./utils/routesconfig"),
	liquibase		= require("./utils/liquibase");

logger.info("Running liquibase");
liquibase.init();

var app = express(); 

logger.info("Configuring express");
expressconfig.init(app, express); 

logger.info("Configuring orm");
modelconfig.init(app, express); 

logger.info("Configuring routes");
routesconfig.init(app); 

logger.info("Configuring error routes");
expressconfig.addErrorRoutes(app); 

module.exports = app;
