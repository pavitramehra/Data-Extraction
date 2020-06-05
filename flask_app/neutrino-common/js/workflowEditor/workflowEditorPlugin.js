(function ( $ ) {
	$.fn.drawWorkflow = function(input){
		this.settings = $.extend({
			graphDataInternal : '',
			manipulationEnabled : false,
			randomSeed : 881428,
            version : 0,
            graphType : '',
            comparison : '',
            clickToUseFlag : true
		}, input);
		var attributes=this.settings;
		var elem=this;
		var locales = {
			en: {
				edit: label_edit,
                del: label_delete_selected,
                back: label_back,
                addNode: label_add_component,
                addEdge: label_add_connection,
                editNode: label_edit_component,
                editEdge: label_edit_connection,
                addDescription: label_add_description,
                edgeDescription: label_edge_description,
                editEdgeDescription: label_edit_edge_description
			}
		};
		var options = {

			locale: 'en',
			locales: locales,
			groups: {
				CallActivity: {color:{background:'#ABE670', border:'black'},font:{size: 10}, shape:'box', widthConstraint:{minimum:80, maximum: 130}},
        ServiceTask: {color:{background:'#EDED71', border:'black'},font:{size: 10}, shape:'box', widthConstraint:{minimum:80, maximum: 130}},
        ReceiveTask: {color:{background:'lightblue', border:'black'},font:{size: 10}, shape:'box'},
        BoundaryEvent: {color:{background:'bisque', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/BoundaryEventImg.png', size: 12},
        InclusiveGateway: {color:{background:'#E97A7A', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/InclusiveGatewayImg.png', size: 15},
        ExclusiveGateway: {color:{background:'#E9967A', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/ExclusiveGatewayImg.png', size: 15},
        ParallelGateway: {color:{background:'#E9B27A', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/ParallelGatewayImg.png', size: 15},
        StartEvent: {color:{background:'#0E6714', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/StartEventImg.png', size: 20},
        MessageStartEvent: {color:{background:'lightgrey', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/MessageStartEventImg.png', size: 12},
        EndEvent: {color:{background:'#F32626', border:'black'},font:{size: 10}, shape:'image', image: '../../../static-resources/neutrino/neutrino-common/img/EndEventImg.png', size: 20}
			},
			clickToUse: attributes.clickToUseFlag,
			interaction : {
				navigationButtons : true,
        hover : true
			},
			edges : {
				arrows : {
          to : {
            enabled : true,
            scaleFactor : 0.5,
            type : 'arrow'
          }
        },
        smooth: {
            type : 'cubicBezier',
            forceDirection : 'none',
            roundness : 1
        }
			},
			physics : {
				enabled : false,
			},
			manipulation: {
				enabled: attributes.manipulationEnabled,
				initiallyActive: true,
				addNode: false,
				addEdge: function(edgeData,callback) {
					listOfMethods._workflowAddConnection(edgeData,callback);
				},
				editEdge: false,
				deleteNode: function(nodeData, callback) {
                        listOfMethods._workflowDeleteStage(nodeData,callback);
                    },
				deleteEdge: function(edgeData,callback) {
					listOfMethods._workflowDeleteConnection(edgeData,callback);
				},
				controlNodeStyle:{

				}
			}
		};
		var container = elem;
		var nodes = new vis.DataSet(attributes.graphDataInternal.nodeVOList);
		var edges = new vis.DataSet(attributes.graphDataInternal.edgeVOList);
		var data = {
			nodes : nodes,
			edges : edges
		};
		var network = new vis.Network(container[0], data, options);
    eval("networkData.network_"+attributes.graphType+attributes.version+ attributes.comparison +"="+ "network");
    network = eval("networkData.network_" +attributes.graphType+attributes.version+ attributes.comparison);
		var canvas = network.canvas.frame.canvas;
		var ctx = canvas.getContext('2d');
		var rect = {}, drag = false;
		var drawingSurfaceImageData;
		this.methods = {
			_saveDrawingSurface : function () {
				drawingSurfaceImageData = ctx.getImageData(0, 0, canvas.width,
					canvas.height);
			},
			_restoreDrawingSurface : function () {
				ctx.putImageData(drawingSurfaceImageData, 0, 0);
			},
			_getStartToEnd : function (start, theLen) {
				return theLen > 0 ? {
					start : start,
					end : start + theLen
				} : {
					start : start + theLen,
					end : start
				};
			},
			_selectNodesFromHighlight : function () {
				var fromX, toX, fromY, toY;
				var nodesIdInDrawing = [];
				var xRange = listOfMethods._getStartToEnd(rect.startX, rect.w);
				var yRange = listOfMethods._getStartToEnd(rect.startY, rect.h);

				var allNodes = nodes.get();
				for (var i = 0; i < allNodes.length; i++) {
					var curNode = allNodes[i];
					var nodePosition = network.getPositions([ curNode.id ]);
					var nodeXY = network.canvasToDOM({
						x : nodePosition[curNode.id].x,
						y : nodePosition[curNode.id].y
					});
					if (xRange.start <= nodeXY.x && nodeXY.x <= xRange.end
						&& yRange.start <= nodeXY.y && nodeXY.y <= yRange.end) {
						nodesIdInDrawing.push(curNode.id);
				}
			}
			network.selectNodes(nodesIdInDrawing);
		},
		_workflowAddStage : function(nodeData,callback){
			$("#stageNameInput").val("");
			document.getElementById('stageNameDone').onclick = listOfMethods._saveNodeData.bind(this, nodeData, callback);
			document.getElementById('stageNameCancel').onclick = listOfMethods._cancelNodeEdit.bind(callback);
			var curNode = nodeData;
			var nodeXY = network.canvasToDOM({
				x : nodeData.x,
				y : nodeData.y
			});
            var menuItem = $('#box'); //get the needed div
            var imgLeft = nodeXY.x+60;
            var imgTop = nodeXY.y+415;
            menuItem.css({
                position : 'absolute',
                top : imgTop,
                left : imgLeft
            });
            menuItem.show();
            $("#stageNameInput").focus();
        },
        _workflowAddConnection : function(edgeData,callback){
                var checkGroupNameForFrom = network.body.data.nodes["_data"][edgeData.from]["group"];
                var checkGroupNameForTo = network.body.data.nodes["_data"][edgeData.to]["group"];

                if (checkGroupNameForFrom === "EndEvent") {
                        showMessage(errorTitle, add_stage_after_last_error_message, errorType);
                    callback(null);
                    $("#proertyComponentId").val('');
                    $('#box').hide();

                } else {
                    listOfMethods._addConnection(edgeData, callback);
                }

        },
        _addConnection : function (edgeData, callback) {
            $.ajax({
                type : "POST",
                url: getContextPath() + "/app/WorkflowEditor/addConnectionBPMN",
                data : {
                    "processDefinitionKey" : $("#processDefinitionKey option:selected").val(),
                    "from" : edgeData.from,
                    "to" : edgeData.to,
                    "workflowConfigTypeId" : $("#workflowConfigType").val()
                },
                async : false,
                success: function(result){
                  edgeData.id=result;
                  callback(edgeData);
                  $("#proertyComponentId").val('');
                  $('#box').hide();
                },
                error: function(){
                    new PNotify({
                        title : 'Error',
                        text : 'Some error occurred',
                        type : 'error',
                        pnotify_animate_speed : .8,
                        opacity : 1
                    });
                    callback(null);
                    $("#proertyComponentId").val('');
                    $('#box').hide();
                }
            });
        },
        _workflowDeleteConnection : function(edgeData,callback){
             var edgeId = edgeData.edges[0];
             //var checkGroupNameForFrom = network.body.data.nodes["_data"][edgeFrom]["group"];
             //var checkGroupNameForTo = network.body.data.nodes["_data"][edgeTo]["group"];

             listOfMethods._deleteConnectionRequest(edgeId, callback, edgeData);
             /*if (checkGroupNameForFrom === "endEvent"
                || checkGroupNameForTo === "endEvent") {
                showMessage(errorTitle, last_stage_connection_delete_error_message, errorType);
                callback(null);
             } else {
                listOfMethods._deleteConnectionRequest(edgeFrom, edgeTo, callback, edgeData);
             }*/
        },
        _deleteConnectionRequest : function(edgeId, callback, edgeData) {

          $.ajax({
                type : "GET",
                url: getContextPath() + "/app/WorkflowEditor/deleteComponent",
                data : {
                    "id" : edgeId,
                    "workflowConfigTypeId" : $("#workflowConfigType").val()
                },
                async : false,
                success: function(result){
                    if(!result){
                        showMessage(errorTitle, edge_cannot_delete_error_message, errorType);
                        callback(null);
                        $("#proertyComponentId").val('');
                        $('#box').hide();
                    } else {
                        callback(edgeData);
                        $("#proertyComponentId").val('');
                        $('#box').hide();
                    }
                },
                error: function(){
                    showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                    callback(null);
                    $("#proertyComponentId").val('');
                    $('#box').hide();
                }
            });
        },
        _workflowDeleteStage : function(nodeData,callback){
            var nodeId = nodeData.nodes[0];
            var nodeConnections = network.getConnectedEdges(nodeId);
            var nodeGroup = network.body.data.nodes["_data"][nodeId]["group"];
            if(nodeConnections.length > 0) {
                showMessage(errorTitle, hanging_state_error_message, errorType);
                callback(null);
                $("#proertyComponentId").val('');
                $('#box').hide();

            } else if(nodeGroup == ('StartEvent' || 'EndEvent')){
                showMessage(errorTitle, start_and_end_event_cannot_be_deleted, errorType);
                callback(null);
                $("#proertyComponentId").val('');
                $('#box').hide();
            } else {

                $.ajax({
                    type : "GET",
                    url: getContextPath() + "/app/WorkflowEditor/deleteComponent",
                    data : {
                        "id" : nodeId,
                        "workflowConfigTypeId" : $("#workflowConfigType").val()
                    },
                    async : false,
                    success: function(result){
                        if(!result){
                            showMessage(errorTitle, stage_cannot_delete_error_message, errorType);
                            callback(null);
                        } else {
                            callback(nodeData);
                            $("#processingStageConfigDiv"+nodeId).remove();
                        }
                        $("#proertyComponentId").val('');
                        $('#box').hide();
                    },
                    error: function(){
                        showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                        callback(null);
                        $("#proertyComponentId").val('');
                        $('#box').hide();
                    }
                });

            }
        },
        _saveEdgeData : function(edgeData, callback) {
           var gatewayExpression = $("#gatewayExpressionInput").val();

           if(gatewayExpression == "") {
                showMessage(errorTitle, gateway_exp_not_empty, errorType);
                return;
           }

           if(!validateServiceTaskExpression(gatewayExpression.trim())) {
                showMessage(errorTitle, gateway_expression_invalid, errorType);
                return;
           }
            listOfMethods._addConnection(edgeData, callback, gatewayExpression);
        },
        _cancelEdgeEdit : function(callback) {
              listOfMethods._clearEdgePopUp();
              callback(null);
              $("#proertyComponentId").val('');
              $('#box').hide();
        },
        _saveNodeData : function(nodeData, callback) {
            var workflowConfigId = $("#workflowConfig").val();
            var characterRegex = new RegExp('^[a-zA-Z," "]+$');
            var alphaNumericRegex = new RegExp('^[a-zA-Z0-9," ","_"]+$');
            if($("#stageRadio").prop("checked")) {
                var processingStageId = $("#processingStage").val();
                var stageName = $("#stageNameInput").val();
                if(stageName==""){
                    showMessage(errorTitle, stage_name_blank_error_message, errorType);
                    return;
                } else if(!characterRegex.test(stageName)){
                    showMessage(errorTitle, stage_name_error_message, errorType);
                    return;
                } else {
                    var stageCode = stageName.replace(/ /g,"_");
                    stageCode = stageCode.toLowerCase();
                    var nodeId = 'cas_'+ stageCode +'_sub_process';
                    var serviceTaskNodeId = stageCode + '_dynamic_service_task';
                    var newNode = data.nodes["_data"][nodeId];
                    var newServiceTaskNode = data.nodes["_data"][serviceTaskNodeId];
                    if(newNode != undefined){
                        showMessage(errorTitle, name_already_exist_error_message, errorType);
                        return;
                    }
                    if(newServiceTaskNode != undefined){
                        showMessage(errorTitle, name_already_exist_error_message, errorType);
                        return;
                    }
                    if($("#cloneExistingStage").is(":checked")){
                        if(processingStageId=="" || workflowConfigId==""){
                            showMessage(errorTitle, cloning_stage_blank_error_message, errorType);
                            return;
                        }
                        nodeData.label = stageName;
                        nodeData.id = nodeId;
                        nodeData.group = 'humanStage';
                        $.ajax({
                            type : "POST",
                            url: getContextPath() + "/app/WorkflowEditor/cloneWorkflowStage",
                            data : {
                                "processDefinitionKey" : $("#processDefinitionKey option:selected").val(),
                                "processingStageId" : processingStageId,
                                "workflowConfigId" : workflowConfigId,
                                "workflowEditorId" : $("#workflowEditorId").val(),
                                "workflowConfigTypeId" : $("#workflowConfigType").val(),
                                "stageName" : stageName,
                                "stageId" : nodeData.id
                            },
                            async : false,
                            success: function(result){
                                if(result){
                                    showMessage(errorTitle, name_already_exist_error_message, errorType);
                                }
                                else{
                                    listOfMethods._clearNodePopUp();
                                    callback(nodeData);
                                }
                                $("#proertyComponentId").val('');
                                $('#box').hide();
                            },
                            error: function(){
                                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                            }
                        });
                    }
                    else{
                        nodeData.label = stageName;
                        var stageCode = stageName.replace(/ /g,"_").toLowerCase();
                        nodeData.id = 'cas_'+ stageCode +'_sub_process';
                        nodeData.group = 'humanStage';
                        $.ajax({
                            type : "POST",
                            url: getContextPath() + "/app/WorkflowEditor/createNewWorkflowStage",
                            data : {
                                "processDefinitionKey" : $("#processDefinitionKey option:selected").val(),
                                "stageName" : stageName,
                                "stageId" : nodeData.id,
                                "workflowEditorId" : $("#workflowEditorId").val(),
                                "workflowConfigTypeId" : $("#workflowConfigType").val()
                            },
                            async : false,
                            success: function(result){
                                if(result){
                                    showMessage(errorTitle, name_already_exist_error_message, errorType);
                                }
                                else{
                                    listOfMethods._clearNodePopUp();
                                    callback(nodeData);
                                    $("#proertyComponentId").val('');
                                    $('#box').hide();
                                }
                            },
                            error: function(){
                                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                            }
                        });
                    }
                }
            } else if ($("#serviceTaskRadio").prop("checked")) {
                var serviceTaskName = $("#serviceTaskNameInput").val();
                var isAsync = $("#isExecuteAsync").is(":checked");
                var eventCode = $("#eventCode").val();
                var serviceTaskExpression="";
                var nodeId = serviceTaskName.replace(/ /g,"_").toLowerCase() + "_dynamic_service_task";
                var nodeStageId = 'cas_'+ serviceTaskName.replace(/ /g,"_").toLowerCase() +'_sub_process';
                var newStageNode = data.nodes["_data"][nodeStageId];
                var newNode = data.nodes["_data"][nodeId];
                var group = 'humanStage';

                if($("#existingServiceTaskExpRadio").prop("checked")) {
                    eventCode = "";
                    serviceTaskExpression = $("#serviceTaskExpInput").val();
                    group = 'serviceTask';
                }

                if(!$("#existingServiceTaskExpRadio").prop("checked") && eventCode != "" && !alphaNumericRegex.test(eventCode)) {
                    showMessage(errorTitle, service_task_invalid_event_code_error_message, errorType);
                    return;
                }

                if(newNode != undefined){
                    showMessage(errorTitle, name_already_exist_error_message, errorType);
                    return;
                }
                if(newStageNode != undefined){
                    showMessage(errorTitle, name_already_exist_error_message, errorType);
                    return;
                }

                if(serviceTaskName ==="") {
                    showMessage(errorTitle, service_task_name_not_empty, errorType);
                    return;
                }

                if(!alphaNumericRegex.test(serviceTaskName)) {
                    showMessage(errorTitle, service_task_name_invalid_error_message, errorType);
                    return;
                }

                if($("#existingServiceTaskExpRadio").prop("checked") && serviceTaskExpression ==="") {
                    showMessage(errorTitle, service_task_exp_not_empty, errorType);
                    return;
                }
                if($("#existingServiceTaskExpRadio").prop("checked") && !validateServiceTaskExpression(serviceTaskExpression.trim())) {
                    showMessage(errorTitle, service_task_expression_invalid, errorType);
                    return;
                }

                nodeData.label = serviceTaskName;
                nodeData.id = nodeId;
                nodeData.group = group;

                $.ajax({
                    type : "POST",
                    url: getContextPath() + "/app/WorkflowEditor/serviceTask",
                    async : false,
                    data : {
                        "serviceTaskName" : serviceTaskName,
                        "processDefinitionKey" : $("#processDefinitionKey option:selected").val(),
                        "serviceTaskExpression" : serviceTaskExpression,
                        "workflowEditorId" : $("#workflowEditorId").val(),
                        "isAsync" : isAsync,
                        "eventCode" : eventCode,
                        "workflowConfigTypeId" : $("#workflowConfigType").val()
                    },
                    success: function(result){
                            if(!result){
                                showMessage(errorTitle, name_already_exist_error_message, errorType);
                            } else{
                                listOfMethods._clearNodePopUp();
                                callback(nodeData);
                                $("#proertyComponentId").val('');
                                $('#box').hide();
                            }
                    },
                    error: function(){
                        showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                    }
                });
            } else if($("#exclusiveGatewayRadio").prop("checked")) {
                    var gatewayName = "Exclusive Gateway";
                    var gatewayType = "exclusiveGateway";
                    var nodeId = gatewayName.replace(/ /g,"_").toLowerCase();
                    nodeData.label = gatewayName;

                    nodeData.group = 'gateway';
                    $.ajax({
                            type : "POST",
                            url: getContextPath() + "/app/WorkflowEditor/gateway",
                            async : false,
                            data : {
                                "gatewayName" : gatewayName,
                                "gatewayType" : gatewayType,
                                "workflowEditorId" : $("#workflowEditorId").val(),
                                "workflowConfigTypeId" : $("#workflowConfigType").val()
                            },
                            success: function(result){
                                    nodeData.id = result.id;
                                    listOfMethods._clearNodePopUp();
                                    callback(nodeData);
                                    $("#proertyComponentId").val('');
                                    $('#box').hide();
                            },
                            error: function(){
                                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                            }
                        });
            } else if($("#inclusiveGatewayRadio").prop("checked")) {

                    var gatewayName = "Inclusive Gateway";
                    var gatewayType = "inclusiveGateway";
                    var nodeId = gatewayName.replace(/ /g,"_").toLowerCase();
                    nodeData.label = gatewayName;

                    nodeData.group = 'gateway';
                    $.ajax({
                            type : "POST",
                            url: getContextPath() + "/app/WorkflowEditor/gateway",
                            async : false,
                            data : {
                                "gatewayName" : gatewayName,
                                "gatewayType" : gatewayType,
                                "workflowEditorId" : $("#workflowEditorId").val(),
                                "workflowConfigTypeId" : $("#workflowConfigType").val()
                            },
                            success: function(result){
                                    nodeData.id = result.id;
                                    listOfMethods._clearNodePopUp();
                                    callback(nodeData);
                                    $("#proertyComponentId").val('');
                                    $('#box').hide();
                            },
                            error: function(){
                                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                            }
                        });
            } else if($("#parallelGatewayRadio").prop("checked")) {
                var gatewayName = "Parallel Gateway";
                var gatewayType = "parallelGateway";
                var nodeId = gatewayName.replace(/ /g,"_").toLowerCase();
                nodeData.label = gatewayName;
                nodeData.group = 'gateway';
                $.ajax({
                        type : "POST",
                        url: getContextPath() + "/app/WorkflowEditor/gateway",
                        async : false,
                        data : {
                            "gatewayName" : gatewayName,
                            "gatewayType" : gatewayType,
                            "workflowEditorId" : $("#workflowEditorId").val(),
                            "workflowConfigTypeId" : $("#workflowConfigType").val()
                        },
                        success: function(result){
                                nodeData.id = result.id;
                                listOfMethods._clearNodePopUp();
                                callback(nodeData);
                                $("#proertyComponentId").val('');
                                $('#box').hide();
                        },
                        error: function(){
                            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
                        }
                    });
            } else {
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }

        },
        _cancelNodeEdit : function(callback) {
            listOfMethods._clearNodePopUp();
        },
        _clearEdgePopUp : function() {
            document.getElementById('gatewayExpDone').onclick = null;
            document.getElementById('gatewayExpCancel').onclick = null;
            $("#gatewayExpressionInput").val("");
            $('#gatewayExpressionBox').hide();
        },
        _clearNodePopUp : function() {
            document.getElementById('stageNameDone').onclick = null;
            document.getElementById('stageNameCancel').onclick = null;
            $("#content_workflowConfig").find('input').val("");
            $("#content_processingStage").find('input').val("");
            $("#stageNameInput").val("");
            $("#Text_processingStage").prop("disabled","disabled");
            $("#Text_processingStage").prop("readonly","readonly");
            $("#cloneExistingStage").prop("checked",false);
            $("#serviceTaskRadio").prop("checked",false);
            $("#stageRadio").prop("checked",true);
            $("#eventCode").val("");
            $('#newStageBox').show();
            $("#newServiceTask").hide();
            $('#existingStageBox').hide();
            $("#serviceTaskExpInput").val("");
            $("#serviceTaskNameInput").val("");
            $('#box').hide();
        },
        _showMenuForNode : function(elementId, x, y){
            listOfMethods._showMenuItem(x, y);
            nodeGroup = data.nodes["_data"][elementId]["group"];
            if(nodeGroup == 'CallActivity'){
                $(".configurationButtonDiv").show();
            } else{
                $(".configurationButtonDiv").hide();
            }
            $("#proertyComponentId").val(elementId);
        },
        _showMenuForEdge : function(elementId, x, y){
            listOfMethods._showMenuItem(x, y);
            $(".configurationButtonDiv").hide();
            $("#proertyComponentId").val(elementId);
        },
        _showMenuItem : function(x, y){
            var menuItem = $('#box');
            menuItem.css({
              position : 'absolute',
              top : y,
              left : x,
              'z-index' : '100000'
            });
            menuItem.show();
        },
        _bindFunction : function(){
            container.on("mousemove", function(e) {
                if (drag) {
                    listOfMethods._restoreDrawingSurface();
                    rect.w = (e.pageX - this.offsetLeft)
                    - rect.startX;
                    rect.h = (e.pageY - this.offsetTop)
                    - rect.startY;

                    ctx.setLineDash([ 5 ]);
                    ctx.strokeStyle = "rgb(0, 102, 0)";
                    ctx.strokeRect(rect.startX, rect.startY,
                        rect.w, rect.h);
                    ctx.setLineDash([]);
                    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                    ctx.fillRect(rect.startX, rect.startY,
                        rect.w, rect.h);
                }
            });
            container.on("mousedown", function(e) {
                if (e.button == 2) {
                    selectedNodes = e.ctrlKey ? network
                    .getSelectedNodes() : null;
                    listOfMethods._saveDrawingSurface();
                    var that = this;
                    rect.startX = e.pageX - this.offsetLeft;
                    rect.startY = e.pageY - this.offsetTop;
                    drag = true;
                    container[0].style.cursor = "crosshair";
                }
            });
            container.on("mouseup", function(e) {
                if (e.button == 2) {
                    listOfMethods._restoreDrawingSurface();
                    drag = false;

                    container[0].style.cursor = "default";
                    listOfMethods._selectNodesFromHighlight();
                }
            });
            document.body.oncontextmenu = function() {
                return false;
            };
            network.on("select",function(e) {
              var elementId;
              var x;
              var y;
              var elementFound = false;
              var isNodeSelected = false;
              var isEdgeSelected = false;
              if(e.nodes.length > 0){
                  elementId = e.nodes[0];
                  elementFound = true;
                  x = e.event.pointers[0].pageX;
                  y = e.event.pointers[0].pageY;
                  isNodeSelected = true;
                  isEdgeSelected = false;
              } else if(e.edges.length > 0){
                  elementId = e.edges[0];
                  elementFound = true;
                  x = e.event.pointers[0].pageX;
                  y = e.event.pointers[0].pageY;
                  isEdgeSelected = true;
                  isNodeSelected = false;
              } else{
                  $("#proertyComponentId").val('');
                  $('#box').hide();
              }
               if(elementFound){
                  if(isNodeSelected){
                      listOfMethods._showMenuForNode(elementId, x, y);
                  } else if(isEdgeSelected){
                      listOfMethods._showMenuForEdge(elementId, x, y);
                  }
               } else{
                  $("#proertyComponentId").val('');
                  $('#box').hide();
               }
            });
        },
        init : function(){
            listOfMethods._bindFunction();
        }
    };
    var listOfMethods=this.methods;
    listOfMethods.init();
    return this;
};
}( jQuery ));