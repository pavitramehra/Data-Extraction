var pswdValidFlag = false;

function change() {

	var radioClicked = $('input[name=IP]:checked', '#masterForm').val();
	 var form = document.getElementById("masterForm");
	if (radioClicked == "single") {
		$("#hiddenIP").val($('#ipaddress').val());

	}

	if (radioClicked == "range") {
		$("#hiddenIPfrom").val($('#ipaddressfrom').val());
		$("#hiddenIPto").val($('#ipaddressto').val());

	}
	
	 if(pswdValidFlag){
		
		 var formTemp = $("#masterForm");
		
		 formTemp.submit();
			// form.action="${pageContext.request.contextPath}/app/UserInfo/saveUser";
	}
	 else{
		 //form.action="";
		 notifyStatus('Not a Valid Password','failure');
		 return false;
	 }
	 
	

} 

function notifyStatus(message, success) {
	if(showNotifications=="true"){
		new PNotify({
			title : "",
			text : message,
			type : success,
			pnotify_animate_speed : fadeOutduration,
			opacity : .95
		});
	}
}

function rangeRadioClicked() {
	$("div#rangeIPDiv").show();
	$("div#singleIPDiv").hide();

	$("#fromIPAddress").removeAttr("disabled");
	$("#toIPAddress").removeAttr("disabled");
	$("#ipAddress").attr("disabled", "disabled");
}

function singleRadioClicked() {
	$("div#singleIPDiv").show();
	$("div#rangeIPDiv").hide();

	$("#fromIPAddress").attr("disabled", "disabled");
	$("#toIPAddress").attr("disabled", "disabled");
	$("#ipAddress").removeAttr("disabled");
}

$(document).ready(function() {
	 var validPasswordCode = function(value) {
			 var validPasswordCode = new RegExp(password_pattren);
			  
		  return validPasswordCode.test(value);

		}

	
	$.validator.addMethod("validPasswordCode", function(value, element) {

		  return validPasswordCode(value);

		},'' ); 
	
	$('#userName')
	.change(
			function() {

				var data;
				var userName = $("#userName").val();
				$
						.ajax({
							url : getContextPath()
									+ "/app/UserInfo/CheckUserName/"
									+ userName,
							type : 'GET',
							async : false,
							success : function(data) {
								$('.userNameAvailable').remove();

								
								$("#userName-control-group")
										.removeClass("error");
								$("#userName-control-group")
										.removeClass("success");
								if (data.status == "true") {
									userNameValidFlag = true;
									$('#userName').after(
											'<span for="teamDes" generated="true" class="userNameAvailable help-block">'
													+ data
													+ '</span>');
									$("#userName-control-group")
											.addClass("success");
									notifyStatus(data.message, "success");
								} else {
									userNameValidFlag = false;
									$('#userName').after(
											'<span for="teamDes" generated="true" class="userNameAvailable help-block">'
													+ data
													+ '</span>');

									setTimeout(
											function() {
												$(
														"#userName-control-group")
														.removeClass(
																"success");
												$(
														"#userName-control-group")
														.addClass(
																"error");
											}, 200);
									notifyStatus(data.message, "failure");

								}								
							},
							error : function(jqXHR, textStatus,
									errorThrown) {
								$('#avCheck').html(errorThrown);
								$('.userNameAvailable').remove();
							}
						});
			});

});

$(function() {
	$('#salutation').change(function() {

		var name0 = $('#salutation :selected').text();
		var name1 = $('#firstName').val();
		var name2 = $('#middleName').val();
		var name3 = $('#lastName').val();
		var name4 = $('#fourthName').val();

		if (name0 == "Select")
			name0 = "";

		if (name0.length > 0)
			name0 += " ";
		if (name1.length > 0)
			name1 += " ";
		if (name2.length > 0)
			name2 += " ";
		if (name3.length > 0)
			name3 += " ";
		if (name4.length > 0)
			name4 += " ";

		var fullname = "" + name0 + name1 + name2 + name3 + name4;

		$('#fullName').val(fullname);
	});
});

$(function() {
	$('#firstName').keyup(function() {

		var name0 = $('#salutation :selected').text();
		var name1 = $('#firstName').val();
		var name2 = $('#middleName').val();
		var name3 = $('#lastName').val();
		var name4 = $('#fourthName').val();

		if (name0 == "Select")
			name0 = "";

		if (name0.length > 0)
			name0 += " ";
		if (name1.length > 0)
			name1 += " ";
		if (name2.length > 0)
			name2 += " ";
		if (name3.length > 0)
			name3 += " ";
		if (name4.length > 0)
			name4 += " ";

		var fullname = "" + name0 + name1 + name2 + name3 + name4;

		$('#fullName').val(fullname);
	});
});

$(function() {
	$('#middleName').keyup(function() {
		var name0 = $('#salutation :selected').text();
		var name1 = $('#firstName').val();
		var name2 = $('#middleName').val();
		var name3 = $('#lastName').val();
		var name4 = $('#fourthName').val();

		if (name0 == "Select")
			name0 = "";

		if (name0.length > 0)
			name0 += " ";
		if (name1.length > 0)
			name1 += " ";
		if (name2.length > 0)
			name2 += " ";
		if (name3.length > 0)
			name3 += " ";
		if (name4.length > 0)
			name4 += " ";

		var fullname = name0 + name1 + name2 + name3 + name4;

		$('#fullName').val(fullname);
	});
});

$(function() {
	$('#lastName').keyup(function() {
		var name0 = $('#salutation :selected').text();
		var name1 = $('#firstName').val();
		var name2 = $('#middleName').val();
		var name3 = $('#lastName').val();
		var name4 = $('#fourthName').val();

		if (name0 == "Select")
			name0 = "";

		if (name0.length > 0)
			name0 += " ";
		if (name1.length > 0)
			name1 += " ";
		if (name2.length > 0)
			name2 += " ";
		if (name3.length > 0)
			name3 += " ";
		if (name4.length > 0)
			name4 += " ";

		var fullname = name0 + name1 + name2 + name3 + name4;

		$('#fullName').val(fullname);
	});
});

$(function() {
	$('#fourthName').keyup(function() {

		var name0 = $('#salutation :selected').text();
		var name1 = $('#firstName').val();
		var name2 = $('#middleName').val();
		var name3 = $('#lastName').val();
		var name4 = $('#fourthName').val();

		if (name0 == "Select")
			name0 = "";

		if (name0.length > 0)
			name0 += " ";
		if (name1.length > 0)
			name1 += " ";
		if (name2.length > 0)
			name2 += " ";
		if (name3.length > 0)
			name3 += " ";
		if (name4.length > 0)
			name4 += " ";

		var fullname = name0 + name1 + name2 + name3 + name4;

		$('#fullName').val(fullname);
	});
});


function validatePassword(passwordEntered) {
		$
				.ajax({
					type : "POST",
					url : getContextPath()+"/app/UserInfo/validatePassword",
					async : false,
					data : "passwordEntered=" + passwordEntered + "&username=" + $("#userName").val(),
					success : function(response) {
						pswdValidFlag = true;
						
						$('#password').next().remove();
						if(response!=""){
							
							response = response.replace(/\n/g, "<br />");
							pswdValidFlag = false;
							$('#password').after(
									'<div for="teamDes" generated="true" class="help-block">'
											+ response + '</div>');
							$('.help-block').css("white-space","nowrap").css('color','#a94442');
							
							$("#password").removeClass("success");
							$("#password").addClass("error");
							
						}
						else{								
							
							$('#password').after(
									'<span for="teamDes" generated="true" class="help-block"><b>'
											+ 'Password Valid' + '</b></span>');
							$('.help-block').css("white-space","nowrap").css('color','#4cae4c');				
							$("#password").addClass("success");
							$("#password").removeClass("error");
							$(".passwordfocus").removeClass("outset-shadow-focus");
							
						}
							
						
					}
				});
	}

function passwordAndRetypePasswordMatch(pass,pass2){
	$('.retypePassword').remove();
	if (pass == pass2) {
		$('#retype_Password').after(
						'<span for="teamDes" generated="true" class="retypePassword help-block">'
								+ 'Passwords Match'
								+ '</span>');
		$("#retypepassword-control-group").addClass(
				"success");

	} else {

		$('#retype_Password').after(
				'<span for="teamDes" generated="true" class="retypePassword help-block">'
						+ 'Passwords Do Not Match'
						+ '</span>');

		setTimeout(function() {
			$("#retypepassword-control-group")
					.removeClass("success");
			$("#retypepassword-control-group")
					.addClass("error");
		}, 200);

	}
	
}

$(function() {
	
 	$('#password').blur(function() {
		var pass = $('#password').val();
		var pass2 = $('#retype_Password').val();
		if(pass!="" && pass2!=""){
			passwordAndRetypePasswordMatch(pass,pass2);
		}
	});
	
 	$('#retype_Password').blur(function() {
		var pass = $('#password').val();
		var pass2 = $('#retype_Password').val();
		if(pass!="" || pass2!=""){
			passwordAndRetypePasswordMatch(pass,pass2);
		}
	});
		
	//controller side validation
	$("#password").blur(function(event) {
		var pswdEntered = $(this).val();
		validatePassword(pswdEntered);
	});
	
	$("#password_info").hover(function()
			{
		
		$("#password_info").popover({
			trigger: "mouseenter mouseleave",
			html:true,
			title: password_essentials,
		    content:function() {
		    	return $('#password_info_content').html();
		    },
			placement : "top"
		});
		
			});
	
	
	//client side validation
	
});