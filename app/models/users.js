'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring users");
	var constants = require('../../utils/constants');
	models.users = db.define("users", { 
			id:				{ type: 'serial', key: true}, 
			email_address: 	{ type: 'text', required: true, unique:true },
			password: 		{ type: 'text', required: true },
			first_name:		{ type: 'text', required: true },
			last_name:		{ type: 'text', required: true },
			address:		{ type: 'text', required: false },
			city:			{ type: 'text', required: false },
			telephone:		{ type: 'text', required: false },
			zipcode:		{ type: 'number', size:4, required: false },
			state:			{ type: 'number', size:4, required: false }
		},
		{
			cache:	false,
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
