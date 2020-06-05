$(document).ready(function() {
	paintDataTable();

});

var saveData = (function() {
	var downElem = document.createElement("a");
	document.body.appendChild(downElem);
	downElem.style = "display: none";
	return function(data, fileName) {
		var blob = new Blob([ data ], {
			type : "octet/stream"
		}), url = window.URL.createObjectURL(blob);
		downElem.href = url;
		document.body.appendChild(downElem); // Firefox
		downElem.download = fileName;
		downElem.click();
		downElem.remove();
		window.URL.revokeObjectURL(url);
	};
}());

$(function() {

	$("#logsType").on('change', function() {
		$("#searchParams").html("");
		$('#searchResults').html("");
		var logsTypeParamId = $("#logsType").val();
		if (logsTypeParamId == "") {
			$('#auditHistory').DataTable().ajax.reload();
			table.ajax.reload()
			paintDataTable()
			$('#auditHistory').show();
		} else {
			$('#auditHistory').hide();
			loadSearchParameters();
		}
	})

});

function loadSearchParameters() {

	var logsTypeParamId = $("#logsType").val();
	if (logsTypeParamId == "") {

	} else {
		$.ajax({

			url : getContextPath() + "/app/AuditManager/loadSearchParams",
			data : "logsTypeParamId=" + logsTypeParamId,
			async : false,
			success : function(result) {
				$("#searchParams").html(result);
			}
		});
	}
}

$('#auditHistory_table')
		.on(
				'click',
				'.buttondown',
				function() {
					var docId = $(this).attr("data-id");
					$
							.ajax({
								url : getContextPath()
										+ "/app/AuditManager/downloadBackupAudit/"
										+ docId,
								type : 'POST',
								success : function(jqXHR) {
									saveData(jqXHR.fileContents, jqXHR.fileName);
								},
								error : function(jqXHR, textStatus, errorThrown) {
									alert('<spring:message	code="label.auditmanager.download.error"/>');
								}
							});
				})
var table;
function paintDataTable() {
	var tableRows = [];
	var iTotalRecords;
	var iTotalDisplayRecords;
	table = $("#auditHistory_table")
			.DataTable(
					{
						"order" : [ [ 0, "desc" ] ],
						"dom" : 'T<"clear">lfrtip',
						"bSort" : true,
						"searching" : true,
						"bServerSide" : true,
						"bProcessing" : false,
						"aoColumns" : [ {
							"bSortable" : true
						}, {
							"bSortable" : false
						}, {
							"bSortable" : false
						}, {
							"bSortable" : false
						}, {
							"bSortable" : false
						}, {
							"bSortable" : false
						} ],
						"fnServerData" : function(sSource, aoData, fnCallback,
								oSettings) {
							var columnName = $("#auditHistory_table")
									.find("th")
									.eq(aoData[2].value[0]["column"])
									.attr("id");
							var sortDirection = aoData[2].value[0]["dir"];
							;
							$
									.ajax({
										url : getContextPath()
												+ "/app/AuditManager/loadAuditHistory"
												+ "?iDisplayStart="
												+ aoData[3].value
												+ "&iDisplayLength="
												+ aoData[4].value
												+ "&iSortCol_0=" + 0
												+ "&sSortDir_0="
												+ sortDirection + "&sSearch="
												+ "abc",
										type : 'POST',
										contentType : 'application/json',
										async : false,
										success : function(tableRowData,
												status, xhr) {
											iTotalRecords = xhr
													.getResponseHeader("iTotalRecords");
											iTotalDisplayRecords = xhr
													.getResponseHeader("iTotalDisplayRecords");
											tableRows = [];
											if (tableRowData.length > 0) {
												for (i = 0; i < tableRowData.length; i++) {
													var tempRow = tableRowData[i];
													if (tempRow.filesSize == null) {
														tempRow.filesSize = "";
													}
													var docid = tempRow.docStoreId;
													var strToAppend = "<a id='buttondown' type='button' data-id="
															+ tempRow.docStoreId
															+ " class='btn btn-xs buttondown'><i class='glyphicon glyphicon-download-alt'></i></a>";
													if (docid == null
															|| (docid
																	.indexOf("null") != -1)) {
														strToAppend = "";
													}
													tableRows
															.push([
																	tempRow.createdTime,
																	tempRow.associatedUser,
																	tempRow.logsType,
																	tempRow.paramValues,
																	tempRow.resultCount,
																	strToAppend ]);
												}
											}
										},
										error : function(data) {
											alert(data);
										}
									});
							fnCallback({
								'aaData' : tableRows,
								'iTotalDisplayRecords' : iTotalDisplayRecords,
								'iTotalRecords' : iTotalRecords
							});
						}
					});
}
