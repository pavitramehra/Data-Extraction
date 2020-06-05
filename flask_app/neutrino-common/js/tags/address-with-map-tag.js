function address_withMapScript(address_withMapScriptInput){
$(document).ready(function() {
	var profileName = address_withMapScriptInput.profileName;
	
	var selectedCountryId = $("#text_"+address_withMapScriptInput.id).val();
	
	var defaultCountryId = address_withMapScriptInput.defaultCountryId;
	
	$("#text_" + address_withMapScriptInput.id).data("relatedAddressTypeId",
			address_withMapScriptInput.relatedAddressTypeId);

	if(selectedCountryId == "")
	{
		$("#text_"+address_withMapScriptInput.id+ ' option').each(function()
		{
			var currentOption = $(this).attr("data-code");
			if (currentOption == defaultCountryId) 
			{
				
				$(this).attr("selected", "selected");
				return false;
			}
		});
	}
	
		
	//	var addressId = "<c:out value='${addressID}' />";
		//Auto Populate rest of the address fields based on country,if aadress is used in modal window
			 if($("#dialog-form-"+address_withMapScriptInput.dialogId).length>0)
			 {
			 $("#dialog-form-"+address_withMapScriptInput.dialogId).bind('shown', function() {
				 if(address_withMapScriptInput.pathPrepender!="" )
					 {
					 populateRegion(address_withMapScriptInput.pathPrepender+'.',address_withMapScriptInput.id,address_withMapScriptInput.implementationType);
					 }
				 else
					 {
					 populateRegion(address_withMapScriptInput.pathPrepender,address_withMapScriptInput.id,address_withMapScriptInput.implementationType);
			 		 }
				
					//Prevent further ajax call to be made untill the modal is closed.
					$("#dialog-form-"+address_withMapScriptInput.dialogId).unbind('shown');
				}); 
			 }
		 else
			 {

				 if(address_withMapScriptInput.pathPrepender!="" )
				 {
				 	populateRegion(address_withMapScriptInput.pathPrepender+'.',address_withMapScriptInput.id,address_withMapScriptInput.implementationType);
				 }
				 else
				 {
				 	populateRegion(address_withMapScriptInput.pathPrepender,address_withMapScriptInput.id,address_withMapScriptInput.implementationType);
		 		 }

			 }
			 applyOnLoadAddWithMapTag();
	
	});
$(document).off(
		'change',
		'#'+address_withMapScriptInput.relatedAddressTypeId);
$(document).on(
		'change',
		'#'+address_withMapScriptInput.relatedAddressTypeId,
		function() {
			/* var addTypeValue = $('#addressType option:selected').attr(
					'data-code');
			if (addTypeValue == 'OfficeAddress') {
				 $('#accomodationType').closest("div.row").hide();
				$("#accomodationType").attr("disabled", "disabled"); 
				$('#address_noOfYearsAtCurrentAdress-control-group')
						.closest("div.row").hide();
				$('#accomodationType_mainDiv').hide();
				$('#residenceType_mainDiv').hide();
				$('#otherResidenceType_${htmlAddressId}').hide();
				$('#residenceType_${htmlAddressId}').attr("disabled", "disabled");
				$('#accomodationType_${htmlAddressId}').attr("disabled", "disabled");
				$('#othersDiv').hide();
			} else {
				//$('#accomodationType').closest("div.row").show();
				$('#address_noOfYearsAtCurrentAdress-control-group')
						.closest("div.row").show();
				$('#accomodationType_mainDiv').show();
				$('#residenceType_mainDiv').show();
				$('#residenceType_${htmlAddressId}').removeAttr('disabled');
				$('#accomodationType_${htmlAddressId}').removeAttr('disabled');
				$('#otherResidenceType_${htmlAddressId}').show();
				$('#othersDiv').show();
			} */
			populateResidenceFields(populateResidenceFields);
		});


 function applyOnLoadAddWithMapTag() {
	var listOnLoadId = ['select[id^="text_"]'] ;
	
	executeOnLoad(listOnLoadId);
} 
function applyFuncOnLoadAddTag() {
		var regionIds      =  '[id^=remainingFields_]' + " " + 'select[id^=region_]';
		var stateIds       =  '[id^=remainingFields_]' + " " + 'select[id^=state_]';
		var cityIds        =  '[id^=remainingFields_]' + " " + 'select[id^=city_]';
		var districtIds    =  '[id^=remainingFields_]' + " " + 'select[id^=district_]';
		var postalcodeIds  =  '[id^=remainingFields_]' + " " + 'select[id^=Text_postalCode_]';
		var accomodationIds=  '[id^=remainingFields_]' + " " + 'select[id^=accomodationType_]';
		var residenceIds   =  '[id^=remainingFields_]' + " " + 'select[id^=residenceType_]';
		var areIds         =  '[id^=remainingFields_]' + " " + 'select[id^=area_]';
		var listOnLoadId = [regionIds,stateIds,cityIds,districtIds,postalcodeIds,accomodationIds,residenceIds,areIds] ;
	    executeOnLoad(listOnLoadId);
}	

	function populateRegion( pathPrepender,tagAddressId,implementation_Type)
	{
		var countryId = $("#text_"+tagAddressId).val();
		var tabCount=address_withMapScriptInput.tabCount;
		var addressId = address_withMapScriptInput.addressId;
		var itagAddressId = tagAddressId;
		var enableMapValue=address_withMapScriptInput.enableMapValue;
		var mandatoryAttr=address_withMapScriptInput.mandatoryAttr;
		var decorateSelectTag =address_withMapScriptInput.decorateSelectTag;
		var disableISDCode = address_withMapScriptInput.disableISDCode;
		var modificationAllowed = address_withMapScriptInput.modificationAllowed;
		/*check if implementation type is 'true' , then load address related fields on the basis of pincode  */
		if(implementation_Type=="true")
			{
			$
			.ajax({
				
				//Also, same URL will be used to render country specific fields on the UI
				url : getContextPath()+"/app/AddressTag/pincodeBased/paintRestFields",
				data : ({
					relativePath : pathPrepender,
					countryId : countryId,
					addressId : addressId,
					htmlAddressId : itagAddressId,
					enableMapValue : enableMapValue,
					tabCount:tabCount,
					mandatoryAttr:mandatoryAttr,
					implementation_Type :implementation_Type,
					decorateSelectTag : decorateSelectTag,
					disableISDCode : disableISDCode,
				    modificationAllowed : modificationAllowed,
					"addressWithMap" : "true"
				}),
				type : 'POST',
				async : false,
				success : function(jqXHR) {
					$('#remainingFields_'+itagAddressId).html(jqXHR);
					populateResidenceFields(populateResidenceFields);
					applyFuncOnLoadAddTag();
					
				}
			});
			}
		else
			{
				$
				.ajax({
					//This AJAX request is returning back the Region List associated with the selected country in the drop down
					//Also, same URL will be used to render country specific fields on the UI
					url : getContextPath()+"/app/AddressTag/paintRestFields",
					data : ({
						relativePath : pathPrepender,
						countryId : countryId,
						addressId : addressId,
						htmlAddressId : itagAddressId,
						enableMapValue : enableMapValue,
						tabCount:tabCount,
						mandatoryAttr:mandatoryAttr,
						decorateSelectTag : decorateSelectTag,
						disableISDCode : decorateSelectTag,
						modificationAllowed : modificationAllowed,
						"addressWithMap" : "true"
					}),
					type : 'POST',
					async : false,
					success : function(jqXHR) {
						$('#remainingFields_'+itagAddressId).html(jqXHR);
						populateResidenceFields(populateResidenceFields);
						applyFuncOnLoadAddTag();
						
					}
				});
			
			
			}
		

	}
	/*  function populateOther()
	{
		if($('#residenceType_${htmlAddressId}').find('option:selected').text() == 'Others')
			{
			$('#otherResidenceType_${htmlAddressId}').show();
			$('#othersDiv').show();
			}
		else
			{
			$('#otherResidenceType_${htmlAddressId}').hide();
			$('#othersDiv').hide();
			}
	} */
	
$(function(){
	 if($("#text_"+address_withMapScriptInput.id).hasClass('readonly_true')){
		 $('select[class=readonly_true]').css("background-color","#EEEEEE").css("cursor","not-allowed").bind("focus", function(){
		        	 $(this).blur();
		      });
		
	}
	
});

$("#text_"+address_withMapScriptInput.id).change(function(){
	populateRegion(address_withMapScriptInput.completePath,address_withMapScriptInput.id,address_withMapScriptInput.implementationType)
	});

}

function populateResidenceFields(address_withMapScriptInput)
{
	var residenceEnabled = address_withMapScriptInput.residenceEnabled;
	var addType = $('#'+address_withMapScriptInput.relatedAddressTypeId+' option:selected').attr(
	'data-code');
	
	if(residenceEnabled == 'true' && addType)
		{
		if (addType == 'OfficeAddress') {
			
			$('#accomodationType_mainDiv').hide();
			$('#residenceType_mainDiv').hide();
			$("#residenceType_"+address_withMapScriptInput.htmlAddressId).attr("disabled", "disabled");
			$("#accomodationType_"+address_withMapScriptInput.htmlAddressId).attr("disabled", "disabled");
			$("#otherResidenceType_"+address_withMapScriptInput.htmlAddressId).hide();
			$('#othersDiv').hide();
		} else {
			
			$('#accomodationType_mainDiv').show();
			$('#residenceType_mainDiv').show();
			$("#residenceType_"+address_withMapScriptInput.htmlAddressId).removeAttr('disabled');
			$("#accomodationType_"+address_withMapScriptInput.htmlAddressId).removeAttr('disabled');
			if($("#residenceType_"+address_withMapScriptInput.htmlAddressId).find('option:selected').text() == 'Others')
			{
			$("#otherResidenceType_"+address_withMapScriptInput.htmlAddressId).show();
			$('#othersDiv').show();
			}
		else
			{
			$("#otherResidenceType_"+address_withMapScriptInput.htmlAddressId).hide();
			$('#othersDiv').hide();
			}
		}

		}
	else
		{
		$('#accomodationType_mainDiv').hide();
		$('#residenceType_mainDiv').hide();
		$("#residenceType_"+address_withMapScriptInput.htmlAddressId).attr("disabled", "disabled");
		$("#accomodationType_"+address_withMapScriptInput.htmlAddressId).attr("disabled", "disabled");
		$("#otherResidenceType_"+address_withMapScriptInput.htmlAddressId).hide();
		$('#othersDiv').hide();
		}
}


