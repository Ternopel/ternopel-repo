module.exports = {
	get_home: function(req, res, next) {
		req.logger.info("Rendering home with log status:"+req.usersession.isLogged());
		res.render('home.html',{category:req.params.category, product:req.params.product, is_logged_in:req.usersession.isLogged()});
	}
};
