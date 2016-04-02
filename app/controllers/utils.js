'use strict';

var logger		= require("../../utils/logger")(module);

module.exports = {
	send_ajax_error: function(req, res, err) {
		logger.error('Error sent to browser:'+err);
		var jsonerror = [{'param':'general','msg':err}];
		return res.status(500).send(jsonerror);
	},
	send_ajax_validation_errors: function(req, res, err) {
		logger.error('Error sent to browser:'+JSON.stringify(err));
		return res.status(500).send(err);
	}
};
