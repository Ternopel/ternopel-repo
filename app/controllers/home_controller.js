module.exports = {
		
	get_home: function(req, res, next) {
		var ld = require('lodash');
		
		req.logger.info('Rendering home with:'+JSON.stringify(req.sessionstatus));
		var pageinfo = ld.merge(req.sessionstatus, {category:req.params.category, product:req.params.product});
		req.models.categories.find({},function(err,categories) {
			if(err) {
				next(err);
			}
		
			
			req.logger.debug('categories:'+JSON.stringify(categories));
			ld.merge(pageinfo,{categories:categories});
			res.render('home.html',pageinfo);
		});
		
	}
};
