var lastRowIndexForPC = parseInt($("#mappingCCRowIndex").val());

var nextRowIndexForPC = parseInt(lastRowIndexForPC + 1);
var deletedRecord_matrixPriorityNumber;
$(document).ready(function() {
	
    $('#addMappingRow').hover(function() { 
        $('#addMappingRow').tooltip({placement: 'right' });
  $('#addMappingRow').attr('data-original-title','Add Records');

 });

	
	
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
	
	$('body')
	.click(
			function() {
				for (i = 0; i < $(
						"table#PCMSetMappingTable.table  tr")
						.length; i++) {

					var newElement = $('table#PCMSetMappingTable.table  tr:eq('
							+ (i + 1) + ')');
					var mappingId = newElement
							.find(
									':input[id^="mappingId_"]')
							.val();

					//deleteRecord('${rowObject.id}','${rowStatus.count-1}');
					var reCreateOnclickStringForDelete = "deleteRow("+ i +")";
					if (mappingId) {
						reCreateOnclickStringForDelete = "deleteRecord('"
								+ mappingId
								+ "','"
								+ i + "');";
						//console.log(reCreateOnclickStringForDelete);
					}
					newElement.attr('rowid', i);
					newElement.attr('id',
							'data_row' + i);
					newElement
							.find(
									'select[name$=".pricingControlMatrix.id"]')
							.attr(
									{
										'id' : 'pricingControlmatrixSet'
												+ (i),
										'name' : 'cardTypeAssociationListForPCM['
												+ (i)
												+ '].pricingControlMatrix.id'
										
									});

					newElement
					.find(
							'select[name$=".rule.id"]')
					.attr(
							{
								'id' : 'cardTypeAssociation_rule'
										+ (i),

								'name' : 'cardTypeAssociationListForPCM['
										+ (i)
										+ '].rule.id'
							});


					newElement
							.find(
									'input[id^="cardTypeAssociationListForPCM_isdefaultPricingMatrix"]')
							.attr(
									{
										'id' : 'cardTypeAssociationListForPCM_isdefaultPricingMatrix'
												+ (i),
												
										'name' : 'cardTypeAssociationListForPCM['+ (i)+'].isdefaultPricingMatrix'
									});
					
					newElement
					.find(
							'input[id^="isdefaultPricingMatrix"]')
					.attr(
							{
								'id' : 'isdefaultPricingMatrix'
										+ (i),
										
								'name' : 'cardTypeAssociationListForPCM.isdefaultPricingMatrix',
								'onclick' : 'setDefaultPCMRule('+(i)+')'
							});

					newElement
							.find(
									'input[id^="cardTypeAssociationListForPCM_matrixPriorityNumber"]')
							.attr(
									{
										'id' : 'cardTypeAssociationListForPCM_matrixPriorityNumber'
												+ (i),
								
										'name' : 'cardTypeAssociationListForPCM['+ (i)+'].matrixPriorityNumber'
									});

					newElement
							.find('a[id^="up_arrow"]')
							.attr(
									{
										'id' : 'up_arrow'+ (i),
										'onclick' : 'upButtonClicked(this,' + "'" + (i) + "'" + ')',

									});

					newElement
							.find('a[id^="down_arrow"]')
							.attr(
									{
										'id' : 'down_arrow'+ (i),
										'onclick' : 'downButtonClicked(this,' + "'" + (i) + "'" + ')',

									});

					newElement
							.find(
									"button[id^='privilegeSetMapping']")
							.attr(
									{
										'id' : 'privilegeSetMapping'+ (i)+'_delete'
												,
										'value' : '  -  ',
										'onclick' : reCreateOnclickStringForDelete

									});
					//console.log(newElement);

				}
			//	reSetLink();
			});

});

function setDefaultPCMRule(index) {
	resetDisabledPCMRule();
	$("#cardTypeAssociation_rule"+index).attr('disabled', true).trigger("chosen:updated");
	$("#cardTypeAssociation_rule"+index).val("").trigger("chosen:updated");
//	textPCMRule.attr("disabled", "disabled").val('');
	$("#cardTypeAssociationListForPCM_isdefaultPricingMatrix"+index).val(true);
	//updateChosenTag(selectPCMRule);
}
function updateChosenTag(dd) {
	$(dd).trigger("chosen:updated");
}
function resetDisabledPCMRule() {
	var size = $("table#PCMSetMappingTable.table tbody tr").length;
	for (i = 0; i < (parseInt(size)); i++) {
		disabledRule=$("#cardTypeAssociation_rule"+i);
		$("#cardTypeAssociationListForPCM_isdefaultPricingMatrix"+i).val(false);
		if (disabledRule.attr("disabled") == 'disabled') {
			disabledRule.removeAttr("disabled").trigger("chosen:updated");;
			disabledRule.val("").trigger("chosen:updated");
			//updateChosenTag(selectPCMRule);
		}
	}
}

function upperButtonClicked(rowObjectClicked, indexSelected) {

	var rowId = $(rowObjectClicked).parent().parent().attr('id');
	jQuery($(rowObjectClicked).parent().parent()).prev().before(
			jQuery($(rowObjectClicked).parent().parent()));

	var selectedInitialPriority = $(
			"#cardTypeAssociationListForPCM_matrixPriorityNumber"
					+ indexSelected).val();
	var movedIndex = parseInt(indexSelected) - 1;
	var selectedNewPriority = $(
			"#cardTypeAssociationListForPCM_matrixPriorityNumber" + movedIndex)
			.val();
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + indexSelected)
			.val(" ");
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + indexSelected)
			.val(selectedNewPriority);
	var itsPriorityChanged = selectedInitialPriority;
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + movedIndex).val(
			" ");
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + movedIndex).val(
			itsPriorityChanged);

}

function downButtonClicked(rowObjectClicked, indexSelected) {

	jQuery($(rowObjectClicked).parent().parent()).next().after(
			jQuery($(rowObjectClicked).parent().parent()));
	var selectedInitialPriority = $(
			"#cardTypeAssociationListForPCM_matrixPriorityNumber"
					+ indexSelected).val();
	var movedIndex = parseInt(indexSelected) + 1;
	var selectedNewPriority = $(
			"#cardTypeAssociationListForPCM_matrixPriorityNumber" + movedIndex)
			.val();
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + indexSelected)
			.val(" ");
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + indexSelected)
			.val(selectedNewPriority);
	var itsPriorityChanged = selectedInitialPriority;
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + movedIndex).val(
			" ");
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber" + movedIndex).val(
			itsPriorityChanged);

}
$('#addMappingRow')
.click(
		function() {
	if ($("#mappingCCRowIndex").val() == "") {
		nextRowIndex = 0;
		$("#mappingCCRowIndex").val(nextRowIndex);
	}

	var newElement = $('tr#data_row_dummy').clone().attr('id',
			'data_row' + nextRowIndexForPC);

	newElement.find('select#pricingControlmatrixSet').attr(
			{
				'id' : 'pricingControlmatrixSet' + nextRowIndexForPC,
				'name' : 'cardTypeAssociationListForPCM[' + nextRowIndexForPC
						+ '].pricingControlMatrix.id',
				'class' : 'chosen_a'

			});

	newElement.find('select#cardTypeAssociation_rule').attr({
		'id' : 'cardTypeAssociation_rule' + nextRowIndexForPC,
		'name' : 'cardTypeAssociationListForPCM[' + nextRowIndexForPC + '].rule.id',
		'class' : 'chosen_a'

	});

	newElement.find('input#isdefaultPricingMatrix').attr({
		'id' : 'isdefaultPricingMatrix' + nextRowIndexForPC,
		'name' : 'cardTypeAssociationListForPCM['+ nextRowIndexForPC+'].isdefaultPricingMatrix',
		'onclick' : 'setDefaultPCMRule(' + nextRowIndexForPC + ')'
	});

	newElement.find('a#up_arrow').attr(
			{
				'id' : 'up_arrow' + nextRowIndexForPC,
				'onclick' : 'upperButtonClicked(this,' + "'" + nextRowIndexForPC
						+ "'" + ')',
				'index' : nextRowIndexForPC

			});
	newElement.find('a#down_arrow').attr({
		'id' : 'down_arrow' + nextRowIndexForPC,
		'onclick' : 'downButtonClicked(this,' + "'" + nextRowIndexForPC + "'" + ')',
		'index' : nextRowIndexForPC

	});

	newElement.find('button#privilegeSetMapping').attr({
		'id' : 'privilegeSetMapping' + nextRowIndexForPC + "_delete",
		'onclick' : 'deleteRecord(' + "'" + nextRowIndexForPC + "'" + ')'
	});

	newElement
			.find('input#cardTypeAssociationListForPCM_matrixPriorityNumber')
			.attr(
					{
						'id' : 'cardTypeAssociationListForPCM_matrixPriorityNumber'
								+ nextRowIndexForPC,
						'value' : nextRowIndexForPC,
						'name' : 'cardTypeAssociationListForPCM['
								+ nextRowIndexForPC + '].matrixPriorityNumber'
					});

	newElement.appendTo('table#PCMSetMappingTable.table');
	if (lastRowIndexForPC == 0) {
		$('#down_arrow' + lastRowIndexForPC).removeAttr("hidden");
		$('#up_arrow' + nextRowIndexForPC).removeAttr("hidden");
	} else {
		$('#down_arrow' + lastRowIndexForPC).removeAttr("hidden");
		$('#up_arrow' + nextRowIndexForPC).removeAttr("hidden");
		$('#up_arrow' + lastRowIndexForPC).removeAttr("hidden");
	}

	var pricingControlmatrixSetID = '#pricingControlmatrixSet' + nextRowIndexForPC;
	var cardTypeAssociation_ruleID = '#cardTypeAssociation_rule' + nextRowIndexForPC;

	$(pricingControlmatrixSetID).trigger("chosen:updated");
	$(cardTypeAssociation_ruleID).trigger("chosen:updated");

	lastRowIndexForPC++;
	nextRowIndexForPC++;
eventsOnLoadControlMatrix1();
});
function eventsOnLoadControlMatrix1() {
    var pricingcontrolmatrix =  '#PCMSetMappingTable' + " " + 'select[id^=pricingControlmatrixSet].chosen_a';
    var cardtypeassociation=  '#PCMSetMappingTable' + " " + 'select[id^=cardTypeAssociation_rule].chosen_a';
	var listOnLoadId = [pricingcontrolmatrix,cardtypeassociation];
    executeOnLoad(listOnLoadId);
}
function reSetLink(delRowId) {	

var size = $("table#PCMSetMappingTable tbody tr").length;
//console.log("size"+size);
//console.log("delRowId"+delRowId);
if(delRowId==0){
//	console.log($("#up_arrow" + parseInt(delRowId+1)).attr("hidden",true));
	$("#up_arrow" + parseInt(delRowId+1)).attr("hidden",true);
}
else if(delRowId==(size-1)){
//	console.log($("#down_arrow" + parseInt(delRowId-1)).attr("hidden",true));
	$("#down_arrow" + parseInt(delRowId-1)).attr("hidden",true);
}
lastRowIndexForPC--;
nextRowIndexForPC--;
for (i = 0; i < size; i++) {
if(($("#cardTypeAssociationListForPCM_matrixPriorityNumber"+i).val())>deletedRecord_matrixPriorityNumber){
	var newval=($("#cardTypeAssociationListForPCM_matrixPriorityNumber"+i).val())-1;
	$("#cardTypeAssociationListForPCM_matrixPriorityNumber"+i).val(newval);
}

}
       }

function deleteRecord(delVal,delRowId) {
	deletedRecord_matrixPriorityNumber=$("#cardTypeAssociationListForPCM_matrixPriorityNumber"+delRowId).val();
   // alert(delRowId);
		$
				.ajax({
					url : "deleteRowId/"
							+ delRowId,
					type : 'GET',
					async : false,
					
					success : function(jqXHR) {
						$('#data_row' + delRowId).remove();
						reSetLink(delRowId);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						alert(jqXHR + " : " + textStatus + " : "
								+ errorThrown);
					}
				});
		//$('#data_row' + index).remove();
		//reSetLink(index);
	} 

function deleteRow(delRowId) {
	//console.log("delRowId"+delRowId);
	deletedRecord_matrixPriorityNumber=$("#cardTypeAssociationListForPCM_matrixPriorityNumber"+delRowId).val();
	//console.log(deletedRecord_matrixPriorityNumber);
	$('#data_row' + delRowId).remove();
	//$(delRowId).parent().parent().remove();
	reSetLink(delRowId);
}
