var express	= require('express');
var router	= express.Router();
var dots;

/* GET home page. */
router.get('/', function(req, res, next) {
	/* res.render('index', { title: 'Express' }); */
	console.log("Luisito");
	if(dots) {
		console.log("Tiene valor");
	}
	return res.status(200).send(dots.index());
});



module.exports = function(dots2) {
	dots = dots2;

	if(dots) {
		console.log("XXTiene valor");
	}

	
	return router;
}
