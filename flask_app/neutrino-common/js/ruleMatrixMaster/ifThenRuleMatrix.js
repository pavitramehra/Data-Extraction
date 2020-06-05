var errorType = "error";
var warningType = "warning";
var successType = "success";
var errorTitle = "Error";
var warningTitle = "Warning";
var successTitle = "Success";

$("input[id^='objectGraphTypeIf']").bind("objectGraphSelectionIf", function(){
    var index = $(this).attr('id').replace('objectGraphTypeIf','');
    loadOperators($(this).val(), index);
});

function loadOperators(id, index){
	$.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/loadOperators",
        data:{
        	"id" : id,
            "index" : index
        },
        success: function(result){
            $("#operatorDivIf"+index).html(result);
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });
}

$(document).ready(function(){
    setObjectGraphUrl();
	setObjectGraphForThenAction();
    $("#moduleName,#sourceProductId").on('change', function(){
        setObjectGraphUrl();
    });
	$("#ruleMatrixMasterTypeId").on('change', function(){
        setObjectGraphForThenAction();
    });
    ifTableIndex = $("#ifConditiontable tbody tr").length;
    thenTableIndex = $("#thenActiontable tbody tr").length;
    $("#thenActiontable").on("click",".thenRadioCon", function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).next('input').val('field');
        }
        else{
            $(this).addClass("active");
            $(this).next('input').val('objectGraphType');
        }
    });
});

function setObjectGraphUrl(){
    customUrl = "/RuleMatrixMaster/populateObjectGraphTypes/" + $("#moduleName").val() + "/" + $("#sourceProductId").val();
    $("input[id^='Text_objectGraphTypeIf']").attr("data-custom-controller", customUrl);
}
function setObjectGraphForThenAction(){
    customUrl1 = "/RuleMatrixMaster/populateObjectGraphBasedOnRuleMatrixType/" + $("#ruleMatrixMasterTypeId").val();
    $("input[id^='Text_objectGraphTypeThen']").attr("data-custom-controller", customUrl1);

}

function addNewIfRow(){
    $.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/addNewIfRow",
        async:false,
        data:{
            "index" : ifTableIndex,
            "moduleId" : $("#moduleName").val(),
            "sourceProduct" : $("#sourceProductId").val()
        },
        success: function(result){
            var res=$(result);
            $('#ifConditiontable tbody').append(res.find("table tbody").html());
            ifTableIndex++;
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });

}

function removeIfRow(index){
    $('#ifRow'+index).remove();
}
function removeThenRow(index){
    $('#thenRow'+index).remove();
}

function addNewThenRow(){
    $.ajax({
        url: getContextPath() + "/app/RuleMatrixMaster/addNewThenRow",
        async:false,
        data:{
            "index" : thenTableIndex,
            "ruleMatrixMasterTypeId" : $("#ruleMatrixMasterTypeId").val()
        },
        success: function(result){
            var res=$(result);
            $('#thenActiontable').append(res.find("table tbody").html());
            thenTableIndex++;
        },error: function(){
            showMessage(errorTitle, some_error_occurred, errorType);
        }
    });
}
function populateMatrix(){
    if(validateMatrixData()){

       populateAssignmentSetDetails(viewable);
        $("#ruleGrid").ruleMatrix({
            headerUrl : getContextPath() + "/app/RuleMatrixMaster/populateMatrix/" + assignmentIndex  + "/" + editViewModeOfAssignment,
            bodyUrl : getContextPath() + "/app/RuleMatrixMaster/populateBody/"+ assignmentIndex,
            tableproperties : {
                autoWidth: false,
                paging:true,
                language: {"info":"of _TOTAL_ entries", "lengthMenu": "Show _MENU_ "},
                lengthMenu: [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
                sPaginationType: "full_numbers",
                sDom: '<"bottom"rt><"bottom"ipl<"clear">>'
            },
            viewable : JSON.parse(viewable)
        });
        collapseIfThenGrid();
        openRuleMatrix();
    }
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

function validateMatrixData(){
    var fieldIdArr = [];
    var valid = true;
    if($("#ifConditiontable tbody tr").length < 1){
        showMessage(errorTitle, min_one_row_required_in_if_condition, errorType);
        valid = false;
    }
    if($("#thenActiontable tbody tr").length < 1){
        showMessage(errorTitle, min_one_row_required_in_then_actions, errorType);
        valid = false;
    }
	 $("select[id^='operatorIf'], select[id^='operatorThen']").each(function(){
		var indexIf = $(this).attr('id').replace('operatorIf','');
		var indexThen = $(this).attr('id').replace('operatorThen','');
		if($("#ifRowRuleTrue"+indexIf).hasClass("active")){
			//do nothing
		}else
        if($(this).val() == '' || $(this).val() == null){
			showMessage(errorTitle, select_operator, errorType);
			valid = false;
			$("#"+ $(this).attr('id') +"-control-group").addClass('error');
        }
    });
	    $("input[id^='objectGraphTypeIf']").each(function(){
	        if($(this).val() == '' || $(this).val() == null){
	            showMessage(errorTitle, blank_values_not_allowed_in_if_fields, errorType);
	            valid = false;
	            $("#content_"+ $(this).attr('id')).removeClass('success');
	            $("#content_"+ $(this).attr('id')).parent("[id^=ifGridRow]").addClass('error form-group');
	        }
	        else if(fieldIdArr.indexOf($(this).val()) > -1){
	            showMessage(errorTitle, duplicate_value_exist, errorType);
	            valid = false;
	            $("#content_"+ $(this).attr('id')).removeClass('success');
                $("#content_"+ $(this).attr('id')).parent("[id^=ifGridRow]").addClass('error form-group');
	        } else{
	            fieldIdArr.push($(this).val());
	        }
	    });
		$("input[id^='objectGraphTypeThen']").each(function(){
	        if($(this).val() == '' || $(this).val() == null){
	            showMessage(errorTitle, blank_values_not_allowed_in_then_fields, errorType);
	            valid = false;
	            $("#content_"+ $(this).attr('id')).removeClass('success');
                $("#content_"+ $(this).attr('id')).parent("[id^=thenGridRow]").addClass('error form-group');
	        }
	        else if(fieldIdArr.indexOf($(this).val()) > -1){
	            showMessage(errorTitle, duplicate_value_exist, errorType);
	            valid = false;
	            $("#content_"+ $(this).attr('id')).removeClass('success');
                $("#content_"+ $(this).attr('id')).parent("[id^=thenGridRow]").addClass('error form-group');
	        } else{
	            fieldIdArr.push($(this).val());
	        }
	    });
    return valid;
}
function conditionTypeChange(index){
	$("#Text_objectGraphTypeIf"+index).val("");
	var rule=false;
	var ruleUrl ='com.nucleus.rules.model.Rule';
	var objectGraphUrl= 'com.nucleus.rules.model.ObjectGraphTypes';
	if($("#ifRowRuleTrue"+index).hasClass("active")){
		$("#Text_objectGraphTypeIf"+index).attr("data-classname",objectGraphUrl);
		$("#Text_objectGraphTypeIf"+index).attr("data-itemlabel","displayName");
		$("#classNameVarID_objectGraphTypeIf"+index).val(objectGraphUrl);
		$("#searchColListVarID_objectGraphTypeIf"+index).val("displayName objectGraph");
		$("#itemLabelVarID_objectGraphTypeIf"+index).val("displayName");
		$("#operatorDivIf"+index).show();
		$("#parameterBased"+index).show();
		$("#Text_objectGraphTypeIf"+index).attr("placeholder","Select OGNL");
        $("#Text_objectGraphTypeIf"+index).attr("tooltipKey","Select OGNL");
		$("#ifRowRuleTrue"+index).removeClass("active");
        $("#ifRowRuleTrue"+index).next('input').val('objectGraphType');
	}else{
		$("#Text_objectGraphTypeIf"+index).attr("data-classname",ruleUrl);
		$("#Text_objectGraphTypeIf"+index).attr("data-itemlabel","code");
		$("#classNameVarID_objectGraphTypeIf"+index).val(ruleUrl);
		$("#searchColListVarID_objectGraphTypeIf"+index).val("code name");
		$("#itemLabelVarID_objectGraphTypeIf"+index).val("name");
		$("#operatorDivIf"+index).hide();
		$("#parameterBased"+index).hide();
		$("#Text_objectGraphTypeIf"+index).attr("placeholder","Select Rule");
        $("#Text_objectGraphTypeIf"+index).attr("tooltipKey","Select Rule");
		$("#ifRowRuleTrue"+index).addClass("active");
        $("#ifRowRuleTrue"+index).next('input').val('Rule');
	}
}
function fieldObjectGraphChange(index){
	if($("#parameterBased"+index).hasClass("active")){
            $("#parameterBased"+index).removeClass("active");
            $("#parameterBased"+index).next('input').val('field');
        }
        else{
            $("#parameterBased"+index).addClass("active");
            $("#parameterBased"+index).next('input').val('objectGraphType');
        }
}


