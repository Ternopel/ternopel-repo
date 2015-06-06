module.exports = {
	get_home: function(req, res, next) {
		req.logger.info("Rendering home with log status:"+req.usersession.isLogged());
		var user_id;
		if(req.usersession.isLogged()==='true') {
			user_id = req.usersession.user_id;
		}
		
		res.render('home.html',{category:req.params.category, product:req.params.product, is_logged_in:req.usersession.isLogged(), user_id: req.usersession.user_id});
	}
};
