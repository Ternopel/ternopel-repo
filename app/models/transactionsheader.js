'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring transactions headers");
	models.transactionsheader = db.define("transactions_header", { 
			id:				{ type: 'serial', key: true}, 
			purchase_date: 	{ type: 'date', required: true, time: true },
			delivery_type: 	{ type: 'number', size:4, required: true },
			payment_type: 	{ type: 'number', size:4, required: true },
			total_purchase:	{ type: 'number', size:8, required: true },
			mail_sent:		{ type: 'boolean', required: true },
			comments:		{ type: 'text', required: false },
		},
		{
			cache:	false,
			validations: {
				
			}
		}
	);
	
	logger.debug("Configuring transactions header relations");
	models.transactionsheader.hasOne("user",models.users, { required: true, alwaysValidate: true });
};
