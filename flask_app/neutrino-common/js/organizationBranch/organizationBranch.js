//$(document).ready(function() {
//	$('#branchCode').blur(function() {
//		organziationBranchChanged();
//		
//	}		
//	);
//});
//
//function organziationBranchChanged() {
//	var branchCode= $("#branchCode").val().trim();
//	$('#branchCode-control-group').find(".help-block.availableOrNot").remove();
//	$("#branchCode-control-group").removeClass("error");
//	$("#branchCode-control-group").removeClass("success");
//	if(branchCode!=null && branchCode!=""){
//		$.ajax({
//			url : getContextPath()+"/app/OrganizationBranch/checkDuplicateBranchCode/"+branchCode,
//				type : 'GET',
//				async : false,
//				success : function(data) {
//					if (data=="Unavailable")
//						{
//						$('#branchCode').after('<span generated="true" for="branchCode" class="help-block availableOrNot">' + "Branch Code Alreay Exists"  + '</span>');
//						setTimeout(function(){ $("#branchCode-control-group").removeClass("success"); 
//						$("#branchCode-control-group").addClass("error"); },200);
//						
//						}
//					
//					
//				    },
//				error : function(jqXHR, textStatus, errorThrown) {
//					
//					
//				}
//			});
//	}
//	
//}
var openingTimeElementIdsArray = ["ot_mon","ot_tues","ot_wed","ot_thur","ot_fri","ot_sat","ot_sun","ot_eSat"];
var closingTimeElementIdsArray = ["ct_mon","ct_tues","ct_wed","ct_thur","ct_fri","ct_sat","ct_sun","ct_eSat"];

var lunchFromElementIdsArray = ["lf_mon","lf_tues","lf_wed","lf_thur","lf_fri","lf_sat","lf_sun","lf_eSat"];
var lunchToElementIdsArray = ["lt_mon","lt_tues","lt_wed","lt_thur","lt_fri","lt_sat","lt_sun","lt_eSat"];

var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Even Saturday"];
var message = "";

function checkDuplicateBranchCodeAndName(){
			$("div#branchCode-control-group .help-block").remove();
			$("div#name-control-group .help-block").remove();
			$
			.ajax({
				type : "POST",
				url : getContextPath()+"/app/OrganizationBranch/checkDuplicateBranchCodeAndName",
				data : $('#masterForm').serialize(),
				async:false,
				success : function(data) {
				for(var i =0;i<data.length;i++)
				{
					 var dupColName = data[i];
	                 if(dupColName=="branchCode"){
					   isDuplicateCodeFlag=true;
					 
					    	  $('#branchCode').after('<span  class="help-block" for="branchCode" id="dupCodeSpan">' + "Branch Code Alreay Exists"  + '</span>');
					    	
					   setTimeout(function(){ 
									$("#branchCode-control-group").removeClass("success"); 
									$("#branchCode-control-group").addClass("error outset-shadow-focus clearfix"); 
								},200);
					
							
					   }
				      if(dupColName=="name"){
				    	  isDuplicateNameFlag=true;
				    	
					    	  $('#name').after('<span  class="help-block" for="name" id="dupNameSpan">' + "Branch Name Alreay Exists"  + '</span>');
					    	
							setTimeout(function(){ 
								
									$("#name-control-group").removeClass("success"); 
									$("#name-control-group").addClass("error outset-shadow-focus clearfix"); },200);
							
					
				
				      }
				      if(dupColName=="organizationType"){
						   isMultiheadofficeFlag=true;
; 
						    	  $('#OrganizationType').after('<span  class="help-block" for="OrganizationType" id="dupOrganizationTypeSpan">' + "Head Office Alreay Exists"  + '</span>');
						    	
						   setTimeout(function(){ 
										$("#organizationtype-control-group").removeClass("success"); 
										$("#organizationtype-control-group").addClass("error outset-shadow-focus clearfix"); 
									},200);
						
								
						   }
				 
	             }
				  if(data.length==0){
					 isDuplicateNameFlag=false;
					 isDuplicateCodeFlag=false;
					 isMultiheadofficeFlag=false;
					}
				 }
			});
			
	}

(function(){
	$(document).ready(function(){
		$.validator.addMethod("duplicateModule", function(value, element) {
			return !($("#moduleNameCAS").val()==$("#moduleNameLMS").val());
		},error_organization_module_duplicate);

	})
})()

function addValidatorsForDailyScheduleTimings(){
	
	$.validator.addMethod(
				"time",
		        function(value, element) {
					
					var openingTimeValue;
					var closingTimeValue;
					var day = "";			
					var elementId = $(element).attr("id");

					for(var i=0;i<=days.length;i++){
						if(elementId == openingTimeElementIdsArray[i]){ 
							closingTimeValue = $("#"+closingTimeElementIdsArray[i]).val();
							openingTimeValue = value;
							day = days[i];
							break;
						}else if(elementId == closingTimeElementIdsArray[i]){
							openingTimeValue = $("#"+openingTimeElementIdsArray[i]).val();
							closingTimeValue = value;
							day = days[i];
							break;
						}
					}
					
		        	if(openingTimeValue != "" && closingTimeValue != ""){
		        		var openingTime = getTime(openingTimeValue);
			        	var closingTime = getTime(closingTimeValue);

			        	if (openingTime >= closingTime){			        	    
			        	    message = day+" closing time should be greater than "+day+" opening time";
				        	return false;
			        	}
		        	}else if(openingTimeValue == "" || closingTimeValue == "" ){
		        		 message = day+" opening time and closing time can not be empty";
		        		 return false;
		        	}
		        			        			        			        		        	
	        	    return validationsForLunchTimings(value, elementId);
		        	
		        },function(params, element) {		        	
		        	$.sticky(
		        			message,
							{
								autoclose : 5000,
								position : "top-right",
								type : "st-error"
					});
		        	
		        	return  message;
		        });
}

function validationsForLunchTimings(value, elementId){
	
	var lunchFrom;
	var lunchTo;
	var index ;
	var day="";

	for(var i=0;i<=days.length;i++){
		if(elementId == lunchFromElementIdsArray[i] ){ 
			lunchTo = $("#"+lunchToElementIdsArray[i]).val();
			lunchFrom = value;
			day = days[i];
			index = i;
			break;
		}else if(elementId == lunchToElementIdsArray[i]){ 
			lunchFrom = $("#"+lunchFromElementIdsArray[i]).val();
			lunchTo = value;
			day = days[i];
			index = i;
			break;
		}
	}
		
	var openingTime = openingTimeElementIdsArray[index];
	var closingTime = closingTimeElementIdsArray[index];

	var openingTimeValue =  getTime($("#"+openingTime).val());
	var closingTimeValue =  getTime($("#"+closingTime).val());
	
	if(lunchFrom != "" && lunchTo != "" ){		
		var lunchFromValue = getTime(lunchFrom);
		var lunchToValue = getTime(lunchTo);
		
		if(lunchFromValue <= openingTimeValue || lunchFromValue >= closingTimeValue){
			message = day+" lunch from time should be in between "+ day +" opening and closing time";
			return false;
		}else if(lunchToValue <= openingTimeValue || lunchToValue >= closingTimeValue){
			message = day+" lunch to time should be in between "+ day +" opening and closing time";
			return false;
		}else if(lunchFromValue>=lunchToValue){
			message = day+" lunch to time should be greater than "+ day +" lunch from time";
			return false;
		}
	}
	
	if(lunchFrom != "" && lunchTo == ""){
		message =day+" lunch to time is required because "+day+" lunch from time has mentioned";
		return false;
	}else if (lunchFrom == "" && lunchTo != ""){
		message =day+" lunch from time is required because "+day+" lunch to time has mentioned";
		return false;
	}
	
	return true;
}

function getTime(time){
	return new Date(getCurrentDate()+" "+time).getTime();
}

function getCurrentDate() {
	var currentDate = new Date();
	var dd = currentDate.getDate();
	var mm = currentDate.getMonth() + 1;
	var yyyy = currentDate.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}

	return mm + '/' + dd + '/' + yyyy;
}