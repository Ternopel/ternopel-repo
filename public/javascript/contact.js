'use strict';

$(function() {
	var form = $('#contact_form');
	form.find('button[name="send"]').click(function() {
		make_form('contact_form', 
			function (successresponse) {
				window.location.href	= '/contact/messagesent';
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
		return false;
	});
});

