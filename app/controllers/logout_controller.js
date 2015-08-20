'use strict';

module.exports = {
	get_logout: function(req, res, next) {
		req.logger.info('Executing logout');
		req.usersession.removeUser(function(err) {
			if(err) {
				next(err);
			}
			req.logger.info('User removed from session');
			return res.redirect('/');
		});
	}
};
