'use strict';

$(function() {
	var form = $('#listdelivery_form');
	form.find('button[name="send"]').click(function() {
		make_form('listdelivery_form', 
			function (successresponse) {
				show_error_messages({responseText:"[{\"param\":\"general\",\"msg\":\"Correo ha sido correctamente enviado !!.\"}]"});
				$('input[name="email_address"]').val('');
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
		return false;
	});
});

