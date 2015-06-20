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
			res.render('admin_products.html',pageinfo);
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
