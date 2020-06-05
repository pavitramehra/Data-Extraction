var errorType = "error";
var warningType = "warning";
var successType = "success";
var errorTitle = "Error";
var warningTitle = "Warning";
var successTitle = "Success";

$(document).ready(function(){
    $("#selectActivity").removeClass('required');
    $("#selectAction").on('change', function(){
        var selectedType = $(this).val();
        if(selectedType == 'Send Back for Processing to Activity'){
            //Show activity dropdown and add mandatory class
            $("#selectActivityDiv").show();
            $("#selectActivity").addClass('required');
        } else{
            //Hide activity dropdown and remove mandatory class
            $("#selectActivityDiv").hide();
            $("#selectActivity").removeClass('required');
        }
    });
});

function saveConfirmReject(taskId){
    if(!$("#processRejectionVerdictForm").valid()){
        return;
    }
    var selectedAction = $("#selectAction").val();
    if(selectedAction == 'Send Back for Processing to Activity'){
        //Send back application to selected activity
        sendBackToActivity(taskId);
    } else{
        //Confirm reject
        confirmRejectActivity(taskId);
    }
}

function confirmRejectActivity(taskId){
    $.ajax({
		url : getContextPath()
				+ "/app/DynamicWorkflowConfiguration/saveConfirmRejectProcess/"
				+ taskId,
		type : 'POST',
		async : true,
		data : {
			"confirmRejectRemarks" : $('#confirmRejectRemarks').val()
		},
		success : function(jqXHR) {
            if(jqXHR == 1){
                //Rejected successfully
                showMessage(successTitle, process_rejected_successfully, successType);
                neutrinoNavigateTo(getContextPath()+ "/app/DynamicWorkflowConfiguration/applicationDataTableVo");
            } else{
                //Some exception occurred in cancelling the task
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
		}
	});
}

function sendBackToActivity(taskId){
    $.ajax({
		url : getContextPath()
				+ "/app/DynamicWorkflowConfiguration/sendBackFromRejectStage/"
				+ taskId,
		type : 'POST',
		async : true,
		data : {
            "sendBackRemarks" : $('#confirmRejectRemarks').val(),
            "stageName" : $('#selectActivity').val()
		},
		success : function(jqXHR) {
            if(jqXHR == 1){
                //Send back successful
                showMessage(successTitle, process_sendback_successfully, successType);
                neutrinoNavigateTo(getContextPath()+ "/app/DynamicWorkflowConfiguration/applicationDataTableVo");
            } else{
                //Some exception occurred in sendback
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
		}
	});
}

function exitRejectForm(){
    neutrinoNavigateTo(getContextPath()+ "/app/DynamicWorkflowConfiguration/applicationDataTableVo");
}

function showMessage(title, text, type){
    new PNotify({
        title : title,
        text : text,
        type : type,
        pnotify_animate_speed : .8,
        opacity : 1
    });
}