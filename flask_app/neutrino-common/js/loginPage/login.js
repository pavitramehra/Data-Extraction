function LogInSubmit(crack)
{	
	copyvalues();
	var passwd = login_form.password.value;
	try{
		
		passwd = Encrypt(passwd,crack);
		passwd = encodeURIComponent(passwd);
		login_form.password.value = passwd;
		document.getElementById("loginbutton").disabled=true;
		login_form.submit();
	}
	catch(err)
	{
		$.sticky("Some thing went wrong, Please try again", {
			autoclose : 5000,
			position : "top-right",
			type : "st-error"
		});
	}
	
	return false; //To prevent double form submission in IE.	
}
function submitLoanStatusForm() {
	if ($("#status_form").valid()) {
		var mobileNumber = $('#mobile_Id').val();
		var emailAddress = $('#email_Id').val();
		console.log(mobileNumber.length > 0 || emailAddress.length > 0);
		if (mobileNumber.length > 0 || emailAddress.length > 0) {
			$("#status_form").submit();
		} else {
			console.log("Please enter either Mobile Number or Email Address.");
			$.sticky(label_mobile_or_email_required, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
	}
}

function Encrypt(plainText,crackIt)
{
	var passPhrase = crackIt;
	var aesUtil = new AesUtil();
	var encrypt = aesUtil.encrypt(passPhrase, plainText);
	return encrypt;	    
}

function askSecurityQuestions(){
	$("#security_question_form").submit();
}

function copyvalues(){
    //copy value from show username field to actual username field.
    document.getElementById("username").value =
                document.getElementById("username_show").value;
    $("#username_show").val("");
    
    //copy value from show password field to actual password field.
         document.getElementById("password").value =
                document.getElementById("password_show").value;
         $("#password_show").val("");

    }
