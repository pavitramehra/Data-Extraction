var errorType = "error";
var warningType = "warning";
var successType = "success";
var errorTitle = "Error";
var warningTitle = "Warning";
var successTitle = "Success";
var customUrl="";
var ifTableIndex=0;
var thenTableIndex=0;
var viewable = "";

$("#productType").bind("productTypeSelection", function(){
    var productTypeId = $("#productType").val();
    if(productTypeId == ''){
        productTypeId = 0;
    }
    var url = "/WorkflowAssignment/populateStageName/" + productTypeId;
    $("#Text_processingStageType").attr("data-custom-controller", url);
});

$("#processingStageType").bind("processingStageSelection", function(){
	var productTypeId = $("#productType").val();
	var processingStageTypeId = $("#processingStageType").val();
	if(productTypeId == null || productTypeId == ''){
		showMessage(errorTitle, "Please fill product type first", errorType);
		$("#processingStageType").val("");
		$("#Text_processingStageType").val("");
	}
    else if(isDuplicateRecord(productTypeId, processingStageTypeId)){
    	showMessage(errorTitle, "Product type and stage name combination alredy exist", errorType);
		$("#processingStageType").val("");
		$("#Text_processingStageType").val("");
    }
});

function loadIfThenBlock(){
	collapseRuleMatrix();
	if($("#ifThenBlock").html() == null || $("#ifThenBlock").html().trim() == ""){
		if($("#masterForm").valid()){
			$.ajax({
	            url: getContextPath() + "/app/WorkflowAssignment/loadIfThenBlock",
	            data:{
	        		"id" : $("#id").val(),
	        		"viewable" : viewable
	        	},
	            success: function(result){
	                $("#ifThenBlock").html(result);
	            },error: function(){
	                showMessage(errorTitle, "Some error occurred", errorType);
	            }
	        });
		} else{
			setTimeout(function(){
				$("#ifThenBlock").removeClass('in').prev('a').addClass('collapsed');
			},10);
		}
	}
}

function loadRuleMatrix(){
	collapseIfThenGrid();
	if($("#ruleGrid").html()==null || $("#ruleGrid").html()==''){
		loadMatrix();
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

function showMessage(title, text, type){
    new PNotify({
        title : title,
        text : text,
        type : type,
        pnotify_animate_speed : .8,
        opacity : 1
    });
}

function populateRowData(mode, index){
    $.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/populateRowData",
        data:{
            "mode" : mode,
            "index" : index
        },
        success: function(result){
            $("#gridRowData").html(result);
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });
}

function addRowData(){
    if(validAddData()){
        $.ajax({
            url: getContextPath() + "/app/WorkflowAssignment/addRowData",
            data : $("#masterForm").serialize(),
            success: function(json){
                populateRowData('new', null);
                $("#ruleGrid").trigger("ruleMatrixAdd",json);
            },error: function(){
                showMessage(errorTitle, "Some error occurred", errorType);
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
            showMessage(errorTitle, "Blank values not allowed in actions", errorType);
            valid = false;
            $("#"+$(this).attr('id')+ "-control-group").addClass('error');
        }
    });
    $("input[id^='thenParam']").each(function(){
        if($(this).val()=='' || $(this).val()==null){
            showMessage(errorTitle, "Blank values not allowed in actions", errorType);
            valid = false;
            $("#content_"+ $(this).attr('id')).addClass('error');
        }
    });
    return valid;
}

function deleteRowData(index){
    $.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/deleteRowData",
        data:{
            "index" : index
        },
        success: function(result){
            showMessage(successTitle, "Data deleted", successType);
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });
}

function loadMatrix(){
	$.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/isMatrixValid",
        data : $("#masterForm").serialize(),
        success: function(result){
            if(result){
    			$("#ruleGrid").ruleMatrix({
			        headerUrl : getContextPath() + "/app/WorkflowAssignment/populateMatrix",
			        bodyUrl : getContextPath() + "/app/WorkflowAssignment/populateBody",
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
    			showMessage(errorTitle, "No data available", errorType);
    			collapseRuleMatrix();
            }
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });

}

function isDuplicateRecord(productTypeId, processingStageTypeId){
	var isDuplicate = false;
	$.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/isDuplicateRecord",
        async: false,
        data:{
            "productTypeId" : productTypeId,
            "processingStageTypeId" : processingStageTypeId,
            "workflowAssignmentId" : $("#id").val()
        },
        success: function(result){
            isDuplicate = result;
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });
	return isDuplicate;
}