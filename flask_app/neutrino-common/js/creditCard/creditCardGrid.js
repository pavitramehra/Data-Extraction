$(document).ready(function() {

	$('.date').on(function() {
		$(this).datepicker({
			format : defaultUserDateFormat
		});

		$('.date').change(function() {
			$(this).datepicker('hide');
		});
	});
});
var lastRowIndex = parseInt($("#presentRowIndex").val());
var nextRowIndex = lastRowIndex + 1;

// adding new row
function addCreditCardDetail() {
	
	
	$.ajax({
		
		type :'POST',
		url : getContextPath()+"/app/Customer/CCDetail/addCreditCardDetailRow",
		data :({
			nextRowIndex :nextRowIndex
		}),
		success:function(data){
			$("#creditCardDetailList").append(data);
		},
		error:function(data){
			alert("row can not be added");
		}
	});
	lastRowIndex++;
	nextRowIndex++;
	$("#card_issuer" + lastRowIndex).focus();
}

// deleting a row
function removeIdDetail(delVal, delRowId) {
	if(delVal != '') {
	$.ajax({
		type   : 'POST',
		url    : getContextPath()+"/app/Customer/CCDetail/delete",
		data   : {'ccDetailId' : delVal},
		success: function(response){
			if(response == 'success'){
				new PNotify({
					title : 'Success',
					text : "Credit Card Detail deleted successfully. ",
					type : 'success',
					opacity : .8
				});
			}
		},
		error  : function(response){
			new PNotify({
				title : 'Error',
				text : "Error while deleting Credit Card Detail",
				type : 'error',
				opacity : .8
			});
		}
	});
	}
	$('#rowDetails' + delRowId).remove();
}
function setDate(rowId) {

}

function checkDateValidation(rowId) {
	$("#card_expiry_month" + rowId).parent().addClass("success");
	$("#card_expiry_month" + rowId).parent().removeClass("error");
	var currentDate = new Date();
	var expiryMonth = $("#card_expiry_month" + rowId).val();
	var expiryYear = $("#card_expiry_year" + rowId).val(); 
	var currentMonth = currentDate.getMonth()+1;
	var currentYear = currentDate.getFullYear();
	if(currentYear == expiryYear){
		if(expiryMonth < currentMonth)
		{
			$("#card_expiry_month" + rowId).parent().addClass("error");
			$("#card_expiry_month" + rowId).parent().removeClass("success");
			$("#card_expiry_month" + rowId).val("");
			$
			.sticky(
					"The expiry month must be greater than the current month!",
					{
						autoclose : 5000,
						position : "top-right",
						type : "st-error"
					});
		}
		else{
			$$("#card_expiry_month" + rowId).parent().addClass("success");
			$("#card_expiry_month" + rowId).parent().removeClass("error");

		}
	}
	}

function checkCardLengthValidation(rowId) {
	$("#card_Number" + rowId).parent().addClass("success");
	$("#card_Number" + rowId).parent().removeClass("error");
	var cardLength = $("#card_Number" + rowId).val().length;
	if(cardLength < 13 || cardLength > 19)
	{
		$("#card_Number" + rowId).parent().addClass("error");
		$("#card_expiry_month" + rowId).parent().removeClass("success");
		$("#card_Number" + rowId).val("");
		$
		.sticky(
				"Credit card should have minimum 13 digits and maximum 19 digits!",
				{
					autoclose : 5000,
					position : "top-right",
					type : "st-error"
				});
	}
	else{
		$("#card_Number" + rowId).parent().addClass("success");
		$("#card_Number" + rowId).parent().removeClass("error");
		
		//for masking card number
		var cardNumberId =$("#card_Number" + rowId);
		var cardNumberVal = cardNumberId.val();
		var cardLength = $("#card_Number" + rowId).val().length;
		var newCardNumber="";
		for(var i=1; i<= cardLength ; i++)
			{
			if(i<= (cardLength-4))
				{
				newCardNumber = newCardNumber.concat("x");
				}
			else
				{
				newCardNumber = newCardNumber.concat(cardNumberVal.substring(i-1, i));
				
				}
			}
		
		cardNumberId.val("");
		cardNumberId.val(newCardNumber);
		$("#original_card_Number" + rowId).val(cardNumberVal);

	}

	}
