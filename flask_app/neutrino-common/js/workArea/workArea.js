$(document).ready(function(){
	$('#branch').on('onBranchChange',function(){
		var branch_id=$('#branch').val();
		handleCityVillageFields();
		$('#Text_state').attr('data-custom-controller','/WorkAreaSOMapping/populateStateBasedOnBranch/'+branch_id);
		$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranch/'+branch_id);
		$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranch/'+branch_id);
		
	});
	
	$('#city').on('onCityChange',function(){
		onCityVillChange();
	});
	
	$('#village').on('onVillChange',function(){
		onCityVillChange();
	});
	
	$('#Text_branch').on('change',function(){
		handleCityVillageFields();
	});
	
	$('#Text_city, #Text_village').on('change',function(){
		if(isLoggedInUserRM==""){
			$('#rmOfficer').val('');
			$('#Text_rmOfficer').val('');
		}
		handleRmOfficerFields();
	});

	if(isLoggedInUserRM !="")
		$('#Text_rmOfficer').attr('readonly','readonly');
	
	if($('#branch').val()=="") {
		$('#Text_rmOfficer').attr('readonly','readonly');
		$('#Text_city').attr('readonly','readonly');
		$('#Text_village').attr('readonly','readonly');
		$('#Text_state').attr('readonly','readonly');
		$('#Text_district').attr('readonly','readonly');
		$('#Text_tehsil').attr('readonly','readonly');
	} else {
		var branch_id=$('#branch').val();
		var city_id=$('#city').val();
		var vill_id=$('#village').val();
		if(vill_id!='')
			$('#Text_rmOfficer').attr('data-custom-controller','/WorkArea/populateRMbasedOnVillage/'+branch_id+'/'+vill_id);
		else if(city_id!='')
			$('#Text_rmOfficer').attr('data-custom-controller','/WorkArea/populateRMbasedOnCity/'+branch_id+'/'+city_id);
		
		handleRmOfficerFields();
		$('#Text_state').attr('data-custom-controller','/WorkAreaSOMapping/populateStateBasedOnBranch/'+$('#branch').val());
		$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranch/'+$('#branch').val());
		$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranch/'+$('#branch').val());
	}
	
	if($('#state').val()==""){
		$('#Text_district').attr('readonly','readonly');
		$('#Text_tehsil').attr('readonly','readonly');
	}
	
	if($('#district').val()==""){
		$('#Text_tehsil').attr('readonly','readonly');
	}
	
	$('#state').on('onStateSelection',function(){
		var branch_id=$('#branch').val();
		var state_id=$(this).val();
		if(state_id!=""){
			$('#Text_district').removeAttr('readonly');
			$('#Text_district').attr('data-custom-controller','/WorkAreaSOMapping/populateDistrictBasedOnState/'+state_id);
			$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranchAndState/'+branch_id+'/'+state_id);
			$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndState/'+branch_id+'/'+state_id);
		}
	});
	var branch_id=$('#branch').val();
	var state_id=$('#state').val();
	stateRelatedFieldsHandlingOnPageLoad(state_id,branch_id);
	
	$('#district').on('onDistrictSelection',function(){
		var district_id=$(this).val();
		var branch_id=$('#branch').val();
		var state_id=$('#state').val();
		if(district_id!=""){
			$('#Text_tehsil').removeAttr('readonly');
			$('#Text_tehsil').attr('data-custom-controller','/WorkAreaSOMapping/populateTehsilBasedOnDistrict/'+district_id);
			$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranchAndStateAndDistrict/'+branch_id+'/'+state_id+'/'+district_id);
			$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndDistrict/'+branch_id+'/'+district_id);
		}
	});
	
	var district_id=$('#district').val();
	districtRelatedFieldsHandlingOnPageLoad(district_id,state_id,branch_id);
	
	$('#tehsil').on('onTehsilSelection',function(){
		var branch_id=$('#branch').val();
		var tehsil_id=$(this).val();
		if(tehsil_id!="" ){
			$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndTehsil/'+branch_id+'/'+tehsil_id);
		}
	});
	
	var tehsil_id=$('#tehsil').val();
	tehsilRelatedFieldsHandlingOnPageLoad(tehsil_id,branch_id);
	
	$('#Text_state').change(function(){
		$('#Text_district').val("");
		$('#district').val();
		$('#Text_district').trigger('change');
		
		$('#Text_city').val("");
		$('#city').val("");
		$('#Text_city').trigger('change');
		
		$('#Text_village').val("");
		$('#village').val("");
		$('#Text_village').trigger('change');
		
		var branch_id=$('#branch').val();
		if($('#Text_state').val()==""){
			$('#Text_district').attr('readonly','readonly');
			$('#Text_tehsil').attr('readonly','readonly');
			if(branch_id!=""){
				$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranch/'+branch_id);
				$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranch/'+branch_id);
			}
		}
	});
	
	$('#Text_district').change(function(){
		$('#Text_tehsil').val("");
		$('#tehsil').val("");
		$('#Text_tehsil').trigger('change');
		
		$('#Text_city').val("");
		$('#city').val("");
		$('#Text_city').trigger('change');
		
		$('#Text_village').val("");
		$('#village').val("");
		$('#Text_village').trigger('change');
		
		var branch_id=$('#branch').val();
		var state_id=$('#state').val();
		if($('#Text_district').val()==""){
			$('#Text_tehsil').attr('readonly','readonly');
			if(branch_id!="" && state_id!=""){
				$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranchAndState/'+branch_id+'/'+state_id);
				$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndState/'+branch_id+'/'+state_id);
			}
		}
	});
	
	$('#Text_tehsil').change(function(){
		var branch_id=$('#branch').val();
		var district_id=$('#district').val();
		$('#Text_village').val("");
		$('#village').val("");
		$('#Text_village').trigger('change');
		
		if($('#Text_tehsil').val()=="" && branch_id!="" && district_id!=""){
			$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndDistrict/'+branch_id+'/'+district_id);
		}
	});
	
	if(viewable=="false" && isLoggedInUserRM=="true"){
		$('#Text_branch').attr('readonly','readonly');
		$('#Text_state').attr('readonly','readonly');
		$('#Text_district').attr('readonly','readonly');
		$('#Text_tehsil').attr('readonly','readonly');
		$('#Text_city').attr('readonly','readonly');
		$('#Text_village').attr('readonly','readonly');
		$('#Text_rmOfficer').attr('readonly','readonly');
	}
	
    getGlobalActiveFlag(activeFlagVal,viewMode,editMode);
	
	$( "#_save").prop('onclick',null);
	$( "#_saveandsend").prop('onclick',null);
	$( "#_save_header").prop('onclick',null);
	$( "#_saveandsend_header").prop('onclick',null);
	
	$("#_save").click(function(){
		saveWorkArea(false);
	});
	
	$("#_saveandsend").click(function(){
		saveWorkArea(true);
	});
	
	$("#_save_header").click(function(){
		saveWorkArea(false);
	});
	
	$("#_saveandsend_header").click(function(){
		saveWorkArea(true);
	});
	
	
});

function saveWorkArea(approve){
	if($('#masterForm').valid()){
		var city_id=$('#city').val();
		var vill_id=$('#village').val();
		if(city_id!='' || vill_id!='') {
			$.ajax({
				url : contextPath+'/app/WorkArea/checkForDuplicateName',
				type : 'POST',
				data :	{'name' : $('#workAreaName').val(),
					'villageId' : $('#village').val(),
					'cityId' : $('#city').val(),
					'id'   :  $('#id').val()},
				async : false,
				success : function(jqXHR) {
					if(jqXHR=='success') {
			
							if(approve){
								saveAndSendForApproval(contextPath);
							} else {
								saveForm();
							}
					} else {
						new PNotify({
							title : error,
							text : "Work Area name already exists in this village/city",
							type : 'error',
							pnotify_animate_speed : fadeOutduration,
							opacity : .8
						  });
						  return;
					}
				}
			});
		} else {
			new PNotify({
				title : error,
				text : "Please select City OR Village",
				type : 'error',
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			  });
			  return;
		}
	}
}

function stateRelatedFieldsHandlingOnPageLoad(state_id,branch_id){
	if(state_id !=""){
		$('#Text_district').attr('data-custom-controller','/WorkAreaSOMapping/populateDistrictBasedOnState/'+state_id);
	}
	if(state_id !="" && branch_id !=""){
		$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranchAndState/'+branch_id+'/'+state_id);
		$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndState/'+branch_id+'/'+state_id);
	}
}

function districtRelatedFieldsHandlingOnPageLoad(district_id,state_id,branch_id){
	if(district_id !=""){
		$('#Text_tehsil').attr('data-custom-controller','/WorkAreaSOMapping/populateTehsilBasedOnDistrict/'+district_id);
	}
	if(district_id !="" && state_id !="" && branch_id !=""){
		$('#Text_city').attr('data-custom-controller','/WorkArea/populateCityBasedOnBranchAndStateAndDistrict/'+branch_id+'/'+state_id+'/'+district_id);
		$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndDistrict/'+branch_id+'/'+district_id);
	}
}

function tehsilRelatedFieldsHandlingOnPageLoad(tehsil_id,branch_id){
	if(tehsil_id!="" && branch_id !=""){
		$('#Text_village').attr('data-custom-controller','/WorkArea/populateVillageBasedOnBranchAndTehsil/'+branch_id+'/'+tehsil_id);
	}
}

function onCityVillChange(){
	if(isLoggedInUserRM==""){
		$('#rmOfficer').val('');
		$('#Text_rmOfficer').val('');
	}
	handleRmOfficerFields();
	var branch_id=$('#branch').val();
	var city_id=$('#city').val();
	var vill_id=$('#village').val();
	if(vill_id!='')
		$('#Text_rmOfficer').attr('data-custom-controller','/WorkArea/populateRMbasedOnVillage/'+branch_id+'/'+vill_id);
	else if(city_id!='')
		$('#Text_rmOfficer').attr('data-custom-controller','/WorkArea/populateRMbasedOnCity/'+branch_id+'/'+city_id);
}

function handleRmOfficerFields(){
	if($('#city').val()!="") {
		$('#Text_village').attr('readonly','readonly');
		$('#content_village span.help-block').remove();
		$('#content_village').removeClass('error');
		if(isLoggedInUserRM==""){
			$('#Text_rmOfficer').removeAttr('readonly');
		}
	} else if($('#village').val()!="") {
		$('#Text_city').attr('readonly','readonly');
		$('#content_city span.help-block').remove();
		$('#content_city').removeClass('error');
		if(isLoggedInUserRM==""){
			$('#Text_rmOfficer').removeAttr('readonly');
		}
	} else {
		if($('#Text_branch').val()!="" && $('#branch').val()!="") {
			$('#Text_city').removeAttr('readonly');
			$('#Text_village').removeAttr('readonly');
		}
		$('#Text_rmOfficer').attr('readonly','readonly');
	}
	
}

function handleCityVillageFields(){
	if($('#Text_branch').val()=="" || $('#branch').val()=="") {
		$('#Text_rmOfficer').attr('readonly','readonly');
		$('#Text_city').attr('readonly','readonly');
		$('#Text_village').attr('readonly','readonly');
		$('#Text_state').attr('readonly','readonly');
		$('#Text_district').attr('readonly','readonly');
		$('#Text_tehsil').attr('readonly','readonly');
	} else {
		$('#Text_city').removeAttr('readonly');
		$('#Text_village').removeAttr('readonly');
		$('#Text_state').removeAttr('readonly');
	}
	$('#city').val('');
	$('#Text_city').val('');
	$('#village').val('');
	$('#Text_village').val('');
	$('#Text_state').val("");
	$('#state').val("");
	$('#Text_state').trigger('change');
	$('#Text_city').trigger('change');
	$('#Text_village').trigger('change');
}

function hideMandatory() {
    requiredFieldsEnabled = true;
    $(".nonMandatory").each(function( index ) {
 		  if(!(jQuery($(this)).is(':hidden'))){
     	  $(this).hide();
 	   }
    });
    $("#create_another_master").parents("div .checkbox-container").show();
    $("#content_city").show();
    $("#content_village").show();
}

