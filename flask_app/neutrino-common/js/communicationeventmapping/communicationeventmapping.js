$(document).ready(
		function() {
			var activeFlagVal = jQuery("#activeFlagVal").val();
			var view_mode = jQuery('#viewMode').val();
			var edit_mode = jQuery('#editMode').val();
			if (edit_mode == 'true' || view_mode == 'true') {
				var ruleCriteriaFlag = $('#ruleCriteriaFlag').val();
				var queryCriteriaFlag = $('#queryCriteriaFlag').val();
				if (ruleCriteriaFlag == 'false') {
					$('[id^="ruleCriteria_"]').hide();
				}
				if (queryCriteriaFlag == 'false') {
					$('[id^="queryCriteria_"]').hide();
				}
				/*
				 * Removing Immediate option from Communication Category for
				 * QUERY_CRITERIA.
				 */
				commCategoryImmediateOptionDisable($('#criteriaType').val());
			}

			getGlobalActiveFlag(activeFlagVal, view_mode, edit_mode);

			$('#baseSelectClause').text($('#queryBaseSelectClause').val());

			if ($('#editMode').val() == "" && $('#viewMode').val() == "") {
				enableDisableAutocomplete('#Text_eventCodeId', true);
			}

			if ($('#viewMode').val() == 'true') {
				jQuery("#customSelectionCriteria").attr("disabled", true);
			} else {
				jQuery("#customSelectionCriteria").attr("disabled", false);
			}

			SQL_SELECT_QUERY_KEYWORDS = SQL_SELECT_QUERY_KEYWORDS.split(',');
			SQL_SELECT_QUERY_KEYWORDS_MASK = SQL_SELECT_QUERY_KEYWORDS_MASK
					.split(',');

			$('#sourceProductId').on('change', function() {
				sourceProductChangeHandler(this);
			});

			$('#eventCodeId').on('eventCodeChange', function() {
				var eventVal = $('#Text_eventCodeId').val();
				if (eventVal != "" && eventVal != undefined) {
					checkDuplicateCommunicationEventMapping();
				}
			});

			$(document).on('change', '#Text_eventCodeId', function() {
				eventCodeChangeHandler();
			});

			$('#communicationCategory').on('change', function() {
				communicationCategoryChangeHandler(this);
			});

			$(document).on('communicationCodeChange',
					'input[id^=communicationCodeId]', function() {
						communicationCodeSelectionHandler(this);
					});

			$(document).on(
					'change',
					'input[id^=Text_communicationCodeId]',
					function() {
						var communicationCode = $(this).val();
						if (communicationCode == ""
								|| communicationCode == undefined) {
							communicationCodeChangeHandler(this);
						}
					});

			$(document).on('change', 'input[id^=priority]', function() {
				templatePriorityChangeHandler(this);
			});

			$.validator.addMethod("digitsExceptZero", function(value, element) {
				return /^[1-9]\d*$/.test(value);
			}, 'Only digits except 0 are allowed');
		});

function communicationCategoryChangeHandler(element) {
	var commCategory = $(element).find('option:selected').text();
	var eventCodeId = $('#eventCodeId').val();
	var sourceProductId = $('#sourceProductId').val();
	setCriteriaFlags(eventCodeId, commCategory, sourceProductId);
	$('[id^="ruleCriteria_"]').show();
	$('[id^="queryCriteria_"]').show();
	// resetCommTemplateMapAccordion();
	if ($('#queryCriteriaFlag').val() == 'false') {
		$('[id^="queryCriteria_"]').hide();
	}
	if ($('#ruleCriteriaFlag').val() == 'false') {
		$('[id^="ruleCriteria_"]').hide();
	}
}

function setCriteriaFlags(eventCodeId, commCategory, sourceProductId) {
	$
			.ajax({
				url : getContextPath()
						+ "/app/CommunicationEventMappingHeader/selectQueryOrRuleCriteriaType",
				async : false,
				type : "GET",
				data : {
					"eventCodeId" : eventCodeId,
					"communicationCategory" : commCategory,
					"sourceProductId" : sourceProductId
				},
				success : function(data) {
					if (data.queryCriteriaFlag != undefined && data.ruleCriteriaFlag != undefined) {
						$('#queryCriteriaFlag').val(data.queryCriteriaFlag);
						$('#ruleCriteriaFlag').val(data.ruleCriteriaFlag);
					}
				}
			});
}

function templatePriorityChangeHandler(element) {
	var priorityArray = [];

	var array = element.getAttribute("id").split('_');
	var accordionIndex = array[array.length - 1];
	$('#templateMappingClass_' + accordionIndex).find('tr').each(
			function() {

				var rowPriority = parseInt($(this).find(
						'input[id^="priority_"]').val());

				if (rowPriority != undefined && rowPriority != NaN
						&& rowPriority != '0'
						&& priorityArray.indexOf(rowPriority) != -1) {
					displayErrorMessage("Template Priority should be unique");
					$(element).val('');
				} else if (rowPriority == "" || rowPriority == '0'
						|| rowPriority == NaN) {
					displayErrorMessage("Template Priority is mandatory");
					$(element).val('');
				} else {
					priorityArray.push(rowPriority);
				}
			});

}

function sourceProductChangeHandler(element) {
	var sourceProductId = $(element).val();
	$('#eventCodeId').val('');
	$('#Text_eventCodeId').val('').trigger('change');
	enableDisableAutocomplete('#Text_eventCodeId', true);
	if (sourceProductId != '' && sourceProductId != undefined) {
		$('#Text_communicationCodeId_0').attr(
				'data-custom-controller',
				'/CommunicationEventMappingHeader/populateCommunicationCodeAutoComplete/'
						+ sourceProductId);
		$('#Text_eventCodeId').attr(
				'data-custom-controller',
				'/CommunicationEventMappingHeader/populateEventCodeAutoComplete/'
						+ sourceProductId);
		enableDisableAutocomplete('#Text_communicationCodeId_0', false);
		enableDisableAutocomplete('#Text_eventCodeId', false);
		getQueryBaseSelectClause(sourceProductId);
	} else {
		$('#queryBaseSelectClause').val('');
		$('#baseSelectClause').text('');
	}
}

function enableDisableAutocomplete(id, disableFlag) {
	$(id).attr('disabled', disableFlag);
	$(id).attr('readOnly', disableFlag);
}
function eventCodeChangeHandler() {
	$('#communicationCategory').find("option:contains('Immediate')").attr(
			'disabled', false);
	$('#communicationCategory').val('').trigger('chosen:update');
	resetCommTemplateMapAccordion();
}

function resetCommTemplateMapAccordion() {
	var accordionCurrIndex = parseInt($('#comm_event_temp_map_accordion_size')
			.val()) - 1;
	for (var j = 0; j <= accordionCurrIndex; j++) {
		if (j == 0) {
			$('#Text_communicationCodeId_' + j).val('').trigger('change');
		} else {
			deleteCommTemplateMapAccordion(j);
		}
	}
}

function communicationCodeChangeHandler(element) {
	var array = element.getAttribute("id").split('_');
	var accordionIndex = array[array.length - 1];

	// Template Mapping Grid Current Index
	var gridCurrIndex = parseInt($('#template_grid_size_' + accordionIndex)
			.val()) - 1;

	$('#communicationType_' + accordionIndex).val('');
	$('#delivery_priority_' + accordionIndex).val('1');
	// ID appender for all the records in
	// the Template Mapping Grid

	for (var j = 0; j <= gridCurrIndex; j++) {
		if (j == 0) {
			var currTemplateRecordId = j + "_commEventMap_" + accordionIndex;
			removeAutoCompleteErrorValidations("communicationTemplateId_"
					+ currTemplateRecordId);
			removeAutoCompleteErrorValidations("rule_" + currTemplateRecordId);
			removeAutoCompleteErrorValidations("attachmentTemplateIds_"
					+ currTemplateRecordId);
			removeErrorValidation("priority_" + currTemplateRecordId);
			$("#priority_" + currTemplateRecordId).val('1');
			$('#criteria_' + currTemplateRecordId).val('');
			$('#criteriaEncoded_' + currTemplateRecordId).val('');
			$('#attachmentTemplateIds_' + currTemplateRecordId).val('');
			$("#attachmentTemplateIds_" + currTemplateRecordId).trigger(
					"chosen:updated");
			$('#templateMappingTable_' + accordionIndex).hide();
		} else {
			deleteTemplateGrid(j, accordionIndex);
		}
	}
}

function communicationCodeSelectionHandler(element) {
	var array = element.getAttribute("id").split('_');
	var accordionIndex = array[array.length - 1];

	// Template Mapping Grid Current Index
	var gridCurrIndex = parseInt($('#template_grid_size_' + accordionIndex)
			.val()) - 1;

	// ID appender for all the records in
	// the Template Mapping Grid
	var currTemplateRecordId = gridCurrIndex + "_commEventMap_"
			+ accordionIndex;

	var communicationCodeId = $(element).val();
	var communicationCodeVal = $('#Text_communicationCodeId_' + accordionIndex)
			.val();
	var isDuplicate = checkForCommunicationCodeDuplicates(communicationCodeId,
			accordionIndex);
	if (isDuplicate == false || isDuplicate == "false") {
		communicationCodeChangeHandler(element);
		if (communicationCodeVal != "" && communicationCodeVal != undefined) {
			$
					.ajax({
						url : getContextPath()
								+ "/app/CommunicationEventMappingHeader/getCommunicationType",
						async : false,
						type : "POST",
						data : {
							"communicationCodeId" : communicationCodeId
						},
						success : function(data) {
							communicationCodeSelectionSuccessHandler(data,
									accordionIndex);
						}
					});

			$('#Text_communicationTemplateId_' + currTemplateRecordId).attr(
					'data-custom-controller',
					'/CommunicationEventMappingHeader/populateCommunicationTemplate/'
							+ communicationCodeId);
			enableDisableAutocomplete('#Text_communicationTemplateId_'
					+ currTemplateRecordId, false);
			enableDisableAutocomplete('#Text_rule_' + currTemplateRecordId,
					false);
			if ($('#queryCriteriaFlag').val()
					&& $('#queryCriteriaFlag').val() == 'false') {
				$('[id^="queryCriteria_"]').hide();
			}

			if ($('#ruleCriteriaFlag').val()
					&& $('#ruleCriteriaFlag').val() == 'false') {
				$('[id^="ruleCriteria_"]').hide();
			}

		} else {
			$('#communicationCodeId_' + accordionIndex).val('');
		}
	}
}

function checkForCommunicationCodeDuplicates(communicationCodeId,
		accordionIndex) {
	var communicationCodeArray = [];
	var isDuplicate = false;
	if ($('div[id^="communicationAccordian_"]').length > 1) {
		$('div[id^="communicationAccordian_"]')
				.each(
						function() {
							var communicationCodeId = parseInt($(this).find(
									'input[id^="communicationCodeId_"]').val());
							if (communicationCodeId
									&& communicationCodeArray
											.indexOf(communicationCodeId) != -1) {

								displayErrorMessage(label.DuplicateCommunicationCodesCannotBeMaintained);
								isDuplicate = true;
								$('#communicationCodeId_' + accordionIndex)
										.val('');
								$('#Text_communicationCodeId_' + accordionIndex)
										.val('');
							} else if (communicationCodeId) {
								communicationCodeArray
										.push(communicationCodeId);
							}
						});
	}
	return isDuplicate;
}

function communicationCodeSelectionSuccessHandler(data, accordionIndex) {
	$('#communicationType_' + accordionIndex).val(data.communicationTypeName);
	$('#templateMappingTable_' + accordionIndex).show();
	$('#isEmail_' + accordionIndex).val(data.isEmail);
	var isEmailFlag = $('#isEmail_' + accordionIndex).val();
	if (isEmailFlag == "true" || isEmailFlag == true) {
		$(
				'#templateMappingTable_' + accordionIndex
						+ ' th[id^="colAttachments"]').show();
		$(
				'#templateMappingTable_' + accordionIndex
						+ ' td[id^="colAttachments_"]').show();
	} else {
		$(
				'#templateMappingTable_' + accordionIndex
						+ ' th[id^="colAttachments"]').hide();
		$(
				'#templateMappingTable_' + accordionIndex
						+ ' td[id^="colAttachments_"]').hide();
	}

}

function removeErrorValidation(id) {
	jQuery("#" + id + "-control-group").removeClass("clearfix");
	jQuery("#" + id + "-control-group").removeClass('error');
	jQuery("#" + id + "-control-group").removeClass("outset-shadow-focus");
	$('#' + id).find('span.help-block').remove();
	$('#' + id + '-error').remove();
}

function removeAutoCompleteErrorValidations(id) {
	$('#content_' + id).removeClass('outset-shadow-focus');
	$('#content_' + id).removeClass('error');
	$('#content_' + id).removeClass('success');
	$('#content_' + id).removeClass('clearfix');
	$("#content_" + id).find(".help-block").hide();
	$("#content_").find("span").removeClass("help-block");
	$('#Text_' + id).val('');
	$('#' + id).val('');
}

function addTemplateMappingRecord(commTemplateMapAccordIndex) {
	if (validateTemplateMapRowForCurrIndex(commTemplateMapAccordIndex)) {
		var templateGridSize = $(
				'#template_grid_size_' + commTemplateMapAccordIndex).val();
		var nextRowIndex = templateGridSize;
		$
				.ajax({
					url : getContextPath()
							+ "/app/CommunicationEventMappingHeader/addRow",
					async : false,
					data : ({
						"endSize" : nextRowIndex,
						"commTemplateMapIndex" : commTemplateMapAccordIndex,
						"communicationCodeId" : $(
								'#communicationCodeId_'
										+ commTemplateMapAccordIndex).val()
					}),
					success : function(jqXHR) {
						$("#templateMappingClass_" + commTemplateMapAccordIndex)
								.append(jqXHR);
						$(
								'#template_grid_current_index_'
										+ commTemplateMapAccordIndex).val(
								nextRowIndex);
						$('#template_grid_size_' + commTemplateMapAccordIndex)
								.val(parseInt(templateGridSize) + 1);

						if ($('#isEmail_' + commTemplateMapAccordIndex).val() == "false"
								|| $('#isEmail_' + commTemplateMapAccordIndex)
										.val() == false) {
							$(
									'#templateMappingClass_'
											+ commTemplateMapAccordIndex
											+ ' td[id^="colAttachments_"]')
									.hide();
						}

						if ($('#ruleCriteriaFlag').val()
								&& $('#ruleCriteriaFlag').val() == 'false') {
							$('[id^="ruleCriteria_"]').hide();
						}
						if ($('#queryCriteriaFlag').val()
								&& $('#queryCriteriaFlag').val() == 'false') {
							$('[id^="queryCriteria_"]').hide();
						}
					}
				});
	}
}

function addCommEventTemplateMapAccordion() {
	var commTemplateMapAccordIndex = $('#comm_event_temp_map_accordion_index')
			.val();

	var communicationCodeId = $(
			'#communicationCodeId_' + commTemplateMapAccordIndex).val();
	var deliveryPriority = $('#delivery_priority_' + commTemplateMapAccordIndex)
			.val();

	if (communicationCodeId && deliveryPriority) {
		if (validateTemplateMapRowForCurrIndex(commTemplateMapAccordIndex)) {
			var nextRowIndex = parseInt(commTemplateMapAccordIndex) + 1;
			$
					.ajax({
						url : getContextPath()
								+ "/app/CommunicationEventMappingHeader/addCommEventMappingRow",
						async : false,
						data : ({
							"endSize" : nextRowIndex,
							"sourceProductId" : $('#sourceProductId').val()
						}),
						success : function(jqXHR) {
							$("#commEventMapAccordions").append(jqXHR);
							$('#comm_event_temp_map_accordion_index').val(
									nextRowIndex);
							$('#comm_event_temp_map_accordion_size')
									.val(
											parseInt($(
													'#comm_event_temp_map_accordion_size')
													.val()) + 1);
							$('html,body').animate(
									{
										scrollTop : $(
												"#commTemplateMapId_"
														+ nextRowIndex)
												.offset().top
									}, 'fast');
						}

					});
		}
	} else {
		displayErrorMessage(label.mandatoryDetailsForCommEventMapping);
	}

}

function validateTemplateMapRowForCurrIndex(accordionIndex) {
	var templateGridSize = $('#template_grid_size_' + accordionIndex).val();
	var gridCurrIndex = parseInt(templateGridSize) - 1;

	// ID appender for all the records in the Template Mapping Grid
	var currTemplateRecordId = gridCurrIndex + "_commEventMap_"
			+ accordionIndex;

	var templateId = $('#Text_communicationTemplateId_' + currTemplateRecordId)
			.val();
	var ruleId = $('#Text_rule_' + currTemplateRecordId).val();
	var criteria = $('#criteria_' + currTemplateRecordId).val();
	var priority = $('#priority_' + currTemplateRecordId).val();
	if (!templateId || !priority) {
		displayErrorMessage(label.mandatoryDetailsForTemplateMapping);
		return false;
	}
	if ($('#queryCriteriaFlag').val()
			&& $('#queryCriteriaFlag').val() == 'true' && !criteria) {
		displayErrorMessage(label.mandatoryDetailsForCriteria);
		return false;
	}
	if ($('#ruleCriteriaFlag').val() && $('#ruleCriteriaFlag').val() == 'true'
			&& !ruleId) {
		displayErrorMessage(label.mandatoryDetailsForRule);
		return false;
	}
	return true;

}

function displayErrorMessage(msgKey) {
	new PNotify({
		title : 'Error',
		text : msgKey,
		type : 'error',
		pnotify_animate_speed : .5,
		opacity : 1
	});
}

function deleteCommTemplateMapAccordion(rowIndex) {
	$('#communicationAccordian_' + rowIndex).remove();

	var currentIndexVal = $('#comm_event_temp_map_accordion_index').val();
	$('#comm_event_temp_map_accordion_index')
			.val(parseInt(currentIndexVal) - 1);
	var templateGridSize = $('#comm_event_temp_map_accordion_size').val();
	$('#comm_event_temp_map_accordion_size')
			.val(parseInt(templateGridSize) - 1);
}

function deleteTemplateGrid(gridIndex, accordionIndex) {
	$('#templateMappingList_' + gridIndex + '_commEventMap_' + accordionIndex)
			.remove();

	var currentIndexVal = $('#template_grid_current_index_' + accordionIndex)
			.val();
	$('#template_grid_current_index_' + accordionIndex).val(
			parseInt(currentIndexVal) - 1);

	var templateGridSize = $('#template_grid_size_' + accordionIndex).val();
	$('#template_grid_size_' + accordionIndex).val(
			parseInt(templateGridSize) - 1);

}

function saveForm() {
	var masterID = document.getElementById("masterID").value;
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	disableFields();
	var commTemplateMapAccordIndex = $('#comm_event_temp_map_accordion_index')
			.val();
	if ($("#masterForm").valid() && checkDuplicateCommunicationEventMapping()
			&& validateTemplateMapRowForCurrIndex(commTemplateMapAccordIndex)) {
		$('td.queryCriteria input[id^="criteria_"]').each(function() {
			$(this).removeAttr('name');
		})
		document.getElementById("masterForm").action = getContextPath()
				+ "/app/" + masterID + "/save";
		var formTemp = $("#masterForm");
		$("#createAnotherMaster").val(isChecked);
		formTemp.submit();
	}
}

function saveAndSendForApproval() {
	var masterID = document.getElementById("masterID").value;
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	disableFields();
	var commTemplateMapAccordIndex = $('#comm_event_temp_map_accordion_index')
			.val();
	if ($("#masterForm").valid() && checkDuplicateCommunicationEventMapping()
			&& validateTemplateMapRowForCurrIndex(commTemplateMapAccordIndex)) {
		$('td.queryCriteria input[id^="criteria_"]').each(function() {
			$(this).removeAttr('name');
		})
		document.getElementById("masterForm").action = getContextPath()
				+ "/app/" + masterID + "/saveAndSendForApproval";
		var formTemp = $("#masterForm");
		$("#createAnotherMaster").val(isChecked);
		formTemp.submit();
	}
}

function disableFields() {
	enableDisableAutocomplete('#communicationType', false);
	enableDisableAutocomplete('#Text_communicationCodeId', false);
	enableDisableAutocomplete('#Text_eventCodeId', false);
	$('#sourceProductId').prop("disabled", false);
	$('#sourceProductId_chosen').removeClass("chosen-disabled");
}

function checkDuplicateCommunicationEventMapping() {
	var sourceProductId = $('#sourceProductId').val();
	var eventCodeId = $('#eventCodeId').val();
	var flag = true;

	if (sourceProductId && eventCodeId) {
		$
				.ajax({
					url : getContextPath()
							+ "/app/CommunicationEventMappingHeader/validateIfCommunicationEventMappingExists",
					async : false,
					type : "POST",
					dataType : "json",
					data : $('#masterForm').serialize(),
					success : function(data) {
						if (data.error != null) {
							$('#eventCodeId').val('');
							$('#Text_eventCodeId').val('');
							var ajaxHtml = "";
							jQuery.each(data.error, function(i, value) {
								if (ValidatorUtils.isNotEmpty(value.isParent)
										&& value.isParent) {
									ajaxHtml += value.value;
								} else {
									ajaxHtml += "<li>" + value.value + "</li>";
								}
							});

							displayErrorMessage(ajaxHtml);
							flag = false;
							$('#communicationCategory').find(
									"option:contains('Immediate')").attr(
									'disabled', false);
							$('#communicationCategory').trigger(
									'chosen:updated');
						} else {
							$('#criteriaType').val(data.criteriaType);
							/*
							 * Removing Immediate option from Communication
							 * Category for QUERY_CRITERIA.
							 */
							commCategoryImmediateOptionDisable(data.criteriaType);
							flag = true;
						}
					}
				})
	}

	return flag;
}

function commCategoryImmediateOptionDisable(criteriaType) {

	if (criteriaType == "QUERY_CRITERIA") {
		$('#communicationCategory').find("option:contains('Immediate')").attr(
				'disabled', true);
	} else {
		$('#communicationCategory').find("option:contains('Immediate')").attr(
				'disabled', false);
	}
	$('#communicationCategory').trigger('chosen:updated');
}

function openRuleSelectionModal(obj, gridIndex, accordionIndex, viewable, edit) {
	$('#customSelectionCriteria').val(
			$('#criteria_' + gridIndex + '_commEventMap_' + accordionIndex)
					.val());
	$('#criteria_index').val(gridIndex + '_commEventMap_' + accordionIndex);
	$('#ruleSelectionModal').modal('show');
}

function closeRuleSelectionModal() {
	$('#customSelectionCriteria').val('');
	$('.sqlErrorMessage').find('span').text('');
	$('.sqlErrorMessage').hide();
	$('div#finalSqlQuery').hide();
	$('#ruleSelectionModal').modal('hide');
	removeErrorValidation("customSelectionCriteria");
}

function saveRuleSelection() {
	if ($("#criteriaForm").valid() && validateSqlQuery()) {
		var indexId = $('#criteria_index').val();
		$('#criteria_' + indexId).val($('#customSelectionCriteria').val());
		$('#criteriaEncoded_' + indexId).val(
				encodeSqlCriteria($('#customSelectionCriteria').val()));
		closeRuleSelectionModal();
	}
}

function clearSqlQuery() {
	$('#customSelectionCriteria').val('');
	$('.sqlErrorMessage').find('span').text('');
	$('.sqlErrorMessage').hide();
	removeErrorValidation("customSelectionCriteria");
	$('div#finalSqlQuery').hide();
}

function validateSqlQuery() {
	var queryValidated = false;

	var customSelectionCriteria = $('#customSelectionCriteria').val();
	var customSelectionCriteriaEncoded = encodeSqlCriteria(customSelectionCriteria);
	var sqlQuery = $('#queryBaseSelectClause').val() + " "
			+ customSelectionCriteriaEncoded;

	$.ajax({
		url : getContextPath() + "/app/basicRule/validateSQLQuery",
		data : {
			"sqlQuery" : sqlQuery
		},
		async : false,
		type : "GET",
		success : function(response) {
			if (response != "") {
				queryValidated = false;
				$('.sqlErrorMessage').find('span').text(response);
				$('.sqlErrorMessage').show();
				$('div#finalSqlQuery').hide();
			} else {
				$('.sqlErrorMessage').find('span').text('');
				$('.sqlErrorMessage').hide();
				queryValidated = true;
			}
		},
		error : function() {
			queryValidated = false;

		}
	});
	if (queryValidated) {
		$('div#finalSqlQuery')
				.find('span')
				.find('b')
				.text(
						getMessage('msg.success.sqlQueryRule.queryValidatedSuccessfully'));
		$('div#finalSqlQuery').removeClass('hide');
		$('div#finalSqlQuery').show();
	}
	return queryValidated;

}

function getGlobalActiveFlag(activeFlagVal, viewMode, editMode) {

	if (viewMode == "" && editMode == "" && activeFlagVal == "") {
		jQuery("#activeFlag").addClass(" btn-primary active");
		jQuery("#activeStatusHidden").prop("checked", false);

	} else if (viewMode == 'true') {
		jQuery("#activeFlag").attr("disabled", true);
		jQuery("#inActiveFlag").attr("disabled", true);
		if (activeFlagVal == 'true') {
			jQuery("#activeFlag").addClass(" btn-primary active");
			jQuery("#activeStatusHidden").prop("checked", true);
		} else {
			jQuery("#inActiveFlag").addClass(" btn-primary active");
			jQuery("#activeStatusHidden").prop("checked", false);
		}
	} else if (editMode == 'true') {
		jQuery("#activeFlag").attr("disabled", false);
		jQuery("#inActiveFlag").attr("disabled", false);

		if (activeFlagVal == 'true') {
			jQuery("#activeFlag").addClass(" btn-primary active");
			jQuery("#activeStatusHidden").prop("checked", true);
		} else {
			jQuery("#inActiveFlag").addClass(" btn-primary active");
			jQuery("#activeStatusHidden").prop("checked", false);
		}

	} else {
		jQuery("#activeFlag").attr("disabled", false);
		jQuery("#inActiveFlag").attr("disabled", false);
		jQuery("#activeFlag").addClass(" btn-primary active");
		jQuery("#activeStatusHidden").prop("checked", true);
	}
}

function getQueryBaseSelectClause(sourceProductId) {
	$
			.ajax({
				url : getContextPath()
						+ "/app/CommunicationEventMappingHeader/getQueryBaseSelectClause",
				async : false,
				type : "POST",
				data : {
					"sourceProductId" : sourceProductId
				},
				success : function(data) {
					$('#queryBaseSelectClause').val(data);
					$('#baseSelectClause').text(data);
				}
			});
}

function encodeSqlCriteria(queryString) {
	var upperCaseQueryString = queryString.toUpperCase();
	if (queryString != null && queryString != '') {
		for (var i = 0; i < SQL_SELECT_QUERY_KEYWORDS.length; ++i) {
			var keywordLength = SQL_SELECT_QUERY_KEYWORDS[i].length;
			while (upperCaseQueryString.indexOf(SQL_SELECT_QUERY_KEYWORDS[i]) != -1) {
				var indexOfQueryKeyword = upperCaseQueryString
						.indexOf(SQL_SELECT_QUERY_KEYWORDS[i]);
				upperCaseQueryString = upperCaseQueryString.replace(
						SQL_SELECT_QUERY_KEYWORDS[i],
						SQL_SELECT_QUERY_KEYWORDS_MASK[i]);
				queryString = queryString.replace(queryString.substring(
						indexOfQueryKeyword, indexOfQueryKeyword
								+ keywordLength),
						SQL_SELECT_QUERY_KEYWORDS_MASK[i]);
			}
		}
	}
	return queryString;
}