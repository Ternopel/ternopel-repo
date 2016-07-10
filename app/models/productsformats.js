'use strict';

var logger		= require("../../utils/logger")(module),
	elastic		= require('../controllers/elastic_controller');

module.exports = function (orm, db, models, config) {

	

	models.updateProduct = function(_this,config) {
		elastic.get_client(config.app_elastic_host,function(err,client) {
			if(err) {
				logger.error(err);
			}
			else {
				elastic.index_product(config.app_elastic_host,config.app_elastic_index,db,_this.product_id,function(err) {
					if(!err) {
						logger.info("Record "+_this.id+" has been indexed");
					}
					else {
						logger.error(err);
					}
				});
			}
		});
	}
	
	
	logger.debug("Configuring products formats");
	models.productsformats = db.define("products_formats", { 
			id:				{ type: 'serial', key: true}, 
			format: 		{ type: 'text', required: true, unique: true },
			quantity: 		{ type: 'number', size:8, required: true },
			units: 			{ type: 'number', size:8, required: true },
			wholesale:		{ type: 'number', size:8, required: true },
			retail:			{ type: 'number', size:8, required: true }
		},
		{
			cache:	false,
			hooks: {
				afterSave: function (success) {
					if(success) {
						models.updateProduct(this,config);
					}
				},
				afterRemove :function(success){
					if(success) {
						models.updateProduct(this,config);
					}
				} 
			}
		}
	);	
	
	logger.debug("Configuring products formats relations");
	models.productsformats.hasOne("product",models.products,{ required: true, reverse: "productsFormats" });
};
