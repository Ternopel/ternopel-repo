var utils	= require('./utils');

module.exports = {
	post_productsformats: function(req, res, next) {

		req.logger.info("En POST products");
		
		var id			= req.body.id;
		var colname		= req.body.colname;
		var colvalue	= req.body.colvalue;
		req.assert('colvalue',		'El valor es requerido').notEmpty();

		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				var filter = '';
				if(colname==='format') {
					filter={ format:colvalue };
					req.logger.info("Searching using filter:"+JSON.stringify(filter));
					req.models.productsformats.find(filter, function(err,productsformats) {
						if(err) {
							return callback(err);
						}
						if(productsformats.length===1 && productsformats[0].id != id) {
							return callback('El valor asignado a la columna existe en otro registro ('+productsformats[0].id+')');
						}
						return callback();
					});
				}
				else {
					return callback();
				}
			},
			function(callback) {
				req.logger.info("Getting id:"+id);
				req.models.productsformats.get(id,function(err,productformat) {
					return callback(err,productformat);
				});
			},
			function(productformat,callback) {
				if(colname==='format') {
					productformat.format	= colvalue;
				}
				if(colname==='units') {
					productformat.units	= colvalue;
				}
				if(colname==='quantity') {
					productformat.quantity	= colvalue;
				}
				if(colname==='retail') {
					productformat.retail	= colvalue;
				}
				if(colname==='wholesale') {
					productformat.wholesale	= colvalue;
				}
				
				req.logger.info("Updating product format:"+JSON.stringify(productformat));
				productformat.save(function(err) {
					return callback(err);
				});
			}
		], 
		function(err) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.logger.debug('Returning success');
			return res.status(200).send('success');
		});
	},
	
	delete_productsformats: function(req, res, next) {
		req.logger.info('En DELETE products formats');
		
		var id			= req.body.id;
		req.logger.debug("Starting product format deletion with id:"+id);
		
		req.models.productsformats.get(id, function(err,productformat) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			
			productformat.remove(function (err) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				req.logger.debug("Product:"+JSON.stringify(productformat));
				return res.status(200).send('success');
			});
		});
	}
};


