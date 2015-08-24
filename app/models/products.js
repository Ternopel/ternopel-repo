'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring products");
	models.products = db.define("products", { 
			id:				{ type: 'serial', key: true}, 
			name:		 	{ type: 'text', required: true},
			url:			{ type: 'text', required: true,unique:true },
			show_format:	{ type: 'boolean', required: true },
			is_visible:		{ type: 'boolean', required: true },
			is_offer:		{ type: 'boolean', required: true }
		},
		{
			cache:	false,
			methods: {
			},
			validations: {
			}
		}
	);	
	
	logger.debug("Configuring products relations");
	models.products.hasOne("category",models.categories,{ required: true, reverse: "products" });
	models.products.hasOne("packaging",models.packaging,{ required: true, reverse: "products", autoFetch:true });
	logger.debug("Products relations configured");
};
