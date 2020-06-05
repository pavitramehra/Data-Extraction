/**
 * JS(for menu.jsp in cas webapp) moved for page size reduction
 */

var oTableAppSearchResults;
	var searchEntityIdValue;

	$(document)
			.ready(
					function() {
						/*$(".primary-nav li").livequery(function() {
							$(this).find("div:first").hide();
						});*/
						$(".nav-button").click(function() {
							$(".nav-button,.primary-nav").toggleClass("open");

						});

						$(".meg-drop").each(
								function() {
									var size = $(this).find("div.meg-content")
											.find("div.one-col").find("li")
											.length;
									if (size == 0) {
										$(this).hide();
									}
								});
						if ($('#searchBoxId').val() != "") {
							searchEntityIdValue = $('#searchBoxId').val();
							$("#main_search")
									.triggeredAutocomplete(
											{
												hidden : '#hidden_inputSearchbox',
												source : getContextPath()+'/app/LoanApplication/populateAutoCompleteResult/'
														+ searchEntityIdValue,
												trigger : "^"
											});
						}
						$('#searchBoxId')
								.change(
										function() {
											if (!$('#searchBoxId').val() == 'Menu') {
												$('#searchedMenuDataDiv')
														.empty();
											}
											searchEntityIdValue = $(
													'#searchBoxId').val();
											$("#main_search")
													.triggeredAutocomplete(
															{
																hidden : '#hidden_inputSearchbox',
																source : getContextPath()+'/app/LoanApplication/populateAutoCompleteResult/'
																		+ searchEntityIdValue,
																trigger : "^"
															});
										});

						$('#main_search')
								.change(
										function() {
											searchEntityIdValue = $(
													'#searchBoxId').val();
											$("#main_search")
													.triggeredAutocomplete(
															{
																hidden : '#hidden_inputSearchbox',
																source : getContextPath()+'/app/LoanApplication/populateAutoCompleteResult/'
																		+ searchEntityIdValue,
																trigger : "^"
															});

										});

						/*$("#main_search").focus(function() {
						
							var searchCriteria = $("#searchBoxId").val();
							if (searchCriteria == "Select") {
								$.sticky("Please select search criteria!", {
									autoclose : 5000,
									position : "top-right",
									type : "st-error"
								});
							}
						});
*/
                            if(systemAppModule=='CAS'){
                                $('.ui-autocomplete').on('click', '.ui-menu-item',
                                    function() {
                                        var appNumber = $(this).find('a').html();
                                        openApplicationInViewMode(appNumber);
                                    });
                            }

						$("#searchResultTable tbody")
								.on(
										"click",
										"tr",
										function(event) {
											var id = event.target.id;
											if (id.match('appView')) {
												//var iPosition = oTableAppSearchResults
												//		.fnGetPosition(this);
												//var aData = oTableAppSearchResults
												//		.fnGetData(iPosition);

                                                var aData = oTableAppSearchResults.row($(this).closest("tr")).data();
												var appNumber = aData.applicationNumber;
												//appNumber = $(appNumber).html();
												openApplicationInViewMode(appNumber);
											}
										});

					});

	$(function() {
		$(".primary-nav  li :not(b)").click(function() {
			if ($(this).prop("tagName") == "UL") {
				return;
			}
			var element = $(this).parent("li");
			if (element.children("ul").is(':visible')) {
				element.children("ul").hide();
			} else {
				element.children("ul").show();
			}
		});

		$("body").on('click', ".primary-nav a", function() {
			var currentDiv = $(this).parents("li:first").find("div:first");
			if (currentDiv.find("b").length == 0) {
				currentDiv.show();
				$(currentDiv).find('ul').toggle();
			} else {
				$(this).parents("li:first").find("div:first").toggle();
			}
		});

		$("body").on('click', ".primary-nav b", function() {

			$(this).parents("div:first").find("ul").toggle();

		});

	});
	
	
	
	(function($) {
		var $window = $(window), $html = $('html');

		$window.resize(
				function resize() {

					if ($(window).width() <= 960) {
						$('.megamenu.meg-fade.meg-responsive').addClass(
								'primary-nav');
						$('.primary-nav').removeClass(
								'megamenu meg-fade meg-responsive');
						$('.primary-nav').removeClass('neutrino-nav');
					} else {
						$('.primary-nav').addClass(
								'megamenu meg-fade meg-responsive');
						$('.primary-nav').addClass('neutrino-nav');
						$('.megamenu.meg-fade.meg-responsive').removeClass(
								'primary-nav');
						$('#neutrino-mega-menu > li > div').show();
					}

				}).trigger('resize');
	})(jQuery);
	
	
	
	$(function() {
		$("#searchBoxHideShow").hide();
		$("#searchBoxStyle").click(
				function() {
					if ($("#searchBoxHideShow").is(':hidden')) {
						$("#searchBoxHideShow").show();

						$("#searchBoxStyle > i").removeClass("glyphicon glyphicon-search")
								.addClass("glyphicon glyphicon-forward ");
					} else {
						$("#searchBoxHideShow").hide();

						$("#searchBoxStyle > i").removeClass("glyphicon glyphicon-forward")
								.addClass("glyphicon glyphicon-search");
					}
				});
	});
	
	
	function openLoanApplicationModal() {
		$
				.ajax({
					url : getContextPath()+"/app/LoanApplication/chooseLoanApplication",
					type : 'POST',
					success : function(jqXHR) {

						$('#chooseLoanApp_body').html(jqXHR);
						$('#chooseLoanApp').modal("show");
					},
					error : function(jqXHR, textStatus, errorThrown) {
					}
				});

	}

	function saveLoanApplicationModal() {

		if ($('#selectLoanApp').is(':checked')) {

			$
					.ajax({
						url : getContextPath()+"/app/LoanApplication/create",
						datatype : "json",
						async : true,
						success : function(data) {
							neutrinoNavigateTo(getContextPath()+'/app/LoanApplication/createApp/'
									+ data);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							alert(jqXHR + " : " + textStatus + " : "
									+ errorThrown);
						}
					});
		}
		if ($('#selectCreditCard').is(':checked')) {
			$
					.ajax({
						url : getContextPath()+"/app/CreditCardDetails/createCC",
						datatype : "json",
						async : true,
						success : function(data) {
							neutrinoNavigateTo(getContextPath()+'/app/CreditCardDetails/createApp/'
									+ data);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							alert(jqXHR + " : " + textStatus + " : "
									+ errorThrown);
						}
					});

		}

		if ($('#selectHomeLoan').is(':checked')) {

			$
					.ajax({
						url : getContextPath()+"/app/MortgageLoan/createHL",
						datatype : "json",
						async : true,
						success : function(data) {
							neutrinoNavigateTo(getContextPath()+'/app/MortgageLoan/createApp/'
									+ data);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							alert(jqXHR + " : " + textStatus + " : "
									+ errorThrown);
						}
					});

		}
		if ($('#selectBusinessLoan').is(':checked')) {

			$
					.ajax({
						url : getContextPath()+"/app/BusinessLoan/createBL",
						datatype : "json",
						async : true,
						success : function(data) {
							neutrinoNavigateTo(getContextPath()+'/app/BusinessLoan/createApp/'
									+ data);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							alert(jqXHR + " : " + textStatus + " : "
									+ errorThrown);
						}
					});

		}
		$('#chooseLoanApp').modal("hide");

	}

	function closeLoanApplicationModal() {
		$('#chooseLoanApp').modal("hide");

	};

	function quickSearch() {
		var searchCriteria = $("#searchBoxId").val();
		if (searchCriteria == "Select") {
			$.sticky("Please select search criteria!", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
		var searchVal = $("#main_search").val();
		var searchEntityId = $("#searchBoxId").val();
		if (searchEntityId == 'loanApplication' || searchEntityId == 'Customer'
				|| searchEntityId == 'Comment') {
			if (searchVal.length > 3) {
				$.ajax({
					url : getContextPath()
							+ "/app/LoanApplication/populateMenu",
					data : "item=" + searchVal + "&searchEntityId="
							+ searchEntityId,
					contentType : "application/json; charset=utf-8",
					async : true,
					success : function(jqXHR) {
						var searchResult = jqXHR;
						getSearchResultTable(searchResult);
						//This div is in hflm_tempalte.jsp
						$("#searchedResultDiv").show();
					}
				});
			} else {
				return false;
			}
		}
		if (searchEntityId == 'Schemes') {
			$
					.ajax({
						url : getContextPath()+"/app/quickSearchFramework/quickSearch/"
								+ searchVal,
						type : 'POST',
						data : ({
							id : searchEntityId
						}),
						success : function(jqXHR) {
							$('#neutrino-body').html(jqXHR);
							if (searchEntityId == "schemes") {
								if ($('#quickSearchResult tbody tr').length == 1) {
									$('#neutrino-body').hide();
									neutrinoNavigateTo(getContextPath()+"/app/LoanScheme/view/"
											+ searchVal);
								}
							}
						},
						error : function(jqXHR, textStatus, errorThrown) {
						}
					});
		}

	}

	function openApplicationInViewMode(app) {
		neutrinoNavigateTo(getContextPath()
				+ '/app/LoanApplication/viewApplicationDetails/' + app);

	}

	function showAddButton() {
		$('#addImageId').show();
	}

	function showAddButtonCust() {

		$('#addImageId1').show();

	}
	function hideAddButtonCust() {
		$('#addImageId1').hide();
	}
	function hideAddButton() {
		$('#addImageId').hide();
	}
	function startAdvanceSearch() {
		$
				.ajax({
					url : getContextPath()+"/app/searchFramwork/advanceSearch/"
							+ $("#searchParameter").val(),
					type : 'GET',
					success : function(jqXHR) {

						$('#neutrino-body').html(jqXHR);
					},
					error : function(jqXHR, textStatus, errorThrown) {

					}
				});
	}
	function setSearchParameter(value) {
		$("#searchParameter").val(value);
	}

	/* used to show search result */

	function getSearchResultTable(searchResult) {
		 $("#searchResultTable").each(function() {
			var isDataTable = $.fn.dataTable.isDataTable(this);

			if (isDataTable) {
				$(this).DataTable().destroy();
			}
		});
		//converting JSonString to JSON
		searchResult = jQuery.parseJSON(searchResult);
		oTableAppSearchResults = $('#searchResultTable')
				.DataTable(
						{
							"bFilter" : false,
							"aaData" : searchResult["aaData"],
							"aoColumns" : [ {
								mDataProp : "applicationId",
								sDefaultContent : ""
							}, {
								mDataProp : "applicationNumber",
								sDefaultContent : ""
							}, {
								mDataProp : "name",
								sDefaultContent : ""
							}, {
								mDataProp : "primaryApplicantCustNumber",
								sDefaultContent : ""
							}, {
								mDataProp : "applicationStage",
								sDefaultContent : ""
							}, {
								mDataProp : "productType",
								sDefaultContent : ""
							},

							],
							"aoColumnDefs" : [
									{
										"aTargets" : [ 0 ],
										"sClass" : "hide",
									},
									{
										"aTargets" : [ 1 ],
										"render" : function(data, type, fullObj)  {
											htmlCode = "";
											htmlCode = "<a id='appView' href='javascript:void(0);'>"
													+ data + "</a>";
											return htmlCode;
										}
									}, {
										"aTargets" : [ 2 ],
									}, {
										"aTargets" : [ 3 ],
									}, {

										"aTargets" : [ 4 ],

									}, {

										"aTargets" : [ 5 ],
									}

							],
						});
	}

	//this method is used to load list of menu items in a div when any key is typed in text box of id main_search
	var item;
	function loadMenuDataList(obj) {
		createSearchMap();
		item = obj.value;
		//var len = $.map(menuSearchMap, function(n, i) { return i; }).length;
		if (menuSearchMap && item) {
			for ( var key in menuSearchMap) {
				if (key.toUpperCase().indexOf(item.toUpperCase()) == -1) {
					delete menuSearchMap[key];
				}
			}
		}
		if ($('#searchBoxId').val() == 'Menu') {
			$.ajax({
				url : getContextPath() + "/app/autocomplete/populateMenu",
				async : true,
				success : function(jqXHR) {
					$('#searchedMenuDataDiv').html(jqXHR);
				}
			});
			showMenu();
		}
	}

	/* used to get Url of particular menu item such country or area etc and then redirect to that particular url */

	function loadMenu(menuUrl) {
		if (menuUrl) {
			neutrinoNavigateTo(menuUrl);
		}
	}

	function hideMenu() {
		$("#searchedMenuDataDiv").hide();
	}

	function showMenu() {
		$("#searchedMenuDataDiv").show();
	}

	$(document).ready(function() {

		/* used to hide list of menu items if clicked on body except div of id searchItemDiv */
		$('body').click(function() {
			hideMenu();
		});
		$('#search').click(function() {

			return false;
		});

		/* to get menu list on double click of text box of id main_search */
		$('#main_search').dblclick(function() {
			loadMenuDataList(this);
		});

	});
	
	function cancelApplication(){
		openScreens(getContextPath() + "/app/LoanApplication/ApplicationCancellation/cancelApplicationMainPage/loadPage","GET","CANCEL");
	}

	function rejectedApplications(){
		neutrinoNavigateTo(getContextPath() + "/app/RejectedLoanAppDataTable/loadPage");
	}

	function cancelledApplications(){
    		neutrinoNavigateTo(getContextPath()+"/app/CancelledLoanAppDataTable/loadPage");
    }

	function loadApplicationsGridFromMenu(){
		openScreens(getContextPath() + "/app/LoanApplicationDataTable/applicationDatatableVo","GET","APPLICATIONS");
	}

	function sendToCardManagement(){
		neutrinoNavigateTo(getContextPath() + "/app/LoanApplicationDataTable_icici/sendToPrimeDatatableVo");
	}
	
		function openScreens(url,requestType,gridName){
	    if(requestType==""){
	           requestType='POST';
	    }
	    WaitModal.show(getContextPath());
	    jQuery.ajax({
	           url : url,
	           type : requestType,
	           data : {"gridName": gridName},
	           success : function(jqXHR){
	           $("#neutrino-mega-menu").find(".meg-content").each(function(){$(this).hide();});
	               try{ 
	                  jQuery('#neutrino-body').html(jqXHR);
	                  var title = jqXHR.substring(jqXHR.indexOf("<title>")+7,jqXHR.indexOf("</title>"));;
	                  document.title=title;
	                  $("#neutrino-mega-menu").find(".meg-content").each(function(){$(this).show();});
	                  }catch(err){
	                      new PNotify({
	          				title : error,
	          				text : "There is an error on this page",
	          				type : "error",
	          				opacity : .8
	          			});
	               } 
	           },
	           error : function(jqXHR, textStatus, errorThrown){
	           WaitModal.hide();
	           }
	    });
	    WaitModal.hide();
	}
