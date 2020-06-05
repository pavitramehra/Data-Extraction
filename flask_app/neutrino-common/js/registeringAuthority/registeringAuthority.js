var addressOpen=false;


$("#loadRegistrationaddress").click(function() {

	if(addressOpen){
	$('#addressGridRegistration').html("");
	addressOpen = false;

	} else {
		addressOpen =true;
	}
	loadAddresscordian();

});





var contextPath = getContextPath();

function loadAddresscordian() {
if(!addressOpen){
		return;
	}


var registeringAuthorityId=0;
var viewRegisteringAuth=false;
var viewReg=$("#viewMode").val();
if(viewReg && viewReg!=""){
	viewRegisteringAuth=viewReg;
}
	if ($("#registeringAuthorityId").val() != undefined && $("#registeringAuthorityId").val() != "") {
		 registeringAuthorityId = $("#registeringAuthorityId").val();
	}
	addressURL = contextPath
	 + "/app/VehicleRegistrationAuthority/LoadAddress/"+registeringAuthorityId;
	$.ajax({
		url : addressURL,
		data : ({
            viewable  : viewRegisteringAuth

             }),
         type : 'GET',

		async : false,
		success : function(result) {

		$("#addressGridRegistration").html(result);
	    $("#save_cust_address_button_div").hide();
		$("#copy_address_div").hide();
		var zip=$("#postalCode_country").val();
		   if(!zip){
			   getZipCode();
		   }
		$("#addressType").find("option").each(function() {
			if ($(this).data("code") !== "OfficeAddress" ) {
				$(this).remove();
			}

		});
		$("#current_address_span").hide();
		$("#current_city_span").hide();
		}
	});
}




var selectedZipCode;
function getZipCode(){
	$.ajax({
		url :contextPath
				+ "/app/EducationLoan/pincodeBased/getZipCodeIds",
		type : 'POST',
		async : false,
		data : ({
			selectedZipCode:$("#Text_postalCode_country").val()
				}),
		success : function(response) {
			$("#postalCode_country").val(response);
		}

	});
}



function saveForm(){
	var registeringAuthorityId = $("#registeringAuthorityId").val();
       if(addressOpen){
       customAddressValidation();
	   var formTemp=$('#addressTagDetails');
	   if(!formTemp.valid()){
		return;
	    }

        }
     var addressIdNow=$("#addressIdRegis").val();
     if(!addressIdNow || addressIdNow==""){
     $("#addressIdRegis").val(0);
     }
     var isChecked = $("#create_another_master").prop('checked') ? true
			: false;
	var formTemp = $("#masterForm");
	$("#createAnotherMaster").val(isChecked);



	if (formTemp.valid()) {
		$('body').modalmanager('loading');
		formTemp.submit();
	}

}


function saveAndSendForApproval(context) {
	var registeringAuthorityId = $("#registeringAuthorityId").val();
      if(addressOpen){
         customAddressValidation();
		  var formTempAddress=$('#addressTagDetails');
	   if(!formTempAddress.valid()){
		return;
	        }
          }

   var addressIdNow=$("#addressIdRegis").val();
         if(!addressIdNow || addressIdNow==""){
         $("#addressIdRegis").val(0);
         }
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = $("#masterID").val();
	var formTemp = $("#masterForm");

   	if (formTemp.valid()){
	    var path = context + "/app/" + masterID + "/saveAndSendForApproval";
		formTemp.attr("action", path);
		formTemp.submit();

	}

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




function customAddressValidation(){

	var finalParentId=0;
	var parentEntityName="VehicleRegistrationAuthority";
if ($("#registeringAuthorityId").val() != "" && $("#registeringAuthorityId").val() != undefined) {
		finalParentId = $("#registeringAuthorityId").val();
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

			$.ajax({
				type : "POST",
				url : getContextPath() + "/app/VehicleRegistrationAuthority/saveAddressRegisAuth",
				data : $('#addressTagDetails').serialize()
				+ "&parentId=" + finalParentId
				,
				async : false,
				clearForm : true,

				success : function(response) {
						var message = response.split(",");

                					if(message[0]=='ERROR'){

                						$.sticky("Please fill the mandatory Details", {
                							position : "top-right",
                							type : "st-error"
                						});
                						allMandatoryFieldsFilled='false';
                					}else{


                							if (message[2] != null) {
                                                 var addressIdNow = message[2];
                                                 $("#addressIdRegis").val(addressIdNow);
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


		}
	}



}



$(document).ready(function() {
var ifexist=$("#codeAlreadyPresent").val();

if(ifexist){

	new PNotify({
            title : failure,
            text : "Code Already Present",
            type : error,
            opacity : .8
					});
}
});



