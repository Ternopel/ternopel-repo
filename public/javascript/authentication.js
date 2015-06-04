function authentication_post(url, formid) {
	clear_error_fields();
	make_post(url,formid,function (response) {
		if (!('success'===response)) {
			show_error_messages(response);
		} 
		else {
			console.log('Post ok. Redirecting to home');
			window.location.href	= '/';
		}
	});
}