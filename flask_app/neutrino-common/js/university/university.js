//custom validator for website
var validUrl = function(value) {

	if(value != ""){
		var urlregex = new RegExp(
				"^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.|http:\/\){1}([0-9"+allowedAlphaCharSet+"]+\.)");
 		 return urlregex.test(value);
		}else{
			return true;
		}
}

$.validator.addMethod("validUrl", function(value,element) {
	return validUrl(value);
},"Not a valid URL");

var contextPath = getContextPath();

var universityId = 0;
var addressGridOpen=false;
if ($("#universityId").val() != ""
	&& $("#universityId").val() != undefined) {
	universityId = $("#universityId").val();

}

$("#loadaddress").on("click", function() {
	if(!addressGridOpen){
		loadAddressGrid();
		addressGridOpen=true;
	}else{
		$('#addressGrid').html("");
		addressGridOpen=false;

	}

});

function loadAddressGrid() {
	if ($("#universityId").val() != ""
		&& $("#universityId").val() != undefined) {
		universityId = $("#universityId").val();
	}

	var editMode = $("#editMode").val();
	var viewMode = $("#viewMode").val();
	if(viewMode == ""){
		viewMode=false;
	}
	if(editMode== ""){
		editMode=false;
	}

	var addressURL = getContextPath()
	+ "/app/University/Address/createTagAddress";
	if (editMode) {
		var addressId = $("#addressId").val();
        		if(addressId=='0'){
        			var addressURLEdit = getContextPath() + "/app/University/Address/createTagAddress";
        		}else{
        			var addressURLEdit = getContextPath() + "/app/University/Address/edit";
        		}
        		$.ajax({
        			url : addressURLEdit,
        			data : ({
        				"id" : addressId,
        				"filterCode" : "unimaster",
        				"parentId" : universityId
        			}),
        			type : 'POST',
        			async : false,
        			success : function(jqXHR) {

        				$('#addressGrid').html(jqXHR);
        			}
        		});


	}

	else if (viewMode) {

		var addressId = $("#addressId").val();
        		if(addressId=='0'){

        			new PNotify({
        				title : 'error',
        				text : "No address added for this university",
        				type : 'error',
        				opacity : .8
        			});
        		}else{
        			var addressURLView = getContextPath() + "/app/University/Address/view";

        			$.ajax({
        				url : addressURLView,
        				data : ({
        					"id" : addressId,
        					"filterCode" : "unimaster",
        					"parentId" : universityId
        				}),
        				type : 'POST',
        				async : false,
        				success : function(jqXHR) {
        					$('#addressGrid').html(jqXHR);
        				}
        			});
        		}

	}
	else {

		$.ajax({
			url : addressURL,
			data : ({
				"viewable" : true,
				"filterCode" : "unimaster",
				"parentId" : 0
			}),
			type : 'POST',
			async : false,
			success : function(jqXHR) {
				$('#addressGrid').html(jqXHR);
			}
		});
	}

	setTimeout(function() {
		$("#save_cust_address_button_div").hide();

	}, 200);
	$("#current_address_span").hide();
	$("#current_city_span").hide();
}

$("#loadBankAccount").on("click", function() {

	loadBankAccountGrid();
});
function loadBankAccountGrid() {

	var viewMode =  $("#viewMode").val();
	var editMode = $("#editMode").val();
	if(viewMode==""){
		viewMode=false;
	}
	
	
		var bankAccountUrl = getContextPath()
	+ "/app/University/BankAccount/loadPage/" + universityId;

	$.ajax({
		url : bankAccountUrl,
		data : ({
			viewable : viewMode
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#bankAccountGrid').html(jqXHR);
		}
	});


}


function saveForm(){
	var universityId = $("#universityId").val();
	var majorBankAccountId;
	if($("#bankAccountTable tbody tr").length > 0){
		if(!$("[name='button']").is(":checked")){
			 new PNotify({
				   title : "Error",
				   text : "Please select Major Mode Of Payment ",
				   type : "error",
				   pnotify_animate_speed : .8,
				   opacity : 1
			   });
			return;
		}else{
				$('.majorBankAccountClass').each(
					function() {
						if ($(this).prop("checked")) {
							var majorBankAccountId1 = $(this).parents("tr:first")
									.find("td:first").text();
							majorBankAccountId = majorBankAccountId1;
							
						}
						
					});
			}
	}
	
	if(majorBankAccountId && universityId)
			{
			$.ajax({
				type : "POST",
				url : getContextPath() + "/app/University/BankAccount/markPrimaryBankAccount",
				data :"&bankAccountId="+majorBankAccountId+"&universityId="
						+ universityId,
				async : false,
				success : function(response) {
					
				},
				error : function() {

					$.sticky("Some Error Occured", {
						autoclose : 10000,
						position : "top-right",
						type : "st-failure"
					});
				}
			});
		
			}
	saveToUniSession();

	var isChecked = $("#create_another_master").prop('checked') ? true
			: false;
	var formTemp = $("#masterForm");
	$("#createAnotherMaster").val(isChecked);
var flag;
    	if(addressGridOpen){
    		flag = customAddressValidation();
    	}
    	if(flag != false) {
	
	if (formTemp.valid()) {
		$('body').modalmanager('loading');
		formTemp.submit();
	}
	}
}



function saveAndSendForApproval(context) {
	var universityId = $("#universityId").val();
	var majorBankAccountId;
	if($("#bankAccountTable tbody tr").length > 0){
		if(!$("[name='button']").is(":checked")){
			 new PNotify({
				   title : "Error",
				   text : "Please select Major Mode Of Payment ",
				   type : "error",
				   pnotify_animate_speed : .8,
				   opacity : 1
			   });
			return;
		}else{
				$('.majorBankAccountClass').each(
					function() {
						if ($(this).prop("checked")) {
							var majorBankAccountId1 = $(this).parents("tr:first")
									.find("td:first").text();
							majorBankAccountId = majorBankAccountId1;
							
						}
						
					});
			}
	}
	
	if(majorBankAccountId && universityId)
			{
			$.ajax({
				type : "POST",
				url : getContextPath() + "/app/University/BankAccount/markPrimaryBankAccount",
				data :"&bankAccountId="+majorBankAccountId+"&universityId="
						+ universityId,
				async : false,
				success : function(response) {
					
					
					
				},
				error : function() {

					$.sticky("Some Error Occured", {
						autoclose : 10000,
						position : "top-right",
						type : "st-failure"
					});
				}
			});
		
			}
    saveToUniSession();
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = $("#masterID").val();
	var formTemp = $("#masterForm");
	var flag;
    	if(addressGridOpen){
    		flag = customAddressValidation();
    	}
    	if(flag != false) {
	if (formTemp.valid()){
	    var path = context + "/app/" + masterID + "/saveAndSendForApproval";
		formTemp.attr("action", path);
		formTemp.submit();

	}
	}
}


function saveToUniSession() {
	saveUniversityOnce();



}

function validCityYearsNumber(value) {
	var durAtCurrAddressYr = $("#address_noOfYearsAtCurrentAdress").val();
	var currAddType = $('#addressType option:selected').attr('data-code');
	if (value && $.trim(value) != "") {
		var currAddressYrVal = parseInt(durAtCurrAddressYr);
		var enteredValue = parseInt(value);
		// check years

		if (enteredValue > currAddressYrVal) {
			$('#address_yearsInCurrentCity-control-group')
			.removeClass('error2');
			$('#address_monthsInCurrentCity-control-group').removeClass(
			'error2');
			return true;
		} else if (enteredValue < currAddressYrVal) {
			$('#address_yearsInCurrentCity-control-group').removeClass(
			'success').addClass('error2');
			$('#address_monthsInCurrentCity-control-group').removeClass(
			'success').addClass('error2');
			return false;
		} else {
			// Compare months
			var durAtCurrAddMnths = $("#address_noOfMonthsAtCurrentAdress")
			.val();
			var durAtCurrCityMnths = $("#address_monthsInCurrentCity").val();
			if (durAtCurrAddMnths && durAtCurrCityMnths) {
				var cityMnthVal = parseInt(durAtCurrCityMnths);
				var addMnthVal = parseInt(durAtCurrAddMnths);
				if (cityMnthVal == addMnthVal) {
					return true;
				}
				return ((cityMnthVal > addMnthVal) ? true : false);
			}

		}
	} else {
		return true;
	}

}

function saveUniversityOnce() {
	
	
	if ($("#masterForm").valid()) {
		var contextPath = getContextPath();
		if ($("#universityId").val() != ""
			&& $("#universityId").val() != undefined) {
			universityId = $("#universityId").val();
		}
		$.ajax({
			type : "POST",
			url : contextPath + "/app/University/saveUniversityOnce",
			data : $("#masterForm").serialize() + "&parentId="
			+ universityId,
			clearForm : true,
			async : false,
			success : function(response) {

				$("#universityId").val(response);

			},
			error : function() {

				$.sticky("Some Error Occured while saving university", {
					autoclose : 5000,
					position : "top-right",
					type : "st-failure"
				});

			}

		});
	}
}



function customAddressValidation(){
if ($("#universityId").val() != "" && $("#universityId").val() != undefined) {
		var finalParentId = $("#universityId").val();
	}


var address1=$("#address1ToBeAddedInput_country").val();
var address2=$("#address2ToBeAdded_country").val();
var address3=$("#address3ToBeAdded_country").val();
var pincode=$("#Text_postalCode_country").val();
var region=$("#region_country").val();
var state=$("#state_country").val();
var city=$("#city_country").val();
var district=$("#district_country").val();
var taluka=$("#talukaToBeAddedInput_country").val();
var village=$("#Text_village_country").val();
var landmark=$("#address_landmark").val();
var yearsAtAddress=$("#address_noOfYearsAtCurrentAdress").val();
var yearsAtCity=$("#address_yearsInCurrentCity").val();
var phoneNumber=$("#phoneNumber_phoneNumberList_new1").val();
var mobileNumber=$("#phoneNumberList1_phoneNumber").val();

		if(address1 !='' || address2 !='' || address3 !='' || pincode !='' || region !='' || state !='' || city !='' || district !='' || taluka !='' || village !='' || landmark !='' || yearsAtAddress !='' || yearsAtCity !='' || phoneNumber !='' || mobileNumber !=''){
		if($("#addressTagDetails").valid()==false)
		{

			return false;
		}
		$("#addressTagDetails").validate({

			errorClass : "help-block",
			errorElement : "span",
			highlight : function(element, errorClass, validClass) {
				var userDivId = "#" + $(element).attr("id");
				$(userDivId).addClass('error');
				$(element).parents('.form-group').addClass('error');
				$(element).parents('.form-group').removeClass('success');

			},
			unhighlight : function(element, errorClass, validClass) {
				var userDivId = "#" + $(element).attr("id");
				$(userDivId).removeClass('error');
				$(element).parents('.form-group').addClass('success');
				$(element).parents('.form-group').removeClass('error');

			},
			invalidHandler : function(form, validator) {
				$.sticky(error_message, {
					autoclose : 5000,
					position : "top-right",
					type : "st-error"
				});
			}
		});


		var currentValue = $('#address_yearsInCurrentCity').val();
		if (currentValue) {
			currentValue = currentValue;
		} else {
			currentValue = "";
		}
		var validCityYearsNumberFlag = validCityYearsNumber(currentValue);
		var cityYearsNumber = true;
		if (validCityYearsNumberFlag) {
			cityYearsNumber = true;
		} else {
			cityYearsNumber = false;
		}

		if (cityYearsNumber == false) {

			$.sticky(cityYears_cant_be_less_than_currentAddress_duration, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			$("#address_noOfYearsAtCurrentAdress-control-group").removeClass(
			"error");
			$("#address_noOfYearsAtCurrentAdress-control-group").removeClass(
			"success");
			setTimeout(function() {
				$("#address_noOfYearsAtCurrentAdress-control-group").removeClass(
				"success");
				$("#address_noOfYearsAtCurrentAdress-control-group").addClass(
				"error");
			}, 100);

			$("#address_noOfMonthsAtCurrentAdress-control-group").removeClass(
			"error");
			$("#address_noOfMonthsAtCurrentAdress-control-group").removeClass(
			"success");
			setTimeout(function() {
				$("#address_noOfMonthsAtCurrentAdress-control-group").removeClass(
				"success");
				$("#address_noOfMonthsAtCurrentAdress-control-group").addClass(
				"error");
			}, 100);

			$("#address_yearsInCurrentCity-control-group").removeClass("error");
			$("#address_yearsInCurrentCity-control-group").removeClass("success");
			setTimeout(function() {
				$("#address_yearsInCurrentCity-control-group").removeClass(
				"success");
				$("#address_yearsInCurrentCity-control-group").addClass("error");
			}, 100);

			$("#address_monthsInCurrentCity-control-group").removeClass("error");
			$("#address_monthsInCurrentCity-control-group").removeClass("success");
			setTimeout(function() {
				$("#address_monthsInCurrentCity-control-group").removeClass(
				"success");
				$("#address_monthsInCurrentCity-control-group").addClass("error");
			}, 100);
			return;
		} else {
			$("#address_noOfYearsAtCurrentAdress-control-group").removeClass(
			"error");
			$("#address_noOfYearsAtCurrentAdress-control-group").removeClass(
			"success");
			setTimeout(function() {
				$("#address_noOfYearsAtCurrentAdress-control-group").removeClass(
				"error");
				$("#address_noOfYearsAtCurrentAdress-control-group").addClass(
				"success");
			}, 100);

			$("#address_noOfMonthsAtCurrentAdress-control-group").removeClass(
			"error");
			$("#address_noOfMonthsAtCurrentAdress-control-group").removeClass(
			"success");
			setTimeout(function() {
				$("#address_noOfMonthsAtCurrentAdress-control-group").removeClass(
				"error");
				$("#address_noOfMonthsAtCurrentAdress-control-group").addClass(
				"success");
			}, 100);

			$("#address_yearsInCurrentCity-control-group").removeClass("error");
			$("#address_yearsInCurrentCity-control-group").removeClass("success");
			setTimeout(
					function() {
						$("#address_yearsInCurrentCity-control-group").removeClass(
						"error");
						$("#address_yearsInCurrentCity-control-group").addClass(
						"success");
					}, 100);

			$("#address_monthsInCurrentCity-control-group").removeClass("error");
			$("#address_monthsInCurrentCity-control-group").removeClass("success");
			setTimeout(
					function() {
						$("#address_monthsInCurrentCity-control-group")
						.removeClass("error");
						$("#address_monthsInCurrentCity-control-group").addClass(
						"success");
					}, 100);
		}
		if ($("#addressTagDetails").valid()) {
			var allMandatoryFieldsFilled = 'true';
			var validationFlag = true;
			$.ajax({
				type : "POST",
				url : getContextPath() + "/app/" + parentEntityName
				+ "/Address/saveAddressTag",
				data : $('#addressTagDetails').serialize()
				+ "&parentEntityName=" + parentEntityName
				+ "&parentId=" + finalParentId
				+ "",
				async : false,
				clearForm : true,

				success : function(response) {

					var message = response.split(",");
					if(message[0] == 'Pincode Validation Failed'){
                        new PNotify({
                            title : message[1],
                            text : message[0],
                            type : message[1],
                            opacity : .8
                        });
                        validationFlag = false;
                    }else if(message[0]=='ERROR'){

						$.sticky("Please fill the mandatory Details", {
							position : "top-right",
							type : "st-error"
						});
						allMandatoryFieldsFilled='false';
					}else{


						if (message[2] != null) {
							finalParentId = message[2];

							if (parentEntityName == 'University') {
								$("#universityId").val(finalParentId);
							}

						}

						if (showNotifications == "true") {
							new PNotify({
								title : message[1],
								text : message[0],
								type : message[1],
								opacity : .8
							});
						}

					}
				},
				error : function() {

					$.sticky("Some Error Occured", {
						autoclose : 10000,
						position : "top-right",
						type : "st-failure"
					});
				}
			});
			return validationFlag;
		}
	}



}