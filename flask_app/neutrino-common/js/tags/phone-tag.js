var mobileValidationConfiguration = 'FALSE';
var allowInvalidNumber = 'FALSE';
function phoneTagScript(phoneTagScriptInput) {

function updateChosenTag1(dd) {
   $(dd).trigger("chosen:updated");

}

function updateChosenTag2(dd) {
   $(dd).trigger("change");

}

var elVarMap = {};

elVarMap["id"] = phoneTagScriptInput.idVal_phoneTag;
elVarMap["phoneNumber_label"] = phoneTagScriptInput.phoneNumber_label_phoneTag;
elVarMap["numberValid"] = phoneTagScriptInput.numberValid_phoneTag;
elVarMap["country_label"] = phoneTagScriptInput.country_phoneTag;
elVarMap["phoneNumber_label"] = phoneTagScriptInput.phoneNumber_label_phoneTag;
elVarMap["phoneNumber_label"] = phoneTagScriptInput.phoneNumber_label_phoneTag;


   var isMobileID;
   var islandlineID;
   var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();

  $(document).ready(function(){

    var casClient=$('#casClient').val();
     if(casClient == 'dcb'){
        var allowInvalidFlag = 1;
        if(localStorage.getItem("allow-invalid-mobile-number") != null){
               var object = JSON.parse(localStorage.getItem("allow-invalid-mobile-number"));
                var oldTime = object.oldDate;
                var timeDiff = Math.abs(oldTime - new Date().getTime());
                if(Math.ceil(timeDiff/60000) > 10){
                   localStorage.removeItem("allow-invalid-mobile-number");
                }else{
                   allowInvalidNumber = object.keyValue;
                   allowInvalidFlag = 0;
                }
        }
        if(allowInvalidFlag == 1){
            var invalidMobileValidatorAjaxUrl=getContextPath()+"/app/configuration/allowInvalidNumber";
                $.ajax({
                    //to get configuration for mobile number validation
                    url : invalidMobileValidatorAjaxUrl,
                    type : 'POST',
                    async : false,
                    success : function(jqXHR) {
                      var object = {keyValue: jqXHR,oldDate: new Date().getTime()}
                       localStorage.setItem("allow-invalid-mobile-number", JSON.stringify(object));
                       allowInvalidNumber = jqXHR;
                    }
                });
        }
        if(allowInvalidNumber){
                $("input.form-control.phoneValid").each(function() {
                        $(this).removeClass("phoneValid");
                });
        }
     }
  });

   $(document)
         .ready(
               function() {
                  var mobile_flg = 1;
                  if(localStorage.getItem("custom-mobile-validation-key") != null){
                     var object = JSON.parse(localStorage.getItem("custom-mobile-validation-key"));
                     var oldTime = object.oldDate;
                     var timeDiff = Math.abs(oldTime - new Date().getTime());
                     if(Math.ceil(timeDiff/60000) > 10){
                        localStorage.removeItem("custom-mobile-validation-key");
                     }else{
                        mobileValidationConfiguration = object.keyValue;
                        mobile_flg = 0;
                       if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                           $(phoneTagScriptInput.phoneNumberId_phoneTag)
                           .popover(
                                 {
												trigger : 'change',
												trigger : 'change',
                                    placement : "right",
                                    html : true,
                                    title : phoneTagScriptInput.phoneNumber_label_phoneTag,
                                    content : '<div class="popup-content">'
                                          + '<div class="popup-item"><div class="popup-label">' + phoneTagScriptInput.numberValid_phoneTag + '</div><div id="phone_valid'+phoneTagScriptInput.idVal_phoneTag+'" class="phone_valid popup-value"></div>'
                                          + '</div><div class="popup-divider"></div><div class="popup-item">'
                                          + '<div class="popup-label">'+phoneTagScriptInput.country_phoneTag+'</div><div id="phone_country'+ phoneTagScriptInput.idVal_phoneTag+'" class="phone_country popup-value"></div></div>'
                                           });
                        }
                     }
                  }

                  if(mobile_flg == 1){
                      var mobileValidatorAjaxUrl=getContextPath()+"/app/configuration/getMobileValidationConfig";
                        $.ajax({
                            //to get configuration for mobile number validation
                            url : mobileValidatorAjaxUrl,
                            type : 'POST',
                            async : false,
                            success : function(jqXHR) {
                              var object = {keyValue: jqXHR,oldDate: new Date().getTime()}
                               localStorage.setItem("custom-mobile-validation-key", JSON.stringify(object));
                               mobileValidationConfiguration = jqXHR;
                               $(phoneTagScriptInput.id_phoneTag).each(function() {
                                 if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                                    $(phoneTagScriptInput.phoneNumberId_phoneTag)
                                    .popover(
                                          {
                                             trigger : 'change',
                                             trigger : 'change',
                                             placement : "right",
                                             html : true,
                                             title : phoneTagScriptInput.phoneNumber_label_phoneTag,
                                             content : '<div class="popup-content">'
                                                   + '<div class="popup-item"><div class="popup-label">' + phoneTagScriptInput.numberValid_phoneTag + '</div><div id="phone_valid'+phoneTagScriptInput.idVal_phoneTag+'" class="phone_valid popup-value"></div>'
                                                   + '</div><div class="popup-divider"></div><div class="popup-item">'
                                                   + '<div class="popup-label">'+phoneTagScriptInput.country_phoneTag+'</div><div id="phone_country'+ phoneTagScriptInput.idVal_phoneTag+'" class="phone_country popup-value"></div></div>'
                                                   });
                                 }
                              });

                            },
                            error : function() {
                              alert("Error");
                            }

                        });
                  }

               $(phoneTagScriptInput.isdCode_Id_phoneTag).attr('readonly', 'readonly');
                    $(phoneTagScriptInput.id_isdCode_phoneTag).attr('readonly', 'readonly');

                          var testVar = phoneTagScriptInput.populateISOFromCountry_phoneTag;
                                var data;

                                if(testVar=="true"){
                                    data = phoneTagScriptInput.phoneTagInitializerData_phoneTag;
                                }else{
                                    data = phoneTagScriptInput.phoneTagData_phoneTag;
                                }

                                var pushData = data["pushData"];
                        var otherMap = data["otherMap"];
                        isMobileID = otherMap["isMobileNumber"];
                        islandlineID = otherMap["isLandlineNumber"];

                        $(phoneTagScriptInput.idSelect_phoneTag).html(pushData);
                        $(phoneTagScriptInput.idSelectTag_phoneTag).html(pushData);
                        updateChosenTag1('.select_country');
                        //populateDefaultValuesForPhone_${modifiedId}();
                        phoneTagScriptInput.fPopulateDefaultValuesForPhone_phoneTag[phoneTagScriptInput.populateDefaultValuesForPhone_phoneTag]();
                        $(phoneTagScriptInput.idcountryCode_phoneTag).val(
                                $(phoneTagScriptInput.idOptionSelected_phoneTag)
                                      .html());
                        var x =phoneUtil.getCountryCodeForRegion($(phoneTagScriptInput.idSelect_phoneTag).val());
                        var y =phoneUtil.getCountryCodeForRegion($(phoneTagScriptInput.idSelectTag_phoneTag).val());
                        if(x){
                           $(phoneTagScriptInput.id_isdCode_phoneTag).val("+" + x);
                        }

                        if(y){
                           $(phoneTagScriptInput.isdCode_Id_phoneTag).val("+" + y);
                        }
						$(phoneTagScriptInput.isLandlineNumberId_phoneTag).val(islandlineID);
                  $(phoneTagScriptInput.isMobileNumberId_phoneTag).val(isMobileID);

                  $(phoneTagScriptInput.idSelect_phoneTag).change(
                        function() {
                           if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                              var x =phoneUtil.getCountryCodeForRegion($(this).val());
                              $(phoneTagScriptInput.id_isdCode_phoneTag).val("+" + x);

                              var mobileNumber = $(phoneTagScriptInput.id_isdCode_phoneTag)
                                    .val()
                                    + $(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              $(phoneTagScriptInput.id_phoneTag).val(mobileNumber);
                              var id = phoneTagScriptInput.idVal_phoneTag;
                              processPhone(id);
                              var countryCode=$(phoneTagScriptInput.id_isdCode_phoneTag).val();
                              var testNumber=$(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              validPhoneNumber_check(countryCode,testNumber,id);

                              $(phoneTagScriptInput.idcountryCode_phoneTag).val(
                                    $(phoneTagScriptInput.idOptionSelected_phoneTag)
                                          .html());
                           }
                        });
                  $(phoneTagScriptInput.idSelectTag_phoneTag).change(
                        function() {
                           if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                              var y = phoneUtil.getCountryCodeForRegion($(this).val());
                              $(phoneTagScriptInput.isdCode_Id_phoneTag).val("+" + y);
                              $(phoneTagScriptInput.countryCodeId_phoneTag).val(
                                    $(phoneTagScriptInput.idOptionSelectedWithUnderScore_phoneTag)
                                          .html());
                           }

                        });
                  $(phoneTagScriptInput.id_isdCode_phoneTag).keyup(
                        function() {
                           if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                              var mobileNumber = $(phoneTagScriptInput.id_isdCode_phoneTag)
                              .val()
                              + $(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              $(phoneTagScriptInput.id_phoneTag).val(mobileNumber);
                              var id = phoneTagScriptInput.idVal_phoneTag;
                              processPhone(id);
                              var countryCode=$(phoneTagScriptInput.id_isdCode_phoneTag).val();
                              var testNumber=$(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              validPhoneNumber_check(countryCode,testNumber,id);
                           }
                        });
                  $(phoneTagScriptInput.phoneNumberId_phoneTag).keyup(
                        function() {
                           if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                              var mobileNumber = $(phoneTagScriptInput.id_isdCode_phoneTag)
                              .val()
                              + $(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              $(phoneTagScriptInput.id_phoneTag).val(mobileNumber);
                              var id = phoneTagScriptInput.idVal_phoneTag;
                              var countryCode=$(phoneTagScriptInput.id_isdCode_phoneTag).val();
                              var testNumber=$(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              validPhoneNumber_check(countryCode,testNumber,id);
                           }
                        });
                  $(phoneTagScriptInput.phoneNumberId_phoneTag).click(
                        function() {
                           if(mobileValidationConfiguration.toUpperCase() == 'FALSE'){
                              var mobileNumber = $(phoneTagScriptInput.id_isdCode_phoneTag)
                              .val()
                              + $(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              $(phoneTagScriptInput.id_phoneTag).val(mobileNumber);
                              var id = phoneTagScriptInput.idVal_phoneTag;
                              clickPhone(id);
                              var countryCode=$(phoneTagScriptInput.id_isdCode_phoneTag).val();
                              var testNumber=$(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                              validPhoneNumber_check(countryCode,testNumber,id);
                           }
                        });

                  function mobileValidator(){

                  }

                  $(phoneTagScriptInput.phoneNumberId_phoneTag).blur(function() {
                     var mobileNumber=$(phoneTagScriptInput.phoneNumberId_phoneTag).val();
                     if(mobileValidationConfiguration.toUpperCase() == 'TRUE' && mobileNumber.length > 0){
                          var countryCode=$(phoneTagScriptInput.id_isdCode_phoneTag).val();
                          var mobileValidationAjaxUrl=getContextPath()+"/app/configuration/validateMobileNumber";
                          var numbers = /^[0-9]+$/;
                           if(numbers.test(mobileNumber))
                           {
                              $.ajax({
                                  // mobile number validation
                                  url : mobileValidationAjaxUrl,
                                  type : 'POST',
                                  async : false,
                                  data : {
                                       "countryCode" : countryCode,
                                    "mobileNumber" : mobileNumber
                                 },
                                  success : function(result) {
                                     $('#'+phoneTagScriptInput.idVal_phoneTag+'_isValid').val(result);

                                     if(result == true || result == 'true'){
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('error');
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.custom_phone_check_error').remove();
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.alert-warning').remove();
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('alert-warning');
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').addClass('success');
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).removeClass('error');

                                     }
                                     else if(!(result == true || result == 'true') && allowInvalidNumber.toUpperCase() == 'TRUE'){
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('success');
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('error');
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.custom_phone_check_error').remove();
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.alert-warning').remove();
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').addClass('alert-warning');
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.mobile-phn-container').after('<span class="alert-warning">Invalid Mobile Number</span>');
                                                  $(phoneTagScriptInput.phoneNumberId_phoneTag).removeClass('error');

                                              }
                                     else{
                                        $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').addClass('error');
                                        $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.custom_phone_check_error').remove();
                                        $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.alert-warning').remove();
                                        $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.mobile-phn-container').after('<span class="help-block custom_phone_check_error">Invalid Mobile Number</span>');
                                        $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('alert-warning');
                                       $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('success');
                                       $.sticky("Please enter valid mobile number.", {autoclose : 5000, position: "top-right", type: "st-error" });
                                     }
                                  },
                                  error : function() {
                                    alert("Error");
                                  }

                              });
                           }else{
                              $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.custom_phone_check_error').remove();
                              $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.alert .alert-warning').remove();
                           }
                     }else if(mobileNumber.length == 0){
                        $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('error');
                         $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').addClass('success');
                         $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.custom_phone_check_error').remove();
                         $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').find('.alert-warning').remove();
                         $(phoneTagScriptInput.phoneNumberId_phoneTag).parents('.form-group').removeClass('alert-warning');
                     }
                  });
               // $(".mask_phone").inputmask("999-999-9999");
                  $(".mask_phone").attr('maxLength', 13);
                  if(phoneTagScriptInput.mobile_phoneTag==='true') {
                     executeOnLoad([phoneTagScriptInput.idSelect_phoneTag]);
                  }else {
                      executeOnLoad([phoneTagScriptInput.idSelectTag_phoneTag]);
                  }
               });

   var casClient=$('#casClient').val();

   function validMobileNumber(countryCode, phoneNumber,id) {

      var number = countryCode.concat(phoneNumber);
      var number = countryCode.concat(phoneNumber);

      /*var selectedCountryCode = $("#phoneNumberList1select option:selected")
      .text();*/

      var selectedCountryCode = $("#"+id).closest('div.mobile-phn-container').find("input[id$='countryCode']").val();
      if(countryCodeToName(selectedCountryCode) != '') { 
    	  $('#phone_country'+id).each(function() {$(this).html(selectedCountryCode + " - " + countryCodeToName(selectedCountryCode));});
      }
      var fixedLineOrMobile;
      
      if($("#"+id).closest('div.mobile-phn-container').find("input").hasClass('phn_tag_mobile')){
         fixedLineOrMobile = "Mobile";
      }else{
         fixedLineOrMobile = "Fixed_Line";
      }

      if (phoneNumber != '') {
         //check for number less than 10 has been removed as for france no of digits in a mobile number is 9. For myanmar no of digits ina a mobile number is 6. Issue#20227
         /*if (phoneNumber.length > 13) {
            return false;
         }*/
         /*changes made because google plugin doesnot validate number starting with 7 like 7077383883
         if(countryCode == '+91'){
         var phoneNumberValid=/^[6789]\d{9}$/;
         if (phoneNumberValid.test(phoneNumber) == false) {
            return false;
         }
         }
         else{*/
            var h = i18n.phonenumbers.PhoneNumberUtil.getInstance();
            try {
            	 var k = h.parseAndKeepRawInput(number, selectedCountryCode);
                 var e = h.isValidNumber(k);
                 var numberType = h.getNumberType(k);

                 if(numberType == -1) {
                    return false;
                 }
                 if (numberType == 0 && fixedLineOrMobile != 'Fixed_Line') {
                        return false;
                 }
                 if (numberType == 1 && fixedLineOrMobile != 'Mobile') {
                       return false;
                 }

                 if (e == false) {
                    return false;
                 }
            } catch(err) {
            	return false;
            }
         }

      var isdCode = /^\+*[0-9]{0,4}$/;
      if (isdCode.test(countryCode) == false) {
         return false;
      }
      if (!phoneNumber || phoneNumber == '') {
         return false;
      }
      //check for number less than 10 has been removed as for france no of digits in a mobile number is 9. For myanmar no of digits ina a mobile number is 6. Issue#20227
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

   function validPhoneNumber_check(countryCode, phoneNumber,id){
      var isNumberValid=validMobileNumber(countryCode, phoneNumber,id);
      var output = new goog.string.StringBuffer();
      output.append(isNumberValid);
      $('#phone_valid'+id).each(function() {$(this).html(output.toString());});
      $('#'+phoneTagScriptInput.idVal_phoneTag+'_isValid').val(output.toString());
   }

   phoneTagScriptInput.fPopulateDefaultValuesForPhone_phoneTag[phoneTagScriptInput.populateDefaultValuesForPhone_phoneTag] = function (countryCode){
      var phoneByProperty=jQuery.parseJSON(phoneTagScriptInput.flagForPhoneOutsideAddressTag_phoneTag);
        var testVar = phoneTagScriptInput.populateISOFromCountry_phoneTag;
        if(testVar=="true"){
           var countryCodeMap=phoneTagScriptInput.countryCodeFromCountryMaster_phoneTag;
        }else{
        if(phoneByProperty==true){
           var countryCodeMap=phoneTagScriptInput.countryCodeFromCountryMaster_phoneTag;
        }
        else{
           var countryCodeMap=phoneTagScriptInput.countryCodeAlpha2Alpha3Map_phoneTag;
        }
        }
      var defaultCountryId = phoneTagScriptInput.applicationScope_phoneTag;
      var selectedCountry;
      var currentPhoneSelection = $(phoneTagScriptInput.countryCodeId_phoneTag).val();
      var currentMobileSelection = $(phoneTagScriptInput.idcountryCode_phoneTag).val();


      if(countryCode==='undefined' || countryCode==null || countryCode.trim()==""){
         selectedCountry= countryCodeMap[defaultCountryId];

      }else{
         selectedCountry = countryCodeMap[countryCode];
      }
      var selectedCountryId = $("#text_country").val();
      if((countryCode==='undefined' || countryCode == undefined || countryCode==null || countryCode.trim()=="")
      && (!(selectedCountryId==='undefined' || selectedCountryId == undefined) && selectedCountryId!=""))
{
            addressAjaxUrl=getContextPath()+"/app/AddressTag/populateSelectedCountryInCaseofNull";

            $
            .ajax({
                //to populate countryISOCode in case no value is saved with phone and mobile no.
                url : addressAjaxUrl,
                data : ({
                       selectedCountryId : selectedCountryId
                        }),
                type : 'POST',
                async : false,
                success : function(jqXHR) {
               countryCode = jqXHR;
                    selectedCountry = countryCodeMap[countryCode];
                },
                error : function() {
               alert("error");
                }

            });

        }
      if(phoneTagScriptInput.mobile_phoneTag && phoneTagScriptInput.mobile_phoneTag == 'false')
      {
         if(!currentPhoneSelection){
            $(phoneTagScriptInput.id_phoneTag+"_select"+ ' option').each(function(){
               if($(this).text() == selectedCountry) {
                   $(this).attr('selected', 'selected');
                   return false;
               }
            });
         }else{
            $(phoneTagScriptInput.id_phoneTag+"_select"+ ' option').each(function(){
               if($(this).text() == currentPhoneSelection) {
                   $(this).attr('selected', 'selected');
                   return false;
               }
            });
         }
         updateChosenTag1('.select_country');
         updateChosenTag2(phoneTagScriptInput.idSelectTag_phoneTag);
      }
      if(phoneTagScriptInput.mobile_phoneTag && phoneTagScriptInput.mobile_phoneTag == 'true')
      {
         if(!currentMobileSelection){
            $(phoneTagScriptInput.id_phoneTag+"select"+ ' option').each(function(){
               if($(this).text() == selectedCountry) {
                   $(this).attr('selected', 'selected');
                   return false;
               }
            });
         }else{
            $(phoneTagScriptInput.id_phoneTag+"select"+ ' option').each(function(){
               if($(this).text() == currentMobileSelection) {
                   $(this).attr('selected', 'selected');
                   return false;
               }
            });

         }
         updateChosenTag1('.select_country');
         updateChosenTag2(phoneTagScriptInput.idSelect_phoneTag);
      }


   }

}


function forcePopulateValuesForPhone(phoneTagId,countryCode){

   var isMobileNumber=false;

   var isLandlineNumber = $("#isLandlineNumber_"+phoneTagId).val();
   if(isLandlineNumber==='undefined' || isLandlineNumber==null || isLandlineNumber.trim()==""){
      isMobileNumber = true;
   }
   var phoneByProperty=jQuery.parseJSON(this.flagForPhoneOutsideAddressTag_phoneTag);
   var testVar = this.populateISOFromCountry_phoneTag;
    if(testVar=="true"){
       var countryCodeMap=this.countryCodeFromCountryMaster_phoneTag;
    }else{
    if(phoneByProperty==true){
       var countryCodeMap=this.countryCodeFromCountryMaster_phoneTag;
    }
    else{
       var countryCodeMap=this.countryCodeAlpha2Alpha3Map_phoneTag;
   }
    }
   var defaultCountryId = this.applicationScope_phoneTag;
   var selectedCountry;


   if(countryCode==='undefined' || countryCode==null || countryCode.trim()==""){
      selectedCountry= countryCodeMap[defaultCountryId];

   }else{
      selectedCountry = countryCodeMap[countryCode];
   }
   var selectedCountryId = $("#text_country").val();
    if((countryCode==='undefined' || countryCode == undefined || countryCode==null || countryCode.trim()=="")
   && (!(selectedCountryId==='undefined' || selectedCountryId == undefined) && selectedCountryId!=""))
   {
        addressAjaxUrl=getContextPath()+"/app/AddressTag/populateSelectedCountryInCaseofNull";

        $
        .ajax({
            //to populate countryISOCode in case no value is saved with phone and mobile no.
            url : addressAjaxUrl,
            data : ({
                    selectedCountryId : selectedCountryId
                    }),
            type : 'POST',
            async : false,
            success : function(jqXHR) {
                countryCode = jqXHR;
                selectedCountry = countryCodeMap[countryCode];
            },
            error : function() {
                alert("error");
            }

        });

    }
   var removeAttrFlag = false;
      var addAttrFlag = false;
   if(!isMobileNumber){
         $("#"+phoneTagId+"_select"+ ' option').each(function(){
            if($(this).attr("selected") =="selected"){
               $(this).removeAttr("selected");
               removeAttrFlag = true;
            }
            if($(this).text() == selectedCountry) {
                $(this).attr('selected', 'selected');
                addAttrFlag = true;
            }
               if(removeAttrFlag && addAttrFlag) {
               return;
               }
         });
         updateChosenTag1('.select_country');
         updateChosenTag2("#"+phoneTagId+"_select");
      }else{
         $("#"+phoneTagId+"select"+ ' option').each(function(){
            if($(this).attr("selected") =="selected"){
               $(this).removeAttr("selected");
               removeAttrFlag = true;
            }
            if($(this).text() == selectedCountry) {
                $(this).attr('selected', 'selected');
                addAttrFlag = true;
            }
               if(removeAttrFlag && addAttrFlag) {
               return;
               }
         });
         updateChosenTag1('.select_country');
         updateChosenTag2("#"+phoneTagId+"select");
      }

}
