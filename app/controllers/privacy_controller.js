'use strict';

module.exports = {
	get_data_policy: function(req, res, next) {
		req.logger.info("Rendering data policy");
		res.render('data_policy.html',req.pageinfo);
	}
};
