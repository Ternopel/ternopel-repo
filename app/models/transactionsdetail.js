'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring transactions headers");
	models.transactionsdetail = db.define("transactions_detail", { 
			id:				{ type: 'serial', key: true}, 
			quantity: 		{ type: 'number', size:8, required: true },
			price: 			{ type: 'number', size:8, required: true },
		},
		{
			cache:	false,
			validations: {
				
			}
		}
	);
	
	logger.debug("Configuring transactions detail relations");
	models.transactionsdetail.hasOne("product_format",models.productformats, { required: true, reverse: "productsformat" });
	models.transactionsdetail.hasOne("transaction_header",models.transactionsheader,{ required: true, reverse: "transactionsdetail" });
};
