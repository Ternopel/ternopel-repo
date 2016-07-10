'use strict';

var logger		= require("../../utils/logger")(module),
	elastic		= require('../controllers/elastic_controller');

module.exports = function (orm, db, models,config) {

	logger.debug("Configuring products");
	models.products = db.define("products", { 
			id:				{ type: 'serial', key: true}, 
			name:		 	{ type: 'text', required: true},
			description:	{ type: 'text', required: true},
			url:			{ type: 'text', required: true,unique:true },
			show_format:	{ type: 'boolean', required: true },
			is_visible:		{ type: 'boolean', required: true },
			is_offer:		{ type: 'boolean', required: true }
		},
		{
			cache:	false,
			hooks: {
				afterSave: function (success) {
					if(success) {
						var _this = this;
						elastic.get_client(config.app_elastic_host,function(err,client) {
							if(err) {
								logger.error(err);
							}
							else {
								elastic.index_product(config.app_elastic_host,config.app_elastic_index,db,_this.id,function(err) {
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
				},
				afterRemove :function(success){
					if(success) {
						var _this = this;
						elastic.get_client(config,function(err,client) {
							if(err) {
								logger.error(err);
							}
							else {
								elastic.remove_product(config.app_elastic_host,config.app_elastic_index,_this.id,function(err) {
									if(!err) {
										logger.info("Record "+_this.id+" has been removed from index");
									}
									else {
										logger.error(err);
									}
								});
							}
						});
					}
				}
			}
		}
	);	
	
	logger.debug("Configuring products relations");
	models.products.hasOne("category",models.categories,{ required: true, reverse: "products" });
	models.products.hasOne("packaging",models.packaging,{ required: true, reverse: "products" });
	logger.debug("Products relations configured");
};
