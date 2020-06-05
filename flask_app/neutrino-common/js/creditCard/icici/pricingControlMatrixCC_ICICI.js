var lastRowIndexForPC = parseInt($("#mappingCCRowIndex").val());

var nextRowIndexForPC = parseInt(lastRowIndexForPC + 1);

$(document).ready(function() {
	for (i = 0; i < listPCM_size; i++) {

		if (i == 0) {
			$("#down_arrow" + i).removeAttr("hidden");
		} else if (i == listPCM_size - 1) {
			$("#up_arrow" + i).removeAttr("hidden");
		} else {
			$("#down_arrow" + i).removeAttr("hidden");
			$("#up_arrow" + i).removeAttr("hidden");
		}

	}

});


function updateChosenTag(dd) {
	$(dd).trigger("chosen:updated");
}
function resetDisabledPCMRule() {
	var size = $("table#PCMSetMappingTable.table tbody tr").length;
	for (i = 0; i < (parseInt(size)); i++) {
		var selectPCMRule = $("table#PCMSetMappingTable tbody tr td").find(
				"div #cardTypeAssociation_rule" + i);
		if (selectPCMRule.attr("disabled") == 'disabled') {
			selectPCMRule.removeAttr("disabled");
			selectPCMRule.val('-1');
			updateChosenTag(selectPCMRule);
		}
	}
}

function addPrivilegeSetMappingRow(context) {
	var url = context + "/app/CreditCardType/ICICI/appendRowPCM" 
	var rowIndex = parseInt($("#mappingCCRowIndex").val());
	
	rowIndex = parseInt(rowIndex + 1);
	
	$.ajax({
		url : url,
		data:{"rowIndex":rowIndex},
		success : function(jqXHR) {
			$("#pcmBody").append(jqXHR);
			$("#mappingCCRowIndex").val(rowIndex);
		}
	});
}

function deleteRecord(index) {
	$('#data_row' + index).remove();

}