'use strict';

var logger = require("../../utils/logger")(module);

module.exports = {
	get_data_policy: function(req, res, next) {
		logger.info("Rendering data policy");
		res.render('data_policy.html',req.pageinfo);
	}
};
