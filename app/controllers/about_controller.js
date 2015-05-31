var logger	= require('../../utils/logger');

module.exports = {
	get_about: function(req, res, next) {
		logger.info("Rendering about");
		res.render('about.html')
	}
};
