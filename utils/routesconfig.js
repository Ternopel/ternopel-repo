'use strict';

(function (routesconfig) {
		
	function restrict(req, res, next) {
		if (req.path.indexOf("/admin")===(0)) {
			if(req.pageinfo.is_logged_in === true && req.pageinfo.is_admin === true) {
				next();
			}
			else {
				next('Usted no tiene permisos para ver esta página. Vayase de aquí o llamaremos al CUCO !');
			}
		}
		else {
			next();
		}
	}	

	var controllers = require('../app/controllers/controller');
	routesconfig.init = function (app) {
		
		app.use		(restrict);
		
		app.get		( '/health',							controllers.health.get_health);

		app.get		( '/admin',								controllers.admin.get_admin);
		
		app.get		( '/admin/categories',					controllers.categories.get_categories);
		app.post	( '/admin/categories',					controllers.categories.post_categories);
		app.put		( '/admin/categories',					controllers.categories.put_categories);
		app.delete	( '/admin/categories',					controllers.categories.delete_categories);

		app.get		( '/admin/products',					controllers.products.get_products);
		app.post	( '/admin/products',					controllers.products.post_products);
		app.delete	( '/admin/products',					controllers.products.delete_products);
		
		app.get		( '/admin/products/add',				controllers.newproducts.get_add_product);
		app.get		( '/admin/products/edit',				controllers.newproducts.get_edit_product);
		app.post	( '/admin/products/save',				controllers.newproducts.post_edit_product);
		app.put		( '/admin/products/save',				controllers.newproducts.put_edit_product);
		app.get		( '/admin/products/picture/edit',		controllers.newproducts.get_edit_product_picture);
		app.get		( '/admin/products/formats/edit',		controllers.newproducts.get_edit_product_formats);
		
		app.get		( '/admin/productsformats',				controllers.productsformats.get_productsformats);
		app.post	( '/admin/productsformats',				controllers.productsformats.post_productsformats);
		app.put		( '/admin/productsformats',				controllers.productsformats.put_productsformats);
		app.delete	( '/admin/productsformats',				controllers.productsformats.delete_productsformats);

		app.get		( '/admin/posters',						controllers.posters.get_posters);
		app.get		( '/admin/posters/add',					controllers.posters.get_add_page);
		app.put		( '/admin/posters',						controllers.posters.put_posters);
		app.get		( '/images/posters/picture/:id',		controllers.posters.get_picture);
		app.delete	( '/admin/posters',						controllers.posters.delete_posters);

		var multipart			= require('connect-multiparty');
		var multipartMiddleware = multipart();
		
		app.get		( '/images/productspictures/:id',		controllers.productspictures.get_productspictures);
		app.post	( '/admin/productspictures',			multipartMiddleware,controllers.productspictures.post_productspictures);
		
		app.get		( '/shoppingcart/pricecalculation',		controllers.shoppingcart.get_price_calculation);
		app.get		( '/shoppingcart/get_cart_count',		controllers.shoppingcart.get_cart_products_count);
		app.post	( '/shoppingcart/addproducttocart',		controllers.shoppingcart.post_product_to_cart);
		app.delete	( '/shoppingcart/deleteshoppingcart',	controllers.shoppingcart.delete_product_of_cart);
		app.get		( '/shoppingcart',						controllers.shoppingcart.get_shopping_cart);
		
		app.get		( '/report.pdf',						controllers.report.get_report_pdf);
		app.get		( '/report.jpg',						controllers.report.get_report_jpg);

		app.get		( '/login',								controllers.registration.get_login);
		app.get		( '/mailsent/:email',					controllers.registration.get_mail_sent);
		app.post	( '/login',								controllers.registration.post_login);
		app.get		( '/registration/:token',				controllers.registration.get_registration);
		app.get		( '/mailing/:token',					controllers.registration.get_mailing);
		app.post	( '/registration',						controllers.registration.post_registration);
		app.post	( '/confirm',							controllers.registration.post_confirm);
		app.post	( '/mailing',							controllers.registration.post_mailing);
		
		app.get		( '/privacy/datapolicy',				controllers.privacy.get_data_policy);
		
		app.get		( '/logout',							controllers.logout.get_logout);

		app.get		( '/',									controllers.home.get_home);
		app.get		( '/search/:search',					controllers.home.get_home);
		app.get		( '/:category',							controllers.home.get_home);
		app.get		( '/:category/:product',				controllers.home.get_home);

	};
	
})(module.exports);
