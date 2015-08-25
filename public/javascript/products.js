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
			
			var milliseconds=new Date().getTime();
			$("div[name='"+trid+"-upload-photo-container']").attr('style', 'background: url(/admin/productspictures/'+trid+'?a='+milliseconds+'); ');
	
			var options = {
				imageBox: "div[name='"+trid+"-imageBox']",
				thumbBox: "div[name='"+trid+"-thumbBox']",
				spinner: "div[name='"+trid+"-spinner']",
				imgSrc: 'avatar.jpg'
			};
			
			console.log('Unbinding events');
			$("input[name='"+trid+"-picture']").unbind();
			$("input[name='"+trid+"-btnCrop']").unbind();
			$("input[name='"+trid+"-btnZoomIn']").unbind();
			$("input[name='"+trid+"-btnZoomOut']").unbind();
			$("input[name='"+trid+"-save']").unbind();
			
			$("span[name='"+trid+"-upload-btn']").attr('class', 'upload-btn');
			$("span[name='"+trid+"-upload-label']").html('Subir foto');
			
			$("input[name='"+trid+"-btnZoomIn']").hide();
			$("input[name='"+trid+"-btnZoomOut']").hide();
			$("span[name='"+trid+"-save-span']").hide();
	
			var cropper;
			$("input[name='"+trid+"-picture']").change(function(){ 
				console.log('Firing picture change');
				file_name = $("input[name='"+trid+"-picture']").val();
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
							$("span[name='"+trid+"-upload-btn']").attr('class', 'change-btn');
							$("span[name='"+trid+"-upload-label']").html('Cambiar foto');

							$("input[name='"+trid+"-btnZoomIn']").show();
							$("input[name='"+trid+"-btnZoomOut']").show();
							$("span[name='"+trid+"-save-span']").show();
						} 
						else {
							show_error_messages({responseText:"[{\"param\":\"general\",\"msg\":\"Imagen debe ser mayor a 452x x 300px.\"}]"});
						}
					}
				};
				reader.readAsDataURL(this.files[0]);
			});
	
			$("input[name='"+trid+"-btnCrop']").click(function() {
				console.log('Firing crop button');
				var img = cropper.getDataURL();
				document.querySelector("div[name='"+trid+"-cropped']").innerHTML += '<img src="'+img+'">';
			});
			$("input[name='"+trid+"-btnZoomIn']").click(function() {
				console.log('Zoom in');
				cropper.zoomIn();
			});
			$("input[name='"+trid+"-btnZoomOut']").click(function() {
				console.log('Zoom out');
				cropper.zoomOut();
			});
			
			$("input[name='"+trid+"-save']").click(function () {
				console.log('Saving picture');
				var csrf		=$("input[name='_csrf']").val();
				
				$("input[name='"+trid+"-btnCrop']").click().promise().done(function () {
					console.log('After crop button firing');
					
					var img_data	= $("div[name='"+trid+"-cropped'] img").attr('src');
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


