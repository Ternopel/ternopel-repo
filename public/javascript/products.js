'use strict';

// Enter on search field
$(function () {
	var input=$("input[name='search']");
	input.keypress(function (e) {	
		if (e.which == 13) {
			window.location.href = '/admin/products?search='+input.val();
		}
	});
});

// Add product
$(function () {
	$("#addProductFormat").click(function () {
		console.log('Add product format pressed');
		var csrf		=$("input[name='_csrf']").val();
		var product_id	=$(this).attr('name');
		var formdata	={_csrf:csrf, product_id:product_id};
		console.log('Data to send:'+JSON.stringify(formdata));
		$.ajax({
			url : '/admin/productsformats',
			type : 'PUT',
			data : formdata,
			success : function (entity) {
				console.log(entity);
				window.location.reload(true);
			},
			error : function(errorresponse) {
				show_error_messages(errorresponse);
			}
		});
	});
});

// Save product
$(function () {
	$("button[name='saveProduct']").click(function (event) {
		event.preventDefault();
		make_form('save_product', 
			function (url) {
				console.log(url);
				window.location.href = url;
			},
			function (errorresponse) {
				show_error_messages(errorresponse);
			}
		);
	});
});

// Save product
$(function () {
	$("a[name='productimage']").click(function (event) {
		event.preventDefault();
		$("a[name='productimagehidden']").bPopup();
	});
});


// Save product
$(function () {
	
	$("input[name^='calculateproductformat_']").filter(function() {
		
		$(this).keyup(function (event) {
			var keyCode = event.which;
			if ((!((keyCode > 46 && keyCode < 58))) && keyCode != 0) {
				event.preventDefault();
			}
			
			alert('HOLA '+$(this).val());
		});
	});
});


