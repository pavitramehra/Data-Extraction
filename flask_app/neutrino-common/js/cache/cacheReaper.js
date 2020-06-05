/**
 * ******************************************** Cache Reaper
 * ************************************************
 */


var cacheGroupSet = [];

$(document)
		.ready(
				function() {
					$('[id^=regionName]')
							.each(
									function(index, element) {
										var regionName = element.value;
										var tableId = "#regionTable_"
												+ regionName;
										var loadUrl = getContextPath()
												+ "/app/cacheMaster/getAllCacheGroupsForRegion/"
												+ regionName;
										var oTable = $(
												"#regionTable_" + regionName)
												.dataTable(
														{
															"bFilter" : true,
															"bInfo" : true,
															"bSort" : true,
															"width" : "auto",
															"bAutoWidth" : true,
															"bLengthChange" : true,
															"bPaginate" : true,
															"bJQueryUI" : false,
															"lengthMenu" : [ 3,
																	5, 10, 25,
																	50, 100 ],
															"sAjaxSource" : loadUrl,
															"aaSorting" : [ [
																	1, "asc" ] ],
															"aoColumns" : [
																	{
																		sDefaultContent : "",
																		"bSearchable" : false,
																		"bSortable" : false
																	},
																	{
																		mDataProp : "cacheGroupName",
																		sDefaultContent : ""
																	},
																	{
																		mDataProp : "buildStatus",
																		sDefaultContent : ""
																	},
																	{
																		mDataProp : "lastSuccessTime",
																		sDefaultContent : ""
																	},
																	{
																		mDataProp : "lastUpdatedTime",
																		sDefaultContent : ""
																	},
																	{
																		mDataProp : "failedAttempt",
																		sDefaultContent : ""
																	},
																	{
																		mDataProp : "forceBuild",
																		sDefaultContent : ""
																	},
																	{
																		mDataProp : "ipAddress",
																		sDefaultContent : ""
																	} ],

															"aoColumnDefs" : [

																	{
																		"aTargets" : [ 1 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"render" : function(
																				data,
																				type,
																				fullObj) {
																			var htmlCode = "";
																			htmlCode += "<a href='#' onClick='openModal(\""
																					+ data
																							.toString()
																					+ "\")' id='viewTag'>"
																					+ data
																					+ "</a>";
																			return htmlCode;
																		},
																		"sType" : "string",
																		"sClass" : "visibility-exclude"
																	},
																	{
																		"aTargets" : [ 2 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"sType" : "string"
																	},
																	{
																		"aTargets" : [ 3 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"sType" : "string"
																	},
																	{
																		"aTargets" : [ 4 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"sType" : "string"
																	},
																	{
																		"aTargets" : [ 5 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"sType" : "numeric"
																	},
																	{
																		"aTargets" : [ 6 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"sType" : "string"
																	},
																	{
																		"aTargets" : [ 7 ],
																		"bSearchable" : true,
																		"bSortable" : true,
																		"sType" : "string"
																	} ],
															"fnRowCallback" : function(
																	nRow,
																	aData,
																	iDisplayIndex) {
																var cacheGroupName = $(
																		'td:eq(1)',
																		nRow)[0].innerText;
																if ($(
																		'td:eq(2)',
																		nRow)[0].innerText == "ERROR"
																		&& $(
																				'td:eq(6)',
																				nRow)[0].innerText == "false") {

																	var test = $(
																			"#selectAllCacheGroup_"
																					+ regionName)
																			.prop(
																					'checked');

																	var test2 = $(
																			"#checkBox_"
																					+ cacheGroupName)
																			.prop(
																					'checked');

																	var test3 = checkExistenceOfGroupInCacheGroupSet(cacheGroupName);

																	var isChecked = (test == "checked"
																			|| test == true
																			|| test2 == "checked"
																			|| test2 == true
																			|| test3 == "checked" || test3 == true);

																	if (isChecked) {
																		$(
																				'td:eq(0)',
																				nRow)
																				.html(
																						'<input type="checkbox" id="checkBox_'
																								+ cacheGroupName
																								+ '" onclick="updateCacheGroupForRefreshSet(\''
																								+ cacheGroupName
																								+ '\', \''
																								+ regionName
																								+ '\')" name="'
																								+ cacheGroupName
																								+ '" checked="checked" />');

																	} else {
																		$(
																				'td:eq(0)',
																				nRow)
																				.html(
																						'<input type="checkbox" id="checkBox_'
																								+ cacheGroupName
																								+ '" onclick="updateCacheGroupForRefreshSet(\''
																								+ cacheGroupName
																								+ '\', \''
																								+ regionName
																								+ '\')" name="'
																								+ cacheGroupName
																								+ '"  />');
																	}

																	updateCacheGroupSet(
																			cacheGroupName,
																			regionName,
																			isChecked);

																}
															},
															"sDom" : '<"clear">fl<"#colvis_regionTable_'
																	+ regionName
																	+ '">rt<"row"<"pull-right"p><"pull-right"B><"pull-left col-sm-6"i>>',
															"buttons" : [
																	{
																		"extend" : "copy",
																		"text" : "copy",
																		exportOptions : {
																			columns : ':visible:not(.export-exclude)'
																		}
																	},
																	{
																		"extend" : "csv",
																		"text" : "csv",
																		"title" : 'cacheReaper_'
																				+ regionName,
																		exportOptions : {
																			columns : ':visible:not(.export-exclude)'
																		},
																		customize : function(
																				csvData) {
																			return csvButton(csvData);
																		}
																	},
																	{
																		"extend" : "excel",
																		"text" : "xls",
																		"title" : 'cacheReaper_'
																				+ regionName,
																		exportOptions : {
																			columns : ':visible:not(.export-exclude)'
																		},
																		customizeData : function(
																				csvData) {
																			return excelButton(csvData);
																		}

																	},
																	{
																		"extend" : "pdf",
																		"text" : "pdf",
																		"title" : 'cacheReaper_'
																				+ regionName,
																		orientation : 'landscape',
																		exportOptions : {
																			columns : ':visible:not(.export-exclude)'
																		},
																		customize : function(
																				doc) {
																			return pdfButton(
																					doc,
																					tableId);
																		}
																	}

															]

														});

										new $.fn.dataTable.Buttons(
												oTable,
												{
													buttons : [ {
														extend : 'colvis',
														"text" : "Show/Hide Columns",
														columns : ':not(.visibility-exclude)'
													} ]
												});
										oTable.api().buttons(1, null)
												.container().appendTo(
														'#colvis_regionTable_'
																+ regionName);

									});

				});

function updateCacheGroupForRefreshSet(cacheGroupName, regionName) {
	var checkBox = $("#checkBox_" + cacheGroupName);
	updateCacheGroupSet(cacheGroupName, regionName, checkBox.prop("checked"));
}

function updateCacheGroupSet(cacheGroupName, regionName, isChecked) {
	if (isChecked == true) {
		if (!cacheGroupSet.includes(cacheGroupName)) {
			cacheGroupSet.push(cacheGroupName);
		}
	} else if (cacheGroupSet.includes(cacheGroupName)) {
		$("#selectAllCacheGroup_" + regionName).prop("checked", false);
		cacheGroupSet.splice(cacheGroupSet.indexOf(cacheGroupName), 1);
	}
	displayBttns();
}

function checkExistenceOfGroupInCacheGroupSet(cacheGroupName) {
	return cacheGroupSet.includes(cacheGroupName);
}

function updateAllCacheGroupForRefreshSet(regionName) {
	var selectAllCheckBox = $("#selectAllCacheGroup_" + regionName);
	$('[id^=checkBox_]').each(function(index, element) {
		$(element).prop("checked", selectAllCheckBox.prop("checked"));
		var cacheGroupName = element.name;
		updateCacheGroupForRefreshSet(cacheGroupName, regionName);
	});
}

function displayBttns() {
	if (cacheGroupSet.length > 0) {
		$("#cacheRefreshButton").show();
	} else {
		$("#cacheRefreshButton").hide();
	}
}

function openConfirmationModalForCacheRefresh() {
	$('#confirmCacheRefreshModal').modal('show');
}

function markForCacheRefresh() {
	ajaxCallForMarkCacheRefresh();
	var tempCacheGroupSet = cacheGroupSet.slice();
	tempCacheGroupSet.forEach(function(item) {
		$("#checkBox_" + item).prop("checked", false);
		cacheGroupSet.splice(cacheGroupSet.indexOf(item), 1);
	});
	$('[id^=selectAllCacheGroup_]').each(function(index, element) {
		$(element).prop("checked", false);
	});
	displayBttns();
	closeDialog();
	var url = getContextPath() + '/app/cacheMaster/getAllCacheRegions';
	setTimeout(function() {
		neutrinoNavigateTo(url);
	}, 1500);
}

function populateModal(data) {
	var loadUrl = getContextPath() + "/app/cacheMaster/getCacheNamesForGroup/"
			+ data;
	var ooTable = $("#cacheDetail_Table")
			.dataTable(
					{
						"bDestroy" : true,
						"bFilter" : true,
						"bInfo" : true,
						"bSort" : true,
						"width" : "auto",
						"bAutoWidth" : true,
						"bLengthChange" : true,
						"bPaginate" : true,
						"bJQueryUI" : false,
						"lengthMenu" : [ 5, 10, 25, 50, 100 ],
						"sAjaxSource" : loadUrl,
						"aaSorting" : [ [ 0, "asc" ] ],
						"aoColumns" : [ {
							mDataProp : "cacheName",
							sDefaultContent : ""
						}, {
							mDataProp : "buildStatus",
							sDefaultContent : ""
						} ],

						"aoColumnDefs" : [ {
							"aTargets" : [ 0 ],
							"bSearchable" : true,
							"bSortable" : true,
							"sType" : "string",
							"sClass" : "visibility-exclude"
						}, {
							"aTargets" : [ 1 ],
							"bSearchable" : true,
							"bSortable" : true,
							"sType" : "string"

						} ],
						"sDom" : '<"clear">fl<"#colvis_cacheDetail_Table">rt<"row"<"pull-right"p><"pull-right"B><"pull-left col-sm-6"i>>',
						"buttons" : [ {
							"extend" : "copy",
							"text" : "copy",
							exportOptions : {
								columns : ':visible:not(.export-exclude)'
							}
						}, {
							"extend" : "csv",
							"text" : "csv",
							"title" : 'buildStatus_' + data,
							exportOptions : {
								columns : ':visible:not(.export-exclude)'
							},
							customize : function(csvData) {
								return csvButton(csvData);
							}
						}, {
							"extend" : "excel",
							"text" : "xls",
							"title" : 'buildStatus_' + data,
							exportOptions : {
								columns : ':visible:not(.export-exclude)'
							},
							customizeData : function(csvData) {
								return excelButton(csvData);
							}

						}, {
							"extend" : "pdf",
							"text" : "pdf",
							"title" : 'buildStatus_' + data,
							orientation : 'landscape',
							exportOptions : {
								columns : ':visible:not(.export-exclude)'
							},
							customize : function(doc) {
								return pdfButton(doc, "#cacheDetail_Table");
							}
						}

						]

					});

	new $.fn.dataTable.Buttons(ooTable, {
		buttons : [ {
			extend : 'colvis',
			"text" : "Show/Hide Columns",
			columns : ':not(.visibility-exclude)'
		} ]
	});
	ooTable.api().buttons(1, null).container().appendTo(
			'#colvis_cacheDetail_Table');

};

function openModal(data) {
	$('#cacheDetailModalHeader').html(data);
	populateModal(data);
	$('#cacheDetailModal').modal('show');
};

function closeDialog() {
	$('.modal').modal('hide');
}

function ajaxCallForMarkCacheRefresh() {
	$.ajax({
		async : false,
		url : getContextPath() + "/app/cacheMaster/markForCacheRefresh",
		data : {
			cacheGroupNames : cacheGroupSet
		},
		type : 'POST',
		success : function(result) {
			var responseMessage = result.message;
			if (result.error == "true") {
				new PNotify({
					title : 'Error',
					text : responseMessage,
					type : 'error',
					opacity : .8
				});
			} else {
				new PNotify({
					title : 'Done',
					text : responseMessage,
					type : 'success',
					opacity : .8
				});
			}
		},
		error : function(response) {
			new PNotify({
				title : 'Error',
				text : error_message,
				type : 'error',
				opacity : .8
			});
		}
	});
}