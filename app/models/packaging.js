'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring packaging");
	models.packaging = db.define("packaging", { 
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
