
var contextPath = getContextPath();
var addressGridOpen=false;
var collegeId = 0;
$(document).ready(function() {
	if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {

		collegeId = $("#collegeId").val();

	}
    var viewMode = $("#viewMode").val();
    var editMode = $("#editMode").val();


});


/*
 * $(document).on("click","#loadAddressGrid", function() {
 *
 * loadAddressGrid() ;
 *
 *
 * });
 */


$(document).on("click","#loadAddressGrid", function() {
	if(!addressGridOpen){
		addressGridOpen=true;
		loadAddressGrid();
	}else{
    	addressGridOpen=false;
		$('#addressGrid').html("");
	}
});

function loadAddressGrid() {
	if ($("#collegeId").val() != ""
		&& $("#collegeId").val() != undefined) {
		collegeId = $("#collegeId").val();
	}


	var editMode = $("#editMode").val();
	var viewMode = $("#viewMode").val();
	if(viewMode == ""){
		viewMode=false;
	}
	if(editMode== ""){
		editMode=false;
	}

	if('' == $("#addressId").val() || null == $("#addressId").val())
	{
	    viewMode=false;
	    editMode=false;
	}

	var addressURL = getContextPath()
	+ "/app/College/Address/createTagAddress";
	if (editMode) {
		var addressId = $("#addressId").val();
		var addressURLEdit = getContextPath() + "/app/College/Address/edit";

		$.ajax({
			url : addressURLEdit,
			data : ({
				"id" : addressId,
				"filterCode" : "clgmaster",
				"parentId" : collegeId
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
		var addressURLView = getContextPath() + "/app/College/Address/view";

		$.ajax({
			url : addressURLView,
			data : ({
				"id" : addressId,
				"filterCode" : "clgmaster",
				"parentId" : collegeId
			}),
			type : 'POST',
			async : false,
			success : function(jqXHR) {
				$('#addressGrid').html(jqXHR);
			}
		});

	}
	else {

		$.ajax({
			url : addressURL,
			data : ({
				"viewable" : true,
				"filterCode" : "clgmaster",
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
}


function saveForm(){
        var majorBankAccountId;
        $('.majorBankAccountClass').each(
          function() {
            if ($(this).prop("checked")) {
              var majorBankAccountId1 = $(this).parents("tr:first")
                .find("td:first").text();
              majorBankAccountId = majorBankAccountId1;
            }
          });

        if (majorBankAccountId && collegeId) {

          $.ajax({
            type: "POST",
            url: getContextPath() + "/app/College/markPrimaryBankAccount",
            data: "&bankAccountId=" + majorBankAccountId + "&collegeId=" + collegeId,
            async: false,
            success: function(response) {



            },
            error: function() {

              $.sticky("Some Error Occured", {
                autoclose: 10000,
                position: "top-right",
                type: "st-failure"
              });
            }
          });

        }

        var primaryBankAccountFlagFound = false;
        if ($("#bankAccountTable tbody tr td input.majorBankAccountClass").length > 0) {
          $('.majorBankAccountClass').each(
            function() {
              var checkBoxStatus = $(this).prop('checked') ? true : false;
              if (checkBoxStatus) {
                primaryBankAccountFlagFound = true;
                return false;
              } else {
                primaryBankAccountFlagFound = false;
              }
            });

          if (!(primaryBankAccountFlagFound)) {
            new PNotify({
              title: failure,
              text: "Please Fill One Major Bank Account",
              type: error,
              pnotify_animate_speed: fadeOutduration,
              opacity: .8
            });
            return false;
          }
        }

	var validData = saveToCollegeSession();
	if(validData == false) {
	    return;
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
        var majorBankAccountId;
        $('.majorBankAccountClass').each(
          function() {
            if ($(this).prop("checked")) {
              var majorBankAccountId1 = $(this).parents("tr:first")
                .find("td:first").text();
              majorBankAccountId = majorBankAccountId1;
            }
          });

        if (majorBankAccountId && collegeId) {

          $.ajax({
            type: "POST",
            url: getContextPath() + "/app/College/markPrimaryBankAccount",
            data: "&bankAccountId=" + majorBankAccountId + "&collegeId=" + collegeId,
            async: false,
            success: function(response) {



            },
            error: function() {

              $.sticky("Some Error Occured", {
                autoclose: 10000,
                position: "top-right",
                type: "st-failure"
              });
            }
          });

        }

        var primaryBankAccountFlagFound = false;
        if ($("#bankAccountTable tbody tr td input.majorBankAccountClass").length > 0) {
          $('.majorBankAccountClass').each(
            function() {
              var checkBoxStatus = $(this).prop('checked') ? true : false;
              if (checkBoxStatus) {
                primaryBankAccountFlagFound = true;
                return false;
              } else {
                primaryBankAccountFlagFound = false;
              }
            });

          if (!(primaryBankAccountFlagFound)) {
            new PNotify({
              title: failure,
              text: "Please Fill One Major Bank Account",
              type: error,
              pnotify_animate_speed: fadeOutduration,
              opacity: .8
            });
            return false;
          }
        }

	var validData = saveToCollegeSession();
    if(validData == false) {
        return;
    }
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	if ($(".form").valid()){
		form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
		form.submit();

	}
}


function saveToCollegeSession() {
	saveCollegeOnce();

	if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
		var finalParentId = $("#collegeId").val();
	}

	if(addressGridOpen){
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
		return false;
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

						if (parentEntityName == 'college') {
							$("#collegeId").val(finalParentId);
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

function saveCollegeOnce() {
	 if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
               return;
        }
	if ($("#masterForm").valid()) {
		var contextPath = getContextPath();
		if ($("#collegeId").val() != ""
			&& $("#collegeId").val() != undefined) {
			collegeId = $("#collegeId").val();
		}
		$.ajax({
			type : "POST",
			url : contextPath + "/app/College/saveClgOnce",
			data : $("#masterForm").serialize() + "&parentId="
			+ collegeId,
			clearForm : true,
			async : false,
			success : function(response) {

				$("#collegeId").val(response);

			},
			error : function() {

				$.sticky("Some Error Occured while saving college", {
					autoclose : 5000,
					position : "top-right",
					type : "st-failure"
				});

			}

		});
	}
}


