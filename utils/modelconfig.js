(function (modelconfig) {

	modelconfig.init = function (app, express, logger) {
		var orm = require('orm');
		
		logger.debug("Setting database connection info");
		
		var opts = {
			database	: "ternopel_test",
			protocol	: "postgres",
			host		: "localhost",
			port		: 5432,
			user		: "postgres",
			password	: "Pilarcita1",
			query		:	{
				pool		: true,
				debug		: false,
				strdates	: false
			}
		};
		
		app.use(orm.express(opts, {
			define: function (db, models) {
				require('../app/models/roles.js')(orm,db,models,logger);
				require('../app/models/users.js')(orm,db,models,logger);
				require('../app/models/userssessions.js')(orm,db,models,logger);
			}
		}));		
	};
	
})(module.exports);
