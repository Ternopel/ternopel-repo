'use strict';

module.exports = function (orm, db, models,logger) {

	logger.debug("Configuring shopping cart");
	models.shoppingcart = db.define("shopping_cart", { 
			id:				{ type: 'serial', key: true}, 
			quantity: 		{ type: 'number', size:8, required: true },
		},
		{
			cache:	false,
			methods: {
				isLogged: function() {
					return (this.user_id !== null);
				}
			},
			validations: {
				
			}
		}
	);
	
	logger.debug("Configuring shopping cart relations");
	models.shoppingcart.hasOne("user_session",models.userssessions, { required: true, alwaysValidate: true });
	models.shoppingcart.hasOne("product_format",models.productformats, { required: true, alwaysValidate: true });
};
