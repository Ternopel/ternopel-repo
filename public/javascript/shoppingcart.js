'use strict';

$(function() {
	$("input[name='password']").hideShowPassword(false, true);
});

$(function() {
	$('#a_already_registered').click(function() {
		console.log('Already registered clicked');
		$('#form_not_registered').hide();
		$('#form_registered').show();
		$('#a_already_registered').hide();
		$('#a_register').show();
		return false;
	});
});

$(function() {
	$('#a_register').click(function() {
		console.log('Register clicked');
		$('#form_not_registered').show();
		$('#form_registered').hide();
		$('#a_already_registered').show();
		$('#a_register').hide();
		return false;
	});
});

$(function() {
	$("a[name^='remove-shopping-cart']").click(function() {
		console.log('Remove shopping cart pressed');
		var id 			= $(this).attr('alt');
		var csrf		= $("input[name='_csrf']").val();	
		console.log('Id:'+id);
		var formdata={shopping_cart_id:id, _csrf:csrf};
		console.log('Data to send:'+JSON.stringify(formdata));
		clear_notification_toolbar();
		
		$.ajax({
			url : '/shoppingcart/deleteshoppingcart',
			type : 'DELETE',
			data : formdata,
			success : function (successresponse) {
				var total_to_decrease	=parseFloat($("span[alt='price_"+id+"']").text());
				var current_total		=parseFloat($("span[name='total']").text());
				var new_total			=(current_total-total_to_decrease).toFixed(2);
				console.log('total_to_decrease:'+total_to_decrease);
				console.log('current_total:'+current_total);
				console.log('new_total:'+new_total);
				$("span[name='total']").text(new_total);
				$("#shopping_cart_id_"+id).remove();
			},
			error : function(errorresponse) {
				console.log(errorresponse);
				show_error_messages(errorresponse);
			}
		});
		
		
		
		return false;
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

			console.log('Getting product format id');
			var productformatid = $(this).attr('alt');
			console.log('productformatid:'+$(this).val());
			
			$.ajax({
				url : '/shoppingcart/pricecalculation?productformatid='+productformatid+'&quantity='+$(this).val()+'&incart=true',
				type : 'GET',
				success : function (price) {
					$("span[name='price_"+productformatid+"']").text(price);
					
					console.log('Calculating total');
					var total = 0;
					$("span[name^='price_']").each(function() {
						console.log('Iterating price');
						console.log('parcial:'+$(this).text());
						console.log('parcial:'+parseFloat($(this).text()));
						total = parseFloat(total) + parseFloat($(this).text()); 
					});
					$("span[name='total']").text(total.toFixed(2));
				},
				error : function(errorresponse) {
					$("span[name='price_"+productformatid+"']").text("");
				}
			});
		});
	});
});

$(function() {
	$("button[name='continue_purchase']").click(function() {
		window.location.href	= '/';
	});
	
	$("button[name='execute_purchase']").click(function() {
		console.log('Execute purchase pressed');
		
		var already_registered	=$('#a_already_registered').is(':visible');
		var register			=$('#a_register').is(':visible');
		
		var formstosend;
		if(already_registered===true) {
			console.log('already_registered');
			formstosend=$('#form_not_registered, #address_info, #delivery_info, #purchase_extras').serialize();
		}
		else {
			if(register===true) {
				console.log('register');
				formstosend=$('#form_registered, #address_info, #delivery_info, #purchase_extras').serialize();
			}
			else {
				console.log('Already logged in');
				formstosend=$('#form_logged_in, #address_info, #delivery_info, #purchase_extras').serialize();
			}
		}
		
		console.log(formstosend);
		clear_error_fields($('#form_logged_in'));
		clear_error_fields($('#form_not_registered'));
		clear_error_fields($('#form_registered'));
		clear_error_fields($('#address_info'));
		clear_error_fields($('#delivery_info'));
		clear_error_fields($('#purchase_extras'));
		
		$.ajax({
			url : '/shoppingcart/executepurchase',
			type : 'POST',
			data : formstosend,
			success : function (successresponse) {
				window.location.href	= '/shoppingcart/purchasedone';
			},
			error: function (errorresponse) {
				show_error_messages(errorresponse);
			}		
		});
		
		return false;
	});
});
