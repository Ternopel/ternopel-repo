module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring users");
	var constants = require('../../utils/constants');
	models.users = db.define("users", { 
			id:				{ type: 'serial', key: true}, 
			email_address: 	{ type: 'text', required: true, unique:true },
			password: 		{ type: 'text', required: true },
			first_name:		{ type: 'text', required: true },
			last_name:		{ type: 'text', required: true }
		},
		{
			methods: {
				fullName: function() {
					return this.first_name + ' ' + this.last_name;
				},
				isAdmin: function() {
					return this.role_id === constants.ADMIN_ID;
				}
			},
			validations: {
				
			}
		}
	);	
	
	logger.debug("Configuring users relations");
	models.users.hasOne("role",models.roles,{ required: true });
};
