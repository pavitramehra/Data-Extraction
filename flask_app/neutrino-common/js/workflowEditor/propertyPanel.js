var customSet = false;
var clickedAuto = false;
$(document).ready(function(){
    $("#propertyList :first-child").addClass('active');
    $("#propertyDivList :first-child").addClass('active');
    $("#workflowConfig").bind("workflowSelection", function(){
	    $("#Text_processingStage").prop("disabled",null);
	    $("#Text_processingStage").prop("readonly",null);
	    var workflowId = $("#workflowConfig").val();
	    var url = "/WorkflowEditor/populateStageName/" + workflowId;
	    $("#Text_processingStage").attr("data-custom-controller", url);
	});
	$("#processingStage").bind("processingStageSelection", function(){});
	$("input[id^='isCustomSubProcessCheckBox']").on('click', function(){
		if(!clickedAuto && $("input[id^='isServiceTaskCheckBox_']").is(':checked')){
			clickedAuto = true;
			$("input[id^='isServiceTaskCheckBox_']").click();
			clickedAuto = false;
		}
		customProcessCheck($(this));
	});
	$("input[id^='isServiceTaskCheckBox_']").on('click', function(){
		if(!clickedAuto && $("input[id^='isCustomSubProcessCheckBox']").is(':checked')){
			clickedAuto = true;
			$("input[id^='isCustomSubProcessCheckBox']").click();
			clickedAuto = false;
		}
		servicetaskCheck($(this));
	});
});

function customProcessCheck(element){
	var id = element.attr('id').split('_');
	var iIndex = id[1];
	var jIndex = id[2];
	if(element.is(':checked')){
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).removeAttr('disabled');
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).removeAttr('readonly');
		if(!customSet){
			var customDataController = $("#Text_CalledElement_"+iIndex+"_"+jIndex).attr('data-custom-controller');
			$("#Text_CalledElement_"+iIndex+"_"+jIndex).attr('data-custom-controller', customDataController + "/" + $("#processDefinitionKey").val());
			customSet = true;
		}
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).val('');
		$("#CalledElement_"+iIndex+"_"+jIndex).val('');
	} else{
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).attr('disabled','disabled');
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).attr('readonly','readonly');
		var hiddenId = $("#hiddenProcessId_"+ iIndex +"_"+ jIndex).val();
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).val(hiddenId);
		$("#CalledElement_"+iIndex+"_"+jIndex).val(hiddenId);
	}
}

function servicetaskCheck(element){
	var id = element.attr('id').split('_');
	var iIndex = id[1];
	var jIndex = id[2];
	if(element.is(':checked')){
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).val(serviceCallElement);
		$("#CalledElement_"+iIndex+"_"+jIndex).val(serviceCallElement);
	} else{
		var hiddenId = $("#hiddenProcessId_"+ iIndex +"_"+ jIndex).val();
		$("#Text_CalledElement_"+iIndex+"_"+jIndex).val(hiddenId);
		$("#CalledElement_"+iIndex+"_"+jIndex).val(hiddenId);
	}
}
