/**  Core web  - validation.js **/
var regexForValidation=getRegexValueForValidations();
var casClient=$('#casClient').val();
var defaultValidationOptions	={

							errorClass : "help-block",
							errorElement : "label",
							ignore: "",
							highlight : function(element,errorClass, validClass) {
								
								  if($(element).parents().eq(3).hasClass("phone_tag_top")){
								                if(($(element).val().length<10) && $(element).val().length >0){
								                      $(element).parents('.form-group')
								                      .addClass('error');
								                      $(element).parents('.form-group')
								                      .removeClass('success');
								                      $(element).parents().eq(1).children().eq(4).children().eq(0).removeClass('help-block');
								                }
								                else if ($(element).val().length==0){
								                	$(element).parents('.form-group')
								                      .addClass('error');
								                      $(element).parents('.form-group')
								                      .removeClass('success'); 
								                       $(element).parents().eq(1).children().eq(4).children().eq(0).addClass('help-block');
								                }
								                
								         }else if($(element).parents().eq(2).hasClass("phone_tag_top")){
											 $(element).addClass('error');
											 $(element).parents('.form-group')
								                .addClass('error');
								                $(element).parents('.form-group')
								                .removeClass('success');
										 }else {
												$(element).parents('.form-group')
								                .addClass('error');
								                $(element).parents('.form-group')
								                .removeClass('success');
								         }
								  
										  if ($(element).siblings("span.help-block[generated='true']").length >= 1) {
											  $(element).siblings("span.help-block[generated='true']").remove();
										  }
								  
								         if($(element).parents('.outset-shadow-focus').length < 1 ){
								                      $(element).parents('.form-group').addClass('outset-shadow-focus clearfix');
								         }
								         
								},
							unhighlight : function(element, errorClass, validClass) {
							
							        if($(element).parents().eq(2).hasClass("phone_tag_top")|| $(element).hasClass('ph-isd-code')){
							           $(element).removeClass("error");
							           if(!($(element).attr("id").indexOf('isdCode')>-1) && !($(element).attr("id").indexOf('extension')>-1)){
							        	   $(element).parents('.form-group')
							                            .removeClass('error');
							              $(element).parents('.form-group')
							                            .addClass('success'); 
							              removeOutsetShadowFocusClass(element);
						        	   }
							        }
							          else if($(element).parents().eq(3).hasClass("phone_tag_top")){
							        	  var isPhoneValid=validPhoneNumber($(element).parents().eq(1).children().eq(2).val(),element); 
							        	  if(($(element).val().length==10) && isPhoneValid==true){
							        		  	 $(element).parents().eq(3).find('.help-block').css('display','none');
							                     $(element).parents().eq(1).children().eq(4).children().eq(0).removeClass('help-block');
							                     $(element).parents('.form-group')
							                     .removeClass('error');
							                     $(element).parents('.form-group')
							                     .addClass('success'); 
							                     $(element).removeClass("error");
							                     removeOutsetShadowFocusClass(element);
							                     
							              }
							              else if(($(element).val().length<10) && ($(element).val().length>0)){
							                     $(element).parents().eq(1).children().eq(4).children().eq(0).removeClass('help-block');
							                     removeOutsetShadowFocusClass(element);
							              }else{
							                     $(element).parents().eq(1).children().eq(4).children().eq(0).remove('help-block');
							                     removeOutsetShadowFocusClass(element);
							              }
							              }
							        else if ($(element).parents('.form-group').hasClass("money-ctrl")) {
							        	var value = $(element).parents('.form-group').find('input:visible').val();
							         	if ( $.trim(value) != "") {
							         		 $(element).parents('.form-group').removeClass('error');
							         		 $(element).parents('.form-group').addClass('success'); 
							         		 removeOutsetShadowFocusClass(element); 
							         	}
							        }
							        else{
							        	
							        	if(($(element).val() != null) && ($(element).val().length > 0)){
							              $(element).parents('.form-group')
							              .addClass('success');
							              $(element).parents('.form-group')
							              .removeClass('error');
							              removeOutsetShadowFocusClass(element);
							        	}
							        }
							                
							  },
							invalidHandler : function(form,validator) {
								for ( var i in validator.errorMap) {
									console.log(i, ":",
											validator.errorMap[i]);
								}
								$.sticky(
										error_message,
										{
											autoclose : 5000,
											position : "top-right",
											type : "st-error"
								});
								setTimeout(function(){focusErrorField();},200);
							}
			};
$(document)
		.ready(
				function() {
					getResource();
					$('.row').show();
					$('.nonMandatory').show();

					$("#showFields").change(function() {
						if ($(this).val() == 'nonMandatory') {
							$('.nonMandatory').show();
							$('.row').show();
						} else {
							$('.nonMandatory').hide();
							$('.row').show();
						}
					});

					$('.income').show();
					$('.expense').hide();
					$(".radio").change(function() {
						if ($("#expense").prop("checked")) {
							$('.income').hide();
							$('.expense').show();
						} else {
							$('.income').show();
							$('.expense').hide();
						}
					});
	            
					initValidationOnForms();
					
				 //for issue : 22679
					$(document).on('click',".cb-enable",function() {
						var parent = $(this).parents('.switch');
						$('.cb-disable', parent).removeClass('selected');
						$(this).addClass('selected');
						$('.checkbox', parent).prop('checked', true);
					});

					$(document).on('click',".cb-disable",function() {
						var parent = $(this).parents('.switch');
						$('.cb-enable', parent).removeClass('selected');
						$(this).addClass('selected');
						$('.checkbox', parent).prop('checked', false);
					});
					
					
					var alphaNumWithDecimal = function(value) {
						

						var alphaNumWithDecimal = regexForValidation.alphaNumWithDecimal;
						return alphaNumWithDecimal.test(value);

					}

					$.validator.addMethod("alphaNumWithDecimal", function(value,
							element) {
						if(typeof value != "undefined" && value != null && value!=''){
							return alphaNumWithDecimal(value);
						}else{
							return true;
						}
						

					},alpha_num_with_decimal);
					//code allowing underscore along with alphanumeric

					var validCode = function(value) {

						var validCode = regexForValidation.validCode;

						return validCode.test(value);

					}
					var validVillageCode = function(value) {

                    						var validVillageCode = /^[A-Za-z0-9_]{0,22}$/;

                    						return validVillageCode.test(value);

                    					}
					
					function validIP(value) {
						var validIP = /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/;
						return validIP.test(value);
						}
					
					$.validator.addMethod("ipaddress", function(value) {
						if(value==""){
							return true;
						}
						return validIP(value);
					},error_inValidIP);
					
					var validElementKey = function(value) {
						var validElementKey = regexForValidation.validElementKey;
						return validElementKey.test(value);
					}
					
					var validateDefaultRate = function(value) {
						var validateDefaultRate = regexForValidation.validateDefaultRate;
						return validateDefaultRate.test(value);
					};

					var validateCurrConvRate = function(value) {
						var validateCurrConvRate = regexForValidation.validateCurrConvRate;
						return validateCurrConvRate.test(value);
					};
					var validateDefaultPercentage = function(value) {
						var validateDefaultPercentage = regexForValidation.validateDefaultPercentage;
						return validateDefaultPercentage.test(value);
					};

					var validateDollarCurlyStartCurlyEnd = function(value) {
                        if(value == null || value == ''){
                            return true;
                        } else{
                            return value.startsWith("${") && value.endsWith("}") ? true : false;
                        }
                    };

                    var validateCharacterWithSpace = function(value) {
                        var validateCharacterWithSpace = regexForValidation.validateCharacterWithSpace;
                        return validateCharacterWithSpace.test(value);
                    };

                    var validateCharacterWithUnderscore = function(value) {
                        var validateCharacterWithUnderscore = regexForValidation.validateCharacterWithUnderscore;
                        return validateCharacterWithUnderscore.test(value);
                    };
					
					$.validator.addMethod("dollarCurlyStartCurlyEnd", function(
							value, element) {
						return validateDollarCurlyStartCurlyEnd(value);
					}, label_dollar_curly_curly);

					$.validator.addMethod("characterWithSpace", function(
							value, element) {

						return validateCharacterWithSpace(value);
					}, label_character_space);

					$.validator.addMethod("characterWithUnderscore", function(
                            value, element) {

                        return validateCharacterWithUnderscore(value);
                    }, label_character_under_score);

                    $.validator.addMethod("validateDefaultRate", function(
                            value, element) {

                        return validateDefaultRate(value);
                    }, label_invalid_default_rate);
					
					$.validator.addMethod("validateCurrConvRate", function(
							value, element) {

						return validateCurrConvRate(value);
					},label_invalid_conversion_rate);
					
					
					$.validator.addMethod("validateDefaultPercentage",
							function(value, element) {
						if (!$(element).is(':focus')) {
							return validateDefaultPercentage(value);
						} else {
							return true;
						}
					}, label_invalid_percentage);

					var validateLtv = function(value) {
						var validateLtv = regexForValidation.validateLtv;
						return validateLtv.test(value);
					};
					$.validator.addMethod("validateLtv", function(
							value, element) {
						return validateLtv(value);
					}, label_invalid_Ltv);


					//Validate amount field start
					var decimalSymbol =  '';
					var digitGroupSymbol = '';
					
					if(typeof userLocaleDecimalSeparator !== 'undefined'){
						decimalSymbol =  userLocaleDecimalSeparator;
					}
					if(typeof userLocaleGroupingSeparator !== 'undefined'){
						digitGroupSymbol = userLocaleGroupingSeparator;
					}
					
					if(typeof decimalSymbol === 'undefined' || decimalSymbol == '' || decimalSymbol == null) {
                        decimalSymbol='.';
					}
					if(typeof digitGroupSymbol === 'undefined' || digitGroupSymbol == '' || digitGroupSymbol == null) {
                        digitGroupSymbol=',';
					}
					
					var regexForPositiveValidateAmount = "^[0-9" + digitGroupSymbol + "]{0,35}(\\" + decimalSymbol + "[0-9]*)?$" ;
					regexForPositiveValidateAmount = new RegExp(regexForPositiveValidateAmount);
					
					var regexForNegativeValidateAmount = "^-?[0-9" + digitGroupSymbol + "]{0,35}(\\" + decimalSymbol + "[0-9]*)?$" ;
					regexForNegativeValidateAmount = new RegExp(regexForNegativeValidateAmount);
					
					var validateAmount = function(value,element) {
						var regexForValidateAmount = regexForPositiveValidateAmount;
						//doing substring because money tag adds string "amount_" in id
						var elementId = $(element).attr("id").substring(7);
						var acceptNegativeFlag = $("#hid_"+elementId).attr("acceptNegative");
						if(typeof acceptNegativeFlag !== 'undefined' && acceptNegativeFlag != '' && acceptNegativeFlag != null && acceptNegativeFlag == "true") {
							regexForValidateAmount = regexForNegativeValidateAmount;
						}
						var finalResult = isValidAmount(regexForValidateAmount,value,decimalSymbol,digitGroupSymbol);
						return finalResult;
					};
				   
					$.validator.addMethod("validatePositiveAmount", function( 
							value, element) {
						return validateAmount(value,element); 
					}, label_invalid_positive_amount);
					
					$.validator.addMethod("validateNegativeAmount", function( 
							value, element) {
						return validateAmount(value,element); 
					}, label_invalid_negative_amount);
					
					
					function isValidAmount(regexForValidateAmount, value, decimalSymbol, digitGroupSymbol){
						var finalResult = regexForValidateAmount.test(value);
						var amount = value.split(decimalSymbol);
						digitGroupSymbol = new RegExp("\\"+digitGroupSymbol,'g');
						if(amount[0].replace(digitGroupSymbol,'').length > 18) {
							finalResult = false;
						}
						return finalResult;
					}
					//Validate amount field end
					
					
					
					
					var validBPName = function(value) {
						var validBPName = regexForValidation.validBPName;
						return validBPName.test(value);
					}

			       $.validator.addMethod("validBPName", function(value,
							element) {
						return validBPName(value);
					}, label_invalid_BusinessPartnerName);
			       
			       var validRuleName = function(value) {
						var validRuleName = regexForValidation.validRuleName;
						return validRuleName.test(value);
				    }

			        $.validator.addMethod("validRuleName", function(value,
							element) {
						return validRuleName(value);
					},valid_rule_name);					
					
					var validName = function(value) {

						var validName = regexForValidation.validName;

						return validName.test(value);

					}

					var validNameCode = function(value) {

                    						var validNameCode = /^[A-Za-z0-9_]{0,30}$/

                    						return validNameCode.test(value);

                    					}


					$.validator.addMethod("validName", function(value,
							element) {

						return validName(value);
						
					},error_valid_master_name);

					$.validator.addMethod("validNameCode", function(value,
                    							element) {

                    						return validNameCode(value);

                    					},error_valid_name_code);


					//}, error_valid_Code);
					$.validator.addMethod("validCode", function(value,
							element) {

						return validCode(value);
						
					},error_valid_master_code);

                   var validBranchCode = function(value) {

						var validCode = regexForValidation.validBranchCode;

						return validCode.test(value);

					}
				    $.validator.addMethod("validBranchCode", function(value,
                    							element) {

                    						return validBranchCode(value);

                   },error_valid_organization_branch_master_code);

				 $.validator.addMethod("validVillageCode", function(value,
                                             							element) {

                                             						return validVillageCode(value);

                                             					},error_valid_village_code);

								//}, error_valid_Code);
					
					//Check-in against jira PDDEV-8298.
					$.validator.addMethod("validNameWithoutSpaces", function(value,element) {
						return validNameWithoutSpaces(value);						
					},error_valid_note_code);
					
					var validNameWithoutSpaces = function(value) {
						var validNameWithoutSpaces = regexForValidation.validNameWithoutSpaces;
						return validNameWithoutSpaces.test(value);
					}
					
					//Code to validate mobile Number
					$.validator.addMethod("phoneValid", function(value, element) {
						return  validPhoneNumber(value,element);
					},error_phone_valid);
					
					//code to validate valid form elements id
					$.validator.addMethod("validElementKey",
							function(value, element) {
								return validElementKey(value);
							}, error_valid_element_key);
					
					//Code to validate E-mail
					$.validator.addMethod("validEmail", function(value, element) {
						return  validEmailFunction(value);
					}, error_email);
					
					$.validator.addMethod("invalidEmail", function(value, element) {
						return  false;
					}, error_email);
					
					var date_error_msg = label_date_minimum_year_error_msg+" " + minimumYearForDate;
					$.validator.addMethod("validateMinYearText", function(value,
							element) {
						
						if (value != "") {
							
							
							var minimumYear = parseInt(minimumYearForDate, 10);
							var enteredYear = parseInt(value,10);
							if(enteredYear <  minimumYear){
								return false;
							}
							else{
								return true;
							}
						}
						else{
							return true;
						}
					}, date_error_msg);
					

					 $.validator.addMethod('positiveNumber', function (value) { 
						  if(value != ""){
						        return Number(value) > 0;
						  }
						  else{
								return true;
							}
						    },error_positive_number);
					 
					 var validTimecode = function(value) {
						//http://goo.gl/0EM4s8
							var validTimecode = regexForValidation.validTimecode;

							return validTimecode.test(value);

						}
					 
						
						//Code to validate Time
						$.validator.addMethod("validTime", function(value) {
							return  validTimecode(value);
						},label_field_required);
						
						//validators for dynamic forms
						$.validator.addMethod("maxTextBoxLengthValue", function(value, element) {
							return validateDynamicFormsLength(value,50);
							
						},error_max_dynamicform_textbox_length);
						
						$.validator.addMethod("maxTextBoxLengthValueForInteger", function(value, element) {
							return validateDynamicFormsLength(value,9);
							
						},error_max_dynamicform_textbox_length_for_integer);
						
						$.validator.addMethod("maxTextBoxLengthValueForNumber", function(value, element) {
							return validateDynamicFormsLength(value,17);
							
						},error_max_dynamicform_textbox_length_for_number);
						
						
						$.validator.addMethod("maxTextAreaLengthValue", function(value, element) {
							return validateDynamicFormsLength(value,5000)
						},error_max_dynamicform_textarea_length);
						
						$.validator.addMethod("formFieldKeyValidation", function(value, element) {
							return validateFormFieldKey(value)
						},error_field_key_special_character);
						
						$.validator.addMethod("maxMoneyLengthValue", function(value, element) {
							return validateDynamicFormsLength(value,21)
						},error_max_dynamicform_money_length);
						
						var validateFormFieldKey = function(value){
						  var str = value;
						  var patt = new RegExp("^[a-zA-Z0-9_]*$");
						  var res = patt.test(str);
						  if(res === true){
							  return true;
						  }else{
							  return false;
						  }
						}
						
						var validateDynamicFormsLength = function(value,maxValue) {
							if(value>maxValue){
								return false;
							}else{
								return true;
							}

						}
						
						$.validator.addMethod("Integer",function(value, element){
							if (value != "") {
							var validInteger = regexForValidation.validInteger;
							return validInteger.test(value)
							}
							else{
								return true;
							}
						},label_invalid_integer);
						
						$.validator.addMethod("character", function(value, element) {
							return this.optional(element) || regexForValidation.characterRegex.test(value);
						},label_invalid_character_validation);
					    
						$.validator.addMethod("alphanum", function(value, element) {
							return this.optional(element) || regexForValidation.alphanum.test(value);
						},label_invalid_alphanum_validation)
						
						
							//check first character is alphabet and allowed unserscore(_) and hypen(-)
						
						$.validator.addMethod("validateRoleName", function(value, element) {debugger
							return this.optional(element)|| regexForValidation.validateRoleName.test(value);
							
						},label_invalid_roleName_validation)
						
						//end of this validator
						
						$.validator.addMethod("isoCode", function(value, element) {
							return this.optional(element) || regexForValidation.isoCode.test(value);
						},label_invalid_isoCode_validation)
						
						$.validator.addMethod("amount", function(value, element) {
							return this.optional(element) || regexForValidation.amount.test(value);
						},label_invalid_amount_validation)
						
						$.validator.addMethod("percent", function(value, element) {
							return this.optional(element) || regexForValidation.percent.test(value);
						},label_invalid_percent_validation)
						//Function added for the a person's name field validations
						$.validator.addMethod("personName", function(value, element) {
							return this.optional(element)|| regexForValidation.personName.test(value);
						},label_invalid_personName_validation)
						
						$.validator.addMethod("floatingDigits",function(value, element) {
							return this.optional(element) || regexForValidation.floatingDigits.test(value);
						},label_invalid_floatingDigits_validation)
						
						// http://docs.jquery.com/Plugins/Validation/Methods/dateDE
						$.validator.addMethod("dateDE", function(value, element) {
							return this.optional(element) || regexForValidation.dateDE.test(value);
						})
						
						// http://docs.jquery.com/Plugins/Validation/Methods/numberDE
						$.validator.addMethod("numberDE", function(value, element) {
							return this.optional(element) || regexForValidation.numberDE.test(value);
						})

						/**
						 * Added from CommunicationName
						 */							
							var validCommunicationName = function(value) {

								var validCommunicationName =  regexForValidation.validCommunicationName;

								return validCommunicationName.test(value);

							}

							$.validator.addMethod("validCommunicationName", function(value,
									element) {

								return validCommunicationName(value);
								
							},error_valid_master_name_commn);
							
							var validLocation = function(value) {

								var validLocation = regexForValidation.validLocation;

								return validLocation.test(value);

							}

							$.validator.addMethod("validLocation", function(value,
									element) {

								return validLocation(value);
								
							},error_valid_location);



							var validTemplateName = function(value) {

								var validTemplateName =  regexForValidation.validCommunicationName;

								return validTemplateName.test(value);

							}

							$.validator.addMethod("validTemplateName", function(value,
									element) {

								return validTemplateName(value);
								
							},error_valid_master_name_commn);
							
							var validNoteCode = function(value) {

								var validNoteCode = regexForValidation.validNoteCode;

								return validNoteCode.test(value);

							}

							$.validator.addMethod("validNoteCode", function(value,
									element) {

								return validNoteCode(value);
								
							},error_valid_note_code);
							
							$.validator.addMethod("lettersonly", function(value, element) {
								return this.optional(element) || regexForValidation.lettersOnly.test(value);
							},error_letters_only);
							
							$.validator.addMethod("letterswithbasicpunc", function(value, element) {
								return this.optional(element) || regexForValidation.letterswithbasicpunc.test(value);
							},error_letters_with_basic_punc);
							
							
	

				});

function validPhoneNumber(value,element) {
	
	var phoneNumber = $(element).parents("div:first").find("input.phn_tag").val();
		
	if((value=='+0' && phoneNumber))
		return false;
	
	var phoneNumber = $(element).parents("div:first").find("input.phn_tag")
			.val();
	var countryCode = $("#phoneNumberList1select option:selected")
			.text();
	phoneNumber = phoneNumber.replace(/-/g, '');
	phoneNumber = phoneNumber.replace(/_/g, '');
	var number = value.concat(phoneNumber);
	var number = value.concat(phoneNumber);
	if (phoneNumber != '') {
		// check for number less than 10 has been removed as for france no of
		// digits in a mobile number is 9. For myanmar no of digits ina a mobile
		// number is 6. Issue#20227
		/*if (phoneNumber.length > 13) {
			return false;
		}*/
		/*
		 * changes made because google plugin doesnot validate number starting
		 * with 7 like 7077383883
		 */
		
			var h = i18n.phonenumbers.PhoneNumberUtil.getInstance();
			var k = h.parseAndKeepRawInput(number, countryCode);
			var e = h.isValidNumber(k);
			
			if (e == false) {
				return false;
			}
		}
	
	var isdCode = /^\+*[0-9]{0,4}$/;
	if (isdCode.test(value) == false) {
		return false;
	}
	if (!phoneNumber || phoneNumber == '') {
		return true;
	}
	// check for number less than 10 has been removed as for france no of digits
	// in a mobile number is 9. For myanmar no of digits ina a mobile number is
	// 6. Issue#20227
	if (number.length > 14) {
		return false;
	} else {
		switch (number.length) {
		case 9:
			if (number[0] == '+') {
				return true;
			}
			break;
		case 10:
			if (number[0] == '9' || number[0] == '8' || number[0] == '7'|| number[0] == '+') {
				return true;
			}
			break;
		case 11:
			if (number[0] == '0' || number[0] == '+') {
				return true;
			}
			break;
		case 12:
			if (number[0] == '9' || number[0] == '+') {
				return true;
			}
			break;
		case 13:
		case 14:
			if (number[0] == '+') {
				return true;
			}
			break;
		default:
			return false;
		}
	}
	return false;
}

function validEmailFunction(value) {
	if (!value || value == '') {
		return true;
	}
	var result = value.split("@");
	if (value.length < 6 || result[1].length < 4) {
		return false;
	}
	return true;
}

function hidePrevDiv() {

	$(".hideShow").addClass("hidden");
	$(".hideShow").addClass("hidden");
}

function showDiv() {

	$(".hideShow").removeClass("hidden");
	$(".hideShow").removeClass("hidden");
}

function saveForm() {
		var isChecked = $("#create_another_master").prop('checked') ? true : false;
		var form = document.getElementById("masterForm");
		
		if(form==null) {
			new PNotify({
				title : 'Error',
				text : 'Please fill required fields',
				type : 'error',
				pnotify_animate_speed : .8,
				opacity : 1
			});
			
		}
		else
		{
		$("#createAnotherMaster").val(isChecked);
		if($(".form").valid()){
		showOverlayLoader();
		form.submit();
	    }
		}
	}

	function saveAndSendForApproval(context) {
		var isChecked = $("#create_another_master").prop('checked') ? true : false;
		$("#createAnotherMaster").val(isChecked);
		var masterID = document.getElementById("masterID").value;
		var form = document.getElementById("masterForm");
		if(form==null) {
			new PNotify({
				title : 'Error',
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

function cancelForm(context) {
	var masterID = document.getElementById("masterID").value;

	var form = document.getElementById("masterForm");
	if (masterID == "ExternalBank") {
		form.action = context + "/app/grid/" + masterID +"/"+masterID+ "/loadColumnConfig";
	} else if (masterID == "Industry") {
		form.action = context + "/app/grid/" + masterID+"/"+masterID
				+ "/loadColumnConfig";
	} 
	else if (masterID == "Building") {
		form.action = context + "/app/grid/" + masterID + "/" + masterID
				+ "/loadColumnConfig";
	}
	
	else if ((masterID == "CustomerConstitution")
			|| (masterID == "IncomeExpense")
			|| (masterID == "CustomerCategory")) {
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	} else if (masterID == "OrganizationBranch") {
		form.action = context + "/app/grid/"+ masterID + "/" +masterID + "/loadColumnConfig";
	} else if ((masterID == "LoanProduct") || (masterID == "LoanScheme")) {
		form.action = context + "/app/grid/" + masterID+"/"+masterID+ "/loadColumnConfig";
	} else if ((masterID == "EligibilityParameter")
			|| (masterID == "EligibilitySet")
			|| (masterID == "EligibilityPolicy")) {
		form.action = context + "/app/grid/" + masterID+"/"+masterID+ "/loadColumnConfig";				
	} else if ((masterID == "Employer")) {
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	} else if ((masterID == "Condition")) {
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	} else if ((masterID == "Parameter")) {
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	} else if (masterID == "Role") {
		form.action = context + "/app/grid/" + masterID + "/"+ masterID+ "/loadColumnConfig";
	} else if (masterID == "AssetModel") {
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	} else if (masterID == "VehicleManufacturer") {
		form.action = context + "/app/master/businessPartner/" + masterID
				+ "/loadInformationData";
	} else if (masterID == "CollateralCategory") {
		form.action =context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	}else if (masterID == "DocumentChecklist") {
		form.action = context + "/app/grid/" + masterID +"/"+ masterID + "/loadColumnConfig";
		
	}else if (masterID == "UserInfo") {
		form.action = context + "/app/UserInfo/loadColumnConfig";
		
	}else if (masterID == "AgencyInfo") {
		form.action = context + "/app/grid/AgencyBusinessPartner/BusinessPartner/loadColumnConfig";
		
	} 
	else {
		neutrinoNavigateTo(context
				+ "/app/grid/" + masterID + "/" + masterID
				+ "/loadColumnConfig");
		/*
		 * form.action = context + "/app/grid/" + masterID + "/" + masterID +
		 * "/loadColumnConfig";
		 */
				return false;
	}
	form.submit();
}

function delet() {
	var masterID = document.getElementById("masterID").value;
	$('#deleteRecordInside_'+masterID).modal('show');
	

}
function DeleteRecord(context){
	showOverlayLoader();
	var masterID = document.getElementById("masterID").value;
	var ID =new Array;
	ID.push(document.getElementById("id").value);
	var url = "";
	var form = document.getElementById("masterForm");

	//Defining Deletion URL
	if(masterID == "Team"){
		url = context + "/app/" + masterID + "/delete/" + ID;
	}else{
		url = context + "/app/master/" + masterID + "/" + masterID + "/delete";
	}
	
	form.action = context + "/app/grid/"+masterID+"/" + masterID+ "/loadColumnConfig";
	$
			.ajax({
				type : "POST",
				url : url,
				data:{"recordIds":ID},
				success : function(result) {
				var success = result.success;
                var failure = result.failure;
                if(success){
					if ($(".form").valid()) {
						form.submit();
					} else {
						hideOverlayLoader();
					}
					$.sticky("Record Deleted Successfully.", {
						autoclose : 10000,
						position : "top-right",
						type : "st-success"
					});
				}else if(failure){
                    new PNotify({
                        title: 'Failure',
                        text: failure,
                        type: 'error',
                        opacity: .8
                    });
                    hideOverlayLoader();
                    var masterID = document.getElementById("masterID").value;
                    $('#deleteRecordInside_'+masterID).modal('hide');
                 }
				},
				error : function() {
					$
							.sticky(
									error_message,
									{
										autoclose : 5000,
										position : "top-right",
										type : "st-error"
									});
					hideOverlayLoader();
				}
			});
}

function autoApprove(context) {
	showOverlayLoader();
	var masterID = document.getElementById("masterID").value;
	var ID = new Array;
	ID.push(document.getElementById("id").value);
	var url = "";
	var form = document.getElementById("masterForm");
		url = context + "/app/master/" + masterID+"/"+masterID + "/approval"  ;
				
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";

	$
			.ajax({
				type : "POST",
				url : url,
				data:{"recordIds":ID},
				success : function(result) {
					if ($(".form").valid()) {
						form.submit(); 
					} else {
						hideOverlayLoader();
					}

				},
				error : function() {
					$
							.sticky(
									error_message,
									{
										autoclose : 5000,
										position : "top-right",
										type : "st-error"
									});
					hideOverlayLoader();
				}
			});

}

function sendForApproval(context) {
	showOverlayLoader();
	var masterID = document.getElementById("masterID").value;
	var recordIdList = new Array;
	var ID = document.getElementById("id").value;
	recordIdList.push(ID);
	var url = "";
	var form = document.getElementById("masterForm");
	url = context + "/app/master/" + masterID + "/" + masterID + "/approval";
	form.action = context + "/app/grid/" + masterID + "/" + masterID
			+ "/loadColumnConfig";
	$.ajax({
		type : "POST",
		url : url,
		data : {
			"recordIds" : recordIdList
		},
		success : function(result) {
			var checkform = $(".form");
		
			if(checkform.length>0){
			if ($(".form").valid()) 
				form.submit();
			}
			else{
			form.submit();
				
			}
			if(result!=""){
				$.sticky("Record Sent For Approval Successfully.", {
					autoclose : 7000,
					position : "top-right",
					type : "st-success"
				});
				
			}
		},
		error : function() {
			$.sticky(error_message, {
			autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			hideOverlayLoader();
		}
	});
}

function editMasterRecord(context) {
	showOverlayLoader();
	var masterID = document.getElementById("masterID").value;
	var ID = document.getElementById("id").value;
	var form = document.getElementById("masterForm");
	form.action = context + "/app/" + masterID + "/edit/" + ID;
	form.submit();
}
function save(context) {
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	form.action = context + "/app/" + masterID + "/save";
	if ($(".form").valid())
		form.submit();
}
function postTaskAction(action, context) {
	showOverlayLoader();
	var taskId =new Array;
	taskId.push($("#taskId").val());
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	var url = "";
	if (masterID == "UserInfo") {
		url = context + "/app/master/User/completeTask";
	} else {
		url = context + "/app/master/" + masterID + "/completeTask";
	}
	
	// Defining Master Grid URL 	
	if (masterID == "UserInfo") {
		form.action = context + "/app/UserInfo/loadColumnConfig";
	} else {
		form.action = context + "/app/grid/" + masterID + "/" + masterID + "/loadColumnConfig";
	}
	
	$
			.ajax({
				url : url,
				type : "POST",
				data :{"action" :action,
					"taskIds" :taskId},
			
				success : function(result) {
            if(result.validationResposne!=null && result.validationResposne=='valid'){
					if ($(".form").valid()) 
						form.submit();
					
					if(action=='Approved')
					{new PNotify({
						title : 'Done',
						text : 'Record Approved Successfully.',
						type : 'success',
						pnotify_animate_speed : .8,
						opacity : 1
					});
					
					}
				else if(action=='Rejected'){
					new PNotify({
						title : 'Done',
						text : 'Record Rejected Successfully.',
						type : 'success',
						pnotify_animate_speed : .8,
						opacity : 1
					});
					
					
					
				}
				else if(action=='Send Back'){ 
					new PNotify({
						title : 'Done',
						text : 'Record Sent Back Successfully.',
						type : 'success',
						pnotify_animate_speed : .8,
						opacity : 1
					});
				}
					            }
                                else if(result.validationResposne!=null && result.validationResposne=='invalid'){
                                 	jQuery.each(result.message, function(i, value) {
                                             				 $.sticky(value, {
                                                             				autoclose : 5000,
                                                             				position : "top-right",
                                                             				type : "st-error"
                                                             			});
                                             				});
                                 	hideOverlayLoader();
                                }
                                else
                                {
                                    $.sticky(error_message, {
                                    autoclose : 5000,
                                    position : "top-right",
                                    type : "st-error"
                                    });
                                    hideOverlayLoader();
                                }

				},
				error : function() {
					$
							.sticky(
									error_message,
									{
										autoclose : 5000,
										position : "top-right",
										type : "st-error"
									});
					hideOverlayLoader();
				}
			});

}

function createClone(context) {
	showOverlayLoader();
	var taskId =new Array;
	taskId.push($("#taskId").val());
	var masterID = document.getElementById("masterID").value;
	var recordId = document.getElementById("id").value;
	var form = document.getElementById("masterForm");
	var url = "";
		url = context + "/app/master/" + masterID+"/" +masterID+"/createClone" ;
				
		
		form.action = context + "/app/grid/" + masterID+"/"+masterID
		+ "/loadColumnConfig";
	$
			.ajax({
				url : url,
				type : "POST",
				data :{
					"recordIds[]" : recordId
					},
			
				success : function(result) {
					
					if ($(".form").valid()) {
						form.submit();
					} else {
						hideOverlayLoader();
					}

					new PNotify({
						title: 'Done',
					    text: 'Record Cloned Successfully.',
					    type: 'success',
					    opacity: .8
					});
					hideOverlayLoader();
				},
				error : function() {
					
					new PNotify({
					    title: 'Error',
					    text: error_message,
					    type: 'error',
					    opacity: .8
					});
				}
			});

}
/*
function onClickNumericFlag(){
	if (!$("#numericFlag").hasClass("btn-primary active")) {
		$("#numericFlag").addClass(" btn-primary active");
		$("#alphaNumericFlag").removeClass(" btn-primary active");
		$("#numericFlagHidden").prop("checked",true);  
	}
}

function onClickAlphaNumericFlag(){
	if (!$("#alphaNumericFlag").hasClass("btn-primary active")) {
		$("#alphaNumericFlag").addClass(" btn-primary active");
		$("#numericFlag").removeClass(" btn-primary active");
		$("#numericFlagHidden").prop("checked",false);
	}	
}
*/
function onClickNumericFlag(){
	
	if (!$("#numericFlag").hasClass("btn-primary active")) {
		$("#numericFlag").addClass(" btn-primary active");
		$("#alphaNumericFlag").removeClass(" btn-primary active");
		$("#numericFlagHidden").prop("checked",true);  
	}
	$('#validationTypeDropDown').empty();
	$('#validationTypeDropDown').append("<option value='startsEndsWith' >Starts-Ends With</option><option value='range' >Range</option>");
	showValidationFields();
	
}

function onClickAlphaNumericFlag(){
	if (!$("#alphaNumericFlag").hasClass("btn-primary active")) {
		$("#alphaNumericFlag").addClass(" btn-primary active");
		$("#numericFlag").removeClass(" btn-primary active");
		$("#numericFlagHidden").prop("checked",false);
	}
	$('#validationTypeDropDown').empty();
	$('#validationTypeDropDown').append("<option value='startsEndsWith' >Starts-Ends With</option>");
	showValidationFields();
}

function onClickActiveButtons() {
	if (!$("#activeFlag").hasClass("btn-primary active")) {
		$("#activeFlag").addClass(" btn-primary active");
		$("#inActiveFlag").removeClass(" btn-primary active");
		$("#activeStatusHidden").prop("checked",true);  
	}
}
function onClickInActiveButtons() {
	if (!$("#inActiveFlag").hasClass("btn-primary active")) {
		$("#inActiveFlag").addClass(" btn-primary active");
		$("#activeFlag").removeClass(" btn-primary active");
		$("#activeStatusHidden").prop("checked",false);
	}
}

function onClickOnlineButton() {
	if (!$("#onlineFlag").hasClass("btn-primary active")) {
		$("#onlineFlag").addClass(" btn-primary active");
		$("#offlineFlag").removeClass(" btn-primary active");
		$("#offlineFlagHidden").prop("checked",false);
	}
}

function onClickOfflineeButton() {
	if (!$("#offlineFlag").hasClass("btn-primary active")) {
		$("#offlineFlag").addClass(" btn-primary active");
		$("#onlineFlag").removeClass(" btn-primary active");
		$("#offlineFlagHidden").prop("checked", true);
	}
}

function getGlobalActiveFlag(activeFlagVal, viewMode, editMode) {
	if (viewMode == "" && editMode == "" && activeFlagVal == "") {
		$("#activeFlag").addClass(" btn-primary active");
		$("#activeStatusHidden").removeAttr("checked", "checked");
	} else if (viewMode == "true") {
		$("#activeFlag").attr("disabled", "disabled");
		$("#inActiveFlag").attr("disabled", "disabled");
		if (activeFlagVal == "true") {
			$("#activeFlag").addClass(" btn-primary active");
			$("#activeStatusHidden").prop("checked", true);
		} else {
			$("#inActiveFlag").addClass(" btn-primary active");
			$("#activeStatusHidden").removeAttr("checked", "checked");
		}
	} else if (editMode == "true") {
		if (activeFlagVal == "true") {
			$("#activeFlag").addClass(" btn-primary active");
			$("#activeStatusHidden").prop("checked", true);
		} else {
			$("#inActiveFlag").addClass(" btn-primary active");
			$("#activeStatusHidden").removeAttr("checked", "checked");
		}
	} else {
		$("#activeFlag").addClass(" btn-primary active");
		$("#activeStatusHidden").prop("checked", true);
	}
}

function getGlobalOnlineFlag(offlineFlagVal, viewMode, editMode) {
	if (viewMode == "" && editMode == "" && offlineFlagVal == "") {
		$("#onlineFlag").addClass(" btn-primary active");
		$("#offlineFlagHidden").removeAttr("checked", "checked");
	} else if (viewMode == "true") {
		$("#onlineFlag").attr("disabled", "disabled");
		$("#offlineFlag").attr("disabled", "disabled");
		if (offlineFlagVal == "true") {
			$("#offlineFlag").addClass(" btn-primary active");
			$("#offlineFlagHidden").prop("checked", true);
		} else {
			$("#onlineFlag").addClass(" btn-primary active");
			$("#offlineFlagHidden").removeAttr("checked", "checked");
		}
	} else if (editMode == "true") {
		if (offlineFlagVal == "true") {
			$("#offlineFlag").addClass(" btn-primary active");
			$("#offlineFlagHidden").prop("checked", true);
		} else {
			$("#onlineFlag").addClass(" btn-primary active");
			$("#offlineFlagHidden").removeAttr("checked", "checked");
		}
	} else {
		$("#onlineFlag").addClass(" btn-primary active");
		$("#offlineFlagHidden").removeAttr("checked", "checked");
	}
}

function deleteRecordAfterConfirmation(context){
	DeleteRecord(context);
	var masterID = document.getElementById("masterID").value;
	$('#deleteRecordInside_'+masterID).modal('hide');
}


function closeConfirmDialogInside()
{
	var masterID = document.getElementById("masterID").value;
	$('#deleteRecordInside_'+masterID).modal('hide');
}

function formMoneyValueTextBox(amountFieldObj, currencyFieldObj, finalObj){
	var amount = amountFieldObj.val();
	var currencyId = currencyFieldObj.attr('id');
	var currency = $("#"+currencyId+" option:selected").text();
	if(amount!="" && currency!=""){
		finalObj.val(currency+"~"+amount);
	}
}

function formMoneyValueLabel(amountFieldObj, currencyFieldObj, finalObj){
	var amount = amountFieldObj.val();
	var currency = currencyFieldObj.val();
	if(amount!="" && currency!=""){
		finalObj.val(currency+"~"+amount);
	}
}

function setCurrencyDropDown(orgId , currency ){

	$("#listMoney_" + orgId + " option[selected='selected']").removeAttr("selected");
	$("#listMoney_" + orgId + " option").each(function() {
		if ($(this).data('code') == currency) {
			$(this).prop("selected", true);
		}
	});
}
function notifyStatus(message, success) {
	if(showNotifications=="true"){
		new PNotify({
			title : "",
			text : message,
			type : success,
			pnotify_animate_speed : fadeOutduration,
			opacity : .95
		});
	}
}

//To Disable dynatree
function disableDynatree(node) {
	node.data.unselectable = true;
}

//To remove outset-shadow-focus class
function removeOutsetShadowFocusClass(element) {
	$(element).parents('.form-group').removeClass('outset-shadow-focus clearfix');
}

function initValidationOnForms(){
	$(".form").each(function() {
		$(this).validate(defaultValidationOptions);
	});
}

//To Disable Master's Screen
function showOverlayLoader() {
	$(".overlay-loader").show();
	
	//To remove the loader that comes after AJAX call is fired
	if ($('#loading').length) {
		$('#loading').remove();
	}
}

//To Enable Master's Screen
function hideOverlayLoader() {
	$(".overlay-loader").hide();
}

function focusErrorField(){
	var listError = $(".error");
    if($(listError[0]).find(".chosen-container").length > 0){
        $(listError[0]).find("select.chosen-done").trigger('chosen:activate')
    }
    else if($(listError[0]).find("input[type='text']").length > 0){
        $(listError[0]).find("input[type='text']").focus();
    }
    else if($(listError[0]).find("input[type='radio']").length > 0){
        $(listError[0]).find("input[type='radio']").focus();
    }
    else if($(listError[0]).find("input[type='checkbox']").length > 0){
        $(listError[0]).find("input[type='checkbox']").focus();
    }
    else if($(listError[0]).find("textarea").length > 0){
        $(listError[0]).find("textarea").focus();
    }
    else if($(listError[0]).find("select").length > 0){
        $(listError[0]).find("select").focus();
    }
}