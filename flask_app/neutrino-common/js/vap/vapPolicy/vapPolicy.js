
	var lastRowIndex = 0;
	var nextRowIndex = 0;
	
	$(document).ready(function() {
		lastRowIndex = parseInt($("#vapPolicymappingRowIndex").val());	
		if(isNaN(lastRowIndex)){
			nextRowIndex = 0;
		}else{
		nextRowIndex = lastRowIndex + 1;		

		}
		var noOfRows = $('#vapPolicy_vapPolicymapping tr').length -1;
		$("#count").html(noOfRows);	
		
		$('#vapPolicymappingDiv').on('change', "select[id^='vapPolicymapping_currency']", function(event) {
			var index = event.target.id.replace("vapPolicymapping_currency",'');
			populatePolicies(index);
		});

		$('#vapPolicymappingDiv').on('change', "select[id^='vapPolicymapping_parameter']", function(event) {
        			var index = event.target.id.replace("vapPolicymapping_parameter",'');
        			populateAmountComputationPolicies(index);
        		});



		$('#vapPolicymappingDiv').on('change', "select[id^='vapPolicymapping_amt']", function(event) {
			var index = event.target.id.replace("vapPolicymapping_amt",'');
			populatePayOutComputaionPolicies(index);
		});
		
	});
	
	function saveForm() {		
		if($('#vapPolicy_vapPolicymapping tr').length==1){
			$.sticky("Please enter at least one row for Policy Mapper.This field is compulsory!.", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			return;
		}
		
		 var isChecked = $("#create_another_master").prop('checked') ? true
				: false;

		var formTemp = $("#masterForm");
		$("#createAnotherMaster").val(isChecked);
		updateChileRecords('masterForm');
		formTemp.submit();	
		if(formTemp.valid()){		
			$('body').modalmanager('loading');
		    }

	}	

	function saveAndSendForApproval(context) {
		if($('#vapPolicy_vapPolicymapping tr').length==1){
			$.sticky("Please enter at least one row for Policy Mapping. This field is compulsory!.", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			return;
		}
		var isChecked = $("#create_another_master").prop('checked') ? true : false;
		$("#createAnotherMaster").val(isChecked);
		var masterID = document.getElementById("masterID").value;
		var form = document.getElementById("masterForm");
		if ($(".form").valid()){
			form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
			updateChileRecords('masterForm');
			form.submit();
		$('body').modalmanager('loading');
		}
	}
	//adding new row
	function addVapPolicymapping() {		
		
		$.ajax({			
			type : "POST",
			url : getContextPath()
					+ "/app/VapPolicy/addnewRow",
			data : {'nextRowIndex' : nextRowIndex},

			async : false,
			success : function(data) {
				
				$('#vapPolicy_vapPolicymapping  tr:last').after(data);
				lastRowIndex++;
				nextRowIndex++;
				var noOfRows = $('#vapPolicy_vapPolicymapping tr').length -1;
				$("#count").html(noOfRows);
			}
			
		});
	}
		

	//deleting a row
	function removeVapPolicyMapping(delVal, delRowId) {				
			$('#rowvapPolicymapping' + delRowId).remove();
			var noOfRows = $('#vapPolicy_vapPolicymapping tr').length -1;
			$("#count").html(noOfRows);
		
	}
	

	function populatePolicies(rowIndex){
		
	
		$('#vapPolicymapping_amt'+rowIndex).empty();
		$('#vapPolicymapping_amt'+rowIndex).append($('<option>', { value: '', text : 'Select' }));

        var policyType = "AmountComputationPolicy";
		var currencyId = $('#vapPolicymapping_currency'+rowIndex).val();
		var parameterPolicyId =  $('#vapPolicymapping_parameter'+rowIndex).val();
		if(currencyId != ""){
			
		$.ajax({			
			url : getContextPath() + "/app/VapPolicy/populatePolicyOfTypeCurrency" ,
			data : {'currencyId' :currencyId ,
				    'policyType' :policyType,
				    'parameterPolicyId' :parameterPolicyId} ,
			async : false,
			success : function(items) {
							
				$.each(items, function (i, data) {
				    $('#vapPolicymapping_amt'+rowIndex).append($('<option>', {
				        value: data.id,
				        text : data.name 
				    }));
				});
			}
		});
		
		policyType = "VapComputationPolicy";
		$('#vapPolicymapping_payout'+rowIndex).empty();
		$('#vapPolicymapping_payout'+rowIndex).append($('<option>', { value: '', text : 'Select' }));
		$.ajax({			
			url : getContextPath() + "/app/VapPolicy/populatePolicyOfTypeCurrency" ,
			data : {'currencyId' :currencyId ,
				    'policyType' :policyType} ,
			async : false,
			success : function(items) {
							
				$.each(items, function (i, data) {
				    $('#vapPolicymapping_payout'+rowIndex).append($('<option>', {
				        value: data.id,
				        text : data.name 
				    }));
				});
			}
		});
    
		}
	}

	function populateAmountComputationPolicies(rowIndex)
	{
	        $('#vapPolicymapping_amt' + rowIndex).empty();
	$('#vapPolicymapping_amt' + rowIndex).append($('<option>', {
		value : '',
		text : 'Select'
	}));

	var policyType = "AmountComputationPolicy";
	var currencyId = $('#vapPolicymapping_currency' + rowIndex).val();
	var parameterPolicyId = $('#vapPolicymapping_parameter' + rowIndex).val();
	if (currencyId != "") {

		$.ajax({
			url : getContextPath()
					+ "/app/VapPolicy/populatePolicyOfTypeCurrency",
			data : {
				'currencyId' : currencyId,
				'policyType' : policyType,
				'parameterPolicyId' : parameterPolicyId
			},
			async : false,
			success : function(items) {

				$.each(items, function(i, data) {
					$('#vapPolicymapping_amt' + rowIndex).append(
							$('<option>', {
								value : data.id,
								text : data.name
							}));
				});
			}
		});
	}
	}


	function populatePayOutComputaionPolicies(rowIndex){
		// alert($('#vapPolicymapping_amt'+rowIndex).val());
		
		$('#vapPolicymapping_payout'+rowIndex).empty();
		$('#vapPolicymapping_payout'+rowIndex).append($('<option>', { value: '', text : 'Select' }));
		var currencyId = $('#vapPolicymapping_currency'+rowIndex).val();
		var amountComputationId = $('#vapPolicymapping_amt'+rowIndex).val();
		if(currencyId != "" && amountComputationId != ""){
		$.ajax({			
			url : getContextPath() + "/app/VapPolicy/populateVapPayOutComputationPolicy" ,
			data : {
				    'amountComputationId' :amountComputationId ,
				    'currencyId' :currencyId
				   } ,
			async : false,
			success : function(items) {
							
				$.each(items, function (i, data) {
				    $('#vapPolicymapping_payout'+rowIndex).append($('<option>', {
				        value: data.id,
				        text : data.name 
				    }));
				});
			}
		});
		}else if(currencyId != "" && amountComputationId == ""){
			var policyType = "VapComputationPolicy";
			$('#vapPolicymapping_payout'+rowIndex).empty();
			$('#vapPolicymapping_payout'+rowIndex).append($('<option>', { value: '', text : 'Select' }));
			$.ajax({			
				url : getContextPath() + "/app/VapPolicy/populatePolicyOfTypeCurrency" ,
				data : {'currencyId' :currencyId ,
					    'policyType' :policyType} ,
				async : false,
				success : function(items) {
								
					$.each(items, function (i, data) {
					    $('#vapPolicymapping_payout'+rowIndex).append($('<option>', {
					        value: data.id,
					        text : data.name 
					    }));
					});
				}
			});
		}
		
	}
