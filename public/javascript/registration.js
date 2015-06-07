$(function() {
	var $form = $('#registration_form');
	$form.find('input[type="submit"]').click(function() {
		clear_error_fields($form);
		make_post('/registration','registration_form',function (response) {
			if (!('success'===response)) {
				show_error_messages(response);
			} 
			else {
				window.location.href	= '/';
			}
		});
		return false;
	});
});