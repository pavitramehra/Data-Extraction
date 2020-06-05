jQuery(function() {
	jQuery('#j_username').change(function() {
		validateAndRemoveErrorClass('usernameDiv',$('#j_username').val());
	});
});
jQuery(function() {
	jQuery('#j_password').change(function() {
		validateAndRemoveErrorClass('passwordDiv',$('#j_password').val());
	});
});	
	
jQuery(function() {
	jQuery('#username').change(function() {
		validateAndRemoveErrorClass('checkNameTextDiv',$('#username').val());
		if($('#username').val() != null && $('#username').val() !=""){
			$('#detail').addClass('hidden');
			$('#imgCheckName')
			.html("");
		}
	});
});		

function disableImportUserScreenButtons(importButton,checkNameButton,clearButton){
	importButton.attr("disabled","disabled");
	checkNameButton.attr("disabled","disabled");
	clearButton.attr("disabled","disabled");
}
function enableImportUserScreenButtons(importButton,checkNameButton,clearButton){
	importButton.removeAttr("disabled");
	checkNameButton.removeAttr("disabled");
	clearButton.removeAttr("disabled");
}
var importUserButtonClicked = false;

function importUser() {
	if (!importUserButtonClicked) {
		importUserButtonClicked = true;
		disableImportUserScreenButtons($("#importUser"),$("#checkname"),$("button#clearBtn"));

		$.ajax({
			url : getContextPath() + "/app/ldapAdmin/importUser",
			data : {
				'checkName' : $('#username').val(),
				'username' : $('#j_username').val(),
				'password' : Encrypt($('#j_password').val(),
						passphrase)
			},
			type : "POST",
			async : false,
			success : function(message) {
				new PNotify({
					title : "Success",
					text : message,
					type : "success",
					opacity : .8
				});
				closeUserDetails();
				enableImportUserScreenButtons($("#importUser"),$("#checkname"),$("button#clearBtn"));
				importUserButtonClicked = false;
			},
			error : function(err) {
				new PNotify({
					title : "Error",
					text : "Some Error Occured",
					type : "error",
					opacity : .8
				});
				enableImportUserScreenButtons($("#importUser"),$("#checkname"),$("button#clearBtn"));
				importUserButtonClicked = false;
			}
		});
	}
}

	function checkname() {
		if($('#username').val() != null && $('#username').val() !=""){
			$.ajax({
				url : getContextPath() + "/app/ldapAdmin/checkname",
				data : {
					'checkName' : $('#username').val(),
					'username' : $('#j_username').val(),
					'password' : Encrypt($('#j_password').val(),passphrase)
				},
				type : "POST",
				async : false,
				success : function(sourceSystem) {
					$('#firstName').val(sourceSystem.firstname);
					$('#lastname').val(sourceSystem.lastname);
					$('#mailid').val(sourceSystem.mailId);
					$('#mobileNo').val(sourceSystem.mobileNo);
					$('#department').val(sourceSystem.department);
					$('#title').val(sourceSystem.title);
					$('#telephonenumber').val(sourceSystem.telephonenumber);
					$('#company').val(sourceSystem.company);
					$('#employeeId').val(sourceSystem.employeeId);
					$('#roles').val(sourceSystem.roles);
					$('#detail').removeClass('hidden');
					$('#closeCheckNameButton').addClass('hidden');
					$('#imgCheckName')
					.html(
							'<img height="100" width="100" src="data:image/jpeg;base64,' + sourceSystem.thumbnailPhoto + '" alt="No Image">');
				},
				error : function(err) {
					new PNotify({
						title : "Error",
						text : label_invalid_active_directory_user,
						type : "error",
						opacity : .8
					});
				},
				complete : function() {
					//$('#confirmUserPass').modal('hide');
				}
			});
		}else{
			$('#checkNameTextDiv').addClass('outset-shadow-focus clearfix');
			$('#checkNameTextDiv').addClass('error');
		}
		
		
	}
	
	function validateUserPwd() {
		
		if($('#j_username').val() != null && $('#j_username').val() !="" && $('#j_password').val() != null && $('#j_password').val() !=""){
			$.ajax({
				url : getContextPath() + "/app/ldapAdmin/authenticateUser",
				data : {
					'username' : $('#j_username').val(),
					'password' : Encrypt($('#j_password').val(),passphrase)
				},
				type : "POST",
				async : false,
				success: function(){
					$('#usernameDiv').hide();
					$('#passwordDiv').hide();
					$('#okToCancel').hide();
					$('#clearBtn').hide();
					$("#checkNameDiv").removeClass('hidden');	
				},
				error : function(err) {
					new PNotify({
						title : "Error",
						text : label_ldap_authentication_failed,
						type : "error",
						opacity : .8
					});
				}
			});
		}
		else if($('#j_username').val() != null && $('#j_username').val() !=""){
			$('#passwordDiv').addClass('outset-shadow-focus clearfix');
			$("#passwordDiv").addClass('error');
		}
		else if($('#j_password').val() != null && $('#j_password').val() !=""){
			$('#usernameDiv').addClass('outset-shadow-focus clearfix');
			$("#usernameDiv").addClass('error');
		}else{
			$('#passwordDiv').addClass('outset-shadow-focus clearfix');
			$("#passwordDiv").addClass('error');
			$('#usernameDiv').addClass('outset-shadow-focus clearfix');
			$("#usernameDiv").addClass('error');
		}	
		
	}
	
function clearUserPwd(){
	$('#j_username').val("");
	$('#j_password').val("");
	$('#passwordDiv').removeClass('outset-shadow-focus clearfix');
	$("#passwordDiv").removeClass('error');
	$('#usernameDiv').removeClass('outset-shadow-focus clearfix');
	$("#usernameDiv").removeClass('error');
}

function validateAndRemoveErrorClass(divId,value){
	if(value!=null && value!=""){
		$('#'+divId).removeClass('outset-shadow-focus clearfix');
		$('#'+divId).removeClass('error');
	}
}


function clearCheckName(){
	$('#checkNameTextDiv').removeClass('outset-shadow-focus clearfix');
	$("#checkNameTextDiv").removeClass('error');
	$('#username').val("");	
	$('#detail').addClass('hidden');
	$('#closeCheckNameButton').removeClass('hidden');
	$('#imgCheckName')
	.html("");
}

function closeUserDetails(){
	clearCheckName();
}

