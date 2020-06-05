var lastRowIndexForSP = parseInt( $("#rowIndexForSP").val() );
var nextRowIndexForSP = lastRowIndexForSP + 1;

// adding new row
function addSpecificPrivilegeAssocationDetail() {
	var newElement = $('tr#rowSpDetailsDummy').clone().attr('id',
			'rowSpDetails' + nextRowIndexForSP);
	newElement.find('input#specificPrivilege_id').attr(
			{
				'id' : 'specificPrivilege_id' + nextRowIndexForSP,
				'name' : 'cardTypeAssociationListForPrivileges[' + nextRowIndexForSP
						+ '].id',
				'value' : ''
			});
	newElement.find('select#specificPrivilege_privilegeSet').attr(
			{
				'id' : 'specificPrivilege_privilegeSet' + nextRowIndexForSP,
				'name' : 'cardTypeAssociationListForPrivileges[' + nextRowIndexForSP
						+ '].privilegeSet.id',
				'class' : 'required chosen_a',
				'value' : ''

			});
	newElement.find('input#specificPrivilege__isRuleBased').attr(
			{
				'id' : 'specificPrivilege__isRuleBased' + nextRowIndexForSP,
				'name' : 'cardTypeAssociationListForPrivileges[' + nextRowIndexForSP
						+ '].isRuleBased',
				'value' : '',
				'onclick' : 'enableRulesBox(' + nextRowIndexForSP + ')'
			});
	newElement.find('select#specificPrivilege_rule').attr(
			{
				'id' : 'specificPrivilege_rule' + nextRowIndexForSP,
				'name' : 'cardTypeAssociationListForPrivileges[' + nextRowIndexForSP
						+ '].rule.id',
				'class' : 'required chosen_a',
				'disabled' : 'disabled',
				'value' : ''

			});
	newElement.find('img#DeleteSpecificPrivilegesDetails').attr({
		'id' : 'DeleteSpecificPrivilegesDetails' + nextRowIndexForSP,
		'onclick' : 'removespecificPrivilegesDetail("0",' + nextRowIndexForSP + ')'
	});

	/*
	 * var delImgId = '#DeleteIdDetails' + nextRowIndexForSP; $(delImgId).bind("",);
	 */
	newElement
			.appendTo('table#creditCard_specificPrivilegesAssociationDetails.table');
	
	var specificPrivilege_privilegeSetID  = '#specificPrivilege_privilegeSet'+nextRowIndexForSP;
	var specificPrivilege_ruleID  = '#specificPrivilege_rule'+nextRowIndexForSP;
	
	$(specificPrivilege_privilegeSetID).trigger("chosen:updated");
	$(specificPrivilege_ruleID).trigger("chosen:updated");

	lastRowIndexForSP++;
	nextRowIndexForSP++;
eventsOnLoadPrivilege1();
}

function eventsOnLoadPrivilege1() {
	var privilegeset =  '#specificPrivilegesAssociationList' + " " + 'select[id^=specificPrivilege_privilegeSet].chosen_a';
	var privilegeRule =  '#specificPrivilegesAssociationList' + " " + 'select[id^=specificPrivilege_rule].chosen_a';
	var listOnLoadId = [privilegeset,privilegeRule];		
	executeOnLoad(listOnLoadId);
}
// deleting a row
function removespecificPrivilegesDetail(delVal, delRowId) {
	$('#rowSpDetails' + delRowId).remove();

}

function enableRulesBox(rowId) {
	
	if ($("#specificPrivilege__isRuleBased" + rowId).is(":checked")) {
		
		$("#specificPrivilege__isRuleBased" + rowId).val(true);
		$("#specificPrivilege_rule" + rowId).removeAttr('disabled');
		$("#specificPrivilege_rule" + rowId).trigger("chosen:updated");
	} else {
		$("#specificPrivilege__isRuleBased" + rowId).val(false);
		$("#specificPrivilege_rule" + rowId).attr("disabled", "disabled");
		$("#specificPrivilege_rule" + rowId).trigger("chosen:updated");
	}
}


