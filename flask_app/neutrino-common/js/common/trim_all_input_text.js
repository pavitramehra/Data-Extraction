/**
 * Trims all input fields with type as text on blur event
 */
function applyTrimOnInputText(applyOnEvent){ 

	 if (applyOnEvent == 'onblur') {
		$(document).on("blur", ":text:not(.ipaddress)", function() {
			$(this).val($.trim($(this).val()));
		});

	} else {
		$(document).on("change", ":text:not(.ipaddress)", function() {
			$(this).val($.trim($(this).val()));
		});
	}
}

