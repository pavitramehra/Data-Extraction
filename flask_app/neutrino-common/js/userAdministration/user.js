function isMoreLoginUserNameAllowed() {
	var isMoreLoginUserNameAllowed = false;
	if (!$("#isLoginEnabled").is(":checked")) {
		return true;
	}

	$.ajax({
		url : getContextPath() + "/app/UserInfo/isMoreLoginUserNameAllowed",
		type : 'POST',
		async : false,
		data : $('#masterForm').serialize(),

		success : function(data) {
			if (data.status == "false") {
				notifyStatus(data.message, 'error');
				isMoreLoginUserNameAllowed = false;
			} else {
				isMoreLoginUserNameAllowed = true;
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$('#avCheck').html(errorThrown);
		}

	});

	return isMoreLoginUserNameAllowed;
}              

function getSalutationText() {
	var name0 = "";
	if($('#salutation :selected').val() != "") {
		name0 = $('#salutation :selected').text();
	}
	return name0;
}