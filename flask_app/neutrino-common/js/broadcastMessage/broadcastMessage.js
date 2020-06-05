var codeValidFlag =true;


$(function() {


	$('#messageCode')
			.change(
					function() {
						var validationStatus = $("#messageCode").valid();
						if(!validationStatus){
							return false;
						}
						var code = $("#messageCode").val();
						if(code == ""){
							return false;
						}
						$.ajax({
									url : getContextPath()
											+ "/app/BroadcastMessage/checkMessageCode/"
											+ code,
									type : 'GET',
									success : function(data) {
										
										$('.codeAvailable').remove();
										$("#messageCode-control-group")
												.removeClass("error");
										$("#messageCode-control-group")
												.removeClass("success");
										
										if (data.status == "true") {
											codeValidFlag = true;
											$("#messageCode-control-group")
													.addClass("success");
											codeValidationStatus=data.message;
											notifyStatus(codeValidationStatus, "success");
										}else {
											codeValidFlag = false;
											setTimeout(function() {
														$("#messageCode-control-group").removeClass("success");
														$("#messageCode-control-group").addClass("error");
											}, 200);
											codeValidationStatus=data.message;
											notifyStatus(codeValidationStatus, "error");
										}
									},
									error : function(jqXHR, textStatus,
											errorThrown) {
										
										$('.codeAvailable').remove();
									}
								});
					});
	
	$('#priority')
	.change(
			function() {
				var validationStatus = $("#priority").valid();
				if(!validationStatus){
					return false;
				}
				var code = $("#priority").val();
				if(code == ""){
					return false;
				}
				$.ajax({
							url : getContextPath()
									+ "/app/BroadcastMessage/checkPriority/"
									+ code,
							type : 'GET',
							success : function(data) {
								
								$('.codeAvailable').remove();
								$("#priority-control-group")
										.removeClass("error");
								$("#priority-control-group")
										.removeClass("success");
								
								if (data.status == "true") {
									codeValidFlag = true;
									$("#priority-control-group")
											.addClass("success");
									codeValidationStatus=data.message;
									notifyStatus(codeValidationStatus, "success");
								}else {
									codeValidFlag = false;
									setTimeout(function() {
												$("#priority-control-group").removeClass("success");
												$("#priority-control-group").addClass("error");
									}, 200);
									codeValidationStatus=data.message;
									notifyStatus(codeValidationStatus, "error");
								}
							},
							error : function(jqXHR, textStatus,
									errorThrown) {
								
								$('.codeAvailable').remove();
							}
						});
			});
	
	
});





function validateForm(){
	var isFormValid = $("#masterForm").valid();
	
	
	
	
	 if(!codeValidFlag)
	{
		notifyStatus(codeValidationStatus, "error");
		isFormValid  = false;
	}
	return isFormValid;
	
	
}

function saveForm() 
{
	 var form = $("#masterForm");
	 if(!validateForm()){
		 return false;
	 }
	submitForm(form);
}

function saveAndSendForApproval(context) 
{
	 var masterID = document.getElementById("masterID").value;
	 var form = $("#masterForm")[0];
	 form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
	 if(!validateForm()){
		 return false;
	 }
	submitForm(form);
}


function submitForm(form){
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	enableDisabledFields();
	if (!$(".form").valid()){
		return false;
	}
	form.submit();
	$('body').modalmanager('loading'); 
}

function enableDisabledFields()
{
	jQuery('#messageCode').removeAttr("disabled");
	jQuery('#message').removeAttr("disabled");
	jQuery('#moduleId').removeAttr("disabled");
	jQuery('#priority').removeAttr("disabled");
	jQuery('#displayDuration').removeAttr("disabled");
	jQuery('#frequency').removeAttr("disabled");
	jQuery('#severity').removeAttr("disabled");
	
}


$(document).ready(function()
{
	if(codeViewMode == "true"){
		disableNonEditableField();
	}
});


function disableNonEditableField(){
	$("#messageCode").attr('readonly','readonly')
	$("#message").attr('readonly','readonly')
	$("#moduleId").attr('readonly','readonly')
	$("#priority").attr('readonly','readonly')
	$("#displayDuration").attr('readonly','readonly')
	$("#frequency").attr('readonly','readonly')
	$("#severity").attr('readonly','readonly')
	
}

var validStartAndEndDate= function(element)
{

var userPrefferedDateFormat = $('#datepicker_' + 'startDate').attr(
'data-date-format');

var startDate = formatDate(userPrefferedDateFormat, $('#startDate').val());
var expiryDate = formatDate(userPrefferedDateFormat, $('#endDate').val());

if(startDate==null || expiryDate==null)
return true;
var timeDiff = (expiryDate.getTime() - startDate.getTime());


return (timeDiff>=0 );
}
$.validator.addMethod("startAndEndDate", function(value,element) {

return validStartAndEndDate(element) ;

},"Till Date should be larger than From Date" );


var validateTime = function(element)
{

var startTimeArray = $('#startTime').val().split(':');
var startTimeInSeconds =  (+startTimeArray[0]) * 60 * 60 + (+startTimeArray[1]) * 60 ;
var endTimeArray = $('#endTime').val().split(':');
var endTimeInSeconds =  (+endTimeArray[0]) * 60 * 60 + (+endTimeArray[1]) * 60 ; 

if($('#startTime').val()=="" || $('#endTime').val()=="")
	return true;

return (endTimeInSeconds-startTimeInSeconds>0 || (endTimeInSeconds==0 && isEndDatelargerThanStartDate()));
	
}

$.validator.addMethod("validateTime", function(value,element) {

	return validateTime(element) ;

	},"Till Time should be larger than From Time" );

	

var validateTimeDateInput = function(element)
	{
	
	var userPrefferedDateFormat = $('#datepicker_' + 'startDate').attr(
	'data-date-format');
	
	if($('#startDate').val()=="" || $('#endDate').val()=="")
		return true;
		
		var userDate=formatDate(userPrefferedDateFormat, $('#startDate').val());
		var currentDate=new Date(Date.now());
		if(userDate.equals(currentDate.clearTime()))
		{
		var startTimeArray = $('#startTime').val().split(':');
		var startTimeInSeconds =  (+startTimeArray[0]) * 60 * 60 + (+startTimeArray[1]) * 60 ;
		var currentTime=new Date(Date.now());
		var currentTimeInSeconds=currentTime.getHours()*60*60+currentTime.getMinutes()*60;
		if($('#startDate').val() == $('#endDate').val())
		{
		if(currentTimeInSeconds>startTimeInSeconds)
			return false;
			
		}
		}
		return true;
		
	}

	$.validator.addMethod("validateTimeDateInput", function(value,element) {

		return validateTimeDateInput(element) ;

		},"Start time can't be in past" );
	

	function formatDate(dateFormat, date) {
	       var formattedDate;
	       switch (dateFormat) {
	       case 'MM/dd/yyyy':
	              formattedDate = new Date(String(date));
	              break;
	       case 'dd/MM/yyyy':
	              formattedDate = $.datepicker.parseDate("dd/mm/yy", date);
	              break;
	       case 'dd/mm/yyyy':
	              formattedDate = $.datepicker.parseDate("dd/mm/yy", date);
	              break;
	       default:
	              formattedDate = new Date(String(date));
	       }
	       return formattedDate;
	}
	
	var isEndDatelargerThanStartDate= function(element)
	{

	var userPrefferedDateFormat = $('#datepicker_' + 'startDate').attr(
	'data-date-format');

	var startDate = formatDate(userPrefferedDateFormat, $('#startDate').val());
	var expiryDate = formatDate(userPrefferedDateFormat, $('#endDate').val());

	if(startDate==null || expiryDate==null)
	return true;
	var timeDiff = (expiryDate.getTime() - startDate.getTime());


	return (timeDiff>0 );
	}
	


var validFrequency = function(element)
{


return ($('#frequency').val()%15==0 && $('#frequency').val()<=300);
	
}

$.validator.addMethod("validFrequency", function(value,element) {

	return validFrequency(element) ;

	},"Frequency should be in multiple of 15 minutes and should be less than 300 minutes" );




var validDisplayDuration = function(element)
{


return ($('#displayDuration').val()%10==0 && $('#displayDuration').val()<=60);
	
}

$.validator.addMethod("validDisplayDuration", function(value,element) {

	return validDisplayDuration(element) ;

	},"Display duration should be in multiple of 10 seconds and should be less than 60 seconds" );
	