/**
 * 
 */
/* for Global webSocket */
$(document).ready(
		function() {

			/*
			 * $(document).on("click", '.chat .chatHeader', function() {
			 * $(this).siblings().toggleClass('minimized'); });
			 */

			$(document).on("click", '.chat .chatHeader .close', function(obj) {
				$(this).parents('.chat').addClass('hide');
			});

			/* Group Chat */
			$(document).on("click", '.chat .addToChat', function(obj) {
				chatId = $(this).parents('.chat').attr('id').substr(4);
				showGroupChatModal(chatId);
			});

			$(document).on("keypress", '.chatmsg', function(obj) {
				if (obj.keyCode == 13) {
					chatId = $(this).parents('.chat').attr('id').substr(4);
					sendChatMessage(chatId);
					$(this).val("");
				}
			});

			/* for getting history */
			$(document).on(
					"click",
					'.chat .chatArea li .7Day',
					function(obj) {
						chatId = $(this).parents('.chat').attr('id');
						$(this).parents('.chat').children('.chatArea')
								.children('.older').html("");
						getHistory(chatId, $(this).parents('.chat').children(
								'.chatHeader').children('h1').html(), 7);
						$(this).parents('.chat').children('.chatArea')
								.children('.historyAction').children('ul')
								.children('li').toggleClass('disabled');
					});

			$(document).on(
					"click",
					'.chat .chatArea li .30Day',
					function(obj) {
						chatId = $(this).parents('.chat').attr('id');
						$(this).parents('.chat').children('.chatArea')
								.children('.older').html("");
						getHistory(chatId, $(this).parents('.chat').children(
								'.chatHeader').children('h1').html(), 30);
						$(this).parents('.chat').children('.chatArea')
								.children('.historyAction').children('ul')
								.children('li').toggleClass('disabled');
					});

			$(document).on(
					"click",
					'.chat .chatArea li .removeHistory',
					function(obj) {
						$(this).parents('.chat').children('.chatArea')
								.children('.older').html("");
						$(this).parents('.chat').children('.chatArea')
								.children('.historyAction').children('ul')
								.children('li').toggleClass('disabled');
					});

			/* initiating websocket */

			socket = new SockJS(ctx + '/app/webSocketEndPoint');
			stompClient = Stomp.over(socket);
			stompClient.connect('', '', function(frame) {
				// setConnected(true);
				console.log('Connected: ' + frame);
				// alert(frame);
				suffix = frame.headers['user-name'];
				stompClient.subscribe('/topic/greetings' + suffix, function(
						greeting) {
					showGreeting(JSON.parse(greeting.body));
				});
			});

		});

function showGroupChatModal(chatId) {
	$('#currentChat').val(chatId);

	$.ajax({

		url : ctx + "/app/chat/loadLoggedinUsers",
		data : ({
			'chatId' : chatId
		}),
		success : function(jqXHR) {
			$('#modal_body_onlineUsers').html(jqXHR);
			// $('#modal_body_onlineUsers').
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.sticky($('#failureDiv').val(), {
				data : 10000,
				position : "top-center",
				type : "st-error"
			});
		}
	});

	$('#UsersLoggedIn').modal('show');
}

function showGreeting(greeting) {
	console.log('inside global receiver for a user')
	if (greeting.header == 'newChat' || greeting.header == 'newGroupChat') {
		initiateChat(greeting, greeting.fromUser);
	}
}

function ifexistChatFromUser(user) {
	if ($(".chat h1#" + user).length != 0) {
		$(".chat h1#" + user).parents('.chat').removeClass('hide');
		console.log("chat with " + user + " already openned");
		return true;
	}
	return false;
}

function initiateChat(message, header) {
	if (ifexistChatFromUser(header) && $(".chat#" + message.chatId).length != 0) {
		return;
	}
	elemStr = "<div id='chat" + message.chatId + "' />"
	elem = $(elemStr).addClass('hide').addClass('chat');
	elem
			.append($("<div class='chatHeader'/>")
					.append($("<h1 id='" + header + "'/>").append(header))
					.append(
							$("<div class=\"right\">"
									+ "<a class=\"close\" title='Close this chat'><i class=\"glyphicon glyphicon-remove-sign\"></i></a></div>")));
	elem
			.append($("<div class='chatArea'>"
					+ "<div class='older'/>"
					+ "<div class='historyAction'>"
					+ "<ul class='nav nav-pills'>"
					+ "<li><a class='7Day'>7 days</a></li>"
					+ "<li><a class='30Day'>30 days</a></li>"
					+ "<li class='disabled'><a class='removeHistory'>Clear History</a></li>"
					+ "</ul>" + "</div>" + "</div>"));
	/*
	 * elem.append($("<input id='fromUser'/>").val(message.fromUser));
	 * elem.append($("<input id='toUser'/>").val(message.toUser));
	 */
	elem
			.append($("<input class='chatmsg' placeholder='Send a Message'/><a class=\"addToChat\" title='Add a user to this chat'><i class=\"glyphicon glyphicon-plus-sign\"></i></a>"));
	/*
	 * buttonStr = "<button
	 * onclick=\"sendChatMessage('"+message.chatId+"')\">Send</button>";
	 * console.log(buttonStr); elem.append($(buttonStr));
	 */
	elem.appendTo($('#chatContainer'));

	// listening to websocket
	console.log('/topic/greetings' + message.chatId);
	stompClient.subscribe('/topic/greetings' + message.chatId,
			function(message) {
				addChat(JSON.parse(message.body));
			});
}

function getHistory(chatId, username, noOfDays) {
	$.ajax({
		url : ctx + "/app/chat/gethistory",
		data : ({
			'fromUser' : sessionuser,
			'toUser' : username,
			'noOfDays' : noOfDays,
			'chatId' : chatId.substr(4)
		}),
		success : function(data) {

			console.log('history from client successfull');
			data.forEach(function(obj) {
				addOldChat(chatId, obj);
			});
		}
	});
}

function sendChatMessage(chatId) {
	elem = $("#chat" + chatId);
	cntnt = elem.children('.chatmsg').val();
	if (!cntnt.trim())
		return;
	
	  /*stompClient.send("/app/webSocketEndPoint", {},
	  	JSON.stringify({
			'header' : "chatmessage",
			'chatId' : chatId,
			'fromUser' : sessionuser,
			'toUser' : elem.children('.chatHeader').children('h1').html(),
			'content' : cntnt,
		}));*/
	 
	$.ajax({
		url : ctx + "/app/webSocketEndPoint",
		data : ({
			'header' : "chatmessage",
			'chatId' : chatId,
			'fromUser' : sessionuser,
			'toUser' : elem.children('.chatHeader').children('h1').html(),
			'content' : cntnt
		}),
		success : function(data) {
			console.log(data + 'from client');
		}
	});
}

function openChat(username) {
	if (ifexistChatFromUser(username)) {
		return;
	}
	$.ajax({
		url : getContextPath() + "/app/chat/openChat/",
		data:{"toUser":username},
		success : function(data) {
			console.log(data + 'from client');
			// initiate chat on fromUser
			initiateChat(data, username);
			chatId = "#chat" + data.chatId;
			$(chatId).removeClass('hide');

		}
	});
}

function addUserToChat(username) {

	chatId = $('#currentChat').val();

	$.ajax({
		url : getContextPath() + "/app/chat/addUserToChat/",
		data : ({
			'addUser' : username,
			'chatId' : chatId,
			'fromUser' : sessionuser,
		}),
		success : function(data) {
			console.log(username + ' added to chat' + chatId);
			new PNotify({
				title : "User Added",
				text : username + " added to this chat successfully",
				type : "success",
				opacity : .8
			});
			// initiate chat on fromUser
			/*
			 * initiateChat(data, username); chatId = "#chat" + data.chatId;
			 * $(chatId).removeClass('hide');
			 */
			$('#UsersLoggedIn').modal('hide');
		},
		error : function(data) {
			new PNotify({
				title : "User Added",
				text : username + " not added to this chat. Please try again",
				type : "error",
				opacity : .8
			});
			// initiate chat on fromUser
			/*
			 * initiateChat(data, username); chatId = "#chat" + data.chatId;
			 * $(chatId).removeClass('hide');
			 */
			$('#UsersLoggedIn').modal('hide');
		}
	});
}

function createMessageElem(message) {
	elem = $("<div class='chatMessageContainer'/>");
	if (message.fromUser == sessionuser) {
		elem.addClass('myChat');
	} else {
		elem.addClass('hisChat');
	}
	elem.append($("<div class='avatar'><img src=''  alt='" + message.fromUser
			+ "'/></div>"));// to add avatar in future.
	elem.append($("<div class='chatMessage'/>").append(message.content).append(
			$("<div class='time'/>").append(
					new Date(message.time.millis).toLocaleString())));
	return elem;
}

function addChat(message) {
	if (message.header == 'chatmessage') {
		elem = createMessageElem(message);
		chatId = "#chat" + message.chatId;
		$(chatId).removeClass('hide').children('.chatArea').append(elem)
				.animate(
						{
							scrollTop : $(chatId).removeClass('hide').children(
									'.chatArea').children().height()
						}, 1000);
		;

	}
}
function addOldChat(chatId, message) {
	if (message.header == 'chatmessage') {
		elem = createMessageElem(message);
		// chatId = "#chat" + chatId;
		$("#" + chatId).removeClass('hide').children('.chatArea').children(
				'.older').append(elem).animate(
				{
					scrollTop : $(chatId).removeClass('hide').children(
							'.chatArea').children().height()
				}, 1000);
		;

	}
}