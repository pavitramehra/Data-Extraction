$(document).ready(function(){
	$('#paramValue2').removeClass('required');
	$('#queryBuilderPanel').removeAttr('hidden');
	$('#betweenPanel').attr('hidden', true);
	$('#Text_businessEntity, #Text_attributes, #operator, #paramValue, #paramValue1, #paramValue2, #dateParamVal, #dateParamVal1, #dateParamVal2').removeClass('required');
	$("#hidden_fields").hide();
	$('#dataType, #htmlBackup, #sqlBackup, #queryInJsonBackup, #paramLength, #decimalPartLength, #ruleBasedOnBackup, #ruleCodeBackup, #ruleDescBackup').attr('disabled', true);

	$('#criteriaCode').on('updateSqlCriteriaFields',function(){
		updateSqlCriteriaFields(this,true,true,false);
	});
	$('#criteriaCodeVisible').on('updateSqlCriteriaFieldsVisible',function(){
		updateSqlCriteriaFields(this,false,false,false);
		
	});
	$('#criteriaCode').on('updateSqlCriteriaFieldsEditMode',function(){
		updateSqlCriteriaFields(this,false,false,true);
	});
	
	$('#useQueryBuilder').on('change', function(){
		if($('#useQueryBuilder:checked').length > 0){
			definitionHideConfirmation();
		}else{
			showQueryBuilder();
		}
	})

	$('#criteriaCode').on('change', function(){
		$('#criteriaCode').val($('#criteriaCode').val().trim().toUpperCase());
	})

	$(".andBtn, .orBtn").on('click', function(){
		var beforeElement = $("#formulaEditor div.lastSelected").prev("div.formulaElement:first");
		if(beforeElement.length === 0 || beforeElement.hasClass("openbrc") || beforeElement.hasClass("condition")){
			showError(getMessage('msg.queryBuilder.invalidCondition'));
			return false;
		}
		var conditionText = ($(this).val() == 'AND') ? andText : orText;
		createElement("condition", '', '', $(this).val(), '', '', '', '', '', '', '', conditionText,'<b>'+conditionText+'</b>');
	})

	$("#openBracketBtn").on('click', function(){
		var beforeElement = $("#formulaEditor div.lastSelected").prev("div.formulaElement:first");
		if(beforeElement.hasClass("closebrc") || beforeElement.hasClass("clausePart")){
			showError(getMessage('msg.queryBuilder.invalidParenthesis'));
			return false;
		}
		createElement("openbrc", $(this).val(), '', '', '', '', '', '', '', '', '', $(this).val(), $(this).val());
	})

	$("#closeBracketBtn").on('click', function(){
		var beforeElement = $("#formulaEditor div.lastSelected").prev("div.formulaElement:first");
		if(beforeElement.length === 0 || beforeElement.hasClass("openbrc") || beforeElement.hasClass("condition")){
			showError(getMessage('msg.queryBuilder.invalidParenthesis'));
			return false;
		}
		createElement("closebrc", '', $(this).val(), '', '', '', '', '', '', '', '', $(this).val(), $(this).val());
	})

	$('#add_Btn').on('click', function(){
		var validated = false;
		$('#Text_businessEntity, #Text_attributes, #operator, #paramValue, #paramValue1, #paramValue2, #dateParamVal, #dateParamVal1, #dateParamVal2').addClass('required');
		if(validAddPart()){
			var beforeElement = $("#formulaEditor div.lastSelected").prev("div.formulaElement:first");
			if(beforeElement.hasClass("closebrc") || beforeElement.hasClass("clausePart")){
				showError(getMessage('msg.queryBuilder.conditionNotSelected'));
			}else{
				addToJsonArray();
				validated = true;
			}
		}
		$('#Text_businessEntity, #Text_attributes, #operator, #paramValue, #paramValue1, #paramValue2, #dateParamVal, #dateParamVal1, #dateParamVal2').removeClass('required');
		return validated;
	})

	$('#clear_Btn').on('click', function(){
		clearRuleDefinition();
	})

	$('#clsEditor_Btn').on('click', function(){
		$('#customSelectionCriteria').val('');
		$('#criteriaCode').val('');
		$('#Text_criteriaCode').val('');
		$('#criteriaCode').trigger('chosen:updated');
		$('#criteriaDescription').val('');
		$('.sqlErrorMessage').find('span').text('');
		$('.sqlErrorMessage').hide();
		$('div#finalSqlQuery').find('span').find('b').text('');
		$('div#finalSqlQuery').hide();
	})

	$('#generate_Btn').on('click', function(){
		var jsonObj = validateExprAndCreateJson();
		if(jsonObj === null){
			return false;
		}
		sendReqToGetQuery(jsonObj);
	});

	$('#businessEntity').on('entityChange', function(){
		var tableName = $(this).val();
		$('#Text_attributes').attr(
				'data-custom-controller',
				'/collection/querybuilder/getQbColumnDefByName/'
				+ tableName);
		$('#Text_attributes').removeAttr("disabled");
		$('#Text_attributes').removeAttr("readonly");
	});
	
	$('#Text_businessEntity').change(function (){
		if($('#Text_businessEntity').val() == ''){
			$('#Text_attributes').attr('data-custom-controller', '');
			$('#Text_attributes').attr("disabled", true);
			$('#Text_attributes').attr("readonly", true);
		}
		$('#attributes, #Text_attributes').val('');
		$('#attributes').trigger('chosen:updated');
		$('div#sqlQueryRuleDiv').find('input#dataType').val('');
		$('div#sqlQueryRuleDiv').find('input#paramLength').val('');
		$('div#sqlQueryRuleDiv').find('input#decimalPartLength').val('');
	});
		
	
	$('#attributes').on('attributeChange', function(){
		var columnName = $(this).val();
		var tableName = $('#businessEntity').val();
		loadDataType(tableName, columnName);
	});

	$('#operator').on('change', function(){
		var operator = $(this).val();
		showParameters($('#dataType').val(), operator);
	});

	$('#validate').on('click', function(){
		validateSqlQuery(this);
	});

	$('#edit_Btn').on('click', function(){
		definitionClearConfirmation();
	})

	$('#cancel_Btn').on('click', function(){
		toggleRuleBasedOnClear($('#ruleBasedOnBackup').val() == 'true');
		var htmlBackup = $("#htmlBackup").val();
		var sqlBackup = $("#sqlBackup").val();
		var queryInJsonBackup = $('#queryInJsonBackup').val();
		$("#customSelectionCriteria").val(sqlBackup);
		$('#queryInJson').val(queryInJsonBackup);
		if(htmlBackup != $("#formulaEditor").html()){
			$("#formulaEditor").html(htmlBackup);
			registerOnHover();
		}
		var blankJson = (queryInJsonBackup =='' || queryInJsonBackup == undefined || queryInJsonBackup == null);
		if((sqlBackup !='' && sqlBackup != undefined && sqlBackup != null) && blankJson){
			hideQueryBuilder();
		}else{
			showQueryBuilder();
		}
		$('.sqlErrorMessage').find('span').text('');
		$('.sqlErrorMessage').hide();
		$('div#finalSqlQuery').find('span').find('b').text('');
		$('div#finalSqlQuery').hide();
	});
	
	createExpression();
	
	if(disabled == "true"){
		$('#customSelectionCriteria').attr('disabled', true);
		$('#queryBuilderContainer button').attr('disabled', true);
		disableQueryBuilderPanel()
	}
});

function validAddPart(){
	var toValidate = '#Text_businessEntity, #Text_attributes, #operator';
	var op = $('#operator').val();
	var dtype = $('#dataType').val();
	if(dtype == 'DATE'){
		if(op == 'BETWEEN')
			toValidate = toValidate + ',#dateParamVal1,#dateParamVal2';
		else
			toValidate = toValidate + ',#dateParamVal';
	}else{
		if(op == 'BETWEEN')
			toValidate = toValidate + ',#paramValue1,#paramValue2';
		else
			toValidate = toValidate + ',#paramValue';
	}
	return $(toValidate).valid();
}

function toggleRuleBasedOnClear(value){
	toggleRuleBasedOn(value);
	$('#customSelectionCriteria').val('');
}

function createExpression(){
	makeExpressionFromJson($('#queryInJson').val(), $('#customSelectionCriteria').val());
	$("#htmlBackup").val($('#formulaEditor').html());
	$('#sqlBackup').val($('#customSelectionCriteria').val());
	$('#queryInJsonBackup').val($('#queryInJson').val());
}


function disableQueryBuilder(){
	$('#queryBuilderPanel .form-control').attr('disabled', true);
}

function enableQueryBuilder(){
	if($('#useQueryBuilder').is(':checked')){
		$('#queryBuilderPanel .form-control').attr('disabled', false);
		$('#operator').trigger('chosen:updated');
	}
}

function makeMandatory(fieldId){
	if (! $(fieldId).hasClass('required'))
		$(fieldId).addClass('required');
}

function removeMandatory(fieldId){
	if($(fieldId).hasClass('required'))
		$(fieldId).removeClass('required');
}

function showQueryBuilder(){
	$('#queryBuilderPanel').removeAttr('hidden');
	$('#useQueryBuilder').prop('checked', false);
	$('#uniform-useQueryBuilder > span').removeClass('checked');
	$('#customSelectionCriteria').prop('readonly', true);
	$('#edit_Btn').attr('hidden', false);
}

function hideQueryBuilder(){
	$('#queryBuilderPanel').attr('hidden', true);
	$('#useQueryBuilder').prop('checked', true);
	$('#uniform-useQueryBuilder > span').addClass('checked');
	$('#edit_Btn').attr('hidden', true);
	$('#customSelectionCriteria').attr('readonly', false);
}

function makeExpressionFromJson(jsonData, nativeSql){
	var blankJson = (jsonData =='' || jsonData == undefined || jsonData == null);
	if((nativeSql !='' && nativeSql != undefined && nativeSql != null) && blankJson){
		hideQueryBuilder();
	}else{
		clearRuleDefinition();
		showQueryBuilder();
	}
	
	if(blankJson){
		if(isExisting == 'true' || viewable == 'true'){
			$('#formulaEditor div').removeClass('lastSelected');
		}
		return;
	}
	var decodedJson = decodeSpecialCharacters(jsonData);
	var jsonObj = JSON.parse(decodedJson);
	var i = 0;
	for(i=0; i<jsonObj.attributeDetailVOs.length; i++){
		var item = jsonObj.attributeDetailVOs[i];
		var condition = item.condition.trim();
		var openBracket = item.openBracket.trim();
		var closeBracket = item.closeBracket.trim();
		if(condition != ''){
			var conditionText = (condition == 'AND') ? andText : orText;
			createElement("condition", '', '', condition, '', '', '', '', '', '', '', conditionText,'<b>'+conditionText+'</b>');
		}if(openBracket != ''){
			createElement("openbrc", openBracket, '', '', '', '', '', '', '', '', '', openBracket, openBracket);
		}
		_addToJsonArray(item.businessEntity, item.tableName, item.attributeName, item.columnName, item.condnOperatorText, item.condnOperatorValue, item.attributeValue);
		if(closeBracket != ''){
			createElement("closebrc", '', closeBracket, '', '', '', '', '', '', '', '', closeBracket, closeBracket);
		}
	}
	
	if(isExisting == 'true' || viewable == 'true'){
		$('#formulaEditor div').removeClass('lastSelected');
	}
}

function addToJsonArray(){
	var paramValue1 = '';
	var paramValue2 = '';
	var dataType = $('div#sqlQueryRuleDiv').find('input#dataType').val();
	var paramLength = $('div#sqlQueryRuleDiv').find('input#paramLength').val();
	var decimalPartLength = $('div#sqlQueryRuleDiv').find('input#decimalPartLength').val();
	var validatedAccordingType1 = "";
	var validatedAccordingType2 = "";
	var operatorValue = $('#operator').val();
	if(dataType == 'DATE'){
		if(operatorValue == 'BETWEEN'){
			paramValue1 = "'"+$('#dateParamVal1').val()+"'";
			paramValue2 = "'"+$('#dateParamVal2').val()+"'";
		}else{
			paramValue1 = "'"+$('#dateParamVal').val()+"'";
		}
	}else if(dataType == 'VARCHAR' || dataType == 'CHAR'){
		if(operatorValue == 'BETWEEN'){
			paramValue1 = $('#paramValue1').val();
			paramValue2 = $('#paramValue2').val();
		}else{
			paramValue1 = $('#paramValue').val();
		}
		validatedAccordingType1 = validateString(paramValue1, paramLength);
		validatedAccordingType2 = validateString(paramValue1, paramLength);
		paramValue1 = makeVarcharType(paramValue1);
		paramValue2 = makeVarcharType(paramValue2);
	}else{
		if(operatorValue == 'BETWEEN'){
			paramValue1 = $('#paramValue1').val();
			paramValue2 = $('#paramValue2').val();
		}else{
			paramValue1 = $('#paramValue').val();
		}
		validatedAccordingType1 = validateNumber(paramValue1, paramLength, decimalPartLength);
		validatedAccordingType2 = validateNumber(paramValue2, paramLength, decimalPartLength);
		paramLength = '('+paramLength +','+decimalPartLength+')';
	}
	var errorMessage = (validatedAccordingType1 != '') ? validatedAccordingType1 : (validatedAccordingType2 != '') ? validatedAccordingType2 : '';
	if(errorMessage != ''){
		showError(errorMessage);
		return false;
	}
	
	
	var entityText = $('#Text_businessEntity').val();
	var entityValue = $('#businessEntity').val();
	var attributeText = $('#Text_attributes').val();
	var attributeValue = $('#attributes').val();
	var operatorText = $("#operator option:selected").text();
	var condition = $('#conditionHolder').val();
	var oldExprs = $('#hqlHolder').val();
	var paramVal = paramValue1;
	if(operatorValue === 'BETWEEN'){
		paramVal = paramVal + ' AND ' + paramValue2;
	}
	_addToJsonArray(entityText, entityValue, attributeText, attributeValue, operatorText, operatorValue, paramVal);
	clearRuleDefinitionFields();
}

function _addToJsonArray(entityText, entityValue, attributeText, attributeValue, operatorText, operatorValue, paramVal){
	entityText = entityText.trim();
	entityValue = entityValue.trim();
	attributeText = attributeText.trim();
	attributeValue = attributeValue.trim();
	operatorText = operatorText.trim();
	operatorValue = operatorValue.trim(); paramVal=paramVal.trim();

	var clausePart = entityText + '.';
	var dataPart = entityText + '.';
	clausePart = clausePart + attributeText;
	dataPart = dataPart + attributeText;
	clausePart = clausePart + ' ' + '<b>' + operatorText + '</b>';
	dataPart = dataPart + ' ' + operatorText;
	clausePart = clausePart + ' ' + paramVal;
	dataPart = dataPart + ' ' + paramVal;
	
	
	createElement('clausePart', '', '', '', entityValue, entityText, attributeValue, attributeText, operatorText, operatorValue, paramVal, dataPart, clausePart);
	return true;
}

function makeVarcharType(value){
if (!String.prototype.startsWith) {
			String.prototype.startsWith = function(searchString, position) {
			position = position || 0;
			return this.indexOf(searchString, position) === position;
		};
}
if (!String.prototype.endsWith) {
			String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		  };
}
if(! value.startsWith("'"))
	value = "'" + value;
if(value.endsWith(value))
	value = value + "'";
return value;
}

function showError(errorMsg){
	$('.definition-valid-notice').html("<p class='false-exp'><i class='glyphicon glyphicon-exclamation-sign m-r5'></i><span class='color-red'>"+errorMsg+" </span></p>");
	$(".definition-valid-notice p").fadeOut(10000);
}

function sendReqToGetQuery(jsonString){
	var stringifiedJson = JSON.stringify(jsonString);
	var encodedJson = encodeSpecialCharacters(stringifiedJson);
	$.ajax({
		type: 'post',
		data: encodedJson,
		contentType: 'application/json',
		url : getContextPath() + "/app/querybuilder/generateSqlQuery",                     
		async : false,      
		success : function(data) {
			$('#customSelectionCriteria').val(data);
			$('#customSelectionCriteria').prop('readonly', true);
			$('#queryInJson').val(encodedJson);
		}
	});
}

function validateSqlQuery(obj){
	var queryValidated=false;
	if(checkDuplicateCode()){
		return queryValidated;
	}
	var sqlQuery="";
	var sqlQueryDiv=$(obj).parents('div#sqlQueryRuleDiv');
	var customSelectionCriteriaTextArea=$(sqlQueryDiv).find('textarea#customSelectionCriteria');
	if($(customSelectionCriteriaTextArea).valid()){
		var customSelectionCriteria=$(customSelectionCriteriaTextArea).val();
		var customSelectionCriteriaEncoded=encodeSqlCriteria(customSelectionCriteria);

		var baseCriteriaSelectClause=$(sqlQueryDiv).find('div#queryBaseSelectClause').find('span').text();
		sqlQuery=encodeSqlCriteria(sqlQuery+" "+baseCriteriaSelectClause+" "+customSelectionCriteria);
		
		 $.ajax({
			url : getContextPath()
					+ "/app/querybuilder/validateNativeSQL",
					data:{"sqlQuery":sqlQuery},
			async : false,
			type : "GET",
			success : function(response) {
				if(response!=""){
					queryValidated=false;
					$('.sqlErrorMessage').find('span').text(response);
					$('.sqlErrorMessage').show();
					$('div#finalSqlQuery').hide();
				}
				else{
					$('.sqlErrorMessage').find('span').text('');
					$('.sqlErrorMessage').hide();
					$(customSelectionCriteriaTextArea).removeAttr('name');
					queryValidated=true;
				}
			},
			error:function(error){
				queryValidated=false;

			}
		});
		 if(queryValidated){
			$(sqlQueryDiv).find('div#finalSqlQuery').find('span').find('b').text(getMessage('msg.queryBuilder.sqlQueryRule.queryValidatedSuccessfully'));
			$(sqlQueryDiv).find('div#finalSqlQuery').removeClass('hide');
			$(sqlQueryDiv).find('div#finalSqlQuery').show();
			$(sqlQueryDiv).find('input#customSelectionCriteriaHidden').val(customSelectionCriteriaEncoded);
		 }
		
		return queryValidated;
	}
}

function showSqlErrorMsg(message){
	$('.sqlErrorMessage').find('span').text(message);
	$('.sqlErrorMessage').show();
	$('div#finalSqlQuery').hide();
}

function showSqlSuccessMsg(message){
	$('#finalSqlQuery').find('span').find('b').text(message);
	$('#finalSqlQuery').removeClass('hide');
	$('#finalSqlQuery').show();
	$('.sqlErrorMessage').hide();
}

function clearRuleDefinitionFields(){
	$('#businessEntity, #Text_businessEntity, #attributes, #Text_attributes, #operator, #paramValue,#paramValue1,#paramValue2,#dateParamVal,#dateParamVal1,#dateParamVal2').val('');
	$('select[id="operator"]').trigger('chosen:updated');
	$('#Text_attributes').attr('data-custom-controller', '');
	$('#Text_attributes').attr("disabled", true);
	$('#Text_attributes').attr("readonly", true);
	$('div#sqlQueryRuleDiv').find('input#dataType').val('');
	$('div#sqlQueryRuleDiv').find('input#paramLength').val('');
	$('div#sqlQueryRuleDiv').find('input#decimalPartLength').val('');
	showSingleText();
	resetDatePickers();
}

function clearRuleDefinition(){
	clearRuleDefinitionFields();
	clearDiv('formulaEditor');
}

function definitionHideConfirmation(){
	confirmDialog(getMessage('msg.queryBuilder.definitionClearOnHide'),getMessage('label.comment.confirm'),{
		success : function(){
			clearRuleDefinition();
			hideQueryBuilder();
			$('#queryInJson').val('');
		},
		fail : function(){
			$('#useQueryBuilder').prop('checked', false);
			$('#uniform-useQueryBuilder > span').removeClass('checked');
		}
	});
}

function definitionClearConfirmation(){
	confirmDialog(getMessage('msg.queryBuilder.definitionClearOnHide'),getMessage('label.comment.confirm'),{
		success : function(){
			clearRuleDefinition();
			hideQueryBuilder();
			$('#queryInJson').val('');
		},
		fail : function(){
		}
	});
}

function createElement(className, openBracket, closeBracket, condition, table, entity, column, attribute, operatorText, operatorValue, param, data, html){
	fnemptyDiv('defaultText');
	html="<div class='emptyDiv selectableDiv largefont' style='float : left; ' contenteditable='false '>&nbsp;&nbsp;&nbsp;</div>"
		+"<div contenteditable='false' style='float: left;' class=' formulaElement smallfont "+className+"' " 
		+"data-openbrc=\""+openBracket+"\" data-closebrc=\""+closeBracket+"\" data-table=\""+table+"\" data-entity=\""+entity+"\" "
		+"data-attribute=\""+attribute+"\" data-column=\""+column+"\" data-condition=\""+condition+"\" "
		+"data-param=\""+param+"\" data-operatortext=\""+operatorText+"\" data-operatorvalue=\""+operatorValue+"\" data-def=\""+data+"\"> " 
		+ html + "<img src='"+cdnUrl+"/images/close_button.png' "
		+"class='hiddenCustom' height=20px width=20px style='position: relative; top: -20px; left: -10px' "
		+"onclick='deleteElement($(this).parent());'/></div>";
	$( html).insertBefore("#formulaEditor div.lastSelected");
	registerOnHover();
}

function fnemptyDiv(divElement) {
	var id = '#' + divElement;

	if ($('#defaultText').hasClass('defaultTextClass')) {
		$('#defaultText').removeClass('defaultTextClass');
		$(id).html('');
		appendLastEmptyDiv();
		registerOnHover();
	}
}

function appendLastEmptyDiv() {
	var formulaEditor = $('#formulaEditor');
	formulaEditor
	.html("<div class='lastDiv selectableDiv lastSelected largefont' style='float : left;' contenteditable='false '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>");
}

function registerOnHover() {
	$(document).ready(function() {
		$("div.formulaElement").unbind('mouseenter mouseleave').hover(function() {
			$(this).removeClass("smallfont");
			$(this).children('img').removeClass("hiddenCustom");
			$(this).addClass("largefont");

		}, function() {
			$(this).removeClass("largefont");
			$(this).addClass("smallfont");
			$(this).children('img').addClass("hiddenCustom");

		});

		$('#formulaEditor   div.selectableDiv').click(function() {
			if((isExisting=='' || isExisting=='false') && (viewable == '' || viewable == 'false')){
				$('#formulaEditor   div').removeClass('lastSelected');
				$(this).addClass('lastSelected');
			}
		});

	});
}

function deleteElement(ElementID){
	$('#formulaEditor  div').removeClass('lastSelected');
	ElementID.next('.emptyDiv').remove();
	ElementID.prev('.emptyDiv').addClass('lastSelected');
	ElementID.remove();
}

function validateExprAndCreateJson() {
	var jsonData = {};
	jsonData.attributeDetailVOs = [];
	var formulaEditor = $('#formulaEditor');
	var html = formulaEditor.html();
	var condition = '';
	var oBracket = '';
	var ruleDef = '';
	var ruleDefTemp = '';
	var totalBracket = 0;
	var i;
	for (i = 0; i <= $('#formulaEditor  div.formulaElement').length - 1; i++) {
		var newElement = $('#formulaEditor  div.formulaElement:eq(' + i + ')');
		ruleDef = ruleDef + newElement.attr("data-def").trim() + ' ';
		if(newElement.hasClass("clausePart")){
			jsonData.attributeDetailVOs.push({
				"tableName" : newElement.attr("data-table"),
				"businessEntity" : newElement.attr("data-entity"),
				"columnName" : newElement.attr("data-column"),
				"attributeName" : newElement.attr("data-attribute"),
				"attributeValue" : newElement.attr("data-param"),
				"condition" : condition,
				"condnOperatorText" : newElement.attr("data-operatortext"),
				"condnOperatorValue" : newElement.attr("data-operatorvalue"),
				"openBracket": oBracket,
				"closeBracket": ''
			});
			oBracket = '';
			condition = '';
			ruleDefTemp = ruleDefTemp + 'a ';
		}else if(newElement.hasClass("openbrc")){
			totalBracket = totalBracket + 1;
			oBracket = oBracket + newElement.attr("data-openbrc");
			ruleDefTemp = ruleDefTemp + newElement.attr("data-openbrc").trim() + ' ';
		}else if(newElement.hasClass("closebrc")){
			totalBracket = totalBracket - 1;
			oldValue = jsonData.attributeDetailVOs[jsonData.attributeDetailVOs.length - 1].closeBracket;
			jsonData.attributeDetailVOs[jsonData.attributeDetailVOs.length - 1].closeBracket = oldValue + newElement.attr("data-closebrc");
			ruleDefTemp = ruleDefTemp + newElement.attr("data-closebrc").trim() + ' ';
		}else if(newElement.hasClass("condition")){
			condition = condition + newElement.attr("data-condition");
			
			ruleDefTemp = ruleDefTemp + (newElement.attr("data-condition").trim()==='AND' ? '&&' : newElement.attr("data-condition").trim()=='OR' ? '||' : '').trim() + ' ';
		}
	}

	if(oBracket!=='' || condition!==''){
		showError(getMessage('msg.queryBuilder.incompleteExpression'));
		return null;
	}else if(totalBracket !== 0){
		showError(getMessage('msg.queryBuilder.parenthesisMismatch'));
		return null;
	}else if(ruleDef === ''){
		showError(getMessage('msg.queryBuilder.createExpression'));
		return null;
	}
	if($("#accountBasedRuleIdHidden").prop("checked")){
		jsonData.ruleBasedFlag = '1';
		jsonData.ruleBasedOn = 'COL_ACCOUNT_DTL';
	}else{
		jsonData.ruleBasedFlag = '0';
		jsonData.ruleBasedOn = 'COL_CASE_DTL';
	}
	
	if(validateExpression(ruleDefTemp.trim(), ruleDef.trim())){
		return jsonData;
	}
	return null;
}

function clearDiv(divElement) {
	var id = '#' + divElement;
	$(id).html('');
	appendLastEmptyDiv();
}

function validateExpression(ruleExprTemp, ruleExpr){
	var validated = true;
	$.ajax({
		url : getContextPath() + "/app/Rule/validateRule",
		async : false,
		data : ({
			ruleExp : ruleExprTemp
		}),
		success : function(data) {
			 var result = new Array();
				 result = data.split(",");
			if (result[0] == "false") {
				result.shift();
				validated = false;
				showError(result[0] +','+ ruleExpr);
			}
		}
	});
	
	return validated;
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

function toggleDiv() { 
	  var checkbox = $("#copy_from_existing");
	  var hidden = $("#hidden_fields");
	  hidden.hide();
	  checkbox.change(function() {
	    if (checkbox.is(':checked')) {
	      hidden.show();
	      $('#clear').show();
	    } else {
	      hidden.hide();
	      $('#clear').hide();
	    }
	  });
}

function updateSqlCriteriaFields(obj,disableFields,isExisting,edit){
	var sqlQueryDiv=	$(obj).parents('div#sqlQueryRuleDiv');
	var basicRuleHeaderId=$(obj).val();

	 $.ajax({
			url : getContextPath()
					+ "/app/basicRule/fetchBasicRuleHeader",
					data:{"basicRuleHeaderId":basicRuleHeaderId},
			async : false,
			type : "GET",
			dataType:'json',
			success : function(data) {
				var criteriaDescription=	data['criteriaDescription'];
				var nativeQueryString=data['nativeQueryString'];
				var decodedNativeQueryString=	data['decodedNativeQueryString'];
				var jsonString = data['jsonString'];
				$(sqlQueryDiv).find('input#criteriaDescription').val(criteriaDescription);
				$(sqlQueryDiv).find('textarea#customSelectionCriteria').val(decodedNativeQueryString);
				toggleRuleBasedOn(data['accountBasedRule']);
				$('#ruleBasedOnBackup').val(data['accountBasedRule']);
				makeExpressionFromJson(jsonString, decodedNativeQueryString);
				$(sqlQueryDiv).find('input#queryInJson').val(jsonString);
				if(disableFields){
					$(sqlQueryDiv).find('input#criteriaDescription').attr('disabled',true);
					$(sqlQueryDiv).find('input#criteriaDescriptionHidden').val(criteriaDescription);
					$(sqlQueryDiv).find('textarea#customSelectionCriteria').attr('disabled',true);
					$(sqlQueryDiv).find('input#customSelectionCriteriaHidden').val(nativeQueryString);
					disableQueryBuilderPanel();
				}
				if(isExisting){
					$(sqlQueryDiv).find('input#criteriaDescriptionHidden').val(criteriaDescription);
					$(sqlQueryDiv).find('input#customSelectionCriteriaHidden').val(nativeQueryString);
				}
				else{
					if(!edit){
						var criteriaCode=	data['criteriaCode'];
						$(sqlQueryDiv).find('input#criteriaCode').val(criteriaCode);
					}
				}
			}
		}); 
}

function disableQueryBuilderPanel(){
	disableQueryBuilder();
	$('#useQueryBuilder').attr('disabled', true);
	$('div.formulaElement').addClass('formulaElementTemp').removeClass('formulaElement');
	$('#queryBuilderContainer :button').attr('disabled', true);
}

function enableQueryBuilderPanel(){
	enableQueryBuilder();
	$('#useQueryBuilder').attr('disabled', false);
	$('div.formulaElementTemp').addClass('formulaElement').removeClass('formulaElementTemp');
	$('#queryBuilderContainer :button').attr('disabled', false);
}

function loadDataType(tableName, columnName){
	$.ajax({
		url : getContextPath()
			  + "/app/querybuilder/getColumnDataType/"+tableName+"/"+columnName,
			  async : false,
			  type : "GET",
			  success : function(data) {
				  var result = data.split(",");
				  $('div#sqlQueryRuleDiv').find('input#dataType').val(result[0].trim());
				  if(result.length > 1)
					  $('div#sqlQueryRuleDiv').find('input#paramLength').val(result[1].trim());
				  if(result.length > 2)
					  $('div#sqlQueryRuleDiv').find('input#decimalPartLength').val(result[2].trim());
				  showParameters(result[0].trim(), $('#operator').val());
			  }
	});
}

function checkDuplicateCode(){
	var duplicate = false;
	var criteriaCode = $('#criteriaCode').val();
	if (criteriaCode != "" && (isExisting=='false' || isExisting=='')) {
		$.ajax({
			url : getContextPath()+ "/app/querybuilder/checkDuplicateCode",
		    async : false,
			type : "POST",
			dataType : "json",
			data:({"criteriaCode":criteriaCode,"basicRuleHeaderId":basicRuleHeaderId,
				"accountBasedRule":$("#accountBasedRuleIdHidden").prop("checked")
              }),
			success : function(data) {
				if (data.error != null){
					$('#criteriaCode').val('');
					displayAjaxMessages(data);
					duplicate = true;
				}
	        }
	    });
	  }
	return duplicate;
}

function validateNumber(val){
	var validated = true;
	if(val != ''){
		validated = /^[-]?([0-9]*[.])?[0-9]+$/.test(val);
	}
	return validated;
}
function validateString(val){
	var validated = true;
	if(val != ''){
		validated = /^'.*'$/.test(val);
	}
	return validated;
}
function validateChar(val){
	var validated = true;
	if(val != ''){
		validated = /^'.'$/.test(val);
	}
	return validated;
}

function validateNumber(val, numberLength, decimalLength){
	var number = val + '';
	if(number == '')
		return "";
	if(/^[-]?([0-9]*[.])?[0-9]+$/.test(number) == false){
		return getMessage('msg.queryBuilder.paramValueNumeric', [$('#Text_attributes').val()]);
	}
	if(number.indexOf('.') == -1){
		if(number.length > numberLength){
			return getMessage('msg.queryBuilder.paramValueLength', [$('#Text_attributes').val(), '('+numberLength +','+decimalLength+')']);
		}
	}else{
		var decimalNumber = number.split("\.");
		if(decimalNumber[0].length > numberLength || decimalNumber[1].length > decimalLength){
			return getMessage('msg.queryBuilder.paramValueLength', [$('#Text_attributes').val(), '('+numberLength +','+decimalLength+')']);
		}
	}
	return "";
}

function validateString(val, length){
	if(val.length > length){
		return getMessage('msg.queryBuilder.paramValueLength', [$('#Text_attributes').val(), length]);
	}
	return "";
}

function showSingleText(){
	$('#singleText').removeClass('hide');
	$('#betweenText,#singleDate,#betweenDate').addClass('hide');
}
function showBetweenText(){
	$('#betweenText').removeClass('hide');
	$('#singleText,#singleDate,#betweenDate').addClass('hide');
}
function showSingleDate(){
	$('#singleDate').removeClass('hide');
	$('#betweenText,#singleText,#betweenDate').addClass('hide');
}
function showBetweenDate(){
	$('#betweenDate').removeClass('hide');
	$('#betweenText,#singleDate,#singleText').addClass('hide');
}
function showParameters(dataType, operator){
	if(dataType == 'DATE'){
		if(operator == 'BETWEEN'){
			showBetweenDate();
		}else{
			showSingleDate();
		}
	}else{
		if(operator == 'BETWEEN'){
			showBetweenText();
		}else{
			showSingleText();
		}
	}
}

function encodeSpecialCharacters(jsonString) {
	var SPECIAL_CHARACTERS = ['<', '>', '(', ')', "'", '!', ';'];
	var SPECIAL_CHARACTERS_MASK = ['$#az@', '@#za$', '$#a2z@', '@#z2a$', '$#a3z@', '$#a4z@', '$#a5z@'];
	if(jsonString != null && jsonString != ''){
		for (var i = 0; i < SPECIAL_CHARACTERS.length; ++i) {
			while (jsonString.indexOf(SPECIAL_CHARACTERS[i]) != -1) {
				jsonString = jsonString.replace(SPECIAL_CHARACTERS[i], SPECIAL_CHARACTERS_MASK[i]);
			}
		}
	}
	return jsonString;
}

function decodeSpecialCharacters(jsonString) {
	var SPECIAL_CHARACTERS = ['<', '>', '(', ')', "'", '!', ';'];
	var SPECIAL_CHARACTERS_MASK = ['$#az@', '@#za$', '$#a2z@', '@#z2a$', '$#a3z@', '$#a4z@', '$#a5z@'];
	if(jsonString != null && jsonString != ''){
		for (var i = 0; i < SPECIAL_CHARACTERS_MASK.length; ++i) {
			while (jsonString.indexOf(SPECIAL_CHARACTERS_MASK[i]) != -1) {
				jsonString = jsonString.replace(SPECIAL_CHARACTERS_MASK[i], SPECIAL_CHARACTERS[i]);
			}
		}
	}
	return jsonString;
}


function resetDatePickers(){
	initiateDatePickerWithCustomDateTarget(['dateParamVal', 'dateParamVal1', 'dateParamVal2'],$('#businessDate').val());
}


function initiateDatePickerWithCustomDateTarget(datepickerElementIds,customDate){
    setTimeout(function(){
           for(var i=0;i<datepickerElementIds.length;i++){
                  var elementId=datepickerElementIds[i];
                 updateDatepickerTarget(elementId,customDate,false);
           }      
    }, 300);   
}        

function updateDatepickerTarget(elementId,customDate,isBusinessDate){
    $('div[id^=datepicker_'+elementId+']').each(function(){
           var tempDate = Date.parseString(customDate, dateFormatSessionScope);
           $(this).data({date:new Date(tempDate.getTime() - (tempDate.getTimezoneOffset()*60000))});       
    });
}