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
	
	$("input[name='homesearchinput']").keypress(function (e) {
		if (e.which == 13) {
			$("button[name='homesearchbutton']").click();
		}
	});
	
	$("button[name='homesearchbutton']").click(function () {
		var searchvalue		=$("input[name='homesearchinput']").val();
		if(searchvalue) {
			if(searchvalue.length<3) {
				show_error_messages({responseText:"[{\"param\":\"general\",\"msg\":\"Descripción de producto debe tener más de dos caracteres.\"}]"});
			}
			else {
				window.location.href = '/search/'+searchvalue;
			}
		}
		else {
			window.location.href = '/';
		}
	});
});
