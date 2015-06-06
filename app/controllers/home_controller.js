module.exports = {
	get_home: function(req, res, next) {
		req.logger.info("Rendering home with log status:"+req.usersession.isLogged());
		if(req.usersession.isLogged()===true) {
			req.logger.debug('Getting logged in user info');
			req.usersession.getUser(function (err, user) {
				if(err) {
					next(err);
				}
				req.logger.debug("User found:"+JSON.stringify(user));
				res.render('home.html',{category:req.params.category, product:req.params.product, is_logged_in:true, email_address: user.email_address});
			});
		}
		else {
			req.logger.debug('No info user to display');
			res.render('home.html',{category:req.params.category, product:req.params.product, is_logged_in:false});
		}
		
	}
};
