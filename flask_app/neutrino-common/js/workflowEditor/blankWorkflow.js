var errorType = "error";
var warningType = "warning";
var successType = "success";
var errorTitle = "Error";
var warningTitle = "Warning";
var successTitle = "Success";

showMessage = function (title, text, type){
    new PNotify({
        title : title,
        text : text,
        type : type,
        pnotify_animate_speed : .8,
        opacity : 1
    });
}

$(document).ready(function() {
   $("#_saveUpper,#_saveLower").on("click", function(){

        if(!$('#masterForm').valid()) {
           return;
        }
        var workflowName = $("#workflowName").val();
        var processDefinitionKey = $("#processDefinitionKey").val();
        var workflowConfigType = $("#workflowConfigType").val();
        var contextPath = getContextPath();

        $.ajax({
            url: contextPath + "/app/WorkflowEditor/validateBlankWorkflow",
            data : {
                "workflowName" : workflowName,
                "workflowConfigTypeName" : $("#workflowConfigType").val(),
                "processDefinitionKey" : $("#processDefinitionKey").val(),
                "currentVersion" : $("#currentVersion").val()
            },
            success: function(response){
                var isErrorOccurred = false;
                var wConfigId = response.workflowConfigTypeId;
                // handle validation response
                if(response.workflowName) {
                    showMessage(errorTitle, workflow_name_already_exist, errorType);
                    isErrorOccurred = true;
                }
                if(response.workflowConfigTypeName) {
                    showMessage(errorTitle, workflow_config_type_already_exist, errorType);
                    isErrorOccurred = true;
                }
                if(response.processDefinitionKey) {
                    showMessage(errorTitle, workflow_process_definition_already_exist, errorType);
                    isErrorOccurred = true;
                }

                if(!isErrorOccurred) {
                    $("#workflowConfigTypeId").val(wConfigId);
                 var serializedFormTemp = $('#masterForm').serialize();
                 $.ajax({
                        async:false,
                        type: "post",
                        url: contextPath + "/app/WorkflowEditor/saveBlankWorkflow",
                        data : serializedFormTemp,
                        success: function(result){
                            neutrinoNavigateTo(contextPath + "/app/WorkflowEditor/editDynamicFirstTime/"+result);
                        }, error: function(){
                            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                      }
                    });
                }
            },error: function(){
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
        });
    });

    $("#_cancelUpper,#_cancelLower").on("click", function(){
            neutrinoNavigateTo(getContextPath() + "/app/grid/DynamicWorkflowConfiguration/DynamicWorkflowConfiguration/loadColumnConfig");
    });
   $("#isSubProcess").on("click",function(){
          if($(this).is(':checked')){
              $("#contextDiv").hide();
          }else{
              $("#contextDiv").show();
          }
           $("#context").val("");
           $("#context").trigger("chosen:updated");
   });
});