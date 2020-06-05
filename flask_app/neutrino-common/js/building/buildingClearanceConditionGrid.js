
$(document).ready(function() {

	if ($("#id").val() != "" && $("#id").val() != undefined) {
		buildingId = $("#id").val();
		
		var contextPath = getContextPath();
	}
	
	$(document).on('click','.clearance-model-close', function(){
		var id = $(this).attr('id');
		$('#dialog-form-ClearanceCondition').modal('hide');
	});

});

function loadBuildingClearanceConditionTable() {
	var contextPath = getContextPath();
	$.ajax({
		url : contextPath + "/app/Building/BuildingClearanceCondition/loadPage/"
		+ buildingId,
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#buildingClearanceConditionGrid').load(url, function() {
			//	$('#childTabs').tab(); // initialize tabs
			});
		},
		failure : function() {
		    new PNotify({
               title : "Error",
               text : "Some Error Occured",
               type : "error",
               pnotify_animate_speed : fadeOutduration,
               opacity : .8
           });
		}
	});
}

function openDialogAccount(action, id) {
	var contextPath = getContextPath();
	$.ajax({
		url : contextPath + "/app/Building/BuildingClearanceCondition/" + action,
		type : 'POST',
		async : false,
		data : "id=" + id,
		success : function(jqXHR) {
			$('#childModalClearanceCondition').html(jqXHR);
			$('#dialog-form-ClearanceConditionEdit').hide();
			$('#dialog-form-ClearanceConditionView').hide();
			$('#dialog-form-ClearanceConditionNew').show();
            $("#cleared").chosen();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			 new PNotify({
	               title : "Error",
	               text : textStatus,
	               type : "error",
	               pnotify_animate_speed : fadeOutduration,
	               opacity : .8
	           });
		}
	});
	$('#dialog-form-ClearanceCondition').modal('show');
}

function StickyMessageClearanceCondition(message)
{
    new PNotify({
        title : "Success",
        text : message,
        type : "success",
        pnotify_animate_speed : fadeOutduration,
        opacity : .8
    });
}

function hide(divId) {
	divId = "#" + divId;
	$(divId).hide();
}

function saveClearanceConditionToSession() {
	if ($("#id").val() != ""
		&& $("#id").val() != undefined) {
		buildingId = $("#id").val();
	}
	if ($("#clearanceConditionDetail").valid()) {
		if(checkDuplicates()) {
			var contextPath = getContextPath();
			$.ajax({
				type : "POST",
				url : contextPath + "/app/Building/BuildingClearanceCondition/saveToGrid",
				data : $('#clearanceConditionDetail').serialize() + "&parentId="
				+ buildingId,
				clearForm : true,
				success : function(response) {
				    if(response == "failure"){
				        new PNotify({
                           title : "Error",
                           text : "Clearance Condition cannot be null.",
                           type : "error",
                           pnotify_animate_speed : fadeOutduration,
                           opacity : .8
                       });
				    } else {
				    	copyPaymentPlan($("#id").val(),response);
                        $("#id").val(response);
                        buildingId = response;
                        loadPaymentPlan(false);
                        var isChecked =$('body').find("#create_another_ClearanceCondition:visible").prop('checked');
                        if (isChecked) {
                            $('#dialog-form-ClearanceCondition.modal').modal('hide');
                        }
                        else {
                            $('#dialog-form-ClearanceCondition.modal').modal('hide');
                        }
                        var baseURL = contextPath
                        + "/app/Building/BuildingClearanceCondition/loadPage/"
                        + buildingId;
                        $('#buildingClearanceConditionGrid').load(baseURL, function() {
                            if (isChecked) {
                                //to load grid and show buildingClearanceConditionGrid again
                                openDialogAccount('create',buildingId);
                            }
                        });
                        StickyMessageClearanceCondition(data_saved);
				    }
				},
				error : function() {
					new PNotify({
                       title : "Error",
                       text : "Some Error Occured",
                       type : "error",
                       pnotify_animate_speed : fadeOutduration,
                       opacity : .8
                   });
				}
			});
		} else {
            new PNotify({
               title : "Error",
               text : "Clearance Condition already exists",
               type : "error",
               pnotify_animate_speed : fadeOutduration,
               opacity : .8
           });
		}
	}
}

function checkDuplicates() {
	var result = true;
	for(var i=0;i<clearanceConditionTableData.length;i++ ) {
	    var test = clearanceConditionTableData[i]["clearanceCondition"];
	    if(test != null){
            var clearanceCondition = test["name"];
            var clearanceConditionId = clearanceConditionTableData[i]["id"];
            if(clearanceConditionId != $("#clearanceConditionDetail").find("input[name='id']:hidden").val()
                    && clearanceCondition == $("#Text_clearanceCondition").val()) {
                result =  false;
                break;
            }
	    }
	}
	return result;
}

function deleteClearanceCondition(buildingId) {

$('#DeleteIdDetails').modal('hide');
	$
	.ajax({
		url : getContextPath()+"/app/Building/BuildingClearanceCondition/delete/"
		+ buildingId,
		data : "&id=" + buildingId,
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			var baseURL = getContextPath()
			+ "/app/Building/BuildingClearanceCondition/loadPage/"
			+ buildingId;

			loadBuildingClearanceConditionGrid();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			new PNotify({
	               title : "Error",
	               text : errorThrown,
	               type : "error",
	               pnotify_animate_speed : fadeOutduration,
	               opacity : .8
	           });
		}
	});
}

function openEditMode(action, id) {
	$.ajax({
		url : getContextPath()+"/app/Building/BuildingClearanceCondition/edit/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalClearanceCondition').html(jqXHR);
			$('#childModalWindowDoneButtonBuildingClearanceCondition').show();
			$('#editChild').show();

			$('#dialog-form-ClearanceConditionView').hide();
			$('#dialog-form-ClearanceConditionEdit').show();
			$('#dialog-form-ClearanceConditionNew').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			new PNotify({
	               title : "Error",
	               text : errorThrown,
	               type : "error",
	               pnotify_animate_speed : fadeOutduration,
	               opacity : .8
	           });
		}
	});
	$('#dialog-form-ClearanceCondition').modal('show');

}

function openViewMode(action, id) {
	$.ajax({
		url : getContextPath()+"/app/Building/BuildingClearanceCondition/view/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalClearanceCondition').html(jqXHR);
			$('#childModalWindowDoneButtonBuildingClearanceCondition').hide();
			$('#viewChild').show();

			$('#dialog-form-ClearanceConditionEdit').hide();
			$('#dialog-form-ClearanceConditionView').show();
			$('#dialog-form-ClearanceConditionNew').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			new PNotify({
	               title : "Error",
	               text : errorThrown,
	               type : "error",
	               pnotify_animate_speed : fadeOutduration,
	               opacity : .8
	           });
		}
	});
	$('#dialog-form-ClearanceCondition').modal('show');
}
