module.exports = {
	get_categories: function(req, res, next) {
		req.logger.info("Rendering admin/categories");
		
		req.models.categories.find({},['name'],function(err,categories) {
			if(err) {
				return next(err);
			}
			var pageinfo	= ld.merge(req.sessionstatus, {categories:categories});
			res.render('admin_categories.html',pageinfo);
		});
	},

	post_categories: function(req, res, next) {
		req.logger.info("En post categories");
		var id				= req.body.id;
		var columnname		= req.body.colname;
		var value			= req.body.value;
		
		logger.info("EN POST CON id:"+id+" "+colname+" "+value);
		return res.status(200).send('success');
	}


};
