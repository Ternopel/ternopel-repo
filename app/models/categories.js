'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = function (orm, db, models) {

	logger.debug("Configuring categories");
	models.categories = db.define("categories", { 
			id:			{ type: 'serial', key: true}, 
			name:		{ type: 'text', required: true },
			url:		{ type: 'text', required: true }
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
