var screenId;
var masterEntity;
var screenCode;
$(document).ready(
		function() {
		//Check if the dynamic form is already rendered for the Master.
		if(!$('#'+dynamicFormMasterId+'_MasterDynamicForm').html()) {
				/* Check if the master is having any dynamic form or not. */
				var viewable = dynamicFormViewMode == "true" ? true : false;
				var editable = dynamicFormEditMode == "true" ? true : false;
				var viewOrEditMode = viewable || editable;
				getMasterDynamicFormData(dynamicFormMasterId, viewOrEditMode);
				if (screenId) {
					var entityUri = setEntityUriForViewAndEditMode(dynamicFormMasterId, viewable, editable);
					var dynamicFormDataObject = new DynamicFormObject(screenId, entityUri, pageContextPath, screenCode, false,
							viewable, null, null, dynamicFormMasterId);
					dynamicFormDataObject.show();
					
				}
			}
		});

function getMasterDynamicFormData(masterId, viewOrEditMode) {
	var url = pageContextPath + "/app/dynamicForm/getMasterDynamicFormData/" + masterId;
	$
			.ajax({
				type : 'Get',
				url : url,
				async : false,
				data: {
					viewOrEditMode : viewOrEditMode
						},
				success : function(response) {
					screenId = response.screenId;
					screenCode = response.screenCode;
					masterEntity = response.entityName;
				},
				error : function(xhr, textStatus, errorThrown) {
					handlingAjaxCommunicationError(xhr, textStatus,
							errorThrown, '', '');
				}

			});
}

function setEntityUriForViewAndEditMode(masterId, viewable, editable) {
	var entityUri = null;
	if (viewable == true || editable == true) {
		var pathName = window.location.pathname;
		var entityId = pathName.substring(pathName.lastIndexOf("/") + 1,
				pathName.length);
		
	}
	if (masterEntity && entityId) {
		entityUri = masterEntity + ":" + entityId;
	}
	return entityUri;
}