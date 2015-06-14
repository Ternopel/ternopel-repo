module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring products");
	models.products = db.define("products", { 
			id:				{ type: 'serial', key: true}, 
			description: 	{ type: 'text', required: true},
			packaging: 		{ type: 'text', required: true},
			units: 			{ type: 'integer', size:4, required: true },
			wholesale:		{ type: 'number', size:8, required: true },
			retail:			{ type: 'number', size:8, required: true },
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
	models.products.hasOne("category",models.categories,{ required: true, reverse: "products" });
};
