

$(document).ready(function() {
	
	if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {

		collegeId = $("#collegeId").val();

	}

	// loadBankAccountTable();

});

contextPath=getContextPath();

function RefreshTable(tableId, urlData)
{   $.getJSON(urlData, { viewable: true}, function( json )
			{
		table = $(tableId).DataTable();
		oSettings = table.settings();
		table.clear(this);
		for (var i=0; i<json.aaData.length; i++)
		{
			table.row.add(json.aaData[i]).draw();
		}
		oSettings[0].aiDisplay = oSettings[0].aiDisplayMaster.slice();
		table.draw();
			});

}

function loadBankAccountTable() {
	var contextPath = getContextPath();

	$.ajax({

		url : contextPath + "/app/College/BankAccount/loadPage/"
				+ collegeId,

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
	var contextPath = getContextPath();
	$.ajax({

		url : contextPath + "/app/College/BankAccount/" + action,

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
					+ "/app/College/BankAccount/validateAccountNumber/"+bankId+"/"+accTypeId,
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


   if (!$("#masterForm").valid()) {
	   $('#childModalWindowDoneButtonBankAccount').css('pointer-events', 'auto');
          return;
   }else{
          saveCollegeOnce();
   }

	if ($("#bankAccountDetail").valid()) {
	$('#childModalWindowDoneButtonBankAccount').css('pointer-events', 'none');
	 if(checkDuplicates()) {
		if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
				collegeId = $("#collegeId").val();
			}
		var contextPath = getContextPath();
		
		var isAccountNumberValid = checkForValidAccountNumber();
		if(!isAccountNumberValid)
			return false;

		if(collegeBankNameActiveFlag() == false){
			 $('#childModalWindowDoneButtonBankAccount').css('pointer-events', 'auto');
			return false;
}
		$.ajax({

			type : "POST",

			url : contextPath + "/app/College/BankAccount/saveToGrid",

			data : $('#bankAccountDetail').serialize() + "&parentId="
					+ collegeId,

			clearForm : true,

			success : function(response) {

				$("#collegeId").val(response);
				collegeId = response;
				var isChecked =$('body').find("#create_another_BankAccount:visible").prop('checked');


				if (isChecked) {
                						$('#dialog-form-BankAccount.modal').modal('show');
                						$("#Text_bankName").val("");
                						$("#Text_branchName").val("");
                						$("#Text_branchName").val("");
                						$("input#accountNumber").val("");
                						$("#subPaymentModeType").prop('selectedIndex', 0);
                						$("#accountType").prop('selectedIndex', 0);
                						$("#paymentModeType").val("");
										$("#paymentModeType option[value='']").attr("selected", true).trigger("change");
                						$('body').find("#create_another_BankAccount:visible").prop("checked",false);
                						if($("#paymentModeType").val() == ""){
                							$("#paymentModeType").prop("disabled","disabled");
                						}
                						if($('#Text_bankName').val() != ""){
                							var populateBranchURL = "/BusinessPartner/populateExternalBankBranch/"+$('#bankName').val();
                							$("#Text_branchName").attr("data-custom-controller", populateBranchURL);
                						}
                						$('#paymentmodetype-control-group').removeClass('error');
                						$('#paymentModeType-error').hide();
                					}else {
					$('#dialog-form-BankAccount.modal').modal('hide');

				}
				var baseURL = contextPath
				+ "/app/College/BankAccount/loadData/"
				+ collegeId;

                RefreshTable("#bankAccountTable", baseURL);

				StickyMessage(data_saved);
				 $('#childModalWindowDoneButtonBankAccount').css('pointer-events', 'auto');

			},

			error : function() {
                var errorMsg="Some Error Occured";
                $.sticky(errorMsg, {
                                        autoclose : 10000,
                                        position : "top-right",
                                        type : "st-failure"
                                    });
			 $('#childModalWindowDoneButtonBankAccount').css('pointer-events', 'auto');
			}

		});


	 } else {
		 $.sticky("Bank Account Details already exists", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
		 });

	$('#childModalWindowDoneButtonBankAccount').css('pointer-events', 'auto');
	 }
	}
	//for issue id-CAS-19670
	$("#Text_branchName").focusin();
	$("#Text_branchName").focusout();
}


function checkDuplicates() {
	var result = true;
	var bankGridTableLength = $("#bankAccountTable").find("tbody").children().length;
	var bankGridEmptyCheck = $("#bankAccountTable").find("tbody > tr > td:eq(0)").hasClass("dataTables_empty");

	if(bankGridTableLength > 0 && !bankGridEmptyCheck) {
        for(var i=0;i<bankGridTableLength;i++ ) {
            var bankName = $("#bankAccountTable").find("tbody >tr").eq(i).find("td:eq(1)").children().html().trim();
            var branchName = $("#bankAccountTable").find("tbody >tr").eq(i).find("td:eq(2)").html().trim();
            var accountNumber =$("#bankAccountTable").find("tbody >tr").eq(i).find("td:eq(3)").html().trim();
            var paymentMode = $("#bankAccountTable").find("tbody >tr").eq(i).find("td:eq(4)").html().trim();;
            var bankAccountRowId = $("#bankAccountTable").find("tbody >tr").eq(i).find("td:eq(0)").html().trim();

            if(bankAccountRowId != $("#bankAccountDetail").find("input[name='id']:hidden").val() && bankName == $("#Text_bankName").val().trim()
                    && branchName == $("#Text_branchName").val().trim() && accountNumber == $("#accountNumber").val().trim()
                    && paymentMode == $("#paymentModeType option:selected").text().trim()) {
                result =  false;
                break;
            }
        }
    }
	return result;
}

function deleteBankAccount(bankAccountId) {
		$ .ajax({
				url : getContextPath()+"/app/College/BankAccount/delete/"
						+ bankAccountId,
				data : "&collegeId=" + collegeId,
				type : 'POST',
				async : false,
				success : function(jqXHR) {
				    $("#collegeId").val(jqXHR);
					collegeId = jqXHR;
					var baseURL = contextPath
					+ "/app/College/BankAccount/loadData/"
					+ collegeId;

                RefreshTable("#bankAccountTable", baseURL);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});

}


function openBankEditMode(action, id) {
	
	$.ajax({

				url : getContextPath()+"/app/College/BankAccount/edit/",
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

function openBankViewMode(action, id) {
	
	$.ajax({

				url : getContextPath()+"/app/College/BankAccount/view/",
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


function closeBankChildDialog(childId) {

	$('#dialog-form-BankAccount').modal('hide');

}

function saveCollegeOnce() {
       if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
          return;
       }
       if ($("#masterForm").valid()) {
             var contextPath = getContextPath();
             if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
                   collegeId = $("#collegeId").val();
             }
             $.ajax({
                   type : "POST",
                   url : contextPath + "/app/College/saveClgOnce",
                   data : $("#masterForm").serialize()+ "&parentId="+collegeId,
                   clearForm : true,
                   async: false,
                   success : function(response) {
                          $("#collegeId").val(response);
                   },
                   error : function() {

                          $.sticky("Some Error Occured while saving college", {
                                 autoclose : 5000,
                                 position : "top-right",
                                 type : "st-failure"
                          });

                   }

             });
       }
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
