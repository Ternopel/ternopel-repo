function make_post(url, formid, callback) {
	var formdata = $( '#'+formid ).serialize();
	$.ajax({
		url : url,
		type : 'POST',
		data : formdata,
		success : callback
	});
}

function show_error_messages(errors) {
	$.each(errors, function(index, error) {
		if (error.param === 'general') {
			alert('1');
			$("#" + error.param + "_error").show();
			$("#" + error.param + "_error").html(error.msg);
		}
		else {
			$("input[name='" + error.param+"']").attr("class", "required");
			$("#" + error.param+"_error").html(error.msg);
		}
	});
}
