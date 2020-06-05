

$(document).ready(
		function() {
			
			
			jQuery.validator.addMethod("require_from_group", function(value, element, options) {
					
				  var numberRequired = options[0];
				  var selector = options[1];
				  var fields = $(selector, element.form);
				  var filled_fields = fields.filter(function() {
				    
				    return $(this).val() != ""; 
				  });
				  var empty_fields = fields.not(filled_fields);
				  if (filled_fields.length < numberRequired && empty_fields[0] == element) {
				    return false;
				  }
				  
				  return true;
				// {0} below is the 0th item in the options field
				}, jQuery.validator.format("Please fill out at least {0} of these fields."));

			//* boxes animation

			form_wrapper = $('.login_box');			
			form_wrapper_unblock=$(".userUnblockDiv");
			
			$('.unblockUser a').on(
					'click',
					function(e) {
						var target = $(this).attr('href'), target_height = $(
								target).actual('height');					
						$(form_wrapper_unblock).find("form").css({
							'height' : $(form_wrapper_unblock).find("form").height()
						});
						$(form_wrapper).fadeOut(400,
								function() {
									form_wrapper.stop().animate({
										height : target_height
									}, 500, function() {
										$(target).fadeIn(400);									
										$(form_wrapper).css({
											'height' : ''
										});
									});
								});
						e.preventDefault();
					});
			
			
			
			$('.cancelBtn_unblock a').on(
					'click',
					function(e) {
						var target = $(this).attr('href'), target_height = $(
								target).actual('height');
						$(form_wrapper).css({
							'height' : ''
						});
						$(form_wrapper).fadeIn(400);
						$(form_wrapper_unblock).find("form:visible").fadeOut(400,
								function() {
									form_wrapper.stop().animate({
										height : target_height
									}, 0, function() {
										$(form_wrapper).fadeIn();
										$(form_wrapper).css({
											'height' : ''
										});
									});
								});
						e.preventDefault();
					});
			
			$('.linkform a,.link_reg a').on(
					'click',
					function(e) {
						var target = $(this).attr('href'), target_height = $(
								target).actual('height');
						$(form_wrapper).css({
							'height' : form_wrapper.height()
						});
						$(form_wrapper.find('form:visible')).fadeOut(400,
								function() {
									form_wrapper.stop().animate({
										height : target_height
									}, 500, function() {
										$(target).fadeIn(400);
										$('.links_btm .linkform').toggle();
										$(form_wrapper).css({
											'height' : ''
										});
									});
								});
						e.preventDefault();
					});

			//* validation
			$('#login_form').validate({
				onkeyup : false,
				errorClass : 'error',
				validClass : 'valid',
				rules : {
					username : {
						required : true,
						minlength : 3
					},
					password : {
						required : true,
						minlength : 3
					}
				},
				highlight : function(element) {
					$(element).closest('div').addClass("f_error");
				},
				unhighlight : function(element) {
					$(element).closest('div').removeClass("f_error");
				},
				errorPlacement : function(error, element) {
					$(element).closest('div').append(error);
				}
			});
			
			
			$('#status_form').validate({
				onkeyup : false,
				errorClass : 'error',
				validClass : 'valid',
				rules : {
					referenceId : {
						require_from_group: [1,".validation-Group"]
					},
					mobileNo : {
						require_from_group: [1,".validation-Group"],
						digits :true,
						minlength: mobileMinLength,
						maxlength: mobileMaxLength
						
					},
					emailId : {
						require_from_group: [1,".validation-Group"],
						email :true
						
					}
				},
				highlight : function(element) {
					$(element).closest('div').addClass("f_error");
				},
				unhighlight : function(element) {
					$(element).closest('div').removeClass("f_error");
				},
				errorPlacement : function(error, element) {							
					$(element).closest('div').append(error);	
				}
			});
		});
