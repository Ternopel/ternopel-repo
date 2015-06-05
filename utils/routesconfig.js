(function (routesconfig) {

	var controllers = require('../app/controllers/controller');
	
	routesconfig.init = function (app) {
		app.get( '/about',				controllers.about.get_about);
		app.get( '/registration',		controllers.registration.get_registration);
		app.post('/registration',		controllers.registration.post_registration);
		app.get( '/logout',				controllers.logout.get_logout);
		app.get( '/',					controllers.home.get_home);
		app.get( '/:category',			controllers.home.get_home);
		app.get( '/:category/:product',	controllers.home.get_home);
	};
	
})(module.exports);
