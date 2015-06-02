(function (routesconfig) {

	var controllers = require('../app/controllers/controller');
	
	routesconfig.init = function (app) {
		app.get( '/about',				controllers.about.get_about);
		app.get( '/authentication',		controllers.authentication.get_authentication);
		app.post('/authentication',		controllers.authentication.post_authentication);
		app.get( '/',					controllers.home.get_home);
		app.get( '/:category',			controllers.home.get_home);
		app.get( '/:category/:product',	controllers.home.get_home);
	};
	
})(module.exports);
