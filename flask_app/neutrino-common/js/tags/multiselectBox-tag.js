function multiSelectBoxTagScript(multiSelectBoxTagScriptInput) {
	
	function refDescMultiselectBOX(selectOb) {

		selectOb.next().find(".ms-selectable, .ms-selection").find(".ms-list")
				.find("li").each(
						function() {
							$(this).attr(
									"title",
									selectOb.parent().prev(
											".itemDescriptionContainer").find(
											"input[p_multi_label^='"
													+ $(this).text() + "']")
											.attr("p_multi_desc"));
						})
	}

	$(document).ready(function() {

		var i = multiSelectBoxTagScriptInput.tabindex_msb;
		jQuery('.ms-container input').attr("tabindex", i);
		var id = multiSelectBoxTagScriptInput.id_msb;
		$(".ms-list").click(function() {
			refDescMultiselectBOX($("#" + id));
		});

		setTimeout(function() {
			refDescMultiselectBOX($("#" + id))
		}, 1000);
		
		
		if ($('.ms-selection').find('li').length == $('.ms-selectable').find('li').length) {
			$('.ms-selectable').find('.ms-list').css('max-height','none');
			var maxHeight = $('.ms-selection').find('.ms-list').css('max-height');
			$('.ms-selectable').find('.ms-list').css('max-height',maxHeight);
		}
		
		var ids = multiSelectBoxTagScriptInput.idsExecuteOnLoad_msb;
		executeOnLoad(ids);

	});
}