function authentication_post(url, formid) {
	make_post(url,formid,function (response) {
		if (!('success'===response)) {
			show_error_messages(response);
		} 
		else {
			window.location.href	= '/';
		}
	});
}