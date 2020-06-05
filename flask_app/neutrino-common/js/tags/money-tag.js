function moneyTagScript(moneyTagScriptInput) {
	/* this is being used instead of document.ready as it was not working in IE*/	
	$(document).ready(function(){
							/* var el = $("#amount_<c:out value='${id}'/>").parents("form").find($("#money_appId"));
							if(el.length == 0){
								console.log("11");
								$("#amount_<c:out value='${id}'/>").parents("form")
								.append("<input type='hidden' id='money_appId' name='money_appId'/>");
							} */
							
							if ($("#appId").val() != null || $("#appId").val() == '') {
								$(moneyTagScriptInput.hid_appId_mt).val($("#appId").val());
							}
							if ( typeof (VAR_APP_MAIN_PAGE_appID) != 'undefined') {
								$(moneyTagScriptInput.hid_appId_mt).val(VAR_APP_MAIN_PAGE_appID);
							}
				if (moneyTagScriptInput.label_mt != "") {
						$(moneyTagScriptInput.id_mt).bind(
								'change',
								function() {
					
									if ($(moneyTagScriptInput.hId_mt).val() != "") {

										var inputLen = $(moneyTagScriptInput.hId_mt).length;

										var moneyLabelClassVal = $(
												moneyTagScriptInput.moneyLabelDiv_mt).attr(
												"class");

										if (moneyLabelClassVal != "") {
											$(moneyTagScriptInput.moneyLabelDiv_mt).removeClass(
													moneyLabelClassVal);

											if (inputLen > 1) {
												$(moneyTagScriptInput.moneyLabelDiv_mt).addClass(
														"span" + (inputLen - 1));
											} 
										}

									}
								});
					}
					$(moneyTagScriptInput.amount_mt).change(
							function() {
								if ($(moneyTagScriptInput.amount_mt).val() == "") {
									$(moneyTagScriptInput.amount_mt).val("");
									formMoneyValue(moneyTagScriptInput.formatCurrencyInput_mt);
								}
								
								/* jQuery( '#amount_${id}' ).wrap( '<form id="temp_form_for_money" />' );
	                            var isValid = jQuery( '#temp_form_for_money' ).valid();
	                            jQuery( '#amount_${id}' ).unwrap(); */
	                            if ($(moneyTagScriptInput.amount_mt).valid()) {
									formatCurrency(moneyTagScriptInput.formatCurrencyInput_mt,false,moneyTagScriptInput.formatCurrencyInput_acceptNegative_mt);
								}
								
							});

					$(moneyTagScriptInput.listMoney_mt).focus(function() {
					}).change(
							function() {
								if ($(moneyTagScriptInput.amount_mt).val() == "") {
									$(moneyTagScriptInput.amount_mt).val("");
									formMoneyValue(moneyTagScriptInput.formatCurrencyInput_mt);
								}
								else {
									if ($(moneyTagScriptInput.amount_mt).valid()) {
										formatCurrency(moneyTagScriptInput.formatCurrencyInput_mt,false,moneyTagScriptInput.formatCurrencyInput_acceptNegative_mt);
									}
								}
							});

					

					if ( moneyTagScriptInput.viewMode_mt != "" &&  moneyTagScriptInput.viewMode_mt == 'true') {
						$(moneyTagScriptInput.listMoney_mt).attr("disabled", "disabled");

					}

				});
	
	applyTooltip(moneyTagScriptInput.applyTooltipInput_mt, moneyTagScriptInput.alignToolTip);
	
}