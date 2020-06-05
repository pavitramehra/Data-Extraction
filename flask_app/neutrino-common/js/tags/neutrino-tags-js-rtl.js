/**
 * Externalized script for neutrino tags for performance issues
 */

// for input tag
function applyTooltip(id, alignToolTip) {
	if(alignToolTip){
		$("#" + id).tooltip({
			"placement" : alignToolTip
		});	
	}

	else{
		alignToolTip = 'right';
		$("#" + id).tooltip({
			"placement" : alignToolTip
		});	
	}
	
}

function initializeInputTag(id, imgClassVar, imgIdVar) {

	var rootSelector = $('#' + id + '-control-group > .tooltip:visible');

	if (rootSelector.length > 0) {
		var imgClass = imgClassVar;
		var imgId = imgIdVar;

		// var left = parseInt($("div[id='${id}-control-group'] >
		// div").css("left")) + 32;

		var left;

		var selectedItem = $("div[id='" + id + "-control-group'] > a");
		if (selectedItem.length > 0) {

			left = (parseInt(selectedItem.offset().left))
					+ (parseInt(selectedItem.width()));
		}

		else {
			left = '0';
		}

		left = String(left) + "px";
		if (imgClass != "" && imgId != "") {
			var selectedItem2 = $("div[id='" + id + "-control-group'] > div");
			selectedItem2.css("left", left);
		}
	}

	$('p.text-danger').css("font-size", "15px");
	addEventsForNonPrintingCharactersCheck(id);
}

$('body').on("keyup", '.inputCaseUpper', function() {
	this.value = this.value.toUpperCase();
});

$('body').on("keyup", '.inputCaseLower', function() {
	this.value = this.value.toLowerCase();
});


//for phone.tag

function updateChosenTag1(dd) {
	$(dd).trigger("chosen:updated");
}

function initializePhoneTag(elVarMap){
	
	var isMobileID
	var islandlineID
	
	var idSelector="#"+elVarMap["id"];
	var idd=elVarMap["id"];
	
	$(idSelector+"_phoneNumber")
	.popover(
			{
				trigger : 'change',
				trigger : 'change',
				placement : "right",
				html : true,
				title : elVarMap["phoneNumber_label"],
				content : '<div class="popup-content">'
						+ '<div class="popup-item"><div class="popup-label">'+elVarMap["numberValid"]+'</div><div id="phone_valid'+idd+'" class="phone_valid popup-value"></div>'
						+ '</div><div class="popup-divider"></div><div class="popup-item">'
						+ '<div class="popup-label">'+elVarMap["country_label"]+'</div><div id="phone_country'+idd+'" class="phone_country popup-value"></div></div>'
			});
	
	
	//load country codes
	
	$
	.ajax({
		url : getContextPath()+"/app/PhoneNumber/loadCountryCodes",
		type : 'GET',
		dataType : 'json',
		async : false,
		success : function(data) {
			var pushData = '<option value="">Select</option>';
			for ( var key in data) {

				if (($(idSelector+"_isdCode").val() != null && $(
						idSelector+"_isdCode").val() != "")
						|| ($("#isdCode_"+idd)
								.val() != null && $(
								"#isdCode_"+idd)
								.val() != "")) {
					if (((("+" + data[key]) == ($(idSelector+"_isdCode")
							.val())) && ($(
							idSelector+'_countryCode')
							.val() == key))
							|| ((("+" + data[key]) == ($("#isdCode_"+idd)
									.val())) && ($(
									'#countryCode_'+idd)
									.val() == key))) {
						pushData += '<option value="' + data[key] + '" selected="selected">'
								+ key + '</option>';

					} else {
						pushData += '<option value="' + data[key] + '">'
								+ key + '</option>';
					}
				} else {
					if (data["countryCode"] == key) {
						pushData += '<option value="' + data[key] + '" selected="selected">'
								+ key + '</option>';

					} else {
						pushData += '<option value="' + data[key] + '">'
								+ key + '</option>';
					}
				}

				isMobileID = data["isMobileNumber"];
				islandlineID = data["isLandlineNumber"];

			}
			$(idSelector+'select').html(pushData);
			$(idSelector+'_select').html(pushData);
			updateChosenTag1('.select_country');
			var x = $(idSelector+"select").val();
			var y = $(idSelector+"_select").val();
			$(idSelector+'_isdCode').val("+" + x);
			$('#isdCode_'+idd).val("+" + y);
			$(idSelector+'_countryCode')
					.val(
							$(
									idSelector+'select option:selected')
									.html());
			$('#countryCode_'+idd)
					.val(
							$(
									idSelector+'_select option:selected')
									.html());

		},
		error : function(jqXHR, textStatus,
				errorThrown) {
			alert(JSON.stringify(jqXHR) + " : "
					+ textStatus + " : "
					+ errorThrown);
		}
	});
	
	
	//other binders
	
	
	$('#isLandlineNumber_'+idd).val(islandlineID);
	$('#isMobileNumber_'+idd).val(isMobileID);
	$(idSelector+"select").change(
			function() {
				var x = $(this).val();
				$(idSelector+'_isdCode').val("+" + x);

				var mobileNumber = $(idSelector+'_isdCode')
						.val()
						+ $(idSelector+'_phoneNumber').val();
				$(idSelector).val(mobileNumber);
				processPhone(idd);
				$(idSelector+'_countryCode').val(
						$(idSelector+'select option:selected')
								.html());
			});
	$(idSelector+"_select").change(
			function() {
				var y = $(this).val();
				$('#isdCode_'+idd).val("+" + y);
				$('#countryCode_'+idd).val(
						$(idSelector+'_select option:selected')
								.html());
			});
	$(idSelector+"_isdCode").keyup(
			function() {
				var mobileNumber = $(idSelector+'_isdCode')
						.val()
						+ $(idSelector+'_phoneNumber').val();
				$(idSelector).val(mobileNumber);
				processPhone(idd);
			});
	$(idSelector+"_phoneNumber").keyup(
			function() {
				var mobileNumber = $(idSelector+'_isdCode')
						.val()
						+ $(idSelector+'_phoneNumber').val();
				$(idSelector).val(mobileNumber);
				processPhone(idd);

			});
	$(idSelector+"_phoneNumber").click(
			function() {
				var mobileNumber = $(idSelector+'_isdCode')
						.val()
						+ $(idSelector+'_phoneNumber').val();
				$(idSelector).val(mobileNumber);
				clickPhone(idd);

			});
//	$(".mask_phone").inputmask("999-999-9999");
	$(".mask_phone").attr('maxLength', 10);
	
	
}


//for regionalDatepicker.tag

$(document).on('click','.calendars-month td a',function(){
	$('.is-calendarsPicker').trigger('change')
})

function initRegionalDatePickerTag(id,triggerElementId,regionalTooltipMessage,regionalLocale,regionalDateFormat){
	
	if( regionalLocale != "" ){
		var calendar = $.calendars.instance(regionalLocale);
		
		$('#'+id).calendarsPicker(
				{
				 calendar: calendar,
				 showOnFocus: false,
				 dateFormat: regionalDateFormat,
				 showTrigger: '<span  id="'+triggerElementId+'" class="input-group-addon float-r" rel="tooltip" title="'+regionalTooltipMessage+'"><i class="glyphicon glyphicon-th"></i></span>'
				});
		
			
	}
	
}
//for datepicker.tag

function initDatePickerTag(id,defDate,minFieldValue,maxFieldValue,dateFormat,view){
	$("#"+id).change(function() {
		if($("#"+id).valid()){
			compareDate($(this),minFieldValue,maxFieldValue,dateFormat);
		}
	});

	var current=$('#datepicker_'+id);
	
	if (defDate != "" && $("#"+id).val() == "") {
		//for minified js use autoclose: 1 else for non-minified js autoclose: true
		$(current).datepicker({ autoclose: 1 });	
		$(current).data({date: defDate}).datepicker('update');
	}
	if(current!='undefined'){
		applyDateFunction(current);
	}
}

function isValidDateee(txtDate)
{
  var currVal = txtDate;
  if(currVal == ''){
    return true;
  }
 //Declare Regex  
  var dateForMatRegEx= new Array();
  dateForMatRegEx.push(/^(\d{1,2})(-)(\d{1,2})(-)(\d{4})$/);
  dateForMatRegEx.push(/^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/); 
  dateForMatRegEx.push(/^(\d{4})(\.)(\d{1,2})(\.)(\d{1,2})$/); 
  dateForMatRegEx.push(/^(\d{4})(\/)(\d{1,2})(\/)(\d{1,2})$/);
  
  var dtArray = null;
  var validFormat=false;
  
  // is format OK?
  for(var index=0; index<dateForMatRegEx.length;index++){
	  dtArray = currVal.match(dateForMatRegEx[index]);
	  if(dtArray!=null){
		  validFormat = true;
		  break;
	  }
  }
  return validFormat;
  
 /*
 var dtMonth = dtArray[1];
 var dtDay= dtArray[3];
 var dtYear = dtArray[5];
 
	switch (defaultUserDateFormat) {
	
	case 'dd/MM/yyyy':
		var temp = dtDay;
		dtDay = dtMonth;
		dtMonth = temp;
		break;
	case 'dd/mm/yyyy':
		var temp = dtDay;
		dtDay = dtMonth;
		dtMonth = temp;
		break;
	default:
		break;
	}
  
	//alert("dtMonth "+dtMonth+" dtDay "+dtDay+" dtYear "+dtYear);

  if (dtMonth < 1 || dtMonth > 12)
      return false;
  else if (dtDay < 1 || dtDay> 31)
      return false;
  else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
      return false;
  else if (dtMonth == 2)
  {
     var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
     if (dtDay> 29 || (dtDay ==29 && !isleap))
          return false;
  }
  */
}
function compareDate(elementId,minFieldValue,maxFieldValue,dateFormat) {
	var isValidDatee=isValidDateee($(elementId).val());
	var selectedDate = $(elementId).val();
	if (selectedDate != "" && minFieldValue != "") {
		var minDateVal = Date.parseString(minFieldValue,dateFormat);
		var selectedDateVal = Date.parseString(selectedDate,dateFormat);
		if (selectedDateVal.valueOf() < minDateVal.valueOf()) {
			$(elementId).val("");
		}
	}

	if (selectedDate != "" && maxFieldValue != "") {

		var maxDateVal = Date.parseString(maxFieldValue,dateFormat);
		var selectedDateVal = Date.parseString(selectedDate,dateFormat);
		
		if (selectedDateVal.valueOf() > maxDateVal.valueOf()) {
			$(elementId).val("");
		}
	}
	if(isValidDatee==false){
		$(elementId).val("");
		$
		.sticky(
				invalid_date,
				{
					autoclose : 2000,
					position : "top-right",
					type : "st-error"
				});
	}
}

function 	bindOnChangeEvent(id,pluginDateFormat,defDate){
	$("#"+id).bind("change",function(){
		var valueDatePicker=$(this).val();
		if(valueDatePicker && ($.trim($(this).val()) != "") && ($.trim($(this).val()).length > 0)){
			var splitValue=new Array();
			
			var delimiter= ["-", ".", "/"];
			$.map(delimiter,function(obj) {
				   if (valueDatePicker.indexOf(obj) > -1) {
					   splitValue=valueDatePicker.split(obj);
				   }
			});
			
			var value1=splitValue[0];
			var value2=splitValue[1];
			var value3=splitValue[2];
			
			if(value1<10 && value1.length<2 ){
				value1="0"+value1;
			}
			if(value2<10 && value2.length<2){
				value2="0"+value2;
			}
			if(value3<10 && value3.length<2){
				value3="0"+value3;
			}
			
			var finalDate="";
			var defaultDateFormat=pluginDateFormat;
			if(defaultDateFormat=="dd-M-yyyy"){
				if(valueDatePicker.indexOf("-")<=0 && valueDatePicker.indexOf("/")<=0){
					value1=valueDatePicker.substring(0,2);
					if(valueDatePicker.length==7){
						value3=valueDatePicker.substring(3,valueDatePicker.length);
						var monthDate=valueDatePicker.charAt(2);
						if(!isNaN(monthDate))
						value2=Date.monthAbbreviations[monthDate-1];
					}else if(valueDatePicker.length==8){
						var monthDate=valueDatePicker.substring(2,4);
						value3=valueDatePicker.substring(4,valueDatePicker.length);
						if(!isNaN(monthDate))
						value2=Date.monthAbbreviations[monthDate-1];
					}else{
						value2=valueDatePicker.substring(2,valueDatePicker.length-4);   
						value3=valueDatePicker.substring(valueDatePicker.length-4,valueDatePicker.length); 
						$.each(Date.monthAbbreviations, function(index, value) { 
						  if (value.toLowerCase()==value2.toLowerCase()) {
						    value2=Date.monthAbbreviations[index];
								  }
								});
							}
					}
			}
			
			$.map(delimiter,function(obj) {
				if (valueDatePicker.indexOf(obj) > -1) {
					finalDate=value1+obj+value2+obj+value3;
				}
			});
			
			if(finalDate.indexOf("undefined") > -1){
				finalDate=valueDatePicker;
			}
			
			$(this).val(finalDate);
		}
	});
	
	$("#"+id).bind("keyup",function(){ 
		if( typeof defDate != "undefined" && 
				(defDate != "" && ( (($.trim($(this).val()) == "") && ($.trim($(this).val()).length == 0))  || !isValidDateee($(this).val()) ) ) ) {
			$('#datepicker_'+id).datepicker({ autoclose: 1 });	
			$('#datepicker_'+id).data({date: defDate}).datepicker('update');
		}else{
			$('#datepicker_'+id).data({date: $.trim($(this).val())}).datepicker('update');	
		}
	});
}

