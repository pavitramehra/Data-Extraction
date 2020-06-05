
$(document).ready(function() {

	if ($("#builderProjectId").val() != "" && $("#builderProjectId").val() != undefined) {
		builderProjectId = $("#builderProjectId").val();
		var contextPath = getContextPath();
	}

});

function loadBuilderProjectClearanceConditionTable() {
	var contextPath = getContextPath();
	$.ajax({
		url : contextPath + "/app/BuilderProject/ClearanceCondition/loadPage/"
		+ builderProjectId,
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#builderProjectClearanceConditionGrid').load(url, function() {
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
		url : contextPath + "/app/BuilderProject/ClearanceCondition/" + action,
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
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-ClearanceCondition').modal('show');
}

function closeDialogAccount() {
	$('#dialog-form-ClearanceCondition').modal('hide');
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
	if ($("#builderProjectId").val() != ""
		&& $("#builderProjectId").val() != undefined) {
		builderProjectId = $("#builderProjectId").val();
	}
	if ($("#clearanceConditionDetail").valid()) {
		if(checkDuplicates()) {
			var contextPath = getContextPath();
			$.ajax({
				type : "POST",
				url : contextPath + "/app/BuilderProject/ClearanceCondition/saveToGrid",
				data : $('#clearanceConditionDetail').serialize() + "&parentId="
				+ builderProjectId,
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
						copyPaymentPlan($("#builderProjectId").val(),response);
                        $("#builderProjectId").val(response);
                        builderProjectId = response;
						loadPaymentPlan(false);
                        var isChecked =$('body').find("#create_another_ClearanceCondition:visible").prop('checked');
                        if (isChecked) {
                            $('#dialog-form-ClearanceCondition.modal').modal('hide');
                        }
                        else {
                            $('#dialog-form-ClearanceCondition.modal').modal('hide');
                        }
                        var baseURL = contextPath
                        + "/app/BuilderProject/ClearanceCondition/loadPage/"
                        + builderProjectId;
                        $('#builderProjectClearanceConditionGrid').load(baseURL, function() {
                            if (isChecked) {
                                //to load grid and show builderProjectClearanceConditionGrid again
                                openDialogAccount('create',builderProjectId);
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

function deleteClearanceCondition(builderProjectId) {
	
$('#DeleteIdDetails').modal('hide');
		$
	.ajax({
		url : getContextPath()+"/app/BuilderProject/ClearanceCondition/delete/"
		+ builderProjectId,
		data : "&id=" + builderProjectId,
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			var baseURL = getContextPath()
			+ "/app/BuilderProject/ClearanceCondition/loadPage/"
			+ builderProjectId;

			loadBuilderProjectClearanceConditionGrid();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
}

function openEditMode(action, id) {
	$.ajax({
		url : getContextPath()+"/app/BuilderProject/ClearanceCondition/edit/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalClearanceCondition').html(jqXHR);
			$('#childModalWindowDoneButtonClearanceCondition').show();
			$('#create_another_ClearanceCondition').removeAttr("disabled");
			$('#create_another_div_ClearanceCondition').show();
			$('#editChild').show();

			$('#dialog-form-ClearanceConditionView').hide();
			$('#dialog-form-ClearanceConditionEdit').show();
			$('#dialog-form-ClearanceConditionNew').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-ClearanceCondition').modal('show');

}

function openViewMode(action, id) {
	$.ajax({
		url : getContextPath()+"/app/BuilderProject/ClearanceCondition/view/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalClearanceCondition').html(jqXHR);
			$('#childModalWindowDoneButtonClearanceCondition').hide();
			$('#create_another_ClearanceCondition').attr("disabled",true);
			$('#create_another_div_ClearanceCondition').hide();
			$('#viewChild').show();

			$('#dialog-form-ClearanceConditionEdit').hide();
			$('#dialog-form-ClearanceConditionView').show();
			$('#dialog-form-ClearanceConditionNew').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-ClearanceCondition').modal('show');
}

function closeChildDialogCC(masterId) {
	$('#dialog-form-ClearanceCondition').modal('hide');
}