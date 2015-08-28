'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring posters");
	models.posters = db.define("posters", { 
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
	
	logger.debug("Configuring posters relations");
	models.posters.hasOne("category",models.categories,{ reverse: "posters",autoFetch:true,required: true });
	models.posters.hasOne("product",models.products,{ reverse: "posters",autoFetch:true });
	logger.debug("Posters relations configured");
};
