'use strict';

(function (routesconfig) {
		
	function restrict(req, res, next) {
		if (req.pageinfo.is_logged_in === true && req.pageinfo.is_admin === true) {
			next();
		} 
		else {
			next('Usted no tiene permisos para ver esta página. Vayase de aquí o llamaremos al CUCO !');
		}
	}	

	var controllers = require('../app/controllers/controller');
	routesconfig.init = function (app) {
		
		app.get		( '/health',				controllers.health.get_health);

		app.get		( '/admin',					restrict);
		app.get		( '/admin',					controllers.admin.get_admin);
		
		app.get		( '/admin/categories',		restrict);
		app.get		( '/admin/categories',		controllers.categories.get_categories);
		app.post	( '/admin/categories',		controllers.categories.post_categories);
		app.put		( '/admin/categories',		controllers.categories.put_categories);
		app.delete	( '/admin/categories',		controllers.categories.delete_categories);

		app.get		( '/admin/products',		restrict);
		app.get		( '/admin/products',		controllers.products.get_products);
		app.post	( '/admin/products',		controllers.products.post_products);
		app.put		( '/admin/products',		controllers.products.put_products);
		app.delete	( '/admin/products',		controllers.products.delete_products);
		
		app.post	( '/admin/productsformats',	controllers.productsformats.post_productsformats);
		app.put		( '/admin/productsformats',	controllers.productsformats.put_productsformats);
		app.delete	( '/admin/productsformats',	controllers.productsformats.delete_productsformats);

		var multipart			= require('connect-multiparty');
		var multipartMiddleware = multipart();
		
		app.get		( '/admin/productspictures',controllers.productspictures.get_productspictures);
		app.post	( '/admin/productspictures',multipartMiddleware,controllers.productspictures.post_productspictures);
		
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
