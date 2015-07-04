'use strict';

module.exports = {
	get_health: function(req, res, next) {
		return res.status(200).send('OK');
	}
};
