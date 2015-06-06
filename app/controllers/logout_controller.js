module.exports = {
	get_logout: function(req, res, next) {
		req.logger.info('User is logged in:'+req.usersession.isLogged());
		req.logger.info('Logout');
		req.usersession.save({user_id:null},function(err) {
			if(err) {
				next(err);
			}
			req.logger.info("Rendering home");
			return res.redirect('/');
		});
	}
};
