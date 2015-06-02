function make_post(url, formid, callback) {
	alert(formid);
//	var formdata = new FormData($("#" + formid)[0]);
	var formdata = new FormData(document.getElementById(formid));
	alert(formdata);
	alert('entering makepost 2');
	$.ajax({
		url : url,
		type : 'POST',
		data : formdata,
		async : false,
		mimeType : "multipart/form-data",
		cache : false,
		contentType : false,
		processData : false,
		success : callback
	});
}

function show_error_messages(errors) {
	$.each(errors, function(index, error) {
		console.log(error);
		$("#" + error.param).attr("class", "required");
		if (error.param === 'general') {
			$("." + error.param + "_error_msg").html(error.msg);
			$("#" + error.param + "_error").show();
		}
	});
	$('html, body').animate({ scrollTop : 0}, 'fast');
}
