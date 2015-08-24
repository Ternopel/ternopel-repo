'use strict';

// links scrolling automatically
$(function () {
	sneak_links(document.getElementById('ulcategories'),'categories');
});

$(function () {
	sneak_links(document.getElementById('ulproducts'),'products');
});

// expand
$(function () {
	$("span[name='expand']").click(function () {
		var liname		=$(this).parent().attr('name');
		window.location.href = '/'+liname;
	});
});

// compress
$(function () {
	$("span[name='compress']").click(function () {
		window.location.href = '/';
	});
});

$(function () {
	$("button[name='homesearchbutton']").click(function () {
		var searchvalue		=$("input[name='homesearchinput']").val();
		if(searchvalue) {
			window.location.href = '/search/'+searchvalue;
		}
		else {
			window.location.href = '/';
		}
	});
});
