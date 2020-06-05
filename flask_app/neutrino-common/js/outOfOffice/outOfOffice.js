var currentDate = new Date();
	var outOfOfficeFromDate = $("#outOfOffice_fromDate").val();
	var outOfOfficeToDate = $("#outOfOffice_toDate").val();
	var fromDateObj = new Date(String(outOfOfficeFromDate));
	var toDateObj = new Date(String(outOfOfficeFromDate));
	var issueDateValidationFlag = true;
	//check the issue date against current date
	if ((currentDate.getYear() < fromDateObj.getYear())
			&& (currentDate.getYear() < toDateObj.getYear())) {
		issueDateValidationFlag = false;
	} else if ((currentDate.getYear() > fromDateObj.getYear())
			&& (currentDate.getYear() > toDateObj.getYear())) {
		issueDateValidationFlag = true;
	} else if ((currentDate.getMonth() < fromDateObj.getMonth())
			&& (currentDate.getMonth() < toDateObj.getMonth())) {
		issueDateValidationFlag = false;
	} else if ((currentDate.getMonth() > fromDateObj.getMonth())
			&& (currentDate.getMonth() > toDateObj.getMonth())) {
		issueDateValidationFlag = true;
	}

	else if ((currentDate.getDay() < fromDateObj.getDay())
			&& (currentDate.getDay() < toDateObj.getDay())) {
		issueDateValidationFlag = false;
	} else {
		issueDateValidationFlag = true;
	}
	
 function updateCSSClassAndValueForDelegateDropDown(){
			
			if ($('#user').is(':checked')) { //If Assign To User checked.
				$("#toUser").removeClass("block-no");
				$("#toTeam").addClass("block-no");
				$("#toTeamLead").addClass("block-no");
				$("#delegating_user").addClass("required");
				$("#delegating_team_lead").removeClass("required");
				$("#delegating_team").removeClass("required");
				
				$("#delegatedToUserId").val($("#delegating_user").val());
			} else if ($('#team_lead').is(':checked')) { //If Assign To Team checked.
				$("#toTeamLead").removeClass("block-no");
				$("#toTeam").addClass("block-no");
				$("#toUser").addClass("block-no");
				$("#delegating_user").removeClass("required");
				$("#delegating_team_lead").addClass("required");
				$("#delegating_team").removeClass("required");

				$("#delegatedToUserId").val($("#delegating_team_lead").val());
			} else if ($('#pool').is(':checked')) { //If Assign To Pool checked.
				$("#toTeam").removeClass("block-no");
				$("#toTeamLead").addClass("block-no");
				$("#toUser").addClass("block-no");
				$("#delegating_user").removeClass("required");
				$("#delegating_team_lead").removeClass("required");
				$("#delegating_team").addClass("required");
				
				$("#delegatedToUserId").val($("#delegating_team").val());
			} 		 
	}
	if (!issueDateValidationFlag) {
		$("#outOfOffice_fromDate").parent().addClass("error");
		$("#outOfOffice_fromDate").parent().removeClass("success");
		$("#erroroutOfOffice_fromDate").children().text(
				label_disbursalIssueDate_moreThan_currentDate);
		$("#erroroutOfOffice_fromDate").show();
		$("#outOfOffice_fromDate").val("");
		$("#outOfOffice_toDate").parent().addClass("error");
		$("#outOfOffice_toDate").parent().removeClass("success");
		$("#erroroutOfOffice_toDate").children().text(
				label_disbursalIssueDate_moreThan_currentDate);
		$("#erroroutOfOffice_toDate").show();
		$("#outOfOffice_toDate").val("");
	}

	$(function() {
		$("#outOfOfficeDetails")
				.validate(
						{

							errorClass : "help-block",
							errorElement : "span",
							highlight : function(element, errorClass,
									validClass) {
								$(element).parents('.form-group').addClass(
										'error');
								if ($(element).parents('.outset-shadow-focus').length < 1) {
									/* $(element)
											.parents('.form-group')
											.wrapInner(
													'<div class="outset-shadow-focus clearfix" />'); */
									$(element).parents('.form-group').addClass('outset-shadow-focus clearfix');				
								}
								$(element).parents('.form-group')
										.removeClass('success');

							},
							unhighlight : function(element, errorClass,
									validClass) {
								$(element).parents('.form-group')
										.removeClass('error');

								$(element).parents('.form-group').addClass(
										'success');
							},
							invalidHandler : function(form, validator) {
								$.sticky(error_message, {
									autoclose : 5000,
									position : "top-right",
									type : "st-error"
								});
							}
						});
		$('#user').change(function() {
			if ($('#user').is(':checked')) {
				$("#toUser").removeClass("block-no");
				$("#toTeam").addClass("block-no");
				$("#toTeamLead").addClass("block-no");
				$("#delegating_user").addClass("required");
				$("#delegating_team_lead").removeClass("required");
				$("#delegating_team").removeClass("required");
			} 
		});
		$('#team_lead').change(function() {
			if ($('#team_lead').is(':checked')) {
				$("#toTeamLead").removeClass("block-no");
				$("#toTeam").addClass("block-no");
				$("#toUser").addClass("block-no");
				$("#delegating_user").removeClass("required");
				$("#delegating_team_lead").addClass("required");
				$("#delegating_team").removeClass("required");
			} 
		});
		$('#pool').change(function() {
			if ($('#pool').is(':checked')) {
				$("#toTeam").removeClass("block-no");
				$("#toTeamLead").addClass("block-no");
				$("#toUser").addClass("block-no");
				$("#delegating_user").removeClass("required");
				$("#delegating_team_lead").removeClass("required");
				$("#delegating_team").addClass("required");
			} 
		});
		$("#delegating_user").change(function(){
			if($(this).val()){
				$("#delegatedToUserId").val($(this).val());
			}
		});
		$("#delegating_team").change(function(){
			if($(this).val()){
				$("#delegatedToUserId").val($(this).val());
			}
		});
		$("#delegating_team_lead").change(function(){
			if($(this).val()){
				$("#delegatedToUserId").val($(this).val());
			}
		});

	});

	