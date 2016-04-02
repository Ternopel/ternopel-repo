'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring registrations");
	var constants = require('../../utils/constants');
	models.registrations = db.define("registrations", { 
			id:				{ type: 'serial', key: true}, 
			token:		 	{ type: 'text', required: true },
			email_address: 	{ type: 'text', required: true },
			sent:			{ type: 'boolean', required: true },
			verified:		{ type: 'boolean', required: true }
		},
		{
			cache:	false,
			validations: {
				
			}
		}
	);	
};
