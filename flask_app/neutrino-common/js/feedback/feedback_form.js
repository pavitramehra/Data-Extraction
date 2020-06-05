$(document).ready(function() {
	
	//alert('window location is:' + document.location.href);
	
	$('#feedback-please').click(function(){
		$
		.ajax({
			type : "GET",
			url : getContextPath()+"/app/Feedback/openFeedBackModal",
			async : false,
			success : function(result) {
				$('#feedback-modal-paint').html(result);
				$('#feedback-modal').modal('show');
				$('#feedback-modal input.href-value').val(feedbackURL);
				$("#feedback-select.chosen-select").chosen();
				
				/****/
				
				$('#feedback-modal .btn-close').click(function(){
					$('#feedback-modal').modal('hide');
				});
				
				$('#feedback-modal .close').click(function(){
					//action
					// console.log('var close X');
					$('#feedback-modal').modal('hide');
					$('#feedback-modal-confirmation').modal('hide');
					$('#feedback-modal .feedback-units').hide();
				});	
				
				
				$('#feedback-modal .btn-save').click(function(){
					//vars storing in database
					// console.log('vars db');
					
					$("#feedback_form").validate({

						errorClass : "help-block",
						errorElement : "span",
						highlight : function(element, errorClass, validClass) {
							$(element).parents('.form-group').addClass('error');
							$(element).parents('.form-group').removeClass('success');
						},
						unhighlight : function(element, errorClass, validClass) {
							$(element).parents('.form-group').removeClass('error');
							$(element).parents('.form-group').addClass('success');
						},
						invalidHandler : function(form, validator) {
							$.sticky(error_message, {
								autoclose : 5000,
								position : "top-right",
								type : "st-error"
							});
						}

					});
					
					if ($("#feedback_form").valid()) {
					$
					.ajax({
						type : "POST",
						url : getContextPath()+"/app/Feedback/saveFeedback",
						async : false,
						data : $("#feedback_form").serialize(),
						success : function(result) {
							$('#feedback-modal').modal('hide');
							$('#feedback-modal .feedback-units').hide();
							if(showNotifications=="true"){
								new PNotify({
								    title: success,
								    text: feedbackSave_success,
								    type: 'success',
								    pnotify_animate_speed : fadeOutduration,
									opacity : .8
								    
								});
							}	
						}
					});	
				}
				});	
			},
			error : function(data, textStatus, errorThrown) {
				$('#feedback-modal-paint').html(errorThrown);
			}
		});
	});	
});		//document ready
		