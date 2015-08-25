'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring banners");
	models.banners = db.define("banners", { 
			id:				{ type: 'serial', key: true}, 
			content_type: 	{ type: 'text', required: true },
			last_update: 	{ type: 'date', size:4, required: true },
			position:	 	{ type: 'integer', size:4, required: true, unique: true }
		},
		{
			cache:	false,
			methods: {
			},
			validations: {
			}
		}
	);	
	
	logger.debug("Configuring banners relations");
	models.banners.hasOne("category",models.categories,{ reverse: "banners" });
	models.banners.hasOne("product",models.products,{ reverse: "banners" });
	logger.debug("Banners relations configured");
};
