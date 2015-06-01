(function (modelconfig) {

	var logger				= require("../utils/logger");

	modelconfig.init = function (app, express) {
		var orm = require('orm');
		
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
				require('../app/models/users.js')(orm,db,models);
			}
		}));		
	};
	
})(module.exports);
