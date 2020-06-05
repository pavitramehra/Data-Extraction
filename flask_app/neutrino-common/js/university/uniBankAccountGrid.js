

$(document).ready(function() {

	if ($("#universityId").val() != "" && $("#universityId").val() != undefined) {

		universityId = $("#universityId").val();
		var contextPath = getContextPath();
	}

});

function loadBankAccountTable() {
	var contextPath = getContextPath();

	$.ajax({

		url : contextPath + "/app/University/BankAccount/loadPage/"
		+ universityId,

		type : 'POST',

		async : false,

		success : function(jqXHR) {

			$('#bankAccountGrid').load(url, function() {

			//	$('#childTabs').tab(); // initialize tabs

			});

		},

		failure : function() {

			$.sticky("Some Error Occured", {
				autoclose : 10000,
				position : "top-right",
				type : "st-failure"
			});

		}

	});

}

function openDialogAccount(action, id) {
	var contextPath = getContextPath();

	$.ajax({

		url : contextPath + "/app/University/BankAccount/" + action,

		type : 'POST',

		async : false,

		data : "id=" + id,

		success : function(jqXHR) {

			$('#childModalBankAccount').html(jqXHR);

			$('#dialog-form-BankAccountEdit').hide();
			$('#dialog-form-BankAccountView').hide();
			$('#dialog-form-BankAccountNew').show();

		},

		error : function(jqXHR, textStatus, errorThrown) {

			alert(jqXHR + " : " + textStatus + " : " + errorThrown);

		}

	});

	$('#dialog-form-BankAccount').modal('show');

}

function closeDialogAccount() {

	$('#dialog-form-BankAccount').modal('hide');

}

function StickyMessage(message)

{

	$.sticky(message, {
		autoclose : 10000,
		position : "top-right",
		type : "st-success"
	});

}

function hide(divId) {

	divId = "#" + divId;

	$(divId).hide();

}

function checkForValidAccountNumber(){
	var paymentModeType = $("#paymentModeType option:selected").data("code");
	var accountNumberValid = true;
	if(paymentModeType=="ELECTRONIC_FUND_TRANSFER"){
		var bankId = $("#bankName").val();
		var accTypeId = $("#accountType").val();
		var selectedAccNumber = $("#accountNumber").val();
		if(bankId == '' || accTypeId == '' || selectedAccNumber == '')
			return true;
		
		$.ajax({
			type : "POST",
			async : false,
			url : getContextPath()
					+ "/app/University/BankAccount/validateAccountNumber/"+bankId+"/"+accTypeId,
			data : {
				"accountNumber" : selectedAccNumber
			},
			success : function(data) {
				if(data != "true"){
					new PNotify({
						title : 'error',
						text : 'Please enter correct account number',
						type : 'error',
						pnotify_animate_speed : .8,
						opacity : 1
					});
					accountNumberValid = false;
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert(jqXHR + " : " + textStatus + " : " + errorThrown);
			}
		});
		
	}
	return accountNumberValid;
}

function saveToSession() {
	if(universityBankNameActiveFlag() == false){
	
			return false;
		}
	if ($("#universityId").val() != ""
		&& $("#universityId").val() != undefined) {
		universityId = $("#universityId").val();

	}
	if ($("#bankAccountDetail").valid()) {
		if(checkDuplicates()) {


			var contextPath = getContextPath();
			
			var isAccountNumberValid = checkForValidAccountNumber();
			if(!isAccountNumberValid)
				return false;

			$.ajax({

				type : "POST",

				url : contextPath + "/app/University/BankAccount/saveToGrid",

				data : $('#bankAccountDetail').serialize() + "&parentId="
				+ universityId,

				clearForm : true,

				success : function(response) {


					$("#universityId").val(response);
					universityId = response;

					var isChecked =$('body').find("#create_another_BankAccount:visible").prop('checked');
					$('#childModalBankAccount').html("");
					if (isChecked) {
						$('#dialog-form-BankAccount.modal').modal('hide');
					}

					else {
						$('#dialog-form-BankAccount.modal').modal('hide');

					}
					var baseURL = contextPath
					+ "/app/University/BankAccount/loadPage/"
					+ universityId;

					$('#bankAccountGrid').load(baseURL, function() {

						if (isChecked) {
							//to load grid and show bank account grid again
							openDialogAccount('create',universityId);
						}
					});

					StickyMessage(data_saved);

				},

				error : function() {

					$.sticky("Some Error Occured", {
						autoclose : 10000,
						position : "top-right",
						type : "st-failure"
					});

				}

			});


		} else {
			$.sticky("Bank Account Details already exists", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
	}
	//for issue id-CAS-19670
	$("#Text_branchName").focusin();
	$("#Text_branchName").focusout();
}

function checkDuplicates() {
	var result = true;
	for(var i=0;i<bankAccountDetailsTableData.length;i++ ) {
		var bankName = bankAccountDetailsTableData[i]["bank"]["bankName"];
		var branchName = bankAccountDetailsTableData[i]["bankBranch"]["branchName"];
		var accountNumber = bankAccountDetailsTableData[i]["accountNumber"];
		var paymentMode = bankAccountDetailsTableData[i]["paymentMode"]["name"];
		var bankAccountRowId = bankAccountDetailsTableData[i]["id"];

		if(bankAccountRowId != $("#bankAccountDetail").find("input[name='id']:hidden").val() && bankName == $("#Text_bankName").val()
				&& branchName == $("#Text_branchName").val() && accountNumber == $("#accountNumber").val()
				&& paymentMode == $("#paymentModeType option:selected").text()) {
			result =  false;
			break;
		}
	}
	return result;
}

function deleteBankAccount(universityId) {

	$
	.ajax({

		url : getContextPath()+"/app/University/BankAccount/delete/"
		+ universityId,
		data : "&id=" + universityId,
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			var baseURL = getContextPath()
			+ "/app/University/BankAccount/loadPage/"
			+ universityId;

			loadBankAccountGrid();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});

}


function openEditMode(action, id) {

	$.ajax({

		url : getContextPath()+"/app/University/BankAccount/edit/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalBankAccount').html(jqXHR);
			// $('#dialog-form-BankAccount').modal('show');
			$('#childModalWindowDoneButtonBankAccount').show();
			$('#create_another_BankAccount').removeAttr("disabled");
			$('#create_another_div_BankAccount').show();
			$('#editChild').show();

			$('#dialog-form-BankAccountView').hide();
			$('#dialog-form-BankAccountEdit').show();
			$('#dialog-form-BankAccountNew').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-BankAccount').modal('show');

}

function openViewMode(action, id) {

	$.ajax({

		url : getContextPath()+"/app/University/BankAccount/view/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalBankAccount').html(jqXHR);
			$('#childModalWindowDoneButtonBankAccount').hide();
			$('#create_another_BankAccount').attr("disabled",true);
			$('#create_another_div_BankAccount').hide();
			$('#viewChild').show();

			$('#dialog-form-BankAccountEdit').hide();
			$('#dialog-form-BankAccountView').show();
			$('#dialog-form-BankAccountNew').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-BankAccount').modal('show');

}



function closeChildDialog(masterId) {
	$('#dialog-form-BankAccount').modal('hide');


}

