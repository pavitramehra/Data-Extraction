$(document).ready(function() {

	$("#clearanceConditionDetail").validate({
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
});