(function (routesconfig) {
		
	function restrict(req, res, next) {
		if (req.sessionstatus.is_logged_in === true && req.sessionstatus.role_id === req.constants.ADMIN_ID) {
			next();
		} 
		else {
			next('Restricted area !');
		}
	}	

	var controllers = require('../app/controllers/controller');
	routesconfig.init = function (app) {
		app.get( '/admin',				restrict);
		app.get( '/admin',				controllers.admin.get_admin);
		app.get( '/about',				controllers.about.get_about);
		app.get( '/registration',		controllers.registration.get_registration);
		app.post('/registration',		controllers.registration.post_registration);
		app.get( '/login',				controllers.registration.get_login);
		app.get( '/logout',				controllers.logout.get_logout);
		app.get( '/',					controllers.home.get_home);
		app.get( '/:category',			controllers.home.get_home);
		app.get( '/:category/:product',	controllers.home.get_home);
	};
	
})(module.exports);
