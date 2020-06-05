

$(document).ready(function() {
	
	if ($("#businessPartnerId").val() != "" && $("#businessPartnerId").val() != undefined) {

		businessPartnerId = $("#businessPartnerId").val();

	}

	// loadBankAccountTable();

});

function loadBankAccountTable() {
	var contextPath = getContextPath();

	$.ajax({

		url : contextPath + "/app/BusinessPartner/BankAccount/loadPage/"+bpTypeCode+"/"
				+ businessPartnerId,

		type : 'POST',

		async : false,

		success : function(jqXHR) {

			$('#BankAccountDiv').load(url, function() {

				$('#childTabs').tab(); // initialize tabs

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
	$('#childModalBankAccount').html("");
	var contextPath = getContextPath();

	$.ajax({

		url : contextPath + "/app/BusinessPartner/BankAccount/" + action,

		type : 'POST',

		async : false,

		data : "id=" + id,

		success : function(jqXHR) {
			$('#childModalBankAccount').html(jqXHR);			
			$('#dialog-form-BankAccountEdit').hide();
			 $('#dialog-form-BankAccountView').hide();
			 $('#dialog-form-BankAccountNew').show();
			 $('#eftShow').hide();
	   var paymentModeType = $("#paymentModeType option:selected").data("code");
		if(paymentModeType=="ELECTRONIC_FUND_TRANSFER")
		{
			$("#eftShow").show();
			$("#accountType").addClass("required");
	        $("#subPaymentModeType").addClass("required");
		} else {
			$("#eftShow").hide();
			$("#accountType").removeClass("required");
            $("#subPaymentModeType").removeClass("required");
		}
			

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
					+ "/app/BusinessPartner/BankAccount/validateAccountNumber/"+bankId+"/"+accTypeId,
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

function saveBankAccountToSession() {
	if(universityBankNameActiveFlag() == false){
		 
				return false;
	}
	if ($("#bankAccountDetail").valid()) {
	 if(checkDuplicates()) {
		bpTypeCode = $('option:selected', $("#businessPartnerType")).attr('data-code');

		var contextPath = getContextPath();
		
		var isAccountNumberValid = checkForValidAccountNumber();
		if(!isAccountNumberValid)
			return false;

		$.ajax({

			type : "POST",

			url : contextPath + "/app/BusinessPartner/BankAccount/saveToGrid",

			data : $('#bankAccountDetail').serialize() + "&parentId="
					+ businessPartnerId+"&bpType="+bpTypeCode,

			clearForm : true,

			success : function(response) {

				$("#businessPartnerType").attr("disabled","disabled");
				$("#businessPartnerType").trigger("chosen:updated");
				
				$("#businessPartnerId").val(response);
				businessPartnerId = response;
				//for issue cas-19301
				var isChecked =$('body').find("#create_another_BankAccount:visible").prop('checked');
				$('#childModalBankAccount').html("");
				if (isChecked) {
					$('#dialog-form-BankAccount.modal').modal('hide');
				}

				else {
					$('#dialog-form-BankAccount.modal').modal('hide');
					
				}
				var baseURL = contextPath
				+ "/app/BusinessPartner/BankAccount/loadPage/"+bpTypeCode+"/"
				+ businessPartnerId;

		$('#BankAccountDiv').load(baseURL, function() {

			$('#childTabs').tab(); // initialize tabs
			if (isChecked) {
				//to load grid and show bank account grid again
				openDialogAccount('create',businessPartnerId);
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

function deleteBankAccount(bankAccountId) {
	//alert(${pageContext.request.contextPath}+"/app/BusinessPartner/BankAccount/delete/");

	$ 
			.ajax({

				url : getContextPath()+"/app/BusinessPartner/BankAccount/delete/"
						+ bankAccountId,
				data : "&id=" + bankAccountId,
				type : 'POST',
				async : false,
				success : function(jqXHR) {
					if(jqXHR != "success"){
						new PNotify({
							title : "error",
							text : "Bank Account Mapped with Showroom Account."+jqXHR,
							type : "error",
						});
						return;
					}
					var baseURL = contextPath
					+ "/app/BusinessPartner/BankAccount/loadPage/"+bpTypeCode+"/"
					+ businessPartnerId;

			$('#BankAccountDiv').load(baseURL, function() {

			});
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});

}


function openEditMode(action, id) {
	
	$.ajax({

				url : getContextPath()+"/app/BusinessPartner/BankAccount/edit/",
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

				url : getContextPath()+"/app/BusinessPartner/BankAccount/view/",
				data : ({
					id: id
				}),
				type : 'POST',
				async : false,
				success : function(jqXHR) {
					$('#childModalBankAccount').html(jqXHR);
					// $('#dialog-form-BankAccount').modal('show');
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





/*
 * function viewRecord(cellvalue, options, rowObject) {
 * 
 * var grid = $("#childBankAccount");
 * 
 * var action ="view";
 * 
 * return "<a
 * href="${pageContext.request.contextPath}/app/BankAccount/view/${dataItem.viewProperties.viewId}"
 * >${dataItem[listProperty[s.count - 1]]}</a>
 *  ";
 *  }
 */
