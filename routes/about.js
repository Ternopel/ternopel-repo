var express	= require('express'),
	router	= express.Router(),
	logger	= require("../utils/logger");

var dots;

/* GET home page. */
router.get('/about', function(req, res, next) {
	return res.status(200).send(dots.about());
});

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
