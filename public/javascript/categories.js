'use strict';

// Add category
$(function () {
	$("#addCategory").click(function () {
		add('/admin/categories');
	});
});

// Add hover efect to all images
/*
$(function () {
	$("ul#ulproducts img").each(function(){
		$(this).hoverpulse();
	});
});
*/
