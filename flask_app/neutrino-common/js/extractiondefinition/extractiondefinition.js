$(document).ready(function() {
	
 
	$('#_delete').remove();
	
		
});






$.validator.addMethod('onlyNumericValue', function (value,element) {
	   return this.optional(element) ||/^[0-9]*$/i.test(value);
		  
}, "Only numbers are allowed.");



jQuery.validator.addMethod('nonZeroNumericValue', function (value,element) {
	   return this.optional(element) || Number(value) > 0;
	  
	    }, "Only positive non zero numbers are allowed.");


$.validator.addMethod("alphaNumericWithUnderscore", function(value) {
	return  validAlphaNumWithUnderscore(value);
},"Alphanumeric with underscore only.");


$(document).ready(function() {
	
	$('#sourceProductId option:nth(1)').attr('selected','selected');
	$('#sourceProductId').trigger('chosen:updated');
	
	
jQuery("#criteriaCode").change(function() {
var extractionRuleCode = jQuery("#criteriaCode").val().trim();
jQuery("#criteriaCode").val(extractionRuleCode.toUpperCase());
});


$('#criteriaCode')
.focusout(
		function() {
			if ($('#criteriaCode').val() != "") {
				
				$
						.ajax({
							url : getContextPath()
									+ "/app/ExtractionDefinition/checkDuplicateCriteriaCode",
							async : false,
							type : "POST",
							dataType : "json",
							data :  $('#masterForm').serialize(),
							success : function(data) {
								if (data.error != null) {
									$('#criteriaCode').val('');
									displayAjaxMessages(data);
								} else {
									flag = 1;
								}
							}
						})
			}

		});






});


function validAlphaNumWithUnderscore(val){
	
	var intRegex =new RegExp("^["+allowedAlphaCharSet+"0-9_]*$");
	
	if(intRegex.test(val)) {
		return true;
	}
		return false;
}


function saveForm() {
	var masterID = document.getElementById("masterID").value;
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	
	if ($("#masterForm").valid() && checkIfPriorityUnique()) {
			document.getElementById("masterForm").action = getContextPath()+"/app/" + masterID + "/save";
			
			jQuery("#criteriaCode").attr("disabled", false);
			jQuery("#sourceProductId").attr("disabled", false);
			
			var formTemp = $("#masterForm");
			$("#createAnotherMaster").val(isChecked);
			validateGroupMatch(formTemp,"'saveForm'");
	}
	}


function saveAndSendForApproval() {
	var masterID = document.getElementById("masterID").value;
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	
	
	
	if ($("#masterForm").valid() && checkIfPriorityUnique()) {
			document.getElementById("masterForm").action = getContextPath()+"/app/" + masterID + "/saveAndSendForApproval";
			jQuery("#criteriaCode").attr("disabled", false);
			jQuery("#sourceProductId").attr("disabled", false);
			var formTemp = $("#masterForm");
			$("#createAnotherMaster").val(isChecked);
			validateGroupMatch(formTemp,"'saveAndSendForApproval'");

	}
	}

function validateGroupMatch(formTemp,eventTriggerer){
		if(validateWhetherGroupStartMatchGroupEnd(eventTriggerer, "entryCriteria")) {
			closingGroupsValidated=false;
			if(validateWhetherGroupStartMatchGroupEnd(eventTriggerer, "exitCriteria")){
				formTemp.submit();
			}
	}
}

function enableDisabledFields(){
	jQuery("#criteriaCode").attr("disabled", false);
}


function checkIfPriorityUnique(){
	
	var priority =$('#priority').val();
	var flag = true;
	
	
	if (priority != "") {
		
		$.ajax({
					url : getContextPath()
							+ "/app/ExtractionDefinition/checkDuplicatePriority",
					async : false,
					type : "POST",
					dataType : "json",
					data :  $('#masterForm').serialize(),
					success : function(data) {
						if (data.error != null) {
							$('#priority').val('');
							displayAjaxMessages(data);
							flag=false;
							
						} else {
							flag = true;
						}
					}
				})
	}
	
	return flag;
	
}

function postTaskAction(action, context) {
	
	var approvalStatusOfRecord = $('#approvalStatusOfRecord').val();
	
	var taskId =new Array;
	taskId.push($("#taskId").val());
	var masterID =$('#masterID').val();
	var form = document.getElementById("masterForm");
		var url = "";
		url = context + "/app/ExtractionDefinition/completeTask";

		form.action = context + "/app/grid/" + masterID + "/" + masterID
				+ "/loadColumnConfig";
	$.ajax({
                        url : url,
                        type : "POST",
                        data :{"action" :action,
                               "taskIds" :taskId},
                  
                        success : function(result) {

                               if ($(".form").valid())
                                      form.submit();

                        },
                        error : function() {
                        
                               $
                                             .sticky(
                                                           error_message,
                                                           {
                                                                  autoclose : 2000,
                                                                  position : "top-right",
                                                                  type : "st-error"
                                                           });
                        }
                  });

}

function getBasicRuleIndex(lastIndexEntryCriteria, lastIndexExitCriteria){
	if(lastIndexEntryCriteria>lastIndexExitCriteria){
		return lastIndexEntryCriteria;
	}else{
		return lastIndexExitCriteria;
	}
}