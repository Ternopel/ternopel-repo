(function (sessionconfigu) {

	sessionconfigu.init = function (app) {
		app.use(function(req, res, next) {
			next();
		});
	};
	
})(module.exports);
