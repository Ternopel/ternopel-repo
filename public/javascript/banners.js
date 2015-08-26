'use strict';

$(function() {
	var form = $('#banners_form');
	form.find('input[type="submit"]').click(function() {
		clear_error_fields(form);
		console.log("Submitting form");

		$("input[name='btnCrop']").click().promise().done(function () {
			console.log('After crop button firing');
			
			var img_data	= $("div[name='cropped'] img").attr('src');
			if (img_data) {
				
				console.log('Picture has data to send');
				var csrf			= $("input[name='_csrf']").val();
				var position		= $("input[name='position']").val();
				var picture_regex	= /data:(.*);base64,(.*)/;
				var type			= img_data.replace(picture_regex, '$1');;
				var data			= img_data.replace(picture_regex, '$2');

				var formdata	={_csrf:csrf, product_id:1, type:type, data:data, is_product:true, position:position};
				
				$.ajax({
					url : '/admin/banners',
					type : form.attr('method'),
					data : formdata,
					success : function (entity) {
						console.log(entity);
						window.location.href	= '/admin/banners';
					},
					error : function(errorresponse) {
						show_error_messages(errorresponse);
					}
				});
			}
		});		
		return false;
	});
});







	
$(function() {
	var banner_id	= $("input[name='banner_id']").val();
	var milliseconds=new Date().getTime();
	if(banner_id) {
		$("div[name='upload-photo-container']").attr('style', 'background: url(/admin/banners/'+banner_id+'?a='+milliseconds+'); ');
	}

	var options = {
		imageBox: "div[name='imageBox']",
		thumbBox: "div[name='thumbBox']",
		spinner: "div[name='spinner']",
		imgSrc: 'avatar.jpg'
	};
	
	console.log('Unbinding events');
	$("input[name='picture']").unbind();
	$("input[name='btnCrop']").unbind();
	$("input[name='btnZoomIn']").unbind();
	$("input[name='btnZoomOut']").unbind();
	$("input[name='save']").unbind();
	
	$("span[name='upload-btn']").attr('class', 'upload-btn');
	$("span[name='upload-label']").html('Subir foto');
	
	$("input[name='btnZoomIn']").hide();
	$("input[name='btnZoomOut']").hide();
	$("span[name='save-span']").hide();

	var cropper;
	$("input[name='picture']").change(function(){ 
		console.log('Firing picture change');
		var file_name = $("input[name='picture']").val();
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
					$("span[name='upload-btn']").attr('class', 'change-btn');
					$("span[name='upload-label']").html('Cambiar foto');

					$("input[name='btnZoomIn']").show();
					$("input[name='btnZoomOut']").show();
					$("span[name='save-span']").show();
				} 
				else {
					show_error_messages({responseText:"[{\"param\":\"general\",\"msg\":\"Imagen debe ser mayor a 452x x 300px.\"}]"});
				}
			}
		};
		reader.readAsDataURL(this.files[0]);
	});

	$("input[name='btnCrop']").click(function() {
		console.log('Firing crop button');
		var img = cropper.getDataURL();
		document.querySelector("div[name='cropped']").innerHTML += '<img src="'+img+'">';
	});
	$("input[name='btnZoomIn']").click(function() {
		console.log('Zoom in');
		cropper.zoomIn();
	});
	$("input[name='btnZoomOut']").click(function() {
		console.log('Zoom out');
		cropper.zoomOut();
	});
});
	
	
