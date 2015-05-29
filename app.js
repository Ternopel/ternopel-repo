var logger			= require("./utils/logger"),
	express			= require('express'),
	dots			= require("dot").process({path: "./views"}),
	expressConf		= require("./utils/express-config");

var app = express(); 

logger.info("configuring express....");
expressConf.init(app, express); 
logger.info("Express configured");

logger.info("configuring /");
var routes = require('./routes/index')(dots); 
app.use('/', routes);

logger.info("Adding error routes");
expressConf.addErrorRoutes(app);

module.exports = app;
