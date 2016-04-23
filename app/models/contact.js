'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring contact");
	var constants = require('../../utils/constants');
	models.contact = db.define("contact", { 
			id:				{ type: 'serial', key: true}, 
			email_address: 	{ type: 'text', required: true, unique:true },
			first_name:		{ type: 'text', required: true },
			last_name:		{ type: 'text', required: true },
			comments:		{ type: 'text', required: true },
			sent:			{ type: 'boolean', required: true }
		},
		{
			cache:	false,
			validations: {
				
			}
		}
	);	
	
};
