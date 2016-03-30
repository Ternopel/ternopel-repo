'use strict';

var reportutil = require("../../utils/reportutil");

module.exports = {

	get_report_pdf: function(req, res, next) {
		reportutil.report(req.logger, req.db, 'phantom-pdf', function(err,out) {
			if(err) {
				next(err);
			}
			else {
				out.stream.pipe(res);
			}
		});
	},
		
	get_report_jpg: function(req, res, next) {
		reportutil.report(req.logger, req.db, 'phantom-image', function(err,out) {
			if(err) {
				next(err);
			}
			else {
				out.stream.pipe(res);
			}
		});
	}
};
