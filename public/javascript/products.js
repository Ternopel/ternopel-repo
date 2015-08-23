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

// Show picture upload
$(function () {
	var input=$("input[name='showpicturebutton']");
	input.click(function (e) {	
		var check		=$(this);
		var trid		=$(this).parent().parent().attr('name');
		var formatstr	=$('tr[name='+trid+'_picture]');
		var file_name;
		if(check.is(':checked')) {
			formatstr.show();
			
				$('.upload-photo-container').attr('style', 'background: url(/admin/productspictures/'+trid+'); ');
		
				var options = {
					imageBox: '.imageBox',
					thumbBox: '.thumbBox',
					spinner: '.spinner',
					imgSrc: 'avatar.jpg'
				};
		
				var cropper;
				document.querySelector('#picture').addEventListener('change', function(){ 
					console.log('Firing picture change');
					file_name = $('#picture').val();
					var reader = new FileReader();
					reader.onload = function(e) {
						console.log('Firing reader on load');
						var image = new Image();
						image.src = e.target.result;
						image.onload = function(evt) {
							console.log('Firing image on load');
							if (this.width > 450 && this.height > 300) {
								options.imgSrc = e.target.result;
								cropper = new cropbox(options);
								$('.upload-btn').attr('class', 'change-btn');
								$('.upload-label').html('Cambiar foto');

								$('#btnZoomIn').show();
								$('#btnZoomOut').show();
								$('#savepicture').show();
							} 
							else {
								alert('Imagen debe ser mayor a 452x x 300px');
//								show_error_messages({responseText:[{param:'general',msg:'Imagen debe ser mayor a 452x x 300px'}]});
							}
						}
					};
					reader.readAsDataURL(this.files[0]);
				});
		
				document.querySelector('#btnCrop').addEventListener('click', function() {
					var img = cropper.getDataURL();
					document.querySelector('.cropped').innerHTML += '<img src="'+img+'">';
				});
				document.querySelector('#btnZoomIn').addEventListener('click', function() {
					console.log('Zoom in');
					cropper.zoomIn();
				});
				document.querySelector('#btnZoomOut').addEventListener('click', function() {
					console.log('Zoom out');
					cropper.zoomOut();
				});
		}
		else {
			formatstr.hide();
		}
	});
});

// Add product
$(function () {
	$("#addProduct").click(function () {
		add('/admin/products');
	});
});

// Add product
$(function () {
	$("#savepicture").click(function () {
		console.log('Saving picture');
		var trid		=$(this).attr('name');
		var csrf		=$("input[name='_csrf']").val();
		
		$("#btnCrop").click().promise().done(function () {
			var img_data	= $('.cropped img').attr('src');
			if (img_data) {
				console.log('Picture has data to send');
				var picture_regex	= /data:(.*);base64,(.*)/;
				var type			= img_data.replace(picture_regex, '$1');
				var data			= img_data.replace(picture_regex, '$2');
				
				var formdata	={_csrf:csrf, product_id:trid, type:type, data:data};
				$.ajax({
					url : '/admin/productspictures',
					type : 'POST',
					data : formdata,
					success : function (entity) {
						console.log(entity);
						$("#showpicture_"+trid).click();
						$('tr[name='+trid+'_picture]').hide();
					},
					error : function(errorresponse) {
						show_error_messages(errorresponse);
					}
				});
			}
		});
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


