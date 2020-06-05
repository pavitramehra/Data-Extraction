    (function ($) {

	$.fn.tablecontag = function (options) {
		this.settings = $.extend({
			url :"",
			type : "",
			disbursalInitiation : "",
			withcontainer : true,
			headerJson : '',
			colouredStrip : false
		}, options);
		var elem = this;
		var atr = this.settings;
		var dom = "<div class='appGridActionBar clearfix' id='appGridActionBar'></div>"+
					"<div class='gridTableContainer' id='gridTableContainer'>"+
						"<table></table>"+
					"</div>";
		var tableconfig = {}, datasortable = [], urlForStorageArray = [];
		var appIndex,table,searchManualCall="",localId = "",inQueueStatusIndex;
		var historyIndex;
		var approveInfoIndex;
		var reasonsIndex;
		var URLidNumber = ["sendToOptsGrid","LoanApplication_Assigned","LoanApplication_Assigned_Disbursal","LoanApplication_Pool","CreditApproval_Assigned","CreditApproval_Pool"];
		var viewGrids = ["LoanApplication_Hold","CreditApproval_Hold", "lead_hold","lead_archive","lead_rejected","proposal_proposal","proposal_archive","WaiverInitiationGrid","WaiverApprovalGrid","sendToOptsGrid","Collateral_Investigation","Collateral_Valuation_Completion","dynamicApplication_assigned","dynamicApplication_hold","dynamicApplication_pool","dynamicApplication_reject","dynamicApplication_cancel", "dynamicApplication_archived"];
		var tempAssignOnIdClick = ["LoanApplication_Pool", "CreditApproval_Pool", "lead_pool"]; //For swapping of id number click with temp assign action
		var loadSearchDataFlag = false;
		var tempData = ["#795548", "#9c27b0", "#ff0000", "#8bc34a", "#a9a9a9", "#ff6600", "#ffeb3b"];
		var colorValue="";
		var _init = function () {
			elem.css({"visibility":"hidden"});
			/*$.ajax({
				type : "GET",
				url : atr.url,
				data:{type:atr.type, disbursalInitiation:atr.disbursalInitiation},
				success : function(data) {
					$("#loading").show();
					tableconfig = data;
					elem.append(dom);
					elem.find("#gridTableContainer > table").attr("id",tableconfig.configurationData.masterId);
					$("#loading").hide();
					_getActiveKeyFromServer(tableconfig.configurationData.masterId);
				},
				error : function() {
					$("#loading").hide();
					console.log('alert');
				}
			}); */
			$("#loading").show();
			tableconfig = atr.headerJson;
			elem.append(dom);
			elem.find("#gridTableContainer > table").attr("id",tableconfig.configurationData.masterId);
			_getActiveKeyFromServer(tableconfig.configurationData.masterId);
			$("#loading").hide();
		};

		var _paintTopAction = function(){
			$("#loading").show();
			var gridtopActionDom = "<ul class='gridActionList clearfix' id='gridActions_"+tableconfig.configurationData.masterId+"'>";
			if(tableconfig.isTeamLead){
				if(!tableconfig.configurationData.filterColor){
					gridtopActionDom += "<li class='enableSeprator showTasktextLi clearfix'><span class='showTasktext'>Show Task</span>";
				}	else{
					gridtopActionDom += "<li class='showTasktextLi clearfix'><span class='showTasktext'>Show Task</span>";
				}
						gridtopActionDom += "<a href='javascript:void(0);' data-type='All' class='allTask '>All</a>";
						gridtopActionDom += "<a href='javascript:void(0);' data-type='immediate' class='teamTask active'>Team</a>";

					if(tableconfig.configurationData.mytask){
					gridtopActionDom += "<a href='javascript:void(0);' data-type='mytasks' class='tasksIco'>My</a></li>";
					}

			}
			if(tableconfig.configurationData.filterColor && !tableconfig.allowCodingForTat){
				gridtopActionDom += "<li class='enableSeprator'><a href='javascript:void(0);' class='filterIco'><i class='neoicon-filter'></i>Filter by Color</a>"+
				"<div class='filterByColorDropDown gridDropDownBoxOption' style='display:none;'><ul class='clearfix'>";
					gridtopActionDom += "<li><a href='javascript:void(0);' data-keyvalue=''>Clear</a></li>";
					for(var i =0; i<tempData.length;i++){
						gridtopActionDom += "<li><a href='javascript:void(0);' data-keyvalue='"+tempData[i]+"'><span style='background-color:"+tempData[i]+"'></span>"+tempData[i]+"</a></li>";
					}
				gridtopActionDom += "</ul></div></li>";
			}
			if(tableconfig.configurationData.copy){
				if(!tableconfig.configurationData.export){
					gridtopActionDom += "<li class='enableSeprator'><a href='javascript:void(0);' class='copyclipboardIco'><i class='neoicon-copy-clipboard'></i>Copy</a></li>";
				}
				else{
					gridtopActionDom += "<li><a href='javascript:void(0);' class='copyclipboardIco' ><i class='neoicon-copy-clipboard'></i>Copy</a></li>";
				}
			}
			if(tableconfig.configurationData.export){
                if (_generateAppPdfFlag(tableconfig.configurationData.masterId)){
                    gridtopActionDom += "<li class='enableSeprator'><a href='javascript:void(0);' class='exportIco'><i class='neoicon-export'></i>Export</a>"+
                    "<ul class='clearfix exportList gridDropDownBoxOption' style='display:none;'>"+
                        "<li><a href='javascript:void(0);' data-export='exl' class='ExcelExport'>Export as Excel</a></li>"+
                        "<li><a href='javascript:void(0);' data-export='csv' class='csvExport'>Export as CSV</a></li>"+
					"<li><a href='javascript:void(0);' id='pdfAppGrid'>Export as PDF</a></li>"+
                    "</ul>"+
                    "</li>";
                }
                else{
                gridtopActionDom += "<li class='enableSeprator'><a href='javascript:void(0);' class='exportIco'><i class='neoicon-export'></i>Export</a>"+
                "<ul class='clearfix exportList gridDropDownBoxOption' style='display:none;'>"+
                    "<li><a href='javascript:void(0);' data-export='exl' class='ExcelExport'>Export as Excel</a></li>"+
                    "<li><a href='javascript:void(0);' data-export='csv' class='csvExport'>Export as CSV</a></li>"+
                "</ul>"+
                "</li>";
                }
			}
			if(tableconfig.configurationData.loadSearch){
				gridtopActionDom += "<li><a href='javascript:void(0);' class='loadsearchIco'><i class='neoicon-load-search'></i>Load Search</a>"+
				"<div class='loadSearchModalData gridDropDownBoxOption' style='display:none;'><ul class='clearfix'></ul></div></li>";
			}
			if(tableconfig.configurationData.savedsearch){
				gridtopActionDom += "<li><a href='javascript:void(0);' class='savesearchIco'><i class='neoicon-save-search'></i>Save Search</a>"+
					"<div class='saveSearchModal gridDropDownBoxOption clearfix' style='display:none;'>"+
						"<label class='savelabel'>Name your search</label>"+
						"<div class='inputBox'>"+
							"<input type='text' maxlength='50' class='saveSearchText' id='saveSearchText' />"+
						"</div>"+
						"<p class='saveSearchHint'>Hint: You can enter name like HomeLoan_DDE_Dealer_Bandra</p>"+
						"<a href='javascript:void(0);' id='saveSearchBtn' class='saveSearchBtn'>Save</a>"
					"</div>"+
				"</li>";
				gridtopActionDom += "<li><a href='javascript:void(0);' class='loadsearchIcoFilter'><i class='neoicon-load-search'></i>Clear Filter</a></li>";
			}
			gridtopActionDom += "</ul>";
			if(tableconfig.configurationData.preference){
				gridtopActionDom += "<div class='prefrenceAction'><a href='javascript:void(0);' class='prefrenceActionIco'><i class='neoicon-columns'></i>Show/Hide</a><div class='showhidepreference gridDropDownBoxOption clearfix' id='showhidepreference' style='display:none;'>";

				gridtopActionDom += "</div></div>";
			}

			if(tableconfig.configurationData.actionConfigurations){
				gridtopActionDom += "<ul class='clearfix commonActions' id='commonActions_"+tableconfig.configurationData.masterId+"' style='display:none;'>";
				for(var i=0;i< tableconfig.configurationData.actionConfigurations.length;i++){
					gridtopActionDom += "<li style='display:none;'><a href='javascript:void(0);' data-actiontype='"+tableconfig.configurationData.actionConfigurations[i].action+"' class='"+tableconfig.configurationData.actionConfigurations[i].action+"Ico' id='"+tableconfig.configurationData.actionConfigurations[i].action+"Btn'>"+tableconfig.configurationData.actionConfigurations[i].action+"<i class='"+tableconfig.configurationData.actionConfigurations[i].imagePath+"'></i></a></li>";
				}
				gridtopActionDom += "</ul>";
			}
			elem.find("#appGridActionBar").append(gridtopActionDom);
			_prefrenceActionClick();
			$("#loading").hide();
		};
		function _prefrenceActionClick(){
			elem.find(".prefrenceAction .prefrenceActionIco").on("click",function(e){
				_getPerfData(e);
				e.stopPropagation();
				var targetContainer = $(this).closest(".prefrenceAction").find("#showhidepreference");
				elem.find("#gridActions_"+tableconfig.configurationData.masterId+">li .gridDropDownBoxOption").hide();
				var classArr = ['exportIco','loadsearchIco','savesearchIco'];
				if(elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIco").hasClass('active') && loadSearchDataFlag){
					classArr.remove('loadsearchIco');
				};
				for(var i=0;i<classArr.length;i++){
					elem.find("#gridActions_"+tableconfig.configurationData.masterId+" ." + classArr[i]).removeClass('active');
				}
				if($(this).hasClass("opened")){
					targetContainer.hide();
					$(this).removeClass("opened");
				}
				else{
					$(this).addClass("opened");
			        targetContainer.show();
				}
				$(this).unbind( "click" );
			});
		};
		var _getPerfData=function(e){
				var activeTabIndex = $("#mainChildTabs li.active").index();
				var activeTabName = "";
			    if(activeTabIndex == 0){
			        activeTabName = "Assign"
			    }
			    else if(activeTabIndex == 1){
				    activeTabName = "Pool";
				}
				else if(activeTabIndex == 2){
				    activeTabName = "Hold";
				}
		        $.ajax({
		            url : getContextPath() + "/app/UserPreference/getUserPreference",
		            data : {
		                "activeTabName" : activeTabName,
		                 "masterId" : tableconfig.configurationData.masterId
		           },
		            success : function(data){
		            	_preferencelistHandle(data,e);
		            },
		            error : function(data, textStatus, errorThrown) {
						new PNotify({
							title : "error",
							text : "Some Error Occured while fetching User Preference",
							type : "error",
							opacity : .8
						});
					}
		        });
	};
		var stageCount = 0;

		var _paintTableHead = function(data){
			$("#loading").show();
			var tableHeadDom = "<thead><tr>";
			count = 0;
			for(var i=0; i<data.length; i++){
				if((data[i].dataField == "applicationNumber" || data[i].dataField == "processNumber"  || data[i].dataField == "leadReferenceNumber") && count < 1 || data[i].dataField == "referenceId"){

					count++;
					tableHeadDom +="<th>"
					if(tableconfig.configurationData.actionConfigurations != null && data[data.length-1].titleKey === "key.actions"){
						tableHeadDom += "<span class='customCheckbox'><input type='checkbox' class='selectAllApp selectAllApp_"+tableconfig.configurationData.masterId+"' /><label></label></span>";
					}
					tableHeadDom += "<span class='titleText' title='"+data[i].displayName+"'>"+data[i].displayName+"</span>";
					if(data[i].searchable){
						tableHeadDom += "<input type='text' class='columnSearch' tabindex='10"+i+"' data-id='"+data[i].dataField+"' />";
					}
					if(!data[i].sortable){
						datasortable.push({"orderable": false,"targets":i});
					}
					tableHeadDom += "</th>"
					appIndex = i;
				}
				else{
					tableHeadDom += "<th><span class='titleText' title='"+data[i].displayName+"'>"+data[i].displayName+"</span>";
					if(data[i].searchable){
						tableHeadDom += "<input type='text' data-id='"+data[i].dataField+"' tabindex='10"+i+"' class='columnSearch' />";
					}
					if(!data[i].sortable){
							datasortable.push({"orderable": false,"targets":i});
					}
					tableHeadDom += "</th>";
				}
				if(data[i].dataField == "associatedStageName"){
                	stageCount=i;
                }
                if(data[i].dataField == "inQueueStatus"){
                    inQueueStatusIndex = i;
                }
				if(data[i].dataField == "history"){
					historyIndex = i;
				}
				if(data[i].dataField == "approveDecision"){
					approveInfoIndex = i;
				}
				if(data[i].dataField == "reason"){
					reasonsIndex = i;
				}
			}
			tableHeadDom += "</tr><thead>";

			elem.find("#"+tableconfig.configurationData.masterId).append(tableHeadDom);
			$("#loading").hide();
			_applyDataTable();
		};

		var _applyDataTable = function(){
			if(!atr.withcontainer){
				tableconfig.configurationData.scrollY = window.innerHeight - (elem.offset().top + 196) + "px";
			}
			setTimeout(function(){

				var buttonCommon = {
        			exportOptions: {
            			format: {
                			body: function ( data, row, column, node ) {
                    			if(tableconfig.configurationData.dataTableRecords[column].dataField == "applicationNumber" || tableconfig.configurationData.dataTableRecords[column].dataField == "leadReferenceNumber" || tableconfig.configurationData.dataTableRecords[column].dataField == "processNumber"){
                    				data = data.split(',');
                    				data = data[0];
                    			}
                    			if(tableconfig.configurationData.dataTableRecords[column].dataField == "viewProperties.actions"){
                    				data = '';
                    			}
                    			if(tableconfig.configurationData.dataTableRecords[column].dataField == "hold"){
                    				if($(node).find("div").length > 0){
                    					data = $(node).find("div").text();
                    				}
                    			}
                    			return data;
                			}
            			}
        			}
    			}

				table =  elem.find("#"+tableconfig.configurationData.masterId).DataTable({
				scrollY:tableconfig.configurationData.scrollY,
				scrollX:tableconfig.configurationData.scrollX,
				scrollCollapse: tableconfig.configurationData.scrollCollapse,
				paging:tableconfig.configurationData.paging,
				"language":{
					"info":tableconfig.configurationData.languageInfo,
					"lengthMenu":tableconfig.configurationData.languageLengthMenu
				},
				"bFilter":tableconfig.configurationData.bFilter,
				"lengthMenu": JSON.parse(tableconfig.configurationData.lengthMenu),
				"sPaginationType": tableconfig.configurationData.sPaginationType,
				"sAjaxSource": tableconfig.configurationData.sAjaxSource,
				"fnServerData": function ( sSource, aoData, fnCallback ) {

					$.ajax( {
						"dataType": 'json',
						"type": "GET",
						"url": sSource,
						"data": aoData,
						"success": function(result){
							fnCallback(result);
						},
						"error":function(result){
							if(localStorage.getItem(tableconfig.configurationData.masterId+"_searchJsonForGrid")!=null ||
								localStorage.getItem(tableconfig.configurationData.masterId+"backToSearchActive")!=null)
								{
									localStorage.removeItem(tableconfig.configurationData.masterId+"_searchJsonForGrid");
									localStorage.removeItem(tableconfig.configurationData.masterId+"backToSearchActive");
									table.search("").draw();
									elem.find(".gridTableContainer .dataTables_scrollHeadInner thead th").each(function(){
									$(this).find(".columnSearch").val("");
									 new PNotify({
											 title : 'Error',
											 text : "Some error occured during search",
											 type : 'error',
											 opacity : .9
										 });
									});
								}
						}
					});
				},
				"bServerSide": tableconfig.configurationData.bServerSide,
				"bSort": tableconfig.configurationData.bSort,
				"columnDefs":datasortable,
				"aaSorting": [],
				 buttons: [
            		$.extend( true, {}, buttonCommon, {
                		extend: 'copyHtml5'
            		}),
            		$.extend( true, {}, buttonCommon, {
                		extend: 'csvHtml5'
            		}),
            		$.extend( true, {}, buttonCommon, {
                		extend: 'excelHtml5'
            		})
        		],
            	"dom" : tableconfig.configurationData.sDom,
            	"fnServerParams": function (aoData ) {
            	    _sortingRetain(aoData);
					var jsonString;
					if(searchManualCall == ""){
					 	jsonString = localStorage.getItem(tableconfig.configurationData.masterId+"_searchJsonForGrid");
					}
					else{
						jsonString = searchManualCall;
					}
					if(jsonString !== "" && jsonString !== null){
						if(JSON.parse(jsonString).assigneeUri !== "" && JSON.parse(jsonString).assigneeUri !== undefined && JSON.parse(jsonString).assigneeUri == userName){
							elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").addClass("active");
							elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .allTask").removeClass("active");
							elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .teamTask").removeClass("active");
						}
						if(JSON.parse(jsonString).taskListType !== "" && JSON.parse(jsonString).taskListType !== undefined){
							if(JSON.parse(jsonString).taskListType == 'All'){
								elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active");
								elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .allTask").addClass("active");
								elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .teamTask").removeClass("active");
							}
							else{
								elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active");
								elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .allTask").removeClass("active");
								elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .teamTask").addClass("active");
							}
						}
					}


					searchManualCall = "";
					if(jsonString!=null && jsonString!=""){
						if(localStorage.getItem(tableconfig.configurationData.masterId+"backToSearchActive") != 'true'){
							elem.find(".loadsearchIco").addClass("active");
							loadSearchDataFlag = true;
					  	}
					 	var jqXHR = JSON.parse(jsonString);
						elem.find(".gridTableContainer .dataTables_scrollHeadInner thead th").each(function(){
							var getId = $(this).find(".columnSearch").data("id");
							$(this).find(".columnSearch").val(eval("jqXHR."+getId));
						});
						
						var iSortCol_0, sSortDir_0;
						for (var i = 0, l = aoData.length; i < l; i++) {
							if(aoData[i].name == 'iSortCol_0'){
								iSortCol_0 = aoData[i].value;
								aoData[i].value = undefined;
							}
							if(aoData[i].name == 'sSortDir_0'){
								sSortDir_0 = aoData[i].value;
								aoData[i].value = undefined;
							}
						}
						if(iSortCol_0!=undefined && sSortDir_0!=undefined){
							if(localStorage.getItem(tableconfig.configurationData.masterId+"_sortingData")!=null){
								localStorage.removeItem(tableconfig.configurationData.masterId+"_sortingData");
							}
						}
						
					 	aoData.push( { "name": "sSearch", "value": jsonString } );
					 }
					 $("#loading").hide();
    			},
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					$("#loading").show();
					if(aData.length>0 && aData[0] != null){
						var appDataArray = aData[appIndex].split(",");
						var appDom_0_td = "";

					 	if(typeof(aData[aData.length - 1]) == 'object' && tableconfig.configurationData.actionConfigurations != null){
							_gridActionPaint(nRow,aData,appDataArray);
						}

					 	if(tableconfig.configurationData.actionConfigurations){
							if((tableconfig.configurationData.masterId != "Collateral_Valuation_Completion") && typeof(aData[aData.length - 1]) == 'object' && tableconfig.configurationData.actionConfigurations != null){
								appDom_0_td = '<span class="customCheckbox"><input type="checkbox" data-taskid="'+appDataArray[2]+'" /><label></label></span>';
							}
							if(tableconfig.configurationData.masterId == 'LoanApplication_Hold' || tableconfig.configurationData.masterId == 'CreditApproval_Hold' ){
								var holdAppUrl = getContextPath()+ "/app/LoanApplication/openHoldApplicationByAppIdAndStageName/"
                                                                              				+ appDataArray[2] + "/" + aData[stageCount] + "/" + true;
								appDom_0_td += '<a href="javascript:void(0);" data-href="'+holdAppUrl+'" data-url="'+holdAppUrl+'" class="IDnumber">'+appDataArray[0]+'</a>';
							}
							else if(tableconfig.configurationData.masterId == 'dynamicApplication_hold'){
								appDom_0_td += '<a href="javascript:void(0);" data-href="'+getContextPath()+appDataArray[1]+appDataArray[2]+appDataArray[4]+'" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'" class="IDnumber">'+appDataArray[0]+'</a>';
							}
							else if(tableconfig.configurationData.masterId == 'DocumentApprovalGrid_Assigned' || tableconfig.configurationData.masterId == 'DocumentApprovalGrid_Pool' ){
								appDom_0_td += '<span class="">'+appDataArray[0]+'</span>';
							}
							else{
								if(URLidNumber.indexOf(tableconfig.configurationData.masterId) > -1){
									appDom_0_td += '<a href="javascript:void(0);" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'" class="IDnumber">'+appDataArray[0]+'</a>';
								}
								else{
                                    if(tableconfig.configurationData.masterId == "Collateral_Valuation_Completion"){
                                        appDataArray[2]="";
                                    }
									appDom_0_td += '<a href="javascript:void(0);" data-href="'+getContextPath()+appDataArray[1]+appDataArray[2]+'" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'" class="IDnumber">'+appDataArray[0]+'</a>';
								}
							}
						}
						else{
							if(tableconfig.configurationData.masterId == 'LoanApplication_Hold' || tableconfig.configurationData.masterId == 'CreditApproval_Hold' ){
								var holdAppUrl = getContextPath()+ "/app/LoanApplication/openHoldApplicationByAppIdAndStageName/"
                                              				+ appDataArray[2] + "/" + aData[stageCount] + "/" + true;
								appDom_0_td += '<a href="javascript:void(0);" data-href="'+holdAppUrl+'" data-url="'+holdAppUrl+'" class="IDnumber">'+appDataArray[0]+'</a>';
							}
							else if(tableconfig.configurationData.masterId == 'dynamicApplication_hold'){
								appDom_0_td += '<a href="javascript:void(0);" data-href="'+getContextPath()+appDataArray[1]+appDataArray[2]+appDataArray[4]+'" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'" class="IDnumber">'+appDataArray[0]+'</a>';
							}
							else{
								if(URLidNumber.indexOf(tableconfig.configurationData.masterId) > -1){

									appDom_0_td += '<a href="javascript:void(0);" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'"  data-splitid="'+appDataArray[4]+'" class="IDnumber">'+appDataArray[0]+'</a>';
								}
								else{

									appDom_0_td += '<a href="javascript:void(0);" data-href="'+getContextPath()+appDataArray[1]+appDataArray[2]+'" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'" class="IDnumber">'+appDataArray[0]+'</a>';
								}
							}
						}


						if(tableconfig.configurationData.masterId =="CreditApproval_Assigned"){
                        	if(inQueueStatusIndex!=-1){
                        		if(aData[inQueueStatusIndex] == "Forwarded"){
									var assigneeIndex = tableconfig.configurationData.dataTableRecords.map(function(e) {return e.dataField; }).indexOf('assigneeUri');
                        			$(nRow).find('td:eq('+inQueueStatusIndex+')').html("<span class='inQueueValue'>"+aData[inQueueStatusIndex]+"</span><ul class='inQueueValueInfo' style='display:none'><h4>Forwarded Details</h4><li class='clearfix'><span class='inText'>From User:</span><span class='inValue'>"+userName+"</span></li><li class='clearfix'><span class='inText'>To User:</span><span class='inValue'>"+aData[assigneeIndex]+"</span></li><li class='clearfix'><span class='inText'>Current User:</span><span class='inValue'>"+userName+"</span></li></ul>");
                        		}
                        	}
                        }


						if(tableconfig.configurationData.masterId == 'DocumentApprovalGrid_Assigned' || tableconfig.configurationData.masterId == 'DocumentApprovalGrid_Pool' ){

							if(historyIndex!=-1){
								if(aData[historyIndex] == "view History"){
									$(nRow).find('td:eq('+historyIndex+')').html("<a href='#' onclick='viewHistoryModal("+appDataArray[2]+");'> View History </a>");
								}
							}
							if(approveInfoIndex!=-1){
								if(aData[approveInfoIndex] == "details"){
									$(nRow).find('td:eq('+approveInfoIndex+')').html("<a href='#' onclick='viewDetailsModal("+appDataArray[2]+");'> Details </a>");
								}
							}
							if(reasonsIndex!=-1){
								if(aData[reasonsIndex].startsWith("view")){
									$(nRow).find('td:eq('+reasonsIndex+')').html("<a href='#' onclick='viewReasonsModal("+appDataArray[2]+");'> "+aData[reasonsIndex]+"</a>");
								}
							}

						}

						$('td:eq('+appIndex+')', nRow).html(appDom_0_td);
						if(appDataArray[3] != "null" && appDataArray[3] != null && appDataArray[3] != "" ){
							if(atr.colouredStrip){
								$(nRow).find("td").css({"background":appDataArray[3]});
							}
							else{
								$(nRow).find('td:eq('+appIndex+')').append("<span class='gridRowColor' style='background-color:"+appDataArray[3]+"'></span>");
							}
						}
						//debugger;
						if(typeof(tableconfig.configurationData.toolTipEnabled)!="undefined" && tableconfig.configurationData.toolTipEnabled!=null && tableconfig.configurationData.toolTipEnabled==true){
						var tdNum=0;
                        					$.each($(tableconfig.configurationData.dataTableRecords), function (headNum,cell) {

												if(cell.hidden!=true){
													tdNum++;
					}
                        						if(cell.hidden==true || cell.toolTip==null || cell.toolTip==false
                        						|| cell.dataField == "applicationNumber" || cell.dataField == "leadReferenceNumber" || cell.dataField == "referenceId" || cell.dataField == "viewProperties.actions"){
                        							return true;
                        						}
                        					var tdSelector=_getCellTextSelector(cell,tdNum);
											var tdToolTipVal=$(tdSelector, nRow).text();
					$(tdSelector, nRow).attr('title', tdToolTipVal);
                        					});
					}
					}
					//debugger;
					$("#loading").hide();
				},
				"initComplete": function(settings, json) {
					//_taskIdStore(json);
						$("#loading").show();
						if(_checkValidDataTable(json) || json.aaData.length == 0){
							new $.fn.dataTable.FixedColumns( table, {
		    					rightColumns: tableconfig.configurationData.fixedColumnsrightColumns,
		    					leftColumns: tableconfig.configurationData.fixedColumnsleftColumns
							});
							document.onkeydown = function(e){
								if(e.keyCode == 13){
									var c_focus = $(":focus");
									if(c_focus.hasClass("columnSearch")){
										elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active");
										_searchingData();
									}
								}
							}
							elem.css({"visibility":"visible"});
							_bindaction();
							$("#loading").hide();
						}
						else{
							new PNotify({
								title : "Failure",
								text : "Some Error Occured",
								type : "error"
							});
						}
					//}
					_rightColumnFix();
					_multiCheckBoxAction();
				},
				"drawCallback":function(data){
					elem.find(".selectAllApp").prop("checked",false);
					elem.find("#gridActions_"+tableconfig.configurationData.masterId).show();
					elem.find("#commonActions_"+tableconfig.configurationData.masterId).hide();
					elem.find(".dataTable tbody tr").removeClass("selectedRow");
				}
			});
		},0);

		};

		var _getCellTextSelector = function(header,tdNum){

			var selector='td:eq('+(tdNum-1)+')';
			if(header.dataField == "hold"){
				selector='td:eq('+(tdNum-1)+') div';
			}
			return selector;
		}

		var _bindaction = function(){
			// grid action ellipse anchor
			elem.on("click","tbody .actionRowLink",function(e){
				e.stopPropagation();
				var leftPos = $(this).closest(".actionRow").offset().left - $(window).scrollLeft() - 110;
				var topPos = $(this).closest(".actionRow").offset().top - $(window).scrollTop() + 37;
				$(this).closest(".actionRow").find(".gridactionOption").css({"left":leftPos,"top":topPos});
				elem.find(".actionRow .gridactionOption").hide();
				$(this).closest(".actionRow").find(".gridactionOption").show();
			});

			elem.find(".DTFC_RightBodyLiner").on("scroll",function(){
				elem.find(".gridactionOption").hide();
			});

            elem.on("mouseenter","tbody tr td .inQueueValue",function(e){
                e.stopPropagation();
                var leftPos = $(this).offset().left - $(window).scrollLeft() - 150;
                var topPos = $(this).offset().top - $(window).scrollTop() - 6;
                $(this).closest("td").find(".inQueueValueInfo").css({"left":leftPos,"top":topPos});
                $(this).closest("td").find(".inQueueValueInfo").show();
            });

            elem.on("mouseleave","tbody  tr td .inQueueValue",function(e){
                $(this).closest("td").find(".inQueueValueInfo").hide();
            });

			$(window).on("scroll",function(){
				elem.find(".gridactionOption").hide();
			});

			elem.on("click",".actionRow .gridactionOption",function(e){
				e.stopPropagation();
			});

			$(document).on("click",function(e){
				e.stopPropagation();
				elem.find(".actionRow .gridactionOption").hide();
				elem.find("#appGridActionBar .gridDropDownBoxOption").hide();
				elem.find("#appGridActionBar .prefrenceActionIco ").removeClass('opened');
				var classArr = ['exportIco','loadsearchIco','savesearchIco','filterIco'];
				if(elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIco").hasClass('active') && loadSearchDataFlag){
					classArr.remove('loadsearchIco');
				}
				for(var i=0;i<classArr.length;i++){
					elem.find("#gridActions_"+tableconfig.configurationData.masterId+" ." + classArr[i]).removeClass('active');
				}
			});

			elem.find(".columnSearch,#showhidepreference").on("click",function(e){
				e.stopPropagation();
			});

			elem.on("click",".IDnumber",function(){
				var dataUrl;

                if(viewGrids.indexOf(tableconfig.configurationData.masterId) > -1){
                    if(URLidNumber.indexOf(tableconfig.configurationData.masterId) > -1){
                        dataUrl = getContextPath()+$(this).data("url")+$(this).data("taskid")+"&splitid="+$(this).data("splitid");
                        loadApplication(dataUrl,'GET');
                    }
                    else{
                        dataUrl = $(this).data("href");
                        neutrinoNavigateTo(dataUrl);
                    }
                }
                else if(tempAssignOnIdClick.indexOf(tableconfig.configurationData.masterId) > -1 && tableconfig.tempAssignSwapFlag && !($(this).hasClass("viewForPool"))){

                	var gridActionTemp = {
						taskid : $(this).data("taskid"),
						tableRef : "oTable_"+tableconfig.configurationData.masterId
					}
					elem.trigger("poolGridTempAssign",gridActionTemp);
                }
                else{
                    dataUrl = getContextPath()+$(this).data("url")+$(this).data("taskid");
                    $.ajax({
                        type: 'GET',
                        url: getContextPath() +"/app/AppManager/checktempAssignMap1",
                        contentType:"application/json",
                        data: ({
                            taskIds : $(this).data("taskid"),
                            source  : 'application',
                            actionFlag : true
                        }),
                        success: function (dataMap) {
                            $.each(dataMap, function(index) {
                                 if(dataMap[index].currentTask==null){
                                     new PNotify({
                                         title : 'Error',
                                         text : "Current grid is outdated. Kindly refresh the grid.",
                                         type : 'error',
                                         opacity : .9
                                     });
                                 }
                                 else if(dataMap[index].mapObject!=null){
                                     new PNotify({
                                         title : 'Error',
                                         text : "This application is open with "+dataMap[index].mapObject.userId + " " + dataMap[index].mapObject.userName,
                                         type : 'error',
                                         opacity : .9
                                     });
                                 }
                                 else{
                                    if(URLidNumber.indexOf(tableconfig.configurationData.masterId) > -1){
                                        loadApplication(dataUrl,'GET');
                                    }
                                    else{
                                        neutrinoNavigateTo(dataUrl);
                                    }
                                 }
                            });
                        }
                    });
                }
			});

			elem.on("click",".actionRow .gridactionOption .gridaction_link",function(){
				var gridactionJson = {
					left : $(this).offset().left - 250,
					top : $(this).offset().top - 50,
					actiontype : $(this).data('actiontype'),
					taskid : $(this).closest(".actionRow").find(".actionRowLink").data("taskid"),
					tableRef : "oTable_"+tableconfig.configurationData.masterId
				}
				elem.trigger("gridoptionAction",gridactionJson);
			});

			elem.on("click","#pdfAppGrid",function(){
                var generateAppPdf = {
                    left : $(this).offset().left - 250,
                    top : $(this).offset().top - 50,
                    data : table.context[0]
                }
                elem.trigger("generateAppPdf",generateAppPdf);
            });

			elem.find("#commonActions_"+tableconfig.configurationData.masterId+" li a").on("click",function(){
				var gridactionJson = {
					left : $(this).offset().left - 250,
					top : $(this).offset().top - 50,
					actiontype : $(this).data('actiontype'),
					taskid : $(this).closest(".actionRow").find(".actionRowLink").data("taskid"),
					tableRef : "oTable_"+tableconfig.configurationData.masterId
				}
				gridactionJson.multiTaskId = [];
				if(elem.find(".DTFC_LeftWrapper").is(":visible")){
					elem.find(".DTFC_Cloned tbody input:checkbox").each(function(){
						if($(this).is(":checked")){
							gridactionJson.multiTaskId.push($(this).data("taskid"));
						}
					});
				}
				else{
					elem.find("#"+tableconfig.configurationData.masterId+" tbody input:checkbox").each(function(){
						if($(this).is(":checked")){
							gridactionJson.multiTaskId.push($(this).data("taskid"));
						}
					});
				}



				elem.trigger("gridoptionAction",gridactionJson);
			});

			// application checkbox selection
			if(tableconfig.configurationData.fixedColumnsrightColumns){
				_multiCheckBoxAction();
			}

			// my task click function
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .showTasktextLi a").on("click",function(){
				elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .showTasktextLi a").removeClass("active");
				$(this).addClass("active");
				elem.find("input[data-id='assigneeUri']").val("");
				_searchingData();
			});

			// filter by color
			elem.on("click","#gridActions_"+tableconfig.configurationData.masterId+" .filterByColorDropDown a",function(){
				colorValue = $(this).data("keyvalue");
				if(colorValue !== undefined && colorValue !== "" && colorValue !== null){
					$(this).closest("ul").closest("li").find(".filterIco i").css({"color":colorValue});
					$(this).closest("ul").closest("li").find(".filterIco i").addClass("fillIco");
				}
				else{
					$(this).closest("ul").closest("li").find(".filterIco i").removeAttr("style");
					$(this).closest("ul").closest("li").find(".filterIco i").removeClass("fillIco");
				}
				_searchingData();
			});

			// copy grid data
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .copyclipboardIco").on("click",function(){
				elem.find(".dt-buttons .buttons-copy").trigger("click");
			});

			// export grid data
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .exportList a").on("click",function(){
				var typeExport = $(this).data("export");
				switch (typeExport) {
				    case 'exl':
				        elem.find(".dt-buttons .buttons-excel").trigger("click");
				        break;
				    case 'csv':
				        elem.find(".dt-buttons .buttons-csv").trigger("click");
				        break;
				}
			});

			// dropdown link code
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .exportIco").on("click",function(e){
				e.stopPropagation();
				_dropDownAction(e,'export');
			});

			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIco").on("click",function(e){
				e.stopPropagation();
				_dropDownAction(e,'loadSearch');
			});

			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .filterIco").on("click",function(e){
				e.stopPropagation();
				_dropDownAction(e,'filterColor');
			});
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .savesearchIco").on("click",function(e){
				e.stopPropagation();
				_dropDownAction(e,'saveSearch');
			});

			elem.on("click","#gridActions_"+tableconfig.configurationData.masterId+" .loadSearchModalData a",function(){
				var keyvalue = $(this).data("keyvalue");
				_loadingSearchingData(keyvalue);
			});
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" #saveSearchText").on("click",function(e){
				e.stopPropagation();
			});

			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" #saveSearchBtn").on("click",function(){
				var saveSearchData = {};
				saveSearchData.text = $(this).closest(".saveSearchModal").find("#saveSearchText").val();
				if(saveSearchData.text == '' || saveSearchData.text == undefined){
					new PNotify({
						title : "error",
						text : "Key name cannot be blank",
						type : "error",
						opacity : .8
					});
				}
				else{
					saveSearchData.savesearchingData = {};
					elem.find(".gridTableContainer .dataTables_scrollHeadInner thead th").each(function(){
						var getId = $(this).find(".columnSearch").data("id");
						if(getId){
							if($(this).find(".columnSearch").val() != ""){
								eval('saveSearchData.savesearchingData.' + getId + ' = "' + $(this).find(".columnSearch").val() + '"');
							}
						}
					});
					if(tableconfig.configurationData.fixedColumnsleftColumns > 0 && elem.find(".DTFC_LeftWrapper").is(":visible")){
						elem.find(".gridTableContainer .DTFC_LeftHeadWrapper thead th").each(function(){
							var getId = $(this).find(".columnSearch").data("id");
							if(getId){
								if($(this).find(".columnSearch").val() != ""){
									eval('saveSearchData.savesearchingData.' + getId + ' = "' + $(this).find(".columnSearch").val() + '"');
								}
							}
						});
					}
					_savedSearch(saveSearchData);
					$(this).closest(".saveSearchModal").find("#saveSearchText").val("");
				}
			});

			elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIcoFilter").on("click",function(){
				if(elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIco").hasClass("active")){
					//removing localStorage
					localStorage.removeItem(tableconfig.configurationData.masterId+"_searchJsonForGrid");
					$.ajax({
						url : getContextPath() + "/app/GridSearchController/setActiveFlagInactive/",
						data : ({
							gridId: tableconfig.configurationData.masterId
						}),
						success : function(jqXHR) {
							$(this).hide();
							new PNotify({
								title : "success",
								text : "Filter removed",
								type : "success",
								opacity : .8
							});
						},
						error : function(data, textStatus, errorThrown) {
							new PNotify({
								title : "error",
								text : "Some Error Occured while removing filter",
								type : "error",
								opacity : .8
							});
						}
				    });
					elem.find("input.columnSearch").val("");
					elem.find(".loadsearchIco").removeClass("active");
					elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active");
					table.search("").draw(true);
				}
				else if(localStorage.getItem(tableconfig.configurationData.masterId+"_searchJsonForGrid")!=null){
					//remove back to search filter
					localStorage.removeItem(tableconfig.configurationData.masterId+"_searchJsonForGrid");
					localStorage.removeItem(tableconfig.configurationData.masterId+"backToSearchActive");
					new PNotify({
						title : "success",
						text : "Filter removed",
						type : "success",
						opacity : .8
					});
					elem.find("input.columnSearch").val("");
					elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active");
					table.search("").draw(true);
				}
				else if(localStorage.getItem(tableconfig.configurationData.masterId+"_sortingData")!=null){
					//localStorage.removeItem(tableconfig.configurationData.masterId+"_sortingData");
					new PNotify({
						title : "error",
						text : "No filter applied",
						type : "error",
						opacity : .8
					});
				}
				else{
					new PNotify({
						title : "error",
						text : "No filter applied",
						type : "error",
						opacity : .8
					});
				}
			});
			elem.find("input.columnSearch[data-id='applicationNumber']").focus();

		};

		var _preferencelistHandle = function(data,e){
			elem.find("#showhidepreference").html(data);
		/*	elem.find("#showhidepreference").find("input[type='checkbox']").on("change",function(){
				if($(this).is(":checked")){
					var getField = $(this).val();
					for(var i=0;i<tableconfig.configurationData.dataTableRecords.length;i++){
						if(tableconfig.configurationData.dataTableRecords[i].titleKey == getField){
							table.columns(i).visible(true);
						}
					}
				}
				else{
					var getField = $(this).val();
					for(var i=0;i<tableconfig.configurationData.dataTableRecords.length;i++){
						if(tableconfig.configurationData.dataTableRecords[i].titleKey == getField){
							table.columns(i).visible( false);
							table.columns.adjust().draw(false);
						}
					}
				}
				_rightColumnFix();
				_multiCheckBoxAction();
			});*/
			elem.find(".prefrenceAction .prefrenceActionIco").on("click",function(e){
				e.stopPropagation();
				var targetContainer = $(this).closest(".prefrenceAction").find("#showhidepreference");
				elem.find("#gridActions_"+tableconfig.configurationData.masterId+">li .gridDropDownBoxOption").hide();
				var classArr = ['exportIco','loadsearchIco','savesearchIco'];
				if(elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIco").hasClass('active') && loadSearchDataFlag){
					classArr.remove('loadsearchIco');
				};
				for(var i=0;i<classArr.length;i++){
					elem.find("#gridActions_"+tableconfig.configurationData.masterId+" ." + classArr[i]).removeClass('active');
				}
				if($(this).hasClass("opened")){
					targetContainer.hide();
					$(this).removeClass("opened");
				}
				else{
					$(this).addClass("opened");
			        targetContainer.show();
				}
			});
		};
		var _searchingData = function(){
			var searchingData = {};
			if(colorValue !== undefined && colorValue !== "" && colorValue !== null){
				searchingData.gridColorCode = colorValue;
			}
			elem.find(".gridTableContainer .dataTables_scrollHeadInner thead th").each(function(){
				var getId = $(this).find(".columnSearch").data("id");
				if(getId){
					if($(this).find(".columnSearch").val().trim() != ""){
						eval('searchingData.' + getId + ' = "' + $(this).find(".columnSearch").val().trim() + '"');
					}
				}
			});
			if(tableconfig.configurationData.fixedColumnsleftColumns > 0 && elem.find(".DTFC_LeftWrapper").is(":visible")){
				elem.find(".gridTableContainer .DTFC_LeftHeadWrapper thead th").each(function(){
					var getId = $(this).find(".columnSearch").data("id");
					if(getId){
						if($(this).find(".columnSearch").val().trim() != ""){
							eval('searchingData.' + getId + ' = "' + $(this).find(".columnSearch").val().trim() + '"');
						}
						else{

                            delete searchingData[getId];
						}
					}
				});
			}
			if(searchingData.assigneeUri && searchingData.assigneeUri != userName){
				elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active");
			}
			var showTaskType = elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .showTasktextLi .active").data("type");
			if(showTaskType == 'All' || showTaskType == 'immediate'){
				searchingData.taskListType = showTaskType;
			}
			if(showTaskType == 'mytasks'){
				searchingData.assigneeUri = userName;
			}

			function checkSearchEmpty(){
				for(var key in searchingData) {
			        if(searchingData[key] != ""){
			            return false;
			        }
			    }
			    return true;
		    }
		    if(checkSearchEmpty()){
				searchingData = "";
		    }
		    else{
		    	searchingData = JSON.stringify(searchingData);
		    }
		    searchManualCall = searchingData;
		    localStorage.setItem(tableconfig.configurationData.masterId+"_searchJsonForGrid", searchingData);
		    localStorage.setItem(tableconfig.configurationData.masterId+"backToSearchActive", true);
		    urlForStorageArray = [];
			table.search(searchingData).draw();
			elem.find(".loadsearchIco").removeClass("active");
		};
		var _getActiveKeyFromServer = function(gridId){
			$("#loading").show();
			if(localStorage.getItem(tableconfig.configurationData.masterId+"_searchJsonForGrid")!=null){
				_paintTopAction();
				_paintTableHead(tableconfig.configurationData.dataTableRecords);
				$("#loading").hide();
			}
			else if(localStorage.getItem("isUserFilterActive"+tableconfig.configurationData.masterId) != 'false'
			&& localStorage.getItem(tableconfig.configurationData.masterId+"backToSearchActive") != 'true'
			&& tableconfig.configurationData.masterId !='dynamicApplication_pool'
			&& tableconfig.configurationData.masterId !='dynamicApplication_assigned'
			&& tableconfig.configurationData.masterId !='dynamicApplication_hold'
			&& tableconfig.configurationData.masterId !='dynamicApplication_cancel'
			&& tableconfig.configurationData.masterId !='dynamicApplication_reject'
			&& tableconfig.configurationData.masterId !='dynamicApplication_archived'){
				$.ajax({
					url : getContextPath()+ "/app/GridSearchController/activeKey/",
					data : ({
						gridId: gridId
					}),
					success : function(jqXHR) {

						if(jqXHR == '-1'){
							//User does not have loaded search
							localStorage.setItem("isUserFilterActive"+tableconfig.configurationData.masterId,false);
						}
						else{
							//Set loaded search from db into localStorage i.e user had loaded search
							localStorage.setItem(tableconfig.configurationData.masterId+"_searchJsonForGrid",jqXHR);
						}

						_paintTopAction();

						_paintTableHead(tableconfig.configurationData.dataTableRecords);
						$("#loading").hide();
					},
					error : function(data, textStatus, errorThrown) {
						$("#loading").hide();
						new PNotify({
							title : "error",
							text : "Some Error Occured!!!",
							type : "error",
							opacity : .8
						});
					}
			    });
		  }
		  else{
		  		_paintTopAction();
				_paintTableHead(tableconfig.configurationData.dataTableRecords);
				$("#loading").hide();
		  }
		};

		var _rightColumnFix = function(){
				var t_w = elem.find("#"+tableconfig.configurationData.masterId).width();
				if(t_w < elem.width()){
					elem.find('.DTFC_RightWrapper').hide();
				elem.find(".DTFC_LeftWrapper").hide();
				elem.find("table,.dataTables_scrollHeadInner").css({"width":"100%"});
				}
				else{
					elem.find('.DTFC_RightWrapper').show();
					elem.find(".DTFC_LeftWrapper").show();
				}
		};

		var _checkValidDataTable = function(json){
			for(var i =0 ;i<json.aaData.length;i++){
				if(json.aaData[i].length > 0 && json.aaData[i][0] != null){
					return true;
				}
				return false;
			}
		};



		var _savedSearch = function(val){
		    		$.ajax({
					url : getContextPath()+ "/app/GridSearchController/getExistingKeys/",
					data : ({
						gridId: tableconfig.configurationData.masterId
					}),
					success : function(jqXHR) {
					jqXHR = jqXHR.map(function(a,b){ return a.toUpperCase();});
					if(jqXHR.indexOf(val.text.toUpperCase())>-1){
				new PNotify({
						title : "error",
						text : "Saved Key already exists",
						type : "error",
						opacity : .8
				});
			}
			else{
				var count = 0;
				$.each(val.savesearchingData, function(k, v) {
			         if(v===""){
			         	//do Nothing
			         		}
			         		else{
			            count++;
			         }
			    });
			    if(count != 0){
						$.ajax({
							url : getContextPath()+ "/app/GridSearchController/saveSearch/",
							data : ({
								sSearch: JSON.stringify(val.savesearchingData),
								key: val.text,
								gridId: tableconfig.configurationData.masterId
							}),
							success : function(jqXHR) {
								new PNotify({
									title : "success",
									text : "Successfully saved",
									type : "success",
									opacity : .8
								});
							},
							error : function(data, textStatus, errorThrown) {
								new PNotify({
									title : "error",
									text : "Some Error Occured while saving searched data",
									type : "error",
									opacity : .8
								});
							}
					    });
				}
				else{
					new PNotify({
						title : "error",
						text : "No Search Parameter is entered",
						type : "error",
						opacity : .8
					});
				}
			}
				}
			});



		};

		var _loadSearchData = function(e){
			$.ajax({
				url : getContextPath()+ "/app/GridSearchController/getExistingKeys/",
				data : ({
					gridId: tableconfig.configurationData.masterId
				}),
				success : function(jqXHR) {
					if(jqXHR.length == 0){
						$(e.currentTarget).closest("li").find(".loadSearchModalData").hide();
						$(e.currentTarget).removeClass("active");
						new PNotify({
							title : "error",
							text : "No Key to load",
							type : "error",
							opacity : .8
						});
					}
					else{
						var loadSearchHtml = '';
						for(var i =0; i<jqXHR.length;i++){
							loadSearchHtml += '<li><a href="javascript:void(0);" data-keyvalue="'+jqXHR[i]+'">'+jqXHR[i]+'</a></li>';
						}
						$(e.currentTarget).closest("li").find(".loadSearchModalData ul").html(loadSearchHtml);
					}
				}
			});
		};

		var _filterByColor = function(e){

						$.ajax({
				url : getContextPath()+ "/app/GridSearchController/availableColorCodes",
				success : function(jqXHR) {

					if(jqXHR.length == 0){
						$(e.currentTarget).closest("li").find(".filterByColorDropDown").hide();
						$(e.currentTarget).removeClass("active");
						new PNotify({
							title : "No Colors available",
							text : "No Colors available",
							type : "info",
							opacity : .8
						});
					}
					else{
						var filterbycolorhtml = "<li><a href='javascript:void(0);' data-keyvalue=''>Clear</a></li>";
			for(var i =0; i<jqXHR.length;i++){
				filterbycolorhtml += "<li><a href='javascript:void(0);' data-keyvalue='"+jqXHR[i]+"'><span style='background-color:"+jqXHR[i]+"'></span>"+jqXHR[i]+"</a></li>";
			}
			$(e.currentTarget).closest("li").find(".filterByColorDropDown ul").html(filterbycolorhtml);
					}
				}
			});

		}
		//var sessionIdOfUser = localStorage.getItem("sessionIdOfUser")+"_mapForGridJson";


		var _loadingSearchingData = function(key){

			$.ajax({
				url : getContextPath()+ "/app/GridSearchController/loadSearch/",
				data : ({
					key: key,
					gridId: tableconfig.configurationData.masterId
				}),
				success : function(jqXHR) {
					loadSearchDataFlag = true;
					//if load search is active set backtosearch to false
					localStorage.setItem(tableconfig.configurationData.masterId+"backToSearchActive",false);
					//elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIcoFilter").show();
					if(jqXHR != ""){
						//set search json in local storage
						localStorage.setItem(tableconfig.configurationData.masterId+"_searchJsonForGrid",jqXHR);
						jqXHR = JSON.parse(jqXHR);
						elem.find(".gridTableContainer .dataTables_scrollHeadInner thead th").each(function(){
							var getId = $(this).find(".columnSearch").data("id");
							$(this).find(".columnSearch").val(eval("jqXHR."+getId));
						});
						if(tableconfig.configurationData.fixedColumnsleftColumns > 0){
							elem.find(".gridTableContainer .DTFC_LeftHeadWrapper thead th").each(function(){
								var getId = $(this).find(".columnSearch").data("id");
								$(this).find(".columnSearch").val(eval("jqXHR."+getId));
							});
						}

						function checkSearchEmpty(){
							for(var key in jqXHR) {
			        			if(jqXHR[key] != ""){
				            		return false;
				        		}
				    		}
				    		return true;
		    			}
		    			if(checkSearchEmpty()){
							jqXHR = "";
		    			}
		    			else{
		    				jqXHR = JSON.stringify(jqXHR);
		    			}
						table.search(jqXHR).draw();
						$("#loading").hide();
					}
					elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .tasksIco").removeClass("active")
				},
				error : function(data, textStatus, errorThrown) {

					new PNotify({
						title : "error",
						text : "Some Error Occured",
						type : "error",
						opacity : .8
					});
				}
			});
		};
		var _taskIdStore = function(json){
			if(tableconfig.configurationData.dataTableRecords!= undefined && tableconfig.configurationData.dataTableRecords!= null){
				var indexOfAssignee = tableconfig.configurationData.dataTableRecords.map(function(e) {return e.dataField; }).indexOf('assigneeUri');
				for(var i = 0; i<json.aaData.length;i++){
					var appDataArray = json.aaData[i][appIndex].split(",");
					if(json.aaData[i][indexOfAssignee]!= undefined && json.aaData[i][indexOfAssignee] == 'Me'){
						var urlForStorage = {};
						urlForStorage[appDataArray[2]] = getContextPath()+appDataArray[1]+appDataArray[2];
						urlForStorageArray.push(urlForStorage);
						//set task id in local storage for traversing ids in stages
						localStorage.setItem(tableconfig.configurationData.masterId+"_url",JSON.stringify(urlForStorageArray));
					}
				}
			}
		};

		var _multiCheckBoxAction = function(){
			$(".selectAllApp_"+tableconfig.configurationData.masterId).off("click")
			$(".selectAllApp_"+tableconfig.configurationData.masterId).on("click",function(e){

					e.stopPropagation();
					var checkboxes;
					if(elem.find(".DTFC_LeftWrapper").is(":visible")){
						checkboxes = elem.find(".DTFC_Cloned tbody input:checkbox");
					}
					else{
						checkboxes = elem.find("#"+tableconfig.configurationData.masterId+" tbody input:checkbox");
					}

					checkboxes.prop("checked",$(this).is(":checked"));
					if($(this).is(":checked")){
						elem.find("#commonActions_"+tableconfig.configurationData.masterId).show();
						elem.find("#gridActions_"+tableconfig.configurationData.masterId).hide();
						elem.find(".dataTable tbody tr").addClass("selectedRow");
					}
					else{
						elem.find("#gridActions_"+tableconfig.configurationData.masterId).show();
						elem.find("#commonActions_"+tableconfig.configurationData.masterId).hide();
						elem.find(".dataTable tbody tr").removeClass("selectedRow");
					}
					checkListFII(tableconfig.configurationData.dataTableRecords,table);
				});
				if(elem.find(".DTFC_LeftWrapper").is(":visible")){
						$("body").off("click",".AppGridContainer .DTFC_Cloned tbody input:checkbox")
				$("body").on("click",".AppGridContainer .DTFC_Cloned tbody input:checkbox",function(){
			    	if($(this).prop("checked") == false){
			        	elem.find(".DTFC_Cloned .selectAllApp")[0].checked = false;
			        	var rowIndex = table.row($(this).closest('tr')).index() + 1;
			    		elem.find(".dataTable tbody tr:nth-child("+rowIndex+")").removeClass("selectedRow");
			    	}
			    	else{
			    		var rowIndex = table.row($(this).closest('tr')).index() + 1;
			    		elem.find(".dataTable tbody tr:nth-child("+rowIndex+")").addClass("selectedRow");
			    	}
			    	if (elem.find('.DTFC_Cloned tbody input[type="checkbox"]:checked').length == elem.find('.DTFC_Cloned tbody input:checkbox').length ){
			        	elem.find(".DTFC_Cloned .selectAllApp")[0].checked = true;
			    	}
			    	if(elem.find(".DTFC_Cloned tbody input[type='checkbox']:checked").length > 1){
			    		elem.find("#commonActions_"+tableconfig.configurationData.masterId).find("li a#Temp-AssignBtn").remove();
			    		elem.find("#commonActions_"+tableconfig.configurationData.masterId).show();
						elem.find("#gridActions_"+tableconfig.configurationData.masterId).hide();
					}
					else{
						$("#gridActions_"+tableconfig.configurationData.masterId).show();
						$("#commonActions_"+tableconfig.configurationData.masterId).hide();
					}
					checkListFII(tableconfig.configurationData.dataTableRecords,table);
				});
					}
					else{
						$("body").off("click","#"+tableconfig.configurationData.masterId+" tbody input:checkbox")
				$("body").on("click","#"+tableconfig.configurationData.masterId+" tbody input:checkbox",function(){
			    	if($(this).prop("checked") == false){
			        	$(".selectAllApp_"+tableconfig.configurationData.masterId).prop("checked",false)
			        	var rowIndex = table.row($(this).closest('tr')).index() + 1;
			    		elem.find(".dataTable tbody tr:nth-child("+rowIndex+")").removeClass("selectedRow");
			    	}
			    	else{
			    		var rowIndex = table.row($(this).closest('tr')).index() + 1;
			    		elem.find(".dataTable tbody tr:nth-child("+rowIndex+")").addClass("selectedRow");
			    	}
			    	if (elem.find("#"+tableconfig.configurationData.masterId+" tbody input[type='checkbox']:checked").length == elem.find("#"+tableconfig.configurationData.masterId+" tbody input:checkbox").length ){
			        	$(".selectAllApp_"+tableconfig.configurationData.masterId).prop("checked",true)
			    	}
			    	if(elem.find("#"+tableconfig.configurationData.masterId+" tbody input[type='checkbox']:checked").length > 1){
			    		elem.find("#commonActions_"+tableconfig.configurationData.masterId).find("li a#Temp-AssignBtn").remove();
			    		elem.find("#commonActions_"+tableconfig.configurationData.masterId).show();
						elem.find("#gridActions_"+tableconfig.configurationData.masterId).hide();
					}
					else{
						$("#gridActions_"+tableconfig.configurationData.masterId).show();
						$("#commonActions_"+tableconfig.configurationData.masterId).hide();
					}
					checkListFII(tableconfig.configurationData.dataTableRecords,table);
				});
					}




		};
		var _dropDownAction = function(e,type){
			var targetContainer = $(e.currentTarget).closest("li").find(".gridDropDownBoxOption");
			elem.find("#gridActions_"+tableconfig.configurationData.masterId+">li .gridDropDownBoxOption").hide();
			elem.find("#appGridActionBar #showhidepreference").hide();
			elem.find("#appGridActionBar .prefrenceActionIco ").removeClass('opened');
			var classArr = ['exportIco','loadsearchIco','savesearchIco','filterIco'];
			if(elem.find("#gridActions_"+tableconfig.configurationData.masterId+" .loadsearchIco").hasClass('active')){
				classArr.remove('loadsearchIco');
			}
			classArr.remove(e.currentTarget.className);
			if(type == 'loadSearch'){
				$(e.currentTarget).addClass("active");
				targetContainer.show();
				_loadSearchData(e);
			}
			else if(type == 'filterColor'){
				$(e.currentTarget).addClass("active");
				targetContainer.show();
				_filterByColor(e);
			}
			else{
				if($(e.currentTarget).hasClass("active")){
					$(e.currentTarget).removeClass("active");
					targetContainer.hide();
				}
				else{
					$(e.currentTarget).addClass("active");
					targetContainer.show();
				}
			}
			for(var i=0;i<classArr.length;i++){
				elem.find("#gridActions_"+tableconfig.configurationData.masterId+" ." + classArr[i]).removeClass('active');
			}
		};
		var _gridActionPaint = function(nRow,aData,appDataArray){
			var	actionDom = '<div class="actionRow">'+
							'<a href="javascript:void(0);" data-taskid="'+appDataArray[2]+'" class="actionRowLink"><i class="neoicon-more-vt"></i></a>'+
							'<ul class="gridactionOption" style="display:none;">';
			for(var i = 0;i<aData[aData.length - 1].length;i++){
				for(var j = 0; j < tableconfig.configurationData.actionConfigurations.length;j++){
					if(aData[aData.length - 1][i] === tableconfig.configurationData.actionConfigurations[j].action){
						actionDom += '<li><a href="javascript:void(0);" class="gridaction_link" data-actiontype="'+tableconfig.configurationData.actionConfigurations[j].action+'"><i class="'+tableconfig.configurationData.actionConfigurations[j].imagePath+'"></i>'+tableconfig.configurationData.actionConfigurations[j].action+'</a></li>';
					}
					//For swapping of id number click with temp assign action
					else if(tempAssignOnIdClick.indexOf(tableconfig.configurationData.masterId) > -1 && aData[aData.length - 1][i] == 'View'){
						
						var appDataArray = aData[appIndex].split(",");
						actionDom += '<li><a href="javascript:void(0);" class="IDnumber viewForPool" data-url="'+appDataArray[1]+'" data-taskid="'+appDataArray[2]+'" data-actiontype="'+tableconfig.configurationData.actionConfigurations[j].action+'"><i class="'+tableconfig.configurationData.actionConfigurations[j].imagePath+'"></i>View</a></li>';					
						break;
					}
				}
				elem.find("#commonActions_"+tableconfig.configurationData.masterId+" li a").each(function(){
					if($(this).attr("id") === (aData[aData.length - 1][i]+"Btn")){
						$(this).closest("li").show();
					}
				});
			}
			actionDom += '</ul></div>';
			$('td:eq('+(nRow.childElementCount - 1)+')', nRow).html(actionDom);
		};

		var _generateAppPdfFlag=function(gridMasterId){
            if($.inArray(gridMasterId,['sendToOptsGrid','LoanApplication_Pool','LoanApplication_Assigned','LoanApplication_Hold','CreditApproval_Assigned','CreditApproval_Pool','CreditApproval_Hold','LoanApplication_Assigned_Disbursal','dynamicApplication_assigned','dynamicApplication_hold','dynamicApplication_pool','dynamicApplication_reject','dynamicApplication_cancel', 'dynamicApplication_archived'])>=0){
                return true;
            }
            else{
                return false;
            }
        };

		var _sortingRetain = function(aoData){
            var sortingDataInStorage, jsonForSorting = {};
            var iSortCol_0, sSortDir_0;
            for (var i = 0, l = aoData.length; i < l; i++) {
                if(aoData[i].name == 'iSortCol_0'){
                    iSortCol_0 = aoData[i].value;
                }
                if(aoData[i].name == 'sSortDir_0'){
                    sSortDir_0 = aoData[i].value;
                }
            }
            jsonForSorting.columnIndex = iSortCol_0;
            jsonForSorting.columnOrder = sSortDir_0;
            if(iSortCol_0!=undefined && sSortDir_0!=undefined){
                if(localStorage.getItem(tableconfig.configurationData.masterId+"_sortingData")==null){
                    localStorage.setItem(tableconfig.configurationData.masterId+"_sortingData",JSON.stringify(jsonForSorting));
                }
            }

            sortingDataInStorage = localStorage.getItem(tableconfig.configurationData.masterId+"_sortingData");
            if(sortingDataInStorage!=null){
                var jsonData = JSON.parse(sortingDataInStorage);
                if(iSortCol_0==undefined && sSortDir_0==undefined){
                    aoData.push({"name": "sSortDir_0", "value": jsonData.columnOrder}, {"name": "iSortCol_0", "value": jsonData.columnIndex });
                }
                else{
                    if(jsonData.columnIndex == iSortCol_0 && jsonData.columnOrder == sSortDir_0){
                        /*if(jsonData.columnOrder == "asc"){
                            jsonData.columnOrder = "desc";
                        } */
                        aoData.push({"name": "sSortDir_0", "value": jsonData.columnOrder}, {"name": "iSortCol_0", "value": jsonData.columnIndex });
                    }
                    else{
                        aoData.push({"name": "sSortDir_0", "value": sSortDir_0}, {"name": "iSortCol_0", "value": iSortCol_0});
                        jsonData.columnIndex = iSortCol_0;
                        jsonData.columnOrder = sSortDir_0;
                        localStorage.setItem(tableconfig.configurationData.masterId+"_sortingData",JSON.stringify(jsonData));
                    }
                }
            }
        };
		_init();
		return this;
	};
}(jQuery));