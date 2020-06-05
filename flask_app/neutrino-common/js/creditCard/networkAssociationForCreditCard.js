
var lastRowIndex_network = parseInt($("#rowIndex").val());
var nextRowIndex_network = lastRowIndex_network + 1;


// adding new row
function  addnetworkAssocationDetail() {
	var newElement = $('tr#rownetworkAssocationDetailsDummy').clone().attr('id',
			'rownetworkAssocationDetails' + nextRowIndex_network);
	newElement.find('select#networkAssocation_id').attr({
		'id' : 'networkAssocation_id' + nextRowIndex_network,
		'name' : 'cardTypeAssociationList[' + nextRowIndex_network + '].id',
		'value' : ''

	});

	newElement.find('select#networkAssocation_networkGateway').attr({
		'id' : 'networkAssocation_networkGateway' + nextRowIndex_network,
		'name' : 'cardTypeAssociationList[' + nextRowIndex_network + '].networkGateway.id',
		'class':'required chosen_a',
		'value' : ''

	});
	newElement.find('select#networkAssocation_privilegeSet').attr({
		'id' : 'networkAssocation_privilegeSet' + nextRowIndex_network,
		'name' : 'cardTypeAssociationList[' + nextRowIndex_network + '].privilegeSet.id',
		'class':'chosen_a',
		'value' : ''

	});

	newElement.find('img#DeleteNetworkAssociationDetails').attr({
		'id' : 'DeleteNetworkAssociationDetails' + nextRowIndex_network,
		'onclick' : 'removenetworkAssocationDetail("0",' + nextRowIndex_network + ')'
	});

	/*
	 * var delImgId = '#DeleteIdDetails' + nextRowIndex_network; $(delImgId).bind("",);
	 */
	newElement.appendTo('table#creditCard_netwrorkAssociationDetails.table');
	
	var networkAssocation_networkGatewayID  = '#networkAssocation_networkGateway'+nextRowIndex_network;
	var networkAssocation_privilegeSetID  = '#networkAssocation_privilegeSet'+nextRowIndex_network;
	
	$(networkAssocation_networkGatewayID).trigger("chosen:updated");
	$(networkAssocation_privilegeSetID).trigger("chosen:updated");

	lastRowIndex_network++;
	nextRowIndex_network++;
eventsOnLoadCCType1();
}

function eventsOnLoadCCType1() {
	var gateway =      'select[id^=networkAssocation_networkGateway].chosen_a';
	var privilegeSet = 'select[id^=networkAssocation_privilegeSet].chosen_a';
	var listOnLoadId = [gateway,privilegeSet];
	executeOnLoad(listOnLoadId);
}
// deleting a row
function removenetworkAssocationDetail(delVal, delRowId) {

	$('#rownetworkAssocationDetails' + delRowId).remove();

}


