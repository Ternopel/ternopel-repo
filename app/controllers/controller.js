'use strict';

module.exports = {
	health:				require('./health_controller'),
	shoppingcart:		require('./shoppingcart_controller'),
	admin:				require('./admin_controller'),
	categories:			require('./categories_controller'),
	products:			require('./products_controller'),
	newproducts:		require('./new_products_controller'),
	productsformats:	require('./productsformats_controller'),
	productspictures:	require('./productspictures_controller'),
	report:				require('./report_controller'),
	registration:		require('./registration_controller'),
	home:				require('./home_controller'),
	logout:				require('./logout_controller'),
	privacy:			require('./privacy_controller'),
	contact:			require('./contact_controller'),
	posters:			require('./posters_controller'),
	elastic:			require('./elastic_controller'),
	redis:				require('./redis_controller')
};
