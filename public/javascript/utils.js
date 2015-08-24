'use strict';

function make_form_post(url, formid, successcallback,errorcallback) {
	console.log("Submitting form");
	var formdata = $( '#'+formid ).serialize();
	$.ajax({
		url : url,
		type : 'POST',
		data : formdata,
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
			$("input[name='" + error.param+"']").attr("class", "required");
			$("#" + error.param+"_error").html(error.msg);
		}
	});
}


function clear_notification_toolbar() {
	console.log("Clearing notification toolbar");
	$("div[id='notifications']").hide();
}

function clear_error_fields(form) {
	clear_notification_toolbar();
	console.log("Clearing form fields");
	form.find(":input").attr("class", "gogog");
}

function sneak_links(ul_to_sneak,description) {
	if(!ul_to_sneak) {
		return;
	}
	console.log('Sneaking ul of '+description);
	var sneaky = new ScrollSneak(location.hostname);
	var tabs = ul_to_sneak.getElementsByTagName('li');
	var i = 0;
	var len = tabs.length;
	for (; i < len; i++) {
		tabs[i].onclick = sneaky.sneak;
	}
}