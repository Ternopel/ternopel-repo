module.exports = {
		
	get_home: function(req, res, next) {
		var ld = require('lodash');
		
		req.logger.info('Rendering home with:'+JSON.stringify(req.sessionstatus));
		var pageinfo = ld.merge(req.sessionstatus, {category:req.params.category, product:req.params.product});
		req.models.categories.find({},['name'],function(err,categories) {
			if(err) {
				next(err);
			}
		
			for (i=0,ilen=categories.length;i<ilen;++i) {
				var category = categories[i];
				if(category.url === req.params.category) {
					ld.merge(category,{selected: true});
				}
				else {
					ld.merge(category,{selected: false});
				}
				
				var products = category.products;
				for (j=0,jlen=products.length;j<jlen;++j) {
					var product = products[j];

					if(product.url === req.params.product) {
						ld.merge(product,{selected: true});
					}
					else {
						ld.merge(product,{selected: false});
					}
				}
			}
			
			req.logger.debug('categories:'+JSON.stringify({categories:categories}));
			ld.merge(pageinfo,{categories:categories});
			res.render('home.html',pageinfo);
		});
		
	}
};
