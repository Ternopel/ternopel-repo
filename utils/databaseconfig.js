(function (databaseConfig) {

	var logger				= require("../utils/logger");

	databaseConfig.init = function (app, express) {
		var orm = require('orm');
		
		var opts = {
			database	: "ternopel_test",
			protocol	: "postgres",
			host		: "localhost",
			port		: 5432,         // optional, defaults to database default
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
				models.users = db.define("users", { 
						email_address:	String,
						first_name:		String,
						last_name:		String
					},
					{
						methods: {
							fullName: function() {
								return this.firstName + ' ' + this.lastName;
							}
						},
						validations: {
							
						}
					}
				);
			}
		}));		
		
	};
	
})(module.exports);
