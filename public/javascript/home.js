'use strict';

// links scrolling automatically
$(function () {
	var sneaky = new ScrollSneak(location.hostname);
	var tabs = document.getElementById('ulcategories').getElementsByTagName('li');
	var i = 0;
	var len = tabs.length;
	for (; i < len; i++) {
		tabs[i].onclick = sneaky.sneak;
	}
});

$(function () {
	var sneaky = new ScrollSneak(location.hostname);
	var tabs = document.getElementById('ulproducts').getElementsByTagName('li');
	var i = 0;
	var len = tabs.length;
	for (; i < len; i++) {
		tabs[i].onclick = sneaky.sneak;
	}
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

