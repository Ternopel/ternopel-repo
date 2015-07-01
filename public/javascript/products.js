// Enter on search field
$(function () {
	var input=$("input[name='search']");
	input.keypress(function (e) {	
		if (e.which == 13) {
			window.location.href = '/admin/products?search='+input.val();
		}
	});
});

// See formats
/*
$(function () {
	var input=$("input[name='formatscheck']");
	input.click(function (e) {	
		var check		=$(this);
		var trid		=$(this).parent().parent().attr('name');
		var formatstr	=$('tr[name='+trid+'_format]');
		if(check.is(':checked')) {
			formatstr.show();
		}
		else {
			formatstr.hide();
		}
	});
});
*/

// Add product
$(function () {
	$("#addProduct").click(function () {
		add('/admin/products');
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


