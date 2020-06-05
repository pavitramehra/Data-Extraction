	var conversionRateCounter = 0;
	$(document).ready(function() {
		$('#create_new_rate').click(function() {
			var table = document.getElementById('conversion_Rates');
			var endSize = table.rows.length - 1;
			var k1 = endSize;
			$.ajax({
				url : getContextPath() + "/app/Currency/addAddtionalRow",
				async : false,
				data : ({
					endSize : endSize
				}),
				success : function(jqXHR) {
					if ( $("#rowConversionRate").length == 0 ) {
						$("#conversionRateList").append(jqXHR);
					} else {
						$("#rowConversionRate" + (endSize - 1)).after(jqXHR);
					}
				}
			});

		});
	});

	$(document).ready(function(){
		
	
	$('#locale').off("change").on('change',
			function() {

				var data;
				var locale = $("#locale").val();
				$
						.ajax({
							url : getContextPath()
									+ "/app/locale/validateLocale/"
									+ locale,
							type : 'GET',
							async : false,
							success : function(data) {
								$('.localeValid').remove();

								
								$("#locale-control-group")
										.removeClass("error");
								$("#locale-control-group")
										.removeClass("success");
								if (data.valid == true) {
									$("#locale-control-group")
											.addClass("success");

								} else {
									$('#locale').after(
											'<span for="teamDes" generated="true" class="localeValid help-block">'
													+ data.message
													+ '</span>');

									setTimeout(
											function() {
												$(
														"#locale-control-group")
														.removeClass(
																"success");
												$(
														"#locale-control-group")
														.addClass(
																"error");
											}, 200);

								}
							},
							error : function(jqXHR, textStatus,
									errorThrown) {
								$('#avCheck').html(errorThrown);
								$('.localeValid').remove();
							}
						});
			});
	
	
		$('#isoCode').on('change',function() {
			var currencyIsoCode = $("#isoCode").val();
			$
					.ajax({
						url : getContextPath()
								+ "/app/Currency/validateCurrencyISOCode/"
								+ currencyIsoCode,
						type : 'GET',						
						success : function(data) {							
							
							if (data.valid == true) {
								
								$("#isoCode-control-group").removeClass("error");
								$("#isoCode-control-group").removeClass("outset-shadow-focus");
								$("#isoCode-control-group").addClass("success");

							} else {
								$("#isoCode-control-group").removeClass('success');
								$("#isoCode-control-group").addClass("error");
								$("#isoCode-control-group").addClass("outset-shadow-focus clearfix");		
								$("#isoCode-control-group").addClass("help-block");		
								new PNotify({
									title : "Error",
									text : "Invalid currency ISO Code.",
									type : "error",
									opacity : .8
								});
							
							}
						},
						error : function(jqXHR, textStatus,
								errorThrown) {
							
						}
					});
		});
	
	});
	
 	function removeConversionRate(id, counter) {
 		$('#rowConversionRate' + counter).remove();
	}
 	
	function saveForm() {
		
		if($('#conversionRateList tr').length==0){
			$.sticky("Please enter at least one row for conversion rate.This field is compulsory!.", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			return;
		}
		
		var formTemp = $("#masterForm");
		
		if(formTemp.valid()){
			formTemp.submit();	
			
			$('body').modalmanager('loading');
		}

	}	

	function saveAndSendForApproval(context) {
		if($('#conversionRateList tr').length==0){
			$.sticky("Please enter at least one row for conversion rate. This field is compulsory!.", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			return;
		}
		var masterID = document.getElementById("masterID").value;
		var form = document.getElementById("masterForm");
		if ($(".form").valid()){
			form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
			form.submit();
		$('body').modalmanager('loading');
		}
	} 	