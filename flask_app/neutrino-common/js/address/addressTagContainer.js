if (viewMode == 'true') {
	$('#mobileNumberselect').attr('disabled', 'disabled');
}
 /*
 * in case of Agriculture Land address type ,neither Duration At Current Address nor Duration At Current city is
 * mandatory
 */
 var addrTypeAgri=$('#addressTypeAgriculture option:selected').attr('data-code');
 if(addrTypeAgri == 'Agricultural Land'){
    $("#address_noOfYearsAtCurrentAdress")
            .removeClass("required");
    $("#address_noOfMonthsAtCurrentAdress")
            .removeClass("required");
    $("#address_yearsInCurrentCity")
            .removeClass("required");
    $("#address_monthsInCurrentCity")
            .removeClass("required");
    $("#current_address_span").hide();
    $("#current_city_span").hide();
 }

var parentEntityName = $('#parentId').val();
var customerType;
setTimeout(function() {
	toggleAdditionalDivsOnDefaultISO();	
}, 500);

function onCountryChange_country() {
	var selectID;
	var phoneTagID;
	var selectIDSubstring;

	$('#address_detail_body').find('[id$=select]').each(
			function() {
				selectID = $(this).attr("id");
				selectIDSubstring = selectID.substring(selectID.length - 7,
						selectID.length);
				if (selectIDSubstring == "_select") {
					phoneTagID = selectID.substring(0, selectID.length - 7);
				} else {
					phoneTagID = selectID.substring(0, selectID.length - 6);
				}
				forcePopulateValuesForPhone(phoneTagID, $(
						'#text_country option:selected').attr('data-code'));
			});

}

function toggleAdditionalDivsOnDefaultISO() {
	var additionalInfoLandMarkDivView = document
			.getElementById("additionalInfoLandMarkDivView");
	var additionalInfoLandMarkDivEdit = document
			.getElementById("additionalInfoLandMarkDivEdit");
	var additionalInfoCurrentCityDivView = document
			.getElementById("additionalInfoCurrentCityDivView");
	var additionalInfoCurrentCityDivEdit = document
			.getElementById("additionalInfoCurrentCityDivEdit");
	var addressAdditionalPhoneNumberDivView = document
			.getElementById("addressAdditionalPhoneNumberDivView");
	var addressAdditionalPhoneNumberDivEdit = document
			.getElementById("addressAdditionalPhoneNumberDivEdit");
	var additionalInfoCurrentAddressDivView = document
			.getElementById("additionalInfoCurrentAddressDivView");
	var additionalInfoCurrentAddressDivEdit = document
			.getElementById("additionalInfoCurrentAddressDivEdit");

	if ($('#text_country option:selected').attr('data-code') == 'SAU') {
		$(additionalInfoLandMarkDivView).hide();
		$(additionalInfoLandMarkDivEdit).hide();
		$(additionalInfoCurrentCityDivView).hide();
		$(additionalInfoCurrentCityDivEdit).hide();
		$(addressAdditionalPhoneNumberDivView).hide();
		$(addressAdditionalPhoneNumberDivEdit).hide();
	} else {
		$(additionalInfoLandMarkDivView).show();
		$(additionalInfoLandMarkDivEdit).show();
		$(additionalInfoCurrentCityDivView).show();
		$(additionalInfoCurrentCityDivEdit).show();
		$(addressAdditionalPhoneNumberDivView).show();
		$(addressAdditionalPhoneNumberDivEdit).show();
		$(additionalInfoCurrentAddressDivView).show();
		$(additionalInfoCurrentAddressDivEdit).show();
	}

}
// Mandatory check to be there on std and middle no. only and not on extension.
function checkPrimaryPhone() {
	var stdCode = $("input[id^='stdCode_phoneNumberList']");
	var phoneNum = $("input[id^='phoneNumber_phoneNumberList']");
	var extn = $("input[id^='extension_phoneNumberList']");
	var mobilePhone = $("input[id^='phoneNumberList']").filter(
			"input[id$='_phoneNumber']");

	var currAddType = $('#addressType option:selected').attr('data-code');
	var primaryPhoneFlag = false;

	if ((stdCode.val() && phoneNum.val()) || mobilePhone.val()) {
		primaryPhoneFlag = true;
	} else {
		primaryPhoneFlag = false;
	}

	// validation for primary phone if both phone and mobile numbers are entered
	if (mobilePhone.val()) {
		if (stdCode.val() && phoneNum.val()) {
			primaryPhoneFlag = true;
		} else {
			primaryPhoneFlag = false;
		}

	}

	if (currAddType == 'OfficeAddress' || currAddType == 'ResidentialAddress'
			|| currAddType == 'AlternateBusinessAddress') {
		if ((stdCode.val() == "" && phoneNum.val() == "" && extn.val() == "")
				&& mobilePhone.val()) {

			primaryPhoneFlag = true;
		}

		if ((stdCode.val() != "" && phoneNum.val() == "" && extn.val() == "")
				&& mobilePhone.val()) {

			primaryPhoneFlag = true;
		}

	}

	return primaryPhoneFlag;
}

function checkPhoneorMobile() {

	var stdCode = $("input[id^='stdCode_phoneNumberList']");
	var phoneNum = $("input[id^='phoneNumber_phoneNumberList']");
	var extn = $("input[id^='extension_phoneNumberList']");
	var mobilePhone = $("input[id^='phoneNumberList']").filter(
			"input[id$='_phoneNumber']");

	var currAddType = $('#addressType option:selected').attr('data-code');
	var phoneorMobileFlag = true;

	// validation for phone number if both phone and mobile numbers are empty
	if (currAddType == 'OfficeAddress' || currAddType == 'ResidentialAddress'
			|| currAddType == 'AlternateBusinessAddress') {
		if ((stdCode.val() == "" && phoneNum.val() == "" && extn.val() == "")
				&& mobilePhone.val() == "") {
			phoneorMobileFlag = false;
		}
	}
	return phoneorMobileFlag;
}

/*
 * Validation=> Duration at current city should be more than duration at current
 * address
 */
function validCityYearsNumber(value) {
	var durAtCurrAddressYr = $("#address_noOfYearsAtCurrentAdress").val();
	var currAddType = $('#addressType option:selected').attr('data-code');
	if (value && $.trim(value) != "") {
		var currAddressYrVal = parseInt(durAtCurrAddressYr);
		var enteredValue = parseInt(value);
		// check years

		if (enteredValue > currAddressYrVal) {
			$('#address_yearsInCurrentCity-control-group')
					.removeClass('error2');
			$('#address_monthsInCurrentCity-control-group').removeClass(
					'error2');
			return true;
		} else if (enteredValue < currAddressYrVal) {
			$('#address_yearsInCurrentCity-control-group').removeClass(
					'success').addClass('error2');
			$('#address_monthsInCurrentCity-control-group').removeClass(
					'success').addClass('error2');
			return false;
		} else {
			// Compare months
			var durAtCurrAddMnths = $("#address_noOfMonthsAtCurrentAdress")
					.val();
			var durAtCurrCityMnths = $("#address_monthsInCurrentCity").val();
			if (durAtCurrAddMnths && durAtCurrCityMnths) {
				var cityMnthVal = parseInt(durAtCurrCityMnths);
				var addMnthVal = parseInt(durAtCurrAddMnths);
				if (cityMnthVal == addMnthVal) {
					return true;
				}
				return ((cityMnthVal > addMnthVal) ? true : false);
			}

		}
	} else {
		return true;
	}

}

function doneButton() {
	$('#addressType').trigger('change');
	var stdCode = $("input[id^='stdCode_phoneNumberList']");
	var phoneNum = $("input[id^='phoneNumber_phoneNumberList']");
	var mobilePhone = $("input[id^='phoneNumberList']").filter(
			"input[id$='_phoneNumber']");
	$("#addressTagDetails").valid();
	$("#addressTagDetails")
			.validate(
					{

						errorClass : "help-block",
						errorElement : "span",
						highlight : function(element, errorClass, validClass) {

							if ($(element).parents().eq(3).hasClass(
									"phone_tag_top")) {
								if (($(element).val().length < 10)
										&& $(element).val().length > 0) {
									$(element).parents('.form-group')
											.addClass('error');
									$(element).parents('.form-group')
											.removeClass('success');
									$(element).parents().eq(1).children().eq(4)
											.children().eq(0).removeClass(
													'help-block');
								} else if ($(element).val().length == 0) {
									$(element).parents('.form-group')
											.addClass('error');
									$(element).parents('.form-group')
											.removeClass('success');
									$(element).parents().eq(1).children().eq(4)
											.children().eq(0).addClass(
													'help-block');
								}

							} else {

								$(element).parents('.form-group').addClass(
										'error');
								$(element).parents('.form-group')
										.removeClass('success');
							}

							/*
							 * if($(element).parents('.outset-shadow-focus').length <
							 * 1 ){
							 * $(element).parents('.form-group').addClass('outset-shadow-focus
							 * clearfix'); }
							 */

						},
						unhighlight : function(element, errorClass, validClass) {

							// $(element).parents('.form-group').removeClass('outset-shadow-focus
							// clearfix');
							if ($(element).parents().eq(2).hasClass(
									"phone_tag_top")) {
								if (!($(element).attr("id").indexOf('isdCode') > -1)
										&& !($(element).attr("id").indexOf(
												'extension') > -1)) {
									$(element).parents('.form-group')
											.removeClass('error');
									$(element).parents('.form-group')
											.addClass('success');
								}

							} else if ($(element).parents().eq(3).hasClass(
									"phone_tag_top")) {
								var isPhoneValid = validPhoneNumber(
										$(element).parents().eq(1).children()
												.eq(2).val(), element);
								if (($(element).val().length == 10)
										&& isPhoneValid == true) {
									$(element).parents().eq(3).find(
											'.help-block').css('display',
											'none');
									$(element).parents().eq(1).children().eq(4)
											.children().eq(0).removeClass(
													'help-block');
									$(element).parents('.form-group')
											.removeClass('error');
									$(element).parents('.form-group')
											.addClass('success');
									$(element).removeClass("error");

								} else if (($(element).val().length < 10)
										&& ($(element).val().length > 0)) {
									$(element).parents().eq(1).children().eq(4)
											.children().eq(0).removeClass(
													'help-block');
								} else if (($(element).val().length = 0)) {
									$(element).parents().eq(1).children().eq(4)
											.children().eq(0).addClass(
													'help-block');
								} else {
									$(element).parents().eq(1).children().eq(4)
											.children().eq(0).remove(
													'help-block');
								}
							}

							else {
								$(element).parents('.form-group').addClass(
										'success');
								$(element).parents('.form-group')
										.removeClass('error');
							}

						},
						invalidHandler : function(form, validator) {
							$.sticky(error_message, {
								autoclose : 5000,
								position : "top-right",
								type : "st-error"
							});
						}

					});
	var currentValue = $('#address_yearsInCurrentCity').val();
	var validCityYearsNumberFlag = validCityYearsNumber(currentValue);
	var cityYearsNumber = true;
	if (validCityYearsNumberFlag) {
		cityYearsNumber = true;
	} else {
		cityYearsNumber = false;
	}
	var currAddType = $('#addressType option:selected').attr('data-code');
	var flagForPhones = checkPrimaryPhone();
	var flagforMobileorPhone = checkPhoneorMobile();
	var phoneNumberGiven = true;

	$('#extension_phoneNumberList_new1').removeClass("required");
	if (flagForPhones) {
		phoneNumberGiven = true;
	} else {
		phoneNumberGiven = false;
	}
	if (cityYearsNumber == false) {
		$.sticky(cityYears_cant_be_less_than_currentAddress_duration, {
			autoclose : 5000,
			position : "top-right",
			type : "st-error"
		});
		
		return false;
	} else {
		if (phoneNumberGiven == true) {
			// Validate entered pincode
			if ($('#Text_postalCode_country').val()) {
				$
						.ajax({
							url : getContextPath()
									+ "/app/AddressTag/validateAddressPincodeOnSave",

							data : "requestedZipCode="
									+ $('#Text_postalCode_country').val(),
							success : function(response) {

								if (response == "false" || response == false) {

									$('#Text_postalCode_country').val("");
									new PNotify({
										title : "Failure",
										text : "Invalid PinCode",
										type : "error"
									});
								} else {
									// saveToSession();

								}

							},
							error : function(jqXHR, textStatus, errorThrown) {
								alert(jqXHR + " : " + textStatus + " : "
										+ errorThrown);
							}
						});

			}
		} else {

			if ($('#text_country option:selected').attr('data-code') == 'IND') {
				if ((currAddType == 'OfficeAddress' && customerType == "non_individual")
						|| (currAddType == 'ResidentialAddress' && customerType == "individual")
						|| (currAddType == 'AlternateBusinessAddress' && customerType == "non_individual")) {
					if (!flagforMobileorPhone || phoneNum.val() == ""
							&& mobilePhone.val() == "") {
						$.sticky(primary_phone_or_mobile_required, {
							autoclose : 5000,
							position : "top-right",
							type : "st-error"
						});
					}

					else if (stdCode.val() == "" && phoneNum.val() == "") {
						$.sticky("Invalid Primary Phone Number", {
							autoclose : 5000,
							position : "top-right",
							type : "st-error"
						});
					}
				}
			}

			/*
			 * in case of permanent address ,neither of phone nor mobile is
			 * mandatory
			 */
			if (currAddType == 'PermanentAddress'
					|| (currAddType == 'OfficeAddress' && customerType == "individual")
					|| (currAddType == 'AlternateBusinessAddress' && customerType == "individual")
					|| (currAddType == 'ResidentialAddress' && customerType == "non_individual")) {
				if ($('#Text_postalCode_country').val()) {
					$
							.ajax({
								url : getContextPath()
										+ "/app/AddressTag/validateAddressPincodeOnSave",

								data : "requestedZipCode="
										+ $('#Text_postalCode_country').val(),
								success : function(response) {

									if (response == "false"
											|| response == false) {

										$('#Text_postalCode_country').val("");
										new PNotify({
											title : "Failure",
											text : "Invalid PinCode",
											type : "error"
										});
									} else {

										// saveToSession();

									}

								},
								error : function(jqXHR, textStatus, errorThrown) {
									alert(jqXHR + " : " + textStatus + " : "
											+ errorThrown);
								}
							});// ajax

				}
			}

		}

	}
	saveToSession();
}
function updateChosenTagField(dd) {
	$(dd).trigger("chosen:updated");
}
$(document)
		.ready(
				function() {
					$('#text_country').attr('title', 'Country');
					$(".phone_tag_top").css("margin-right",0);

					if (($('#addressType option:selected').attr('data-code') == 'AdditionalAddress')) {
						$("#purposeDiv").removeClass("hidden");
						$("#purpose").addClass("required");
					} else {
						$("#purpose").removeClass("required");
						$("#purposeDiv").addClass("hidden");
					}
					var specialKeys = new Array();
					specialKeys.push(8); // Backspace
					$(function() {
						$("div.phone_tag_top")
								.find("input")
								.on(
										"keypress",
										function(e) {
											if ($(this).hasClass("digits")) {
												var keyCode = e.which ? e.which
														: e.keyCode
												if (keyCode != 9
														&& keyCode != 37
														&& keyCode != 39
														&& keyCode != 46) {
													var ret1 = ((keyCode >= 48 && keyCode <= 57) || specialKeys
															.indexOf(keyCode) != -1);
													var ret2 = (keyCode == 99 || 118);
													return (ret1 || ret2);
												}
											}
										});

					});

					$("#addressTagDetails")
							.validate(
									{
										errorClass : "help-block",
										errorElement : "span",
										highlight : function(element,
												errorClass, validClass) {

											if ($(element).parents().eq(3)
													.hasClass("phone_tag_top")) {
												if (($(element).val().length < 10)
														&& $(element).val().length > 0) {
													$(element).parents(
															'.form-group')
															.addClass('error');
													$(element).parents(
															'.form-group')
															.removeClass(
																	'success');
													$(element)
															.parents()
															.eq(1)
															.children()
															.eq(4)
															.children()
															.eq(0)
															.removeClass(
																	'help-block');
												} else if ($(element).val().length == 0) {
													$(element).parents(
															'.form-group')
															.addClass('error');
													$(element).parents(
															'.form-group')
															.removeClass(
																	'success');
													$(element)
															.parents()
															.eq(1)
															.children()
															.eq(4)
															.children()
															.eq(0)
															.addClass(
																	'help-block');
												}

											} else {

												$(element).parents(
														'.form-group')
														.addClass('error');
												$(element).parents(
														'.form-group')
														.removeClass('success');
											}

											/*
											 * if($(element).parents('.outset-shadow-focus').length <
											 * 1 ){
											 * $(element).parents('.form-group').addClass('outset-shadow-focus
											 * clearfix'); }
											 */

										},
										unhighlight : function(element,
												errorClass, validClass) {

											// $(element).parents('.form-group').removeClass('outset-shadow-focus
											// clearfix');
											if ($(element).parents().eq(2)
													.hasClass("phone_tag_top")) {
												if (!($(element).attr("id")
														.indexOf('isdCode') > -1)
														&& !($(element).attr(
																"id").indexOf(
																'extension') > -1)) {
													$(element).parents(
															'.form-group')
															.removeClass(
																	'error');
													$(element)
															.parents(
																	'.form-group')
															.addClass('success');
												}

											} else if ($(element).parents().eq(
													3)
													.hasClass("phone_tag_top")) {
												var isPhoneValid = validPhoneNumber(
														$(element).parents()
																.eq(1)
																.children().eq(
																		2)
																.val(), element);
												if (($(element).val().length == 10)
														&& isPhoneValid == true) {
													$(element)
															.parents()
															.eq(3)
															.find(
																	'.help-block')
															.css('display',
																	'none');
													$(element)
															.parents()
															.eq(1)
															.children()
															.eq(4)
															.children()
															.eq(0)
															.removeClass(
																	'help-block');
													$(element).parents(
															'.form-group')
															.removeClass(
																	'error');
													$(element)
															.parents(
																	'.form-group')
															.addClass('success');
													$(element).removeClass(
															"error");

												} else if (($(element).val().length < 10)
														&& ($(element).val().length > 0)) {
													$(element)
															.parents()
															.eq(1)
															.children()
															.eq(4)
															.children()
															.eq(0)
															.removeClass(
																	'help-block');
												} else if (($(element).val().length = 0)) {
													$(element)
															.parents()
															.eq(1)
															.children()
															.eq(4)
															.children()
															.eq(0)
															.addClass(
																	'help-block');
												} else {
													$(element)
															.parents()
															.eq(1)
															.children()
															.eq(4)
															.children()
															.eq(0)
															.remove(
																	'help-block');
												}
											}

											else {
												$(element).parents(
														'.form-group')
														.addClass('success');
												$(element).parents(
														'.form-group')
														.removeClass('error');
											}

										},
										invalidHandler : function(form,
												validator) {
											$.sticky(error_message, {
												autoclose : 5000,
												position : "top-right",
												type : "st-error"
											});
										}

									});

					if (parentEntityName === "BusinessPartner") {
						console
								.log("Removing other address types but OfficeAddress");
						$("#addressType").find("option").each(function() {
							if ($(this).data("code") !== "OfficeAddress") {
								$(this).remove();
							}
						});

						$("#address_landmark").removeClass("required");
						$("#addressLandmark").hide();
						$("#current_address_span").hide();
                        $("#current_city_span").hide();
                        
            				if( bpType!='Manufacturer'){			
            						$("#gstIn-control-group").remove();
            					
            				}
            			
					}
					
					if(parentEntityName === "Customer" && customerType==="non_individual"){
						console
								.log("Removing other address types for non individual customer except OfficeAddress");
						$("#addressType").find("option").each(function() {
							if ($(this).data("code") !== "OfficeAddress") {
								$(this).remove();
							}
						});
					}
							if (parentEntityName === "University") {
						console
						.log("Removing other address types but OfficeAddress");
						$("#addressType").find("option").each(function() {
							if ($(this).data("code") !== "OfficeAddress") {
								$(this).remove();
							}
						});

						$("#address_landmark").removeClass("required");
						$("#addressLandmark").hide();
					}
					//college entry
					if (parentEntityName === "College") {
						console.log("Removing other address types but OfficeAddress and AlternateBusinessAddress");
						$("#addressType").find("option").each(function() {
							if ($(this).data("code") !== "OfficeAddress" && $(this).data("code") !== "AlternateBusinessAddress") {
								$(this).remove();
							}

						});
						$("#address_landmark").removeClass("required");
						$("#addressLandmark").hide();

					}
					 if (parentEntityName == "College" && !(addressId)) {
						$('#addressType option').each(function() {
							if ($(this).attr('data-code') == 'OfficeAddress') {
								$(this).attr("selected", "selected");
							}
						});
					 }

					 //Employer entry
                     if (parentEntityName === "Employer") {
                         console.log("Removing other address types but OfficeAddress");
                         $("#addressType").find("option").each(function() {
                             if ($(this).data("code") !== "OfficeAddress") {
                                 $(this).remove();
                             }
                             $("#current_address_span").hide();
                             $("#current_city_span").hide();

                         });
                         $("#address_landmark").removeClass("required");
                         $("#addressLandmark").hide();
                     }

                     if (parentEntityName == "Employer" && !(addressId)) {
                         $('#addressType option').each(function() {
                             if ($(this).attr('data-code') == 'OfficeAddress') {
                                 $(this).attr("selected", "selected");
                             }
                         });
                     }
					 
					 if (parentEntityName === "SelfHelpPromotingInst") {
							console.log("Removing other address types but OfficeAddress");
							$("#addressType").find("option").each(function() {
								if ($(this).data("code") !== "OfficeAddress") {
									$(this).remove();
								}

							});
							$("#address_landmark").removeClass("required");
							$("#addressLandmark").hide();
							$("#address_noOfYearsAtCurrentAdress")
							.removeClass("required");
							$("#address_noOfMonthsAtCurrentAdress")
							.removeClass("required");

						}
						 if (parentEntityName == "SelfHelpPromotingInst" && !(addressId)) {
							$('#addressType option').each(function() {
								if ($(this).attr('data-code') == 'OfficeAddress') {
									$(this).attr("selected", "selected");
								}
							});
						 }
					// Mark months at current address as 0 when nothing is
					// specfied in months field
					$("#address_noOfYearsAtCurrentAdress").change(
							function() {
								var monthsVal = $(
										"#address_noOfMonthsAtCurrentAdress")
										.val();
								if (!monthsVal) {
									$("#address_noOfMonthsAtCurrentAdress")
											.val(0);
								}
							});

					// Mark months at current city as 0 when nothing is specfied
					// in months field
					$("#address_yearsInCurrentCity").change(
							function() {

								var monthsVal = $(
										"#address_monthsInCurrentCity").val();
								if (!monthsVal) {
									$("#address_monthsInCurrentCity").val(0);
								}
							});

					// To nullify the effect of required class
					$("#address_monthsInCurrentCity ").change(
							function() {
								var monthsVal = $(
										"#address_monthsInCurrentCity").val();
								if (!monthsVal) {
									$("#address_monthsInCurrentCity").val(0);
									$("#address_monthsInCurrentCity")
											.removeClass("required");
									$("#address_yearsInCurrentCity").focusin()
											.focusout();
								}
							});

					$("#address_monthsInCurrentCity ").on(
							"focusin",
							function() {

								$("#address_yearsInCurrentCity").parent("div")
										.children("label.error").hide();

							});

					$("#address_monthsInCurrentCity ").on(
							"focusout",
							function() {
								$("#address_yearsInCurrentCity").focusin()
										.focusout();

							});

					$('#text_country')
							.on(
									'change',
									function() {
										var countryISOCode = $(
												'#text_country option:selected')
												.attr('data-code');
										var additionalInfoLandMarkDivView = document
												.getElementById("additionalInfoLandMarkDivView");
										var additionalInfoLandMarkDivEdit = document
												.getElementById("additionalInfoLandMarkDivEdit");
										var additionalInfoCurrentCityDivView = document
												.getElementById("additionalInfoCurrentCityDivView");
										var additionalInfoCurrentCityDivEdit = document
												.getElementById("additionalInfoCurrentCityDivEdit");
										var addressAdditionalPhoneNumberDivView = document
												.getElementById("addressAdditionalPhoneNumberDivView");
										var addressAdditionalPhoneNumberDivEdit = document
												.getElementById("addressAdditionalPhoneNumberDivEdit");
										var additionalInfoCurrentAddressDivView = document
												.getElementById("additionalInfoCurrentAddressDivView");
										var additionalInfoCurrentAddressDivEdit = document
												.getElementById("additionalInfoCurrentAddressDivEdit");

										setResidentialAsDefault(countryISOCode);
										setResidenceRelatedFieldsrequired(countryISOCode);
										if (countryISOCode == 'SAU') {
											$(additionalInfoLandMarkDivView)
													.hide();
											$(additionalInfoLandMarkDivEdit)
													.hide();
											$(additionalInfoCurrentCityDivView)
													.hide();
											$(additionalInfoCurrentCityDivEdit)
													.hide();
											$(
													addressAdditionalPhoneNumberDivView)
													.hide();
											$(
													addressAdditionalPhoneNumberDivEdit)
													.hide();

											$(".da_cad1").removeClass(
													"mandatory").addClass(
													"nonMandatory");
											$(
													"#address_noOfYearsAtCurrentAdress-control-group")
													.removeClass("mandatory")
													.addClass("nonMandatory");
											$(
													"#address_noOfMonthsAtCurrentAdress-control-group")
													.removeClass("mandatory")
													.addClass("nonMandatory");
											$(".da_ccity1").removeClass(
													"mandatory").addClass(
													"nonMandatory");
											$(
													"#address_yearsInCurrentCity-control-group")
													.removeClass("mandatory")
													.addClass("nonMandatory");
											$(
													"#address_monthsInCurrentCity-control-group")
													.removeClass("mandatory")
													.addClass("nonMandatory");

											$(
													"#address_noOfYearsAtCurrentAdress")
													.removeClass("required");
											$(
													"#address_noOfMonthsAtCurrentAdress")
													.removeClass("required");
											$("#address_yearsInCurrentCity")
													.removeClass("required");
											$("#address_monthsInCurrentCity")
													.removeClass("required");
											$("#current_address_span").hide();
											$("#current_city_span").hide();
											$(
													'#phoneNumberList_new1_phoneNumber')
													.val('');
											$("#address_landmark").removeClass(
													"required");
											$("#addressLandmark").hide();
										} else {
											$(additionalInfoLandMarkDivView)
													.show();
											$(additionalInfoLandMarkDivEdit)
													.show();
											$(additionalInfoCurrentCityDivView)
													.show();
											$(additionalInfoCurrentCityDivEdit)
													.show();
											$(
													addressAdditionalPhoneNumberDivView)
													.show();
											$(
													addressAdditionalPhoneNumberDivEdit)
													.show();
											$(
													additionalInfoCurrentAddressDivView)
													.show();
											$(
													additionalInfoCurrentAddressDivEdit)
													.show();
										}
									});

					$("#addressType")
							.change(
									function() {

										if (($('#addressType option:selected')
												.attr('data-code') == 'AdditionalAddress')) {
											$("#purposeDiv").removeClass(
													"hidden");
											$("#purpose").addClass("required");
										} else {
											$("#purpose").removeClass(
													"required");
											$("#purposeDiv").addClass("hidden");
										}

										if ($('#text_country option:selected')
												.attr('data-code') == 'IND') {

											// For DCB modifying landmark to
											// mandatory for residential Address
											if (parentEntityName == "Customer"
													&& ($(
															'#addressType option:selected')
															.attr('data-code') == 'ResidentialAddress')
													&& (casClient == "dcb")) {
												$("#address_landmark")
														.addClass("required");
												$("#addressLandmark").html("*");
												$("#addressLandmark").addClass(
														"color-red");
												$("#addressLandmark").show();
											} else if (casClient == "icici")// for
											// ICICI
											// modifying
											// landmark
											// to
											// mandatory
											// field
											{
												$("#address_landmark")
														.addClass("required");
												$("#addressLandmark").show();
											} else {

												if (($(
														'#addressType option:selected')
														.attr('data-code') == 'ResidentialAddress')
														|| ($(
																'#addressType option:selected')
																.attr(
																		'data-code') == 'PermanentAddress')) {

													$(".da_cad1")
															.removeClass(
																	"nonMandatory")
															.addClass(
																	"mandatory")
															.css('display',
																	'block');
													$(
															"#address_noOfYearsAtCurrentAdress-control-group")
															.removeClass(
																	"nonMandatory")
															.css('display',
																	'block');
													$(
															"#address_noOfMonthsAtCurrentAdress-control-group")
															.removeClass(
																	"nonMandatory")
															.css('display',
																	'block');

													$(".da_ccity1")
															.removeClass(
																	"nonMandatory")
															.addClass(
																	"mandatory")
															.css('display',
																	'block')
															.css('display',
																	'block');
													$(
															"#address_yearsInCurrentCity-control-group")
															.removeClass(
																	"nonMandatory")
															.addClass(
																	"mandatory")
															.css('display',
																	'block');
													$(
															"#address_monthsInCurrentCity-control-group")
															.removeClass(
																	"nonMandatory")
															.addClass(
																	"mandatory")
															.css('display',
																	'block');

													$(
															"#address_noOfYearsAtCurrentAdress")
															.addClass(
																	"required");
													$(
															"#address_noOfMonthsAtCurrentAdress")
															.addClass(
																	"required");
													$(
															"#address_yearsInCurrentCity")
															.addClass(
																	"required");
													$(
															"#address_monthsInCurrentCity")
															.addClass(
																	"required");

													$("#current_address_span")
															.show();
													$("#current_city_span")
															.show();
												}
												// End
												else {

													$(".da_cad1")
															.removeClass(
																	"mandatory")
															.addClass(
																	"nonMandatory");
													$(
															"#address_noOfYearsAtCurrentAdress-control-group")
															.removeClass(
																	"mandatory")
															.addClass(
																	"nonMandatory");
													$(
															"#address_noOfMonthsAtCurrentAdress-control-group")
															.removeClass(
																	"mandatory")
															.addClass(
																	"nonMandatory");

													$(".da_ccity1")
															.removeClass(
																	"mandatory")
															.addClass(
																	"nonMandatory");
													$(
															"#address_yearsInCurrentCity-control-group")
															.removeClass(
																	"mandatory")
															.addClass(
																	"nonMandatory");
													$(
															"#address_monthsInCurrentCity-control-group")
															.removeClass(
																	"mandatory")
															.addClass(
																	"nonMandatory");

													$(
															"#address_noOfYearsAtCurrentAdress")
															.removeClass(
																	"required");
													$(
															"#address_noOfMonthsAtCurrentAdress")
															.removeClass(
																	"required");
													$(
															"#address_yearsInCurrentCity")
															.removeClass(
																	"required");
													$(
															"#address_monthsInCurrentCity")
															.removeClass(
																	"required");
													$("#current_address_span")
															.hide();
													$("#current_city_span")
															.hide();
													$("#address_landmark")
															.removeClass(
																	"required");

													$("#addressLandmark")
															.hide();

												}
											}

											if (parentEntityName == "Customer") {
												var selected_address_typeValue = $(
														'#addressType option:selected')
														.attr('data-code');

												// Modification for DCB -
												// District, Village and taluka
												// to be made mandatory
												if (selected_address_typeValue == 'ResidentialAddress'
														|| selected_address_typeValue == 'OfficeAddress'
														|| selected_address_typeValue == 'AlternateBusinessAddress') {
													if (productTypeName
															&& productTypeName == "<%=ProductType.MICRO_HOUSING_LOAN%>") {
														$(
																"#Text_village_country")
																.addClass(
																		"required");
														/* $("#district_country").addClass("required"); */
														updateChosenTagField('district_country');
														$(
																"#talukaToBeAddedInput_country")
																.addClass(
																		"required");
														if ($(
																"#talukaToBeAdded")
																.parent()
																.find(
																		'label > span').length == 0) {
															$(
																	"#talukaToBeAdded")
																	.parent()
																	.find(
																			'label')
																	.append(
																			"<span class='color-red'>*</span>");
															/*
															 * $("#district_country").parent().find('label').append("<span
															 * class='color-red'>*</span>");
															 */
														}

													} else {
														$(
																"#Text_village_country")
																.removeClass(
																		"required");
														$("#district_country")
																.removeClass(
																		"required");
														updateChosenTagField('district_country');
														$(
																"#talukaToBeAdded_country")
																.removeClass(
																		"required");
														$(
																"#talukaToBeAddedInput_country")
																.removeClass(
																		"required");
													}
												} else {

													$("#Text_village_country")
															.removeClass(
																	"required");
													$("#district_country")
															.removeClass(
																	"required");
													$("#district_country_chosen")
															.removeClass(
																	"required");
													$("#district_country")
															.parent().find(
																	"label > span")
															.remove();
													$(
															"#talukaToBeAddedInput_country")
															.removeClass(
																	"required");
													$("#talukaToBeAdded")
															.parent().find(
																	"span")
															.remove();

												}
												// End of Modification for DCB -
												// District, Village and taluka
												// to be made mandatory

												if (selected_address_typeValue == 'ResidentialAddress') {

													// Mark years at current
													// city mandatory for
													// Residential address type
													// and for Mortgage and
													// micro housing loan
													// product type
													if (productTypeName) {
														if (productTypeName == "<%=ProductType.MORTGAGE_LOAN%>") {
															$(
																	"#address_yearsInCurrentCity")
																	.addClass(
																			"required");
															$(
																	"#current_address_span")
																	.show();
															$(
																	"#current_city_span")
																	.show();
														} else {
															$(
																	"#address_yearsInCurrentCity")
																	.removeClass(
																			"required");
															$(
																	"#current_address_span")
																	.hide();
															$(
																	"#current_city_span")
																	.hide();
														}
													}

													// Mark years at current
													// address mandatory for
													// Residential Address type
													// for All Product types
													$(
															"#address_noOfYearsAtCurrentAdress")
															.addClass(
																	"required");
													$(
															"#address_noOfMonthsAtCurrentAdress")
															.addClass(
																	"required");
													$(
															"#address_yearsInCurrentCity")
															.addClass(
																	"required");
													$(
															"#address_monthsInCurrentCity")
															.addClass(
																	"required");
													$("#current_address_span")
															.show();
													$("#current_city_span")
															.show();
												} else {
													// Mark years at current
													// city mandatory for
													// Residential address type
													// and for Mortgage and
													// micro housing loan
													// product type
													$(
															"#address_yearsInCurrentCity")
															.removeClass(
																	"required");
													$(
															"#address_monthsInCurrentCity")
															.removeClass(
																	"required");
													// Mark years at current
													// address mandatory for
													// Residential Address type
													// for All Product types
													$(
															"#address_noOfYearsAtCurrentAdress")
															.removeClass(
																	"required");
													$(
															"#address_noOfMonthsAtCurrentAdress")
															.removeClass(
																	"required");
													$("#current_address_span")
															.hide();
													$("#current_city_span")
															.hide();

													// to recheck the status of
													// the validation msgs,
													// based on required class,
													// and which address type
													// has been selected in drop
													// down

													$(
															"#address_noOfYearsAtCurrentAdress")
															.valid();
													$(
															"#address_noOfMonthsAtCurrentAdress")
															.valid();
													$(
															"#address_yearsInCurrentCity")
															.valid();
													$(
															"#address_monthsInCurrentCity")
															.valid();
													$("#address_landmark")
															.valid();

												}

											}
										}

									});
					$("#address_noOfMonthsAtCurrentAdress").change(
							function() {
								var yearsVal = $(
										"#address_noOfYearsAtCurrentAdress")
										.val();
								if (!yearsVal) {
									$("#address_noOfYearsAtCurrentAdress").val(
											0);
								}
							});

					$("#address_monthsInCurrentCity").change(function() {
						var yearsVal = $("#address_yearsInCurrentCity").val();
						if (!yearsVal) {
							$("#address_yearsInCurrentCity").val(0);
						}
					});

					$("#address_noOfMonthsAtCurrentAdress").change(function() {

					});
					if (parentId != "Customer") {
						$('#save_cust_address_button_div').hide();
					}

					$.validator.addMethod("monthsNumlimit", function(value,
							element) {

						return value < 12;
					}, "* Months number should not exceed 11");

					if (parentId == "Customer") {

						/*
						 * $("#address_noOfYearsAtCurrentAdress").addClass("validYearsNumber");
						 * $("#address_yearsInCurrentCity").addClass("validYearsNumber");
						 */

						if (customerType) {
							if (customerType == "non_individual") {
								$('#addressType option')
										.each(
												function() {
													var employmentAddress = $(
															this).attr(
															'data-code');
													if (employmentAddress == 'OfficeAddress') {
														$(this).attr(
																'selected',
																true);
													} else {
														$(this).addClass(
																'hidden');
													}

												});

							}
							/*
							 * if (customerType == "individual") {
							 * $('#addressType option') .each( function() { var
							 * employmentAddress = $( this).attr( 'data-code');
							 * if (employmentAddress == 'OfficeAddress') {
							 * $(this).addClass( 'hidden'); }
							 * 
							 * });
							 *  }
							 */

						}
					}

					var appId = $("#appId").val();
					// ajax for copy address feature
					if (appId) {

						$
								.ajax({
									url : getContextPath()
									+ "/app/LoanApplication/Address/getAvailableAddress",
									data : ({
										appId : appId
									}),
									type : 'POST',
									async : true,
									success : function(jqXHR) {
										$('#copy_address').html(jqXHR);
										var partySize = $('#sizeOfParty').val();

										var addressSize = $('#sizeOfAddress')
												.val();

										if (partySize > 0 && addressSize > 0
												&& !(viewMode)) {
											$('#copyAnotherAddress')
													.removeClass("hide");
											$('#copyAnotherAddress').show();
											$('#copy_address').hide();

										} else {
											$('#copyAnotherAddress').hide();
											$('#copy_address').hide();
										}

									}
								});

					}
					// show the available address(es)
					$('#copyAnotherAddress').click(function() {
						$('#copy_address').toggle();
						$('#select_address').focus();

					});

					$('#cancel_copy').click(function() {
						$('#copy_address').hide();
					});

					$("#addressDetails").validate(
							{
								errorClass : "help-block",
								errorElement : "span",
								highlight : function(element, errorClass,
										validClass) {
									$(element).parents('.form-group')
											.addClass('error');
									$(element).parents('.form-group')
											.removeClass('success');
								},
								unhighlight : function(element, errorClass,
										validClass) {
									$(element).parents('.form-group')
											.removeClass('error');
									$(element).parents('.form-group')
											.addClass('success');
								},
								invalidHandler : function(form, validator) {
									$.sticky(error_message, {
										autoclose : 5000,
										position : "top-right",
										type : "st-error"
									});
								}
							});
					setResidenceRelatedFieldsrequired($(
							'#text_country option:selected').attr('data-code'));

					function setResidenceRelatedFieldsrequired(countryISOCode) {
						if (countryISOCode == 'IND') {
							if ($('#viewId_country').val() != "true") {
								if ($('#addressType option:selected').attr(
										'data-code') == 'ResidentialAddress') {
									if (parentEntityName == "Customer") {
										$("#address_landmark").addClass(
												"required");
										$("#addressLandmark").html("*");
										$("#addressLandmark").addClass(
												"color-red");
										$("#addressLandmark").show();
									}

									$("#address_noOfYearsAtCurrentAdress")
											.addClass("required");
									$("#address_noOfMonthsAtCurrentAdress")
											.addClass("required");
									$("#address_yearsInCurrentCity").addClass(
											"required");
									$("#address_monthsInCurrentCity").addClass(
											"required");
									$('#accomodationType').removeAttr(
											'disabled');
									$("#current_address_span").show();
									$("#current_city_span").show();
								} else {
									/* $("#address_landmark").removeClass("required"); */
									$('#accomodationType').prop(
											'selectedIndex', 0);
									$('#accomodationType').attr('disabled',
											'disabled');
									$("#address_noOfYearsAtCurrentAdress")
											.removeClass("required");
									$("#address_noOfMonthsAtCurrentAdress")
											.removeClass("required");
									$("#address_yearsInCurrentCity")
											.removeClass("required");
									$("#address_monthsInCurrentCity")
											.removeClass("required");
									$("#current_address_span").hide();
									$("#current_city_span").hide();
								}
							}
						}
					}

				});

var selected_address_typeValue = $('#addressType option:selected').attr(
		'data-code');

function setResidentialAsDefault(countryISOCode) {
	var selected_address_typeValue = $('#addressType option:selected').attr(
			'data-code');
	if (countryISOCode == 'IND') {

		if (parentEntityName == "Customer" && !(addressId)) {
			if (customerType == "individual") {
				$('#addressType option')
						.each(
								function() {
									if ($(this).attr('data-code') == 'ResidentialAddress') {
										/* $("#address_landmark").addClass("required"); */
										if (selected_address_typeValue == ''
												|| selected_address_typeValue == null) {
											$(this)
													.attr("selected",
															"selected");
										}
										$('#accomodationType').removeAttr(
												'disabled');
										$('#extension_phoneNumberList0')
												.removeClass("required");
										// Mark years at current address
										// mandatory for Residential Address
										// type for All Product types
										$("#address_noOfYearsAtCurrentAdress")
												.addClass("required");
										$("#address_noOfMonthsAtCurrentAdress")
												.addClass("required");
										$("#address_yearsInCurrentCity")
												.addClass("required");
										$("#address_monthsInCurrentCity")
												.addClass("required");
										$("#current_address_span").show();
										$("#current_city_span").show();
									} else {

										// Mark years at current address
										// mandatory for Residential Address
										// type for All Product types
										$("#address_noOfYearsAtCurrentAdress")
												.removeClass("required");
										$("#address_noOfMonthsAtCurrentAdress")
												.removeClass("required");
										$("#address_yearsInCurrentCity")
												.removeClass("required");
										$("#address_monthsInCurrentCity")
												.removeClass("required");
										$("#current_address_span").hide();
										$("#current_city_span").hide();
									}
								});
				// For DCB modifying landmark to mandatory for resdential
				// Address
				if (($('#addressType option:selected').attr('data-code') == 'ResidentialAddress')
						&& (casClient == "dcb")) {
					$("#address_landmark").addClass("required");
					$("#addressLandmark").html("*");
					$("#addressLandmark").addClass("color-red");
					$("#addressLandmark").show();
					$("#address_noOfYearsAtCurrentAdress")
					.addClass("required");
			        $("#address_noOfMonthsAtCurrentAdress")
					.addClass("required");
			        $("#address_yearsInCurrentCity")
					.addClass("required");
			        $("#address_monthsInCurrentCity")
					.addClass("required");
			        $("#current_address_span").show();
			        $("#current_city_span").show();
				} else if (casClient == "icici")// for ICICI, modifying landmark
				// to mandatory field
				{
					$("#address_landmark").addClass("required");
					$("#addressLandmark").show();
				} else {
					$("#address_landmark").removeClass("required");
					$("#addressLandmark").hide();
				}

				if (selected_address_typeValue == 'ResidentialAddress') {
					// Mark years at current city mandatory for Residential
					// address type and for Mortgage and micro housing loan
					// product type
					if (productTypeName) {
						if (productTypeName == "<%=ProductType.MORTGAGE_LOAN%>") {
							$("#address_yearsInCurrentCity").addClass(
									"required");
							$("#current_address_span").show();
							$("#current_city_span").show();
						} else {
							$("#address_yearsInCurrentCity").removeClass(
									"required");
							$("#current_address_span").hide();
							$("#current_city_span").hide();
						}
					}
					// Mark years at current address mandatory for Residential
					// Address type for All Product types
					$("#address_noOfYearsAtCurrentAdress").addClass("required");
					$("#address_noOfMonthsAtCurrentAdress")
							.addClass("required");
					$("#address_yearsInCurrentCity").addClass("required");
					$("#current_address_span").show();
					$("#current_city_span").show();
					// $("#notRequired").attr('disabled','disabled');
				} else {

					// Mark years at current city mandatory for Residential
					// address type and for Mortgage and micro housing loan
					// product type
					$("#address_yearsInCurrentCity").removeClass("required");

					// Mark years at current address mandatory for Residential
					// Address type for All Product types
					$("#address_noOfYearsAtCurrentAdress").removeClass(
							"required");
					$("#address_noOfMonthsAtCurrentAdress").removeClass(
							"required");

					//$("#current_address_span").hide();
					//$("#current_city_span").hide();

				}

			}
		}
	} else {

		$("#address_noOfYearsAtCurrentAdress").removeClass("required");
		$("#address_noOfMonthsAtCurrentAdress").removeClass("required");
		$("#address_yearsInCurrentCity").removeClass("required");
		$("#address_monthsInCurrentCity").removeClass("required");
		$("#current_address_span").hide();
		$("#current_city_span").hide();
		$("#address_landmark").removeClass("required");
		$("#addressLandmark").hide();
	}
}
// Auto select 'Residential' as default Address Type

if ((parentEntityName == "BuilderProject" || parentEntityName == "PropertyDetail") && !(addressId)) {
	$('#addressTypeProperty option').each(function() {
		if ($(this).attr('data-code') == 'PropertyAddress') {
			// $("#address_landmark").addClass("required");
			$(this).attr("selected", "selected");
		}/*
		 * else{ $("#address_landmark").removeClass("required"); }
		 */
	});
}


if(parentEntityName == "BuilderProject") {
	$("#current_address_span").hide();
    $("#current_city_span").hide();
}

function addAddressPhoneNumber() {
	var counter = parseInt($('#addCounter').val()) + 1;
	$('#addCounter').val(counter);
	var ajaxPhoneUrl = contextPath + '/app/' + $("#parentId").val()
			+ '/Address/add/address/primary/' + counter;
	var newDiv = document.getElementById("addNewAddressNumber");
	var createParent = document.createElement("div");
	createParent.id = "addedNewAddressNumber" + counter;
	newDiv.appendChild(createParent);
	$('#addedNewAddressNumber' + counter).addClass("col-sm-6");
	$('#addedNewAddressNumber' + counter).load(ajaxPhoneUrl, function() {
	});
	var id = "address_primary_phone_" + counter;
	setTimeout(function() {
		forcePopulateValuesForPhone(id, $('#text_country option:selected')
				.attr('data-code'));
	}, 500);

}

function DeleteCurrentAddressPhoneNumber(phoneCount) {
	$('#addressPhoneNumberEdit_deleteAddressPhoneNumber' + parseInt(phoneCount))
			.remove();
	var counter = parseInt($('#addCounter').val());
	counter = counter - 1;
	$('#addCounter').val(counter);
}
function DeleteCurrentPhoneNumber(phoneCount) {
	$('#addedNewAddressNumber' + phoneCount).remove();
}

$(document).ready(
		function() {

			var clickedObj = null;

			$(document).mousedown(function(e) {
				// The latest element clicked
				clickedObj = $(e.target);
			});

			// when 'clicky == null' on blur, we know it was not caused by a click
			// but maybe by pressing the tab key
			$(document).mouseup(function(e) {
				clickedObj = null;
			});

		});