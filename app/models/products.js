module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring products");
	models.products = db.define("products", { 
			id:				{ type: 'serial', key: true}, 
			description: 	{ type: 'text', required: true},
			url:			{ type: 'text', required: true,unique:true }
		},
		{
			methods: {
			},
			validations: {
			}
		}
	);	
	
	logger.debug("Configuring products relations");
	models.products.hasOne("category",models.categories,{ required: true, autoFetch:true, reverse: "products" });
	models.products.hasOne("packaging",models.packaging,{ required: true, autoFetch:true, reverse: "products" });
	logger.debug("Products relations configured");
};
