
var custId = 0;
var finalParentId = 0;
var businessPartnerId=0;
var builderGroupId=0;
var builderCompanyId=0;
var builderProjectId=0;
var aedId=0;
var universityId=0;
//college entry
var collegeId = 0;
var shpiId = 0;
var intermediaryId = 0;
var employerId = 0;
var parentEntityName = $('#parentId').val();
 if ($("#custId").val() == "" && $("#nonIndvCustId").val()=="") {
	custId = 0;
}
 if($("#custId").val()!="" && $("#custId").val()!=undefined){
		custId = $("#custId").val();
}

 if($("#businessPartnerId").val()!="" && $("#businessPartnerId").val()!=undefined){
	 businessPartnerId = $("#businessPartnerId").val();
}

if($("#nonIndvCustId").val()!="" && $("#nonIndvCustId").val()!=undefined){
		custId = $("#nonIndvCustId").val();
}

if($("#builderGroupId").val()){
	builderGroupId = $("#builderGroupId").val();
}
if($("#builderCompanyId").val()){
	builderCompanyId = $("#builderCompanyId").val();
}
if($("#builderProjectId").val()){
	builderProjectId = $("#builderProjectId").val();
}
if($("#aedID").val()){
	aedId = $("#aedID").val();
}
if($("#universityId").val()){
	universityId = $("#universityId").val();
}
//college entry
if($("#collegeId").val()){
	collegeId = $("#collegeId").val();
}

if($("#shpiId").val()){
	shpiId = $("#shpiId").val();
}

if($("#intermediaryId").val()){
	intermediaryId = $("#intermediaryId").val();
}

if($("#employerId").val()){
	employerId = $("#employerId").val();
}
/*
 * if ('${id}' =="") { custId = 0; } else { custId ='${id}'; }
 */

/* finalParentId to distinguish b/w customer and any other parent.. */
if (parentEntityName == "BusinessPartner") {
	finalParentId = businessPartnerId;
}else if(parentEntityName == "BuilderGroup") {
	finalParentId = builderGroupId;
}
else if(parentEntityName == "BuilderCompany") {
	finalParentId = builderCompanyId;
}
else if(parentEntityName == "BuilderProject") {
	finalParentId = builderProjectId;
}
else if(parentEntityName == "AdditionalEmployerDetails") {
	finalParentId = aedId;
}
else if(parentEntityName == "University") {
	finalParentId = universityId;
}
//college entry
else if(parentEntityName == "College") {
	finalParentId = collegeId;
}

else if(parentEntityName == "SelfHelpPromotingInst") {
	finalParentId = shpiId;
}

else if(parentEntityName == "Intermediary") {
	finalParentId = intermediaryId;
}

else if(parentEntityName == "Employer") {
	finalParentId = employerId;
}

else {
	finalParentId = custId;

}
	function openDialogAddressTag(action, id) {
	if(parentEntityName == "University") {
		var tdCount = $("#Address").find("tbody").find("tr:first").find("td").length;
		if(tdCount > 1){
			$.sticky("You cannot enter more than one address", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			return;
		}
	}
	if(action == 'view'){
		 $('#childModalWindowDoneButtonAddress').hide();
	 } else {
		 $('#childModalWindowDoneButtonAddress').show();
	 }
	$.ajax({

		url : getContextPath() + "/app/"+parentEntityName+"/Address/" + action,
		type : 'POST',
		async : true,
		data : "id=" + id,
		success : function(jqXHR) {
			$('#childModalAddress').html(jqXHR);
			$('#dialog-form-Address').addClass('container');
			$('#dialog-form-Address').modal('show');
			setTimeout(function() {
				$("#addressType").focus();
				
				
				if(parentEntityName =='BusinessPartner' && bpType!='Manufacturer'){			
						$("#gstIn-control-group").remove();
					
				}
			}, 500);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});

}

function closeDialog() {
	$('#dialog-form-Address').modal('hide');
};

function StickyMessage(message) {
	$.sticky(message, {
		autoclose : 10000,
		position : "top-right",
		type : "st-success"
	});
}



function saveToSession() {
	// var newVillageName=$('#Text_village_Name').val();
	if(parentEntityName == "University"){
		if (!$("#masterForm").valid()) {
			return;
		}else{
			$("#univ_add_div").hide();
			saveUniversityOnce();
			var rowCount = $("#Address").find("tbody").find("tr").length;
			if(rowCount > 0){
				$("#create_new_tag1").attr("disabled","disabled");
			}
		}
		if ($("#universityId").val() != "" && $("#universityId").val() != undefined) {
			finalParentId = $("#universityId").val();
		}
	}
	//college entry
	if(parentEntityName == "College"){
        if (!$("#masterForm").valid()) {
           return;
        }else{
        $("#college_add_div").hide();
            saveCollegeOnce();
        }
        if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
            finalParentId = $("#collegeId").val();
        }
	}
	if(parentEntityName == "BuilderProject"){

        if ($("#builderProjectId").val() != "" && $("#builderProjectId").val() != undefined) {
            finalParentId = $("#builderProjectId").val();
        }
	}
	
	

	if($("#addressTagDetails").length > 0)
		{
		if($("#addressTagDetails").valid()==false)
			{
				return;
			}
	$("#addressTagDetails").validate({

		errorClass : "help-block",
		errorElement : "span",
		highlight : function(element, errorClass, validClass) {
			var userDivId = "#" + $(element).attr("id");
			$(userDivId).addClass('error');
			$(element).parents('.form-group').addClass('error');
			$(element).parents('.form-group').removeClass('success');

			// $(userDivId).parents('div[class^="form-group"]:first').removeClass('success').addClass('error');
		},
		unhighlight : function(element, errorClass, validClass) {
			var userDivId = "#" + $(element).attr("id");
			$(userDivId).removeClass('error');
			$(element).parents('.form-group').addClass('success');
			$(element).parents('.form-group').removeClass('error');
			// $(userDivId).parents('div[class^="form-group"]:first').removeClass('error').addClass('success');

		},
		invalidHandler : function(form, validator) {
			$.sticky(error_message, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
	});


	var businessPartnerType = $('option:selected', $("#businessPartnerType")).attr('data-code');
	if (businessPartnerType && parentEntityName == "BusinessPartner") {
		businessPartnerType = "&bpType=" + businessPartnerType;
	} else {
		businessPartnerType = "";
	}
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
		
		if(parentEntityName =='BusinessPartner' && bpType=='Manufacturer' && $("#gstIn-control-group").length>0 ){			
			 var isGstInValid=validateGSTIN();
			 if(isGstInValid==false)
				 return false;
		
			}
		var allMandatoryFieldsFilled = 'true';
		$.ajax({
					type : "POST",
					url : getContextPath() + "/app/" + parentEntityName
							+ "/Address/saveAddressTag",
					data : $('#addressTagDetails').serialize()
							+ "&parentEntityName=" + parentEntityName
							+ "&parentId=" + finalParentId
							+ businessPartnerType,
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
					    }else{

                            if(message[0]=='ERROR'){

                                $.sticky("Please fill the mandatory Details", {
                                    position : "top-right",
                                    type : "st-error"
                                });
                                allMandatoryFieldsFilled='false';
                            }else{

                                closeDialog();
                            if (message[2] != null) {
                                finalParentId = message[2];

                                if (parentEntityName == 'Customer') {
                                    $("#custId").val(message[2]);
                                } else if (parentEntityName == 'BuilderGroup') {
                                    $("#builderGroupId").val(finalParentId);
                                } else if (parentEntityName == 'BuilderProject') {
                                    if(typeof copyPaymentPlan  == "function")
                                        copyPaymentPlan($("#builderProjectId").val(),finalParentId);
                                    $("#builderProjectId").val(finalParentId);
                                    if(typeof loadPaymentPlan  == "function")
                                        loadPaymentPlan(false);
                                } else if (parentEntityName == 'BuilderCompany') {
                                    $("#builderCompanyId").val(finalParentId);
                                } else if (parentEntityName == 'AdditionalEmployerDetails') {
                                    $("#aedID").val(finalParentId);
                                }else if (parentEntityName == 'University') {
                                    $("#universityId").val(finalParentId);
                                }else if (parentEntityName == 'College') {
                                    $("#collegeId").val(finalParentId);
                                }
                                else if (parentEntityName == 'SelfHelpPromotingInst') {
                                    $("#shpiId").val(finalParentId);
                                }
                                else if (parentEntityName == 'Intermediary') {
                                    $("#intermediaryId").val(finalParentId);
                                }
                                else if (parentEntityName == 'Employer') {
                                    $("#employerId").val(finalParentId);
                                    $("#id").val(finalParentId);
                                }

                                else {
                                    $("#businessPartnerId").val(finalParentId);
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
                            var baseURL = getContextPath() + "/app/"
                                    + parentEntityName + "/Address/loadPage/"
                                    + finalParentId;
                            if (parentEntityName == "BusinessPartner") {
                                var bpCode = $('option:selected',
                                        $("#businessPartnerType"))
                                        .attr('data-code');
                                baseURL = getContextPath() + "/app/"
                                        + parentEntityName + "/Address/loadPage/"
                                        + bpCode + "/" + finalParentId;
                                $("#businessPartnerType").attr("disabled",
                                        "disabled");
                                $("#businessPartnerType").trigger("chosen:updated");
                            }
                            $('#addressGrid').load(baseURL, function() {
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
		
		if(allMandatoryFieldsFilled='true'){
			var isChecked =$('body').find("#create_another_Address:visible").prop('checked');
			if (isChecked) {
				$('#addressTagDetails').find(':input').each(function() {
					var type = this.type, tag = this.tagName.toLowerCase();
					if (type == 'text' || type == 'password' || tag == 'textarea')
						this.value = '';
					else if (type == 'checkbox' || type == 'radio')
						this.checked = false;
					else if (tag == 'select')
						this.selectedIndex = 0;
				})
				var millisecondsToWait = 1000;
				setTimeout(function() {
					openDialogAddressTag('createTagAddress', 0);
				}, millisecondsToWait);
			} else {
					//closeDialog();
			}
}
		

	}
}

	if (parentEntityName == "Customer") {
		setTimeout(function() {
			$(".DedupeButton").focus();
		}, 500);
	}
}

//for saving address in college
function saveCollegeOnce() {
        if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
           return;
        }
        if ($("#masterForm").valid()) {
              var contextPath = getContextPath();
              if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
                    collegeId = $("#collegeId").val();
              }
              $.ajax({
                    type : "POST",
                    url : contextPath + "/app/College/saveClgOnce",
                    data : $("#masterForm").serialize()+ "&parentId="+collegeId,
                    clearForm : true,
                    async: false,
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
function validateGSTIN(){
	var	validateFlag=false;
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/BusinessPartner/validateGSTIN",
			async : false,
			traditional: true,
			data :{
				stateId: $('#state_country').val(),
				GSTIN  : $("#gstIn").val()
			}, 
		success : function(data) {
				if(data.success=="success"){
				validateFlag=true;
				}
				else{
					validateFlag=false;
					new PNotify({
						title : "Failure",
						text :data.error,
						type : "error",
					});
					
				}
			
			},error : function(jqXHR,textStatus,errorThrown ){
				
				text = jqXHR.responseText;
				
				new PNotify({
					title : "Failure",
					text : text,
					type : "error",
				});

			}
		});
		return validateFlag;
	}