if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, pos) {
            pos = !pos || pos < 0 ? 0 : +pos;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}


if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

var externalBankId = 0;
var viewMode = viewMode;
$(function() {
	
	
	if ($("#id").val() != "" && $("#id").val() != undefined) {
		externalBankId = $("#id").val();
	}
	if(viewMode == ""){
		viewMode = false;
	}
	var baseURL = getContextPath() + "/app/ExternalBank/" + childId
			+ "/loadPage/" + externalBankId +"/"+viewMode;
	// load content for first tab and initialize
	$('#ExternalBankBranchDiv').load(baseURL, function() {
		$('#childTabs').tab(); // initialize tabs
	});
	$('#childTabs').bind('show.bs.tab', function(e) {
		var pattern = /#.+/gi // use regex to get anchor(==selector)
		var contentID = e.target.toString().match(pattern)[0]; // get anchor
		// load content for selected tab
		$(contentID).load(baseURL, function() {
			$('#childTabs').tab(); // reinitialize tabs
		});
	});
});

function createExternalBankBranch() {
	
	$('#childModalWindowDoneButtonExternalBankBranch').show();

	$('#create_another_ExternalBankBranch').removeAttr("disabled");
	$
			.ajax({

				url : getContextPath() + "/app/" + parentid + "/" + childId
						+ "/create",
				type : 'POST',
				async : false,
				data : $('#masterForm').serialize(),
				success : function(jqXHR) {
					$('#childModal' + childId).html(jqXHR);
					$('#dialog-form-' + childId).modal('show');
					var myTime=setTimeout(function(){
                        $("#bankCode").focus();
                        clearTimeout(myTime);
					},500);

				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});

}


$.validator.addMethod("lenGTminLenSW", function(value,element) {
	if(typeof value != "undefined" && value != null && value!='')
		return lenGTminLenSW(value,element);
	return true;
}, "StartWith should be less than MinLength");

var lenGTminLenSW = function(value,element){
	var elementId = $(element).attr('id');
	var ind = elementId.charAt(elementId.length-1);
	if($("#extBank_length_"+ind).val()=='')
		return true;
	var maxLengthStartWith = findMaxLengthForGivenElement(ind,'extBank_startsWith_');
	var minLengthForLengthExp = findMinLengthForGivenElement(ind,'extBank_length_');
	if(maxLengthStartWith != 0 && minLengthForLengthExp != 0){
		return maxLengthStartWith<minLengthForLengthExp;
	}
	return true;
}


$.validator.addMethod("lenGTminLenEW", function(value,element) {
	if(typeof value != "undefined" && value != null && value!='')
		return lenGTminLenEW(value,element);
	return true;
}, "EndsWith should be less than MinLength");

var lenGTminLenEW = function(value,element){
	var elementId = $(element).attr('id');
	var ind = elementId.charAt(elementId.length-1);
	if($("#extBank_length_"+ind).val()=='')
		return true;
	var maxLengthEndWith = findMaxLengthForGivenElement(ind,'extBank_endsWith_');
	var minLengthForLengthExp = findMinLengthForGivenElement(ind,'extBank_length_');
	if(maxLengthEndWith != 0 && minLengthForLengthExp != 0){
		return maxLengthEndWith<minLengthForLengthExp;
	}
	return true;
}


$.validator.addMethod("totalLenWithSWEW", function(value,element) {
	if(typeof value != "undefined" && value != null && value!='')
		return totalLenWithSWEW(value,element);
	return true;
}, "StartWith+EndsWith should be less than MinLength");

function totalLenWithSWEW(value,element){
	var elementId = $(element).attr('id');
	var ind = elementId.charAt(elementId.length-1);
	if($("#extBank_length_"+ind).val()=='')
		return true;
	var maxLengthStartWith = findMaxLengthForGivenElement(ind,'extBank_startsWith_');
	var maxLengthEndWith = findMaxLengthForGivenElement(ind,'extBank_endsWith_');
	var minLengthForLengthExp = findMinLengthForGivenElement(ind,'extBank_length_');
	if(maxLengthStartWith != 0 && maxLengthEndWith != 0 && minLengthForLengthExp != 0){
		return (maxLengthStartWith+maxLengthEndWith)<minLengthForLengthExp;
	}
	return true;
}

function findMaxLengthForGivenElement(index,elemId){
	var maxValue = 0;
	var valueOfExp = $("#"+elemId+index).val();
	if(validExpForStr(valueOfExp)==true){
		var valueArray = valueOfExp.split(',');
		for(i=0;i<valueArray.length;i++){
			if(valueArray[i].length > maxValue)
				maxValue = valueArray[i].length;
		}
	}
	return maxValue;
}

function findMinLengthForGivenElement(index,elemId){
	var minValue = 0;
	var valueOfLengthExp = $("#"+elemId+index).val();
	if(validExpForRange(valueOfLengthExp)){
		var valueArray = valueOfLengthExp.split(',');
		for(i=0;i<valueArray.length;i++){
			if(valueArray[i].includes('-')){
				if(parseInt(valueArray[i].split('-')[0])< minValue || minValue == 0)
					minValue = parseInt(valueArray[i].split('-')[0]);
			} else {
				if(parseInt(valueArray[i]) < minValue || minValue == 0)
					minValue = parseInt(valueArray[i]);
			}
		}
	}
	return minValue;
}

$.validator.addMethod("checkForDuplicateRange", function(value,element) {
	if(typeof value != "undefined" && value != null && value!='')
		return checkForDuplicateRange(value);
	return true;
}, "Duplicate range/number for Account Number.");

var checkForDuplicateRange = function(value){
	if(validExpForRange(value)==true){
		var valueArray = value.split(',');
		if(valueArray.length == 1)
			return true;
		for(i=0;i<valueArray.length;i++){
			if(isDuplicateLength(valueArray[i],valueArray,i))
				return false;
		}
	}
	return true;
}

function isDuplicateLength(value,valueArray,index){
	var isDuplicate = false;
	if(value.includes('-')){
		for(i=0;i<valueArray.length;i++){
			if(i != index){
				if(valueArray[i].includes('-')){
					if((parseInt(value.split('-')[0])>=valueArray[i].split('-')[0] && parseInt(value.split('-')[0])<=valueArray[i].split('-')[1]) ||
							(parseInt(value.split('-')[1])>=valueArray[i].split('-')[0] && parseInt(value.split('-')[1])<=valueArray[i].split('-')[1]))
						isDuplicate = true;
				} else{
					if(parseInt(valueArray[i])==parseInt(value.split('-')[0]) || parseInt(valueArray[i])==parseInt(value.split('-')[1]))
						isDuplicate = true;
				}
			}
		}
	} else {
		for(i=0;i<valueArray.length;i++){
			if(i != index){
				if(valueArray[i].includes('-')){
					if(parseInt(value)>=valueArray[i].split('-')[0] && parseInt(value)<=valueArray[i].split('-')[1])
						isDuplicate = true;
				} else{
					if(parseInt(valueArray[i])==parseInt(value))
						isDuplicate = true;
				}
			}
		}
	}
	return isDuplicate;
}


var alhpanumWithComma = function(value) {
	var regexAlhpanumWithComma = new RegExp("^["+allowedAlphaCharSet+"0-9\\, ]+$");
	return regexAlhpanumWithComma.test(value);
}

$.validator.addMethod("alhpanumWithComma", function(value,
		element) {
	if(typeof value != "undefined" && value != null && value!=''){
		return alhpanumWithComma(value);
	}else{
		return true;
	}

},"Please Enter Only alphabets, digits or comma.");

var digitsWithCommaAndHpn = function(value) {
	var regexForDigitsWithCommaAndHpn = /^[0-9\-, ]+$/;
	return regexForDigitsWithCommaAndHpn.test(value);
}

$.validator.addMethod("digitsWithCommaAndHpn", function(value,
		element) {
	if(typeof value != "undefined" && value != null && value!=''){
		return digitsWithCommaAndHpn(value);
	}else{
		return true;
	}

},"Please Enter Only digits,comma or Hiphen.");

var characterWithComma = function(value) {
	var regexForCharacterWithComma = new RegExp("^["+allowedAlphaCharSet+"\\, ]+$","i");;
	return regexForCharacterWithComma.test(value);
}

$.validator.addMethod("characterWithComma", function(value,
		element) {
	if(typeof value != "undefined" && value != null && value!=''){
		return characterWithComma(value);
	}else{
		return true;
	}

},"Please enter only Character or Character separated by comma.");

var digitsWithComma = function(value) {
	var regexForDigitsWithComma = /^[0-9\, ]+$/;
	return regexForDigitsWithComma.test(value);
}

$.validator.addMethod("digitsWithComma", function(value,
		element) {
	if(typeof value != "undefined" && value != null && value!=''){
		return digitsWithComma(value);
	}else{
		return true;
	}

},"Please enter only digits or digits separated by comma.");

//validExpForStr

var validExpForStr = function(value) {
	if(value.startsWith(',') || value.endsWith(','))
		return false;
	var valueArray = value.split(',');
	for(i=0;i<valueArray.length;i++){
		if(valueArray[i]=="")
			return false;
	}
	return true;	
}

$.validator.addMethod("validExpForStr", function(value,
		element) {
	if(typeof value != "undefined" && value != null && value!='')
		return validExpForStr(value);
	return true;

},"Not a valid expression.");

//validExpForRange

var validExpForRange = function(value) {
	if(value.startsWith(',') || value.endsWith(',') || value.startsWith('-') || value.endsWith('-'))
		return false;
	var valueArray = value.split(',');
	for(i=0;i<valueArray.length;i++){
		if(valueArray[i]=="")
			return false;
		if(valueArray[i].includes('-')){
			if(valueArray[i].split('-').length != 2)
				return false;
			if(jQuery.inArray("",valueArray[i].split('-')) != -1)
				return false;
			if(parseInt(valueArray[i].split('-')[0]) >= parseInt(valueArray[i].split('-')[1]))
				return false;
		}
	}
	for(i=0;i<valueArray.length;i++){
		if(valueArray[i].includes('-')){
			if(parseInt(valueArray[i].split('-')[0])==0 || valueArray[i].split('-')[1]==0)
				return false;
		} else{
			if(parseInt(valueArray[i])==0)
				return false;
		}
	}
	return true;	
}

$.validator.addMethod("validExpForRange", function(value,
		element) {
	if(typeof value != "undefined" && value != null && value!='')
		return validExpForRange(value);
	return true;

},"Not a valid expression.");

function saveForm() {
	
	if($(".form").valid()){
		if(checkforDuplicateAccTypeRow() == true){
			new PNotify({
				title : "Error",
				text : "Duplicate Row found for Account Type,Please use comma seprated values.",
				type : "failure",
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
			return;
		}
	} else {
		return;
	}
	
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	var form = document.getElementById("masterForm");
	
	if(form==null) {
		new PNotify({
			title : 'error',
			text : 'Please fill required fields',
			type : 'error',
			pnotify_animate_speed : .8,
			opacity : 1
		});
		
	}
	else {
		$("#createAnotherMaster").val(isChecked);
		if($(".form").valid()){
			showOverlayLoader();
			form.submit();
		}
	}
}

function saveAndSendForApproval(context) {
	
	if($(".form").valid()){
		if(checkforDuplicateAccTypeRow() == true){
			new PNotify({
				title : "Error",
				text : "Duplicate Row found for Account Type,Please use comma seprated values.",
				type : "failure",
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
			return;
		}
	} else {
		return;
	}
	
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	if(form==null) {
		new PNotify({
			title : 'error',
			text : 'Please fill required fields',
			type : 'error',
			pnotify_animate_speed : .8,
			opacity : 1
		});
	}
	else if ($(".form").valid()){
		form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
		showOverlayLoader(); 
		form.submit();
	
	}
}

function checkforDuplicateAccTypeRow(){
	var accTypeArray = [];
	var duplicate = false;
	$("select[id^=ext_Bank_Acc_TypeId_]").each(function(){
		var id = $(this).attr('id');
		var accType = $('#'+id+' option:selected').attr('data-code');
		if(jQuery.inArray(accType, accTypeArray) == -1)
			accTypeArray.push(accType);
		else
			duplicate =  true;
	});
	return duplicate;
}

function copyValuesFromPrevRow(index){
	if(index==0)
		return;
	var copyIndex = parseInt(index)-1;
	//$('#ext_Bank_Acc_TypeId_'+index+' option[value="'+$("#ext_Bank_Acc_TypeId_"+copyIndex).val()+'"]').prop('selected', true);
	$('#ext_Bank_AccNum_TypeId_'+index+' option[value="'+$("#ext_Bank_AccNum_TypeId_"+copyIndex).val()+'"]').prop('selected', true);
	$("#extBank_startsWith_"+index).val($("#extBank_startsWith_"+copyIndex).val());
	$("#extBank_endsWith_"+index).val($("#extBank_endsWith_"+copyIndex).val());
	$("#extBank_length_"+index).val($("#extBank_length_"+copyIndex).val());
}


function saveToSession() {
	if(bankingLocationActiveFlag() == false){
				return false;
	}	
	var isChecked = $("input#create_another_ExternalBankBranch:visible").prop('checked') ? true : false;
	if ($("#externalBankBranchForm").valid()) {
		
		var micrcode=$("#externalBankBranchForm").find("input#micrCode").val();    
        
        
        if(micrcode && micrcode!=null)
        {
              var location=$("#externalBankBranchForm").find("input#Text_external_banking_loaction").val();
              console.log("loaction = "+location);
              if(!location || location == null)
              {      
  				if(!$("#micrCode").parent().hasClass('error'))
				{
  					$("#micrCode").each(function() 
				 {				  
					
						 if( !$(this).parent().hasClass('error'))
							 {
							 $(this).parent().removeClass('success')
						 	$("#micrCode").after("<span id='micrmsg' generated='true'  class='help-block color-red' >Banking Location is mandatory if MICR code is entered.</span>");
							 $.sticky(error_message, {
									autoclose : 5000,
									position : "top-right",
									type : "st-error"
								});
							 }
						 $("#micrCode").parent().addClass('error');
					
				 });
				}
				/*new PNotify({
					title : 'error',
					text : some_errror_occured,
					type : 'error',
					opacity : .8
				});*/
			       //$("#externalBankBranchForm").find("input#micrCode").next().html("<div class = 'col-sm-6 MICR'> Banking Location is mandatory if MICR code is enteredt<div>");
			           return;
              }
       }
        else
        {
        $("#externalBankBranchForm").find("div.MICR").remove();
        }

        var emptySubpayment = false;
		if($('#supportedSubPayments').val().length == 0)
			emptySubpayment = true;
		
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/" + parentid + "/" + childId
					+ "/validationOnExternalBankBranch",
			data : $('#externalBankBranchForm').serialize() + "&parentId="
					+ externalBankId+ "&emptySubpayment="
					+ emptySubpayment,
			async : false,
			success : function(result) {				
				if (!isNaN(result)) {
					$("#id").val(result);
					externalBankId = result;
					closeChildDialog(childId);
					$('#dialog-form-' + childId).modal("hide");
					/*var baseURL = getContextPath() + "/app/" + parentid + "/"
							+  "/edit/" + externalBankId;
					neutrinoNavigateTo(baseURL);*/
					var baseURL = getContextPath() + "/app/" + parentid + "/"+masterId 
					+  "/loadPage/" + externalBankId+"/false";
					$('#ExternalBankBranchDiv').load(baseURL, function() {
						$('#childTabs').tab(); // initialize tabs
						if(isChecked == true)
						 {
						  createExternalBankBranch();
						  isChecked=false;
						  }
					});
					// $("#externalBankBranchDiv").html(result);
					
				} else {

					$('#childModal' + childId).html(result);
					$('#dialog-form-' + childId).modal('show');
					// $("#SubIndustryDiv").html(result);
				}
			}
		});

	}
}