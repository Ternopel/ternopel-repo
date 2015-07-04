'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring roles");
	models.roles = db.define("roles", { 
			id:			{ type: 'serial', key: true}, 
			name:		{ type: 'text', required: true,unique:true }
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
