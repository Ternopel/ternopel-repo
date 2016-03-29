'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring mailing");
	var constants = require('../../utils/constants');
	models.mailing = db.define("mailing", { 
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
