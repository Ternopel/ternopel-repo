var logger			= require("./utils/logger"),
	express			= require('express'),
	dots			= require("dot").process({path: "./views"}),
	expressconf		= require("./utils/expressconfig"),
	databaseconf	= require("./utils/databaseconfig"),
	liquibase		= require("./utils/liquibase");

logger.info("Running liquibase");
liquibase.init();

var app = express(); 

logger.info("Configuring express....");
expressconf.init(app, express); 

logger.info("ORM config ....");
databaseconf.init(app, express); 

var about = require('./routes/about')(dots); 
app.use('/', about);

var myaccount = require('./routes/myaccount')(dots); 
app.use('/', myaccount);

var home = require('./routes/home')(dots); 
app.use('/', home);

logger.info("Adding error routes");
expressconf.addErrorRoutes(app,dots);

module.exports = app;
