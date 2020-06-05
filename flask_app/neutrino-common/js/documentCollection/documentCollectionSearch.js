$(document)
		.ready(
				function() {

					$("#application_ID,#applicationReferenceNumberID,#uniqueID")
							.change(
									function() {
										var appNumber = $("#application_ID")
												.val();
										var appRefNumber = $(
												"#applicationReferenceNumberID")
												.val();
										var uniqueID = $("#uniqueID").val();
										if ((typeof appNumber != 'undefined' && appNumber != "")
												|| (typeof appRefNumber != 'undefined' && appRefNumber != "")
												|| (typeof uniqueID != 'undefined' && uniqueID != "")) {

											$("#id2").children().addClass(
													'chosen-disabled').css(
													'pointer-events', 'none');
											$("#id4_id4").children().addClass(
													'chosen-disabled').css(
													'pointer-events', 'none');
											$("#id2_appsearch_name_dob")
													.children().addClass(
															'chosen-disabled')
													.css('pointer-events',
															'none');
											$("#id2_id2").children().addClass(
													'chosen-disabled').css(
													'pointer-events', 'none');
											$("#optionBlock")
													.children()
													.addClass('chosen-disabled')
													.css('pointer-events',
															'none');
										} else {
											debugger;
											$("#id2").children().removeClass(
													'chosen-disabled').css(
													'pointer-events', 'auto');
											$("#id4_id4").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#id2_appsearch_name_dob")
													.children().removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#id2_id2").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#optionBlock").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');

										}

									});

					$(
							"#productTypeID,#appliedVia,#appliedOnDateRangeStartID,#appliedOnDateRangeEndID0,#appliedOnDateRangeEndID")
							.change(
									function() {
										var productTypeForSearch = $(
												"#productTypeID").val();
										var appliedOnForSearch = $(
												"#appliedVia").val();
										var exactDate = $(
												"#appliedOnDateRangeStartID")
												.val();
										var rangeStartDate = $(
												"#appliedOnDateRangeEndID0")
												.val();
										var rangeEndDate = $(
												"#appliedOnDateRangeEndID")
												.val();
										if ((typeof productTypeForSearch != 'undefined' && productTypeForSearch != "")
												|| (typeof appliedOnForSearch != 'undefined' && appliedOnForSearch != "")
												|| (typeof exactDate != 'undefined' && exactDate != "")
												|| (typeof rangeStartDate != 'undefined' && rangeStartDate != "")
												|| (typeof rangeEndDate != 'undefined' && rangeEndDate != "")) {

											$("#id3_id3").children().addClass(
													'chosen-disabled').css(
													'pointer-events', 'none');
											$("#id4_id4").children().addClass(
													'chosen-disabled').css(
													'pointer-events', 'none');
											$("#id2_appsearch_name_dob")
													.children().addClass(
															'chosen-disabled')
													.css('pointer-events',
															'none');
											$("#id2_id2").children().addClass(
													'chosen-disabled').css(
													'pointer-events', 'none');
											$("#optionBlock")
													.children()
													.addClass('chosen-disabled')
													.css('pointer-events',
															'none');
										} else {
											debugger;
											$("#id3_id3").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#id4_id4").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#id2_appsearch_name_dob")
													.children().removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#id2_id2").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');
											$("#optionBlock").children()
													.removeClass(
															'chosen-disabled')
													.css('pointer-events',
															'auto');

										}

									});
					$("#customer_ID,#cifNumberID").change(function() {
						checkForThirdBlock();

					});
					$("#name,#dateOfBirth,#institutionName,#incorporationDate")
							.change(function() {
								checkForFourthBlock();

							});
					 $("#customerMobileNumberID_phoneNumber,#stdCode_landLine_search_p,#phoneNumber_landLine_search_p,#idType,#uniqueIdNumber,#registrationNumber").change(function(){
							
						 checkForFifthBlock();
					 });
					$(document).on(
							"click",
							"#individual,#institutional",
							function(event) {
								var targetId = $(event.target).attr("id");
								onClickCustomerType();
								if (targetId == "individual") {
									$("#customerTypeSelected")
											.val("individual");
									$(".searchFieldsForIndividualCustomer")
											.show();
									$(".searchFieldsForNonIndividualCustomer")
											.hide();
									$(".searchFieldsForNonIndividualCustomer")
											.find("input").val("");
									$(".searchFieldsForNonIndividualCustomer")
											.find("select").val("");
									$(".searchFieldsForNonIndividualCustomer")
											.find("select").trigger(
													"chosen:updated");

								} else if (targetId == "institutional") {
									$("#customerTypeSelected").val(
											"non_individual");
									$(".searchFieldsForNonIndividualCustomer")
											.show();
									$(".searchFieldsForIndividualCustomer")
											.hide();
									$(".searchFieldsForIndividualCustomer")
											.find("input").val("");
									$(".searchFieldsForIndividualCustomer")
											.find("select").trigger(
													"chosen:updated");
								}
							});

					if ($('#appliedOnDateRangeEndID').val() == "") {
						whenExactDateSelected();

					} else {
						whenRangeDateSelected();

					}

					$('#rangeDateRadioID').click(function() {
						whenRangeDateSelected();
						onClickRadioButton();

					});

					$('#exactDateRadioID').click(function() {
						whenExactDateSelected();
						onClickRadioButton();

					});

				

				});

function validateBeforeSearch() {
	var appName = $("#name").val();
	var appDob = $("#dateOfBirth").val();
	var instname = $("#institutionName").val();
	var incorporationDate = $("#incorporationDate").val();

	if ($('#individual').is(":checked")) {
		if (appName == "" && appDob != "") {
			validateAndNotify("name");
			return false;
		}
		if (appName != "" && appDob == "") {
			validateAndNotify("dateOfBirth");
			return false;
		}
	} else {
		if (instname == "" && incorporationDate != "") {
			validateAndNotify("institutionName");
			return false;
		}
		if (instname != "" && incorporationDate == "") {
			validateAndNotify("incorporationDate");
			return false;
		}

	}
	var productTypeForSearch = $("#productTypeID").val();
	var appliedOnForSearch = $("#appliedVia").val();
	var exactDate = $("#appliedOnDateRangeStartID").val();
	var rangeStartDate = $("#appliedOnDateRangeEndID0").val();
	var rangeEndDate = $("#appliedOnDateRangeEndID").val();
	if ($('#exactDateRadioID').is(":checked")) {

		if (productTypeForSearch != "" && appliedOnForSearch == ""
				&& exactDate == "") {
			validateAndNotify("appliedVia");
			validateAndNotify("appliedOnDateRangeStartID");
			return false;
		}
		if (productTypeForSearch != "" && appliedOnForSearch != ""
				&& exactDate == "") {
			validateAndNotify("appliedOnDateRangeStartID");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch != ""
				&& exactDate == "") {
			validateAndNotify("productTypeID");
			validateAndNotify("appliedOnDateRangeStartID");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch != ""
				&& exactDate != "") {
			validateAndNotify("productTypeID");
			return false;
		}

	} else {
		if (productTypeForSearch != "" && appliedOnForSearch == ""
				&& rangeStartDate == "" && rangeEndDate == "") {
			validateAndNotify("appliedVia");
			validateAndNotify("appliedOnDateRangeEndID0");
			validateAndNotify("appliedOnDateRangeEndID");
			return false;
		}
		if (productTypeForSearch != "" && appliedOnForSearch != ""
				&& rangeStartDate == "" && rangeEndDate == "") {
			validateAndNotify("appliedOnDateRangeEndID0");
			validateAndNotify("appliedOnDateRangeEndID");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch != ""
				&& rangeStartDate == "" && rangeEndDate == "") {
			validateAndNotify("productTypeID");
			validateAndNotify("appliedOnDateRangeEndID0");
			validateAndNotify("appliedOnDateRangeEndID");
			return false;
		}
		if (productTypeForSearch != "" && appliedOnForSearch != ""
				&& rangeStartDate != "" && rangeEndDate == "") {
			validateAndNotify("appliedOnDateRangeEndID");
			return false;
		}
		if (productTypeForSearch != "" && appliedOnForSearch != ""
				&& rangeStartDate == "" && rangeEndDate != "") {
			validateAndNotify("appliedOnDateRangeEndID0");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch == ""
				&& rangeStartDate != "" && rangeEndDate != "") {
			validateAndNotify("appliedVia");
			validateAndNotify("productTypeID");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch == ""
				&& rangeStartDate == "" && rangeEndDate != "") {
			validateAndNotify("appliedVia");
			validateAndNotify("productTypeID");
			validateAndNotify("appliedOnDateRangeEndID0");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch == ""
				&& rangeStartDate != "" && rangeEndDate == "") {
			validateAndNotify("appliedVia");
			validateAndNotify("productTypeID");
			validateAndNotify("appliedOnDateRangeEndID");
			return false;
		}
		if (productTypeForSearch == "" && appliedOnForSearch != ""
				&& rangeStartDate != "" && rangeEndDate != "") {
			validateAndNotify("productTypeID");
			return false;
		}
		if (productTypeForSearch != "" && appliedOnForSearch == ""
				&& rangeStartDate != "" && rangeEndDate != "") {
			validateAndNotify("appliedVia");
			return false;
		}
	}
	if ($("#documentCollectionVoFormID").valid()) {
		$("#documentCollectionVoFormID").submit();
	}

}

function validateAndNotify(id) {
	var objId = "#" + id;
	var objControl = "#" + id + "-control-group";
	$(objId).addClass('required');
	$(objId).valid();
	$(objControl).addClass('error');
	new PNotify({
		title : 'Error',
		text : error_message,
		type : 'error',
		opacity : .8
	});

}

function whenExactDateSelected() {
	$('#exactDateRadioID').prop("checked", true);
	$.uniform.update($("#exactDateRadioID"));
	$('#appliedOnDateRangeEndID').val("");
	$('#appliedOnDateRangeEndID0').val("");
	$('#rangeDateRadioID').prop("checked", false);
	$.uniform.update($("#rangeDateRadioID"));
	$('#appliedOnDateRangeEndID').prop('disabled', true);
	$('#appliedOnDateRangeEndID-control-group').prop('disabled', true);
	$('#appliedOnDateRangeEndID-control-group').hide();
	$('#appliedOnDateRangeEndID0').prop('disabled', true);
	$('#appliedOnDateRangeEndID0-control-group').prop('disabled', true);
	$('#appliedOnDateRangeEndID0-control-group').hide();

	$('#appliedOnDateRangeStartID').prop('disabled', false);
	$('#appliedOnDateRangeStartID-control-group').prop('disabled', false);
	$('#appliedOnDateRangeStartID-control-group').show();
	$('#fromToID').hide();

}

function whenRangeDateSelected() {
	$('#rangeDateRadioID').prop("checked", true);
	$.uniform.update($("#rangeDateRadioID"));
	$('#exactDateRadioID').prop("checked", false);
	$.uniform.update($("#exactDateRadioID"));
	$('#appliedOnDateRangeEndID').prop('disabled', false);
	$('#appliedOnDateRangeEndID-control-group').prop('disabled', false);
	$('#appliedOnDateRangeEndID-control-group').show();
	$('#appliedOnDateRangeEndID0').prop('disabled', false);
	$('#appliedOnDateRangeEndID0-control-group').prop('disabled', false);
	$('#appliedOnDateRangeEndID0-control-group').show();

	$('#appliedOnDateRangeStartID').val("");
	$('#appliedOnDateRangeStartID').prop('disabled', true);
	$('#appliedOnDateRangeStartID-control-group').prop('disabled', true);
	$('#appliedOnDateRangeStartID-control-group').hide();
	$('#fromToID').show();
}
function eventsOnLoadAndDomInsertedDoc() {

	var secCusRelationTypeOnLoad = 'div[id^=appliedViaID]' + " "
			+ 'select[id^=appliedVia].chosen_a';
	var listOnLoadId = [ secCusRelationTypeOnLoad ];

	executeOnLoad(listOnLoadId);
}
function onClickRadioButton() {

	var productTypeForSearch = $("#productTypeID").val();
	var appliedOnForSearch = $("#appliedVia").val();
	var exactDate = $("#appliedOnDateRangeStartID").val();
	var rangeStartDate = $("#appliedOnDateRangeEndID0").val();
	var rangeEndDate = $("#appliedOnDateRangeEndID").val();
	if ((typeof productTypeForSearch != 'undefined' && productTypeForSearch != "")
			|| (typeof appliedOnForSearch != 'undefined' && appliedOnForSearch != "")
			|| (typeof exactDate != 'undefined' && exactDate != "")
			|| (typeof rangeStartDate != 'undefined' && rangeStartDate != "")
			|| (typeof rangeEndDate != 'undefined' && rangeEndDate != "")) {

		$("#id3_id3").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
		$("#id4_id4").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
		$("#id2_appsearch_name_dob").children().addClass('chosen-disabled')
				.css('pointer-events', 'none');
		$("#id2_id2").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
		$("#optionBlock").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
	} else {
		debugger;
		$("#id3_id3").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id4_id4").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id2_appsearch_name_dob").children().removeClass('chosen-disabled')
				.css('pointer-events', 'auto');
		$("#id2_id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#optionBlock").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');

	}
}
function onClickCustomerType() {

	var mobileNum = $("#customerMobileNumberID_phoneNumber").val();
	var std = $("#stdCode_landLine_search_p").val();
	var number = $("#phoneNumber_landLine_search_p").val();
	var extn = $("#extension_landLine_search_p").val();
	var identificationType = $("#idType").val();
	var uniqueIdNumber = $("#uniqueIdNumber").val();
	var registrationNumber = $("#registrationNumber").val();
	var customerIdForSearch = $("#customer_ID").val();
	var cifIdForSearch = $("#cifNumberID").val();
	var customerNameForSearch = $("#name").val();
	var dobForSearch = $("#dateOfBirth").val();
	var institutionNameForSearch = $("#institutionName").val();
	var incorporationDateForSerach = $("#incorporationDate").val();

	if (((typeof customerNameForSearch != 'undefined' && customerNameForSearch != "") || (typeof dobForSearch != 'undefined' && dobForSearch != ""))
			|| ((typeof institutionNameForSearch != 'undefined' && institutionNameForSearch != "") || (typeof incorporationDateForSerach != 'undefined' && incorporationDateForSerach != ""))) {
		debugger;
		$("#id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id2_id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id4_id4").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id3_id3").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
	}

	if ((typeof mobileNum != 'undefined' && mobileNum == "")
			&& (typeof std != 'undefined' && std == "")
			&& (typeof number != 'undefined' && number == "")
			&& (typeof extn != 'undefined' && extn == "")
			&& (typeof identificationType != 'undefined' && identificationType == "")
			&& (typeof uniqueIdNumber != 'undefined' && uniqueIdNumber == "")
			&& (typeof registrationNumber != 'undefined' && registrationNumber != "")) {
		debugger;
		$("#id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id4_id4").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id2_appsearch_name_dob").children().removeClass('chosen-disabled')
				.css('pointer-events', 'auto');
		$("#id3_id3").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
	}
}
function checkForFifthBlock() {
	var mobileNum = $("#customerMobileNumberID_phoneNumber").val();
	var std = $("#stdCode_landLine_search_p").val();
	var number = $("#phoneNumber_landLine_search_p").val();
	var extn = $("#extension_landLine_search_p").val();
	var identificationType = $("#idType").val();
	var uniqueIdNumber = $("#uniqueIdNumber").val();

	if ($('#individual').is(":checked")) {
		if ((typeof mobileNum != 'undefined' && mobileNum != "")
				|| (typeof std != 'undefined' && std != "")
				|| (typeof number != 'undefined' && number != "")
				|| (typeof extn != 'undefined' && extn != "")
				|| (typeof identificationType != 'undefined' && identificationType != "")
				|| (typeof uniqueIdNumber != 'undefined' && uniqueIdNumber != "")) {

			$("#id2").children().addClass('chosen-disabled').css(
					'pointer-events', 'none');
			$("#id4_id4").children().addClass('chosen-disabled').css(
					'pointer-events', 'none');
			$("#id3_id3").children().addClass('chosen-disabled').css(
					'pointer-events', 'none');
			$("#id2_appsearch_name_dob").children().addClass('chosen-disabled')
					.css('pointer-events', 'none');
		} else {
			debugger;
			$("#id2").children().removeClass('chosen-disabled').css(
					'pointer-events', 'auto');
			$("#id4_id4").children().removeClass('chosen-disabled').css(
					'pointer-events', 'auto');
			$("#id2_appsearch_name_dob").children().removeClass(
					'chosen-disabled').css('pointer-events', 'auto');
			$("#id3_id3").children().removeClass('chosen-disabled').css(
					'pointer-events', 'auto');
		}

	} else {
		var registrationNumber = $("#registrationNumber").val();
		if ((typeof mobileNum != 'undefined' && mobileNum != "")
				|| (typeof std != 'undefined' && std != "")
				|| (typeof number != 'undefined' && number != "")
				|| (typeof extn != 'undefined' && extn != "")
				|| (typeof identificationType != 'undefined' && identificationType != "")
				|| (typeof uniqueIdNumber != 'undefined' && uniqueIdNumber != "")
				|| (typeof registrationNumber != 'undefined' && registrationNumber != "")) {

			$("#id2").children().addClass('chosen-disabled').css(
					'pointer-events', 'none');
			$("#id4_id4").children().addClass('chosen-disabled').css(
					'pointer-events', 'none');
			$("#id3_id3").children().addClass('chosen-disabled').css(
					'pointer-events', 'none');
			$("#id2_appsearch_name_dob").children().addClass('chosen-disabled')
					.css('pointer-events', 'none');
		} else {
			debugger;
			$("#id2").children().removeClass('chosen-disabled').css(
					'pointer-events', 'auto');
			$("#id4_id4").children().removeClass('chosen-disabled').css(
					'pointer-events', 'auto');
			$("#id2_appsearch_name_dob").children().removeClass(
					'chosen-disabled').css('pointer-events', 'auto');
			$("#id3_id3").children().removeClass('chosen-disabled').css(
					'pointer-events', 'auto');
		}

	}
}
function checkForThirdBlock() {
	var customerIdForSearch = $("#customer_ID").val();
	var cifIdForSearch = $("#cifNumberID").val();
	if ((typeof customerIdForSearch != 'undefined' && customerIdForSearch != "")
			|| (typeof cifIdForSearch != 'undefined' && cifIdForSearch != "")) {

		$("#id2").children().addClass('chosen-disabled').css('pointer-events',
				'none');
		$("#id3_id3").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
		$("#id2_appsearch_name_dob").children().addClass('chosen-disabled')
				.css('pointer-events', 'none');
		$("#id2_id2").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
	} else {
		debugger;
		$("#id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id3_id3").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id2_appsearch_name_dob").children().removeClass('chosen-disabled')
				.css('pointer-events', 'auto');
		$("#id2_id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');

	}
}
function checkForFourthBlock() {
	var customerNameForSearch = $("#name").val();
	var dobForSearch = $("#dateOfBirth").val();
	var institutionNameForSearch = $("#institutionName").val();
	var incorporationDateForSerach = $("#incorporationDate").val();
	if (((typeof customerNameForSearch != 'undefined' && customerNameForSearch != "") || (typeof dobForSearch != 'undefined' && dobForSearch != ""))
			|| ((typeof institutionNameForSearch != 'undefined' && institutionNameForSearch != "") || (typeof incorporationDateForSerach != 'undefined' && incorporationDateForSerach != ""))) {

		$("#id2").children().addClass('chosen-disabled').css('pointer-events',
				'none');
		$("#id4_id4").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
		$("#id3_id3").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
		$("#id2_id2").children().addClass('chosen-disabled').css(
				'pointer-events', 'none');
	} else {
		debugger;
		$("#id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id4_id4").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id3_id3").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');
		$("#id2_id2").children().removeClass('chosen-disabled').css(
				'pointer-events', 'auto');

	}
}