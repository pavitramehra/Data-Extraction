var tempDataTable;
(function ($) {
	$.fn.ruleMatrix = function (options) {
		this.settings = $.extend({
			headerUrl : "",
			bodyUrl : "",
			tableproperties : "",
			viewable : false
		}, options);
		var rootElement = this;
		var atr = this.settings;
		var ruleTable,indexArr = [],actionrowindex;
		var currentSelected = 0;

		var rightColumnsFix = 0;
		var leftColumnsFix = 0;
		var scrollXProp = false;
		var autoWidthProp = false;

		var ruleMatrixDom = "<table></table>";

		var _init = function () {
			rootElement.html(ruleMatrixDom);
			$.ajax({
	            url: atr.headerUrl,
	            data : "&viewable=" + viewable,
	            success: function(json){
	                json = JSON.parse(json);
	                actionrowindex = json.aaData[0].length;
					rowIndex = json.iTotalRecords;
	                if(!atr.viewable){
	                	populateRowData("new", rowIndex);
	            	}
	                _bindHeader(json.aaData[0]);
					_bindAction();
	            },error: function(){
	                showMessage(errorTitle, some_error_occurred, errorType);
	            }
        	});
		};
		var _bindHeader = function(headData){
			if(headData.length > 7){
				scrollXProp = true;
				autoWidthProp = true;
			}

			var ruleTableHead = "<thead><tr>";
			for(var i = 0; i<headData.length;i++){
				if(headData[i] == null){
					ruleTableHead += "<th></th>";
				}
				else{
					if(headData[i].endsWith('####'))
                        ruleTableHead += "<th class='thenAction'>"+headData[i].replace('####','')+"</th>";
                    else
                        ruleTableHead += "<th>"+headData[i]+"</th>";
				}
			}
			ruleTableHead += "</tr></thead>";
			rootElement.find("table").append(ruleTableHead);
			_applyDatatable();
		};
		var _applyDatatable = function(){

			if(!atr.viewable){
				rightColumnsFix = 0;
			}
			ruleTable = rootElement.find("table").DataTable({
				scrollY:"300px",
				scrollX:scrollXProp,
				scrollCollapse: autoWidthProp,
				autoWidth: autoWidthProp,
                "language":atr.tableproperties.language,
                paging:true,
                "lengthMenu":atr.tableproperties.lengthMenu,
                "sPaginationType": atr.tableproperties.sPaginationType,
                "sAjaxSource": atr.bodyUrl,
				"bServerSide": false,
                "sDom": atr.tableproperties.sDom,
                "columnDefs":[{"orderable": false,"targets":actionrowindex - 1}],
				"aaSorting": [],
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					var ruleRowAction = "";
					if(!atr.viewable){
						ruleRowAction = "<a href='javascript:void(0);' data-index='"+aData[0][1]+"' data-type='"+aData[aData.length - 1][0]+"' class='editRuleRow'><i class='glyphicon glyphicon-pencil'></i></a><a href='javascript:void(0);' data-index='"+aData[0][1]+"' data-type='"+aData[aData.length - 1][1]+"' class='deleteRuleRow'><i class='glyphicon glyphicon-trash'></i></a>";
					}
					else{
						ruleRowAction = "<a href='javascript:void(0);' style='visibility:hidden;' data-index='"+aData[0][1]+"' data-type='"+aData[aData.length - 1][0]+"' class='editRuleRow'><i class='glyphicon glyphicon-pencil'></i></a><a href='javascript:void(0);' style='visibility:hidden;' data-index='"+aData[0][1]+"' data-type='"+aData[aData.length - 1][1]+"' class='deleteRuleRow'><i class='glyphicon glyphicon-trash'></i></a>";
					}
					$('td:eq('+(nRow.childElementCount - 1)+')', nRow).html(ruleRowAction);
					$('td:eq('+(0)+')', nRow).html(aData[0][0]);


				},
				"initComplete": function(settings, json) {
					/*new $.fn.dataTable.FixedColumns( ruleTable, {
    					rightColumns:1,
    					leftColumns:1
					});*/
					for(var i=0;i<json.aaData.length;i++){
						indexArr.push(json.aaData[i][0][1]);
					}
				_rightColumnFix();
				}

			});
    		tempDataTable = ruleTable;

		};
		var _bindAction = function(){
			rootElement.on("ruleMatrixAdd",function(e,json){
				json = JSON.parse(json);
				var EditMode = false;
				if(indexArr.indexOf(json.aaData[0][0][1]) > -1){
					EditMode = true;
				}
				if(EditMode){
					_editRowData(json);
				}
				else{
					_addRowData(json);
				}
			});
			rootElement.off("click",".editRuleRow");
			rootElement.on("click",".editRuleRow",function(){
				currentSelected = $(this).data("index");
				rowIndex = currentSelected;
				populateRowData('edit',rowIndex);
			});
			rootElement.off("click",".deleteRuleRow");
			rootElement.on("click",".deleteRuleRow",function(){
				var dis = $(this).closest("tr");
				currentSelected = ruleTable.row(dis).index();
				ruleTable.row(currentSelected).remove().draw();
				var index = indexArr.indexOf($(this).data("index"));
				if (index > -1) {
				  indexArr.splice(index, 1);
				}
				deleteRowData($(this).data("index"));
			});
		};
		var _addRowData = function(json){
			indexArr.push(json.aaData[0][0][1]);
			ruleTable.row.add(json.aaData[0]).draw(false);
		};

		var _editRowData = function(json){
			ruleTable.row(currentSelected).data(json.aaData[0]).draw();
		};

		var _rightColumnFix = function(){
			var t_w = rootElement.find(".dataTables_scrollHeadInner").width();
			if(t_w < rootElement.width()){
				rootElement.find('.DTFC_RightWrapper').hide();
			}
			else{
				rootElement.find('.DTFC_RightWrapper').show();
			}

			rootElement.find(".dataTables_scrollBody").css({"max-height":rootElement.find(".dataTables_scrollBody").height(),"height":"auto"});
            rootElement.find(".dataTables_scrollHead").css("overflow","initial");
            rootElement.find("[id^=DataTables_Table_][id$=_info]").css("margin-top","11px");
		};

		_init();
		return this;
	};
}(jQuery));
