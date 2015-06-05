module.exports = {
	get_home: function(req, res, next) {
		var is_logged_in = req.sessionstatus.is_logged_in;
		req.logger.info("Rendering home with is_logged_in:"+req.sessionstatus.is_logged_in);
		res.render('home.html',{category:req.params.category, product:req.params.product, is_logged_in:req.sessionstatus.is_logged_in});
	}
};
