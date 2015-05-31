var logger			= require("./utils/logger"),
	express			= require('express'),
	expressconfig	= require("./utils/expressconfig"),
	databaseconfig	= require("./utils/databaseconfig"),
	routesconfig	= require("./utils/routesconfig"),
	liquibase		= require("./utils/liquibase");

logger.info("Running liquibase");
liquibase.init();

var app = express(); 

logger.info("Configuring express");
expressconfig.init(app, express); 

logger.info("Configuring orm");
databaseconfig.init(app, express); 

logger.info("Configuring routes");
routesconfig.init(app); 

//var about = require('./routes/about')(dots); 
//app.use('/', about);
//
//var welcome = require('./routes/welcome')(dots); 
//app.use('/', welcome);
//
//var myaccount = require('./routes/myaccount')(dots); 
//app.use('/', myaccount);
//
//var home = require('./routes/home')(dots); 
//app.use('/', home);
//
//logger.info("Adding error routes");
//expressconf.addErrorRoutes(app,dots);

module.exports = app;
