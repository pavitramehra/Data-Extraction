var closingGroupsValidated=false;
var numberWithoutDecimal = function(value) {

	var numberWithoutDecimal = /^[0-9]+$/;

	return numberWithoutDecimal.test(value);

}

$.validator.addMethod("numberWithoutDecimal", function(value) {
	return numberWithoutDecimal(value);

}, "Please enter only digits");


function PopUpHelper(buttonType,dialogType){
	if(buttonType == undefined){
		buttonType = 'DEFAULT';
	}
	if(dialogType == undefined){
		dialogType = 'DEFAULT';
	}
	this.message='';
	this.title='';
	this.buttonType=buttonType;
	this.dialogType=dialogType;
	this.callback='';
	this.focusId='';
	this.ALERT_ERROR='ERROR';
	this.ALERT_WARN='WARN';
	this.ALERT_SUCCESS='SUCCESS';
	this.OK_BUTTON='OK';
	this.OK_CANCEL_BUTTON='OK_CANCEL';
	this.PARENT_WRAPPER_ID='contentwrapper';
}

var errorBasicRuleAlert = new PopUpHelper('OK','ERROR');

var errorMessageArray = [];
function setErrorMessage(messageCode,messageValue)
{
	errorMessageArray[messageCode] = messageValue;
}
function getErrorMessage(messageCode, messageArguments)
{      
              var message= errorMessageArray[messageCode];
              if(typeof messageArguments==='undefined'){
                    return message;
              }
              for(var index=0;index<messageArguments.length;index++){
                    var replaceableString='{'+index+'}';
                    while(message.indexOf(replaceableString)!=-1){
                           message=message.replace(replaceableString,messageArguments[index]);
                    }                          
              }
              
              return message;
}

PopUpHelper.prototype.showAlert=function(message,title,callback,focusId,okButtonLabel,cancelButtonLabel){

	if(okButtonLabel == undefined){
		okButtonLabel = null;
	}
	if(cancelButtonLabel == undefined){
		cancelButtonLabel = null;
	}
	
	if(message == undefined){
		message = null;
	}
	
	if(title == undefined){
		title = null;
	}
	
	if(focusId == undefined){
		focusId = null;
	}
	
	if(callback == undefined){
		callback = null;
	}
	
	
	if(okButtonLabel!="" && okButtonLabel!=null){
		jQuery('#errorAlertOk').val(okButtonLabel);
	}
	
	
	if(cancelButtonLabel!="" && cancelButtonLabel!=null){
		jQuery('#errorAlertCncl').val(cancelButtonLabel);
	}
	
	if(this.buttonType!="" && this.buttonType !=null)
	{	
		if(this.buttonType == this.OK_BUTTON)
		{
			jQuery('#errorAlertCncl').hide();
			jQuery('#errorAlertOk').show();
			
			
		}
		else if(this.buttonType == this.OK_CANCEL_BUTTON)
		{
			
			jQuery('#errorAlertCncl').show();
			jQuery('#errorAlertOk').show();
			

		}
		else
		{
			jQuery('#errorAlertCncl').hide();
			jQuery('#errorAlertOk').hide();
		}
	}
	else
	{
		jQuery('#errorAlertCncl').hide();
		jQuery('#errorAlertOk').hide();
	}
	
	if(this.dialogType!="" && this.dialogType !=null)
	{	
		jQuery("#errorModalHeader").removeClass("alert");
		jQuery("#errorModalHeader").removeClass("alert alert-danger");
		jQuery("#errorModalHeader").removeClass("alert alert-success");
		jQuery("#errorModalHeader").removeClass("modal-header");
		jQuery("#errorModalHeader").removeClass("alert-info");
		if(this.dialogType == this.ALERT_ERROR)
		{
			jQuery("#errorModalHeader").addClass("alert alert-danger");		
		}
		else if(this.dialogType == this.ALERT_WARN)
		{
			jQuery("#errorModalHeader").addClass("alert");
		}
		else if(this.dialogType == this.ALERT_SUCCESS)
		{
			jQuery("#errorModalHeader").addClass("alert alert-success");
		}
		else
		{
			jQuery("#errorModalHeader").addClass("alert alert-info");
		}
	}
	else
	{
		jQuery("#errorModalHeader").addClass("alert alert-info");
	}
	
	if(title!="" && title !=null)
	jQuery('#errorModalTitle').html(title); 
	else
	jQuery('#errorModalTitle').html('');	
	
	if(message!="" && message !=null)
	jQuery('#errorModalBody').html('<span><b>'+ message +'</b></span>');
	else
	jQuery('#errorModalBody').html('<span><b>No Message Found</b></span>');
	jQuery('#'+this.PARENT_WRAPPER_ID+' input,select').attr('tabindex',-1);

	jQuery('<div id="errorModalOkScript"></div>').appendTo('body');
	jQuery('<div id="errorModalCnclScript"></div>').appendTo('body');
	jQuery('<div id="errorModalCloseScript"></div>').appendTo('body');
	
	if(callback!="" && callback !=null)
	{
		jQuery('#errorModalOkScript').html("<script>jQuery('#errorAlertOk').click("+callback.ok+"); </"+"script>");
		jQuery('#errorModalCnclScript').html("<script>jQuery('#errorAlertCncl').click("+callback.cancel+"); </"+"script>");
	}
	else
	{
		jQuery('#errorModalOkScript').html("<script>jQuery('#errorAlertOk').click(function () {hideBasicRuleAlert('"+focusId+"','"+this.PARENT_WRAPPER_ID+"');}); </"+"script>");
		jQuery('#errorModalCnclScript').html("<script>jQuery('#errorAlertCncl').click(function () {hideBasicRuleAlert('"+focusId+"','"+this.PARENT_WRAPPER_ID+"');}); </"+"script>");
	}
	jQuery('#errorModalCloseScript').html("<script>jQuery('#errorAlertClose').click(function () {hideBasicRuleAlert('"+focusId+"','"+this.PARENT_WRAPPER_ID+"');}); </"+"script>");
		
	jQuery('#errorModal').modal({
			  backdrop: 'static',
			  keyboard: false
		});
	jQuery('#errorModal').on('shown.bs.modal',function(){
		jQuery('#errorAlertOk').focus();
	});
	
}

function hideBasicRuleAlert(focusId, parentWrapperId)
{

	jQuery('#errorModal').modal('hide');
	top.location.href = '#topPage';
	if(focusId!="" && focusId !=null)
	{
			var type = jQuery('#'+focusId).attr('type');
			if(type == undefined)
			{
				jQuery("#"+focusId+"_chosen").children('.chosen-drop').children('.chosen-search').children('input[type="text"]').focus();
			    jQuery("#"+focusId+"_chosen").addClass('chosen-container-active');	
			}
			else
			{
				jQuery('#'+focusId).focus();
			}
	}
	$('#errorModalOkScript').remove();
	jQuery('#errorAlertOk').unbind();
	jQuery('#errorModalCnclScript').remove();
	jQuery('#errorAlertCncl').unbind();
	jQuery('#errorModalCloseScript').remove();
	jQuery('#errorAlertClose').unbind();
	
	   jQuery('#'+parentWrapperId+' input:not(:disabled):not([readonly])').each(function() {
				
		 
		      jQuery(this).removeAttr('tabindex');
		 }); 
	   jQuery('#'+parentWrapperId+' select:not(:disabled))').each(function() {
		  
		      jQuery(this).removeAttr('tabindex');
		 }); 
	   
		
		 jQuery('#errorModal').css("display", "none");  
		 jQuery.uniform.update();
}

$(document).on('change','input[id^="Text_basicRuleParameterId_"]',function(){
	var attrId=$(this).attr('id');
	var numericString =attrId.replace(/[^0-9]/gi, ''); 
	var index = parseInt(numericString, 10); 
	var functionName = attrId.split("_").pop();
	
	
$('#Text_basicRuleParameterOperator_'+index+'_'+functionName).val('');
$('#Text_basicRuleParameterOperator_'+index+'_'+functionName).attr('disabled',true);
$('#Text_basicRuleParameterOperator_'+index+'_'+functionName).closest('div').removeClass('success');
$('#basicRuleParameterValueFrom_'+index+'_'+functionName).val('');
$('#basicRuleParameterValueFrom_'+index+'_'+functionName).attr('disabled',true);
$('#basicRuleParameterValueFrom_'+index+'_'+functionName).closest('div').removeClass('success');
$('#Text_basicRuleParameterValueFrom_'+index+'_'+functionName).val('');
$('#Text_basicRuleParameterValueFrom_'+index+'_'+functionName).attr('disabled',true);
$('#Text_basicRuleParameterValueFrom_'+index+'_'+functionName).closest('div').removeClass('success');
});



$(document).on('change','input[id^="basicRuleParameterValueFrom_"]',function(){
	var attrId=$(this).attr('id');
	var numericString =attrId.replace(/[^0-9]/gi, ''); 
	var index = parseInt(numericString, 10); 
	var functionName = attrId.split("_").pop();
	var temp=$('#basicRuleParameterValueFrom_'+index+'_'+functionName).val();
	if(temp!='0')
	$('#basicRuleParameterValueFrom_'+index+'_'+functionName).val(temp.replace(/^0+/, ''));
});


$(document).on('change','input[id^="Text_basicRuleParameterOperator_"]',function(){
	var attrId=$(this).attr('id');
	var numericString =attrId.replace(/[^0-9]/gi, ''); 
	var index = parseInt(numericString, 10); 
	var functionName = attrId.split("_").pop();
	$('#basicRuleParameterValueFrom_'+index+'_'+functionName).val('');
	  $('#basicRuleParameterValueFrom_'+index+'_'+functionName).attr('disabled',true);
	  $('#Text_basicRuleParameterValueFrom_'+index+'_'+functionName).val('');
	  $('#Text_basicRuleParameterValueFrom_'+index+'_'+functionName).attr('disabled',true);
});

$(document).on('change','input[id^="groupStart_"],input[id^="groupEnd_"]',function(){
	if($(this).prop('checked')){
		$(this).val(true);
	}
	else{
		$(this).val(false);
	}
});

function validateWhetherGroupStartMatchGroupEnd(eventTriggerer, functionName){
	var openBracketStack=[];
	var validateWhetherGroupStartMatchGroupEnd=true;
	if(!closingGroupsValidated){
		validateWhetherGroupStartMatchGroupEnd=validateValidParenthesis(openBracketStack, functionName);

		if(validateWhetherGroupStartMatchGroupEnd){
		if(openBracketStack.length>0){
			validateWhetherGroupStartMatchGroupEnd=false;
			var maxRowId = $('#'+functionName+' tr:last').attr('id').match(/\d/g);
			$('input[id^="groupStartGroupEndMismatchButton"]').attr('onclick','autoCorrectGroupEndMismatch('+eventTriggerer+','+openBracketStack.length+','+maxRowId+',\''+functionName+'\')');
			appendToConfirmationMessage(functionName);
			$('#groupStartGroupEndMismatch_'+functionName).modal('show');
		}
	}
	else{
		validateWhetherGroupStartMatchGroupEnd=false;
		errorBasicRuleAlert.showAlert(getErrorMessage('msg.groupStartGroupEndMismatch'),getErrorMessage('label.basicRule.Error'));
	}
	}
	return validateWhetherGroupStartMatchGroupEnd;
}

function appendToConfirmationMessage(functionName){
	if(functionName=='exitCriteria'){
		$("#groupStartGroupEndMismatch_"+functionName+" span").append(getMessage('label.forPreDelinquentAccountsClearanceCriteria'));
	} else if(functionName=='entryCriteria'){
		$("#groupStartGroupEndMismatch_"+functionName+" span").append(getMessage('label.forPreDelinquentAccountsEntryCriteria'));
	} else {
		$("#groupStartGroupEndMismatch_"+functionName+" span").append(getMessage('label.questionMark'));
	}
}

function validateValidParenthesis(openBracketStack, functionName){
var parenthesisValid=true;
for(var j=0;j<=basicRuleIndex;j++){
		if($('#basicRuleRow_'+j+'_'+functionName).find('input[id^=groupStart_]:checked').length==1){
			openBracketStack.push("(");
		}
		
		if($('#basicRuleRow_'+j+'_'+functionName).find('input[id^=groupEnd_]:checked').length==1){
if(openBracketStack.length==0){
	parenthesisValid=false;
return false;
}
else{
	openBracketStack.pop();
}
		}
		

}

	return parenthesisValid;
}

function closeGroupMismatchModal(functionName){
	$('#groupStartGroupEndMismatch_'+functionName).modal('hide');
	$("#groupStartGroupEndMismatch_"+functionName+" span").text(getMessage('label.groupStartGroupEndMismatch.confirmation'));
}

function autoCorrectGroupEndMismatch(eventTriggerer,remainingOpeningBracket,maxRowId,functionName){
		
	if(remainingOpeningBracket==1){
	$('#groupEnd_'+maxRowId+'_'+functionName).val(true);
		$('#groupEnd_'+maxRowId+'_'+functionName).prop('checked',true);
		$('#uniform-groupEnd_'+maxRowId+'_'+functionName).find('span').addClass("checked");
	}
	$('#groupStartGroupEndMismatch_'+functionName).modal('hide');
	$("#groupStartGroupEndMismatch_"+functionName+" span").text(getMessage('label.groupStartGroupEndMismatch.confirmation'));
	closingGroupsValidated=true;
	window[eventTriggerer]();
}

function getBasicRuleParameterOperators(ruleParameterIndex,functionName){
	
	var ruleParamId=$('#basicRuleParameterId_'+ruleParameterIndex+'_'+functionName).val();

	$.ajax({
		url : getContextPath() + "/app/basicRule/getBasicRuleParameterOperators/"+ruleParamId+"/"+ruleParameterIndex+"/"+functionName,
		async : true,
		type : "POST",
		success : function(jqXHR) {
		$('#basicRuleParameterOperatorDiv_'+ruleParameterIndex+'_'+functionName).html(jqXHR);
		}
	});	
}

function getGenericRuleParameterValue(ruleParameterIndex,functionName){
	
	var ruleParamId=$('#basicRuleParameterId_'+ruleParameterIndex+'_'+functionName).val();
	var operatorSelected=$('#Text_basicRuleParameterOperator_'+ruleParameterIndex+'_'+functionName).val();
	$.ajax({
		url : getContextPath() + "/app/basicRule/getBasicRuleParameterValueType/"+operatorSelected+"/"+ruleParamId+"/"+ruleParameterIndex+"/"+functionName,
		async : true,
		type : "POST",
		success : function(jqXHR) {
		$('#basicRuleParameterValuesDiv_'+ruleParameterIndex+'_'+functionName).html(jqXHR);
		}
	});	
}

function genericRuleAdditionalRow(transactionTypeId,sourceProductId,functionName){
	
	
	if(checkWhetherCriteriaBeenDefined(functionName)){
		basicRuleIndex++;
		$.ajax({
			url : getContextPath() + "/app/basicRule/basicRuleAdditionalRow/"+transactionTypeId+"/"+sourceProductId+"/"+basicRuleIndex+"/"+functionName,
			async : true,
			type : "POST",
			success : function(jqXHR) {
			$('#basicRuleContentDiv_'+functionName).append(jqXHR);
			}
		});		
	}
	else{
		
		errorBasicRuleAlert.showAlert(getErrorMessage('msg.mandatoryDetailsForRuleCriteria'),getErrorMessage('label.basicRule.Error'));

	}
}

function checkWhetherCriteriaBeenDefined(functionName){
	var criteriaDefined=true;
	$('tr[id^="basicRuleRow_"]').each(function(){
		var rowId=$(this).attr('id');
		var numericString =rowId.replace(/[^0-9]/gi, ''); 
		var rowIndex = parseInt(numericString, 10); 
		var basicRuleParameterValue=$('#basicRuleParameterId_'+rowIndex+"_"+functionName).val();
		var basicRuleParameterOperatorValue=$('#basicRuleParameterOperator_'+rowIndex+"_"+functionName).val();
		var basicRuleParameterValueFrom=$('#basicRuleParameterValueFrom_'+rowIndex+"_"+functionName).val();
		if(basicRuleParameterValue=='' || basicRuleParameterOperatorValue=='' || basicRuleParameterValueFrom==''){
			criteriaDefined= false;
		}
		if($('#basicRuleParameterCondition_'+rowIndex+"_"+functionName).length==1){
			var basicRuleParameterCondition=$('#basicRuleParameterCondition_'+rowIndex+"_"+functionName+' option:selected').val();
			if(basicRuleParameterCondition==''){
				criteriaDefined= false;
			}

		}
	});
	
	return criteriaDefined;
}

function deleteBasicRuleRow(basicRuleRowIndex,functionName){
	$('#basicRuleRow_'+basicRuleRowIndex+'_'+functionName).remove();
}

