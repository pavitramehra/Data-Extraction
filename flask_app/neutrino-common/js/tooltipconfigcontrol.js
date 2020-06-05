function addRemoveInputSpanAttr(enableToolTipAttr, hideFocus){
	
		if(enableToolTipAttr!== "undefined" && enableToolTipAttr!=="" && !enableToolTipAttr) {
					
				    $(":input").each(function(index,elem){
						inputFieldArray[index] = $(elem).attr("data-original-title");
					});
					$("span").each(function(index,elem){
						inputFieldArray[index+length] = $(elem).attr("data-original-title");
					});
					$(":input").removeAttr("data-original-title");
					$(".chosen-container").removeAttr("data-original-title");
					$("span").removeAttr("data-original-title");
					
					if(hideFocus){
						$(":focus").each(function() {
								var activeElement = "#"+this.id;
								$(activeElement).tooltip('hide');
							});
					}
					
			} else if(enableToolTipAttr!== "undefined" && enableToolTipAttr!=="" && enableToolTipAttr) {
					$(":input").each(function(index,elem) {
						$(elem).attr("data-original-title", inputFieldArray[index]);
					});
					$("span").each(function(index,elem) {
						$(elem).attr("data-original-title", inputFieldArray[index+length]);
					});
		    }
	
	}