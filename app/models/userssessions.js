module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring users sessions");
	models.userssessions = db.define("users_sessions", { 
			id:				{ type: 'serial', key: true}, 
			token:		 	{ type: 'text', required: true },
			last_access: 	{ type: 'date', required: true, time: true }
		},
		{
			cache:	false,
			methods: {
				isLogged: function() {
					return (this.user_id !== null);
				}
			},
			validations: {
				
			}
		}
	);
	
	logger.debug("Configuring users sessions relations");
	models.userssessions.hasOne("user",models.users, { required: false, alwaysValidate: true });
};
