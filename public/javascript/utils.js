'use strict';

function make_form(formid, successcallback,errorcallback) {
	console.log("Submitting form");
	var form = $('form#'+formid);
	$.ajax({
		url : form.attr('action'),
		type : form.attr('method'),
		data : form.serialize(),
		success : successcallback,
		error: errorcallback
	});
}

function show_error_messages(errors) {
	console.log("Showing error messages:"+errors.responseText);
	$.each(JSON.parse(errors.responseText), function(index, error) {
		console.log("Error message:"+error.msg);
		if (error.param === 'general') {
			$("section[id='notifications']").show();
			$("#" + error.param + "_error").show();
			$("#" + error.param + "_error").html(error.msg);
		}
		else {
			var input = $("input[name='" + error.param+"']");
			if(!input.length) {
				input = $("select[name='" + error.param+"']");
			}
			input.attr("class", "form-error-input");
			$("#" + error.param+"_error").html(error.msg);
		}
	});
}


function clear_notification_toolbar() {
	console.log("Clearing notification toolbar");
	$("section[id='notifications']").hide();
}

function clear_error_fields(form) {
	clear_notification_toolbar();
	
	console.log("Clearing form fields");
	form.find(":input").removeClass("form-error-input");
	$('.form-error').each(function(elem) {
		$(this).text(''); 
	});
	
}

function sneak_lis(lis,description) {
	if(!lis) {
		return;
	}
	console.log('Sneaking ul of '+description);
	var sneaky = new ScrollSneak(location.hostname);
	var i = 0;
	var len = lis.length;
	for (; i < len; i++) {
		lis[i].onclick = sneaky.sneak;
	}
}
