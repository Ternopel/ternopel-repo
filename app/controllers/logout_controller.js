module.exports = {
	get_logout: function(req, res, next) {
		
		req.logger.info("Rendering about");
		res.render('about.html');
	}
};
