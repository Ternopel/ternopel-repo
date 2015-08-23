'use strict';

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

