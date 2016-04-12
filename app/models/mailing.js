'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring mailing");
	var constants = require('../../utils/constants');
	models.mailing = db.define("mailing", { 
			id:				{ type: 'serial', key: true}, 
			token:		 	{ type: 'text', required: true },
			email_address: 	{ type: 'text', required: true, unique:true },
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
