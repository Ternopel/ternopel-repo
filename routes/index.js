var express	= require('express');
var router	= express.Router();
var dots;

/* GET home page. */
router.get('/', function(req, res, next) {
	return res.status(200).send(dots.index());
});

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
