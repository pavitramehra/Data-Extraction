	var tableData = [];
	var rowCntr=0;
	var multipleIds=[];
	var multipleTaskIds=[];
	var bttnsDisplayed=[];
    var actionUrls=tableTagScriptInput.actionUrls;
	var lastRowId=0;
	var actionUrl ;
	var lastTaskId=0;
	/* var keys ; */
	var linkIndex=0;
	var linkColumn="";
	var childtable=tableTagScriptInput.childTable ;
	var htmlTableIdtBody=$(tableTagScriptInput.htmlTableIdtBody);
	var tableRef=tableTagScriptInput.tableRef;
	var tableId = $(tableTagScriptInput.tableId);
	var masterId=tableTagScriptInput.masterId;
	var contextPath=getContextPath();
	var recordURL=tableTagScriptInput.recordURL;
	var viewModeProperty = tableTagScriptInput.viewModeProperty;
	var actionIndex=-1;
	var customizedActionIndex=-1;
	var aColumns = new Array();
	var selectedColumns=[];
	var isPaginated=false;
	var columnAltered = false;

	$("#selectAll_"+tableTagScriptInput.masterId).click(function(e){
		 getMultipleIds('evntSelectAll');
	});


			 $("div#dialog-form-"+tableTagScriptInput.childId).on("hidden",function(){
				 if(tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.childAction_htmlTableId] == 'view'){
					 $("[id^=createChild]").hide();
					 $("[id^=editChild]").hide();
					 $("[id^=viewChild]").show();
				 }else if(tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.childAction_htmlTableId] == 'edit'){
					 $("[id^=createChild]").hide();
					 $("[id^=viewChild]").hide();
					 $("[id^=editChild]").show();
				 }else{
					 $("[id^=editChild]").hide();
					 $("[id^=viewChild]").hide();
					 $("[id^=createChild]").show();
				 }

			});

			 function loadDataTableData(masterId,parentId) {

				 if(tableTagScriptInput.childTable == 'true'){

					 var baseURL = getContextPath()+"/app/"+parentId+"/"+masterId+"/loadPage/"+tableTagScriptInput.id;
						$("#"+tableTagScriptInput.childId+"Div").load(baseURL, function() {
						//	$('#childTabs').tab(); //initialize tabs
						});
				}
				 else{
					var gridMasterId=$(tableTagScriptInput.tableId).attr('id');
					neutrinoNavigateTo("../"+gridMasterId + "/" + "loadColumnConfig");
				 }

				}

			 function getTableData(obj) {

				 var masterTableId = $(obj).closest('table').attr('data-masterId');
				 var tabParamsObj = tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId];
				 var iPos = tabParamsObj.fnGetPosition(obj);
			    	rownum=iPos;
			 	    var aData = tabParamsObj.fnGetData( iPos );
			 	    return aData;

				}


			 function openChildDialog(action,id, masterId, parentId){
				 tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.childAction_htmlTableId] = action;
				 $("[id^=createChild]").hide();
				 $("[id^=editChild]").hide();
				 $("[id^=viewChild]").hide();
				 if(action == 'view'){
					 $('#childModalWindowDoneButton'+masterId).hide();
					 $('#create_another_'+masterId).attr("disabled",true);
					 $('#create_another_div_'+masterId).hide();
					 $("[id^=createChild]").hide();
					 $("[id^=editChild]").hide();
					 $("[id^=viewChild]").show();

				 } else if(action == 'edit'){
					 $('#childModalWindowDoneButton'+masterId).show();
					 $('#create_another_'+masterId).removeAttr("disabled");
					 $('#create_another_div_'+masterId).show();
					 $("[id^=createChild]").hide();
					 $("[id^=editChild]").show();
					 $("[id^=viewChild]").hide();

				 } else {
					 $('#childModalWindowDoneButton'+masterId).show();
					 $('#create_another_'+masterId).removeAttr("disabled");
					 $('#create_another_div_'+masterId).show();
					 $("[id^=createChild]").show();
					 $("[id^=editChild]").hide();
					 $("[id^=viewChild]").hide();
				 }
				 $.ajax({
						url : getContextPath()+"/app/"+parentId+"/"+masterId+"/"+action,
						type : 'POST',
						data : "id="+id,
						async : false,
						success : function(jqXHR) {

							$('#childModal'+masterId).html(jqXHR);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							alert(jqXHR + " : " + textStatus + " : " + errorThrown);
						}
					});

				$('#dialog-form-'+masterId).modal('show');
			 }

			 function closeChildDialog(masterId) {
				 	tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.childAction_htmlTableId]="";
					$('#dialog-form-'+masterId).modal('hide');
					$(".search-query").focus();
				};

				function displayBttns(test, rowId){
					var actions =[];
					 if(test == true){
						 var viewActions = [];
						 var viewCustomizedActions = [];

	 					 var isAllRemainingChecked = true;

						 var allCheckBox = document.getElementsByName("selectThis_"+tableTagScriptInput.masterId);

					 	 for(var j =0; j<allCheckBox.length; j++){
							if((j != rowId) && (allCheckBox[j].checked != "checked") && (allCheckBox[j].checked != true)){
								isAllRemainingChecked = false;
								break;
							}
					 	 }

						 if(isAllRemainingChecked == true){
							 	$("#selectAll_"+tableTagScriptInput.masterId).prop('checked',true);
						 }

						 for(var i=0;i<tableData.length; i++ ){
							 var recordData = tableData[i];
							 if(rowId == recordData[linkColumn]){
								 var rowData = tableData[i];
								 viewActions = rowData["viewProperties.actions"];
								 viewCustomizedActions =rowData["viewProperties.customizedActions"];
								 if(viewCustomizedActions != null)
									 {
									 for(var x=0; x<viewCustomizedActions.length; x++ ) {
										 if(viewActions.indexOf(viewCustomizedActions[x]) == -1)
										 viewActions.push(viewCustomizedActions[x]);
					               		}
									 }
				               		for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
					     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];
				               			var actionConfigAction = actionConfig.action.replace(/ /g,'');
										if(viewActions != null){
						               		for(var j=0; j<viewActions.length; j++ ) {
												viewActions[j] = viewActions[j].replace(/ /g,'');
						               		}
						               		for(var j=0; j<viewActions.length; j++ ){
												 if(actionConfigAction == viewActions[j] && viewActions[j]!="Edit"
												        && viewActions[j]!="InactiveReason" && viewActions[j]!="BlockReason"){
														if(bttnsDisplayed.length > 0) {
															 var actionsToDelete = [];
															 for(k=0; k<bttnsDisplayed.length; k++){
																	var addedBttnIndex = viewActions.indexOf(bttnsDisplayed[k]);
																	if(addedBttnIndex==-1){
																		actionsToDelete.push(bttnsDisplayed[k]);
																	}
																}
															 for(var d=0; d<actionsToDelete.length; d++) {
																	bttnsDisplayed.splice(bttnsDisplayed.indexOf(actionsToDelete[d]),1);
																}
														}
			 									 if(rowCntr==0){
												    	for(var l=0; l<viewActions.length; l++ ){
														 	 var index = bttnsDisplayed.indexOf(viewActions[j]);
															 if(index==-1){
																 bttnsDisplayed.push(viewActions[j]);
															 }
														 }
													}
												 }
												 var rowIndex = multipleIds.indexOf(rowId);
												 if(rowIndex==-1){
													multipleIds.push(rowId);
													multipleTaskIds.push(rowData["viewProperties.taskId"]);
												 }
												 if($.inArray(actionConfigAction ,viewActions)==-1){
												 	 var index = bttnsDisplayed.indexOf(actionConfigAction);
													 if(index!=-1){
												   	 	  bttnsDisplayed.splice(index,1);
													  }
												 }
					               			 }
			     						  }
						               	}


							 }
						 }
						 if(viewActions!=null && viewActions.length>0) {
							 rowCntr++;
						 }
					 }
					 else{
						 $("#selectAll_"+tableTagScriptInput.masterId).prop('checked',false);
						 var viewActions = [];
						 var viewCustomizedActions = [];
						 for(var i=0;i<tableData.length; i++ ){
							 var rowData = tableData[i];
							 if(rowId == rowData[linkColumn]){
								 viewActions  = rowData["viewProperties.actions"];
								 viewCustomizedActions =rowData["viewProperties.customizedActions"];
								 if(viewCustomizedActions != null)
								 {
								 for(var x=0; x<viewCustomizedActions.length; x++ ) {
									 if(viewActions.indexOf(viewCustomizedActions[x]) == -1)
									 viewActions.push(viewCustomizedActions[x]);
				               		}
								 }
								 for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
				     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];

											var actionConfigAction = actionConfig.action.replace(/ /g,'');
											if(viewActions != null) {
												for(var j=0; j<viewActions.length; j++ ) {
													viewActions[j] = viewActions[j].replace(/ /g,'');
							               		}
												for(var j=0; j<viewActions.length; j++ ){
													if(actionConfigAction == viewActions[j] && viewActions[j]!="InactiveReason" && viewActions[j]!="BlockReason"){
														 var index = bttnsDisplayed.indexOf(viewActions[j]);
														 var rowIndex = multipleIds.indexOf(rowId);
														 if(rowIndex!=-1){
															 multipleIds.splice(rowIndex,1);
															 var taskIndex = multipleTaskIds.indexOf(rowData["viewProperties.taskId"]);
															 if(taskIndex !=-1){
																 multipleTaskIds.splice(taskIndex,1);
															 }
														 }
														 if(index>=0 && rowCntr>0){
															 bttnsDisplayed.splice(index,1);
														 }
													 }
												}
										 }
										}
							 }
						 }
						if(viewActions!=null && viewActions.length>0) {
							 rowCntr--;
							 checkDispBttns();
						}
					}
						 for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
		     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];

							var actionId = "#"+(actionConfig.action).replace(/ /g,'')+tableTagScriptInput.masterId+"Bttn";
							$(actionId).hide();
						}
					 for(var c=0; c<bttnsDisplayed.length; c++){
						 $("#"+bttnsDisplayed[c]+tableTagScriptInput.masterId+"Bttn").show();
					 }

					 $("#commonButton_"+tableTagScriptInput.masterId).show();
				}


			function checkDispBttns(){
				var rows=0;
				var viewActions = [];
				var viewCustomizedActions = [];
				if(multipleIds.length==0)
					rowCntr=0;
				for(var i=0; i<multipleIds.length; i++ ){
					for(var j=0; j<tableData.length; j++ ){
						 var rowData = tableData[j];
						 if(multipleIds[i] == rowData[linkColumn]){
							 viewActions = rowData["viewProperties.actions"];
							 viewCustomizedActions =rowData["viewProperties.customizedActions"];
							 if(viewCustomizedActions != null)
							 {
							 for(var x=0; x<viewCustomizedActions.length; x++ ) {
								 if(viewActions.indexOf(viewCustomizedActions[x]) == -1)
								 viewActions.push(viewCustomizedActions[x]);
			               		}
							 }
							 if(viewActions != null) {
								 for(var j=0; j<viewActions.length; j++ ) {
										viewActions[j] = viewActions[j].replace(/ /g,'');
				               		}
								 for(var l=0; l<viewActions.length; l++ ){
									 	 var index = bttnsDisplayed.indexOf(viewActions[l]);
										 if((index==-1 && rows==0) && viewActions[l]!="InactiveReason" && viewActions[l]!="BlockReason") { //||multipleIds.length==1)
											 bttnsDisplayed.push(viewActions[l]);
										 }
									 }
								 var actionsToDelete = [];
								 for(k=0; k<bttnsDisplayed.length; k++){
									var addedBttnIndex = viewActions.indexOf(bttnsDisplayed[k]);
									if(addedBttnIndex==-1){
										actionsToDelete.push(bttnsDisplayed[k]);
									}
								}
								for(var d=0; d<actionsToDelete.length; d++) {
									bttnsDisplayed.splice(bttnsDisplayed.indexOf(actionsToDelete[d]),1);
									}
							  break;
							}
						 }
					 }
					if(viewActions!=null && viewActions.length>0) {
						 rows++;
					}
				}
			}


	   function fnCreateSelect( aData ){
	      var r='<option value=""></option>', i, iLen=aData.length;
	      for ( i=0 ; i<iLen ; i++ ){
	         r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
	      }
	      return r;
	   }


		if(tableTagScriptInput.extraConfProperty){
			$.ajax({
			  url: tableTagScriptInput.extraConfProperty,
			  dataType: "text",
			  type: "GET",
			  async: false,
			  success: function(extraProperties, xhr, response) {
			  var myObject ;
				try {
					 myObject = JSON.parse(extraProperties);

				}
				catch(err) {
					console.error("Error in parsing json response  'extraProperties : " + extraProperties + "'", err)
				}
				  $.extend(true, tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params], myObject);
				},
			  error : function(jqXHR, textStatus, errorThrown) {
				  alert("textStatus = " + textStatus);
				  alert("errorThrown = " + errorThrown);
				}
			});
		}

		$(document).ready(function() {
            if($.fn.DataTable.isDataTable(tableTagScriptInput.tableId)){
                $(tableTagScriptInput.tableId).dataTable().fnDestroy();//PDDEV-18461
             }
			$("#deleteRecord_"+tableTagScriptInput.masterId).modal('hide');
			$("#deleteRecordButton_"+tableTagScriptInput.masterId).hide();
			$("#deleteButton_"+tableTagScriptInput.masterId).show();
			var bServerSide=tableTagScriptInput.bServerSide;
			getVisibleCols();
	/* 		 keys = new $.fn.dataTable.KeyTable( {
			    	"table": document.getElementById("<c:out value='${htmlTableId}' />")
	 */
			        /* "datatable": oTable */
	/* 	} );   */
			tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params] = {

			       "oLanguage": {
				    	  "oPaginate": {
					          "sPrevious": tableTagScriptInput.lbl_Previous,
					          "sNext":     tableTagScriptInput.lbl_Nxt
					        },
				           	  "sZeroRecords": tableTagScriptInput.lbl_ZeroRecords,
					          "sProcessing": tableTagScriptInput.lbl_Processing,
					          "sInfo": tableTagScriptInput.lbl_Info,
					          "sInfoFiltered": "",
					          "sSearch": tableTagScriptInput.lbl_Search,
					          "sLengthMenu": tableTagScriptInput.lbl_LengthMenu
				        },
				      "lengthMenu": [10, 25, 50,100,150,200],
				      "bSort": tableTagScriptInput.bSort,
				      "bFilter" : tableTagScriptInput.bFilter,
				      "bInfo" : tableTagScriptInput.bInfo,
					  "bLengthChange": tableTagScriptInput.bLengthChange,
					  "bJQueryUI": tableTagScriptInput.bJQueryUI,
					  /* Horizontal scroll is commented because we have to enable fixed header (issue No PDDEV-214) in our DataTable
					     As per datatables.net we cannot enable fixed header functionality with scroll
					  "keys":true,
					  "sScrollX": "100%",
				      "sScrollXInner": "110%",
				      "bScrollCollapse": true,  */
				      "bServerSide": tableTagScriptInput.bServerSide,
				      "sAjaxSource": tableTagScriptInput.loadDataUrl,
				      "aaSorting": [],
					  "aoColumnDefs":getColumnDefs(),
				      "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
				        	 var iPos = tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnGetPosition(nRow);
						 	 var JSONdata = {};
						 	 var columnClickFunction="";
						 	for(let columnConfigIndex in tableTagScriptInput.dataTableRecords){
								   let columnConfig = tableTagScriptInput.dataTableRecords[columnConfigIndex];
								var index = parseInt(columnConfigIndex)+1;

								JSONdata[columnConfig.dataField] = aData[index];
							 	if(columnConfig.columnType=='link' && columnConfig.columnClickFunction){
										columnClickFunction= columnConfig.columnClickFunction
									}
						 	}
                            var colorBulletHtml = "";
						 	if(JSONdata.gridColorCode != null && JSONdata.gridColorCode != "" && JSONdata.gridColorCode != undefined){
                                colorBulletHtml = "<span class='GridColorBullet' style='background-color:"+JSONdata.gridColorCode+";width: 7px;height: 7px;display: inline-block;border-radius: 50%;margin-left: 20px;'></span>";
                             }

						 	tableData.push(JSONdata) ;
				        	//code started for implementation of specific class on particular column
				        	 var counterForClass= 0;
							 for(let columnConfigIndex in tableTagScriptInput.dataTableRecords){
								   let columnConfig = tableTagScriptInput.dataTableRecords[columnConfigIndex];

							 	if(columnConfig.hidden!=true){

							 	counterForClass++;
							 	if(columnConfig.columnCSS){
							 			var columnIndex = counterForClass;
						 		    	$('td:eq('+columnIndex+')', nRow).addClass(columnConfig.columnCSS);
							 			}
							 		}
							 	}
		//		      });

						 	//code end for implementation of specific class on particular column
				        	var visibleColsLength=null;
				         	  vCols = new Array();
					      	  $.each( tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnSettings().aoColumns, function(c){
					      	  if( tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnSettings().aoColumns[c].bVisible == true){
					      	  vCols = vCols.concat( tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnSettings().aoColumns[c].sName)
					      	  }
					      	  });
					      	visibleColsLength=(vCols.length)-1;
					      	var action = null;
				        	if (actionIndex > -1) {
				        	 action=aData[actionIndex];
				        	}
				        	var html ="";

				        	if(action!=null){


				        	if (action.length > 3){
				        			html+="<div class='btn-group btn-group-datatable'>";
						        	html+='<button class="btn btn-sm dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cog"></i>&nbsp;&nbsp;&nbsp;<span class="caret"></span></button>';
						        	html+='<ul class="dropdown-menu pull-right">';
				        	}


			               if(viewModeProperty == "false"){
			               	 	for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
			     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];
			               	 		for(i=0;i<action.length;i++){
			                			if(actionConfig.action==action[i]){
			                				var actionTitleKey=actionConfig.titleKey;
			                				if(actionTitleKey){
					                			var titleMessage =  actionConfig.titleMessage;
			                                     if (action.length > 3){

					                					html+='<li><a id="'+actionConfig.action+ '" class="'+actionConfig.action+'" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+ '" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" targetUrl="'+ actionConfig.actionUrl +'" title="'+actionConfig.titleMessage+'"/>'+ titleMessage +'</a></li>'
					                				}
					                				if (action.length <= 3){
					                					html+='<img tabindex="0" id="'+actionConfig.action+ '" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+ actionConfig.titleMessage +'" targetUrl="'+actionConfig.actionUrl+'"/>'
					                				}

			                					}
			                				else
			                					{
				                					if (action.length > 3){
					                					html+='<li><a id="'+actionConfig.action+ '" class="'+actionConfig.action+ '" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+ '" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.titleMessage+'" targetUrl="'+ actionConfig.actionUrl +'"/>'+actionConfig.action+'</a></li>'
					                				}
					                				if (action.length <= 3){
					                					html+='<img tabindex="0" id="'+actionConfig.action+ '" src="'+getContextPath()+actionConfig.imagePath +'" alt="'+actionConfig.action+'" title="'+ actionConfig.titleMessage +'" targetUrl="'+actionConfig.actionUrl+'"/>'
					                				}
			                					}



			                			}
			                			$('td:eq('+visibleColsLength+')', nRow).html(html);
			                		}
			               	 	}
			                	}
			                	else{
			                			for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
						     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];


			                		for(i=0;i<action.length;i++){
			                			if(actionConfig.action==action[i]){
			                				var actionTitleKey=actionConfig.titleKey;
			                				if(actionTitleKey){
			                				var titleMessage= actionConfig.titleMessage ;

			                				if (action.length > 3){
			                					html+='<li><a id="'+actionConfig.action+ '" class="'+actionConfig.action+ '"  href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+ '" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="' + actionConfig.titleMessage+ '" class="na-cursor" disabled="true" onclick="return false;"/>'+ titleMessage +'</a></li>'
			                				}

			                				if (action.length <= 3){
			                					html+='<img tabindex="0" id="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+action.titleMessage+'" class="na-cursor" disabled="true" onclick="return false;"/>'
			                				}
			                				}
			                				else
			                					{

				                				if (action.length > 3){
				                					html+='<li><a id="'+actionConfig.action+'" class="'+actionConfig.action+'" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.action+'" class="na-cursor" disabled="true" onclick="return false;"/>"'+actionConfig.action+'</a></li>'
				                				}

				                				if (action.length <= 3){
				                					html+='<img tabindex="0" id="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.action+'" class="na-cursor" disabled="true" onclick="return false;"/>'
				                				}

			                					}



			                			}
			                			$('td:eq('+visibleColsLength+')', nRow).html(html);
			                		}
			                		}

			                	}

			                	if (action.length > 3){
			                		html+='</ul></div>';
			                	}

			                }

				        	var viewCustomizedActionIndex = null;
				        	var customizedAction = null;
				        	if (customizedActionIndex > -1) {
				        		customizedAction=aData[customizedActionIndex];
				        		viewCustomizedActionIndex=visibleColsLength-1;
				        	}
				        	var html ="";
				        	if(customizedAction!=null){


				        	if (customizedAction.length > 3){
				        			html+="<div class='btn-group btn-group-datatable'>";
						        	html+='<button class="btn btn-sm dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cog"></i>&nbsp;&nbsp;&nbsp;<span class="caret"></span></button>';
						        	html+='<ul class="dropdown-menu pull-right">';
				        	}
				        	if(viewModeProperty == "false"){
			                			for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
						     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];

			                		for(i=0;i<customizedAction.length;i++){
			                			if(actionConfig.action==customizedAction[i]){
			                				var actionTitleKey=actionConfig.titleKey;
			                				if(actionTitleKey)
			                					{
			                			var titleMessage=actionConfig.titleMessage ;
	                                     if (customizedAction.length > 3){

	                                    	 html+='<li><a id="'+actionConfig.action+ '" class='+actionConfig.action+'" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" targetUrl="'+ actionConfig.actionUrl +'" title="'+actionConfig.titleMessage+'"</a></li>'

	                                     }
			                				if (customizedAction.length <= 3){
			                					html+='<img tabindex="0" id="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title='+actionConfig.titleMessage+' targetUrl="'+actionConfig.actionUrl+'"/>'
			                				}

			                					}
			                				else
			                					{
			                					if (customizedAction.length > 3){
				                					html+='<li><a id="'+actionConfig.action+'" class="'+actionConfig.action+'" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.action+'" targetUrl="'+actionConfig.actionUrl+'"/>'+actionConfig.action+'</a></li>'
				                				}
				                				if (customizedAction.length <= 3){
				                					html+='<img tabindex="0" id="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.action+'" targetUrl="'+actionConfig.actionUrl+'"/>'
				                				}
			                					}



			                			}
			                			$('td:eq('+viewCustomizedActionIndex+')', nRow).html(html);
			                		}
			                		}
			                	}
			                	else{
			                		for(let actionConfigIndex in tableTagScriptInput.actionConfigurations){
					     				   let actionConfig = tableTagScriptInput.actionConfigurations[actionConfigIndex];
				               		for(i=0;i<customizedAction.length;i++){
			                			if(actionConfig.action==customizedAction[i]){
			                				var actionTitleKey=actionConfig.titleKey;
			                				if(actionTitleKey){
			                				var titleMessage= actionConfig.titleMessage ;

			                				if (customizedAction.length > 3){
			                					html+='<li><a id="'+actionConfig.action+'" class='+actionConfig.action+'" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.titleMessage+'" class="na-cursor" disabled="true" onclick="return false;"/>'+ titleMessage +'</a></li>'
			                				}

			                				if (customizedAction.length <= 3){
			                					html+='<img tabindex="0" id="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.titleMessage+'" class="na-cursor" disabled="true" onclick="return false;"/>'
			                				}
			                				}
			                				else
			                					{

				                				if (customizedAction.length > 3){
				                					html+='<li><a id="'+actionConfig.action+'" class='+actionConfig.action+'" href="#" targetUrl="'+actionConfig.actionUrl+'"><img tabindex="0" class="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.action+'" targetUrl="'+actionConfig.actionUrl+'"/>'+actionConfig.action+'</a></li>'
				                				}

				                				if (customizedAction.length <= 3){
				                					html+='<img tabindex="0" id="'+actionConfig.action+'" src="'+getContextPath()+actionConfig.imagePath+'" alt="'+actionConfig.action+'" title="'+actionConfig.action+'" class="na-cursor" disabled="true" onclick="return false;"/>'
				                				}

			                					}



			                			}
			                			$('td:eq('+viewCustomizedActionIndex+')', nRow).html(html);
			                		}
			                		}

			                	}

			                	if (customizedAction.length > 3){
			                		html+='</ul></div>';
			                	}

			                }

							if ( aData[0] == null && checkActions(JSONdata) )
							{

								var test = $("#selectAll_"+tableTagScriptInput.masterId).prop('checked');
								if(test == "checked" || test== true)
								{
									$('td:eq(0)', nRow).html( '<input type="checkbox" class="selectThis_'+tableTagScriptInput.masterId+'" name="selectThis_'+tableTagScriptInput.masterId + '" id="selectThis_'+tableTagScriptInput.masterId+'" checked="checked">' );
								}
								else
								{
									$('td:eq(0)', nRow).html( '<input type="checkbox" class="selectThis_'+tableTagScriptInput.masterId+'" name="selectThis_'+tableTagScriptInput.masterId + '" id="selectThis_'+tableTagScriptInput.masterId+'">' );
							    }
							}
							if ( aData[0] == null && JSONdata["viewProperties.actions"]== null){
								$('td:eq(0)', nRow).html("");
							}

							var columnValueURL = $('td:eq(1)', nRow).html();
							var viewPropRecordUrl = JSONdata["viewProperties.recordUrl"];
							var viewPropHrefBoolType = JSONdata["viewProperties.hrefBoolType"];
							if(tableTagScriptInput.childTable == 'true'){
								if(viewPropHrefBoolType!="" && viewPropHrefBoolType!=null){
									if(viewPropHrefBoolType!='false'){
									$('td:eq(1)', nRow).html( '<a href="#" onclick="openChildDialog(\'view\',\''+aData[linkIndex]+'\',\''+tableTagScriptInput.masterId+'\',\''+tableTagScriptInput.parentId+'\')">'+columnValueURL+'</a>'+colorBulletHtml);
									}
								}
								else{
									if(tableTagScriptInput.hrefBoolType!= 'false'){
									$('td:eq(1)', nRow).html( '<a href="#" onclick="openChildDialog(\'view\',\''+aData[linkIndex]+'\',\''+tableTagScriptInput.masterId+'\',\''+tableTagScriptInput.parentId+'\')">'+columnValueURL+'</a>'+colorBulletHtml);
									}
								}
							}
							else
							{	if(viewPropRecordUrl!="" && viewPropRecordUrl!=null){
									if(viewPropHrefBoolType!="" && viewPropHrefBoolType!=null){
										if(viewPropHrefBoolType!='false'){
											if (columnClickFunction!= "") {
									    		$('td:eq(1)', nRow).html('<a id="'+aData[linkIndex]+'" href="javascript:void(0)" onclick='+columnClickFunction+"('"+getContextPath+viewPropRecordUrl+''+aData[linkIndex]+"'"+",'GET')>"+columnValueURL+'</a>'+colorBulletHtml);
								       		 }else{
									   	   			$('td:eq(1)', nRow).html( '<a id="'+aData[linkIndex]+'" href='+getContextPath()+viewPropRecordUrl+''+aData[linkIndex]+'>'+columnValueURL+'</a>'+colorBulletHtml);
								       		  	  }
										}
									}
									else{
										if(tableTagScriptInput.hrefBoolType!= 'false'){
											if (columnClickFunction!= "") {
								    			$('td:eq(1)', nRow).html('<a id="'+aData[linkIndex]+'" href="javascript:void(0)" onclick='+columnClickFunction+"('"+getContextPath()+viewPropRecordUrl+''+aData[linkIndex]+"'"+",'GET')>"+columnValueURL+'</a>'+colorBulletHtml);
							       		 	}else{
								   	   				$('td:eq(1)', nRow).html( '<a id="'+aData[linkIndex]+'" href='+getContextPath()+viewPropRecordUrl+''+aData[linkIndex]+'>'+columnValueURL+'</a>'+colorBulletHtml);
							       		  	  	  }
										}
									}
								}
								else{
									if(viewPropHrefBoolType!="" && viewPropHrefBoolType!=null){
										if(viewPropHrefBoolType!='false'){
											if (columnClickFunction!= "") {
									    		$('td:eq(1)', nRow).html('<a id="'+aData[linkIndex]+'" href="javascript:void(0)" onclick='+columnClickFunction+"('"+getContextPath()+recordURL+''+aData[linkIndex]+"'"+",'GET')>"+columnValueURL+'</a>'+colorBulletHtml);
								       		 }else{
									   	   			$('td:eq(1)', nRow).html( '<a id="'+aData[linkIndex]+'" href='+getContextPath()+recordURL+''+aData[linkIndex]+'>'+columnValueURL+'</a>'+colorBulletHtml);
								       		  	  }
										}
									}
									else{
										if(tableTagScriptInput.hrefBoolType!= 'false'){
											if (columnClickFunction!= "") {
								    			$('td:eq(1)', nRow).html('<a id="'+aData[linkIndex]+'" href="javascript:void(0)" onclick='+columnClickFunction+"('"+getContextPath()+recordURL+''+aData[linkIndex]+"'"+",'GET')>"+columnValueURL+'</a>'+colorBulletHtml);
							       		 	}else{
								   	   				$('td:eq(1)', nRow).html( '<a id="'+aData[linkIndex]+'" href='+getContextPath()+recordURL+''+aData[linkIndex]+'>'+columnValueURL+'</a>'+colorBulletHtml);
							       		  	 	 }
										}
									}
								}
							}

						},

				        "fnInitComplete": function( oSettings ) {
				          $(tableTagScriptInput.tableId+"_filter input").addClass('search-query');
				          $(tableTagScriptInput.tableId+"_length select").addClass('col-sm-5');
				          if(tableTagScriptInput.extraFilterIdProperty){
				             $('<div id="extraFilter_'+tableTagScriptInput.extraFilterIdProperty+'" class="'+tableTagScriptInput.extraFilterCssClassProperty+'" style="float: '+tableTagScriptInput.extraFilterCssClassProperty+'; margin-'+tableTagScriptInput.extraFilterCssClassProperty+': 10px;"><label><br /></label></div>').insertBefore(tableTagScriptInput.tableId);
				             $("#"+tableTagScriptInput.extraFilterIdProperty).appendTo($('#extraFilter_'+tableTagScriptInput.extraFilterIdProperty+' label'));
				          }
	/* 			          keys.fnSetPosition( 0, 0 );
	 */			          if(viewModeProperty == "true"){
								$("#selectAll_"+tableTagScriptInput.masterId).attr("disabled",true);
								 $('body').on('load',"#selectThis_"+tableTagScriptInput.masterId,function(){
									$(this).attr("disabled",true);
								});
								var allThisCheckBox = document.getElementsByName("selectThis_"+tableTagScriptInput.masterId);
								 for(var i =0; i<allThisCheckBox.length; i++){
									 allThisCheckBox[i].disabled = true;
							}

							}
	 						$(tableTagScriptInput.tableId).wrap("<div class='neutrino-datatable-scrollx-wrapper' />");
	 						invokeCloseOnScroll('.neutrino-datatable-scrollx-wrapper',".neutrino-datatable-scrollx-wrapper .btn-group-datatable","open");
				      },

				      "fnPreDrawCallback": function( oSettings ) {
				    	  if(!isPaginated){
					    	  var allThisCheckBox = document.getElementsByName("selectThis_"+tableTagScriptInput.masterId);
					    	  for(var i=0;i<allThisCheckBox.length;i++){
						    		if(allThisCheckBox[i].checked){
						    			selectedColumns[i]=false;
						    			$("#commonButton_"+tableTagScriptInput.masterId).hide();
						    			allThisCheckBox[i].checked = false;
						    		}else{
						    			selectedColumns[i]=false;
						    		}
					    	  }
				    	  }else{
				    		  selectedColumns=[];
				    	  }

				    	  isPaginated=false;
				    	  if(!columnAltered) {
				    		  multipleIds=[];
				    		  bttnsDisplayed=[];
				    		  tableData = [];
							  rowCntr=0;
				    	  }
				      },

				      "fnDrawCallback": function( oSettings ) {
				    	  var allThisCheckBox = document.getElementsByName("selectThis_"+tableTagScriptInput.masterId);
				          for(var i =0; i<allThisCheckBox.length; i++){
								 if(selectedColumns[i]){
									 allThisCheckBox[i].checked = true;
								 }
						}
				      }
			};

			if(tableTagScriptInput.labelsProperty){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["oLanguage"]["sURL"] = tableTagScriptInput.oLanguage;
			}

			tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["aoColumns"] = tableTagScriptInput.dataTableSortProperty;

			if(tableTagScriptInput.autoWidth){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bAutoWidth"] = tableTagScriptInput.autoWidthProperty;
			}

			if(tableTagScriptInput.deferRender){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bDeferRender"] = tableTagScriptInput.deferRenderProperty;

			}
			if(tableTagScriptInput.jqueryUI){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bJQueryUI"] = tableTagScriptInput.jqueryUIProperty;

			}
			if(tableTagScriptInput.processing){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bProcessing"] = tableTagScriptInput.processingProperty;
			}

			if(tableTagScriptInput.sort){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bSort"] = tableTagScriptInput.sortProperty;
			}

			if(tableTagScriptInput.sortClasses){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bsortClasses"] = tableTagScriptInput.sortClassesProperty;
			}

			if(tableTagScriptInput.stateSave){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bStateSave"] = tableTagScriptInput.stateSaveProperty;
			}

			if(tableTagScriptInput.cookiePrefix){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["bcookiePrefix"] = tableTagScriptInput.cookiePrefixProperty;
			}

			if(bServerSide){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["sDom"]= '<"clear">fl<"#colvis_'+tableTagScriptInput.htmlTableId+'">rt<"row"<"pull-left col-sm-6"i><"pull-right"p><"pull-right table-export-wrapper"B>>';
			    tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["buttons"]=
						 [
						 	{
					           "extend":    "copy",
					           "text": tableTagScriptInput.lbl_copy,
					           exportOptions: {
					        	   columns: ':visible:not(.export-exclude)'
				                }
					       	},
					       	{
					           "extend":    "csv",
					           "text": tableTagScriptInput.lbl_csv,
					           "title": tableTagScriptInput.title,
					           exportOptions: {
					        	   columns: ':visible:not(.export-exclude)'
				                },
							       	customize: function(csvData){
						                return csvData.replace(new RegExp(",(['\"])([+@=-])", 'g'), ",$1'$2");
						            }
					       	},
					       	{
					           "extend":    "excel",
					           "text": tableTagScriptInput.lbl_xls,
					           "title": tableTagScriptInput.title,
					           exportOptions: {
					        	   columns: ':visible:not(.export-exclude)'
				                },
				                customizeData: function(csvData){
				                	var body=csvData.body;
				                	var getSecureCellValue=function(cellData){
	                					if(cellData!=null && typeof cellData=='string'){
	                						return cellData.replace(new RegExp("^([+@=-])", 'g'), "'$1");
	                					}else{
	                						return cellData;
	                					}
				                	}
				                	if(body!=null){
				                		var securyBody=[];
				                		body.forEach(function(row){
				                			var secureColumns=[];
				                			if(row!=null){
				                				row.forEach(function(column){
			                						secureColumns.push(getSecureCellValue(column));
				                				})
				                				securyBody.push(secureColumns);
				                			}else{
				                				securyBody.push(row);
				                			}

				                		})
				                	}
				                	csvData.body=securyBody;
				                	if(csvData.header!=null){
				                		var secureHeader=[];
				                		csvData.header.forEach(function(header){
				                			secureHeader.push(getSecureCellValue(header));
				                		});
                						csvData.header=secureHeader;
				                	}
				                	if(csvData.footer!=null){
				                		var secureFooter=[];
				                		csvData.footer.forEach(function(footer){
				                			secureFooter.push(getSecureCellValue(footer));
				                		});
                						csvData.footer=secureFooter;
				                	}
				                	for (var i=0; i<csvData.body.length; i++){
				                		for (var j=0; j<csvData.body[i].length; j++ ){
											if(typeof(csvData.body[i][j]) == "string"){
												if((parseFloat(csvData.body[i][j]) != "NaN" && csvData.body[i][j].length > 15) || csvData.body[i][j].charAt(0) === 0){
													csvData.body[i][j] = csvData.body[i][j] + '\u200C';
												}
											}
											if(typeof(csvData.body[i][j]) == "number"){
												if(csvData.body[i][j].length > 15){
													csvData.body[i][j] = csvData.body[i][j] + '\u200C';
												}
											}
				                		}
			                		}
				                	return csvData;
					            }

					       },
					       {
					           "extend":    "pdf",
					           "text": tableTagScriptInput.lbl_pdf,
					           "title": tableTagScriptInput.title,
					           orientation: 'landscape',
					           exportOptions: {
					        	   columns: ':visible:not(.export-exclude)'
				                },
				                customize: function ( doc ) {
				                var tblBody = doc.content[1].table.body;
				                if(tblBody.length>1){
			                	$(tableTagScriptInput.tableId).find('tr').each(function (ix, row) {
			                		$(row).find('td').each(function (ind, elt) {
			                			var isNumberType = $(tableTagScriptInput.tableId+' th:visible:not(.export-exclude)').eq(ind).hasClass('tbl-right');
			                			cssClass=$(row).hasClass('even')?'Even':'Odd';
			                			sStyle='tableBody'+cssClass;
			                			if(isNumberType==true){
			                				if(tblBody[ix][ind]!='undefined' && tblBody[ix][ind]!=null){
			                					if(cssClass=='Even'){
													tblBody[ix][ind].style={alignment: 'right'};
												}else{
													tblBody[ix][ind].style={fillColor: '#f3f3f3',alignment: 'right'};
												}
			                				}
			                			}else{
			                				if(tblBody[ix][ind]!='undefined' && tblBody[ix][ind]!=null){
			                					tblBody[ix][ind].style=sStyle;
			                				}
			                			}
			                		});
			                	});
				              }
				            }
					      }
					    ];
			}else{
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]["sDom"]= '<"clear">fl<"#colvis_'+tableTagScriptInput.htmlTableId+'">rt<"row"<"pull-left col-sm-6"i><"pull-right"p>>';
			}
			   var count=0;

			   for(let recordIndex in tableTagScriptInput.dataTableRecords){
				   let record = tableTagScriptInput.dataTableRecords[recordIndex];
				 if(record.columnType == 'link'){
					 	linkIndex=count+1;
						linkColumn=record.dataField;
				   }
					 count++;
			   }

		     count = 0;

		     for(let recordIndex in tableTagScriptInput.dataTableRecords){
				   let record = tableTagScriptInput.dataTableRecords[recordIndex];
		    	if(record.dataField == 'viewProperties.actions'){
					actionIndex=count+1;
		     }
				 count++;
				 }
		     count = 0;

		     for(let recordIndex in tableTagScriptInput.dataTableRecords){
				   let record = tableTagScriptInput.dataTableRecords[recordIndex];

			 if(record.dataField == 'viewProperties.customizedActions'){

			 customizedActionIndex=count+1;
			 }
				 count++;
		     }
		     if(tableTagScriptInput.editable == 'true'){
				 tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId] = $(tableTagScriptInput.tableId).dataTable(tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]).makeEditable({
						sUpdateURL:"UpdateData",

			        	fnOnEdited: function(status)
						{
			        		$.sticky("Record(s) Edited Successfully.!!", {autoclose : 10000, position: "top-center", type: "st-success" });

			        		loadDataTableData(tableTagScriptInput.parentId,tableTagScriptInput.masterId);
						},
					});
			}
			else{
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId] = $(tableTagScriptInput.tableId).dataTable(tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId_Params]);
				// This code is added to enable fixed header
				/* new $.fn.dataTable.FixedHeader(oTable_${htmlTableId}, {
			        "offsetTop": 110
			    } ); */
				// End of code for fixed header
				var showPopoverProperty=tableTagScriptInput.showPopoverProperty;
				viewModeProperty = tableTagScriptInput.viewModeProperty
				if(showPopoverProperty == "true")
				{
						showPopoverOnTable(tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId]);
				}
			}
		    //PDDEV-16923_Master->Hide Column Issue always hide second columns as its with hyperlink
		     var tableHeaderObj = $(tableTagScriptInput.tableId+' th');
		     $(tableHeaderObj[1]).removeClass("visibility-include").addClass("visibility-exclude");

		     //Add colvis button
		     $('.dataTables_filter input').attr( 'maxlength', 255 );
	 		new $.fn.dataTable.Buttons( tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId], {
			    buttons: [
			        {
			            extend: 'colvis',
			            "text": tableTagScriptInput.lbl_showHideCols,
			            columns: ':visible:not(.visibility-exclude)',
			        }
			    ]
			} );

	 		if(tableTagScriptInput.bServerSide){
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].api().buttons( 1, null ).container().appendTo('#colvis_'+tableTagScriptInput.htmlTableId);
			}else{
				tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].api().buttons( 0, null ).container().appendTo('#colvis_'+tableTagScriptInput.htmlTableId);
			}

		    var searchWait = 0;
		    var searchWaitInterval;
		    $('.dataTables_filter input')
		    .unbind()
		    .bind('input', function(e){
		       $("#selectAll_"+tableTagScriptInput.masterId).prop('checked',false);
		 	   $("#commonButton_"+tableTagScriptInput.masterId).hide();


		 	   columnAltered = false;
		        var item = $(this);
		        var lastSearchTermLength = 0;
		        var lastSearchTerm=$(item).attr("last_search_term");
		        if(lastSearchTerm!="" && lastSearchTerm!=null && lastSearchTerm != 'undefined'){
		        	lastSearchTermLength = lastSearchTerm.length;
		        }
		            if ($(item).val() == lastSearchTerm) return;
			    	if ($(item).val().length < tableTagScriptInput.minCharToBeginSearch && lastSearchTermLength < tableTagScriptInput.minCharToBeginSearch) return;

			        searchWait = 0;
			        if(!searchWaitInterval) searchWaitInterval = setInterval(function(){
			            if(searchWait>=tableTagScriptInput.minCharToBeginSearch){
			                clearInterval(searchWaitInterval);
			                searchWaitInterval = '';
			                searchTerm = $(item).val();
			                tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnFilter(searchTerm);
			                $(item).attr("last_search_term",searchTerm);
			                searchWait = 0;
			            }
			            searchWait++;
			        },200);
		    });

		    $(".dataTables_length").change(function(e){
		 	   setTimeout(function(){getMultipleIds()},($(".dataTables_length option:selected").text()*60));
		 	   columnAltered = false;
		    });

		    $("#"+tableTagScriptInput.masterId+"_previous,#"+tableTagScriptInput.masterId+"_next").click(function(){
		    	isPaginated=true;
		    	columnAltered = false;
		    	$("#selectAll_"+tableTagScriptInput.masterId).prop('checked',false);
		    	$("#commonButton_"+tableTagScriptInput.masterId).hide();
		    	var allCheckBox = document.getElementsByName("selectThis_"+tableTagScriptInput.masterId);
		    	for(var i=0;i<tableData.length;i++)
		    		allCheckBox[i].checked = false;
		    });

		    function getVisibleCols() {
			    var counter = 0;
			    aColumns.push(counter);
			    counter++;
			    //			    aColumns.push(4);
			    for(let columnConfigIndex in tableTagScriptInput.dataTableRecords)
			    { let columnConfig = tableTagScriptInput.dataTableRecords[columnConfigIndex];
			   if( columnConfig.hidden == 'true' || columnConfig.titleKey == 'key.actions'){
	  				 aColumns.push(counter);
			    }
	          counter++;
			  }
	  		aColumns.push(counter);
	  		}

			if(tableTagScriptInput.extraFileProperty){

				$.getScript(tableTagScriptInput.extraFileProperty);
			}
			if(tableTagScriptInput.filterables==true){

				$("tfoot th").each( function (index, dom) {
			        if($('input', this).length > 0){
			        	$('input', this).keyup(function(){
							tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnFilter( this.value, index);
			        	});
					}
			    });

				/* Add a select menu for each TH element in the table footer */
			    $("tfoot th").each( function ( i ) {
				    if($(this).find('select').length > 0){
					    $(this).find('select').html(fnCreateSelect( tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnGetColumnData(i) ));
				    	$(this).find('select').change( function () {
				    		tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.oTable_htmlTableId].fnFilter( $(this).val(), i );
				        });
				    }
			    } );
			}

		    if(tableTagScriptInput.customRowId){

		    	tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.htmlTableId_rowIdArray] = [];

		    	tableTagScriptInput.rowIdList.split(tableTagScriptInput.delimitor).forEach(function(rowId) {
					tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.htmlTableId_rowIdArray].push(rowId);
				});

				$(tableTagScriptInput.tableId+" tr").each(function(index, dom){
					$(this).attr('id', tableTagScriptInput.table_dynamicVariables[tableTagScriptInput.htmlTableId_rowIdArray][index - 1]);
				});
		    }

			var rows = $(tableTagScriptInput.tableId).dataTable().fnGetNodes();
			$("#count").html(rows.length);

			$("body").on("click","#colvis_"+tableTagScriptInput.htmlTableId+" a.dt-button", function() {
				columnAltered = true;
			});
		});

		//Call before every ajax request.Use in case of modification in ajax request.
		$(tableTagScriptInput.tableId).on('preXhr.dt', function ( e, settings, data ) {
			if(settings && data.iSortCol_0 && settings.aoColumns[data.iSortCol_0].sTitle.indexOf('Active/Inactive') !=-1){
			data.sSortDir_0=data.sSortDir_0 =='asc'?'desc':'asc';
			}
		});


	  if((tableTagScriptInput.filterables).includes('true')){

	   (function($) {
	      /*
	       * Function: fnGetColumnData
	       * Purpose:  Return an array of table values from a particular column.
	       * Returns:  array string: 1d data array
	       * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
	       *           int:iColumn - the id of the column to extract the data from
	       *           bool:bUnique - optional - if set to false duplicated values are not filtered out
	       *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
	       *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
	       * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
	       */
	      $.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
	          // check that we have a column id
	          if ( typeof iColumn == "undefined" ) return new Array();

	          // by default we only wany unique data
	          if ( typeof bUnique == "undefined" ) bUnique = true;

	          // by default we do want to only look at filtered data
	          if ( typeof bFiltered == "undefined" ) bFiltered = true;

	          // by default we do not wany to include empty values
	          if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;

	          // list of rows which we're going to loop through
	          var aiRows;

	          // use only filtered rows
	          if (bFiltered == true) aiRows = oSettings.aiDisplay;
	          // use all rows
	          else aiRows = oSettings.aiDisplayMaster; // all row numbers

	          // set up data array
	          var asResultData = new Array();

	          for (var i=0,c=aiRows.length; i<c; i++) {
	              iRow = aiRows[i];
	              var sValue = this.fnGetData(iRow, iColumn);

	              // ignore empty values?
	              if (bIgnoreEmpty == true && sValue.length == 0) continue;

	              // ignore unique values?
	              else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;

	              // else push the value onto the result data array
	              else asResultData.push(sValue);
	          }

	          return asResultData;
	   }}(jQuery));
	  }

	  function getMultipleIds(evtTarget)
	   {
		  var isSelectAllEvt =(evtTarget=='evntSelectAll')?true:false;
			    var test = $("#selectAll_"+tableTagScriptInput.masterId).prop('checked');
						var allCheckBox = document.getElementsByName("selectThis_"+tableTagScriptInput.masterId);
						 if(test == "checked" || test== true){
							 rowCntr=0;
						 }
						 for(var i =0; i<tableData.length; i++){
							 for(var j =0; j<allCheckBox.length; j++){
								 if(test == "checked" || test== true){
										allCheckBox[j].checked = true;
										test = true;
									}
								 	else if(isSelectAllEvt && !test){
										allCheckBox[j].checked = false;
										test = false;
									}
							 }
										var recordData =tableData[i]
										rowId = recordData[linkColumn];
									    displayBttns(test,rowId);

							 }
	   }

	   function checkActions(JSONdata) {
		   if( (JSONdata["viewProperties.actions"] != undefined && JSONdata["viewProperties.actions"].length > 0) ||
				   (JSONdata["viewProperties.customizedActions"] != undefined && JSONdata["viewProperties.customizedActions"] > 0) ) {
			   return true;
		   } else {
			   return false;
		   }
	   }

	   function getColumnDefs() {
		    var aoColumnDefs = new Array();
		    var map = {};
		    var colTypeArr = tableTagScriptInput.columnTypeList.split(tableTagScriptInput.delimitor);

		    for (let colType = 0; colType < colTypeArr.length; colType++) {


		        if (colTypeArr[colType] == 'string' || colTypeArr[colType] == 'date') {

		            map["aTargets"] = [(colType + 1)];
		            map["sClass"] = "tbl-left";
		        } else if (colTypeArr[colType] == 'number') {
		            map["aTargets"] = [(colType + 1)];
		            map["sClass"] = "tbl-right";
		        } else {
		            map["aTargets"] = [(colType + 1)];
		            map["sClass"] = "tbl-left";
		        }
		        aoColumnDefs.push(jQuery.extend(true, {}, map));
		    }
		    return aoColumnDefs;
		}

	   invokeCloseOnScroll(window,".neutrino-datatable-scrollx-wrapper .btn-group-datatable","open");

