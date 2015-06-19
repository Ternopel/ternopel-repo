module.exports = {
	get_categories: function(req, res, next) {
		req.logger.info("Rendering admin/categories");
		
		req.models.categories.find({},['name'],function(err,categories) {
			if(err) {
				return next(err);
			}
			var pageinfo	= ld.merge(req.sessionstatus, {categories:categories, csrfToken: req.csrfToken()});
			res.render('admin_categories.html',pageinfo);
		});
	},

	post_categories: function(req, res, next) {
		req.logger.info("En post categories");
		var id			= req.body.id;
		var colname		= req.body.colname;
		var colvalue	= req.body.value;
		
		req.assert('colvalue',		'El valor es requerido').notEmpty();

		var valerrors = req.validationErrors();
		if(valerrors) {
			/*
			req.logger.debug("ErrorES:"+JSON.stringify(valerrors));
			var errormessage = '';
			valerrors.forEach(function(error) {
				errormessage = errormessage + error.msg;
			});
			var jsonerror = [{'param':'general','msg':errormessage}];
			req.logger.debug("Errores de validacion encontrados:"+JSON.stringify(jsonerror));
			*/
			return res.status(500).send(valerrors);
		}

		req.logger.info("Getting id:"+id);
		req.models.categories.get(id,function(err,category) {
			if(err) {
				var jsonerror = [{'param':'general','msg':err}];
				return res.status(500).send(jsonerror);
			}
			if(colname==='name')	category.name = value;
			if(colname==='url')		category.url = value;
			req.logger.info("Updating category");
			category.save(function(err) {
				if(err) {
					var jsonerror = [{'param':'general','msg':err}];
					return res.status(500).send(jsonerror);
				}
				req.logger.debug('Returning success');
				return res.status(200).send('success');
			});
		});		
	},

	put_categories: function(req, res, next) {
		req.logger.info('En PUT categories');
		
		req.logger.info('Creating category');
		req.models.categories.create({	name:			'Insert Category Text here',
										url:			'Insert Category url here'},function(err,category) {
			if(err) {
				req.logger.debug("Error:"+err);
				return next(err);
			}
			req.logger.debug("Sending category to browser:"+JSON.stringify(category));
			return res.status(200).send(category);
		});
	}
	
	
	
};
