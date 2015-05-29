var express	= require('express'),
	router	= express.Router(),
	logger	= require("../utils/logger");

var dots;

/* GET home page. */
router.get('/', function(req, res, next) {
	var index = dots.index();
	logger.info(JSON.stringify(index));
	return res.status(200).send(index);
});

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
