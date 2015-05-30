var express	= require('express'),
	router	= express.Router(),
	logger	= require('../utils/logger');

var dots;

/* GET My account page. */
router.get('/my-account', function(req, res, next) {
	return res.status(200).send(dots.myaccount({errormessage: ''}));
});

router.post('/register', function(req, res, next) {
	logger.info('Setting form properties');
	var formdata=req.body.user;
	logger.info('User trying to register:'+formdata.name);
	
	req.models.users.find({email_address: formdata.name}, function(err,user) {
		if(err) return next(err);
		if(user.length==1) {
			logger.info("User "+formdata.name+" already exists");
			return res.status(200).send(dots.myaccount({errormessage: 'Usuario ya existe'}));
		}
		else {
			logger.info("User "+formdata.name+" is new");
			return res.redirect(301,'/welcome');
		}
	});
	
});

module.exports = function(dotsparam) {
	dots = dotsparam;
	return router;
};
