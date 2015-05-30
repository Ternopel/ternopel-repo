var express	= require('express'),
	router	= express.Router(),
	logger	= require('../utils/logger');

var dots;

/* GET My account page. */
router.get('/my-account', function(req, res, next) {
	return res.status(200).send(dots.myaccount());
});

router.post('/register', function(req, res, next) {
	logger.info('Setting form properties');
	var formdata=req.body.user;
	logger.info('User trying to register:'+formdata.name);
	
	req.models.users.find({email_address: formdata.name}, function(err,user) {
		if(err) throw err;
		if(user.length==1) {
			logger.info("User "+formdata.name+" already exists");
		}
		else {
			logger.info("User "+formdata.name+" is new");
		}
	});
	
	return res.status(200).send(dots.myaccount());
});

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
