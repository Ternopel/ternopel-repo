module.exports = {
	get_categories: function(req, res, next) {
		req.logger.info('En GET categories');
		
		req.models.categories.find({},['name'],function(err,categories) {
			if(err) {
				return next(err);
			}
			var pageinfo	= ld.merge(req.sessionstatus, {categories:categories, csrfToken: req.csrfToken()});
			res.render('admin_categories.html',pageinfo);
		});
	},

	post_categories: function(req, res, next) {
		req.logger.info("En POST categories");
		
		var id			= req.body.id;
		var colname		= req.body.colname;
		var colvalue	= req.body.colvalue;
		req.assert('colvalue',		'El valor es requerido').notEmpty();

		var valerrors = req.validationErrors();
		if(valerrors) {
			return res.status(500).send(valerrors);
		}

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				if(colname==='name')	var filter={ name:colvalue };
				if(colname==='url')		var filter={ url:colvalue };
				req.logger.info("Searching using filter:"+JSON.stringify(filter));
				req.models.categories.find(filter, function(err,categories) {
					if(err) {
						return callback(err);
					}
					if(categories.length===1 && categories[0].id != id) {
						return callback('El valor asignado a la columna existe en otro registro ('+categories[0].id+')');
					}
					return callback();
				});
			},
			function(callback) {
				req.logger.info("Getting id:"+id);
				req.models.categories.get(id,function(err,category) {
					return callback(err,category);
				});
			},
			function(category,callback) {
				if(colname==='name')	category.name	= colvalue;
				if(colname==='url')		category.url	= colvalue;
				
				req.logger.info("Updating category:"+JSON.stringify(category));
				category.save(function(err) {
					return callback(err);
				});
			}
		], 
		function(err) {
			if(err) {
				var jsonerror = [{'param':'general','msg':err}];
				return res.status(500).send(jsonerror);
			}
			req.logger.debug('Returning success');
			return res.status(200).send('success');
		});
	},

	put_categories: function(req, res, next) {
		req.logger.info('En PUT categories');
		
		var milli=new Date().getTime();
		req.logger.info('Creating category');
		req.models.categories.create({	name:			'A Insert Category Text here '+milli,
										url:			'A Insert Category url here'+milli},function(err,category) {
			if(err) {
				var jsonerror = [{'param':'general','msg':err}];
				return res.status(500).send(jsonerror);
			}
			req.logger.debug("Sending category to browser:"+JSON.stringify(category));
			return res.status(200).send(category);
		});
	},
	
	delete_categories: function(req, res, next) {
		req.logger.info('En DELETE categories');
		
		var id			= req.body.id;
		
		req.logger.debug("Starting category deletion with id:"+id);
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info("Getting category");
				req.models.categories.get(id, function(err,category) {
					if(err) {
						return callback(err);
					}
					req.logger.debug("Category:"+JSON.stringify(category));
					return callback(null,category);
				});
			},
			function(category,callback) {
				req.logger.info("Getting products");
				category.getProducts(function(err,products) {
					if(err) {
						return callback(err);
					}
					req.logger.info("Products quantity:"+products.length);
					if(products.length>0) {
						return callback('Esta categoría tiene '+products.length+' productos asociados. Borre primero los productos');
					}
				});
			}
		], 
		function(err) {
			req.logger.info("En function error de waterfall:"+err);
			if(err) {
				var jsonerror = [{'param':'general','msg':err}];
				return res.status(500).send(jsonerror);
			}
			req.logger.debug('Returning success');
			return res.status(200).send('success');
		});

		
//		req.models.categories.get(id).getProducts(function(err,products) {
//			req.logger.info('MEC>1');
//			if(err) {
//				req.logger.info('MEC>2');
//				var jsonerror = [{'param':'general','msg':err}];
//				return res.status(500).send(jsonerror);
//			}
//			req.logger.info('MEC>3');
//			if(products.length>0) {
//				req.logger.info('MEC>4');
//				var jsonerror = [{'param':'general','msg':'Esta categoría tiene productos asociados. Borre primero los productos'}];
//				return res.status(500).send(jsonerror);
//			}
//		});
	}
	
	
};
