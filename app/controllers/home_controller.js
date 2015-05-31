var logger	= require('../../utils/logger');

module.exports = {
	get_home: function(req, res, next) {
		logger.info("Rendering home");
		res.render('home.html',{category:req.params.category, product:req.params.product})
	}
};
