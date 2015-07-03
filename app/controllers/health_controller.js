module.exports = {
	get_health: function(req, res, next) {
		req.logger.info("Rendering heath");
		return res.status(200).send('OK');
	}
};
