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

// Add product
$(function () {
	$("#cancelProductFormat").click(function () {
		console.log('Add product format pressed');
		var csrf		=$("input[name='_csrf']").val();
		var product_id	=$(this).attr('name');
		var formdata	={_csrf:csrf, product_id:product_id};
		console.log('Data to send:'+JSON.stringify(formdata));
		$.ajax({
			url : '/admin/productsformats',
			type : 'GET',
			data : formdata,
			success : function (entity) {
				console.log(entity);
				window.location.href = entity;
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


// Calculate price
$(function () {
	$("input[name^='quantity_']").filter(function() {
		$(this).keyup(function (event) {
			
			clear_notification_toolbar();
			
			var keyCode = event.which;
			if ((!((keyCode > 46 && keyCode < 58))) && keyCode != 0) {
				event.preventDefault();
			}
			
			var productformatid = $(this).attr('alt');
			console.log($(this).val());
			
			$.ajax({
				url : '/shoppingcart/pricecalculation?productformatid='+productformatid+'&quantity='+$(this).val()+'&incart=false',
				type : 'GET',
				success : function (price) {
					console.log(price);
					$("span[name='price_"+productformatid+"']").text("$ "+price);
				},
				error : function(errorresponse) {
					$("span[name='price_"+productformatid+"']").text("");
				}
			});
		});
	});
});


// Add to basket
$(function () {
	$("a[name^='addtocart_']").click(function(event) {

		
		event.preventDefault();
		
		var current			= $(this);
		var csrf			= $("input[name='_csrf']").val();
		var productformatid = current.attr('alt');
		var quantity		= $("input[name='quantity_"+productformatid+"']").val();
		var formdata		= {_csrf:csrf, productformatid:productformatid,quantity:quantity};
		
		console.log('Data to send:'+JSON.stringify(formdata));
		
		$.ajax({
			url : '/shoppingcart/addproducttocart',
			type : 'POST',
			data: formdata,
			success : function (price) {
				console.log(price);
				$("span[name='cart_count']").text(price);
				$("a[name='cart_a']").attr('href','/shoppingcart');
				show_error_messages({responseText:"[{\"param\":\"general\",\"msg\":\"Producto agregado al carrito !\"}]"});
			},
			error : function(errorresponse) {
				console.log(errorresponse);
			},
			complete: function(status) {
			}
		});
	});
});


// Calculate price
$(function () {
	$("a[name^='change_image_']").click(function(event) {
		var productpictureid = $(this).attr('alt');
		console.log(productpictureid);
		
		$("img[name='min_image']").attr('src','/images/productspictures/'+productpictureid);
		$("img[name='max_image']").attr('src','/images/productspictures/'+productpictureid);
		
		return false;
	});
});



