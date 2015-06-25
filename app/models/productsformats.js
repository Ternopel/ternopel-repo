module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring products formats");
	models.productsformats = db.define("products_formats", { 
			id:				{ type: 'serial', key: true}, 
			format: 		{ type: 'text', required: true},
			quantity: 		{ type: 'integer', size:4, required: true },
			units: 			{ type: 'integer', size:4, required: true },
			wholesale:		{ type: 'number', size:8, required: true },
			retail:			{ type: 'number', size:8, required: true }
		},
		{
			methods: {
			},
			validations: {
			}
		}
	);	
	
	logger.debug("Configuring products formats relations");
	models.productsformats.hasOne("product",models.products,{ required: true, reverse: "productsFormats" });
};
