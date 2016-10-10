'use strict';

// links scrolling automatically
$(function () {
	sneak_lis($("ul[name='ulcategories'] li"),'categories');
	sneak_lis($("ul[name='ulproducts'] li"),'products');
	sneak_lis($("ul[name='uloffers'] li"),'all offers');
	sneak_lis($("ul[name='ulalloffers'] li"),'alloffers');
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

	$("input[name='homesearchinputcompressed']").keypress(function (e) {
		if (e.which == 13) {
			$("button[name='homesearchbuttoncompressed']").click();
		}
	});
	
	$("button[name='homesearchbuttoncompressed']").click(function () {
		var searchvalue		=$("input[name='homesearchinputcompressed']").val();
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


$(function () {
	var form = $('#mailing_form');
	form.find('button[name="mailingbutton"]').click(function() {
		make_form('mailing_form', 
			function (successresponse) {
				window.location.href	= '/mailsent/'+successresponse;
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
		return false;
	});
});
