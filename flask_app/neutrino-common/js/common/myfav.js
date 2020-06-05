/**
 * JS code for myFav.jsp(core-web)
 */

var fav;

	function showMyFavSelect() {
		updateCheckBox(favList);
		$("#edit-favourite").show();
	}

	function filteredByTeam() {
		$
				.ajax({

					url : getContextPath() + "/app/loadLoggedinUsersByTeam",
					type : 'GET',
					success : function(jqXHR) {
						$('#loggedInUsersId').html(jqXHR);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						$.sticky($('#failureDiv').val(), {
							data : 10000,
							position : "top-center",
							type : "st-error"
						});
					}
				});
	}

	function filteredByBranch() {
		$
				.ajax({

					url : getContextPath() + "/app/loadLoggedinUsersByBranch",
					type : 'GET',
					success : function(jqXHR) {
						$('#loggedInUsersId').html(jqXHR);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						$.sticky($('#failureDiv').val(), {
							data : 10000,
							position : "top-center",
							type : "st-error"
						});
					}
				});
	}

 
	function showPrinterWidget() {

		$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
		$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
		$("#neutrino-body").removeClass();
		$("#neutrino-body").addClass("col-sm-12");
		$("#sidebar").removeClass("menu-min");
		$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
		$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
		$("#printAnchor").parent().addClass("open");
		$("#printAnchor").parent().addClass("active");
	}
	
	function showCalender(){
		$("#sidebar").show();
		$("#neutrino-body").removeClass();
		$("#neutrino-body").addClass("col-sm-12");
		if ((!$("#calenderAnchor").parent("li").hasClass("open"))|| (!$("#calenderAnchor").parent("li").hasClass("active"))) {
			
			$("#sidebar").removeClass("menu-min");
			$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
			$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
			$("#calenderAnchor").parent().addClass("open");
			$("#calenderAnchor").parent().addClass("active");
			$("ul #Fullcalender").show();
			$("#calenderDiv").show();
			$("#sidebar").show();
			$("#calenderAnchor .arrow").removeClass("glyphicon-chevron-right");
			$("#calenderAnchor .arrow").addClass("glyphicon-chevron-down");
			
		} 
	  else if (($("#calenderAnchor").parent().hasClass("open") || $("#calenderAnchor").parent().hasClass("active"))	&& (!$("#sidebar").hasClass("menu-min"))) {
			//	when has open and active class but no menu-min class means already expanded
			$("#calenderAnchor").parent().removeClass("open");
			$("#calenderAnchor").parent().removeClass("active");
			$("ul #Fullcalender").hide();
			$("#calenderDiv").hide();
			$("#calenderAnchor .arrow").removeClass("glyphicon-chevron-down");
			$("#calenderAnchor .arrow").addClass("glyphicon-chevron-right");
		}
		//means widget not expanded now have to be expanded
		else if (($("#calenderAnchor").parent().hasClass("open") || $("#calenderAnchor").parent().hasClass("active"))&& ($("#sidebar").hasClass("menu-min"))) {
			$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
			$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
			$("#sidebar").removeClass("menu-min");
			$("#calenderAnchor").parent().addClass("open");
			$("#calenderAnchor").parent().addClass("active");
			$("ul #Fullcalender").show();
			$("#calenderDiv").show();
			$("#calenderAnchor .arrow").removeClass("glyphicon-chevron-right");
			$("#calenderAnchor .arrow").addClass("glyphicon-chevron-down");
		}
		
	}
	
	
	//this script was taken from page end in myfav.jsp
	$('.calendar-slide').click(function(e) {
		$('.calendar-slide-inner').slideToggle();

	});
	$('.todo-slide').click(function(e) {
		$('.todo-slide-inner').slideToggle();

	});
	$('.toggle').prop('checked',false);
	
	
	var toDoPageSize;
	var paginatedIndex;
	var totalNumberOfToDos;
	var currentToDoDetail;
	var currentDueDate;

	function callRetrievePaginatedToDos() {
	$("#sidebar").show();
	$("#neutrino-body").removeClass();
		$("#neutrino-body").addClass("col-sm-12");	
	if ((!$("#toDoAnchor").parent("li").hasClass("open"))|| (!$("#toDoAnchor").parent("li").hasClass("active"))) {
			retrievePaginatedToDos();
		} 
	  else if (($("#toDoAnchor").parent().hasClass("open") || $("#toDoAnchor").parent().hasClass("active"))	&& (!$("#sidebar").hasClass("menu-min"))) {
			//	when has open and active class but no menu-min class means already expanded
			$("#toDoAnchor").parent().removeClass("open");
			$("#toDoAnchor").parent().removeClass("active");
			$("ul #toDoList").hide();
			$("#toDoAnchor .arrow").removeClass("glyphicon-chevron-down");
			$("#toDoAnchor .arrow").addClass("glyphicon-chevron-right");
		}
		//means widget not expanded now have to be expanded
		else if (($("#toDoAnchor").parent().hasClass("open") || $("#toDoAnchor").parent().hasClass("active"))&& ($("#sidebar").hasClass("menu-min"))) {
			$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
			$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
			$("#sidebar").removeClass("menu-min");
			$("#toDoAnchor").parent().addClass("open");
			$("#toDoAnchor").parent().addClass("active");
			$("ul #toDoList").show();
			$("#sidebar").show();
			$("#toDoAnchor .arrow").removeClass("glyphicon-chevron-right");
			$("#toDoAnchor .arrow").addClass("glyphicon-chevron-down");
		}
	}

	function retrievePaginatedToDos() {
		
		toDoPageSize = 3; // intialize it from DB
		paginatedIndex = 0;

		$.ajax({
			url : getContextPath() + "/app/gadget/toDo/retrieveLastToDos/"
					+ toDoPageSize,

			success : function(toDoJsp) {
				$('#todoList').html(toDoJsp);
				paginatedIndex = $('#numberOfToDos').val();
				totalNumberOfToDos = $('#numberOfToDos').val();
				paginatedIndex = paginatedIndex - toDoPageSize;
			
				
				$("#sidebar").removeClass("menu-min");
				$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
				$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
				$("#toDoAnchor").parent().addClass("open");
				$("#toDoAnchor").parent().addClass("active");
				$("ul #toDoList").show();
				$("#sidebar").show();
				$("#toDoAnchor .arrow").removeClass("glyphicon-chevron-right");
				$("#toDoAnchor .arrow").addClass("glyphicon-chevron-down");
			},
			error : function() {
				showToDoSticky(no_data_from_server, 'st-error');
			}
		});
	}

	$(function() {

		$('body')
				.on(
						"click",
						'.save-todo-btn',
						function() {
							var toDoDetail = $('.add-todo-text').val();
							var toDoDueDate = $('.add-duedate-date-picker')
									.val();
							var currentToDoDateFormat =VAR_MY_FAV_currentToDoDateFormat;
							var validateToDoDate = Date.isValid(toDoDueDate,
									currentToDoDateFormat);
							if (toDoDetail != ""
									&& toDoDueDate != ""
									&& !(currentToDoDetail == toDoDetail && currentDueDate == toDoDueDate)
									&& validateToDoDate) {

								var toDoId = $('.add-todo-text').attr('id');
								var splitString = toDoId.split("-");
								toDoId = splitString[2];
								var tempStartIndex = paginatedIndex;
								if (tempStartIndex < 0) {
									tempStartIndex = 0;
								}
								$.ajax({
									type : "POST",
									url : getContextPath()
											+ "/app/gadget/toDo/editToDo/"
											+ toDoId,
									data : "myToDetail=" + toDoDetail
											+ "&dueDate=" + toDoDueDate
											+ "&paginatedIndex="
											+ tempStartIndex + "&pageSize="
											+ toDoPageSize,
									success : function(toDoJsp) {
										$('.save-todo-btn').unbind('click');
										$('.slideDown.toDo').slideUp();
										$('#todoList').html(toDoJsp);
										$('.minus-plus-icon').removeClass(
												'glyphicon glyphicon-minus');
										$('.minus-plus-icon').addClass(
												'glyphicon glyphicon-plus');
									},
									error : function() {
										showToDoSticky(no_data_from_server,
												'st-error');
									}
								});
							} else {
								if (toDoDetail == "" && toDoDueDate == "") {
									$('#pick-toDo-errors').text(
											todo_enter_detail).css({
										'color' : 'red',
										'font-size' : '11px'
									});
								} else if (toDoDueDate == "") {
									$('#pick-toDo-errors').text(
											todo_enter_dueDate).css({
										'color' : 'red',
										'font-size' : '11px'
									});
								} else if (toDoDetail == "") {
									$('#pick-toDo-errors')
											.text(todo_enter_text).css({
												'color' : 'red',
												'font-size' : '11px'
											});
								} else if (!validateToDoDate) {
									$('#pick-toDo-errors').text(invalid_date)
											.css({
												'color' : 'red',
												'font-size' : '11px'
											});
								}
							}

						});

		/* retrievePaginatedToDos(); */

		$('.toDo-next')
				.click(
						function() {
							if (paginatedIndex > 0) {
								if (paginatedIndex > toDoPageSize) {
									paginatedIndex = paginatedIndex
											- toDoPageSize;
								} else {
									toDoPageSize = paginatedIndex;
									paginatedIndex = 0;
								}
								$
										.ajax({
											url : getContextPath()
													+ "/app/gadget/toDo/retrievePaginatedToDos",

											data : "startIndex="
													+ paginatedIndex
													+ "&pageSize="
													+ toDoPageSize,

											success : function(toDoJsp) {
												$('#todoList').html(toDoJsp);
											},

											error : function() {
												showToDoSticky(
														no_data_from_server,
														'st-error');
											}
										});
							}
						});

		$('.toDo-previous')
				.click(
						function() {
							if (paginatedIndex != (totalNumberOfToDos - toDoPageSize)) {
								if (paginatedIndex == 0) {
									paginatedIndex = toDoPageSize;
									toDoPageSize = 3;
								} else {
									paginatedIndex = paginatedIndex
											+ toDoPageSize;
								}
								$
										.ajax({
											url : getContextPath()
													+ "/app/gadget/toDo/retrievePaginatedToDos",

											data : "startIndex="
													+ paginatedIndex
													+ "&pageSize="
													+ toDoPageSize,

											success : function(toDoJsp) {
												$('#todoList').html(toDoJsp);
											},
											error : function() {
												showToDoSticky(
														no_data_from_server,
														'st-error');
											}
										});
							}
						});

		$('.add-duedate-date-picker').datepicker({
			autoclose : true,
			format : defaultUserDateFormat
		});
	});

	var maxNumOfToDosToBeAdded = VAR_MY_FAV_maxNumOfToDosToBeAdded;
	$(function() {

		$('.minus-plus-icon').click(function(e) {
			$(this).toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
			$('.slideDown.toDo').slideToggle();
			$('.add-todo-text').removeAttr('id');
			$('.add-todo-text').val('');
			$('.add-duedate-date-picker').val('');
			$('#pick-toDo-errors').text('');
			$('.add-todo-btn').removeClass('hide');
			$('.save-todo-btn').addClass('hide');
		});

		$(".add-todo-btn")
				.click(
						function() {

							if (parseInt(totalNumberOfToDos) < parseInt(maxNumOfToDosToBeAdded)) {
								var toDoText = $('.add-todo-text').val();
								var toDoDueDate = $('.add-duedate-date-picker')
										.val();
								var currentToDoDateFormat = VAR_MY_FAV_currentToDoDateFormat;
								var validateToDoDate = Date.isValid(
										toDoDueDate, currentToDoDateFormat);
								if (toDoText != "" && toDoDueDate != ""
										&& validateToDoDate) {
									$
											.ajax({
												url : getContextPath()
														+ "/app/gadget/toDo/addNewToDo",
												data : "myToDetail=" + toDoText
														+ "&dueDate="
														+ toDoDueDate,
												type : 'POST',
												success : function() {
													retrievePaginatedToDos();
													$('.slideDown.toDo')
															.slideUp();
													$('.minus-plus-icon')
															.removeClass(
																	'glyphicon glyphicon-minus');
													$('.minus-plus-icon')
															.addClass(
																	'glyphicon glyphicon-plus');
													$('#pick-toDo-errors')
															.text('');
												},
												error : function() {
													showToDoSticky(
															no_data_from_server,
															'st-error');
												}
											});
								} else {
									if (toDoText == "" && toDoDueDate == "") {
										$('#pick-toDo-errors').text(
												todo_enter_detail).css({
											'color' : 'red',
											'font-size' : '11px'
										});
									} else if (toDoDueDate == "") {
										$('#pick-toDo-errors').text(
												todo_enter_dueDate).css({
											'color' : 'red',
											'font-size' : '11px'
										});
									} else if (toDoText == "") {
										$('#pick-toDo-errors').text(
												todo_enter_text).css({
											'color' : 'red',
											'font-size' : '11px'
										});
									} else if (!validateToDoDate) {
										$('#pick-toDo-errors').text(
												invalid_date).css({
											'color' : 'red',
											'font-size' : '11px'
										});
									}
								}
							} else {
								showToDoSticky(todo_number_exceed
										+ maxNumOfToDosToBeAdded + '. '
										+ todo_delete_some, 'st-error');
							}
						});
	});
	function showToDoSticky(message, messageType) {
		$.sticky(message, {
			autoclose : 3000,
			position : "top-right",
			type : messageType
		});
	}

	function deleteToDo(toDoId) {
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/gadget/toDo/deleteToDo/" + toDoId,

			success : function(jsp) {
				retrievePaginatedToDos();
				$('.slideDown.toDo').slideUp();
				$('.minus-plus-icon').removeClass('glyphicon glyphicon-minus');
				$('.minus-plus-icon').addClass('glyphicon glyphicon-plus');
			},
			error : function() {
				showToDoSticky(no_data_from_server, 'st-error');
			}
		});
	}

	function markedAsRead(toDoId, currentValue) {
		var newValueForMarkedAsRead = 'true';
		var tempStartIndex = paginatedIndex;
		if (currentValue) {
			newValueForMarkedAsRead = 'false';
		}
		if (tempStartIndex < 0) {
			tempStartIndex = 0;
		}
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/gadget/toDo/markedAsRead/" + toDoId,
			data : "markedAsRead=" + newValueForMarkedAsRead
					+ "&paginatedIndex=" + tempStartIndex + "&pageSize="
					+ toDoPageSize,
			success : function(toDoJsp) {
				$('#todoList').html(toDoJsp);
			},
			error : function() {
				showToDoSticky(no_data_from_server, 'st-error');
			}
		});
	}

	function performToDoEditAction(currentToDoId) {
		currentToDoDetail = $('#' + currentToDoId).text();
		currentDueDate = $('#dueDate-' + currentToDoId).text();
		currentDueDate = $.trim(currentDueDate);
		currentToDoDetail = $.trim(currentToDoDetail);

		$('.slideDown.toDo').slideDown();
		$('.add-todo-text').val(currentToDoDetail);
		$('.add-duedate-date-picker').val(currentDueDate);
		$('.save-todo-btn').removeClass('hide');
		$('.add-todo-btn').addClass('hide');
		$('.add-todo-text').attr('id', 'edit-toDo-' + currentToDoId);
		$('.minus-plus-icon').removeClass('glyphicon glyphicon-plus');
		$('.minus-plus-icon').addClass('glyphicon glyphicon-minus');
		$('#pick-toDo-errors').text('');
	}
	



	$(function() {
		/* getUsersShortcuts(); */
		/* getRoleBasedFavoritesForEditing(); */

		$("#editMyFavorites").click(function() {
			$('.userShortcutsList li a').each(function() {
				var favDataCode = $(this).attr('data-code');
				$('.userFavortiesList li a').each(function() {
					if ($(this).attr('data-code') == favDataCode) {
						$(this).find('input').prop('checked', true);
					}
				});
			});
			$('#showFavorites').removeClass('hide');
			$('#editMyFavorites').addClass('hide');
			$('#userBasedShortcutsDiv.slideUp').slideToggle();
			$('#roleBasedShortcutsForEditing.slideDown').slideToggle();
		});
		$('#showFavorites').click(function() {
			$('#showFavorites').addClass('hide');
			$('#editMyFavorites').removeClass('hide');
			$('#userBasedShortcutsDiv.slideUp').slideToggle();
			$('#roleBasedShortcutsForEditing.slideDown').slideToggle();
		});
		$(document).on("click", "input[id^='check_fav_']", function(event) {
			if (!$(this).is(":checked")) {
				$(event.target).prop('checked', false);
			} else {
				$(event.target).prop("checked", true);
			}
		});

	});

	function paintUserShortcutsDiv() {
		$("#sidebar").show();
		$("#neutrino-body").removeClass();
			$("#neutrino-body").addClass("col-sm-12"); 
		if (!$("#myFavtAnchor").parent().hasClass("open") || !$("#myFavtAnchor").parent().hasClass("active")) {
			getRoleBasedFavoritesForEditing();
			getUsersShortcuts();
		/*     $("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
			$("#fw-bw-icon").addClass("glyphicon glyphicon-backward"); */
			
			$("#sidebar").removeClass("menu-min");
			$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
			$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
			$("#myFavtAnchor").parent().addClass("open");
			$("#myFavtAnchor").parent().addClass("active");
			$("ul #editMyFavorites").show(); 
			$("#selectMyFav").show();
			$("#sidebar").show();
			$("#myFavtAnchor .arrow").removeClass("glyphicon-chevron-right");
			$("#myFavtAnchor .arrow").addClass("glyphicon-chevron-down");

		}
		 	else if(($("#myFavtAnchor").parent().hasClass("open") || $("#myFavtAnchor").parent().hasClass("active")) && (!$("#sidebar").hasClass("menu-min"))){
				 //	alert("when has open and active class but no menu-min class means already expanded");
					$("#myFavtAnchor").parent().removeClass("open");
					$("#myFavtAnchor").parent().removeClass("active");
					$("ul #editMyFavorites").hide();
					$("#myFavtAnchor .arrow").removeClass("glyphicon-chevron-down");
					$("#myFavtAnchor .arrow").addClass("glyphicon-chevron-right");
				}
			//means widget not expanded now have to be expanded
				else if(($("#myFavtAnchor").parent().hasClass("open") || $("#myFavtAnchor").parent().hasClass("active")) && ($("#sidebar").hasClass("menu-min"))){
				// 	alert("when has open and active class and has menu-min class means not expanded now have to be expanded");
				$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
					$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
					$("#sidebar").removeClass("menu-min");
					$("#myFavtAnchor").parent().addClass("open");
					$("#myFavtAnchor").parent().addClass("active");
					$("ul #editMyFavorites").show();
					$("#selectMyFav").show();
					$("#sidebar").show();
					$("#myFavtAnchor .arrow").removeClass("glyphicon-chevron-right");
					$("#myFavtAnchor .arrow").addClass("glyphicon-chevron-down");
				} 

	}

	function getRoleBasedFavoritesForEditing() {
		if ($('#roleBasedShortcutsForEditing').children().length <= 0) {
			$.ajax({
				url : getContextPath()
						+ "/app/userShortcuts/fetchRoleBasedFavorites",
				success : function(jqXHR) {
					$('#roleBasedShortcutsForEditing').html(jqXHR);
				}
			});
		}
	}

	function getUsersShortcuts() {

		$.ajax({
			url : getContextPath()
					+ "/app/userShortcuts/fetchUserBasedShortcuts",
			type : 'GET',
			success : function(jqXHR) {
				$('#userBasedShortcutsDiv').html(jqXHR);
				$('#showFavorites').addClass('hide');
				$('#editMyFavorites').removeClass('hide');
				$('#userBasedShortcutsDiv.slideUp').slideDown();
				$('#roleBasedShortcutsForEditing.slideDown').slideUp();
			}
		});
	}

	function saveShortcuts() {
		var selectedFavs = [];
		$("input[id^='check_fav_']:checked").each(function() {
			selectedFavs.push($(this).val());
		});
		selectedFavs = $.grep(selectedFavs, function(e) {
			return e;
		});
		if (selectedFavs.length <= 10) {
			$.ajax({
				url : getContextPath() + "/app/userShortcuts/saveShortcuts",
				data : "selectedFavs=" + selectedFavs,
				type : 'POST',
				success : function(jqXHR) {
					$.sticky(label_added_shortcuts_successfully, {
						autoclose : 3000,
						position : "top-right",
						type : "st-success"
					});
					getUsersShortcuts();
				}
			});
		} else {
			$.sticky(label_cannot_add_more_favs, {
				autoclose : 3000,
				position : "top-right",
				type : "st-error"
			});
		}
	}

	$(function() {

		$('#sidebar-collapse').on('click', function() {
			if($('#sidebar-collapse').find(".glyphicon").hasClass("glyphicon-forward"))
			{
				$('#sidebar').hide();
			}

		});

		$('#printAnchor').on('click', function() {
			print_serve();
		});

		$('#sidebar-shortcuts-large .btn-printing').on('click', function() {
			print_serve();
		});

		function print_serve() {

	 		window.print();

			//chrome issue https://code.google.com/p/chromium/issues/detail?id=173140
			if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
			//window.location.reload();
			}
		}

      
		
	});


	$(function() {

		$(document).bind('keydown.alt_ctrl_0', function(evt) {
			var dataURL0 = $(".p_fav_index_0").attr("href");
			if (dataURL0) {
				neutrinoNavigateTo(dataURL0);
			}
		});
		$(document).bind('keydown.alt_ctrl_1', function(evt) {
			var dataURL1 = $(".p_fav_index_1").attr("href");
			if (dataURL1) {
				neutrinoNavigateTo(dataURL1);
			}
		});
		$(document).bind('keydown.alt_ctrl_2', function(evt) {
			var dataURL2 = $(".p_fav_index_2").attr("href");
			if (dataURL2) {
				neutrinoNavigateTo(dataURL2);
			}
		});
		$(document).bind('keydown.alt_ctrl_3', function(evt) {
			var dataURL3 = $(".p_fav_index_3").attr("href");
			if (dataURL3) {
				neutrinoNavigateTo(dataURL3);
			}
		});
		$(document).bind('keydown.alt_ctrl_4', function(evt) {
			var dataURL4 = $(".p_fav_index_4").attr("href");
			if (dataURL4) {
				neutrinoNavigateTo(dataURL4);
			}
		});
		$(document).bind('keydown.alt_ctrl_5', function(evt) {
			var dataURL5 = $(".p_fav_index_5").attr("href");
			if (dataURL5) {
				neutrinoNavigateTo(dataURL5);
			}
		});
		$(document).bind('keydown.alt_ctrl_6', function(evt) {
			var dataURL6 = $(".p_fav_index_6").attr("href");
			if (dataURL6) {
				neutrinoNavigateTo(dataURL6);
			}
		});
		$(document).bind('keydown.alt_ctrl_7', function(evt) {
			var dataURL7 = $(".p_fav_index_7").attr("href");
			if (dataURL7) {
				neutrinoNavigateTo(dataURL7);
			}
		});
		$(document).bind('keydown.alt_ctrl_8', function(evt) {
			var dataURL8 = $(".p_fav_index_8").attr("href");
			if (dataURL8) {
				neutrinoNavigateTo(dataURL8);
			}
		});
		$(document).bind('keydown.alt_ctrl_9', function(evt) {
			var dataURL9 = $(".p_fav_index_9").attr("href");
			if (dataURL9) {
				neutrinoNavigateTo(dataURL9);
			}
		});
	});
	
	