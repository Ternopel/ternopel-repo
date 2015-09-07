'use strict';

$(function() {
	$("input[name='password']").hideShowPassword(false, true);
});

$(function() {
	var $form = $('#confirm_form');
	$form.find('button[name="confirm"]').click(function() {
		clear_error_fields($form);
		make_form('/confirm','confirm_form', 
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

$(function() {
	var $form = $('#login_form');
	$form.find('button[name="login"]').click(function() {
		clear_error_fields($form);
		make_form('/login','login_form', 
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

$(function() {
	var $form = $('#registration_form');
	$form.find('button[name="registration"]').click(function() {
		clear_error_fields($form);
		make_form('/registration','registration_form', 
			function (successresponse) {
				window.location.href	= '/mailsent/'+successresponse;
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
		return false;
	});
});