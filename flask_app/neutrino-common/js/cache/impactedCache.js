/**
 * ******************************************** Impacted Cache
 * ************************************************
 */

var cacheIdentifierSet = [];

$(document)
		.ready(
				function() {
					var loadUrl = getContextPath()
							+ "/app/cacheMaster/getAllImpactedCaches";
					var oTable = $("#table_ImpactedCache")
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
										"lengthMenu" : [ 10, 25, 50, 100 ],
										"sAjaxSource" : loadUrl,
										"aaSorting" : [ [ 1, "asc" ] ],
										"aoColumns" : [ {
											sDefaultContent : "",
											"bSearchable" : false,
											"bSortable" : false
										}, {
											mDataProp : "cacheName",
											sDefaultContent : ""
										}, {
											mDataProp : "regionName",
											sDefaultContent : ""
										}, {
											mDataProp : "lastAttemptedTime",
											sDefaultContent : ""
										} ],

										"aoColumnDefs" : [

										{
											"aTargets" : [ 1 ],
											"bSearchable" : true,
											"bSortable" : true,
											"sType" : "string",
											"sClass" : "visibility-exclude"
										}, {
											"aTargets" : [ 2 ],
											"bSearchable" : true,
											"bSortable" : true,
											"sType" : "string"
										}, {
											"aTargets" : [ 3 ],
											"bSearchable" : true,
											"bSortable" : true,
											"sType" : "string"
										} ],
										"fnRowCallback" : function(nRow, aData,
												iDisplayIndex) {

											var cacheName = $('td:eq(1)', nRow)[0].innerText;
											var regionName = $('td:eq(2)', nRow)[0].innerText;
											var cacheIdentifier = regionName
													+ "-"
													+ cacheName;

											var test = $(
													"#selectAll_ImpactedCache")
													.prop('checked');

											var test2 = $(
													"#checkBox_"
															+ cacheIdentifier)
													.prop('checked');

											var test3 = checkExistenceOfCacheInRefreshSet(cacheIdentifier);

											var isChecked = (test == "checked"
													|| test == true
													|| test2 == "checked"
													|| test2 == true
													|| test3 == "checked" || test3 == true);

											if (isChecked) {
												$('td:eq(0)', nRow)
														.html(
																'<input type="checkbox" id="checkBox_'
																		+ cacheIdentifier
																		+ '" onclick="updateCacheForRefreshSet(\''
																		+ cacheIdentifier
																		+ '\')" name="'
																		+ cacheIdentifier
																		+ '" checked="checked" />');

											} else {
												$('td:eq(0)', nRow)
														.html(
																'<input type="checkbox" id="checkBox_'
																		+ cacheIdentifier
																		+ '" onclick="updateCacheForRefreshSet(\''
																		+ cacheIdentifier
																		+ '\')" name="'
																		+ cacheIdentifier
																		+ '"  />');
											}

											updateCacheRefreshSet(
													cacheIdentifier, isChecked);

										},
										"sDom" : '<"clear">fl<"#colvis_table_ImpactedCache">rt<"row"<"pull-right"p><"pull-right"B><"pull-left col-sm-6"i>>',
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
													"title" : "impactedCaches",
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
													"title" : "impactedCaches",
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
													"title" : "impactedCaches",
													orientation : 'landscape',
													exportOptions : {
														columns : ':visible:not(.export-exclude)'
													},
													customize : function(doc) {
														return pdfButton(doc,
																"#table_ImpactedCache");
													}
												}

										]

									});

					new $.fn.dataTable.Buttons(oTable, {
						buttons : [ {
							extend : 'colvis',
							"text" : "Show/Hide Columns",
							columns : ':visible:not(.visibility-exclude)',
						} ]
					});

					oTable.api().buttons(1, null).container().appendTo(
							'#colvis_table_ImpactedCache');

				});

function updateCacheForRefreshSet(cacheIdentifier) {
	var checkBox = $("#checkBox_" + cacheIdentifier);
	updateCacheRefreshSet(cacheIdentifier, checkBox.prop("checked"));
}

function updateCacheRefreshSet(cacheIdentifier, isChecked) {
	if (isChecked == true) {
		if (!cacheIdentifierSet.includes(cacheIdentifier)) {
			cacheIdentifierSet.push(cacheIdentifier);
		}
	} else if (cacheIdentifierSet.includes(cacheIdentifier)) {
		$("#selectAll_ImpactedCache").prop("checked", false);
		cacheIdentifierSet.splice(cacheIdentifierSet.indexOf(cacheIdentifier),
				1);
	}
	displayBttns();
}

function checkExistenceOfCacheInRefreshSet(cacheIdentifier) {
	return cacheIdentifierSet.includes(cacheIdentifier);
}

function updateAllCachesForRefreshSet() {
	var selectAllCheckBox = $("#selectAll_ImpactedCache");
	$('[id^=checkBox_]').each(function(index, element) {
		$(element).prop("checked", selectAllCheckBox.prop("checked"));
		var cacheIdentifier = element.name;
		updateCacheForRefreshSet(cacheIdentifier);
	});
}

function displayBttns() {
	if (cacheIdentifierSet.length > 0) {
		$("#impactedCacheRefreshButton").show();
	} else {
		$("#impactedCacheRefreshButton").hide();
	}
}

function openConfirmationModalForCacheRefresh() {
	$('#confirmImpactedCacheRefreshModal').modal('show');
}

function triggerCacheRefresh() {
	ajaxCalltoTriggerCacheRefresh();
	var tempCacheIdentifierSet = cacheIdentifierSet.slice();
	tempCacheIdentifierSet.forEach(function(item) {
		$("#checkBox_" + item).prop("checked", false);
		cacheIdentifierSet.splice(cacheIdentifierSet.indexOf(item), 1);
	});
	$("#selectAll_ImpactedCache").prop("checked", false);

	displayBttns();
	closeDialog();

	var url = getContextPath() + '/app/cacheMaster/getImpactedCacheMaster';
	setTimeout(function() {
		neutrinoNavigateTo(url);
	}, 1500);
}

function closeDialog() {
	$('.modal').modal('hide');
}

function ajaxCalltoTriggerCacheRefresh() {
	$.ajax({
		async : false,
		url : getContextPath() + "/app/cacheMaster/buildImpactedCaches",
		data : {
			cacheIdentifierSet : cacheIdentifierSet
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