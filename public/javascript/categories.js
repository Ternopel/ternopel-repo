'use strict';

// Add category
$(function () {
	$("#addCategory").click(function () {
		add('/admin/categories');
	});
});

// Add hover efect to all images
$(function () {
	$("ul#ulproducts img").each(function(){
		$(this).hover(function() {
			$(this).attr('style','transform: scale(1.1) rotate(3deg);');
		}, function() {
			$(this).attr('style','');
		});		
	});
});
