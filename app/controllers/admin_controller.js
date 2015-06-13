module.exports = {
	get_admin: function(req, res, next) {
		req.logger.info("Rendering admin");
		res.render('admin.html',req.sessionstatus);
	}
};
