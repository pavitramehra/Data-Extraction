var currencyId = $('#currencyId').val();
var selectedValues = [];
var selectedChargeIds = '';
$(document).ready(function() {
	$("#Text_currencyId").blur(function() { 
		if (!$('#currencyId').val()) {
			resetTable();
			selectedChargeIds = '[id:1]';
			setChargeIds(selectedChargeIds);
		}
	});
	$(document).on('currencySelection','#currencyId', function() {
		if (currencyId != $("#currencyId").val()) { 
			currencyId = $("#currencyId").val();
			resetTable();
			if (currencyId) {
				setNewChages(currencyId);
			} else {
				selectedChargeIds = '[id:1]';
				setChargeIds(selectedChargeIds);
			}
		}
	});
	$(document).on('selectChargePayable0',"#chargePayable0",function(){

		$('#content_chargePayable0 .help-block').remove();
	});
	if ($('#treatmentType0 option:selected').attr("data-code") === COLLECTIBLE) {
		$('#add_event').hide();
	}else{
		if($('#computationMappingTable > tbody > tr').length >2){
			$("#treatmentType0 option[data-code='" + COLLECTIBLE + "']").hide();
			for (var i = 1; i < $('#computationMappingTable > tbody > tr').length - 1; i++) {
				if ($('#treatmentType' + i)) {
					$("#treatmentType"+i+" option[data-code='" + COLLECTIBLE + "']").remove();

				}
			}
		}
	}
	setNewChages(currencyId);
	$('#chargePayable0').addClass('required');
	$('#Text_chargePayable0').removeClass('nonMandatory');
	$('#content_chargePayable0').removeClass('nonMandatory');
});

function setHiddenCharge(mappingRow, chargeRow) {
	if ($("#chargeCheckBox" + mappingRow + "_" + chargeRow).prop("checked")) {
		$("#chargeInputBox" + mappingRow + "_" + chargeRow).val(
				$("#chargeCheckBox" + mappingRow + "_" + chargeRow).val());
		selectedValues.push($('#chargeCheckBox' + mappingRow + '_' + chargeRow)
				.val());
	} else {
		$("#chargeInputBox" + mappingRow + "_" + chargeRow).val('');
		selectedValues.remove($(
				'#chargeCheckBox' + mappingRow + '_' + chargeRow).val());
	}
}

function searchCharges(value, index) {
	$('#chargesTable' + index).empty();
	currencyId = $('#currencyId').val();
	$.ajax({
		url : getContextPath() + "/app/" + masterId
				+ "/searchChargeDefinitions/" + "/" + index,
		data : {
			currencyId : currencyId,
			searchParam : value
		},
		async : false,
		success : function(data) {
			$('#chargesTable' + index).html(data);
		}
	});
}

function showChargeDialog(rowIndex) {
	selectedValues = [];
	for (var i = 0; i < $('#chargesTable' + rowIndex + ' > tbody > tr').length - 1; i++) {
		if ($('#chargeCheckBox' + rowIndex + '_' + i).prop("checked")) {
			selectedValues
					.push($('#chargeCheckBox' + rowIndex + '_' + i).val());

		}
	}
	$('#chargeDefinitionDiv' + rowIndex).modal('show');
}

function closeChargeDialog(rowIndex) {
	$('#chargeDefinitionDiv' + rowIndex).modal('hide');
	selectedValues = [];
}

function closeChargeDialogAndReset(rowIndex) {
	closeChargeDialog(rowIndex);
}

function saveChargeDefinition(rowIndex) {
	var unSelectedIds = [];
	for (var i = 0; i < $('#chargesTable' + rowIndex + ' > tbody > tr').length - 1; i++) {
		if (!$('#chargeCheckBox' + rowIndex + '_' + i).prop("checked")) {
			unSelectedIds.push(i);
		}
	}
	$.ajax({
		url : getContextPath()
				+ "/app/AmountComputationPolicy/updateChargeDefinitions/"
				+ rowIndex,
		data : {
			selectedValuesId : selectedValues.toString()
		},
		async : false,
		success : function() {}
	});
	closeChargeDialog(rowIndex);
}

function validateRate(index) {
	var validateDefaultRate = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;
	if (validateDefaultRate.test($("#rateBased" + index).val())) {
		$("#rateBased" + index).closest('div .form-group').removeClass(
				"error");
		$("#rateBased" + index).closest('div .form-group').addClass(
				"success");
	} else {
		$("#rateBased" + index).closest('div .form-group').removeClass(
				"success");
		$("#rateBased" + index).closest('div .form-group').addClass("error");
		$("#rateBased" + index).val("");
	}
}

function showRateDialog(rowIndex) {
	$('#rateDefinitionDiv' + rowIndex).modal('show');
}

function closeRateDialog(rowIndex) {
	$('#rateDefinitionDiv' + rowIndex).modal('hide');
}

function saveRateDefinition(rowIndex) {
	if(!validateRateDefination(rowIndex)){
		return;
	}
	closeRateDialog(rowIndex);
}

function populateComputationMethod(rowIndex) {
	if (!$('#currencyId').val()) {
		$("#computationMethodType" + rowIndex)[0].selectedIndex = 0;
		printError("Please select currency.");
		$('#computationMethodType' + rowIndex)[0].selectedIndex = 0;
		$('#computationMethodDiv' + rowIndex).empty();
		$('#Text_chargePayable' + rowIndex).val('');
		$('#chargePayable' + rowIndex).val('');
		$('#Text_chargeReceivable' + rowIndex).val('');
		$('#chargeReceivable' + rowIndex).val('');
		$('#minimumAmount' + rowIndex).val('');
		$('#maximumAmount' + rowIndex).val('');
		return;
	}
	$('#computationMethodDiv' + rowIndex).empty();
	var currencyId = $('#currencyId').val();
	$
			.ajax({
				url : getContextPath() + "/app/" + masterId
						+ "/populateComputationMethod/"
						+ $('#computationMethodType' + rowIndex).val() + "/"
						+ rowIndex,
				data : {
					currencyId : currencyId
				},
				async : false,
				success : function(data) {
					$('#computationMethodDiv' + rowIndex).html(data);
				}
			});
}

function addAmountComputationMapping() {
	var rowIndex = nextRowIndex - 1;
	var error = false;
	for (var i = rowIndex; i >= 0; i--) {
		if ($('#treatmentType' + i).val() != undefined
				&& $('#computationMethodType' + i).val() != undefined) {
			if (Number($('#computationMethodType' + i).val()) < 1
					|| Number($('#treatmentType' + i).val()) < 1) {
				error = true;
			}
		}
	}
	if (error == true || error == "true") {
		printError('Select VAP Treatment and Computation Method for the mapping.');
	} else {
		$.ajax({
			url : getContextPath() + "/app/AmountComputationPolicy/addNewRow",
			data : {
				'nextRowIndex' : nextRowIndex
			},
			async : false,
			success : function(data) {
				$('#computationMappingTable > tbody > tr:last').after(data);
				$(
						"#treatmentType" + nextRowIndex + " option[data-code='"
								+ COLLECTIBLE + "']").remove();
				$("#treatmentType0 option[data-code='" + COLLECTIBLE + "']")
						.hide();
				$('#chargePayable' + nextRowIndex).addClass('required');
				$('#Text_chargePayable' + nextRowIndex).removeClass('nonMandatory');
				$('#content_chargePayable' + nextRowIndex).removeClass('nonMandatory');
				if($('#treatmentType'+nextRowIndex+' option:selected').attr("data-code") != UPFRONT){
					$('#Text_chargeReceivable'+nextRowIndex).prop("disabled", true);
					
				}
				
				nextRowIndex = nextRowIndex + 1;
			}
		});
	}
}

function removeAmountComputationPolicyMapping(rowIndex) {
	$.ajax({
		url : getContextPath() + "/app/AmountComputationPolicy/removeRow",
		data : {
			'rowIndex' : rowIndex
		},
		async : false,
		success : function(data) {
			if ($('#computationMappingTable > tbody > tr').length == 3) {
				$("#treatmentType0 option[data-code='" + COLLECTIBLE + "']")
						.show();
			}
			$('#rowAmountComutationPolicymapping' + rowIndex).remove();
		}
	});
}

function populateComputationMethodType(rowIndex) {
	$('#computationMethodType' + rowIndex).empty();
	$('#computationMethodDiv' + rowIndex).empty();
	$('#computationMethodType' + rowIndex).append($('<option>', {
		value : '',
		text : 'Select'
	}));
	var treatmentTypeId = $('#treatmentType' + rowIndex).val();
	if ($('#treatmentType' + rowIndex + ' option:selected').attr("data-code") == COLLECTIBLE) {
		$('#add_event').hide();
	} else {
		$('#add_event').show();
	}
	$.ajax({
		url : getContextPath() + "/app/" + masterId
				+ "/populateComputationMethodType",
		async : false,
		data : ({
			treatmentTypeId : treatmentTypeId,
			rowIndex : rowIndex
		}),
		success : function(items) {
			$.each(items, function(i, item) {
				$('#computationMethodType' + rowIndex).append($('<option>', {
					value : item.id,
					text : item.name
				}));
			});
			handleReceivableCharge(treatmentTypeId, rowIndex);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
}

function handleReceivableCharge(treatmentTypeId, rowIndex) {
	if ($('#treatmentType' + rowIndex + ' option:selected').attr("data-code") == UPFRONT) {
		$('#Text_chargeReceivable' + rowIndex).prop("disabled", false);
		$('#chargeReceivable' + rowIndex).addClass("required");
		$('#Text_chargeReceivable' + rowIndex).removeClass('nonMandatory');
		$('#content_chargeReceivable' + rowIndex).removeClass('nonMandatory');
		$('#upfront_star').show();        
	} else {
		$('#chargeReceivable' + rowIndex).val('');
		$('#Text_chargeReceivable' + rowIndex).prop("disabled", true);
		$('#Text_chargeReceivable' + rowIndex).val('');
		$('#chargeReceivable' + rowIndex).removeClass("required");
		$('#Text_chargeReceivable' + rowIndex).addClass('nonMandatory');
		$('#content_chargeReceivable' + rowIndex).addClass('nonMandatory');
		$('#upfront_star').hide();
	}
}

function validateMinAndnMax(rowIndex) {
	if (isNaN($('#minimumAmount' + rowIndex).val())) {
		$('#minimumAmount' + rowIndex).val("");
		$('#minimumAmount' + rowIndex).closest('div .form-group')
				.removeClass("success");
		$('#minimumAmount' + rowIndex).closest('div .form-group').addClass(
				"error");
		return;
	}
	if (isNaN($('#maximumAmount' + rowIndex).val())) {
		$('#maximumAmount' + rowIndex).val("");
		$('#maximumAmount' + rowIndex).closest('div .form-group')
				.removeClass("success");
		$('#maximumAmount' + rowIndex).closest('div .form-group').addClass(
				"error");
		return;
	}
	var minimum = Number($('#minimumAmount' + rowIndex).val());
	var maximum = Number($('#maximumAmount' + rowIndex).val());
	console.log("min :" + minimum + " max :" + maximum);
	console.log($('#maximumAmount' + rowIndex).val() != "");
	if ($('#maximumAmount' + rowIndex).val() != "") {
		if (minimum < maximum) {
			$('#minimumAmount' + rowIndex).closest('div .form-group')
					.removeClass("error");
			$('#minimumAmount' + rowIndex).closest('div .form-group')
					.addClass("success");
			setTwoDecimal($('#minimumAmount' + rowIndex));
			setTwoDecimal($('#maximumAmount' + rowIndex));
		} else {
			$('#minimumAmount' + rowIndex).val("");
			$('#minimumAmount' + rowIndex).closest('div .form-group')
					.removeClass("success");
			$('#minimumAmount' + rowIndex).closest('div .form-group')
					.addClass("error");
			setTwoDecimal($('#maximumAmount' + rowIndex));
		}
	} else {
		setTwoDecimal($('#minimumAmount' + rowIndex));
	}
}

function setTwoDecimal(input) {
	var num = 0;
	var n;
	if (input.val() == false) {
		num = 0;
		n = num.toFixed(2);
		input.val(n);
	} else {
		num = parseFloat(input.val());
		n = num.toFixed(2);
		input.val(n);
	}
}

function printError(error) {
	new PNotify({
		title : 'Error',
		text : error,
		type : 'error',
		pnotify_animate_speed : .8,
		opacity : 1
	});
}
function resetTable(hCurrencyId) {
	if ($("#currencyId").val() != hCurrencyId) {
		for (var i = 0; i < nextRowIndex; i++) {
			if ($('#treatmentType' + i).length > 0) {
				$('#computationMethodType' + i)[0].selectedIndex = 0;
				$('#computationMethodDiv' + i).empty();
				$('#Text_chargePayable' + i).val('');
				$('#chargePayable' + i).val('');
				$('#Text_chargeReceivable' + i).val('');
				$('#chargeReceivable' + i).val('');
				$('#minimumAmount' + i).val('');
				$('#maximumAmount' + i).val('');
			}
		}
	}
	currencyId = $("#currencyId").val();
}

function saveForm() {
	var isChecked = $("#create_another_master").prop('checked') ? true : false;

	var formTemp = $("#masterForm");
	$("#createAnotherMaster").val(isChecked);
	formTemp.submit();
	if (checkForDuplicateTreatmentType() && formTemp.valid()) {
		$('body').modalmanager('loading');
	}
}


function saveAndSendForApproval(context) {

	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	if (checkForDuplicateTreatmentType() && $(".form").valid()) {
		form.action = context + "/app/" + masterID
				+ "/saveAndSendForApproval";
		form.submit();
		$('body').modalmanager('loading');
	}
}


function setNewChages(currencyId){
	$.ajax({
		url : getContextPath() + "/app/" + masterId
				+ "/populateChargeByCurrency",
		async : false,
		data : ({
			currencyId : currencyId
		}),
		success : function(data) {
			setChargeIds(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$.ajax({
		url : getContextPath() + "/app/" + masterId
				+ "/populatePayableChargeByCurrency",
		async : false,
		data : ({
			currencyId : currencyId
		}),
		success : function(data) {
			setPayableChargeIds(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	
}

function setChargeIds(data){
	if(data=='{}'){
		data = '{id:0}';
	}
	selectedChargeIds = data;
	for (var i = 0; i < nextRowIndex; i++) {
		if ($('#content_chargePayable' + i).length) {
			$('#items_chargeReceivable'+i).val(data);
			$('#items_chargePayable'+i).val(data);
		}
	}
}

Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

function setPayableChargeIds(data){
	if(data=='{}'){
		data = '{id:0}';
	}
	selectedChargeIds = data;
	for (var i = 0; i < nextRowIndex; i++) {
		if ($('#content_chargePayable' + i).length) {
			$('#items_chargePayable'+i).val(data);
		}
	}
}

function validateRateDefination(index){
	var result = true;
	if($('#rateBased'+index).val() == ''){
		result = false;
		$('#rateBased'+index).parent().attr('class','form-group input-group input-group col-sm-6   error outset-shadow-focus clearfix');
		$('#rateBased'+index).parent().parent().attr('class','form-group error outset-shadow-focus clearfix');
	}else{
		$('#rateBased'+index).parent().attr('class','form-group input-group input-group col-sm-6');
		$('#rateBased'+index).parent().parent().attr('class','form-group');
	}
	if($('#computedOn'+index).val() == ''){
		result = false;
		$('#computedOn'+index).parent().attr('class','form-group input-group input-group col-sm-6   error outset-shadow-focus clearfix');
		$('#computedOn'+index).parent().parent().attr('class','form-group error outset-shadow-focus clearfix');
	}else{
		$('#computedOn'+index).parent().attr('class','form-group input-group input-group col-sm-6');
		$('#computedOn'+index).parent().parent().attr('class','form-group');
	}
	if(!result){
		new PNotify({
			title : error,
			text : "Please fill Computation Details completely.",
			type : error,
			pnotify_animate_speed : fadeOutduration,
			opacity : .8
		});
	}
	return result;
}

function checkForDuplicateTreatmentType()
{
	var unique = true;
	var duplicateCode = " ";
	$("#computationMappingTable").find(".treatmentTypeClass").each(function(){
		 var tempCode = $(this);
		 $("#computationMappingTable").find(".treatmentTypeClass").not(tempCode).each(function(){
				 if(($(this).val() == tempCode.val()) && tempCode.val() != "")
					 {
					 	unique = false;
					 	duplicateCode = $("option:selected", this).text();
					 	return false;
					 }
			 });
	});
			 if(!unique)
			 {
				 new PNotify({
						title : failure,
						text : "Duplicate Treatment Type: " + duplicateCode,
						type : error,
						pnotify_animate_speed : fadeOutduration,
						opacity : .8
					});

					return false;
			 }  
		 return true;
	  
}