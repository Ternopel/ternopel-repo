(function (routesconfig) {
		
	function restrict(req, res, next) {
		if (req.sessionstatus.is_logged_in === true && req.sessionstatus.is_admin === true) {
			next();
		} 
		else {
			next('Usted no tiene permisos para ver esta página. Vayase de aquí o llamaremos al CUCO !');
		}
	}	

	var controllers = require('../app/controllers/controller');
	routesconfig.init = function (app) {
		app.get		( '/admin',					restrict);
		app.get		( '/admin',					controllers.admin.get_admin);
		
		app.get		( '/admin/categories',		restrict);
		app.get		( '/admin/categories',		controllers.categories.get_categories);
		app.post	( '/admin/categories',		controllers.categories.post_categories);
		app.put		( '/admin/categories',		controllers.categories.put_categories);
		app.delete	( '/admin/categories',		controllers.categories.delete_categories);

		app.get		( '/report',				controllers.report.get_report);

		app.get		( '/registration',			controllers.registration.get_registration);
		app.post	( '/registration',			controllers.registration.post_registration);
		app.get		( '/login',					controllers.registration.get_login);
		
		app.get		( '/logout',				controllers.logout.get_logout);

		app.get		( '/',						controllers.home.get_home);
		app.get		( '/:category',				controllers.home.get_home);
		app.get		( '/:category/:product',	controllers.home.get_home);
	};
	
})(module.exports);
