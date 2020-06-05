function address_withoutMapScript(address_withoutMapScriptInput) {
	$(document)
			.ready(
					function() {
						populateDefaultCountry();

						populateResidenceFields(address_withoutMapScriptInput);
						
						$("#text_" + address_withoutMapScriptInput.id)
								.change(
										function() {
											var funcName = window['onCountryChange_'+ (address_withoutMapScriptInput.id)];
											if (typeof funcName === 'function') {
												var a = funcName.call(this);
											}
										});
						populateFieldsCountryAddressTypeChange();

					});
	$("#text_" + address_withoutMapScriptInput.id).data("relatedAddressTypeId",
			address_withoutMapScriptInput.relatedAddressTypeId);
	$(document).off('change','#'+address_withoutMapScriptInput.relatedAddressTypeId);
	$(document).on('change', '#'+address_withoutMapScriptInput.relatedAddressTypeId, function() {
		/*
		 * var addTypeValue = $('#addressType option:selected').attr(
		 * 'data-code'); if (addTypeValue == 'OfficeAddress') {
		 * $('#accomodationType').closest("div.row").hide();
		 * $("#accomodationType").attr("disabled", "disabled");
		 * $('#address_noOfYearsAtCurrentAdress-control-group')
		 * .closest("div.row").hide(); $('#accomodationType_mainDiv').hide();
		 * $('#residenceType_mainDiv').hide();
		 * $('#otherResidenceType_${htmlAddressId}').hide();
		 * $('#residenceType_${htmlAddressId}').attr("disabled", "disabled");
		 * $('#accomodationType_${htmlAddressId}').attr("disabled", "disabled");
		 * $('#othersDiv').hide(); } else {
		 * $('#accomodationType').closest("div.row").show();
		 * $('#address_noOfYearsAtCurrentAdress-control-group')
		 * .closest("div.row").show(); $('#accomodationType_mainDiv').show();
		 * $('#residenceType_mainDiv').show();
		 * $('#residenceType_${htmlAddressId}').removeAttr('disabled');
		 * $('#accomodationType_${htmlAddressId}').removeAttr('disabled');
		 * $('#otherResidenceType_${htmlAddressId}').show();
		 * $('#othersDiv').show(); }
		 */
		populateFieldsCountryAddressTypeChange();
		populateResidenceFields(address_withoutMapScriptInput);

	});

	function populateFieldsCountryAddressTypeChange() {
		// var addressId = "<c:out value='${addressID}' />";
		// Auto Populate rest of the address fields based on country,if aadress
		// is used in modal window

		if (address_withoutMapScriptInput.pathPrepender != "") {
			populateRegion(address_withoutMapScriptInput.pathPrepender
					+ '.', address_withoutMapScriptInput.id,
					address_withoutMapScriptInput.implementationType);
		} else {
			populateRegion(address_withoutMapScriptInput.pathPrepender,
					address_withoutMapScriptInput.id,
					address_withoutMapScriptInput.implementationType);
		}

	
		eventsOnLoadAndDomInsertedAddressTag();

	}

	function eventsOnLoadAndDomInsertedAddressTag() {
		var listOnLoadId = [ 'select[id^="text_"]' ];

		executeOnLoad(listOnLoadId);
	}

	function applyFuncOnLoadAddTag() {
		var regionIds = '[id^=remainingFields_]' + " " + 'select[id^=region_]';
		var stateIds = '[id^=remainingFields_]' + " " + 'select[id^=state_]';
		var cityIds = '[id^=remainingFields_]' + " " + 'select[id^=city_]';
		var districtIds = '[id^=remainingFields_]' + " "
				+ 'select[id^=district_]';
		var postalcodeIds = '[id^=remainingFields_]' + " "
				+ 'select[id^=Text_postalCode_]';
		var accomodationIds = '[id^=remainingFields_]' + " "
				+ 'select[id^=accomodationType_]';
		var residenceIds = '[id^=remainingFields_]' + " "
				+ 'select[id^=residenceType_]';
		var areIds = '[id^=remainingFields_]' + " " + 'select[id^=area_]';
		var listOnLoadId = [ regionIds, stateIds, cityIds, districtIds,
				postalcodeIds, accomodationIds, residenceIds, areIds ];
		executeOnLoad(listOnLoadId);
	}

	function populateRegion(pathPrepender, tagAddressId, implementation_Type) {

		var countryId = $("#text_" + tagAddressId).val();
		var tabCount = address_withoutMapScriptInput.tabCount;
		var addressId = address_withoutMapScriptInput.addressId;
		var source = address_withoutMapScriptInput.source;
		var itagAddressId = tagAddressId;
		var additionalParameter = address_withoutMapScriptInput.additionalParameter;
		var residenceEnabled = address_withoutMapScriptInput.residenceEnabled;
		var addressAjaxUrl = "";
		var decorateSelectTag = address_withoutMapScriptInput.decorateSelectTag;
		var disableISDCode = address_withoutMapScriptInput.disableISDCode;
		var mandatoryAttr = address_withoutMapScriptInput.mandatoryAttr;
		var addressType = $('#'+address_withoutMapScriptInput.relatedAddressTypeId+' option:selected').val();
		var addressTypeValue=$("#"+address_withoutMapScriptInput.relatedAddressTypeId).val();
		var addressTypeHidden=$("#"+address_withoutMapScriptInput.relatedAddressTypeId).prop('type');
		var addressTypePresent=true;
		if(addressTypeValue== undefined || addressTypeHidden=='hidden'){
		    addressTypePresent=false;
		}
		var filterCode = address_withoutMapScriptInput.filterCode;
		var modificationAllowed = address_withoutMapScriptInput.modificationAllowed;
		var viewModeMask=address_withoutMapScriptInput.viewMode;
		/*
		 * check if implementation type is 'true' , then load address related
		 * fields on the basis of pincode
		 */
		if (source != null && source != "" && source != false
				&& source != "false" && (source == true || source == "true")
				&& additionalParameter != "") {
			addressAjaxUrl = additionalParameter;
		} else {
			addressAjaxUrl = getContextPath() + "/app/"
					+ address_withoutMapScriptInput.requestPathValue
					+ "/pincodeBased/paintRestFields";
		}
		if (implementation_Type == "true") {
			$.ajax({

				// Also, same URL will be used to render country specific fields
				// on the UI
				url : addressAjaxUrl,
				data : ({
					relativePath : pathPrepender,
					countryId : countryId,
					addressType : addressType,
					addressTypePresent : addressTypePresent,
					filterCode : filterCode,
					addressId : addressId,
					htmlAddressId : itagAddressId,
					tabCount : tabCount,
					mandatoryAttr : mandatoryAttr,
					implementation_Type : implementation_Type,
					residenceEnabled : residenceEnabled,
					source : source,
					additionalParameter : additionalParameter,
					decorateSelectTag : decorateSelectTag,
					disableISDCode : disableISDCode,
					modificationAllowed : modificationAllowed,
					"addressWithMap" : "false",
					viewModeMask : viewModeMask
				}),
				type : 'POST',
				async : false,
				success : function(jqXHR) {
					$('#remainingFields_' + itagAddressId).html(jqXHR);
					populateResidenceFields(address_withoutMapScriptInput);
					applyFuncOnLoadAddTag();
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});
		} else {
			$.ajax({
				// This AJAX request is returning back the Region List
				// associated with the selected country in the drop down
				// Also, same URL will be used to render country specific fields
				// on the UI
				url : getContextPath() + "/app/"
						+ address_withoutMapScriptInput.requestPathValue
						+ "/paintRestFields",
				data : ({
					relativePath : pathPrepender,
					countryId : countryId,
					addressType : addressType,
					addressTypePresent : addressTypePresent,
					filterCode : filterCode,
					addressId : addressId,
					htmlAddressId : itagAddressId,
					tabCount : tabCount,
					mandatoryAttr : mandatoryAttr,
					source : source,
					additionalParameter : additionalParameter,
					residenceEnabled : residenceEnabled,
					decorateSelectTag : decorateSelectTag,
					disableISDCode : decorateSelectTag,
					modificationAllowed : modificationAllowed,
					"addressWithMap" : "false",
					viewModeMask : viewModeMask
				}),
				type : 'POST',
				async : false,
				success : function(jqXHR) {
					$('#remainingFields_' + itagAddressId).html(jqXHR);
					populateResidenceFields(address_withoutMapScriptInput);
					applyFuncOnLoadAddTag();
				}
			});
		}
	}

	function populateDefaultCountry() {
		var profileName = address_withoutMapScriptInput.profileName;
		var selectedCountryId = $("#text_" + address_withoutMapScriptInput.id)
				.val();
		var defaultCountryId = address_withoutMapScriptInput.defaultCountryId;

		if (selectedCountryId != "") {
			return;
		}

		$("#text_" + address_withoutMapScriptInput.id + ' option').each(
				function() {
					var currentOption = $(this).attr("data-code");
					if (profileName == "dcb") {
						/* auto populate INDIA as country by default */
						if (currentOption == "IND") {
							$(this).attr("selected", "selected");
							return false;
						}
					} else {
						/* auto populate the very first country by default */
						if (currentOption == defaultCountryId) {
							$(this).attr("selected", "selected");
							return false;
						}
					}
				});
	}

	$(function() {
		if ($("#text_" + address_withoutMapScriptInput.id).hasClass(
				'readonly_true')) {
			$('select[class=readonly_true]').css("background-color", "#EEEEEE")
					.css("cursor", "not-allowed").bind("focus", function() {
						$(this).blur();
					});

		}

	});

	$("#text_" + address_withoutMapScriptInput.id).change(
			function() {
				populateRegion(address_withoutMapScriptInput.completePath,
						address_withoutMapScriptInput.id,
						address_withoutMapScriptInput.implementationType)
			});

}
function populateResidenceFields(address_withoutMapScriptInput) {
	var residenceEnabled = address_withoutMapScriptInput.residenceEnabled;
	var addType = $('#'+address_withoutMapScriptInput.relatedAddressTypeId+' option:selected').attr('data-code');

	if (residenceEnabled == 'true' && addType) {
		if (addType == 'OfficeAddress') {

			$('#accomodationType_mainDiv').hide();
			$('#residenceType_mainDiv').hide();
			$("#residenceType_" + address_withoutMapScriptInput.htmlAddressId)
					.attr("disabled", "disabled");
			$(
					"#accomodationType_"
							+ address_withoutMapScriptInput.htmlAddressId)
					.attr("disabled", "disabled");
			$(
					"#otherResidenceType_"
							+ address_withoutMapScriptInput.htmlAddressId)
					.hide();
			$('#othersDiv').hide();
		} else {

			$('#accomodationType_mainDiv').show();
			$('#residenceType_mainDiv').show();
			$("#residenceType_" + address_withoutMapScriptInput.htmlAddressId)
					.removeAttr('disabled');
			$(
					"#accomodationType_"
							+ address_withoutMapScriptInput.htmlAddressId)
					.removeAttr('disabled');
			if ($(
					"#residenceType_"
							+ address_withoutMapScriptInput.htmlAddressId)
					.find('option:selected').text() == 'Others') {
				$(
						"#otherResidenceType_"
								+ address_withoutMapScriptInput.htmlAddressId)
						.show();
				$('#othersDiv').show();
			} else {
				$(
						"#otherResidenceType_"
								+ address_withoutMapScriptInput.htmlAddressId)
						.hide();
				$('#othersDiv').hide();
			}
		}

	} else {

		$('#accomodationType_mainDiv').hide();
		$('#residenceType_mainDiv').hide();
		$("#residenceType_" + address_withoutMapScriptInput.htmlAddressId)
				.attr("disabled", "disabled");
		$("#accomodationType_" + address_withoutMapScriptInput.htmlAddressId)
				.attr("disabled", "disabled");
		$("#otherResidenceType_" + address_withoutMapScriptInput.htmlAddressId)
				.hide();
		$('#othersDiv').hide();
	}
}
