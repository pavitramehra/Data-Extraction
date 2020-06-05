//on Load, focus on Login box's user name field //
$(document)
		.ready(
				function() {
					var labelCurrentlyDisabled = "<spring:message code='label.login.currently.disabled' javaScriptEscape='true' />"
					$('#username:text:first').focus();
					$('.currently-disabled-tooltip').tooltip({
						title : labelCurrentlyDisabled,
						placement : 'left'
					});
				});

//

function verifyUsernameAndMailId() {
        var userName = $("#userName").val();
        var userEmailId = $("#userEmailId").val();

        if(!userName || !userEmailId){
            $("#forgotPasswordInfo").hide();
            $('#forgotPasswordFailure').show();
            $('#forgotPasswordFailure').html(username_email_mandatory);
            $('#forgotPasswordSuccess').hide();
            return false;
        }

        $.ajax({
            url : getContextPath()+"/app/auth/forgotPassword",
            data : ({
                username : userName,
                mailId : userEmailId
            }),
            async : false,
            success : function(jqXHR) {
                $('#resetsecuritymainpage').html(jqXHR);
                var response = $('#message').val();
                var ldapResponse = $('#ldapMessage').val();

                    if (response == "failure") {
                        $("#forgotPasswordInfo").hide();
                        $('#forgotPasswordFailure').show();
                        $('#forgotPasswordFailure').html(user_name_no_match);
                        $('#forgotPasswordSuccess').hide();
                    } else {

                        if(ldapResponse != undefined && ldapResponse != "" ){
                        $("#forgotPasswordInfo").hide();
                        $('#forgotPasswordFailure').show();
                        $('#forgotPasswordFailure').html(ldapResponse);
                        $('#forgotPasswordSuccess').hide();
                        }
                        else {
                                if (response == "success") {
                                $('.bottom-top-header').hide();
                                $('#loginpage').hide();
                                $('#resetsecuritymainpage').show();
                                }
                                else if(response == "NoSecurityQuestionFound"){
                                $("#forgotPasswordInfo").hide();
                                $('#forgotPasswordSuccess').show();
                                $('#forgotPasswordSuccess').html(no_security_question_found_password_link_sent);
                                $('#forgotPasswordFailure').hide();
                                //$('#userName').clear();
                                $('#userName').val('');
                                //$('#userEmailId').clear();
                                $('#userEmailId').val('');
                                }
                                else
                                $("#forgotPasswordInfo").show();
                        }
                    }
            }
        });
}

/*$(document).ready(
		function() {

			if ($(window).width() <= 800) {

				$('.sys-offers div').removeClass('block-a-b');
				$(".block-inline.block-a").find("p").appendTo(
						"#accordionloandeals .accordion-toggle");
				$(".block-inline.block-a").appendTo(
						"#accordionloandeals .panel-body");
				$(".block-inline.block-b").find("p").appendTo(
						"#accordioncheckapp .accordion-toggle");
				$(".block-inline.block-b").appendTo(
						"#accordioncheckapp .panel-body");
				$('.sys-offers div').find(".block-inline.block-a").removeClass(
						'block-a').find(".round").removeClass('round');
				$('.sys-offers div').find(".block-inline.block-b").addClass(
						'row').removeClass('block-b').find(".round")
						.removeClass('round');
				$('.sys-offers div').removeClass('block-c');
				 $('.primary-nav li').removeClass('meg-drop');
				$('.primary-nav li div').removeClass('meg-content drop-one-columns');
				$('.primary-nav li').find("div.one-col").removeClass('one-col');
				$('.primary-nav li ul').removeClass('meg-links');
				$("#neutrino-mega-menu").removeAttr("id");
				$(".panel panel-primary").removeClass("block-no");

				$('.mid-body').find(".sys-offers").removeClass('sys-offers');
			}

		});*/
