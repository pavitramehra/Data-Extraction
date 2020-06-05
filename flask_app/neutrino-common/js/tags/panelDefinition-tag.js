function panelDefinitionTagScript(panelDefinitionTagScriptInput) {

	$(document).ready(function () {
		addFormContextData("uiMetaDataVo_" + panelDefinitionTagScriptInput.formKey_pd, panelDefinitionTagScriptInput.numberOfTableRows_pd);
	});

	function addFormContextData(formId, numberOfTableRows) {
		$("#" + formId).data("numberOfTableRows", numberOfTableRows);
	}

	var clonedDatePickerIds = [];

	// method added for explicit money formatting call as it was not working for cloned money object
	$("input[id ^= 'amount_']").on("change", function () {

		var id = $(this).attr("id");

		var value = id.substring(7, id.length + 1);

		formMoneyValue(value);
		formatCurrency(value, false);
	});

	function initializeClonedDatePicker(clonedDatePickerId, firstRowDatePickerElementId) {
		var minFieldValueHidden = $("#minFieldValueHidden_" + firstRowDatePickerElementId).val();
		var maxFieldValueHidden = $("#maxFieldValueHidden_" + firstRowDatePickerElementId).val();
		var defDateHidden = $("#defDateHidden_" + firstRowDatePickerElementId).val();
		var dateFormat = $("#dateFormatHidden_" + firstRowDatePickerElementId).val();

		initDatePickerTag(clonedDatePickerId, defDateHidden, minFieldValueHidden, maxFieldValueHidden, dateFormat, panelDefinitionTagScriptInput.viewMode_pd);
		bindOnChangeEvent(clonedDatePickerId, dateFormat, defDateHidden);
	}

}

function addNewRow(tableId, formKey) {
	var myObject = new Object();
	myObject.uiMetadataUri = $("#uiMetaDataVo_" + formKey).find("#formUri").val();
	var url = this.getContextPath() +
		"/app/FormDefinition/addDynamicFormTableRow";
	myObject.tableIndex = tableId;
	myObject.formComponentIndex = $("#uiMetaDataVo_" + formKey).data("numberOfTableRows");
	var masterFormId = $("#masterID").val();
	if(masterFormId) {
		myObject.masterId = masterFormId;
		myObject.uiMetadataUri = $("#uiMetaDataVo_" + formKey).find("[id*=formUri]").val();
	}
	jQuery.ajax({
		url: url,
		data: myObject,
		type: "POST",
		async: false,
		success: function (response) {
			if (response != null) {
				$("#table_" + tableId + "_" + formKey).find("tbody")
					.append("<tr></tr>");
				$("#table_" + tableId + "_" + formKey)
					.find("tbody tr:last").html(response);
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			handlingAjaxCommunicationError(xhr, textStatus, errorThrown,
				'', '');
		}
	});
	$("#uiMetaDataVo_" + formKey).data().numberOfTableRows++;
}

function deleteNewRow(elem) {
	$(elem).parents("tr").remove();
}