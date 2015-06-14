module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring categories");
	models.categories = db.define("categories", { 
			id:			{ type: 'serial', key: true}, 
			name:		{ type: 'text', required: true,unique:true },
			url:		{ type: 'text', required: true,unique:true }
		},
		{
			methods: {
			},
			validations: {
			}
		}
	);
};
