var isEditAssignmentSet = false;
var $clonedAssignmentSet;
var isOpenedAssignmentSet=false;
var errorTitle = "Error";
var errorType = "error";
var editViewModeOfAssignment=false;
viewable = "${viewable}";

$(document).ready(function(){
	var noAssignmentSet = "<c:out value='${noAssignmentSet}'/>";

	if(noAssignmentSet=="true"){
		new PNotify({
			title : "Error",
			text : add_atleast_one_assignment_set,
			type : "error",
			pnotify_animate_speed : .8,
			opacity : 1
		});
	}

	if("${ruleMatrixMaster.moduleName eq null}")
	{

		var optionModule="#moduleName option[value='"+$('#moduleName option:contains("Application")').val()+"']";
		$(optionModule).attr('selected', 'selected');

	}


	if("${ruleMatrixMaster.sourceProduct eq null}")
	{

		var optionSource="#sourceProductId option[value='"+$('#sourceProductId option:contains("CAS")').val()+"']";
		$(optionSource).attr('selected', 'selected');
		$('#sourceProductId').trigger("chosen:updated");
	}

});

	$(function() {

		if("${viewable}" == "true"){

			$('#addSetButton').attr("disabled",true);
		}
		else{

			$('#addSetButton').removeAttr("disabled");
		}

		$("select").chosen();


		$(".container-fluid-rule-designer").addClass("block-no");

	});



	function checkIsOpenedAssignmentSet()
	{
		if(isOpenedAssignmentSet)
			{
			new PNotify({
				title : "Error",
				text : unsaved_assignment_set,
				type : "error",
				pnotify_animate_speed : .8,
				opacity : 1
			});
			return false;
			}
		return true;

	}


function saveForm(){

		if (checkIsOpenedAssignmentSet())
			{
	        	var isChecked = $("#create_another_master").prop('checked')?true:false;
	        	$('.p_disable_view_mode').removeAttr("disabled");
	    		$('.p_select_disable_view_mode').removeAttr("disabled");
	        	var formTemp=$("#masterForm");
	        	$("#createAnotherMaster").val(isChecked);
	        	formTemp.submit();
			}
	}

function saveAndSendForApproval(context){
	var masterId = "<c:out value='${masterID}'/>";
	if (checkIsOpenedAssignmentSet())
		{
        	var isChecked = $("#create_another_master").prop('checked')?true:false;
        	$('.p_disable_view_mode').removeAttr("disabled");
    		$('.p_select_disable_view_mode').removeAttr("disabled");
        	var formTemp=document.getElementById("masterForm");
        	$("#createAnotherMaster").val(isChecked);
        	if($(".form").valid()){
        		formTemp.action=context+"/app/"+masterId+"/saveAndSendForApproval";
        		formTemp.submit();
        	}
		}
}

function closeModalOfSimulate() {

	$.each($(":input[id^='resultPatternList[']"),function(){
		$(this).tooltip('hide');
	});
	$('#modal_Rule_Simulate').modal('hide');
}

function openReferenceWindowForSimulation(){


	 $.ajax({
		url : "${pageContext.request.contextPath}/app/AssignmentMatrixSimulation/openSimulationModalWindowForRuleMatrix",
		async : false,

		success : function(jqXHR) {
			 $('#modal_body_rule_simulate_result').html(jqXHR);
			 $('#modal_Rule_Simulate').modal('show');
		},
		error : function(jqXHR,textStatus,
				errorThrown) {
			alert(rule_simulation_error);
		}
	});
}


var assignmentIndex=0;


function loadIfThenBlock(){
    collapseRuleMatrix();
	if($("#ifThenBlock").html() == null || $("#ifThenBlock").html().trim() == ""){
		if($("#masterForm").valid()){
					var validFlag=true;
							if (!$("#moduleName").valid())
							{
								validFlag=false;

							}
							if (!$("#ruleMatrixMasterTypeId").valid())
							{
								validFlag=false;

							}
							if (!$("#sourceProductId").valid())
							{
								validFlag=false;

							}
							if(validFlag==false){
								return false;
							}

							var module = $("#moduleName").find(
									'option:selected').text();

							var ruleMatrixMasterType = $("#ruleMatrixMasterTypeId").find(
								'option:selected').val();

							var sourceProduct = $("#sourceProductId").find(
								'option:selected').text();

							$.ajax({
										url : "${pageContext.request.contextPath}/app/RuleMatrixMaster/loadObjectGraphTypesIfThen/"
												+ module + "/" + ruleMatrixMasterType + "/" + sourceProduct,
										async : false,
										data: {
										assignmentSetType: "AssignmentGrid",
										"id" : $("#id").val(),
                                        "viewable" : "${viewable}"
                                        },
										success : function(jqXHR) {
											isEditAssignmentSet = false;
											 $("#ifThenBlock").html(jqXHR);

										},
										error : function(jqXHR, textStatus,
												errorThrown) {
											alert(error_occured);
										}
									});
		} else{
			setTimeout(function(){
				$("#ifThenBlock").removeClass('in').prev('a').addClass('collapsed');
			},10);
		}
	}
}


function populateRowData(mode, index){
    $.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/populateRowData/" + assignmentIndex,
        data:{
            "mode" : mode,
            "index" : index
        },
        success: function(result){
            $("#gridRowData").html(result);
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });
}

function addRowData(){
    if(validAddData()){
        $.ajax({
            url: getContextPath() + "/app/RuleMatrixMaster/addRowData/" + assignmentIndex,
            data : $("#masterForm").serialize(),
            success: function(json){
                populateRowData('new', null);
                $("#ruleGrid").trigger("ruleMatrixAdd",json);
            },error: function(){
                showMessage(errorTitle, some_error_occurred, errorType);
            }
        });
    }
}

function cancelRowData(){
    populateRowData('new', null);
}

function validAddData(){

    var valid = true;
    $("input[id^='thenStringValue']").each(function(){
        if($(this).val()=='' || $(this).val()==null){
            showMessage(errorTitle, blank_values_not_allowed_in_actions, errorType);
            valid = false;
            $("#"+$(this).attr('id')+ "-control-group").addClass('error');
        }
    });
    $("input[id^='thenParam']").each(function(){
        if($(this).val()=='' || $(this).val()==null){
            showMessage(errorTitle, blank_values_not_allowed_in_actions, errorType);
            valid = false;
            $("#content_"+ $(this).attr('id')).addClass('error');
        }
    });

     $("input[id^='priority']").each(function(){
            if($(this).val()=='' || $(this).val()==null){
                showMessage(errorTitle, blank_values_not_allowed_in_priority, errorType);
                valid = false;
                $("#content_"+ $(this).attr('id')).addClass('error');
            }
     });

    return valid;
}

function loadRuleMatrix(){
	collapseIfThenGrid();
	if($("#ruleGrid").html()==null || $("#ruleGrid").html()==''){
		loadMatrix(assignmentIndex,editViewModeOfAssignment);
	}
}


function collapseIfThenGrid(){
	$("#ifThenBlock").removeClass('in').prev('a').addClass('collapsed');
}

function openRuleMatrix(){
	$("#ruleMatrix").addClass('in').prev('a').removeClass('collapsed');
}

function collapseRuleMatrix(){
	$("#ruleMatrix").removeClass('in').prev('a').addClass('collapsed');
}

function loadMatrix(assignmentIndex,editViewModeOfAssignment){
	$.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/isMatrixValid/"  + assignmentIndex,
        data : $("#masterForm").serialize(),
        success: function(result){
            if(result){
				populateAssignmentSetDetails(viewable);
    			$("#ruleGrid").ruleMatrix({
			        headerUrl : getContextPath() + "/app/RuleMatrixMaster/populateMatrix/" + assignmentIndex  + "/" + editViewModeOfAssignment,
			        bodyUrl : getContextPath() + "/app/RuleMatrixMaster/populateBody/"  + assignmentIndex,
			        tableproperties : {
			            autoWidth: false,
			            paging:true,
			            language: {"info":"of _TOTAL_ entries", "lengthMenu": "Show _MENU_ "},
			            lengthMenu: [10, 25, 50, "All"],
			            sPaginationType: "full_numbers",
			            sDom: '<"bottom"rt><"bottom"ipl<"clear">>'
			        },
			        viewable : JSON.parse(viewable)
			    });
            } else{
    			showMessage(errorTitle, no_data_available, errorType);
    			collapseRuleMatrix();
            }
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });

}


function populateAssignmentSetDetails(viewable){
	$.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/loadAssignmentSetDetails/" + assignmentIndex,
		 data:{
            "viewable" : viewable
        },
		async :false,
        success: function(result){
            $("#assignmentSetDetails").html(result);
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });
}


function deleteRowData(index){
    $.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/deleteRowData",
        data:{
            "index" : index
        },
        success: function(result){
            showMessage(successTitle, data_deleted, successType);
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });
}
function dateValidator(fromDate, toDate) {
		var stDt = $('#' + fromDate).val();
		var edDt = $('#' + toDate).val();
		var invalidDateMsg = "";

		var dateFrmt = $('#datepicker_'+ fromDate).attr('data-real-format');
		var startDate = Date.parseString(stDt,dateFrmt);
		var endDate = Date.parseString(edDt,dateFrmt);
		var invalidDateElement = "";

		var isValidDate = false;
		if(stDt != "" && edDt != "" && (endDate.valueOf() < startDate.valueOf())){
			$('#'+ toDate).val("");
			invalidDateElement = "#" + fromDate;
			invalidDateMsg = "Effective Till Date cannot be less than Effective From";
			isValidDate = true;
		}
		if(stDt=="" && edDt!=""){
			invalidDateMsg = "Effective From Date cannot be empty";
			invalidDateElement = "#" + fromDate;
			isValidDate = true;

		}
		if(stDt!="" && edDt==""){
			invalidDateMsg = "Effective Till Date cannot be empty";
			invalidDateElement = "#" + toDate;
			isValidDate = true;
		}

		if(stDt=="" && edDt=="" && $("#bufferDays").val()!=""){
            invalidDateElement = "#" + toDate;
            $(invalidDateElement).addClass("error");
            $(invalidDateElement).parent('div').parent('div').parent('div').addClass("error");
            $(invalidDateElement).parent('div').parent('div').parent('div').removeClass("success");

		    invalidDateMsg = "Effective From and Effective Till Date cannot be empty";
            invalidDateElement = "#" + fromDate;
            isValidDate = true;

		}

		if(isValidDate){
			new PNotify({
				title : "Failure",
				text : invalidDateMsg,
				type : "error",
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
			$(invalidDateElement).addClass("error");
			$(invalidDateElement).focus();
			$(invalidDateElement).parent('div').parent('div').parent('div').addClass("error");
			$(invalidDateElement).parent('div').parent('div').parent('div').removeClass("success");
		}else{
		    $('#' + fromDate).removeClass("error");
		    $('#' + fromDate).parent('div').parent('div').parent('div').removeClass("error");
		    $('#' + toDate).removeClass("error");
            $('#' + toDate).parent('div').parent('div').parent('div').removeClass("error");
		}
		return isValidDate;
};
var clickedAssignmentRow=-1;
function saveAssignmentSet(){
    if(dateValidator('effectiveFrom','effectiveTill')){
        return false;
    }
	var assignmentSetName = $("#assignmentSetName").val();
	var assignmentPriority = $("#assignmentPriority").val();
	var assignmentSetrule = $("#assignmentSetrule").val();
	var executeAll = $("#executeAll").parent('span').hasClass('checked');
	var defaultSet = $("#defaultSet").parent('span').hasClass('checked');
	var effectiveFrom = $("#effectiveFrom").val();
	var effectiveTill = $("#effectiveTill").val();
	var bufferDays = $("#bufferDays").val();
    if(!$("#bufferDays").valid()){
        $("#bufferDays").focus();
        return false;
    }
	$.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/addAssignmentSetToSession/" + assignmentIndex,
        data:{
            "assignmentSetName" : assignmentSetName,
			"assignmentPriority" : assignmentPriority,
			"assignmentSetrule" : assignmentSetrule,
			"executeAll"        : executeAll,
			"defaultSet"        : defaultSet,
			"effectiveFrom"     : effectiveFrom,
			"effectiveTill"     : effectiveTill,
			"bufferDays"		: bufferDays
        },
        success: function(result){
			if(clickedAssignmentRow == -1){
				//new row added
				addNewRowForAssignment(assignmentIndex,assignmentSetName,assignmentPriority);
				assignmentIndex++;
			} else{
				editExistingRow(clickedAssignmentRow,assignmentSetName,assignmentPriority);
				clickedAssignmentRow = -1;

				//existing row edited
			}

        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });


	$("#ifThenBlock").html("");
	$("#assignmentSetDetails").html("");
	$("#gridRowData").html("");
	$("#ruleGrid").html("");

	$("#IfThenAccordians").hide();


}

function addNewRowForAssignment(assignmentIndex,assignmentSetName,assignmentPriority){


		var newAssignmentElement = $('tr#dummyRow').clone().attr(
			'id', 'dummyRow' + assignmentIndex);

	newAssignmentElement.find('a#assignmentSetNameTable').attr(
	    {
            'id' : 'assignmentSetNameTable' + assignmentIndex,

	    });
	newAssignmentElement.find('td#assignmentSetPriorityTable').attr(
	    {
            'id' : 'assignmentSetPriorityTable' + assignmentIndex,

	    });
	newAssignmentElement.find('td#assignmentSetActionsTable').attr(
	{
		'id' : 'assignmentSetActionsTable' + assignmentIndex,

	});
	newAssignmentElement.find('img#editImage').attr(
	{
		'id' : 'editImage' + assignmentIndex,

	});

	newAssignmentElement.find('img#deleteImage').attr(
	{
		'id' : 'deleteImage' + assignmentIndex,

	});


	newAssignmentElement.appendTo('table#p_assignment_set_grid1.table');
	$("#assignmentSetNameTable"+assignmentIndex).text(assignmentSetName);
	$("#assignmentSetPriorityTable"+assignmentIndex).text(assignmentPriority);


}

function editExistingRow(assignmentIndex,assignmentSetName,assignmentPriority){

	$("#assignmentSetNameTable"+assignmentIndex).text(assignmentSetName);
	$("#assignmentSetPriorityTable"+assignmentIndex).text(assignmentPriority);

}

function showAccordians(){
	$("#IfThenAccordians").show();
	loadIfThenBlock();
	$("#ifThenBlock").addClass('in').prev('a').removeClass('collapsed');
}



$(document).off("click","a[id^='assignmentSetNameTable']").on("click","a[id^='assignmentSetNameTable']", function() {
		var clickId = $(this).attr('id');
		assignmentIndex = clickId.replace("assignmentSetNameTable", "");
		viewable=true;
		$("#IfThenAccordians").show();
		loadIfThenForAssignmentSet(assignmentIndex);
		editViewModeOfAssignment=true;
		loadMatrix(assignmentIndex,editViewModeOfAssignment);
		openRuleMatrix();

	});


$(document).off("click","img[id^='editImage']").on("click","img[id^='editImage']", function() {
		var clickId = $(this).attr('id');
		assignmentIndex = clickId.replace("editImage", "");
		clickedAssignmentRow= assignmentIndex;
		viewable=false;
		$("#IfThenAccordians").show();
		loadIfThenForAssignmentSet(assignmentIndex);
		editViewModeOfAssignment=true;
		loadMatrix(assignmentIndex,editViewModeOfAssignment);
		openRuleMatrix();


	});

$(document).off("click","img[id^='deleteImage']").on("click","img[id^='deleteImage']", function() {
		var clickId = $(this).attr('id');
		assignmentIndex = clickId.replace("deleteImage", "");
		deleteAssignmentSet(assignmentIndex);


	});


function deleteAssignmentSet(assignmentIndex){
	    $.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/deleteAssignmentSet",
        data:{
            "assignmentIndex" : assignmentIndex
        },
        success: function(result){
			$('#assignmentSetPriorityTable'+assignmentIndex).parent('tr').remove();
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });

}

function loadIfThenForAssignmentSet(assignmentIndex){

		if($("#masterForm").valid()){
					var validFlag=true;
							if (!$("#moduleName").valid())
							{
								validFlag=false;

							}
							if (!$("#ruleMatrixMasterTypeId").valid())
							{
								validFlag=false;

							}
							if (!$("#sourceProductId").valid())
							{
								validFlag=false;

							}
							if(validFlag==false){
								return false;
							}

							var module = $("#moduleName").find(
									'option:selected').text();

							var ruleMatrixMasterType = $("#ruleMatrixMasterTypeId").find(
								'option:selected').val();

							var sourceProduct = $("#sourceProductId").find(
								'option:selected').text();

							$.ajax({
										url : "${pageContext.request.contextPath}/app/RuleMatrixMaster/loadIfThenForAssignmentSet/"
												+ assignmentIndex,
										async : false,

										success : function(jqXHR) {
											isEditAssignmentSet = false;
											 $("#ifThenBlock").html(jqXHR);

										},
										error : function(jqXHR, textStatus,
												errorThrown) {
											alert(error_occured);
										}
									});
		} else{
			setTimeout(function(){
				$("#ifThenBlock").removeClass('in').prev('a').addClass('collapsed');
			},10);
		}

}
