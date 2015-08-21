'use strict';

(function (modelconfig) {

	modelconfig.init = function (app, express, logger, config, callback) {
		var orm = require('orm');
		
		logger.debug("Setting database connection info");
		
		var opts = {
			database	: config.db_database,
			protocol	: config.db_protocol,
			host		: config.db_host,
			port		: config.db_port,
			user		: config.db_user,
			password	: config.db_password,
			query		:	{
				pool		: true,
				debug		: config.db_show_sql,
				strdates	: false
			}
		};
		
		app.use(orm.express(opts, {
			define: function (db, models) {
				require('../app/models/categories.js')(orm,db,models,logger);
				require('../app/models/packaging.js')(orm,db,models,logger);
				require('../app/models/products.js')(orm,db,models,logger);
				require('../app/models/productsformats.js')(orm,db,models,logger);
				require('../app/models/productspictures.js')(orm,db,models,logger);
				require('../app/models/roles.js')(orm,db,models,logger);
				require('../app/models/users.js')(orm,db,models,logger);
				require('../app/models/userssessions.js')(orm,db,models,logger);

				return callback(app,db);
			}
		}));		
	};
	
})(module.exports);
