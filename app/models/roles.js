module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring roles");
	models.roles = db.define("roles", { 
			name:		{ type: 'text', required: true }
		},
		{
			methods: {
			},
			validations: {
			}
		}
	);	
};
