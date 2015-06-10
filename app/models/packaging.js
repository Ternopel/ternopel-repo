module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring packaging");
	models.packaging = db.define("packaging", { 
			id:			{ type: 'serial', key: true}, 
			name:		{ type: 'text', required: true,unique:true }
		},
		{
			methods: {
			},
			validations: {
			}
		}
	);	
};
