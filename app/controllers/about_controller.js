module.exports = {
	get_about: function(req, res, next) {
		req.logger.info("Rendering about");
		res.render('about.html');
	}
};
