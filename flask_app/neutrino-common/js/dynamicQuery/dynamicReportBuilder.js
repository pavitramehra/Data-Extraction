/**
 * 
 */

function notifyStatus(message, success) {
	if (showNotifications == "true") {
		new PNotify({
			title : "",
			text : message,
			type : success,
			pnotify_animate_speed : fadeOutduration,
			opacity : 1
		});
	}
}
$(function() {
	//showReportOrChart();

	$("#fromDateFilterId,#toDateFilterId").attr('disabled', 'disabled');

	$("#textarea_autocomplete_field").on(
			"keydown",
			function(ev) {

				var options = $(this).data("smart-autocomplete");
				if (options.resultsContainer
						&& options.resultsContainer.is(':visible')) {
					// up and down arrow
					if (ev.keyCode === 38 || ev.keyCode === 40) {
						// up key
						if(ev.keyCode === 38)
						{var currentElem=$('.smart_autocomplete_container li.smart_autocomplete_highlight');
						if(currentElem!=null)
						$(".smart_autocomplete_container").scrollTo(currentElem.prev()!=null?currentElem.prev():currentElem);}
						//down key
						if(ev.keyCode === 40)
						{var currentElem=$('.smart_autocomplete_container li.smart_autocomplete_highlight');
						$(".smart_autocomplete_container").scrollTo(currentElem);}
						ev.preventDefault();
					}
					if (ev.keyCode === 27) {
						// alert("key down");
						options.resultsContainer.hide();
						ev.preventDefault();
					}
				}

			});

	var default_filter_matcher = function(term, source, context) {
		
		var matcher = new RegExp("^"
				+ term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");

		return $.grep(source, function(value) {

			if (typeof value != "string") {

				return value;
			}

			if (value.charAt(0) == '\,') {
				value = value.substring(1);
			}
			if (value.charAt(0) == '\'') {
				value = value.substring(1);
			}
			return matcher.test(value);
		});

	}

	$("#textarea_autocomplete_field")
			.smartAutoComplete(
					{
						source : getContextPath()
								+ "/app/dynamicQuery/contentAssist/",
						maxResults : 30,
						delay : 200,
						filter : function(term, source) {
							var context = this;
							var options = $(context).data("smart-autocomplete");
							// when source is an array
							if ($.type(source) === "array") {
								// directly map
								var results = default_filter_matcher(term,
										source, context);
								return results;
							}
							// when source is a string
							else if ($.type(source) === "string") {

								var selectedContextID = $("#queryContext")
										.val();

								if (selectedContextID == null
										|| selectedContextID == "") {
									notifyStatusTags(
											"Please select a query context.",
											"failure");

								}

								// treat the string as a URL endpoint
								// pass the query as 'term'
								var full_text = $(
										'#textarea_autocomplete_field').val();
								var cursorPosition = $(
										'#textarea_autocomplete_field').prop(
										"selectionStart");

								var startPos11 = -1;
								// alert(cursorPosition+":"+cur_text);
								for (var i = cursorPosition; i >= 0; i--) {
									// add other possible token separators
									// like ,)
									if (full_text.charAt(i) == ' ') {
										startPos11 = i;
										break;
									}
								}

								var part11 = full_text.substring(0,
										startPos11 + 1);

								var qTerm = full_text.substring(startPos11 + 1);

								var modifiedSource = source
										+ $("#queryContext").val();
								return $
										.Deferred(
												function(dfd) {
													$
															.ajax(
																	{
																		url : modifiedSource,
																		data : {
																			"queryText" : part11,
																			"cursorPosition" : cursorPosition,
																			"queryTerm" : qTerm
																		},
																		dataType : "json"
																	})
															.done(
																	function(
																			data) {
																		dfd
																				.resolve(default_filter_matcher(
																						term,
																						data,
																						context));
																	});
												}).promise();

							}

						}

					});
	$("#textarea_autocomplete_field").bind(
			{

				keyIn : function(ev) {
					var cur_text = ev.smartAutocompleteData.query;
					var cursorPosition = $('#textarea_autocomplete_field')
							.prop("selectionStart");
					var startPos = -1;
					// alert(cursorPosition+":"+cur_text);
					for (var i = cursorPosition; i >= 0; i--) {
						// add other possible token separators like ,)
						if (cur_text.charAt(i) == ' ') {
							startPos = i;
							break;
						}
					}
					// alert(startPos);
					var res = cur_text.substring(startPos + 1, cursorPosition);
					// pass the modified query to default event
					ev.smartAutocompleteData.query = $.trim(res);
				},

				itemSelect : function(ev, selected_item) {
					var options = $(this).smartAutoComplete();
					var cur_text = $(this).val();
					var cursorPosition = $('#textarea_autocomplete_field')
							.prop("selectionStart");
					var startPos = -1;
					// alert(cursorPosition+":"+cur_text);
					for (var i = cursorPosition; i >= 0; i--) {
						// add other possible token separators like ,)
						if (cur_text.charAt(i) == ' ') {
							startPos = i;
							break;
						}
					}

					var part1 = cur_text.substring(0, startPos + 1);
					var part2 = cur_text.substring(cursorPosition);

					// get the text from selected item
					var selected_value = $(selected_item).text();
					var new_val = part1.concat(selected_value).concat(part2);
					$(this).val(new_val);

					// set item selected property
					options.setItemSelected(true);

					// hide results container
					$(this).trigger('lostFocus');

					// prevent default event handler from executing
					ev.preventDefault();
				}
			});

	// other js=======================
	
	

	
	$('body')
	.on(
			"click",
			'#saveQueryButton',
			function() {
				if ($("#staticQueryBuilderCheckbox").is(":checked")) {
					
					 var res = $('#builder').queryBuilder('getSQL', false,false);
					$("#whereClauseStaticBuilder").val(res.sql);
				}
				if ($("#dynamicQueryFormId").valid()) {
					$
							.ajax({
								type : "GET",
								url : getContextPath()
										+ "/app/dynamicQuery/saveQuery",
								data : $("#dynamicQueryFormId")
										.serialize(),
								success : function(hql) {
									$("#hqlContainer").html(hql);
									$(".hql-fs").show();

								},
								error : function() {
									// notify error
									notifyStatus(
											"Server side error in dynamic query processing.",
											"failure");

								}

							});
				} 
				else{
					notifyStatus(
							"Server side error in dynamic query processing.",
							"failure");
				}
			});
	
	$('body')
			.on(
					"click",
					'#showHQLButton',
					function() {

						$(".hql-fs").hide();

						var queryContextId = $("#queryContext").val();
						var queryString = $('#textarea_autocomplete_field')
								.val();

						if ($("#dynamicQueryFormId").valid()) {
							$
									.ajax({
										type : "GET",
										url : getContextPath()
												+ "/app/dynamicQuery/showHQL",
										data : $("#dynamicQueryFormId")
												.serialize(),
										success : function(hql) {
											$("#hqlContainer").html(
													hql.hqlQueryString);
											$(".hql-fs").show();

										},
										error : function() {
											// notify error
											notifyStatus(
													"Server side error in dynamic query processing.",
													"failure");

										}

									});
						} else {
							// notify error
							notifyStatusTags("Please fill required fields.",
									"failure");
						}
					});

	$('body')
			.on(
					"click",
					'#showResultsButton',
					function() {

						$(".hql-fs1").hide();

						if ($("#dynamicQueryFormId").valid()) {
							$
									.ajax({
										type : "GET",
										url : getContextPath()
												+ "/app/dynamicQuery/showResults",
										data : $("#dynamicQueryFormId")
												.serialize(),
										dataType : "json",
										success : function(hql) {
											var ppTable = prettyPrint(hql, {
												// Config
												maxArray : 20, // Set
												// max
												// for
												// array
												// display
												// (default:
												// infinity)
												expanded : true, // Expanded
												// view
												// (boolean)
												// (default:
												// true),
												maxDepth : 3
											// Max member depth
											// (when displaying
											// objects) (default: 3)
											});
											$("#jsonHolder").html(ppTable);
											$(".hql-fs1").show();
										},
										error : function() {
											// notify error
											notifyStatus(
													"Server side error in dynamic query processing.",
													"failure");

										}

									});
						} else {
							// notify error
							notifyStatusTags("Please fill required fields.",
									"failure");
						}
					});

	/*$('body')
	.on(
			"change",
			'#exportType',
			function() {
				showReportOrChart();
			});*/
	/*
	function showReportOrChart(){
		var exportType = $("#exportType").val();
		if(exportType == "GRAPH"){
			$("#reportGenDiv").hide();
			$("#chartConfigDiv").show();
		}
		else{
			$("#reportGenDiv").show();
			$("#chartConfigDiv").hide();
		}
	}*/
	
	// cascade context with other fields

	$('body')
			.on(
					"change",
					'#queryContext,#queryContextDynamicForm',
					function() {

						var isDynamicFormReport = $("#dynamicFormReport").is(
								':checked');

						// clear fields
						$("#jsonHolder").html("");
						$(".hql-fs").hide();
						$(".hql-fs1").hide();
						$('#textarea_autocomplete_field').val("");

						var contextId = $(this).val();
						if (contextId != null && contextId != "") {
							
							 queryContextChanged(contextId,isDynamicFormReport);
						} else {
							// notify error
							$("#selectItems")
									.html('<option value=""></option>');
							$("#selectItems").trigger("chosen:updated");
						}
					});
	
	$('body')
	.on(
			"click",
			'#showReportButton',
			function() {

				if ($("#dynamicQueryFormId").valid()) {
					if ($("#dynamicFormReport").is(":checked")) {
						var submitUrl = getContextPath()
								+ "/app/dynamicQuery/generateReportForDynaForm/";
					} else {
						//check if static builder is on
						if ($("#staticQueryBuilderCheckbox").is(":checked")) {
							
							 var res = $('#builder').queryBuilder('getSQL', false,false);
							$("#whereClauseStaticBuilder").val(res.sql);
							
						}
						var submitUrl = getContextPath()
								+ "/app/dynamicQuery/generateReport/";
					}

					$("#dynamicQueryFormId").attr("action", submitUrl);
					$("#dynamicQueryFormId").submit();
				} else {
					// notify error
					notifyStatusTags("Please fill required fields.",
							"failure");
				}
			});

	$('body')
			.on(
					"click",
					'.smart_autocomplete_container li',
					function() {
						if(!$('#staticQueryBuilderDiv').is(":visible")){
						var options = $("#textarea_autocomplete_field").data(
								"smart-autocomplete");
						var current_selection = $(this).index();
						var result_suggestions = $(options.resultsContainer)
								.children();

						$(options.context).trigger("itemSelect",
								[ result_suggestions[current_selection] ]);
						$("#textarea_autocomplete_field").focus();
						}
					});

	var buttonHeight = "custom-multiselect";
	var buttonWidth = "100%";
	var buttonClass = "btn";
	var showCountAfter = 1;
	var selectAllText = "Select/Deselect All";

	$('.dr_multi_select').multiselect(
			{

				buttonText : function(options, select) {
					if (options.length == 0) {
						return 'None Selected &nbsp;<b class="caret"></b>';
					} else if (options.length > showCountAfter) {
						return options.length
								+ ' Selected &nbsp;<b class="caret"></b>';
					} else {
						var selected = '';
						options.each(function() {
							selected += $(this).text() + ' ,';
						});
						return selected.substr(0, selected.length
								- showCountAfter - 1)
								+ '&nbsp;<b class="caret"></b>';
					}
				},
				buttonClass : buttonClass,
				maxHeight : 200,
				includeSelectAllOption : true,
				selectAllValue : "",
				selectAllText : selectAllText,
				enableFiltering : true,
				filterPlaceholder : 'Search',
				buttonWidth : buttonWidth,
				buttonContainer : '<div class="btn-group reset-m col-sm-12 '
						+ buttonHeight + '" />'
			});

	// For DYANMIC FORMS

	$('body')
			.on(
					"change",
					'#dynamicFormReport',
					function() {

						if ($(this).is(":checked")) {
							$("#nonDynamicFormCriteriaDiv").hide();
							$("#queryContext,#textarea_autocomplete_field")
									.attr('disabled', 'disabled');
							$(
									"#queryContextDynamicForm,#fromDateFilterId,#toDateFilterId")
									.removeAttr('disabled');
							$("#queryContext,#queryContextDynamicForm")
									.trigger("chosen:updated");
							$("#dynamicFormCriteriaDiv").show();
						} else {
							$("#dynamicFormCriteriaDiv").hide();
							$(
									"#queryContextDynamicForm,#fromDateFilterId,#toDateFilterId")
									.attr('disabled', 'disabled');
							$("#queryContext,#textarea_autocomplete_field")
									.removeAttr('disabled');
							$("#queryContext,#queryContextDynamicForm")
									.trigger("chosen:updated");
							$("#nonDynamicFormCriteriaDiv").show();
						}
					});

	// For Job scheduling

	$('body').on(
			"change",
			'#scheduleReportAsJob',
			function() {

				if ($(this).is(":checked")) {
					$("#schedulerForm_div input,#schedulerForm_div select")
							.removeAttr('disabled');
					//these two are inner cascaded
					var valueSelected = $("#job_frequency").val();
					toggleOnFrequency(valueSelected);
					$("#schedulerForm_div select").trigger("chosen:updated");
					$("#schedulerForm_div,#scheduleReportJobButton").show();
					
				} else {
					$("#schedulerForm_div,#scheduleReportJobButton").hide();
					$("#schedulerForm_div input,#schedulerForm_div select")
							.attr('disabled', 'disabled');
					$("#schedulerForm_div select").trigger("chosen:updated");
				}
			});

	$('body').on(
			"change",
			'#job_frequency',
			function() {

				var valueSelected = $(this).val();
				toggleOnFrequency(valueSelected);
			});

	
	
	function toggleOnFrequency(valueSelected){
		
		if (valueSelected == 'MONTHLY') {
			$("#dateOfWeek").attr('disabled', 'disabled');
			$(".job_dateOfWeek").hide();
			$("#dateOfMonth").removeAttr('disabled');
			$(".job_dateOfMonth").show();
			
		} else if (valueSelected == 'WEEKLY') {
			$("#dateOfMonth").attr('disabled', 'disabled');
			$(".job_dateOfMonth").hide();
			$("#dateOfWeek").removeAttr('disabled');
			$(".job_dateOfWeek").show();
			
		} else {
			$("#dateOfMonth,#dateOfWeek").attr('disabled', 'disabled');
			$(".job_dateOfMonth,.job_dateOfWeek").hide();
		}
		
		$("#dateOfMonth,#dateOfWeek").trigger("chosen:updated");
	}
	
	//disable job start date initially
	$("#startDate_job").attr('disabled', 'disabled');
	
	$('body')
	.on(
			"click",
			'#scheduleReportJobButton',
			function() {
				if ($("#dynamicQueryFormId").valid()) {
					if ($("#dynamicFormReport").is(":checked")) {
						var submitUrl = getContextPath()
								+ "/app/dynamicQuery/scheduleReportForDynaForm/";
					} else {
						var submitUrl = getContextPath()
								+ "/app/dynamicQuery/scheduleReportJob/";
					}
					$
					.ajax({
						type : "POST",
						url : submitUrl,
						data : $("#dynamicQueryFormId")
								.serialize(),
						success : function(hql) {
							notifyStatus(
									"Job scheduled successfully.",
									"success");

						},
						error : function() {
							// notify error
							notifyStatus(
									"Server side error in scheduling job.",
									"failure");
						}

					});
				} else {
					// notify error
					notifyStatusTags("Please fill required fields.",
							"failure");
				}
			});
	
	
});

function queryContextChanged(contextId,isDynamicFormReport){
	
	$
	.ajax({
		type : "GET",
		url : getContextPath()
				+ "/app/dynamicQuery/getSelectionList/"
				+ contextId + "/"
				+ isDynamicFormReport,
		data : $("#dynamicQueryFormId")
				.serialize(),
		success : function(listOfTwoMaps) {
			var selectionMap = listOfTwoMaps[0];
			var pushData = "";
			for ( var key in selectionMap) {
				pushData += '<option value="'
						+ key + '">'
						+ selectionMap[key]
						+ '</option>';
			}

			// populate report columns(ALL
			// COLUMNS)
			$("#selectItems").html(pushData);

			$("#countForTokenIds").html(
					pushData);

			// populate group by
			pushData = '<option value="" >Select Option</option>'
					+ pushData;
			$("#groupByTokenId").html(pushData);
			$("#groupByTokenId").trigger(
					"chosen:updated");

			// ============ONLY NUMERIC TYPE
			// COLUMNS
			var numMap = listOfTwoMaps[1];
			var pushNumData = "";
			for ( var key in numMap) {
				pushNumData += '<option value="'
						+ key
						+ '">'
						+ numMap[key]
						+ '</option>';
			}

			// populate sum for columns
			$("#sumForTokens")
					.html(pushNumData);

			// populate avg for columns
			$("#avgForTokens")
					.html(pushNumData);

			// populate percentage for
			// columns
			$("#percentageForTokenIds").html(
					pushNumData);

			$(".dr_multi_select").multiselect(
					'rebuild');

		},
		error : function() {
			// notify error
			notifyStatus(
					"Server side error in fetching selection list.",
					"failure");

		}

	});
	
	
}

/*SCRIPT FOR STATIC BUILDER*/

			$(document)
					.ready(
							function() {
								
								
								$('body')
								.on(
										"mouseenter mouseleave",
										'.smart_autocomplete_container li',
										function() {
											$('.smart_autocomplete_container li').not(this).removeClass("smart_autocomplete_highlight");
										});
								

								$('body')
								.on(
										"click",
										'.smart_autocomplete_container li',
										function() {
											if($('#staticQueryBuilderDiv').is(":visible")){
											var options = $(".static_build_auto_complete_text").data(
													"smart-autocomplete");
											var current_selection = $(this).index();
											var result_suggestions = $(options.resultsContainer)
													.children();

											$(options.context).trigger("itemSelect",
													[ result_suggestions[current_selection] ]);
											$(".static_build_auto_complete_text").focus();
											}
										});


								$('.parse-sql').on(
										'click',
										function() {
											var res = $('#builder').queryBuilder(
													'getSQL',false,false);
											$('#result').removeClass('hide')
													.find('pre').html(res.sql);
										});

								$('body')
										.on(
												"change",
												'#queryContext',

												function() {
													prepareAndShowStaticBuilderForCurrentQueryContext();
												});

								$('body').on(
										"click",
										'.query_builder_selection_btn',

										function() {
											if ($(this).hasClass("simple_q_builder")
													&& !$(this).hasClass("active")) {
												$(this).addClass("active");
												$("#advanced_q_builder").removeClass(
														"active");

												$('#staticQueryBuilderCheckbox').prop(
														'checked', true);
											} else if ($(this).hasClass(
													"advanced_q_builder")
													&& !$(this).hasClass("active")) {
												$(this).addClass("active");
												$("#simple_q_builder").removeClass(
														"active");
												$('#staticQueryBuilderCheckbox').prop(
														'checked', false);
											}
											$('#staticQueryBuilderCheckbox').change();
										});

								// For static/simple builder

								$('body')
										.on(
												"change",
												'#staticQueryBuilderCheckbox',
												function() {

													if ($(this).is(":checked")) {
														$("#dynamicQueryBuilderDiv")
																.hide();
														$(
																"#textarea_autocomplete_field")
																.attr('disabled',
																		'disabled');
														$("#whereClauseStaticBuilder")
																.removeAttr('disabled');
														$("#staticQueryBuilderDiv")
																.show();
														prepareAndShowStaticBuilderForCurrentQueryContext();
													} else {
														$("#staticQueryBuilderDiv")
																.hide();
														$("#whereClauseStaticBuilder")
																.attr('disabled',
																		'disabled');
														$(
																"#textarea_autocomplete_field")
																.removeAttr('disabled');
														$("#dynamicQueryBuilderDiv")
																.show();
													}
												});

								
								
			//for autocomplete
			
								
								
							});
			
			
			function applyAutocomplete(ruleId)
			{
				
				var ruleIdValue=ruleId.id;
				var default_filter_matcher2 = function(term, source, context) {

					return $.grep(source, function(value) {

						return value;
					});

				}
				
				 $('.static_build_auto_complete_text').smartAutoComplete({

				source : getContextPath()
						+ "/app/staticQueryBuilder/contentAssistValues/",
				maxResults : 30,
				delay : 200,
				filter : function(term, source) {
					var context = this;
					var options = $(context).data("smart-autocomplete");
					// when source is an array
					if ($.type(source) === "array") {
						// directly map
						var results = default_filter_matcher(term,
								source, context);
						return results;
					}
					// when source is a string
					else if ($.type(source) === "string") {

						var selectedContextID = $("#queryContext")
								.val();
						 var tokenName=$('#'+ruleIdValue).find(".rule-filter-container").find("select").val();
						var operatorName=$('#'+ruleIdValue).find(".rule-operator-container").find("select").val();
						
						//case of in and not in
						
						var myTerm = term.substr(term.lastIndexOf(",") + 1);
						
						var cursorPosition = "1";

						var qTerm = $.trim(myTerm);
						var modifiedSource = source
						+ $("#queryContext").val();
						
						return $
								.Deferred(
										function(dfd) {
											$
													.ajax(
															{
																url : modifiedSource,
																data : {
																	"queryText" : tokenName,
																	"cursorPosition" : cursorPosition,
																	"queryTerm" : qTerm
																},
																dataType : "json"
															})
													.done(
															function(
																	data) {
																dfd
																		.resolve(default_filter_matcher2(
																				term,
																				data,
																				context));
															});
										}).promise();

					}

				}
					 
					   });
				 
				 
				 $(".static_build_auto_complete_text").bind(
							{
								itemSelect : function(ev, selected_item) {
									var options = $(this).smartAutoComplete();
									var cur_text = $(this).val();

									var prefixBeforeComma = cur_text.substr(0,cur_text.lastIndexOf(",") + 1);
									// get the text from selected item
									var selected_value = $(selected_item).text();
									var new_val = prefixBeforeComma.concat(selected_value);
									$(this).val(new_val);

									// set item selected property
									options.setItemSelected(true);

									// hide results container
									$(this).trigger('lostFocus');

									// prevent default event handler from executing
									ev.preventDefault();
								}
							});
				 
				 
				 $(".static_build_auto_complete_text").on(
							"keydown",
							function(ev) {

								var options = $(this).data("smart-autocomplete");
								if (options.resultsContainer
										&& options.resultsContainer.is(':visible')) {
									// up and down arrow
									if (ev.keyCode === 38 || ev.keyCode === 40) {
										// up key
										if(ev.keyCode === 38)
										{var currentElem=$('.smart_autocomplete_container li.smart_autocomplete_highlight');
										if(currentElem!=null)
										$(".smart_autocomplete_container").scrollTo(currentElem.prev()!=null?currentElem.prev():currentElem);}
										//down key
										if(ev.keyCode === 40)
										{var currentElem=$('.smart_autocomplete_container li.smart_autocomplete_highlight');
										$(".smart_autocomplete_container").scrollTo(currentElem);}
										ev.preventDefault();
									}
									if (ev.keyCode === 27) {
										// alert("key down");
										options.resultsContainer.hide();
										ev.preventDefault();
									}
								}

							});
				 
			}

			function prepareAndShowStaticBuilderForCurrentQueryContext() {

				
				var contextId = $("#queryContext").val();
				var staticBuilderOn = $("#staticQueryBuilderCheckbox").is(":checked");
				if (contextId != null && contextId != "" && staticBuilderOn) {

					$
							.ajax({
								type : "GET",
								url : getContextPath()
										+ "/app/staticQueryBuilder/initializeQueryBuilder/"
										+ contextId,
								datatype : 'json',
								success : function(configObject) {
									$('#builder').queryBuilder('destroy');
									$('#builder').queryBuilder(configObject);
								},
								error : function() {
									// notify error
									notifyStatus(
											"Server side error in initializing static query builder.",
											"failure");

								}
							});
				} else if (!contextId && staticBuilderOn) {

					$('#builder').queryBuilder('destroy');
					$('#builder').queryBuilder({
						sortable : true,

						filters : [ {
							id : 'No Context Selected',
							label : 'No Context Selected',
							type : 'string'
						} ]
					});

					notifyStatus("Please Select a Query Context.", "failure");
				}

			}
			
			
