var express	= require('express'),
	router	= express.Router(),
	logger	= require("../utils/logger");

var dots;

/* GET home page. */
router.get('/welcome', function(req, res, next) {
	return res.status(200).send(dots.welcome());
});

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
