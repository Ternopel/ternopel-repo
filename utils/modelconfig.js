'use strict';

var logger = require("./logger")(module);

(function (modelconfig) {

	modelconfig.init = function (app, express, config, callback) {
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
				require('../app/models/categories.js')(orm,db,models);
				require('../app/models/packaging.js')(orm,db,models);
				require('../app/models/products.js')(orm,db,models);
				require('../app/models/productsformats.js')(orm,db,models);
				require('../app/models/productspictures.js')(orm,db,models);
				require('../app/models/roles.js')(orm,db,models);
				require('../app/models/users.js')(orm,db,models);
				require('../app/models/userssessions.js')(orm,db,models);
				require('../app/models/posters.js')(orm,db,models);
				require('../app/models/registrations.js')(orm,db,models);
				require('../app/models/mailing.js')(orm,db,models);
				require('../app/models/shoppingcart.js')(orm,db,models);
				require('../app/models/transactionsheader.js')(orm,db,models);
				require('../app/models/transactionsdetail.js')(orm,db,models);

				return callback(app,db,models);
			}
		}));		
	};
	
})(module.exports);
