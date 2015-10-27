'use strict';

var cipher	= require('../../utils/cipher'),
	utils	= require('./utils'),
	ld		= require('lodash');

module.exports = {
	get_price_calculation: function(req, res, next) {
		req.logger.info("En GET price calculation");
		
		req.checkQuery('productformatid', 'Id de Formato de Producto es requerido').notEmpty();
		req.checkQuery('quantity', 'Cantidad es requerida y numérica').notEmpty().isInt();
		
		var productformatid	= req.query.productformatid;
		var quantity		= req.query.quantity;

		req.logger.info("Validating fields");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		req.logger.info("Calculating price");
		req.models.productsformats.get(productformatid,function(err,productformat) {
			if(err) {
				return utils.send_ajax_error(req,res,err)
			}
			return res.status(200).send('success');
		});
	}
};
