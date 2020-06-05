$(document).ready(function() {
	$(document).on("click","#Start",function(){

		var workflowId = $(this).parent('td').parent('tr').find('td.tbl-left').find('a').prop('id');

		if(workflowId == undefined) {
			workflowId = $(this).parent().parent().parent().parent('td').parent('tr').find('td.tbl-left').find('a').prop('id');
		}

		var contextPath = getContextPath();
		$.ajax({
            url: contextPath + "/app/WorkflowEditor/startWorkflow/"+workflowId,
            success: function(response){
				if($("#dynamicWorkflowDiv").html() == null) {
					$("body").append("<div id='dynamicWorkflowDiv'></div>");
				}
				$("#dynamicWorkflowDiv").html(response);
				$('#dialog-form-SupportedContextPopup').modal('show');
            },
            complete : function(xhr, textStatus) {
                if(xhr.status==204) {
                    showMessage('Error', xhr.getResponseHeader('message'), 'error');
                }
            },
            error: function(){
                showMessage("error", "Something went wrong.", "error");
            }
        });

	});

    $(document).on("click","#showSupportedContextPopup",function(){
        $('#dialog-form-SupportedContextPopup').modal('show');
    });

    $(document).on("click","#cancelSupportedContextPopup,#closeSupportedContextPopup",function(){
        $('#dialog-form-SupportedContextPopup').modal('hide');
    });
    $(document).on("click",".selectThis_DynamicWorkflowConfiguration, #selectAll_DynamicWorkflowConfiguration", function(){
       setTimeout(function(){
           $("#StartDynamicWorkflowConfigurationBttn").hide();
       },10);
    });
});