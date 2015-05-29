var express	= require('express'),
	router	= express.Router(),
	logger	= require("../utils/logger");

var dots;

//route middleware to validate :category
router.param('category', function(req, res, next, category) {
	logger.info("Category is:"+category)
    req.category = category;
    next(); 
});

//route middleware to validate :product
router.param('product', function(req, res, next, product) {
	logger.info("Product is:"+product)
	req.product = product;
	next(); 
});

/* GET home page. */
router.get('/', function(req, res, next) {
	return renderHomePage(req,res);
});

/* GET home page. */
router.get('/:category', function(req, res, next) {
	return renderHomePage(req,res);
});

/* GET home page. */
router.get('/:category/:product', function(req, res, next) {
	return renderHomePage(req,res);
});

function renderHomePage(req,res,category,product) {
	return res.status(200).send(dots.index({category:req.category, product:req.product}));
}

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
