$(document).ready(function() {
	$('#tagNameToBeMasked').change(function() {
		getMaskingDefinitionBasedOnTag(this.value);
	});
});

function getMaskingDefinitionBasedOnTag(tagName) {

		var url = this.getContextPath() + "/app/MaskingPolicy/getMaskingPolicyDefinitions";


		jQuery.ajax({
			url : url,
			data : $('#masterForm').serialize(),
			type : "POST",
			async : false,
			success : function(response) {
				$('#maskingDefinitionsDiv').html(response);
			}
		});
}


