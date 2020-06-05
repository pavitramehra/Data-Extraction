$("input[id^='objectGraphTypeIf']").bind("objectGraphSelectionIf", function(){
    var index = $(this).attr('id').replace('objectGraphTypeIf','');
    loadOperators($(this).val(), index);
});

function loadOperators(id, index){
	$.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/loadOperators",
        data:{
        	"id" : id,
            "index" : index
        },
        success: function(result){
            $("#operatorDivIf"+index).html(result);
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });
}

$(document).ready(function(){
    setObjectGraphUrl();
    $("#moduleName,#sourceproduct").on('change', function(){
        setObjectGraphUrl();
    });
    ifTableIndex = $("#ifConditiontable tbody tr").length;
    thenTableIndex = $("#thenActiontable tbody tr").length;

    $("#ifConditiontable").on("click",".ifRadioCon", function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).next('input').val('field');
        }
        else{
            $(this).addClass("active");
            $(this).next('input').val('objectGraphType');
        }
    });
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
    customUrl = "/WorkflowAssignment/populateObjectGraphTypes/" + $("#moduleName").val() + "/" + $("#sourceproduct").val();
    $("input[id^='Text_objectGraphTypeThen']").attr("data-custom-controller", customUrl);
    $("input[id^='Text_objectGraphTypeIf']").attr("data-custom-controller", customUrl);
}

function addNewIfRow(){
    $.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/addNewIfRow",
        data:{
            "index" : ifTableIndex,
            "moduleId" : $("#moduleName").val(),
            "sourceProduct" : $("#sourceproduct").val()
        },
        success: function(result){
            var res=$(result);
            $('#ifConditiontable tbody').append(res.find("table tbody").html());
            ifTableIndex++;
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });

}

function addNewThenRow(){
    $.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/addNewThenRow",
        data:{
            "index" : thenTableIndex,
            "moduleId" : $("#moduleName").val(),
            "sourceProduct" : $("#sourceproduct").val()
        },
        success: function(result){
            var res=$(result);
            $('#thenActiontable').append(res.find("table tbody").html());
            thenTableIndex++;
        },error: function(){
            showMessage(errorTitle, "Some error occurred", errorType);
        }
    });
}

function removeIfRow(index){
    $('#ifRow'+index).remove();
}

function removeThenRow(index){
    $('#thenRow'+index).remove();
}

function populateMatrix(){
    if(validateMatrixData()){
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
        collapseIfThenGrid();
        openRuleMatrix();
    }
}

function validateMatrixData(){
    var fieldIdArr = [];
    var valid = true;
    if($("#ifConditiontable tbody tr").length < 1){
        showMessage(errorTitle, "Minimum one row is required in if conditions", errorType);
        valid = false;
    }
    if($("#thenActiontable tbody tr").length < 1){
        showMessage(errorTitle, "Minimum one row is required in then actions", errorType);
        valid = false;
    }
    $("input[id^='objectGraphTypeIf'], input[id^='objectGraphTypeThen']").each(function(){
        if($(this).val() == '' || $(this).val() == null){
            showMessage(errorTitle, "Blank values not allowed", errorType);
            valid = false;
            $("#content_"+ $(this).attr('id')).addClass('error');
        }
        else if(fieldIdArr.indexOf($(this).val()) > -1){
            showMessage(errorTitle, "Duplicate values exist", errorType);
            valid = false;
            $("#content_"+ $(this).attr('id')).addClass('error');
        } else{
            fieldIdArr.push($(this).val());
        }
    });

    $("select[id^='operatorIf'], select[id^='operatorThen']").each(function(){
        if($(this).val() == '' || $(this).val() == null){
            showMessage(errorTitle, "Blank values not allowed", errorType);
            valid = false;
            $("#"+ $(this).attr('id') +"-control-group").addClass('error');
        }
    });
    return valid;
}