module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring users");
	models.users = db.define("users", { 
			id:				{ type: 'serial', key: true}, 
			email_address: 	{ type: 'text', required: true },
			password: 		{ type: 'text', required: true },
			first_name:		{ type: 'text', required: false },
			last_name:		{ type: 'text', required: false }
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
	
	logger.debug("Configuring users relations");
	models.users.hasOne("role",models.roles);
};
