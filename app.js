var logger			= require("./utils/logger"),
	express			= require('express'),
	dots			= require("dot").process({path: "./views"}),
	expressConf		= require("./utils/express-config"),
	liquibase		= require("./utils/liquibase");

logger.info("Running liquibase");
liquibase.init();

var app = express(); 

logger.info("configuring express....");
expressConf.init(app, express); 
logger.info("Express configured");

var about = require('./routes/about')(dots); 
app.use('/', about);

var home = require('./routes/home')(dots); 
app.use('/', home);

logger.info("Adding error routes");
expressConf.addErrorRoutes(app,dots);

module.exports = app;
