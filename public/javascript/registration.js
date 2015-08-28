'use strict';

$(function() {
	var $form = $('#registration_form');
	$form.find('button[type="submit"]').click(function() {
		clear_error_fields($form);
		make_form('/registration','registration_form',
			function (successresponse) {
				if ('success_admin'===successresponse) {
					window.location.href	= '/admin';
				} 
				if ('success_client'===successresponse) {
					window.location.href	= '/';
				} 
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
		return false;
	});
});