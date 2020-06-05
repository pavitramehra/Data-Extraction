$(document)
			.ready(
					function() {
						$('body')
								.on(
										"click",
										'#searchMessages',
										function() {
											$
													.ajax({
														type : "POST",
														url : getContextPath()
																+ "/app/integrationConfig/message/search",
														data : $(
																"#messageSearchFormId")
																.serialize(),
														success : function(
																messageGrid) {
															$("#messageGridDiv")
																	.html(
																			messageGrid);

														},
														error : function() {
															// notify error
															notifyStatus(
																	server_side_error,
																	failure);

														}

													});

										});

					});


//js for messageGrid.jsp

function renderTable(targettableId, objectList1, colConf) {

	var oTable = $(targettableId).dataTable({
		"aaData" : objectList1,
		"aoColumnDefs" : colConf

	});
}

function getColumnConfig(targettableId, singleObject) {
	var columnConfig = new Array();
	var i = 0;
	for ( var key in singleObject) {
		var funName = null;
		if (key == "MESSAGE_ID") {
			funName = createLinkForMessageId;
		}
		if (key == "SUCCESS") {
			funName = booleanColors;
		}
		var localObj = {
			"aTargets" : [ "tbl_" + key ],
			"mDataProp" : key,
			"fnCreatedCell" : funName
		};
		columnConfig.push(localObj);
		i++;
	}
	return columnConfig;
}

function createLinkForMessageId(nTd, sData, oData, iRow, iCol) {
	var link = '<a href="' + getContextPath()
			+ '/app/integrationConfig/message/' + oData["MESSAGE_ID"] + '">MSG-'
			+ sData + '</a>';
	$(nTd).html(link);
}

function booleanColors(nTd, sData, oData, iRow, iCol) {
	if (sData) {
		$(nTd).html('<span class="text-success">YES</span>');
	} else {
		$(nTd).html('<span class="text-danger">NO</span>');
	}
}