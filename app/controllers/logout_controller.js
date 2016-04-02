'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = {
	get_logout: function(req, res, next) {
		logger.info('Executing logout');
		req.usersession.removeUser(function(err) {
			if(err) {
				next(err);
			}
			logger.info('User removed from session');
			return res.redirect('/');
		});
	}
};
