'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring products formats");
	models.productspictures = db.define("products_pictures", { 
			id:				{ type: 'serial', key: true}, 
			content_type: 	{ type: 'text', required: true },
			last_update: 	{ type: 'date', size:4, required: true }
		},
		{
			cache:	false,
			methods: {
			},
			validations: {
			}
		}
	);	
};
