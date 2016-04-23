'use strict';

$(function() {
	var form = $('#listdelivery_form');
	form.find('button[name="send"]').click(function() {
		make_form('listdelivery_form', 
			function (successresponse) {
				window.location.href	= '/admin/listdelivery';
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
		return false;
	});
});

