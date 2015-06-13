$(function() {
	var $form = $('#registration_form');
	$form.find('input[type="submit"]').click(function() {
		clear_error_fields($form);
		make_post('/registration','registration_form',function (response) {
			if ('success_admin'===response) {
				window.location.href	= '/admin';
			} 
			if ('success_client'===response) {
				window.location.href	= '/';
			} 
			show_error_messages(response);
		});
		return false;
	});
});