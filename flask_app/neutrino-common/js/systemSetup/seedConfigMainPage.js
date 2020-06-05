function onClickOnStep(currentObj) {	
	
	var previousStep = $("li.current-step").attr("id").replace(
			"seedConfig_wizard-title-", "");
	$("li.current-step").removeClass("current-step");
	currentObj.addClass("current-step");
	var currentStep = currentObj.attr("id").replace("seedConfig_wizard-title-",
			"");

	if (currentStep != previousStep) {
		switch (previousStep) {
		case '0':
			$("#companyAndLicenseInfo").hide();
			break;
		case '1':
			$("#addLicenseInformation").hide();
			break;	
		case '2':
			$("#addSuperAdminDiv").hide();
			break;
		case '3':
			$("#chooseCountriesDiv").hide();
			break;
		case '4':
			$("#chooseProductsDiv").hide();
			break;
		case '5':
			$("#chooseFileUploadDiv").hide();
			break;
		case '6':
			$("#companyAndLicenseInfo").hide();
			$("#addLicenseInformation").hide();
			$("#addSuperAdminDiv").hide();
			$("#chooseCountriesDiv").hide();
			$("#chooseProductsDiv").hide();
			$("#chooseFileUploadDiv").hide();
			$("#setupSystem").hide();
		}
	}

	switch (currentStep) {
	case '0':
		$("#companyAndLicenseInfo").show();
		$("#goBack").hide();
		$("#showNextConfigTab").show();
		break;
	case '1':
		$("#addLicenseInformation").show();
		$("#goBack").show();
		$("#showNextConfigTab").show();
		break;	
	case '2':
		$("#addSuperAdminDiv").show();
		$("#goBack").show();
		$("#showNextConfigTab").show();
		break;
	case '3':
		$("#chooseCountriesDiv").show();
		$("#goBack").show();
		$("#showNextConfigTab").show();
		break;
	case '4':
		$("#chooseProductsDiv").show();
		$("#goBack").show();
		$("#showNextConfigTab").show();
		break;
	case '5':
		$("#chooseFileUploadDiv").show();
		$("#goBack").show();
		$("#showNextConfigTab").show();
		break;
	case '6':
		$("#companyAndLicenseInfo").show();
		$("#addLicenseInformation").show();
		$("#addSuperAdminDiv").show();
		$("#chooseCountriesDiv").show();
		$("#chooseProductsDiv").show();
		$("#chooseFileUploadDiv").show();
		$("#showNextConfigTab").hide();
		$("#setupSystem").show();
		$("#goBack").show();
	}
	
	$(".tooltip").hide();

}

function backToPreviousStep() {
	var currentStep = $("li.current-step").attr("id").replace(
			"seedConfig_wizard-title-", "");
	$("li#seedConfig_wizard-title-" + (currentStep))
			.removeClass("current-step");
	$("li#seedConfig_wizard-title-" + (Number(currentStep) - Number(1)))
			.addClass("current-step");
	switch (currentStep) {
	case '6':
		$("#companyAndLicenseInfo").hide();
		$("#addLicenseInformation").hide();
		$("#addSuperAdminDiv").hide();
		$("#chooseCountriesDiv").hide();		
		$("#chooseProductsDiv").hide();
		$("#chooseFileUploadDiv").show();
		$("#showNextConfigTab").show();
		$("#setupSystem").hide();
		break;
	case '5':
		$("#chooseProductsDiv").show();
		$("#chooseFileUploadDiv").hide();
		break;
	case '4':
		$("#chooseCountriesDiv").show();
		$("#chooseProductsDiv").hide();
		break;
	case '3':
		$("#chooseCountriesDiv").hide();
		$("#addSuperAdminDiv").show();
		break;
	case '2':
		$("#addSuperAdminDiv").hide();
		$("#addLicenseInformation").show();
		break;
		
	case '1':
		$("#addLicenseInformation").hide();
		$("#companyAndLicenseInfo").show();
		$("#goBack").hide();	
	}
}

function showNextStep() {
	
	
	if(!($("#systemSetupForm").find("p.errorSmsPassword").hasClass("hidden")) || !($("#systemSetupForm").find("p.errorSmtpPassword").hasClass("hidden")))
	{ return; }
	
	var currentStep = $("li.current-step").attr("id").replace("seedConfig_wizard-title-", "");
	$("li#seedConfig_wizard-title-" + (currentStep))
			.removeClass("current-step");
	$("li#seedConfig_wizard-title-" + (Number(currentStep) + Number(1)))
			.addClass("current-step");
	/*$("li#seedConfig_wizard-title-" + (Number(currentStep) + Number(1))).attr(
			"onclick", "onClickOnStep($(this))");*/
	switch (currentStep) {
	case '0':
		$("#companyAndLicenseInfo").hide();
		$("#goBack").show();
		$("#addLicenseInformation").show();
		break;
	case '1':
		$("#addLicenseInformation").hide();
		$("#addSuperAdminDiv").show();
		break;	
	case '2':
		$("#addSuperAdminDiv").hide();
		$("#chooseCountriesDiv").show();
		break;
	case '3':
		$("#chooseCountriesDiv").hide();
		$("#chooseProductsDiv").show();
		break;
	case '4':
		$("#chooseProductsDiv").hide();
		$("#chooseFileUploadDiv").show();
		break;
	case '5':
		validateLicenseTextAndLicenseKey();
	}
}

function validateLicenseTextAndLicenseKey(){
	var licenseKey = $("#licenseKey").val();
	var licenseText = $("#licenseText").val();
	var licenseProductId = $("#licenseProduct").val();
	
	var formData = new FormData($('#systemSetupForm')[0]);
	  
	if(licenseKey || licenseText || formData){
		$.ajax({
	 		
		 		url : getContextPath()	+ "/app/systemSetup/validateLicenseTextAndKey",
		 		enctype : "multipart/form-data",
		 		data : formData,
		 		type : 'POST',
		 		async : false,
		 		success : function(result) {
		 			var message = result.split(",");
		 			var validationStatus = message[1];
		 			if(validationStatus == "success"){
		 				$("#uploadedLicenseStatusMessage").addClass("hidden");
		 				$("#uploadedLicenseStatusMessage").find("#result").empty();
		 				$("#companyAndLicenseInfo").show();
		 				$("#addLicenseInformation").show();
		 				$("#addSuperAdminDiv").show();
		 				$("#chooseCountriesDiv").show();
		 				$("#chooseProductsDiv").show();
		 				$("#chooseFileUploadDiv").show();
		 				$("#showNextConfigTab").hide();
		 				$("#setupSystem").show();
		 			}else{
		 				$("#uploadedLicenseStatusMessage").find("#result").html("<strong>"+message[0]+"</strong>");
			 			$("#uploadedLicenseStatusMessage").removeClass("hidden");
			 			
			 			var currentStep = $("li.current-step").attr("id").replace("seedConfig_wizard-title-", "");
			 			$("li#seedConfig_wizard-title-" + (currentStep))
			 					.removeClass("current-step");
			 			$("li#seedConfig_wizard-title-" + (Number(currentStep) - Number(1)))
			 					.addClass("current-step");
			 			
		 			}
		 			
		 		},
		 		processData: false, 
		 		contentType: false
	 		
	 		});
	}
}

function submitSystemSetupForm(){
	if( $("#systemSetupForm").valid() && pswdValidFlag){
		$("#systemSetupForm").submit();
	}else{
		if($("#systemSetupForm").valid() && !pswdValidFlag){
			new PNotify({
				title : "Failure",
				text : "Password invalid",
				type : "error",
			});
		}
	}
}