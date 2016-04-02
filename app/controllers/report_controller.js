'use strict';

var reportutil	= require("../../utils/reportutil"),
	logger		= require("../../utils/logger")(module);

module.exports = {

	get_report_pdf: function(req, res, next) {
		reportutil.report(logger, req.db, 'phantom-pdf', function(err,out) {
			if(err) {
				next(err);
			}
			else {
				out.stream.pipe(res);
			}
		});
	},
		
	get_report_jpg: function(req, res, next) {
		reportutil.report(logger, req.db, 'phantom-image', function(err,out) {
			if(err) {
				next(err);
			}
			else {
				out.stream.pipe(res);
			}
		});
	}
};
