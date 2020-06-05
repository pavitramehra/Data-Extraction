
	var rowCount = 0;
$(document).ready(function(){


	rowMoveListener();
	reSetLink();

	$("[id$='conditionSet.error']").hide();

	$("[id$='Rule.error']").hide();


});

function rowMoveListener(){

	// up priority
		$("#table1 tr a[id^=up]").unbind('click').click(function(){
			 var size = $("#table1 tbody tr").length;
			 for( i=0 ; i < (parseInt(size)) ; i++){
				if($('#table1 tbody tr:eq('+ (parseInt(i))+')').hasClass('highlight'))
					$('#table1 tbody tr:eq('+ (parseInt(i))+')').removeClass('highlight');
			 }
			 var currPriority = $(this).parent("td").children("input:eq(0)").val();
			 var prePriority = $(this).parents("tr").prev().find("input:eq(2)").val();

			 $(this).parent("td").children("input:eq(0)").val((parseInt(currPriority) -1));
			 $(this).parents("tr").prev().find("input:eq(2)").val((parseInt(prePriority) +1));

			// moving div
			 var row = $(this).parents("tr:first");
			 row.insertBefore(row.prev());
			 reSetLink();
	});
	//down priority
	$("#table1 tr a[id^=down]").unbind('click').click(function(){
		 var size = $("#table1 tbody tr").length;
		 for( i=0 ; i < (parseInt(size)) ; i++){
			if($('#table1 tbody tr:eq('+ (parseInt(i))+')').hasClass('highlight'))
				$('#table1 tbody tr:eq('+ (parseInt(i))+')').removeClass('highlight');
		 }
		var currPriority = $(this).parent("td").children("input:eq(0)").val();
		 var nextPriority = $(this).parents("tr").next().find("input:eq(2)").val();

		 $(this).parent("td").children("input:eq(0)").val((parseInt(currPriority) +1));
		 $(this).parents("tr").next().find("input:eq(2)").val((parseInt(nextPriority) -1));
		// moving div
		 var row = $(this).parents("tr:first");
		 row.insertAfter(row.next());
		 reSetLink();
	});
}
function reSetLink() {
	var size = $(
	"table#table1 tbody tr")
	.length;
	var firstElementUP = $('table#table1.table tbody tr:eq('
			+ (0) + ') td:eq('+3+') a:eq('+0+')');
	firstElementUP.attr('hidden','true');
	var firstElementDOWN = $('table#table1.table tbody tr:eq('
			+ (0) + ') td:eq('+3+') a:eq('+1+')');
	firstElementDOWN.removeAttr('hidden');

	var lastElementUP = $('table#table1.table tbody tr:eq('
			+ ((parseInt(size)-1)) + ') td:eq('+3+') a:eq('+0+')');
	lastElementUP.removeAttr('hidden');
	var lastElementDOWN = $('table#table1.table tbody tr:eq('
			+ ((parseInt(size)-1)) + ') td:eq('+3+') a:eq('+1+')');
	lastElementDOWN.attr('hidden','true');
	for( i=1 ; i < (parseInt(size) -1) ; i++){
		var elementUP = $('table#table1.table tbody tr:eq('
				+ (parseInt(i)) + ') td:eq('+3+') a:eq('+0+')');
		var elementDOWN = $('table#table1.table tbody tr:eq('
				+ (parseInt(i)) + ') td:eq('+3+') a:eq('+1+')');
		elementUP.removeAttr('hidden');
		elementDOWN.removeAttr('hidden');

	}
}


function deleteRecord(delVal, delRowId) {

		if (null != delVal && delVal != "") {
			var deletedEntry = $("#deletedEntries").val();
			deletedEntry = deletedEntry + delVal;
			deletedEntry = deletedEntry + ',';
			$("#deletedEntries").val(deletedEntry);
		//	$('#data_row' + delRowId).hide();
			$('#data_row' + delRowId).remove();
			reSetLink();
		}else if(delVal == ""){
			$.ajax({
				url : "${pageContext.request.contextPath}/app/ProductTypeConditionSetMapping/deleteRowId/"+delRowId,
				type : 'GET',
				async : false,
				success : function(jqXHR) {
					$('#data_row' + delRowId).remove();
					reSetLink();
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});
		}
	}

	function deleteRow(delRowId) {

		$(delRowId).parent().parent().remove();
		reSetLink();
	}

	function defaultSetPolicy(id) {
		var s = id.split("_");
		$("#defaultSelected").val(s[1]);
		$("table#table1 tbody tr td span").removeClass("checked");
        $("#"+id+"").parent().addClass("checked");
		resetDisabledRule();
		$("table#table1 tbody tr td select[id='conditionSetMappingList["+s[1]+"].rule']").val("-1");
		$("table#table1 tbody tr td select[id='conditionSetMappingList["+s[1]+"].rule']").attr("disabled","disabled");
	}

	function resetDisabledRule(){
		var size = $(
		"table#table1.table tbody tr")
		.length;
		for( i=0 ; i < (parseInt(size)) ; i++){
			if($("table#table1 tbody tr td select[id='conditionSetMappingList["+i+"].rule']").attr("disabled") == 'disabled'){
				$("table#table1 tbody tr td select[id='conditionSetMappingList["+i+"].rule']").removeAttr("disabled");
				$("table#table1 tbody tr td select[id='conditionSetMappingList["+i+"].rule']").val('-1');
			}
		}
	}
	function checkDefault(){
		var size = $(
		"table#table1.table tbody tr")
		.length;
		for( i=0 ; i < (parseInt(size)) ; i++){
			if($("table#table1 tbody tr td select[id='conditionSetMappingList["+i+"].rule']").attr("disabled") == 'disabled'){
				$("#defaultSelected").val(i);
			}
		}
	}
 function saveForm() {

		checkDefault();
		var isChecked = $("#create_another_master").prop('checked') ? true : false;
		var formTemp = $("#masterForm");



		for(var a=0; a<=rowCount; a++){

			var selected_conditionSet = "";

			if($("table#table1 tbody tr td select[id='paramname"+a+"']").val()){
				console.log("inside if set");
				selected_conditionSet = $("table#table1 tbody tr td select[id='paramname"+a+"']").val();
			}
			var selected_rule = "";

			if($("table#table1 tbody tr td select[id='conditionSetMappingList["+a+"].rule']").val()){
				console.log("inside if rule");
				selected_rule = $("table#table1 tbody tr td select[id='conditionSetMappingList["+a+"].rule']").val();
			}

			if(selected_conditionSet == ""){

				console.log("if Set a : "+a);
				$("[id$='"+a+"].conditionSet.error']").show();

			}else{
				console.log("else Set a : "+a);
					$("[id$='"+a+"].conditionSet.error']").hide();
				}

			if(selected_rule == ""){

				var radioSelectButton = $("#defaultSet_"+a).parent().attr('class');
                if(radioSelectButton != 'checked'){
                    console.log("if Rule a : "+a);
                    $("[id$='"+a+"].Rule.error']").show();
                }

			}
			else{
					console.log("else Rule a : "+a);
					$("[id$='"+a+"].Rule.error']").hide();
				}
		}


		$("#createAnotherMaster").val(isChecked);
		formTemp.submit();

	}
	function saveAndSendForApproval(context) {
		checkDefault();
		var isChecked = $("#create_another_master").prop('checked') ? true : false;
		$("#createAnotherMaster").val(isChecked);
		var masterID = document.getElementById("masterID").value;
		var form = document.getElementById("masterForm");




		for(var a=0; a<=rowCount; a++){

			var selected_conditionSet = "";

			if($("table#table1 tbody tr td select[id='paramname"+a+"']").val()){
				console.log("inside if set");
				selected_conditionSet = $("table#table1 tbody tr td select[id='paramname"+a+"']").val();
			}
			var selected_rule = "";

			if($("table#table1 tbody tr td select[id='conditionSetMappingList["+a+"].rule']").val()){
				console.log("inside if rule");
				selected_rule = $("table#table1 tbody tr td select[id='conditionSetMappingList["+a+"].rule']").val();
			}

			if(selected_conditionSet == ""){

				console.log("if Set a : "+a);
				$("[id$='"+a+"].conditionSet.error']").show();

			}else{
				console.log("else Set a : "+a);
					$("[id$='"+a+"].conditionSet.error']").hide();
				}

			if(selected_rule == ""){

				var radioSelectButton = $("#defaultSet_"+a).parent().attr('class');
                if(radioSelectButton != 'checked'){
                    console.log("if Rule a : "+a);
                    $("[id$='"+a+"].Rule.error']").show();
                }

			}
			else{
					console.log("else Rule a : "+a);
					$("[id$='"+a+"].Rule.error']").hide();
				}
		}


		if ($(".form").valid()){
			form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
			form.submit();
		}

	}
	function removeHighlight(){
		var size = $("table#table1 tbody tr").length;
		for( i=0 ; i < (parseInt(size)) ; i++){
			if($('table#table1 tbody tr:eq('+ (parseInt(i))+')').hasClass('highlight'))
					$('table#table1 tbody tr:eq('+ (parseInt(i))+')').removeClass('highlight');
		}
	}
	function highlightSelectedRow(tableRowObect){
		var rowIndex_var = tableRowObect.rowIndex;
		var size = $("table#table1 tbody tr").length;
		for( i=0 ; i < (parseInt(size)) ; i++){
			if($('table#table1 tbody tr:eq('+ (parseInt(i))+')').hasClass('highlight'))
					$('table#table1 tbody tr:eq('+ (parseInt(i))+')').removeClass('highlight');
		}
		$('table#table1 tbody tr:eq('+ (rowIndex_var-1)+')').addClass('highlight');
	}
	$(document)
			.ready(

					function() {

						$(".data_row_clone_hide").hide();

						$('.nonMandatory').show();

						$('.tip').tooltip({
							placement : 'right'
						});

						var counter = 0;
						$('#add_event')
								.click(
										function() {
											rowCount++;
											var newElement = $(
													'tr#data_row_clone')
													.clone()
													.attr(
															'id',
															'data_row'
																	+ "_cloned");
											newElement.attr('rowid',"_cloned");

											newElement
													.find(
															'select[name="conditionSetMappingList[n].conditionSet.id"]')
													.attr(
															{
																'id' : 'paramname'
																		+ "_cloned",
																'name' : 'conditionSetMappingList['
																		+ "_cloned"
																		+ '].conditionSet.id',
																'value' : '',

															});



											newElement
													.find(
															'select[name="conditionSetMappingList[n].rule.id"]')
													.attr(
															{
																'id' : 'conditionSetMappingList['
																		+ "_cloned"
																		+ '].rule',

																'name' : 'conditionSetMappingList['
																		+ "_cloned"
																		+ '].rule.id',

																'value' : ''
															});

											newElement
													.find('input#defaultSet_n')
													.attr(
															{
																'id' : 'defaultSet_'
																		+ "_cloned",
																'label' : 'default',
																'name' : 'conditionSetMappingList.defaultSet'

															});

											newElement
											.find('a[id^="up"]')
											.attr(
													{
														'id' : 'up['
																+ "_cloned"
																+']',

													});

											newElement
											.find('a[id^="down"]')
											.attr(
													{
														'id' : 'down['
																+ "_cloned"
																+']',

													});



											newElement
											.find('input[name$=".priority"]')
											.attr(
													{
														'id' : 'conditionSetMappingList['
																+ "_cloned"
																+ '].priority',
														'name' : 'conditionSetMappingList['
															+ "_cloned"
															+ '].priority',
															'value' : "_cloned"
													});


											newElement
													.find(
															':button[name="conditionSetMappingList[n].delete"]')
													.attr(
															{
																'id' : 'deleterow'
																		+ "_cloned",
																'name' : 'conditionSetMappingList['
																		+ "_cloned"
																		+ '].delete',
																'value' : '  -  '

															});




											var consSetCol = newElement.find("td:eq(0)");
											span=$('<br><span id="conditionSetMappingList[_cloned].conditionSet.error" class="text-danger">This field is required</span>');
											consSetCol.append(span);
											consSetCol.find("span").css("display","none");

											var consRuleCol = newElement.find("td:eq(1)");
											span=$('<br><span id="conditionSetMappingList[_cloned].Rule.error" class="text-danger">This field is required</span>');
											consRuleCol.append(span);
											consRuleCol.find("span").hide();

											newElement
													.appendTo('table#table1.table');
											rowMoveListener();
											reSetLink();




										});

						$('body')
								.click(
										function() {

											for (i = 0; i < $(
													"table#table1.table  tr")
													.length; i++) {

												var newElement = $('table#table1.table  tr:eq('
														+ (i + 1) + ')');
												newElement.attr('rowid',i);
												newElement
														.find(
																'select[name$=".conditionSet.id"]')
														.attr(
																{
																	'id' : 'paramname'
																			+ (i),
																	'name' : 'conditionSetMappingList['
																			+ (i)
																			+ '].conditionSet.id'
																});
												newElement
												.find(
														'td:eq(0) span[id$=".conditionSet.error"]')
												.attr(
														{
															'id' : 'conditionSetMappingList['
																+ (i)
																+ '].conditionSet.error',
														});


												newElement
														.find(
																'select[name$=".rule.id"]')
														.attr(
																{
																	'id' : 'conditionSetMappingList['
																			+ (i)
																			+ '].rule',

																	'name' : 'conditionSetMappingList['
																			+ (i)
																			+ '].rule.id'
																});

												newElement
												.find(
														'td:eq(1) span[id$="Rule.error"]')
												.attr(
														{
															'id' : 'conditionSetMappingList['
																	+ (i)
																	+ '].Rule.error',

														});


												newElement
														.find(
																'input[id^="defaultSet"]')
														.attr(
																{
																	'id' : 'defaultSet_'
																			+ (i),
																	'name' : 'conditionSetMappingList.defaultSet'
																});


												newElement
												.find('a[id^="up"]')
												.attr(
														{
															'id' : 'up['
																	+ (i)
																	+']',

														});

												newElement
												.find('a[id^="down"]')
												.attr(
														{
															'id' : 'down['
																	+ (i)
																	+']',

														});




												newElement
												.find('input[name$=".priority"]')
												.attr(
														{
															'id' : 'conditionSetMappingList['
																	+(i)
																	+ '].priority',
															'name' : 'conditionSetMappingList['
																+ (i)
																+ '].priority',
																'value' : i + 1
														});


												newElement
														.find(
																':button[name$=".delete"]')
														.attr(
																{
																	'id' : 'deleterow'
																			+ (i),
																	'name' : 'conditionSetMappingList['
																			+ (i)
																			+ '].delete',
																	'value' : '  -  '

																});

											}
											//reSetLink();
										});
					});





