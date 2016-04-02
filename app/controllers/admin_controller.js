'use strict';

var logger	= require("../../utils/logger")(module);

module.exports = {
	get_admin: function(req, res, next) {
		logger.info("Rendering admin");
		res.render('admin.html',req.pageinfo);
	}
};
