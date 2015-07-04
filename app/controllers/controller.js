'use strict';

module.exports = {
	health:				require('./health_controller'),
	admin:				require('./admin_controller'),
	categories:			require('./categories_controller'),
	products:			require('./products_controller'),
	productsformats:	require('./productsformats_controller'),
	report:				require('./report_controller'),
	registration:		require('./registration_controller'),
	home:				require('./home_controller'),
	logout:				require('./logout_controller')
};
