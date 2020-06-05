$(document)
.ready(
		function() {
			$("#bankAccountDetail")
			.validate(
					{
						errorClass : "help-block",
						errorElement : "span",
						highlight : function(element,
								errorClass, validClass) {
							$(element).parents(
							'.form-group')
							.addClass('error');
							$(element).parents(
							'.form-group')
							.removeClass('success');
						},
						unhighlight : function(element,
								errorClass, validClass) {
							$(element).parents(
							'.form-group')
							.removeClass('error');
							$(element).parents(
							'.form-group')
							.addClass('success');
						},
						invalidHandler : function(form,
								validator) {
							$
							.sticky(
									error_message,
									{
										autoclose : 5000,
										position : "top-right",
										type : "st-error"
									});
						}
					});
			if($('#Text_bankName').val() != ""){
				var populateBranchURL = "/BusinessPartner/populateExternalBankBranch/"+$('#bankName').val();
				$("#Text_branchName").attr("data-custom-controller", populateBranchURL);
			}
		});

function showAndHideFieldsInBankAccount() {
	var paymentModeType = $("#paymentModeType option:selected").data("code");
	if(paymentModeType=="ELECTRONIC_FUND_TRANSFER")
	{
		$("#eftShow").show();
		$("#accountType").addClass("required");
        $("#subPaymentModeType").addClass("required");
	} else {
		$("#eftShow").hide();
		$("#accountType").removeClass("required");
        $("#subPaymentModeType").removeClass("required");
	}
}

function updatePaymentFields(branchName){
	$("#paymentModeType").val("");
    $("#subPaymentModeType").val("");
    $("#accountType").val("");
	showAndHideFieldsInBankAccount();  
}

function populateSubPaymentByCode(branchId){
	if(branchId != "" && branchId != null){
		$.ajax({
			type: "post",
			url : getContextPath() + "/app/ExternalBank/ExternalBankBranch/checkSubPaymentModes/"+branchId,
			async : false,
			data : ({
				extraParent : "CAS-R",
			}),
			success : function(result) {
				if(result != ""){
					responseLS = jQuery.parseJSON(result);
					$('#subPaymentModeType').find('option').remove();
					var invalidText = $('#subPaymentModeType').find('option[value=""]').text();
					var defaultText = !invalidText ? 'Select One Option' : invalidText;
					var pushData = '<option value="">' + defaultText + '</option>';
					
					for (i = 0; i < responseLS.length; i++) {
						pushData += '<option   value="'
							+ responseLS[i].id + '">'
							+ responseLS[i].name
							+ '</option>';
					}
					$("#subPaymentModeType").html(pushData);
					$("#subPaymentModeType").trigger("chosen:updated");
					}
			}
		});
	}
}