function make_post(url, formid, callback) {
	console.log("Posting form "+formid);
	var formdata = $( '#'+formid ).serialize();
	$.ajax({
		url : url,
		type : 'POST',
		data : formdata,
		success : callback
	});
}

function show_error_messages(errors) {
	console.log("Showing error messages");
	$.each(errors, function(index, error) {
		if (error.param === 'general') {
			$("#" + error.param + "_error").show();
			$("#" + error.param + "_error").html(error.msg);
		}
		else {
			$("input[name='" + error.param+"']").attr("class", "required");
			$("#" + error.param+"_error").html(error.msg);
		}
	});
}

function clear_error_fields() {
	console.log("Clearing error fields");
	
	$("div[id$='_error']").html('');
	/*
	$('.required').each(function(elem) {
		$(this).removeClass('required');
	});
	*/
}

