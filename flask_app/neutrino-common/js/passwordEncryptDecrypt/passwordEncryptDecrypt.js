function clearUserPwd(){
	$('#password').val("");	
	$('#passwordDiv').removeClass('outset-shadow-focus clearfix');
	$("#passwordDiv").removeClass('error');
	$("#encryptedDiv").addClass('hidden');
}

function validatePwd(){
	
	if($('#password').val() != null && $('#password').val() !=""){
		$.ajax({
			url : getContextPath() + "/app/encryptPassword/encryptUserPassword",
			data : {
				'password' : $('#password').val()
			},
			type : "POST",
			async : false,
			success: function(data){
				$("#encryptedDiv").removeClass('hidden');
				$('#encryptedPassword').val(data.encryptedPassword);
			},
			error : function(err) {
			
			}
		});
	}
	else{
		$('#passwordDiv').addClass('outset-shadow-focus clearfix');
		$("#passwordDiv").addClass('error');
	}	
	

}


function clearPassPhrase(){
	$('#passPhrase').val("");	
	$('#passPhraseDiv').removeClass('outset-shadow-focus clearfix');
	$("#passPhraseDiv").removeClass('error');
	$("#encryptedPassPhraseDiv").addClass('hidden');
}

function validatePassPhrase(){
	
	if($('#passwordPhrase').val() != null && $('#passwordPhrase').val() !=""){
		$.ajax({
			url : getContextPath() + "/app/encryptPassword/encryptOAuthPassPhrase",
			data : {
				'passwordPhrase' : $('#passwordPhrase').val()
			},
			type : "POST",
			async : false,
			success: function(data){
				$("#encryptedPassPhraseDiv").removeClass('hidden');
				$('#encryptedPassPhrase').val(data.encryptedPassPhrase);
			},
			error : function(err) {
			
			}
		});
	}
	else{
		$('#passPhraseDiv').addClass('outset-shadow-focus clearfix');
		$("#passPhraseDiv").addClass('error');
	}	
	

}

