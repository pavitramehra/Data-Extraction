var firstPageIndexWhileSearching = 0;
var isTextSearched = false;
var lastSearchedString = "";
var keyCount = 0;

function validateNullandSetHiddenValueToEmpty(id){
	idVar='Text_'+id;
	if($("#" + idVar).val()==null || $("#" + idVar).val()==''){
		$('#'+id).val('');
	}
}
var ct=[];
$(document).on('keyup keydown', function(e){shifted = e.shiftKey} );
$(document).on( "keydown", '[id^="colvis_"] .buttons-colvis', function(e) {
	if((e.which == 9 || e.keyCode == 9) && !shifted){
		if($('.dt-button-collection.dropdown-menu li:first-of-type').length!=0){e.preventDefault();$('.dt-button-collection.dropdown-menu li:first-of-type').focus();}
	}
	if (e.which == 13 || e.keyCode == 13) {
		{e.preventDefault();$('.dt-button-collection.dropdown-menu li:first-of-type').focus();}
	}
});
$(document).on( "keyup", '.dt-button-collection.dropdown-menu li:first-of-type', function(e) {
	var el = $('[id^="colvis_"] .buttons-colvis');
	if(event.shiftKey && event.keyCode == 9) {
    ct[ct.length]=1;
    var count=ct.length;
    if(count%2==0){el.focus();}
	}
});
function scrollWin_forDatePicker(elem) {
    var elemntPositionTop=elem.offset().top;
    var scrollPos=$(window).scrollTop();
    var viewportHeight=$(window).height();
    var gapFromBottom = viewportHeight-(elemntPositionTop-scrollPos);
	  var dtPickerHgt=170;
	  var finalScrollPosition=scrollPos+dtPickerHgt;
	  if(gapFromBottom<dtPickerHgt){
		  window.scrollTo(0, finalScrollPosition);
	  }
}
/*JavasScript Code for phone tag verification */

function sendVerCode(current) {
	var currentTagContext = $(current).parents("div.mob_verify_div:first");
	var phoneNumberId = $(currentTagContext).find(".phone_num_id").val();	
	var payload = {};
	if (typeof taskId != 'undefined' && taskId != undefined) {
		payload["taskId"] = taskId;
	}
	
	$.ajax({
		url : getContextPath() + "/app/PhoneNumber/sendVerCode/"
				+ phoneNumberId,
		data : payload,
		type : "POST",
		success : function(jqXHR) {

			notifyStatusTags("Verification Code Sent.Expiration Date:" + jqXHR,
					"success");
			$(currentTagContext).find(".sendVerCodeButton").hide();
			$(currentTagContext).find(".enter_code_div").show();

		},
		error : function(jqXHR) {
			// notify error			
			if (500 == jqXHR.status) {
				notifyStatusTags("Verification Code Not Sent."
						+ jqXHR.statusText, "failure");
			} else {
				notifyStatusTags("Verification Code Not Sent."
						+ jqXHR.responseText, "failure");
			}

		}
	});
}

function submitVerCode(current) {
	var currentTagContext = $(current).parents("div.mob_verify_div:first");
	var phoneNumberId = $(currentTagContext).find(".phone_num_id").val();
	var verCode = $(currentTagContext).find(".verification_code").val();
	var payload = {};
	if (typeof taskId != 'undefined' && taskId != undefined) {
		payload["taskId"] = taskId;
	}
	payload["verCode"] = verCode;
	$.ajax({
		url : getContextPath() + "/app/PhoneNumber/submitVerCode/"
				+ phoneNumberId,
		data : payload,
		type : "POST",
		success : function(jqXHR) {
			$(currentTagContext).find(".mob_verify_div").hide();
			$(currentTagContext).find(".ver_icons").html(
					'<i class="glyphicon glyphicon-ok"></i>')
			notifyStatusTags(jqXHR, "success");
		},
		error : function(jqXHR) {
			// notify error
			if (500 == jqXHR.status) {
				notifyStatusTags("Error in Verification." + jqXHR.statusText,
						"failure");
			} else {
				notifyStatusTags("Error in Matching Verification Code."
						+ jqXHR.responseText, "failure");
			}
		}
	});
}

function notifyStatusTags(message, success) {
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

$(document)
		.ready(
				function() {
					
					  $(document).ajaxComplete(function () {
						  
						  $('body').on('focus', 'input.validateDateFormat',function(){
							  var eleObj=$(this);
							  scrollWin_forDatePicker(eleObj);
						  });
						    $('.date-picker span.input-group-addon').on("click",function(){
						    	var eleObj=$(this);
								  scrollWin_forDatePicker(eleObj);
						  });
				       });  
					  
					
					/*Code to show selecetd value in tooltip in generic-param select*/
					$('body').on('mouseenter mouseleave','.neoSelectTooltip',

							function() {
								var neoSelectid1 = $(this).attr("id");
								var defaultToolTipMsg=$(this).attr("default-title");
								var tooltipmsgForSelected = $("#" + neoSelectid1+" option:selected").text();
							
								if($("#" + neoSelectid1+" option:selected").val())
									{
									tooltipmsgForSelected=tooltipmsgForSelected;
									}
								else
									{
									tooltipmsgForSelected=defaultToolTipMsg;
									}
								 
								
								$(this).attr("data-original-title", tooltipmsgForSelected);
								$(this).tooltip({
									placement : 'right',
									"container" : 'body',
									"viewport": { selector: 'html', padding: 0 }
								}).triggerHandler('mouseover');
							});
					
					/*Code ends here*/
					
					
					/* JavasScript Code for phone tag verification */
					$('body').on( "click keypress", '.verifyPhone', function(e) {
						if(!e.keyCode || e.keyCode==13){
						var currentTag = $(this).parents("div.phone_tag_top:first");
							$(currentTag).parent().children("div.mob_verify_div").toggle();
						}
					});
					$('.phoneValid').attr("readonly",true);
					$('.ph-isd-code').attr("readonly",true);
					$('body').on('change', '.chosen_a,.chosen_b,.chosen-done', function() {
						if($(this).parents('form').length == 1 && $(this).valid() && !$(this).hasClass('cascade_tag')){
							$(this).parents(
							'.form-group').find(
							'span.help-block')
							.remove();
						}
					});

					

					$('body').on("click", '.send_ver_code_btn', function() {

						sendVerCode(this);
					});

					$('body').on("click", '.submit_ver_code_btn', function() {

						submitVerCode(this);
					});

					/* START--Javascript Code for userSelect tag */
					$('body').on(
							'click',
							'.filterForm_reset',
							function() {

								multiselect_deselectAll($(this).parents(
										".userSelectTag_container:first").find(
										".boot_multiselect"));
								$('.userSelectTag_filter .multiselect-search').val('');
							});

					$('body')
							.on(
									'click',
									'.filterForm_submit',
									function() {
										var current = $(this);
										var targetSelect = $(this)
												.parents(
														".userSelectTag_container:first")
												.find(".userSelectElement");
										var targetFilterForm = $(this)
												.parents(
														".userSelectTag_container:first")
												.find(
														".userSelectTag_filter_form select");
										var baseURL = getContextPath()
												+ "/app/userSelect/populateUsers";
										$
												.ajax({
													type : "POST",
													url : baseURL,
													data : $(targetFilterForm)
															.serialize(),
													success : function(userList) {
														var existingText = $(
																targetSelect)
																.find(
																		'option:first[value=""]')
																.text();
														if (existingText == null
																|| existingText == "") {
															existingText = $(
																	targetSelect)
																	.hasClass(
																			"boot-multi_a") ? "Select All Users"
																	: '';
														}

														var firstOption = existingText;

														var pushProduct = '<option value="">'
																+ firstOption
																+ '</option>';
														$
																.each(
																		userList,
																		function(
																				index,
																				element) {
																			pushProduct += '<option value="'
																					+ element["id"]
																					+ '">'
																					+ element["username"]
																					+ '</option>';
																		});

														$(targetSelect).html(
																pushProduct);
														if ($(targetSelect)
																.hasClass(
																		"boot-multi_a")) {
															$(targetSelect)
																	.multiselect(
																			'rebuild');
															showHideCriteria(current);
															$(targetSelect)
																	.next()
																	.find(
																			"button:first")
																	.click();
														} else {
															$(targetSelect)
																	.trigger(
																			"chosen:updated");
															showHideCriteria(current);
														}

													}
												});

									});

					
					/* END--Javascript Code for userSelect tag */

					/* START--Javascript Code for datepicker tag */
					$("[rel=tooltip]").tooltip({
						placement : 'right',
						"container" : 'body',
						"viewport": { selector: 'html', padding: 0 }
					});
					var date_error_msg = label_date_minimum_year_error_msg+" " + minimumYearForDate;
					$.validator.addMethod("validateMinimumYear", function(value,
							element) {
						if (value != "") {
							var currentDateFormat = $(element).parents(
							".datepicker_div:first")
							.data("real-format");
							
							var userSelectedDate = Date.parseString(value,
									currentDateFormat);
							var minimumYear = $(element).parents(
							".datepicker_div:first").data(
							"minimum-year");
							minimumYear = parseInt(minimumYear, 10);
							var enteredYear = parseInt(userSelectedDate.getFullYear(),10);
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
					
					$.validator.addMethod("validateDateFormat", function(value,
							element) {
						if (value != "") {

							var currentDateFormat = $(element).parents(
									".datepicker_div:first")
									.data("real-format");
							var datePickerData=$(element).parents(".datepicker_div:first").data('datepicker');
							if(datePickerData == undefined ){
								setStartDate=new Date();
								setEndDate=new Date();
							}else{
								setStartDate=$(element).parents(".datepicker_div:first").data('datepicker').startDate;
								setEndDate=$(element).parents(".datepicker_div:first").data('datepicker').endDate;
							}
							if(typeof currentDateFormat === undefined ){
								currentDateFormat=$(element).data("real-format");
							}else if(currentDateFormat == "" ){
								currentDateFormat=$(element).data("real-format");
							}else if(currentDateFormat ==null){
								currentDateFormat=$(element).data("real-format");
							}
							
							var isPastDisabled = $(element).parents(
									".datepicker_div:first").data(
									"disable-past");
							var isFutureDisabled = $(element).parents(
									".datepicker_div:first").data(
									"disable-future");
							

							/***************************************************
							 * checking the condition that if date is valid and
							 * its disablePast and disableFuture attribute is
							 * true then adding a validation check that entering
							 * previous and past dates shall return false in
							 * their respective cases
							 **************************************************/

							if (Date.isValid(value, currentDateFormat)) {
								var userSelectedDate = Date.parseString(value,
										currentDateFormat);
								
								

								if (isPastDisabled && isFutureDisabled) {
									return userSelectedDate
											.equalsIgnoreTime(setEndDate);
								}

								if (isPastDisabled) {
									j1=(new Date(userSelectedDate.getTime())).clearTime();
									j2=(new Date(setStartDate.getTime())).clearTime();									
									return (j1.isAfter(j2) || j1.equals(j2));									
								}

								if (isFutureDisabled) {
									j1=(new Date(userSelectedDate.getTime())).clearTime();
									j2=(new Date(setEndDate.getTime())).clearTime();	
									return (j1.isBefore(j2) || j1.equals(j2));
								}
								return true;
							} else {
								return false;
							}

						}

						else {
							return true;
						}

					}, label_invalidDateMessage);

			
					/* Function Call for neutrino:textarea Starts */
					$(document)
							.ready(
									function() {

										$("body")
												.on(
														"input",
														".neutrino_textarea",
														function() {
															
															var idText = $(this)
																	.attr("id");
															var text_max = $(
																	this)
																	.attr(
																			'maxLength');
																			var text_length;
															
															var text=$(this).val();
															text_length =text.replace(/\r(?!\n)|\n(?!\r)/g, "\r\n").length;
																	
															var text_remaining = text_max
																	- text_length;
															if(text_remaining<0)
															{
																$(this).val($(this).val().substring(0,$(this).val().length+text_remaining));
																text_remaining =0;
															}
															$(
																	"#instDesc_count1_"
																			+ replaceSpecialCharactersInId(idText))
																	.html(
																			text_remaining);
														});
									});

					
					/*
					 * Jquery function for setting focus to first form element
					 * starts
					 */

				
					
					setTimeout(function() {

						//focus at username for login
						if($("#username_show").length){
							$('#username_show').focus();
						}
						else{
							var elem = $('form').find(':text:not([readonly="readonly"]):not([disabled="disabled"]):not(:submit):not(:hidden)').filter(':visible:first');
							var firstSelectBox = $('form').find('select:not([readonly="readonly"]):not([disabled="disabled"]):not(:hidden)').filter(':visible:first');
							var firstSearchBox = $('form').find('[type="search"]:not([readonly="readonly"]):not([disabled="disabled"]):not(:submit):not(:hidden)').filter(':visible:first');
                            var firstNeutrinoSelectBox = $('.chosen-container:not(".chosen-disabled")').filter(':visible:first').find('a.chosen-single');

							elem = elem.add(firstNeutrinoSelectBox).add(firstSelectBox).add(firstSearchBox).filter(':first');

							if (elem && ($(elem).is(':reallyvisible')) && $('form').find('select').first().attr("multiple") !="multiple") {
								elem.focus();
							}else if (firstNeutrinoSelectBox.length!=0 && firstSelectBox.length!=0) {
								elem = firstNeutrinoSelectBox.add(firstSelectBox).filter(':first');
								if(elem.length!=0){
								    elem.focus();
								}
							}

						}

					    }, 500);
					/*
					 * Jquery function for setting focus to first form element
					 * ends
					 */

					/* JQUERY CODE FOR CASCADE SELECT TAG -START */
					function updateChosenTag(dd) {
						$(dd).trigger("chosen:updated");
					}

					
					$('.cascade-select .chosen_a.required').on('change', function(evt, params) {
					    $(this).valid();
					  });
					
					$(document)
							.on(
									'change',
									'select.cascade_tag',
									function() {
										/*
										 * FIND CURRENTLY CHANGING COMBO BOX
										 * "ID" AND "VALUE"
										 */
										var parentId = $(this).attr('id');
										var selectedValue = $(this).val();

										/* IF VALUE SELECTED WAS NULL(INVALID) */
										if (!selectedValue) {
											$('select.cascade_tag')
													.each(
															function() {
																var myId = $(
																		this)
																		.attr(
																				'id');
																var myParentId = $(
																		this)
																		.attr(
																				'parentId');
																if (parentId == myParentId) {
																	var invalidText = $(
																			'#'
																					+ myId)
																			.find(
																					'option[value=""]')
																			.text();
																	if (!invalidText) {
																		$(
																				'#'
																						+ myId)
																				.html(
																						null);
																	} else {
																		$(
																				'#'
																						+ myId)
																				.html(
																						'<option value="">'
																								+ invalidText
																								+ '</option>');
																	}

																	updateChosenTag('#'
																			+ myId);
																	$(
																			'#'
																					+ myId)
																			.change();
																}
															});
										}

										/* IF VALUE SELECTED WAS VALID */

										else {
											$('select.cascade_tag')
													.each(
															function() {
																var myId = $(
																		this)
																		.attr(
																				'id');
																var myParentId = $(
																		this)
																		.attr(
																				'parentId');
																if (parentId == myParentId) // ARE
																// YOU
																// MY
																// CHILD?
																{
																	var ajaxUrl = $(
																			this)
																			.attr(
																					"popurl");
																	var child = '#'
																			+ myId;
																	pullData(
																			child,
																			selectedValue,
																			ajaxUrl);

																}
															});
										}

									});

					function pullData(child, parentValue, ajaxUrl) {
						
						var childValue = $(child).val();
						$
								.ajax({
									type : "GET",
									url : ajaxUrl + "/" + parentValue,
									dataType : 'json',
									success : function(data) {
										var invalidText = $(child).find(
												'option[value=""]').text();
										var defaultText = !invalidText ? ''
												: invalidText;
										var mapLength = 0;
										
											var selectId=child.replace("#","");
											selectId=escapeSpecialCharactersInId(selectId);
											initPaginationData(data,selectId,childValue);
									},
									error : function() {
										$.sticky(label_cascade_select_error, {
											autoclose : 5000,
											position : "top-right",
											type : "st-error"
										});
									}
								});
					}
					multiselect.init();
					
					jQuery('body').on('click', 'input[id^=multi_search_deselect]',function(){
						 var id= jQuery(jQuery(jQuery(this).parents('div')).parents('div')).attr('id');
						 jQuery('#'+id + ' > .ms-selection > input[id^=multi_search_deselect]').quicksearch('#'+id+' .ms-selection li.ms-selected');	
					});
					
					jQuery('input[type="radio"].uni_style, input[type="checkbox"].uni_style').uniform();

				});
/* JQUERY CODE FOR CASCADE SELECT TAG -END */

/* JS Call for multiselectBox Starts */
multiselect = {
	init : function() {
		$(".userSelectTag_container:first").find(".userSelect_selectedUsers")
				.tooltip();
		var disable = $("select.searchable-form").attr('disabled');
		if (disable != 'undefined' && disable == 'disabled') {

			$('.searchable-form')
					.each(
							function(index) {
								$(this)
										.multiSelect(
												{
													selectableHeader : '<input  class="form-control " type="text" id="multi_search'
															+ index
															+ '"'
															+ ' autocomplete="off" placeholder="search" disabled="disabled" /><a href="javascript:void(0)" id="sForm_select" class="btn sForm_select" disabled="disabled">Select All</a>',
													selectionHeader : '<input  class="form-control " type="text" id="multi_search_deselect'
															+ index
															+ '"'
															+ 'autocomplete="off" placeholder="search" disabled="disabled" /><a href="javascript:void(0)" id="sForm_deselect" class="btn sForm_deselect" disabled="disabled">Deselect All</a>',
													afterSelect: function(values){
																if(this.$element.parents('.form-group').hasClass('error'))
																	this.$element.valid();
													},	
													afterDeselect: function(values){
														if(this.$element.val() == null || this.$element.val().length == 0)
															this.$element.valid();
													}
												});
							});

		} else {
			$('.searchable-form')
					.each(
							function(index) {

								$(this)
										.multiSelect(
												{
													selectableHeader : '<input  class="form-control " type="text" id="multi_search'
															+ index
															+ '"'
															+ 'autocomplete="off" placeholder="search" /><a href="javascript:void(0)" id="sForm_select" class="btn sForm_select">Select All</a>',
													selectionHeader : '<input  class="form-control " type="text" id="multi_search_deselect'
															+ index
															+ '"'
															+ 'autocomplete="off" placeholder="search" /><a href="javascript:void(0)" id="sForm_deselect" class="btn sForm_deselect">Deselect All</a>',
													afterSelect: function(values){
																if(this.$element.parents('.form-group').hasClass('error'))
																	this.$element.valid();
													},	
													afterDeselect: function(values){
																if(this.$element.val() == null || this.$element.val().length == 0)
																	this.$element.valid();
													}

												});

							})

		}

		var searchable_form_count = 0;
		$('select')
				.each(
						function(index) {

							/*
							 * deselect_all: function () { var c = this;
							 * c.find("option:not(option[value=''])").each(function () {
							 * c.multiSelect("deselect", a(this).val(),
							 * "deselect_all") }) }
							 */
							var chck = $(this).attr('multiple');

							// Fetch the ViewMode attribute of
							// MultiselectBox.tag
							var viewMode = $(this).parents().find(
									'.searchable-form').attr('disabled');

							if (chck == 'multiple') {
								var multiId = $(this).attr('id');
								$('input#multi_search' + searchable_form_count).unbind('focus');
								$('input#multi_search' + searchable_form_count).on('focus',function(){
									$(this).quicksearch('#ms-' + multiId + ' .ms-selectable li:not(.ms-selected)');});
								
								
								$('#multi_search_deselect' + searchable_form_count).unbind('focus');
								$('#multi_search_deselect' + searchable_form_count++).on('focus',function(){
									$(this).off('keyup');
									$(this).quicksearch('#ms-'+ multiId + ' .ms-selection li.ms-selected');})
								
							

							}

							// Enable 'select-all' and 'deselect-all' only if
							// viewMode is false
							if (!(viewMode)) {
								$('.sForm_deselect')
										.on(
												'click',
												function() {
													$(this)
															.parents(
																	'.form-group')
															.find(
																	'.searchable-form')
															.multiSelect(
																	'deselect_all');
													return false;
												});

								$('.sForm_select').on(
										'click',
										function() {
											$(this).parents('.form-group')
													.find('.searchable-form')
													.multiSelect('select_all');
											return false;
										});
							}
						

						});
	}
};

function multiselect_deselectAll($el) {
	$('option', $el).each(function(element) {
		$el.multiselect('deselect', $(this).val());
	});

}

function showHideCriteria(current) {

	$(current).parents(".userSelectTag_container:first").find(
			".userSelectTag_filter").toggle();
	$(current).parents(".userSelectTag_container:first").find(
			".userSelect_selectedUsers").hide();

}

function showSelectedUsers(current) {
	var str = "";
	var count = 1;
	var id = $(current).attr("multiUserSelectElementId");
	
	$(current).parents(".userSelectTag_container:first").find(
			".userSelect_selectedUsers").empty();
	$(current).parents(".userSelectTag_container:first").find(
			".userSelectTag_filter").hide();
	str = str + "<table><tr>";
	$(current)
			.parents(".userSelectTag_container:first")
			.find("#"+id+" option:selected")
			.each(
					function() {

						if ($(this).text() != "Select All Users") {
							str = str
									+ "<td><i class='glyphicon glyphicon-user'></i><span class='label label-info'>"
									+ $(this).text() + "</span></td>";
							if (count % 3 == 0) {
								str = str + "</tr><tr>";
							}
						}
						count++;
					});
	str = str + "</tr></table>";
	$(current).parents(".userSelectTag_container:first").find(
			".userSelect_selectedUsers").append(str);
	$(current).parents(".userSelectTag_container:first").find(
			".userSelect_selectedUsers").css('background-color', '');
	$(current).parents(".userSelectTag_container:first").find(
			".userSelect_selectedUsers").toggle();

}

/* JS Call for multiselectBox Ends */

/* ======================================================= */
/* CODE FOR TAT-TIMER TAG */
/* ======================================================= */

// use of global variables in not a good practice.so use a context map to
// seprate out the contexts
// useful if two instances of timer are required on same page.
var GLOBAL = {};

$(document)
		.ready(
				function() {
					$('.tatTimer_container')
							.each(
									function() {
										var currentContextKey = $(this).data(
												"context-key");
										GLOBAL[currentContextKey] = {};
										GLOBAL[currentContextKey].tagAttributes = {};
										var timerDisabled = $(this).data(
												"timer-disabled");
										var configurationUrl = $(this).data(
												"config-url");
										var configurationJson = $(this).data(
												"config-json");
										GLOBAL[currentContextKey].tagAttributes["labelMessage"] = $(
												this).data("label-message");
										GLOBAL[currentContextKey].tagAttributes["labelMessageForExpired"] = $(
												this).data(
												"label-message-expired");
										var makeSticky = $(this).data(
												"make-sticky");
										GLOBAL[currentContextKey].tagAttributes["taskDueDateDisplayDivId"] = $(
												this).data("date-divid");

										GLOBAL[currentContextKey].tagAttributes["targetHandlerTimer"] = $(
												this).find(
												".tatTimer_handlerTimer");
										GLOBAL[currentContextKey].tagAttributes["targetMainTimer"] = $(
												this).find(
												".tatTimer_mainTimer");
										GLOBAL[currentContextKey].tagAttributes["dateLabel"] = $(
												this).data("date-label");

										if (!timerDisabled
												&& (configurationUrl != null || configurationUrl != "")) {
											stratTatCountDownTimer(
													configurationUrl,
													currentContextKey);
										} else if (!timerDisabled
												&& (configurationJson != null)) {
											configureAndStartTimer(
													configurationJson,
													currentContextKey);
										}

										// Make timer sticky on scroll if
										// required.
										/*
										 * if(makeSticky==true){
										 * 
										 * try{
										 * $(GLOBAL[currentContextKey].tagAttributes["targetMainTimer"]).stick({
										 * offset: 10, onStick: function () {
										 * $(GLOBAL[currentContextKey].tagAttributes["targetMainTimer"]).addClass('timer_sticked');},
										 * onUnstick: function ()
										 * {$(GLOBAL[currentContextKey].tagAttributes["targetMainTimer"]).removeClass('timer_sticked');}
										 * }); }catch(err) { //No Need To
										 * handle.This is to ensure that
										 * application runs smoothly. }}
										 */
									});
					
					$("body").on("click",".role button,.teams button ",
							function() {
										
										var length=$(this).siblings().find("ul").find("li").length;
										if(length==1){
											populateData(this);
										}
					});

				});

function stratTatCountDownTimer(configurationUrl, currentContextKey) {
	$.ajax({
		type : "GET",
		url : getContextPath() + configurationUrl,
		dataType : 'json',
		success : function(data) {
			configureAndStartTimer(data, currentContextKey);
		}

	});

}

function configureAndStartTimer(data, currentContextKey) {
	GLOBAL[currentContextKey].timerColors = data["lifeCycleColorCodes"];
	var greenPercentage = data["lifeCyclePhasePercentages"][0];
	var warningPercentage = data["lifeCyclePhasePercentages"][1];
	GLOBAL[currentContextKey].totalResponseTime = data["taskTotalTime"] / 1000;
	GLOBAL[currentContextKey].greenEnd = GLOBAL[currentContextKey].totalResponseTime
			- (GLOBAL[currentContextKey].totalResponseTime * greenPercentage / 100);
	GLOBAL[currentContextKey].yellowEnd = GLOBAL[currentContextKey].greenEnd
			- (GLOBAL[currentContextKey].totalResponseTime * warningPercentage / 100);

	GLOBAL[currentContextKey].timerPlayer = data["playPausePoints"];
	GLOBAL[currentContextKey].running = data["running"];
	GLOBAL[currentContextKey].PLAYER_INDEX = 1;
	GLOBAL[currentContextKey].currentTimerColor = "#FFFFFF";

	var INITIAL_VALUE_SECS = data["taskRemainingTime"] / 1000;
	var initialValue = data["taskRemainingTime"];

	var currentContext = GLOBAL[currentContextKey];
	assignColorToTimer(INITIAL_VALUE_SECS, currentContext);
		var description;
		var initialDigit = initialValue/3600000;
		var fixedValue = initialDigit.toFixed();
			if(fixedValue.length ==4){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;';
			}
			if(fixedValue.length ==3){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			}
			if(fixedValue.length ==2 || fixedValue.length ==1){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			}
	if (initialValue >= 0) {
		var options = {
			until : new Date(new Date().valueOf() + initialValue),
			format:'HMS',
			layout : '<span class="rem_time">'
					+ currentContext.tagAttributes["labelMessage"]
					+ '&nbsp;:&nbsp;</span><span class="tat_time">{hnn}{sep}{mnn}{sep}{snn}</span><p class="reset-m-b m-t-8"><span class="tat_desc_up">{desc}</span></p>',
			description : description,
			onExpiry : countDownExpired,
			onTick : handleTimerColor,
			alwaysExpire : true
		};
	} else {
		$(".hideOnTatNegative").hide();
		$(".showOnTatNegative").show();
		if(fixedValue.startsWith("-")){
			if(fixedValue.length ==5){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;';
			}
			if(fixedValue.length ==4){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			}
			if(fixedValue.length ==3 || fixedValue.length ==2){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			}
		}else{
			if(fixedValue.length ==4){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;';
			}
			if(fixedValue.length ==3){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			}
			if(fixedValue.length ==2 || fixedValue.length ==1){
				description = 'HH&nbsp;&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			}
		}
		$(currentContext.tagAttributes["targetMainTimer"]).css(
				'color', currentContext.timerColors[3]);
		var options = {
			since : new Date(new Date().valueOf() + initialValue),
			format:'HMS',
			layout : '<span class="rem_time">'
					+ currentContext.tagAttributes["labelMessageForExpired"]
					+ '&nbsp;:&nbsp;</span><span class="tat_time">{hnn}{sep}{mnn}{sep}{snn}</span><p class="reset-m-b m-t-8"><span class="tat_desc_up">{desc}</span></p>',
			description : description
		};
	}
	$(currentContext.tagAttributes["targetMainTimer"]).countdown(options);

	if (!currentContext.running) {

		$(currentContext.tagAttributes["targetMainTimer"]).countdown("pause");
		$(currentContext.tagAttributes["targetMainTimer"]).css('color',
				currentContext.timerColors[4]);
	}
	startTimerHandler(currentContext);

	// just to show due date of task--->extra feature.
	if (currentContext.tagAttributes["taskDueDateDisplayDivId"] != "") {
		var dueDateDisplay = '<span id="due_date_user_label"><strong>'
				+ currentContext.tagAttributes["dateLabel"]
				+ ':</strong><small>' + data["taskDueDate"] + '</small></span>';
		$("#" + currentContext.tagAttributes["taskDueDateDisplayDivId"]).html(
				dueDateDisplay);
	}
}

function handleTimerColor(periods) {
	var currentContextKey = $(this).data("context-key");
	assignColorToTimer($.countdown.periodsToSeconds(periods),
			GLOBAL[currentContextKey]);
}

function assignColorToTimer(timerSeconds, currentContext) {

	if (timerSeconds <= currentContext.totalResponseTime
			&& timerSeconds >= (currentContext.greenEnd + 1)) {
		if (currentContext.currentTimerColor != currentContext.timerColors[0]) {

			currentContext.currentTimerColor = currentContext.timerColors[0];
			$(currentContext.tagAttributes["targetMainTimer"]).css(
					'color', currentContext.timerColors[0]);
		}
	}

	if (timerSeconds <= currentContext.greenEnd
			&& timerSeconds >= (currentContext.yellowEnd + 1)) {

		if (currentContext.currentTimerColor != currentContext.timerColors[1]) {
			currentContext.currentTimerColor != currentContext.timerColors[1]
			$(currentContext.tagAttributes["targetMainTimer"]).css(
					'color', currentContext.timerColors[1]);
		}
	}

	if (timerSeconds <= currentContext.yellowEnd && timerSeconds >= 0) {

		if (currentContext.currentTimerColor != currentContext.timerColors[2]) {
			currentContext.currentTimerColor != currentContext.timerColors[2]
			$(currentContext.tagAttributes["targetMainTimer"]).css(
					'color', currentContext.timerColors[2]);
		}
	}

}

/* If countdown timer expires take expire actions and restart in countup mode */

function countDownExpired() {
	$(".hideOnTatNegative").hide();
	$(".showOnTatNegative").show();

	var currentElementId = $(this).attr("id");
	var currentContextKey = $(this).data("context-key");
	$(this).css('color', GLOBAL[currentContextKey].timerColors[3]);
	var options = {
		since : new Date(),
		format:'HMS',
		layout : '<span class="rem_time">'
				+ GLOBAL[currentContextKey].tagAttributes["labelMessageForExpired"]
				+ '&nbsp;:&nbsp;</span><span class="tat_time">{hnn}{sep}{mnn}{sep}{snn}</span><p class="reset-m-b m-t-8"><span class="tat_desc_up">{desc}</span></p>',
		onExpiry : null,
		onTick : null,
		alwaysExpire : false
	};
	$("#" + currentElementId).countdown('option', options);

}

function startTimerHandler(currentContext) {

	$(currentContext.tagAttributes["targetHandlerTimer"])
			.countdown(
					{

						until : new Date(currentContext.timerPlayer[0]),
						layout : '<span class="tat_time">TAT:&nbsp;{hnn}{sep}{mnn}{sep}{snn}</span><p class="reset-m-b m-t-8"><span class="tat_desc_up">{desc}</span></p>',
						onExpiry : play,
						alwaysExpire : true

					});

}

function play() {
	var currentContextKey = $(this).data("context-key");
	var currentContext = GLOBAL[currentContextKey];
	if (currentContext.running) {
		$(currentContext.tagAttributes["targetMainTimer"]).css('color',
				currentContext.timerColors[4]); // apply grey shade
		$(currentContext.tagAttributes["targetMainTimer"]).countdown('pause');
		currentContext.running = false;
	} else {
		$(currentContext.tagAttributes["targetMainTimer"]).css('color',
				"#000000"); // remove gray shade
		$(currentContext.tagAttributes["targetMainTimer"]).countdown('resume');
		currentContext.running = true;
	}
	if (currentContext.timerPlayer.length > currentContext.PLAYER_INDEX) {
		// update player handler to start counting till next play/pause point.
		$(currentContext.tagAttributes["targetHandlerTimer"])
				.countdown(
						'option',
						'until',
						new Date(
								currentContext.timerPlayer[currentContext.PLAYER_INDEX]));
		currentContext.PLAYER_INDEX = currentContext.PLAYER_INDEX + 1;
	}

}

// JS for money tag

function formatCurrency(orgId, isLabel,acceptNegative) {
	if (isLabel) {
		formMoneyLabelValue(orgId);
	} else {
		formMoneyValue(orgId);
	}
	var moneyVal = $("#hid_" + orgId).val();
	if (moneyVal) {
		neutrinoMoneyUtil.formatteNumber({amount:moneyVal,roundNumber:true},
		function(formattedAmount){
			if (isLabel) {
				$("#" + orgId).val(formattedAmount);
				formMoneyLabelValue(orgId);
			} else {
				$("#amount_" + orgId).val(formattedAmount);
				$("#" + orgId + "-control-group").removeClass("success");
				formMoneyValue(orgId);
			}
			$("#hid_" + orgId).change();
			$("#amount_" + orgId).focusin().focusout();
		});
	}

}

function formMoneyValue(orgId) {
	var amountVal = $("#amount_" + orgId).val();
	var currVal = $("#listMoney_" + orgId + " option:selected").data("code");
	if (amountVal != "" && currVal != "") {
		var moneyVal = currVal + "~" + amountVal;
		$("#hid_" + orgId).val(moneyVal);
	} else {
		$("#hid_" + orgId).val("");
	}
}
function formMoneyLabelValue(orgId) {
	var amountVal = $("#" + orgId).val();
	var currVal = $("#amountCurrency_" + orgId).val();
	if (amountVal != "" && currVal != "") {
		var moneyVal = currVal + "~" + amountVal;
		$("#hid_" + orgId).val(moneyVal);
	} else {
		$("#hid_" + orgId).val("");
	}
}


// code added after implementing autocomplete for branch and business partners
// in user select tag
function callMe(current) {

	var targetSelect = $(current).parents(".uscri_businessPartner:first").find(
			"select");

	if ($(current).is(":checked")) {
		targetSelect.multiselect('select', $(current).val());
	} else {
		targetSelect.multiselect('deselect', $(current).val());
	}
	targetSelect.multiselect('updateButtonText');
	$(current).parents(".uscri_businessPartner:first").find(
			"input.multiselect-search").val("");

}

$(document)
		.ready(
				function() {

					var filterPlaceholder = 'Type to serach'
					$('body').on("click",
							".uscri_businessPartner .multiselect-container",
							function(event) {
								event.stopPropagation();
							});
					$('.uscri_businessPartner .multiselect-container')
							.prepend(
									'<div class="input-group" style="padding:3px;"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input  class="form-control multiselect-search" type="text" placeholder="'
											+ filterPlaceholder + '"></div>');

					$("body")
							.on(
									'click',
									".uscri_businessPartner .multiselect-search",
									function(event) {
										event.stopPropagation();
									})
							.on(
									"keyup",
									".orgBranch .multiselect-search,.bPartner .multiselect-search",
									function() {

										var targetSelect = $(this).parents(
												".uscri_businessPartner:first")
												.find("select");
										var queryTerm = $(this).val();
										var ulElement = $(this).parents(
												".multiselect-container:first")
												.find("ul");

										var targetURL = getContextPath()
												+ "/app/userSelect/getBusinessParters";

										if ($(this).parents(
												".uscri_businessPartner:first")
												.hasClass("orgBranch")) {

											targetURL = getContextPath()
													+ "/app/userSelect/getBranches"

										}

										if (queryTerm.length > 0) {

											$
													.ajax({
														type : "GET",
														data : {queryTerm:queryTerm},
														url : targetURL,
														success : function(data) {

															var pushLiElements = '';
															var pushData = '';
															for (key in data) {
																pushLiElements += '<li><a href="javascript:void(0);" style="padding: 0px;"><label style="margin:0;padding:3px 20px 3px 20px;height:100%;cursor:pointer;"><input onChange="callMe(this)" data-original-title="" value="'
																		+ key
																		+ '" style="margin-bottom:5px;" type="checkbox">'
																		+ data[key]
																		+ '</label></a></li>';

																pushData += '<option   value="'
																		+ key
																		+ '">'
																		+ data[key]
																		+ '</option>';
															}
															targetSelect
																	.html(pushData);
															ulElement.empty();
															ulElement
																	.append(pushLiElements);

															targetSelect
																	.multiselect('updateButtonText');
														},
														error : function(j) {
															new PNotify({
																		title : failure,
																		text : "Error retrieving business partners",
																		type : error,
																		pnotify_animate_speed : fadeOutduration,
																		opacity : .8
																	});
														}
													});

										}

									});

				});

function getFormattedDate(dateValue,currentDateFormat){

    var date = Date.parseString(dateValue,currentDateFormat);
    return date;
}


function appendOption(selectId,pg_itmVal,pg_itmLabel,pg_itmCode,isSelected,back)
{
	var selectElement=getSelectElementObjById(selectId);
    if(back!=null)
    {
    	if(isSelected==true)
		{
			$(selectElement).prepend($('<option>', {value:decodeHtml(pg_itmVal), text:decodeHtml(pg_itmLabel),'data-code':decodeHtml(pg_itmCode),'selected':'selected'}));
		
		}
		else{
			$(selectElement).prepend($('<option>', {value:decodeHtml(pg_itmVal), text:decodeHtml(pg_itmLabel),'data-code':decodeHtml(pg_itmCode)}));
		}
		return;
    }
	if(isSelected==true)
	{
		$(selectElement).append($('<option>', {value:decodeHtml(pg_itmVal), text:decodeHtml(pg_itmLabel),'data-code':decodeHtml(pg_itmCode),'selected':'selected'}));
		
	}
	else{
		$(selectElement).append($('<option>', {value:decodeHtml(pg_itmVal), text:decodeHtml(pg_itmLabel),'data-code':decodeHtml(pg_itmCode)}));
	}
	
}
function getElIdWithoutSplChar(selectId)
{  
    var modifiedId=$("#"+selectId).data("idWithOutSplChar");
	if(modifiedId==undefined)
	{
		modifiedId=replaceSplCharWithUndrScor(selectId);
	}
	return modifiedId;
}
function selectOptionByValue(selectId,value)
{
	var selectElement=getSelectElementObjById(selectId);
	$(selectElement).val(value);
	$(selectElement).trigger("chosen:updated");
}
function getSelectElementObjById(selectId)
{
	if(typeof selectId=="string")
	{
		return $("#"+selectId);
	}
	else
	{
		return selectId;
	}
}

function decodeHtml(str) {
	if(typeof(str)!="string")
	{
		return str;
	}
    var map = {"gt":">" /* , … */};
    if(str != undefined && str != null){
	    return str.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
	        if ($1[0] === "#") {
	            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
	        } else {
	            return map.hasOwnProperty($1) ? map[$1] : $0;
	        }
	    });
    }
}

function initPagination(selectId,pageSize,selectedValueIndex)
{
	return;
}
function initPaginationData(data,selectId,childValue)
{
	/*Initialize pagination data which is to be set as options is to be set in JS arrays pg_itmVal_(array of values),pg_itmCode_(array of codes)pg_,itmLabel_(array of itm labels)
	 And options are to be generated at search or pagination(NEXT,PREV)
	 PDDEV-7031
	 */
	 var pg_itmVal=[];
	 var pg_itmCode=[];
	 var pg_itmLabel=[];
	if($.isArray(data))
	{
		var otherKeyName;
		for(key in data[0]){
			if(key!="id"){
					otherKeyName=key;
			}
		}
		for(var i=0; i<data.length; i++){
			pg_itmVal[i]=data[i]['id'];
			pg_itmCode[i]="";
			pg_itmLabel[i]=data[i][otherKeyName];
		}
	}
	else if(data!=null)
	{
		var i=0;
		for ( var key in data) {
			pg_itmVal[i]=key;
			pg_itmCode[i]="";
			pg_itmLabel[i]=data[key];
			i++;
		}
	}
	var selectedIndex=-1;
	if(childValue!==undefined)
	{
			selectedIndex=pg_itmVal.indexOf(childValue);
	}
	$("#"+selectId).find("option").remove();
	$('#'+selectId).append("<option value='' selected='selected'></option>");
	for(var i=0;i<pg_itmVal.length;i++)
	{
		appendOption($("#"+selectId),pg_itmVal[i],pg_itmLabel[i],pg_itmCode[i],i==selectedIndex);
	}
	$("#"+selectId).trigger("chosen:updated");
	if($("#"+selectId).val()){
		$("#"+selectId).change();
	}
}

function replaceSpecialCharactersInId( id ) {
	if(id!=undefined && id!=null ){
		return  id.replace( /(:|\.|\[|\]|,|=)/g, "\\$1" );
	}
 
}
function escapeSpecialCharactersInId( id ) {
	if(id!=undefined && id!=null ){
		return  id.replace( /(:|\.|\[|\]|,|=)/g, "\\$1" );
	}
	else
	{
		return id;
	}
 
}
function replaceSpaceToUnderscore( id ) {
	if(id!=undefined && id!=null ){
		return  id.replace(/[\s]+/g,"_");
	}
	else
	{
		return id;
	}
 
}
function replaceSplCharWithUndrScor(id)
{
	if(id!=undefined && id!=null )
	{ 
		return id.replace(/[^\w]/g, '_');
	}
}

function initializeSelectElement(id){
	
	$('p.text-danger').css("font-size", "15px");
	$('.chosen-results').attr('tabindex',-1);
	enableToolTipForSelect(id);
	
}	
function enableToolTipForSelect(id){

	if(id!=='undefined'){
		var tooltipmsg = $("#" + id).attr("data-original-title");
		$("#" + id + "_chosen").attr("data-original-title", tooltipmsg);
		$("#" + id + "_chosen").tooltip({
			placement : 'right',
			"container" : 'body',
			"viewport": { selector: 'html', padding: 0 }
		});
	}
		
}

function applyDateFunction(id){
										
										var current=$(id);
										var currentFormat = current.data("real-format");
										var formattedDefDate=null;
										var defDateSelected=current.find('input').attr('defdate');
										if(defDateSelected!=null){
											formattedDefDate=getFormattedDate(defDateSelected,currentFormat);
										}
										if(formattedDefDate==null){
                                            formattedDefDate = new Date();
										}
										var startDate1 = current
												.data("disable-past") == true ? new Date(formattedDefDate)
												: null;
										var endDate1 = current
												.data("disable-future") == true ? new Date(formattedDefDate)
												: null;
                                                if(startDate1!=null){
													startDate1.setHours(5,30);
												}

												if(endDate1!=null){
													endDate1.setHours(5,30);
												}
												
										if (current.data("past-date") == true) {
											var openInPast = new Date(formattedDefDate);
											openInPast.add('y', -30);

											current.data({
												date : openInPast
											});
										}
										if (current.data("open-window-before") != "")

										{
											var years = current
													.data("open-window-before");
											var openInPast = new Date(formattedDefDate);
											openInPast.add('y', -(years));

											current.data({
												date : openInPast
											});
										}

										if (current.data("open-window-after") != "")

										{
											var years = current
													.data("open-window-after");
											var openInFuture =new Date(formattedDefDate);
											openInFuture.add('y', years);

											current.data({
												date : openInFuture
											});
										}
										
										if (!current.data("block-calander")) {
											current.datepicker({
												autoclose : true,
												startDate : startDate1,
												endDate : endDate1,
												forceParse : false
											});
											current.datepicker('setStartDate',
													startDate1);
											current.datepicker('setEndDate',
													endDate1);
										}

}

function applyTimeFunction(element) {

						if (!$(element).attr('readonly')) {
							if ($(element).val() != "") {
								var data = $(element).val();
								if(data!=null){
									data=data.trim();
									$(element).val(data);
								}
								$(element).timepicker({
									minuteStep : 1,
									disableFocus : true,
									// showInputs: false,
									defaultTime : $(element).val()
								});
							}

							else {
								$(element).timepicker({
									minuteStep : 1,
									// showInputs: false,
									disableFocus : true
								});
								$(element).val("");
							}
						}

					}

function applyChosenConfig_a(element){
	var chosenOptions=$(element).data("neutrino-chosen-options");
	if(chosenOptions==null)
	{
		chosenOptions={};
	}
	chosenOptions['allow_single_deselect']=true;
	$(element).chosen(chosenOptions);
}

function applyNeutrinoDateFunc(element) {
	   $(element).datepicker({
			format : defaultUserDateFormat
	   });
	   $('.neutrinoDate').change(function() {
			$(element).datepicker('hide');
		});
}

function applyPrimaryNavLi(element) {
	$(element).find("div:first").hide();
}

function applyUniformFunction(element) {
	// $(element).uniform();
	if($(element).parents('.checker').length<=0){
		var s = $(element).attr("id");
		jQuery('div:not(.checker) [id*='+s+'].uni_style').uniform();
	}
}

function applyInputMask(element) {

	if($(element).hasClass('ipaddress') || $(element).hasClass('ipAddress')){
		$(element).inputmask({"alias": "ip"});
		return;
	}
	var dataMaskAttribute = $(element).attr('data-mask');
	if (dataMaskAttribute == '' || !dataMaskAttribute) {
		$(element).removeAttr('data-mask');
		$(element).removeClass('inputmask');
	} else {
		$(element).inputmask({
			mask : $(element).attr('data-mask')
		});
	}
}

function configTextArea(element) {
	
	var idText = $(element).attr("id");
	var text_max = $(element).attr('maxLength');
	var text_length = $(element).val().length;
	var text_remaining = text_max - text_length;
	$("#instDesc_count1_" + idText).html(text_remaining);

}

function applyValidEmailConfig(element) {

	                var email = $(element).val();
					var id = $(element).attr("id");
					if (email) {
						$.ajax({
									url : getContextPath()
											+ "/app/emailApproval/validateEmailAddress",
									type : 'POST',
									async : true,
									data : ({
										emailAddress : email
									}),
									success : function(output) {
										if (output == 'success') {
											$("#serverValidationDiv-" + id)
													.addClass('hide');
											$("#serverValidationDiv-" + id)
													.removeClass("error");
											$("#serverValidationDiv-" + id)
													.find('p').removeClass(
															'text-danger');
											$("#" + id).removeClass(
													"invalidEmail");
										} else {
											$("#serverValidationDiv-" + id)
													.removeClass('hide');
											$("#serverValidationDiv-" + id)
													.addClass("error");
											$("#" + id)
													.addClass("invalidEmail");
											$("#serverValidationDiv-" + id)
													.find('p').addClass(
															'text-danger');
											$("#serverValidationDiv-" + id)
													.find('p').html(
															'Invalid Email Id');
										}
									},
									error : function(jqXHR, textStatus,
											errorThrown) {
										$("#serverValidationDiv-" + id)
												.removeClass('hide');
										$("#serverValidationDiv-" + id)
												.addClass("error");
										$("#" + id).addClass("invalidEmail");
										$("#serverValidationDiv-" + id).find(
												'p').addClass('text-danger');
										$("#serverValidationDiv-" + id)
												.find('p')
												.html(
														'Error in validating E-mail Id');
									}
								});
					}

}

function applyBootMultiSelectData(element) {

										var buttonHeight = $(element).data(
												"bm-height");
										var buttonWidth = $(element).data(
												"bm-width");
										var buttonClass = $(element).data(
												"bm-btn-class");
										var showCountAfter = $(element).data(
												"bm-show-max");
										var selectAllText = $(element).data(
												"bm-select-all-text");

										var disableFiltering = $(element).data(
												"bm-disable-filter");
										
										var includeSelectAllText = $(element).data(
										"bm-include-select-all-text");

										buttonHeight = (buttonHeight == null) ? "custom-multiselect"
												: "";
										buttonWidth = (buttonWidth == null) ? "100%"
												: buttonWidth;
										buttonClass = (buttonClass == null) ? "btn"
												: ("btn " + buttonClass);
										showCountAfter = (showCountAfter == null) ? 1
												: showCountAfter;
										selectAllText = (selectAllText == null) ? "Select All"
												: selectAllText;
										includeSelectAllText = (includeSelectAllText == null) ? true 
												: 	includeSelectAllText;

										var enableFiltering = (disableFiltering == null) ? true
												: disableFiltering;

										$(element)
												.multiselect(
														{

															buttonText : function(
																	options,
																	select) {
																if (options.length == 0) {
																	return 'None selected &nbsp;<b class="caret"></b>';
																} else if (options.length > showCountAfter) {
																	return options.length
																			+ ' selected &nbsp;<b class="caret"></b>';
																} else {
																	var selected = '';
																	options.each(function() {
																	
																				selected += $(this).text()+ ' ,';
																			});
																	
																	return selected
																			.substr(
																					0,
																					selected.length-1
																							)
																			+ '&nbsp;<b class="caret"></b>';
																}
															},
															buttonClass : buttonClass,
															maxHeight : 200,
															includeSelectAllOption : includeSelectAllText,
															selectAllValue : "",
															selectAllText : selectAllText,
															enableFiltering : enableFiltering,
															filterPlaceholder : 'Search',
															buttonWidth : buttonWidth,
															buttonContainer : '<div class="btn-group reset-m col-sm-10 '
																	+ buttonHeight
																	+ '" />'
														});

}

function configureSearchableForm(element) {
	multiselect.init();
    $(element).multiSelect();
    var id= $(element).attr('id')
    $('#ms-'+id + ' > .ms-selectable > input[id^=multi_search]').quicksearch('#ms-'+id+' .ms-selectable li:not(.ms-selected)');
}


function executeOnDomNodeInserted(listDomNodeInserted) {
	listDomNodeInserted.forEach(function(selector) {
	   $(selector).on('DOMNodeInserted', function(evt){
		    $('.date').on('DOMNodeInsertedIntoDocument', function() {
					applyDateFunction(this);
			});
			$('.chosen_a').on('DOMNodeInsertedIntoDocument', function() {
					applyChosenConfig_a(this);
			});
			$('.time').on('DOMNodeInsertedIntoDocument', function() {
					applyTimeFunction(this);
			});
			$('.neutrinoDate').on('DOMNodeInsertedIntoDocument', function() {
					applyNeutrinoDateFunc(this);
			});
			$('.uni_style').on('DOMNodeInsertedIntoDocument', function() {
				applyUniformFunction(this);
			});
			$('.validEmail').on('DOMNodeInsertedIntoDocument', function() {
				applyValidEmailConfig(this);
			});
			$('.boot_multiselect').on('DOMNodeInsertedIntoDocument', function() {  
				applyBootMultiSelectData(this);
			});
			$('.boot-multi_a').on('DOMNodeInsertedIntoDocument', function() {
				applyBootMultiSelectData(this);
			});
			$('select').on('DOMNodeInsertedIntoDocument', function() {
				var id = $(this).attr('id');
				initializeSelectElement(id);
				if($(this).hasClass('searchable-form')) {
				  configureSearchableForm(this);
				}
				if($(this).hasClass('boot_multiselect') || $(this).hasClass('boot-multi_a')){
				   applyBootMultiSelectData(this);
				}
				if($(this).hasClass('chosen_a')){
					applyChosenConfig_a(this);
				}
			});
	    });	
	})
}

function executeOnLoad(listSelectorOnLoad) {
	listSelectorOnLoad.forEach(function(selector) {
		$(selector).each(function(){
				executeFunctions(this);
		});
	});	
}

function executeFunctions(element){
	if($(element).hasClass('date')) {
		applyDateFunction(element);
	}
	if($(element).hasClass('chosen_a')) {
		applyChosenConfig_a(element);
	}
	if($(element).hasClass('time'))	{
		applyTimeFunction(element);
	}
	if($(element).hasClass('neutrinoDate')){
		applyNeutrinoDateFunc(element);
	}
	if($(element).hasClass('uni_style') && ($(element).is('input[type="checkbox"]') || $(element).is('input[type="radio"]'))){
		applyUniformFunction(element);
	}
	if($(element).hasClass('inputmask')){
		applyInputMask(element);
	}
	if($(element).hasClass('validEmail')){
		applyValidEmailConfig(element);
	}
	if($(element).is('textarea')){
		configTextArea(element);
	}
	if($(element).is('select')){
		var id = $(element).attr('id');
		initializeSelectElement(id);
		if($(element).hasClass('searchable-form')) {
          configureSearchableForm(element);
        }
        if($(element).hasClass('boot_multiselect') || $(element).hasClass('boot-multi_a')){
           applyBootMultiSelectData(element);
        }
        if($(element).hasClass('chosen_a')) {
    		applyChosenConfig_a(element);
    	}
	}
}

function hideUnhideDescCount(id,hideDescCountFlag){
	if(hideDescCountFlag){
	 jQuery("#instDesc_counter0_"+id).hide();
	}else{
		jQuery("#instDesc_counter0_"+id).show();
	}
}

function populateData(current) {
	var targetSelect = $(current).parents(".uscri_businessPartner:first").find(
			"select");

	var ulElement = $(current).siblings().find("ul");

	var targetURL = getContextPath() + "/app/userSelect/getTeams/";

	if ($(current).parents(".uscri_businessPartner:first").hasClass("role")) {

		targetURL = getContextPath() + "/app/userSelect/getRoles/"

	}

	$
			.ajax({
				type : "GET",
				url : targetURL,
				success : function(data) {

					var pushLiElements = '';
					var pushData = '';
					for (key in data) {
						pushLiElements += '<li><a href="javascript:void(0);" style="padding: 0px;"><label style="margin:0;padding:3px 20px 3px 20px;height:100%;cursor:pointer;"><input onChange="callMe(this)" data-original-title="" value="'
								+ key
								+ '" style="margin-bottom:5px;" type="checkbox">'
								+ data[key] + '</label></a></li>';

						pushData += '<option   value="' + key + '">'
								+ data[key] + '</option>';
					}
					//targetSelect
					//.html(pushData);
					targetSelect.append(pushData);
					//ulElement.empty();
					ulElement.append(pushLiElements);

					//targetSelect
					//	.multiselect('updateButtonText');
				},
				error : function(j) {
					new PNotify({
						title : failure,
						text : "Error retrieving business partners",
						type : error,
						pnotify_animate_speed : fadeOutduration,
						opacity : .8
					});
				}
			});

}

function updateListAndSelectValue(selectId,data,selectedValue) {
    var data1 = JSON.parse(data);
    initPaginationData(data1,selectId,selectedValue);
}
function handleMaxSelectedOptions(current_id,evt)
{
	var max=$("#"+current_id).val()!=null?$("#"+current_id).val().length:0;
	$.sticky("Max Entries Allowed: " + max, {
		data : 10000,
		position : "top-right",
		type : "st-error"
	});
}
function  handleMinSelectedOptions(current_id) {
	var min = $("#minArguments_" + current_id).val();
	var max = $("#maxArguments_" + current_id).val();
	var selectedOptions = $("#"+current_id).val();
	var selectedOptionCount=0;
	if(selectedOptions!=null && selectedOptions!="")
	{
		selectedOptionCount=selectedOptions.length;
	}
	if (selectedOptionCount < min) {
		$.sticky("Must select at least " + min + " item(s)", {
			data : 10000,
			position : "top-right",
			type : "st-error"
		});
		return false;
	}
	return true;
}

//overwriting accept method for mime type validation in case of ftl file extension
$.validator.addMethod( "accept", function( value, element, param ) {
	if(param = ".ftl"){
		return true;
	}
	// Split mime on commas in case we have multiple types we can accept
	var typeParam = typeof param === "string" ? param.replace( /\s/g, "" ) : "image/*",
		optionalValue = this.optional( element ),
		i, file, regex;

	// Element is optional
	if ( optionalValue ) {
		return optionalValue;
	}

	if ( $( element ).attr( "type" ) === "file" ) {

		// Escape string to be used in the regex
		// see: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
		// Escape also "/*" as "/.*" as a wildcard
		typeParam = typeParam
				.replace( /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&" )
				.replace( /,/g, "|" )
				.replace( /\/\*/g, "/.*" );

		// Check if the element has a FileList before checking each file
		if ( element.files && element.files.length ) {
			regex = new RegExp( ".?(" + typeParam + ")$", "i" );
			for ( i = 0; i < element.files.length; i++ ) {
				file = element.files[ i ];

				// Grab the mimetype from the loaded file, verify it matches
				if ( !file.type.match( regex ) ) {
					return false;
				}
			}
		}
	}

	// Either return true because we've validated each file, or because the
	// browser does not support element.files and the FileList feature
	return true;
}, $.validator.format( "Please enter a value with a valid mimetype." ) );



$(document).on("click",".neutrino-datatable-scrollx-wrapper .dropdown-toggle", function (){
	dropDownFixPosition(this,this.nextSibling);
});
function dropDownFixPosition(button,dropdown){

      var dropDownTop = button.getBoundingClientRect().top + $(button).outerHeight();
        $(dropdown).css('top', dropDownTop + "px");
         $(dropdown).css('left', (button.getBoundingClientRect().left - ($(dropdown).outerWidth() - $(button).outerWidth())) + "px");
}

/*
 * Close element on scroll 
 * */
function invokeCloseOnScroll(invokeOnEle,elements,className){
	$(invokeOnEle).on("scroll",function(){ 
		closeOnScroll(elements,className)
	});
}
function closeOnScroll(element,className){
	$(element).removeClass(className);
}

//Event handler to remove non-printing characters on focusout event.
function addEventsForNonPrintingCharactersCheck(elementId){

	$("#"+elementId).on('focusout',function(){
		var value = $(this).val();
		
		if(value != ""){
			var modifiedText = modifyElementValue(value);
			$(this).val(modifiedText);

		}		
	});
}

function getMatches(pastedData){ 
	  return pastedData.match(nonPrintingCharactersRegex);
}
function modifyElementValue(elementValue){
	
	var matches = getMatches(elementValue);
	if(matches != null && matches.length > 0 ){
		for(var i=0;i < matches.length;i++){
			var nonPrintingChar = "["+matches[i]+"]";
			var nonPrintingCharReplaceRegex = new RegExp(nonPrintingChar, "g");
			elementValue = elementValue.replace(nonPrintingCharReplaceRegex,"");
			matches = getMatches(elementValue);
			if(matches == null){
				break;
			}
		}
	}
	
	return elementValue;
}
document.addEventListener('scroll',function(){
	$('.tooltip').removeClass('in');//for removing tooltip.
	$('.tooltip').css("display","none");
},true)

$(document).on("click",".nav-tabs li" ,function() {
	$('.tooltip').removeClass('in');//for removing tooltip.
	$('.tooltip').css("display","none");
});


$(document).on("click",".modal .auto-complete-input", function (){
	 var dropDownTop = this.getBoundingClientRect().top + $(this).outerHeight();
        $(this).siblings("#auto-container").css('top', dropDownTop + "px");
});

$(document).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", ".modal", function(){$(this).removeClass("animated shake");});

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {	
    if (options.customCache) {
		if(localStorage){
			var successCallbackHandler = originalOptions.success;
			url = originalOptions.url + "?" + originalOptions.data;	
			options.beforeSend = function () {
				if (localStorage[url]) {
					var cachingTimeStamp = JSON.parse(localStorage[url]).timestamp;
					var currentTimeStamp = new Date().getTime();
							 
					if (timeDiff(currentTimeStamp,cachingTimeStamp) > 30) {
						return true;
						
					}; 
					
					successCallbackHandler(JSON.parse(localStorage[url]).response);
					
					return false;
				}
				return true;
			};
			options.success = function (data, textStatus) {
				var responseObject = {url: originalOptions.url + "?" + originalOptions.data, response : data, timestamp: new Date().getTime()}
				localStorage.setItem(url, JSON.stringify(responseObject));
			};
		}
		else {
			console.log("// No support for LocalStorage in your browser version");
		}        
    }
});

function timeDiff(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60);
    return daysDifference;
}

$(document).on('keyup','.datepicker_div input',function(e){
	var keycode = (e.keyCode ? e.keyCode : e.which),
	    	setDate;
	if(keycode == '32'){$(this).val("");} //This is to make sure user does'nt put spaces in the datepicker
	else if(keycode == '13'){
	   if($(this).val()=="" || $(this).val()==null){setDate = $(this).attr('defdate')}
	   else{setDate = $(this).val();}
	   $(this).val(setDate).trigger('change');
    }
});

$(document).ready(function(){
	if($(".ms-selectable ul").find("li").length == 0){
		$(".ms-selectable ul").siblings("a.btn.sForm_select").addClass("disabled");
	}
	else {
		$(".ms-selectable ul").siblings("a.btn.sForm_select").removeClass("disabled");
	}
})


function getRelatedAddressTypeIdForAddress(addressId){
	if($(addressId).data("relatedAddressTypeId")!=null){
		return $(addressId).data("relatedAddressTypeId");
	}
	return "addressType";
}
$(document).on('click', '.dt-buttons .buttons-colvis', function(){
	if($('body').hasClass('modal-open')){$('.dt-button-collection.dropdown-menu, div.dt-button-background').addClass('dtDropdownTop');}
	else{$('.dtDropdownTop').removeClass('dtDropdownTop')}
});

//Jquery UI-Dialog Close Button Display Issue - PDDEV-22784
$(document).on('dialogopen','.ui-dialog',function(){
	$('.ui-dialog-titlebar-close').addClass('ignore_wait');
})
//Hide datepicker on scroll
document.addEventListener('scroll', function (event) {$(".datepicker").hide();}, true);