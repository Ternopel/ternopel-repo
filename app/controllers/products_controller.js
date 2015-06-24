var utils	= require('./utils');

module.exports = {
	get_products: function(req, res, next) {
		req.logger.info('En GET products with search:'+req.query.search);
		req.models.products.find({},['description']).where('lower(description) ilike ?',['%'+req.query.search+'%']).run(function(err,products) {
			if(err) {
				return next(err);
			}
			var ld			= require('lodash');
			var pageinfo	= ld.merge(req.sessionstatus, {products:products, csrfToken: req.csrfToken(),search: req.query.search});
			req.logger.info('Getting packaging');
			req.models.packaging.find({},['name'],function(err,packaging) {
				if(err) {
					return next(err);
				}
				ld.merge(pageinfo, {packaging:packaging});
				req.logger.info('Getting categories');
				req.models.categories.find({},['name'],function(err,categories) {
					if(err) {
						return next(err);
					}
					ld.merge(pageinfo, {categories:categories});
					req.logger.info('Rendering page');
					res.render('admin_products.html',pageinfo);
				});
			});
		});
	},

	post_products: function(req, res, next) {
		req.logger.info('En POST products');
	},

	put_products: function(req, res, next) {
		req.logger.info('En PUT products');
	},
	
	delete_products: function(req, res, next) {
		req.logger.info('En DELETE products');
	}
};
