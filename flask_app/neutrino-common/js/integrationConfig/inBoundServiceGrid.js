$(document).ready(function() {
		var targettableId = "#inBoundServiceGrid";
		var objectList1=inBoundServicesJson;
		var colConf=getColumnConfig(targettableId,objectList1[0]);
		renderTable(targettableId, objectList1, colConf)
	});
	
	function renderTable(targettableId, objectList1, colConf) {
		
		var oTable = $(targettableId).dataTable({
			"aaData" : objectList1,
			"aoColumnDefs" : colConf

		});
	}

	function getColumnConfig(targettableId,singleObject) {
		var columnConfig = new Array();
		var i = 0;
		var taskId=null;
		for ( var key in singleObject) {
			var funName =  null;
			if(key == "serviceId") { funName=createLinkForServiceId; }
			if(key == "wsdlURL") { funName=createLinkForwsdlURL; }
			if(key == "active" || key == "secured") { funName=booleanColors; }
			var localObj = {
				"aTargets" : [ "tbl_" + key ],
				"mDataProp" : key,
				"bSortable": false,
				"fnCreatedCell" : funName
			};
			columnConfig.push(localObj);
			i++;
		}
		return columnConfig;
	}

	function createLinkForServiceId(nTd, sData, oData, iRow, iCol)
	{
		var link='<a href="'+getContextPath()+'/app/integrationConfig/inbound/view/'+oData["serviceId"]+'">'+sData+'</a>';
		$(nTd).html(link);
	}
	
	function createLinkForwsdlURL(nTd, sData, oData, iRow, iCol)
	{
		var link='<a href="'+oData["wsdlURL"]+'">WSDL</a>';
		$(nTd).html(link);
	}

	function booleanColors(nTd, sData, oData, iRow, iCol) {
		if (sData) {
			$(nTd).html('<span class="text-success">'+active_secured_yes+'</span>');
		}else{
			$(nTd).html('<span class="text-danger">'+active_secured_no+'</span>');
		}
	}