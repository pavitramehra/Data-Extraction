
var contextPath;
$(document).ready(function() {
	
	
	$("#dt_inbox td input[name='msg_sel']").on('change',function(){
		var countCheck=0;
		$('#dt_inbox').find('td input:checked').each(function(){
			 countCheck++;
		});
		 if(countCheck==$('#dt_inbox_wrapper select[name="dt_inbox_length"]').val()){
			 $('#dt_inbox').find('th input').prop('checked',true);
		 }
		 else{
			 $('#dt_inbox').find('th input').prop('checked',false);
		 }

	})
	
	$("#dt_outbox td input[name='msg_sel']").on('change',function(){
		var countCheck=0;
		$('#dt_outbox').find('td input:checked').each(function(){
			 countCheck++;
		});
		 if(countCheck==$('#dt_outbox_wrapper select[name="dt_inbox_length"]').val()){
			 $('#dt_outbox').find('th input').prop('checked',true);
		 }
		 else{
			 $('#dt_outbox').find('th input').prop('checked',false);
		 }

	})
	
	$("#dt_trash td input[name='msg_sel']").on('change',function(){
		var countCheck=0;
		$('#dt_trash').find('td input:checked').each(function(){
			 countCheck++;
		});
		 if(countCheck==$('#dt_trash_wrapper select[name="dt_trash_length"]').val()){
			 $('#dt_trash').find('th input').prop('checked',true);
		 }
		 else{
			 $('#dt_trash').find('th input').prop('checked',false);
		 }

	})
		
	
	$("#msg_del_confirm").dialog({
		modal : true,
		bgiframe : true,
		width : 300,
		height : 200,
		autoOpen : false,
		title : 'Confirm',
		position: { 
			my: 'top', 
			at: 'center' ,
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				$(this).css('top',100);
				
			}
		}
		
	})
	
	neutrino_mailbox.init();
	
	$('.select_msg').prop('checked', false);
	// * make row clickable
	neutrino_mailbox.msg_rowLink();

	// * new message
	neutrino_mailbox.new_message();
	contextPath = getContextPath();

	if (window.location.href.indexOf("sendMail") != -1) {
		$('#inbox').removeClass('active');
		$('#mbox_inbox').removeClass('active');
		$('#newMsg').addClass('active');
		$('#mbox_new').addClass('active');
	}
	
	var msgCountForInbox;
	var msgCountForOutbox;
	var msgCountForTrash;
	
		$.ajax(
				{
					url : contextPath + "/app/email/count",
					type : 'GET',
					cache: false,
					async : false,
					success : function(jqXHR) {
						msgCountForInbox="("+jqXHR+")";
						$('#eMailCountIdForInbox').html(msgCountForInbox); 
					}
				});
		$.ajax(
				{
					url : contextPath + "/app/email/countOutbox",
					type : 'GET',
					cache: false,
					async : false,
					success : function(jqXHR) {
						msgCountForOutbox="("+jqXHR+")";
						$('#eMailCountIdForOutbox').html(msgCountForOutbox);
					}
				});
		$.ajax(
				{
					url : contextPath + "/app/email/countTrash",
					type : 'GET',
					cache: false,
					async : false,
					success : function(jqXHR) {
						msgCountForTrash="("+jqXHR+")";
						$('#eMailCountIdForTrash').html(msgCountForTrash);
					}
				});
		
		$('#inbox').trigger( "click" );	
});

neutrino_mailbox = {

	categoryData	: '',
	table_inbox		: '#dt_inbox',
	table_trash		: '#dt_trash',
	table_outbox	: '#dt_outbox',
	
	init: function(){
		$('#outbox, #inbox, #trash ').on('click',neutrino_mailbox.getMailBoxData);
		neutrino_mailbox.categoryData='';	
	},
	//get the mail box data as per the category
	getMailBoxData : function(){
		$('#msg_view').removeClass('active');
		var type =$(this).attr('id');
		neutrino_mailbox.categoryData=[];
		switch(type){
			case 'inbox':
				neutrino_mailbox.initDataTable(neutrino_mailbox.table_inbox,'/app/email/load/inbox');
				break;
			
			case 'outbox':				
				neutrino_mailbox.initOutBoxDataTable(neutrino_mailbox.table_outbox,'/app/email/load/outbox');
				break;
			
			case 'trash':			
				neutrino_mailbox.initDataTable(neutrino_mailbox.table_trash,'/app/email/load/trash');
				break;
		}
		
	},
	//initialize the table(inbox,outbox,trash as per the table type 
	initDataTable : function(table,dataUrl){
		if($.fn.DataTable.isDataTable(table)){
			return ;
		}
		var mailType ='';
		if(table==neutrino_mailbox.table_inbox)
			mailType="inbox";
		else if(table==neutrino_mailbox.table_trash)
			mailType="trash";
		var userId ='';	
		var subjectClassColor='p-cursor';		
		oTable =$(table).dataTable({
			"bFilter": true,
			"bDestroy": true,
			"bServerSide": true,
			"aaSorting": [],
			"sDom" : '<"clear">f<"pull-right"l><>rt<"row"<"pull-left col-sm-6"i><"pull-right"p><"pull-right table-export-wrapper">>',
			"sAjaxSource":contextPath+dataUrl,
			"sAjaxDataProp":"additionalDataMap",
			//This function allows you to 'post process' each row after it have been generated for each table draw
			 "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {				
				  if (aData.readStatus==false ){
					$(nRow).addClass('unread');
				  }
			},				
			"aoColumnDefs": [
							  { 
								"bSortable": false, 
								"aTargets": [ 0,1,2] 
							}
						] ,

			"aoColumns": [
					{ 	
						
						"mData": "userId" ,
						"mRender": function(aData) {
							userId =aData;							
							if(table==neutrino_mailbox.table_inbox){
								return '<input type="checkbox" class="select_msg" name="msg_sel" onclick="return selectMsg('+aData+')" user_id="'+aData+'">';
							}else if(table==neutrino_mailbox.table_trash){
								subjectClassColor='p-cursor mail-trash-acolor ';
								return '<input type="checkbox" class="select_msg" name="msg_sel" onclick="return selectMsg('+aData+')"user_id="'+aData+'">';
							}
						},
						"sClass": "nohref",
					},
					{
						"mData": "favourite",
						"sClass": "nohref starSelect",
						"mRender": function(aData) {
							if(aData!=true)
								return '<i class="splashy-star_empty mbox_star"></i>';
							else
								return '<i class="splashy-star_full mbox_star"></i>';
						},
						 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
							$(nTd).find('.mbox_star').on('click',function(){
								neutrino_mailbox.fnMarkFavourite(this,oData.userId,mailType);
							});
							
						  },
						"bSortable": true,
					},
					{ 	"mData": null,
						"sClass": "nohref",
						"mRender": function() {
							if(table==neutrino_mailbox.table_inbox){return '<i class="splashy-mail_light"></i>';}							
							else if(table==neutrino_mailbox.table_trash){return '<i class="splashy-mail_light_stuffed"></i>';}
							
						},
					},
					{ 
						"mData": "subject",
						"sClass": 'p-cursor',
						 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
							if(table==neutrino_mailbox.table_inbox){$(nTd).on('click',function(){rowCall(oData.userId,"inboxList");});}							
							else if(table==neutrino_mailbox.table_trash){$(nTd).on('click',function(){rowCall(oData.userId,"trashList");});$(nTd).addClass('mail-trash-acolor');}						 
						  },
						  "bSortable": true,
						  "bSearchable":true
					},
					
					{ "mData":"fromUser",
						"sClass": "nohref","bSortable": true
					},
					
					{ "mData": "msgSentTimeStamp","sClass": "nohref","bSortable": true},
					{ "mData": "mailNotificationPriority","sClass": "nohref","bSortable": true},
					{ "mData": null,"sClass": "nohref","bSortable": false,
						"mRender": function() {
						 return '';
						},
					},
				],			
		});
		// * copy actions buttons to datatable
		if(table==neutrino_mailbox.table_inbox){
			$('#mbox_inbox .dt_actions').html($('.dt_inbox_actions').html());
			neutrino_mailbox.actions();		
		}else if(table==neutrino_mailbox.table_trash){
			// * copy actions buttons to datatable
			$('#mbox_trash .dt_actions').html($('.dt_trash_actions').html());
			// * add tootlips for buttons
			$('#mbox_trash .dt_actions a').addClass('ttip_t');
			neutrino_mailbox.actions();
		}
		
	},
	
	initOutBoxDataTable : function(table,dataUrl){
		if($.fn.DataTable.isDataTable(table)){
			return ;
		}
		var userId ='';	
		var subjectClassColor='p-cursor';		
		$(table).dataTable({
			"aaSorting": [],
			"bDestroy": true,
			"bServerSide": true,
			"sDom" : '<"clear">f<"pull-right"l><>rt<"row"<"pull-left col-sm-6"i><"pull-right"p><"pull-right table-export-wrapper">>',		
			"sAjaxSource":contextPath+dataUrl,
			"sAjaxDataProp":"additionalDataMap",
			"aoColumnDefs": [
							  { 
								"bSortable": false, 
								"aTargets": [ 0,2] 
							}
						] ,
			"aoColumns": [
					{ 	
						
						"mData": "userId" ,
						"mRender": function(aData) {
							userId =aData;							
								return '<input type="checkbox" class="select_msg" name="msg_sel" onclick="return selectMsg('+aData+')" user_id="'+aData+'">';							
						},
						"sClass": "nohref",
					},
					
					{
						"mData": "favourite",
						"sClass": "nohref starSelect",
						"mRender": function(aData) {
							if(aData!=true)
								return '<i class="splashy-star_empty mbox_star"></i>';
							else
								return '<i class="splashy-star_full mbox_star"></i>';
						},
						 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
							$(nTd).find('.mbox_star').on('click',function(){
								neutrino_mailbox.fnMarkFavourite(this,oData.userId,'outbox');
							});
							
						  },
						"bSortable": true,
					},
					
					
					{ 	"mData": null,
						"sClass": "nohref",
						"mRender": function() {							
							return '<i class="splashy-mail_light_right"></i>';
						},
					},
					{ 
						"mData": "subject",
						"sClass": 'p-cursor',
						 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
							$(nTd).on('click',function(){rowCall(oData.userId,"outboxList");});$(nTd).addClass('mail-trash-acolor');
						  },
						   "bSortable": true
					},
					
					{ "mData":"toUser",
						"sClass": "nohref",  "bSortable": true
					},
					
					{ "mData": "msgSentTimeStamp","sClass": "nohref",  "bSortable": true},
					{ "mData": "mailNotificationPriority","sClass": "nohref",  "bSortable": true},
					{ "mData": null,"sClass": "nohref","bSortable": false,
						"mRender": function() {
						 return '';
						},
					},
				],			
		});
		$('#mbox_outbox .dt_actions').html($('.dt_outbox_actions').html());
		neutrino_mailbox.actions();		
	},

	
	fnMarkFavourite : function(obj,recordId,type){
		var ajaxdata={
				"userId" 	: recordId,
				"favourite"	: $(obj).hasClass('splashy-star_empty')
			}
			$.ajax({
				url : contextPath + "/app/email/"+type+"/favourite",
				type 		: 'POST',
				
				data 		:ajaxdata,
				async		:false,
				success 	: function(response) {
					if(response.error =="false"){
						$(obj).toggleClass('splashy-star_empty splashy-star_full');
					}else{
						new PNotify({
							title : 'Error',
							text : response.error,
							type : 'error',
							opacity : .8
						});
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
				}
			});
	},
	actions : function() {

		$('.table').on('mouseenter', '.starSelect', function() {
			if ($(this).children('i.splashy-star_empty').length) {
				$(this).children('i.mbox_star').css('visibility', 'visible');
			}
		}).on('mouseleave', '.starSelect', function() {
			if ($(this).children('i.splashy-star_empty').length) {
				$(this).children('i.mbox_star').css('visibility', '');
			}
		});

		$('.table').on(
				'click',
				'.select_msgs',
				function() {
					var tableid = $(this).data('tableid');
					$('#' + tableid).find('input[name=msg_sel]').prop(
							'checked', this.checked).closest('tr').addClass(
							'rowChecked')
					if ($(this).is(':checked')) {
						$('#' + tableid).find('input[name=msg_sel]').closest(
								'tr').addClass('rowChecked')
					} else {
						$('#' + tableid).find('input[name=msg_sel]').closest(
								'tr').removeClass('rowChecked')
					}
				});

		$('input[name=msg_sel]').on('click', function() {
			if ($(this).is(':checked')) {
				$(this).closest('tr').addClass('rowChecked')
			} else {
				$(this).closest('tr').removeClass('rowChecked')
			}
		});

		$(".dt_actions")
				.on(
						'click',
						'.delete_msg',
						function(e) {
						
							e.preventDefault();
							var tableid = $(this).data('tableid'), oTable = $(
									'#' + tableid).dataTable();
							if ($('input[name=msg_sel]:checked', '#' + tableid).length) {
								$('#msg_del_confirm').html('<P> Want to delete the mail? </P>');
								$('#msg_del_confirm').parents().eq(0).find('button ').first().focus();
								$("#msg_del_confirm").dialog('option', 'buttons', {
									
									"Confirm" : function() {
													e.preventDefault();
													deleteMsg();
													$(
															'input[name=msg_sel]:checked',
															oTable
																	.fnGetNodes())
															.closest(
																	'tr')
															.fadeTo(
																	300,
																	0,
																	function() {
																		$(
																				this)
																				.remove();
																		oTable
																				.fnDeleteRow(this);
																		$(
																				'.select_msgs',
																				'#'
																						+ tableid)
																				.prop(
																						'checked',
																						false);
																	});
																	
																
													 $(this).dialog("close");
													
															
											},
											 "Cancel" : function() {
										            $(this).dialog("close");
										            }
										});
								$("#msg_del_confirm").dialog("open");
							} else {
								$.sticky("Please select message(s) to delete.",
										{
											autoclose : 5000,
											position : "top-center",
											type : "st-info"
										});
							}
						});
	},
	msg_rowLink : function() {
		$('*[data-msg_rowlink]').each(
				function() {
					var target = $(this).attr('data-msg_rowlink');

					(this.nodeName == 'tr' ? $(this) : $(this).find(
							'tr:has(td)')).each(function() {
						var link = $(this).find(target).first();
						if (!link.length)
							return;

						var href = link.attr('href');

						$(this).find('td').not('.nohref').click(
								function() {
									// * coment $(link).tab('show') and uncoment
									// window.location
									// = href to open message in new window
									// window.location = href;
									$(link).tab('show');
									$('.mbox .nav-tabs > .active').removeClass(
											'active');
								});

						link.replaceWith(link.html());
					});
				});
	},
	new_message : function() {
		// * recipients
		$("#mail_recipients").tagHandler(
				{
					availableTags : [ 'email1@example.com',
							'email2@example.com', 'email3@example.com',
							'email4@example.com', 'email5@example.com' ],
					autocomplete : true
				});

		$('#new_message_form').submit(function(e) {
			return false;
		});

	}
};


//display the data inside  msg_view container
function viewMessage(recordId,mailListType,isContainerDisplayed){
	
	$.ajax({
		url : contextPath + "/app/email/viewMessage/"+ recordId +"/"+ mailListType,
		type : 'GET',
		async : false,
		dataType : 'json',
		success : function(object) {
			if(object.error=='false'){
				$('#subjectId').text(object.subject);
				$('#senderId').text(object.fromUser);
				$('#senderIdValue').text(object.fromUserId);
				$('#recipientId').text(object.toList);
				$('#recipientIdValue').text(object.toListId)
				$('#dateId').text(object.msgSentTimeStamp);
				$('#bodyId').html(object.body);
				$('#priorityId').text(object.mailNotificationPriority);
				$('#notificationId').text(object.notificationID);
				
				$('#previousUserId').val(object.previousMailUserId);
				$('#nextUserId').val(object.nextMailUserId);
				
				//display the container
				if(isContainerDisplayed==false){
					if($('.tab-content').find('.active')!='undefined'){
						$('.tab-content').find('.active').removeClass('active');
						$('#outbox, #inbox, #trash ').removeClass('active');
						$('#msg_view').addClass('active');
					}
				}
			}else{
				new PNotify({
					title : 'Error',
					text : object.error,
					type : 'error',
					opacity : .8
				});
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	});
}

function viewPrevious() {	
	viewMessage($('#previousUserId').val(),$('#mailListType').val(),true);
}

function viewNext() {	
	viewMessage($('#nextUserId').val(),$('#mailListType').val(),true);
}

function rowCall(recordId,mailListType) {
	$('#mailListType').val(mailListType);
	viewMessage(recordId,mailListType,false);
}


var curTab = "inbox";
$(function() {
	$(".mail_contain li").click(function() {

		curTab = $(this).attr("id");
	});
});

var idListInbox = [];
var idListOutbox = [];
var idListTrash = [];
var idList = [];

/* for selecting multiple messages or deselecting them */
function selectAllMsg() {
	if (curTab == "inbox") {
		idList = [];
		idListInbox = [];
		if (($('input[name=select_msgs_inbox]').is(':checked')) == true) {

			for (i = 0; i < $("#dt_inbox tbody tr").length; i++) {

				selectMsg($('#dt_inbox tbody tr:eq(' + i + ') > td input')
						.attr('user_id'));
			}
			idListInbox = idList;

		}
	} else if (curTab == "outbox") {
		idList = [];
		idListOutbox = [];
		if (($('input[name=select_msgs_outbox]').is(':checked')) == true) {

			for (i = 0; i < $("#dt_outbox tbody tr").length; i++) {

				selectMsg($('#dt_outbox tbody tr:eq(' + i + ') > td input')
						.attr('user_id'));
			}
			idListOutbox = idList;

		}
	}

	else if (curTab == "trash") {
		idList = [];
		idListTrash = [];
		if (($('input[name=select_msgs_trash]').is(':checked')) == true) {

			for (i = 0; i < $("#dt_trash tbody tr").length; i++) {

				selectMsg($('#dt_trash tbody tr:eq(' + i + ') > td input')
						.attr('user_id'));
			}
			idListTrash = idList;
		}

	}

}

/* for selecting id of individual messages */
function selectMsg(userId) {
	if (curTab == "inbox")
		idList = idListInbox;
	else if (curTab == "outbox")
		idList = idListOutbox;
	else if (curTab == "trash")
		idList = idListTrash;

	var item = userId;
	var flag = 0;
/*	$('input[user_id="'+userId+'"]').parents("tr").haveClass(' rowChecked')*/
	if (idList != "") {
		for ( var i = idList.length - 1; i >= 0; i--) {
			if (idList[i] == item) {
				flag = 1;

				idList.splice(i, 1);
			}

		}
	}

	if (flag == 0) {

		idList.push(userId);

	}

	if (curTab == "inbox") {
		idListInbox = idList;
	} else if (curTab == "outbox")
		idListOutbox = idList;
	else if (curTab == "trash")
		idListTrash = idList;
	
	
}

/* for deleting messages from inbox outbox or trash */
function deleteMsg() {
	
	if (curTab == "inbox") {
		idList = idListInbox;

		idList.push("1");
	} else if (curTab == "outbox") {
		idList = idListOutbox;

		idList.push("2");
	} else if (curTab == "trash") {
		idList = idListTrash;
		idList.push("3");
	}
	if (idList.length != 1) {
		$.ajax({
			url : contextPath + "/app/email/deleteMsg",
			type : 'POST',
			// contentType:'application/json',

			data : "idList=" + idList,

			success : function(data) {
				neutrinoNavigateTo(getContextPath()+ '/app/email/viewMailBox');
				//location.reload();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				
			}
		});
		
	}
	idList.length = 0;
}




function deleteMsgFromInside() {
	var notificationId= $('#notificationId').text();
	if (curTab == "inbox") {
		idList.push(notificationId);
		idList.push("1");
	} else if (curTab == "outbox") {
		idList.push(notificationId);
		idList.push("2");
	} else if (curTab == "trash") {
		//idList = notificationId;
		idList.push(notificationId);
		idList.push("3");
	}
	if (idList.length != 1) {
		$.ajax({
			url : contextPath + "/app/email/deleteMsg",
			type : 'POST',
			// contentType:'application/json',

			data : "idList=" + idList,

			success : function(data) {

				location.reload();
			},
			error : function(jqXHR, textStatus, errorThrown) {
			}
		});
	}
}


function forwardMsg(event, userProfileList) {
	if (curTab == "inbox")
		idList = idListInbox;
	else if (curTab == "outbox")
		idList = idListOutbox;

	var selectId = event.attr("id");
	if (idList != "") {
		$.ajax({
			url : contextPath + "/app/email/viewMessage/"   + userId + "/" + idList[0],
			type : 'GET',
			async : false,
			dataType : 'json',
			data : ({
				content_id : content_id,
				page : page
			}),
			success : function(object) {

				if (selectId == "forward" || selectId == "resend") {
					getForwardObject(object, userProfileList);
				} else if (selectId == "answer") {
					getReplyObject(object);
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {

			}
		});
	}
}

function getReplyObject(object) {
	var subjectFwd = object.subject;
	var senderFwd = object.fromUser;
	var receipentFwd = object.toList;
	var bodyFwd = object.body;
	var re1 = /<br>/gi;
	var re2 = /<br\/>/gi;
	bodyFwd = bodyFwd.replace(re1, "\r\n");
	bodyFwd = bodyFwd.replace(re2, "\r\n");
	var dateFwd = object.msgSentTimeStamp;
	var priorityFwd = object.mailNotificationPriority;
	$('.heading a:first').tab('show');
	$('#mail_recipients').html(
			'<option selected="selected">' + senderFwd + '</option>');
	$('#mail_subject').val('RE: ' + subjectFwd);
	$('#mailNotificationPriority').val(priorityFwd);
	$('#mail_message')
			.html(
					"\r\n\r\n\r\n\r\n------------------------------------------------------------------------\r\n"
							+ "Subject   "
							+ subjectFwd
							+ "\r\n"
							+ "Sender    "
							+ senderFwd
							+ "\r\n"
							+ "Recipient "
							+ receipentFwd
							+ "\r\n" + "Date      " + dateFwd + "\r\n" +

							bodyFwd + "\r\n");

}

function getForwardObject(object, userProfileList) {
	var subjectFwd = object.subject;
	var senderFwd = object.fromUser;
	var receipentFwd = object.toList;
	var bodyFwd = object.body;
	var re1 = /<br>/gi;
	var re2 = /<br\/>/gi;
	bodyFwd = bodyFwd.replace(re1, "\r\n");
	bodyFwd = bodyFwd.replace(re2, "\r\n");
	var dateFwd = object.msgSentTimeStamp;
	var priorityFwd = object.mailNotificationPriority;
	$('#mail_subject').val('FW: ' + subjectFwd);
	$('#mailNotificationPriority').val(priorityFwd);
	$('#mail_message')
			.html(
					"\r\n\r\n\r\n\r\n------------------------------------------------------------------------\r\n"
							+ "Subject   "
							+ subjectFwd
							+ "\r\n"
							+ "Sender    "
							+ senderFwd
							+ "\r\n"
							+ "Recipient "
							+ receipentFwd
							+ "\r\n" + "Date      " + dateFwd + "\r\n" +

							bodyFwd + "\r\n");
	$('.heading a:first').tab('show');

}

function forwardMessage(userProfileList) {
	var subject = $('#subjectId').html();
	var sender = $('#senderId').html();
	var receipent = $('#recipientId').html();
	var body = $('#bodyId').html();
	var re1 = /<br>/gi;
	var re2 = /<br\/>/gi;
	body = body.replace(re1, "\r\n");
	body = body.replace(re2, "\r\n");
	var date = $('#dateId').html();
	var priority = $('#priorityId').html();
	$('#mail_subject').val('FW: ' + subject);
	$('#mailNotificationPriority').val(priority);
	$('#mail_message')
			.html(
					"\r\n\r\n\r\n\r\n------------------------------------------------------------------------\r\n"
							+ "Subject   "
							+ subject
							+ "\r\n"
							+ "Sender    "
							+ sender
							+ "\r\n"
							+ "Recipient "
							+ receipent
							+ "\r\n" + "Date      " + date + "\r\n" +

							body + "\r\n");
	var userProfileList1 = userProfileList.replace("[","");
	userProfileList1 = userProfileList1.replace("]","");
	var objectList = userProfileList1.split(",");
	var elements = document.getElementById("mail_recipients").options;

    for(var i = 0; i < elements.length; i++){
      elements[i].selected = false;
    }
    $('#mail_recipients').trigger("chosen:updated");
	$('.heading a:first').tab('show');
}

function reply() {

	var subject = $('#subjectId').html();
	var sender = $('#senderId').html();
	var senderId= $('#senderIdValue').html();
	var receipent = $('#recipientId').html();
	var receipentId = $('#recipientIdValue').html();
	var body = $('#bodyId').html();
	var re1 = /<br>/gi;
	var re2 = /<br\/>/gi;
	body = body.replace(re1, "\r\n");
	body = body.replace(re2, "\r\n");

	body = body.replace('<br/>/g', '\r\n');
	body = body.replace('<br>/g', '\r\n');
	var date = $('#dateId').html();
	var priority = $('#priorityId').html();
	$('#mail_subject').val('RE: ' + subject);
	$('#mailNotificationPriority').val(priority);
	$('#mail_message')
			.html(
					"\r\n\r\n\r\n\r\n------------------------------------------------------------------------\r\n"
							+ "Subject   "
							+ subject
							+ "\r\n"
							+ "Sender    "
							+ sender
							+ "\r\n"
							+ "Recipient "
							+ receipent
							+ "\r\n" + "Date      " + date + "\r\n" +

							body + "\r\n");
	
	//document.getElementById('mail_recipients').options.length = 0;
	//$('#mail_recipients').attr("items", "")
	// $('#mail_recipients').attr( "disabled", "true" );
	//$('#mail_recipients').trigger("chosen:updated");
	$('#mail_recipients option').each(function() {
		if($(this).val() == senderId){
			 $(this).attr('selected', 'selected');
			 //$(this).addClass("active");
		}
		else {
			 $(this).removeAttr('selected');
		}
		
	});
	
	$('#mail_recipients').trigger("chosen:updated");
	/*$('#mail_recipients').append(
			'<option value=' + senderId + ' selected="selected">' + sender
					+ '</option>');*/
	//window.location.reload();
	//$('#newMsg').addClass("active");
	$('.heading a:first').tab('show');
}

function replyAll() {
	var subject = $('#subjectId').html();
	var sender = $('#senderId').html();
	var senderId= $('#senderIdValue').html();
	var receipent = $('#recipientId').html();
	var receipentId = $('#recipientIdValue').html();
	var body = $('#bodyId').html();

	var re1 = /<br>/gi;
	var re2 = /<br\/>/gi;
	body = body.replace(re1, "\r\n");
	body = body.replace(re2, "\r\n");

	body = body.replace('<br/>/g', '\r\n');
	body = body.replace('<br>/g', '\r\n');
	var date = $('#dateId').html();
	var priority = $('#priorityId').html();
	$('#mail_subject').val('RE: ' + subject);
	$('#mailNotificationPriority').val(priority);
	$('#mail_message')
			.html(
					"\r\n\r\n\r\n\r\n------------------------------------------------------------------------\r\n"
							+ "Subject   "
							+ subject
							+ "\r\n"
							+ "Sender    "
							+ sender
							+ "\r\n"
							+ "Recipient "
							+ receipent
							+ "\r\n" + "Date      " + date + "\r\n" +

							body + "\r\n");
	//$('#mail_recipients').attr("items", "")
	// $('#mail_recipients').attr( "disabled", "true" );
	/*$('#mail_recipients option').each(function() {
		$(this).remove();
	});
*/	var receipentList = receipent.split(",");
	var receipentIdList = receipentId.split(",");
	receipentList.push(sender)
	var	receipentListNew = receipentList.removeDuplicates();
	var	receipentIdListNew = receipentIdList.removeDuplicates();
	$('#mail_recipients option').each(function() {
			 $(this).removeAttr('selected');
	});
	for (i = 0; i < receipentListNew.length; i++) {
		/*$('#mail_recipients').append(
				'<option value=' + receipentIdListNew[i] + ' selected="selected">' + receipentListNew[i]
						+ '</option>');*/
		$('#mail_recipients option').each(function() {
			if($(this).val() == receipentIdListNew[i]){
				 $(this).attr('selected', 'selected');
			}
			
		});
		
	}
	$('#mail_recipients').trigger("chosen:updated");
	//window.location.reload();
	//$('#newMsg').addClass("active");
	$('.heading a:first').tab('show');
}

function formSend() {
	if ($('#mail_sender').val() == null) {
		return false;
	}
	$('#masterForm').submit();
}

Array.prototype.removeDuplicates = function (){
	  var temp=new Array();
	  this.sort();
	  for(i=0;i<this.length;i++)
		  {
	  if(this[i]==this[i+1]) {continue}
	  temp[temp.length]=this[i];
	  }
	  return temp;
	  } 


