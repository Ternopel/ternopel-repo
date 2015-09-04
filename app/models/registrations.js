'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring registrations");
	var constants = require('../../utils/constants');
	models.registrations = db.define("registrations", { 
			id:				{ type: 'serial', key: true}, 
			token:		 	{ type: 'text', required: true },
			email_address: 	{ type: 'text', required: true, unique:true }
		},
		{
			cache:	false,
			validations: {
				
			}
		}
	);	
};
