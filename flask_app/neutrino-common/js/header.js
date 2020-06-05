/**
 * Js code for file neutrino-core-web\src\main\webapp\WEB-INF\jsp\common\header.jsp
 */


function rightClickStatus(){
	try{
		if(VAR_HEADER_rightClickStatus == 'true' || VAR_HEADER_rightClickStatus == 'TRUE'){
			$(document).ready(function(){
				$(document).bind("contextmenu",function(e){
				e.preventDefault();
				  });
				 });
		}
	
	}
	catch(err){}
}

$(document).ready(function() {
	
	
	rightClickStatus();
	/* autoFillStatus(); */
	$(document).on('focus', 'form', function() {
		if(autoFillFlag == 'false' || autoFillFlag == 'FALSE'){
	  $(this).attr('autocomplete', 'off');
	  }
	  }); 

	/* showMessageCount_topBar(); */	
	$("#last_login").tooltip();
	/* getUserFav();
	showLoggedinUsers(); */
	
	/* showTime_topBar(); */
		
	if(VAR_HEADER_userBranchListSize==0)
	{
		$.sticky("No Branch associated with User!!", {autoclose : 30000, position: "top-center", type: "st-failure" }); 
 		 document.getElementById('logout').click();
	}	
	if(VAR_HEADER_userBranchListSize>0)
	{
		
		$('#loggedInBranch').html(VAR_HEADER_loggedInBranchName);
	}
	$('#changePasswordForm').validate(
			{

				errorClass : "help-block",
				errorElement : "span",
				highlight : function(element,
						errorClass, validClass) {
					$(element)
							.parents('.form-group')
							.addClass('error');
					$(element)
							.parents('.form-group')
							.removeClass('success');
				},
				unhighlight : function(element,
						errorClass, validClass) {
					$(element)
							.parents('.form-group')
							.removeClass('error');
					$(element)
							.parents('.form-group')
							.addClass('success');
				},
				invalidHandler : function(form,
						validator) {
					$
							.sticky(
									error_message,
									{
										autoclose : 5000,
										position : "top-right",
										type : "st-error"
									});
				}

			});
	                                                       
	
});







	
	function openPreferences() {
		$.ajax({
			url : getContextPath()+"/app/configuration/load",
				type : 'POST',
				async : false,
				success : function(jqXHR) {
					$('#modal_body_preference').html(jqXHR);
				},
				error : function(jqXHR, textStatus, errorThrown) {
				 	alert(jqXHR + " : " + textStatus + " : " + errorThrown); 
				}
			});
		$('#preference-form').modal('show');
	}
	function closePreferences(){
		$('#preference-form').modal('hide');
		window.location.reload();
	}
	function savePreferences(){
		$.ajax({
			url : getContextPath()+"/app/configuration/save",
			type : 'POST',
			async : false,
			data : $('#preferencesForm').serialize(),
			success : function(message) {
				location.reload();
				if(showNotifications=="true"){
					new PNotify({
						title : data_saved,
						text : message,
						type : success,
						opacity : .8
					});
				}				
				/* showMyFav(); */
			},
			error : function(jqXHR, textStatus, errorThrown) {
				if(showNotifications=="true"){
					new PNotify({
						title : some_errror_occured,
						text : try_again,
						type : 'error',
						opacity : .8
					});
				}
			}
		});
		closePreferences();
	}	
	
				
		<!--Function to load  user Activity Log Table Data-START-->	
								
		function getUserLog()
		{
		$.ajax({
		    type: "GET",            
		    url:getContextPath()+"/app/securitytrail/viewlog",
		    dataType: 'json',
		    success: function(data){
		    	var logData="";
		    	for (var i = 0; i < data.length; i++) 
		    	{logData+="<tr>"+"<td>"+data[i].Username+"</td>"+"<td>"+data[i].Activity+"</td>"+"<td>"+data[i].Status+"</td>"+
		    		"<td>"+data[i].RemoteIpAddress+"</td>"+"<td>"+data[i].Date+"</td>"+"<td>"+data[i].Time+"</td>"+"</tr>";				    		
		    	}		    		
		    	$("#log_modal_table tbody").html(logData);		    
		    },
		     error: function(){
					$.sticky(no_data_from_server, {autoclose : 5000, position: "top-right", type: "st-error" });
		      				   }
				});
		}
		
								<!--Function to load  Last Login Activity Log Table Data-START-->
								
		
		function openLogDialog() {
			$('#log_modal').modal('show');
			getUserLog();
		}
		function closeLogDialog() {
			$('#log_modal').modal('hide');
		}
		function 	openLicenseDialog()
		{
			$('#license_info_modal').modal('show');
			getLicenseLog();
		}
		function closeLicenseDialog() {
			$('#license_info_modal').modal('hide');
		}
	

		function upgradeLicense()
		{
			neutrinoNavigateTo(getContextPath() + "/app/systemSetup/license/updateLicense");
			

		}
		
		function getLicenseLog()
		{
		$.ajax({
		    type: "GET",            
		    url:getContextPath()+"/app/systemSetup/license/getDetails",
		   
		    success: function(data){
		    		    		
		    	$("#license_info_modal_body").html(data);
		    },
		     error: function(){
					$.sticky(no_data_from_server, {autoclose : 5000, position: "top-right", type: "st-error" });
		      				   }
				});
		}
		function showLoggedinUsers() {
			//when no open and active class
			if(!$("#onlineContactAnchor").parent().hasClass("open") || !$("#onlineContactAnchor").parent().hasClass("active")) {
				$.ajax(
						{
							url : getContextPath()+"/app/loadLoggedinUsers",
							type : 'GET',
							success : function(jqXHR) {							
								$('#loggedInUsersId').html(jqXHR);	
							 	$("#sidebar").removeClass("menu-min");
								$("#neutrino-body").removeClass();
								$("#neutrino-body").addClass("col-sm-12");  
								$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
								$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
								$("#onlineContactAnchor").parent().addClass("open");
								$("#onlineContactAnchor").parent().addClass("active");
								$("ul #onlineContacts").show();  
								$("#onlineContactAnchor .arrow").removeClass("glyphicon-chevron-right");
								$("#onlineContactAnchor .arrow").addClass("glyphicon-chevron-down");
							},
							error : function(jqXHR, textStatus, errorThrown) {
								 $.sticky($('#failureDiv').val(), {data : 10000, position: "top-center", type: "st-error" });
							} 
						});
				}
			//when has open and active class but no menu-min class means already expanded	
		  	else if(($("#onlineContactAnchor").parent().hasClass("open") || $("#onlineContactAnchor").parent().hasClass("active")) && (!$("#sidebar").hasClass("menu-min"))){
				$("#onlineContactAnchor").parent().removeClass("open");
				$("#onlineContactAnchor").parent().removeClass("active");
				$("ul #onlineContacts").hide(); 
				$("#onlineContactAnchor .arrow").removeClass("glyphicon-chevron-down");
				$("#onlineContactAnchor .arrow").addClass("glyphicon-chevron-right");
			}
			//when has open and active class and has menu-min class means not expanded now have to be expanded
			else if(($("#onlineContactAnchor").parent().hasClass("open") || $("#onlineContactAnchor").parent().hasClass("active")) && ($("#sidebar").hasClass("menu-min"))){
				  $("#neutrino-body").removeClass();
					$("#neutrino-body").addClass("col-sm-12");  
				$("#fw-bw-icon").removeClass("glyphicon glyphicon-forward");
				$("#fw-bw-icon").addClass("glyphicon glyphicon-backward");
				$("#sidebar").removeClass("menu-min");
				$("#onlineContactAnchor").parent().addClass("open");
				$("#onlineContactAnchor").parent().addClass("active");
				$("ul #onlineContacts").show();
				$("#onlineContactAnchor .arrow").removeClass("glyphicon-chevron-right");
				$("#onlineContactAnchor .arrow").addClass("glyphicon-chevron-down");
			}  
			
		}	
		
		function openPswdDialog(){
			$('#changePasswordForm')[0].reset();
			$('#resetPassword_modal').modal('show');
		}	   		
		function closePswdDialog(){
			$('#resetPassword_modal').modal('hide');
		}	   		
		function resetPassword(){
			 if($("#changePasswordForm").valid()){
				 $.ajax({
					 url :getContextPath()+"/app/UserInfo/resetPassword",
						type : 'GET',
						data : $("#changePasswordForm").serialize(),
						success : function(response) {	
							if(response=="success"){
								$.sticky("Password Changed Successfully", {data : 10000, position: "top-center", type: "st-success" });
							}
							else{
								$.sticky("Password cannot be Changed", {data : 10000, position: "top-center", type: "st-error" });
							}
							closePswdDialog();
						},
						error : function(jqXHR, textStatus, errorThrown) {
							 $.sticky('Some error occured', {data : 10000, position: "top-center", type: "st-error" });
						}
				 })				 
			} 
			
		}	
		function checkInBranch(branchId,branchName,allBranchesFlag) {
		
			$.ajax({
				url : getContextPath()+"/app/UserInfo/setloggedinbranch",
				data : ({
					branchId : branchId,
					allBranchesFlag : allBranchesFlag
				}),
				success : function(data) {		
					
				}	
			});	
			$('#loggedInBranch').html(branchName);
			setTimeout(function() {
			 location.reload();
			}, 500);

		}
		function validatePassword(passwordEntered) {
			$
					.ajax({
						url : getContextPath()+"/app/UserInfo/validatePassword",
						async : false,
						data : "passwordEntered=" + passwordEntered,
						success : function(response) {
							pswdValidFlag = true;
							$('#changedPassword').next().remove();
							if (response == "true") {
								$('#changedPassword').after(
										'<span for="teamDes" generated="true" class="help-block"><b>'
												+ 'Password Valid' + '</b></span>');
								$("#changedPassword-control-group").addClass("success");
								$("#changedPassword-control-group").removeClass("error");
								$(".passwordfocus").removeClass("outset-shadow-focus");

							} else {
								pswdValidFlag = false;
								$('#changedPassword').after(
										'<span for="teamDes" generated="true" class="help-block">'
												+ 'Password Invalid' + '</span>');
								$('.help-block').css("white-space","nowrap");
								setTimeout(function() {
									$("#changedPassword-control-group").removeClass(
											"success");
									$("#changedPassword-control-group").addClass("error");
								}, 200);
							}
						}
					});
		}
		$(function() {			
			//controller side validation
			$("#changedPassword").blur(function(event) {
				var pswdEntered = $(this).val();
				validatePassword(pswdEntered);
			});			
			//client side validation
			$("#changedPassword").keyup(
					function(event) {
						var pswdPattern = new RegExp(password_pattren);
						var pswdEntered = $(this).val();
						$('#changedPassword').next().remove();
						if (pswdEntered.match(pswdPattern)) {
							pswdValidFlag = true;
							$('#changedPassword').after(
									'<span for="teamDes" generated="true" class="help-block"><b>'
											+ 'Password Valid' + '</b></span>');
							$("#changedPassword-control-group").addClass("success");
							$("#changedPassword-control-group").removeClass("error");
							$(".passwordfocus").removeClass("outset-shadow-focus");
						} else {
							pswdValidFlag = false;
							$('#changedPassword').after(
									'<span for="teamDes" generated="true" class="help-block">'
											+ 'Password Invalid' + '</span>');
							$('.help-block').css("white-space","nowrap");
							setTimeout(
									function() {
										$("#changedPassword-control-group").removeClass(
												"success");
										$("#changedPassword-control-group").addClass(
												"error");
									}, 200);
						}

					});
			//retype new Password
			$('#retypePassword')
			.keyup(
					function() {
						var pass = $('#password').val();
						var pass2 = $('#retypePassword').val();

						$('#retypePassword').next().remove();
						if (pass == pass2) {
							$('#retypePassword')
									.after(
											'<span for="teamDes" generated="true" class="help-block">'
													+ 'Passwords Match'
													+ '</span>');
							$("#retypepassword-control-group").addClass(
									"success");
						} else {
							$('#retypePassword').after(
									'<span for="teamDes" generated="true" class="help-block">'
											+ 'Passwords Do Not Match'
											+ '</span>');
							setTimeout(function() {
								$("#retypepassword-control-group")
										.removeClass("success");
								$("#retypepassword-control-group")
										.addClass("error");
							}, 200);
						}
					});
		});
		function switchLocale(locale){
			neutrinoNavigateTo(getContextPath()+ "/app/dashboard" + "?lang="+ locale);
		}	   

function Encrypt(plainText,crackIt)
{
	var passPhrase = crackIt;
	var aesUtil = new AesUtil();
	var encrypt = aesUtil.encrypt(passPhrase, plainText);
	return encrypt;
}

function resetUserPassword(crack) {
		var oldPassword = $("#oldUserPassword").val();
		var changedPassword = $("#newUserPassword").val();
		var confirmPassword = $("#confirmPassword").val();

		if ((changedPassword == confirmPassword) && oldPassword
				&& changedPassword && confirmPassword && pswdValidFlag) {
			oldPassword = Encrypt(oldPassword,crack);
			oldPassword = encodeURIComponent(oldPassword);
			changedPassword = Encrypt(changedPassword,crack);
			changedPassword = encodeURIComponent(changedPassword);

			$
					.ajax({
						type : "POST",
						url : getContextPath()
								+ "/app/UserInfo/resetPasswordForDBUsers",
						data : {'oldPassword':oldPassword,
								'changedPassword':changedPassword},
						success : function(result) {
							if (result == "success") {
								showResetPasswordNotifications("Success",
										"success",
										"Password has been reset successfully. Please login again");
								$("#reset-password-button-div").addClass(
										"hidden");
								$("#go-to-login-page-div")
										.removeClass("hidden");
							} else {
								showResetPasswordNotifications("Failure",
										"error",
										result);
							}
						},
						error : function(result) {
						}
					});
		} else {
			if(pswdValidFlag || !(oldPassword
                && changedPassword && confirmPassword)){
                if(!oldPassword)
                    showResetPasswordNotifications("Failure", "error",
                        "Please enter old password");
                else if(!changedPassword)
                    showResetPasswordNotifications("Failure", "error",
                    "Please enter new password");
                else if(!confirmPassword)
                    showResetPasswordNotifications("Failure", "error",
                    "Please confirm your password");
            }
		}
	}



	function validatePassword(passwordEntered) {
    			$
    					.ajax({
    						type : "POST",
    						url : getContextPath()+"/app/UserInfo/validatePassword",
    						async : false,
    						data : "passwordEntered=" + passwordEntered + "&username=" + userName,
    						success : function(response) {
    							pswdValidFlag = true;

    							$('#newUserPassword').next().remove();
    							if(response!=""){

    								response = response.replace(/\n/g, "<br />");
    								pswdValidFlag = false;
    								$('#newUserPassword').after(
    										'<div for="teamDes" generated="true" class="help-block col-sm-12" style="margin: auto; color:#b94a48">'
    												+ response + '</div>');
    								$('.help-block').css("white-space","nowrap");


    							}
    							else{

    								$('#newUserPassword').after(
    										'<span for="teamDes" generated="true" class="help-block col-sm-12" style="margin: auto; color:green">'
    												+ 'Password Valid' + '</span>');

    								$(".passwordfocus").removeClass("outset-shadow-focus");

    							}


    						}
    					});
    		}
 		var pswdValidFlag=false;

 		function showResetPasswordNotifications(title, type, message) {
        		//$("#resetPasswordModalBody").find("input[type=password]").val("");
        		$("#confirmPassword-control-group").find(".help-block").hide();
        		$("#confirmPassword-control-group").removeClass("success");
        		$("#confirmPassword-control-group").removeClass("error");
        		new PNotify({
        			title : title,
        			text : message,
        			type : type,
        			pnotify_animate_speed : fadeOutduration,
        			opacity : .8
        		});
        	}


