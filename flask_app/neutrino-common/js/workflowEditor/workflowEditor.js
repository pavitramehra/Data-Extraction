var graphData;
var data;
var masterID;
var nodeLabel;
var networkData = {};
var currentStageId;
var processingStageIndex=0;
var view;
var errorType = "error";
var warningType = "warning";
var successType = "success";
var errorTitle = "Error";
var warningTitle = "Warning";
var successTitle = "Success";
var currentVersion;
var workflowTypeSomeServiceTask = "Some_servicetask";
var rightSide = "right";
var leftSide = "left";
var defaultComparisionSide = "";
var newVersion;
var baseVersion;
var fitOnceCalled = false;

$(document).ready(function() {

    if(showFullScreen == "true"){
        $("#workFlowProperty_anchor").click();
        $(".fullScreenPanel").click();
    }
    currentVersion = $("#currentVersion").val();
    openMainAccordion();
    view = $("#viewMode").val();
    if(view){
        $("#downloadBpmn").prop('disabled','disabled');
    }
    masterID = $("#masterID").val();
    var selectedVersion = $("#currentVersion").val();
    var selectedType = getCurrentSelectedType();
    var processDefinitionKey = $("#processDefinitionKey option:selected").val();
    prepareNetworkGraph(processDefinitionKey, selectedVersion, selectedType, defaultComparisionSide, "network", "networkDiv");
    $("#loadWorkflowNetwork").on("click", function(){
        //when main accordion is open and sub-accordion is close
        if(!$(this).hasClass('collapsed') && $("#loadWorkflowSubNetwork").hasClass('collapsed')){
            //close main accordion
            closeMainAccordion();
        }
        //when main accordion is close and sub-accordion is open
        else if($(this).hasClass('collapsed') && !$("#loadWorkflowSubNetwork").hasClass('collapsed')){
            //open main accordion and close sub accordion
            openMainAccordion();
            closeSubAccordion();
        }
        //when main accordion is close and sub-accordion is close
        else if($(this).hasClass('collapsed') && $("#loadWorkflowSubNetwork").hasClass('collapsed')){
            //open main accordion
            openMainAccordion();
        } else{
            closeMainAccordion();
        }
    });
    $("#loadWorkflowSubNetwork").on("click", function(){
        //when main accordion is open and sub-accordion is close
        if($(this).hasClass('collapsed') && !$("#loadWorkflowNetwork").hasClass('collapsed')){
            //open sub accordion and close main accordion
            openSubAccordion();
            closeMainAccordion();
        }
        //when main accordion is close and sub-accordion is open
        else if(!$(this).hasClass('collapsed') && $("#loadWorkflowNetwork").hasClass('collapsed')){
            //close sub accordion
            closeSubAccordion();
        }
        //when main accordion is close and sub-accordion is close
        else if($(this).hasClass('collapsed') && $("#loadWorkflowNetwork").hasClass('collapsed')){
            //open sub accordion
            openSubAccordion();
        } else{
            closeSubAccordion();
        }
    });
    $("#downloadBpmn").on("click", function(){

            var contextPath = getContextPath();
            var workflowConfigTypeId = $("#workflowConfigType").val();
            var url = contextPath + "/app/WorkflowEditor/downloadBPMN/"+ workflowConfigTypeId;
            neutrinoNavigateTo(url);
    });
    $("#cloneExistingStage").on("click", function(){
        if($(this).is(":checked")){
            $("#existingStageBox").show();
            $("#Text_workflowConfig").focus();
        }
        else{
            $("#existingStageBox").hide();
            $("#stageNameInput").focus();
        }
    });

    $("#currentVersion").on("change", function(){
        if($(this).val() == currentVersion){
            $("#showWorkflowImagePopup").show();
        } else{
            $("#showWorkflowImagePopup").hide();
        }
        var selectedVersion = $("#currentVersion").val();
        var selectedType = getCurrentSelectedType();
        var processDefinitionKey = $("#processDefinitionKey option:selected").val();
        prepareNetworkGraph(processDefinitionKey, selectedVersion, selectedType, defaultComparisionSide, "network", "networkDiv");
    });

    $(document).on('click','.deleteTableRow',function(e) {
        $(this).parent('td').parent('tr').remove();
    });
    $(document).on('click','.addTableRow',function(e) {
        var id = $(this).attr('id');
        id = id.replace('anchor_','');
        var tagId = id.split('_');
        addNewRowInTable(tagId);
    });

    $("#stageRadio").on("click", function(){
        showStageInfo();
    });

    $("#serviceTaskRadio").on("click", function(){
        showServiceTaskInfo();
    });

    $("#existingServiceTaskExpRadio").on("click", function(){
        showExistingServiceDiv();
    });

    $("#exclusiveGatewayRadio").on("click", function(){
        showExclusiveGatewayInfo();
    });

    $("#inclusiveGatewayRadio").on("click", function(){
        showInclusiveGatewayInfo();
    });

    $("#parallelGatewayRadio").on("click", function(){
        showParallelGatewayInfo();
    });

    $("#newServiceTaskExpRadio").on("click", function(){
        showNewServiceDiv();
    });
    $("#closePropertyPanel, #propertyCancel").click(function(){
        $('#propertyPanelDiv').modal('hide');
    });
    $("#propertyDone").click(function(){
        submitPropertyDetails();
    });

    $("#versionLeftSelect_chosen .chosen-drop").css("z-index","99999");
    $("#versionRightSelect_chosen .chosen-drop").css("z-index","99999");

});

function loadSubNetworkWorkflow(currentStageId) {
    loadDetails(currentStageId);
    $("#loadWorkflowNetwork").click();
    $("#loadWorkflowSubNetwork").click();
}

function openSubAccordion(){
    $("#loadWorkflowSubNetwork").removeClass('collapsed');
    $("#sub_network_body").removeClass('collapse');
}
function closeSubAccordion(){
    $("#loadWorkflowSubNetwork").addClass('collapsed');
    $("#sub_network_body").addClass('collapse');
}
function openMainAccordion(){
    $("#loadWorkflowNetwork").removeClass('collapsed');
    $("#network_body").removeClass('collapse');
}
function closeMainAccordion(){
    $("#loadWorkflowNetwork").addClass('collapsed');
    $("#network_body").addClass('collapse');
}

function loadDetails(currentStageId){
    if($("#processingStageConfigDiv"+currentStageId).html() == null){
        var contextPath = getContextPath();
        var stageName = nodeLabel;
        var workflowUrl=contextPath + "/app/WorkflowEditor/loadProcessingStageConfig/"+$("#workflowEditorId").val();
        $.ajax({
            url: workflowUrl,
            data : {
                "stageName" : stageName,
                "stageId" : currentStageId,
                "viewMode" : view,
                "isDynamic" : isDynamic,
                "isSubProcess" : isSubProcess,
                "workflowConfigTypeId" : $("#workflowConfigType").val()
            },
            success: function(result){
                $("#stageDetails_body").append("<div class='processingStageConfigDiv' id='processingStageConfigDiv" +currentStageId+ "'></div>");
                $("#processingStageConfigDiv" + currentStageId).html(result);
                $("#stageIndex_"+currentStageId).val(processingStageIndex);
                processingStageIndex++;
                var stageIndex = $("#stageIndex_"+currentStageId).val();
                prepareTabDataName(stageIndex);
            },error: function(){
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
        });
    }
    openCurrentStageDiv(currentStageId);
}

function openCurrentStageDiv(currentStageId){
    $(".processingStageConfigDiv").hide();
    $("#processingStageConfigDiv"+currentStageId).show();
}

function prepareTabDataName(stageIndex){
    //Task Property
    $("#priority_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.taskConfig.levelConfig.priority");
    $("#hidden_expectedTotalTime_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.taskConfig.expectedTotalTime");
    $("#hidden_tatMillis_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.taskConfig.levelConfig.tatMillis");
    $("#noOfDaysToAutoCancelInActiveApp_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.taskConfig.levelConfig.noOfDaysToAutoCancelInActiveApp");
    $("#autoAssignment_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.taskConfig.autoAssignment");
    $("#snapshotEnabled_"+currentStageId).prop("name","processingStages["+stageIndex+"].stageSnapshotEnabled");
    $("#processingStageId_"+currentStageId).prop("name","processingStages["+stageIndex+"].id");
    $("#defaultStageId_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.id");
    $("#isUserTask_"+currentStageId).prop("name","processingStages["+stageIndex+"].isUserTask");
    //Stage Configurations
    $("#processingStageName_"+currentStageId).prop("name","processingStages["+stageIndex+"].processingStageType.id");
    $("#processingStageGroupName_"+currentStageId).prop("name","processingStages["+stageIndex+"].processingStageGroup.id");
    $("#stageDisplayName_"+currentStageId).prop("name","processingStages["+stageIndex+"].stageDisplayName");
    $("#autoComplete_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.autoCompletionEnabled");
    $("#systemState_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.stage.id");
    $("#beanName_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.serviceTaskConfig.beanName");
    $("#methodName_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.serviceTaskConfig.methodName");
    $("#hiddenMethodName_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.serviceTaskConfig.methodName");
    $("#dependencyTimer_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.serviceTaskConfig.dependencyTimer");
    $("#isDependent_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.serviceTaskConfig.dependent");
    //Rules
    $("#completionRuleInvocationPoint_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.completionRuleInvocationPoint");
    $("#exitRuleInvocationPoint_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.exitRuleInvocationPoint");
    $("#routingRuleInvocationPoint_"+currentStageId).prop("name","processingStages["+stageIndex+"].defaultStage.routingRuleInvocationPoint");
    //Miscellaneous
    $("#enquiryRole_"+currentStageId).prop("name","processingStages["+stageIndex+"].roleArr");
    $("#stageSendBack_"+currentStageId).prop("name","processingStages["+stageIndex+"].stageSendBack");
    $("#stageEvent_"+currentStageId).prop("name","processingStages["+stageIndex+"].stageEvent");
    $("#moveToNextStageAllowed_"+currentStageId).prop("name","processingStages["+stageIndex+"].isMoveToNextStageAllowed");
    $("#updateAllowed_"+currentStageId).prop("name","processingStages["+stageIndex+"].isUpdateAllowed");
	$("#stageChecklistButton_"+currentStageId).prop("name","processingStages["+stageIndex+"].stageChecklistButton");
    $("#Text_productType_"+currentStageId).prop("name","processingStages["+stageIndex+"].productType");
    //Split Screen
    if($("#checkbox_split_screen_"+currentStageId).is(':checked')){
        $("#split_screen_sub_parts_"+currentStageId).show();
    }
    $("#checkbox_split_screen_"+currentStageId).prop("name","processingStages["+stageIndex+"].splitScreenEnabled");
    $("#split_screen_sub_parts_"+currentStageId).find("input").each(function(){
        var checkBoxName = $(this).prop("name");
        $(this).prop("name", "processingStages["+stageIndex+"]."+checkBoxName);
    });
    //Form Configurations
    var i=0;
    var j=0;
    var disableActiveTab = false;
    var stageCode = $("#stageCode_"+currentStageId).val();
    $("#formconfig-data-tbody_"+currentStageId + " tr").each(function(){
        if($("#checkbox_select_"+ currentStageId +"_"+i).is(':checked')){
            var isEditableFromFrontEnd = $("#editableFromFrontEnd_"+ currentStageId +"_"+i).val();
            if(isEditableFromFrontEnd=="false" && !disableActiveTab) {
                disableActiveTab = prepareDummyTableRow(stageIndex, currentStageId, i, j, false, isEditableFromFrontEnd);
            } else {
                prepareDummyTableRow(stageIndex, currentStageId, i, j, false, isEditableFromFrontEnd);
            }
            j++;
        }
        i++;
    });

    if(disableActiveTab) {
        $("input[id^='formConfigActiveCheckbox"+ currentStageId +"']").prop("disabled","disabled");
    }

    i=0;
    j=0;
    var formTable = $('#formconfig-data-table2_'+currentStageId).DataTable({"aaSorting": [[ 3, 'desc' ]]});
    $('#formconfig-data-table2_'+currentStageId + '_filter').find("input").on("keyup change", function(){
        formTable.columns( 2 )
                         .search( $(this).val() )
                         .draw();
    });
    $("#dynamicFormconfig-data-tbody_"+currentStageId + " tr").each(function(){
        if($("#dynamic_checkbox_select_"+ currentStageId +"_"+i).is(':checked')){
            prepareDynamicDummyTableRow(stageIndex, currentStageId, i, j, false);
            j++;
        }
        i++;
    });
    var dynamicFormTable = $('#dynamicFormconfig-data-table2_'+currentStageId).DataTable({"aaSorting": [[ 3, 'desc' ]]});
    $('#dynamicFormconfig-data-table2_'+currentStageId + '_filter').find("input").on("keyup change", function(){
        dynamicFormTable.columns( 2 ).search( $(this).val() ).draw();
    });
}

$("#showWithServiceTask,#showFullWorkflow").on("click", function(){
    var selectedVersion = $("#currentVersion").val();
    var selectedType = getCurrentSelectedType();
    var processDefinitionKey = $("#processDefinitionKey option:selected").val();
    prepareNetworkGraph(processDefinitionKey, selectedVersion, selectedType, defaultComparisionSide, "network", "networkDiv");
    $("#subNetworkMain").hide();
});

function prepareNetworkGraph(processDefinitionKey, selectedVersion, selectedType, comparisonSide, networkDivId, networkDivClass){
    var clickToUseFlag = true;
    if(!view && selectedVersion == currentVersion && comparisonSide=="" && selectedType == "Some_servicetask") {
        $("#paletteConfig").show();
        $("#fullScreenPanelDiv").show();
    } else{
        $("#paletteConfig").hide();
        $("#fullScreenPanelDiv").hide();
    }
    if(comparisonSide!=""){
        clickToUseFlag = false;
    }
    if($("#network_"+networkDivClass +"_"+selectedType+"_"+selectedVersion).html() == null){
        var contextPath = getContextPath();
        var manipulationEnabled;
        var randomSeed;
        $.ajax({
            type : "POST",
            url: contextPath + "/app/WorkflowEditor/getNetworkData",
            data : {
                "processDefinitionKey" : processDefinitionKey,
                "selectedVersion" : selectedVersion,
                "selectedType" : selectedType,
                "currentVersion" : currentVersion,
                "isDynamic" : isDynamic
            },
            async : false,
            success: function(data){
                graphData = JSON.parse(data);
            },error: function(){
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
        });

        if(selectedType == "Human_stages"){
            manipulationEnabled = false;
            randomSeed = 781703;
        }
        else if(selectedType == "Full_workflow"){
            manipulationEnabled = false;
            randomSeed = 459632;
        }
        else if(selectedType == "Some_servicetask"){
            if(view){
                manipulationEnabled = false;
            } else {
                if(selectedVersion == currentVersion && comparisonSide=="") {
                    manipulationEnabled = true;
                    $("#paletteConfig .button-accordion-container :first-child").first('a').trigger('click');
                } else {
                    manipulationEnabled = false;
                }
            }
            randomSeed = 137231;
        }

        $("#"+networkDivId).append("<div class='"+networkDivClass+ "' id='network_" +networkDivClass +"_"+ selectedType+"_"+selectedVersion + "'></div>");
        $("#network_"+networkDivClass +"_"+selectedType+"_"+selectedVersion).drawWorkflow({
            graphDataInternal : graphData,
            manipulationEnabled : manipulationEnabled,
            randomSeed : randomSeed,
            version : selectedVersion,
            graphType : selectedType,
            comparison : comparisonSide,
            clickToUseFlag : clickToUseFlag
        });
    }

    $("."+networkDivClass).hide();
    $("#network_"+networkDivClass +"_"+selectedType+"_"+selectedVersion).show();
}

function saveForm(){
    var contextPath = getContextPath();
    var saveUrl = contextPath+"/app/"+masterID+"/save";
    saveWorkflowEditorForm(saveUrl);
}
function saveAndSendForApproval(){
    var contextPath = getContextPath();
    var saveUrl = contextPath+"/app/"+masterID+"/saveAndSendForApproval";
    saveWorkflowEditorForm(saveUrl);
}

function saveWorkflowEditorForm(saveUrl){
    if(currentVersion == $("#currentVersion").val()){
        var network = eval("networkData.network_" + workflowTypeSomeServiceTask + currentVersion);
        if(network != null && !validateWorkflow(network)) {
            return;
        }
    }
    var contextPath = getContextPath();
    var formTemp = $('#masterForm');
    removeMandatoryClass();
    if(!formTemp.valid()){
        return;
    }
    addMandatoryClass();
    var noSeqMatch = true;
    var activeCorrect = true;
    $("table[id^='dummyFormConfigTable_']").each(function(){
        var tableId = $(this).prop('id');
        var stageId = tableId.replace("dummyFormConfigTable_","");
        var table = $(this).DataTable();
        table.destroy();
        var nodeLab = stageId.replace(/_/g," ");
        var noMatch=true;
        var tabSeqArray=[];
        $(this).find("input[id^='formConfigOrderDummy"+ stageId +"']").each(function(){
            var tabSeq = $(this).val();
            if(tabSeq=="" || $(this).hasClass('error-tab-seq') || ($.inArray(tabSeq, tabSeqArray) > -1)){
                noMatch = false;
                return noMatch;
            }
            else{
                tabSeqArray.push(tabSeq);
            }
        });
        if(!noMatch){
            var message = tab_sequence_incorrect + " " + nodeLab + " " + form_settings;
            showMessage(errorTitle, message, errorType);
            $(this).DataTable({"aaSorting": [] });
            noSeqMatch=false;
            return noSeqMatch;
        }
        if($(this).find('tbody tr td').length > 1){
            var activeCheckLen = $(this).find("input[id^='formConfigActiveCheckbox"+stageId+"']:checked").length;
            if(activeCheckLen!=1){
                var message = first_active_tab_incorrect + " " + nodeLab + " " + form_settings;
                showMessage(errorTitle, message, errorType);
                $(this).DataTable({"aaSorting": [] });
                activeCorrect=false;
                return activeCorrect;
            }
        }

    });
    $("table[id^='dummyDynamicFormConfigTable_']").each(function(){
        var tableId = $(this).prop('id');
        var stageId = tableId.replace("dummyDynamicFormConfigTable_","");
        var table = $(this).DataTable();
        table.destroy();
        var nodeLab = stageId.replace(/_/g," ");
        var noMatch=true;
        var dynamicTabSeqArray=[];
        $("#dummyDynamicFormConfigTable_"+stageId).find("input[id^='dynamicFormConfigOrderDummy"+ stageId +"']").each(function(){
            var tabSeq = $(this).val();
            if(tabSeq=="" || $(this).hasClass('error-tab-seq') || ($.inArray(tabSeq, dynamicTabSeqArray) > -1)){
                noMatch = false;
                return noMatch;
            }
            else{
                dynamicTabSeqArray.push(tabSeq);
            }
        });
        if(!noMatch){
            var message = tab_sequence_incorrect + " " + nodeLab + " " + form_settings;
            showMessage(errorTitle, message, errorType);
            $(this).DataTable({"aaSorting": [] });
            noSeqMatch=false;
            return noSeqMatch;
        }
    });
    if(!noSeqMatch || !activeCorrect){
        $("table[id^='dummyFormConfigTable_']").each(function(){
            var tableId = $(this).prop('id');
            $(this).DataTable().destroy();
            var dummyFormTable = $(this).DataTable({"aaSorting": [] });
            $('#' + tableId + '_filter').find("input").on("keyup change", function(){
                dummyFormTable.search($(this).val()).draw();
            });
        });
        $("table[id^='dummyDynamicFormConfigTable_']").each(function(){
            var tableId = $(this).prop('id');
            $(this).DataTable().destroy();
            var dummyDynamicFormTable = $(this).DataTable({"aaSorting": [] });
            $('#' + tableId + '_filter').find("input").on("keyup change", function(){
                dummyDynamicFormTable.search($(this).val()).draw();
            });
        });
        return;
    }
    $("table[id^='dummyDynamicFormConfigTable_']").each(function(){
        var table = $(this).DataTable();
        table.destroy();
    });
    var disabled = formTemp.find(':input:disabled').removeAttr('disabled');

    var serializedFormTemp = $('#masterForm,#masterFormConfig').serialize();
    disabled.prop('disabled','disabled');
    $.ajax({
        async:false,
        type: "post",
        url: saveUrl,
        data : serializedFormTemp + "&firstTimeSave=" + showFullScreen,
        success: function(result){
            if(result == "success"){
                if(isDynamic){
                    neutrinoNavigateTo(contextPath + "/app/grid/DynamicWorkflowConfiguration/DynamicWorkflowConfiguration/loadColumnConfig");
                } else{
                    neutrinoNavigateTo(contextPath + "/app/grid/WorkflowConfiguration/WorkflowConfiguration/loadColumnConfig");
                }
            } else{
                showMessage(errorTitle, result, errorType);
                return;
            }
        },
        error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            $("table[id^='dummyFormConfigTable_']").each(function(){
                var tableId = $(this).prop('id');
                $(this).Datatable().destroy();
                var dummyFormTable = $(this).Datatable({"aaSorting": [] });
                $('#' + tableId + '_filter').find("input").on("keyup change", function(){
                    dummyFormTable.search($(this).val()).draw();
                });
            });
            $("table[id^='dummyDynamicFormConfigTable_']").each(function(){
                var tableId = $(this).prop('id');
                $(this).Datatable().destroy();
                var dummyDynamicFormTable = $(this).Datatable({"aaSorting": [] });
                $('#' + tableId + '_filter').find("input").on("keyup change", function(){
                    dummyDynamicFormTable.search($(this).val()).draw();
                });
            });
        }
    });
}

function prepareDummyTableRow(stageIndex, currentStageId, i, j, newRow, isEditableFromFrontEnd){
    var disableActiveTab = false;
    var formConfigEnabledTd;
    var formConfigId = $("#formConfigTypeId_"+currentStageId+"_"+i).val();
    var formId = $("#formConfig_Id_"+currentStageId+"_"+i).val();
    var formConfigName = $("#formConfigNameMainTableTd_"+currentStageId+"_"+i).text();
    var formConfigIdName = "processingStages["+stageIndex+"].defaultStage.formConfig["+j+"].formConfigType.id";
    var formIdName = "processingStages["+stageIndex+"].defaultStage.formConfig["+j+"].id";
    var formConfigNameTd = "<td id='formConfigNameTd"+currentStageId+"_"+i+"'>"+ formConfigName +"<input type='hidden'name='"+formConfigIdName+"' value='"+formConfigId+"'/><input type='hidden'name='"+formIdName+"' value='"+formId+"'/></td>";
    var formConfigDescription = $("#formConfigDescriptionMainTableTd_"+currentStageId+"_"+i).text();
    var formEnabledName="processingStages["+stageIndex+"].defaultStage.formConfig["+j+"].enabled";
    if($("#radio_enabled_"+currentStageId+"_"+i).is(':checked')){
        formConfigEnabledTd = "<td id='formConfigEnabledTd"+currentStageId+"_"+i+"'><input id='formConfigEnabled"+currentStageId+"_"+i+"' type='radio'name='"+formEnabledName+"' value='true' disabled checked='checked'/>Yes &nbsp <input id='formConfigDisabled"+currentStageId+"_"+i+"' type='radio'name='"+formEnabledName+"' value='false' disabled/>No</td>";
    } else{
        formConfigEnabledTd = "<td id='formConfigEnabledTd"+currentStageId+"_"+i+"'><input id='formConfigEnabled"+currentStageId+"_"+i+"' type='radio' name='"+formEnabledName+"' value='true' disabled/>Yes &nbsp <input id='formConfigDisabled"+currentStageId+"_"+i+"' type='radio' name='"+formEnabledName+"' value='false' disabled checked='checked'/>No</td>";
    }
    var formConfigMode = $("#tabViewMode_"+currentStageId+"_"+i).val();
    var formConfigModeName = "processingStages["+stageIndex+"].defaultStage.formConfig["+j+"].tabViewMode";
    var formConfigModeTd = "<td id='formConfigModeTd"+currentStageId+"_"+i+"'><input id='formConfigModeTDIEM"+currentStageId+"_"+i+"' type='radio' name='"+formConfigModeName+"' value='TDIEM'/> Edit Mode &nbsp <input id='formConfigModeTDIVM"+currentStageId+"_"+i+"' type='radio' name='"+formConfigModeName+"' value='TDIVM'/> View Mode &nbsp <input id='formConfigModeTNO"+currentStageId+"_"+i+"' type='radio' name='"+formConfigModeName+"' value='TNO'/> Name Only &nbsp </td>";
    var formActiveName = "processingStages["+stageIndex+"].defaultStage.formConfig["+j+"].activeTab";
    var formConfigActiveTd = "<td id='formConfigActiveTd"+currentStageId+"_"+i+"'><input id='formConfigActiveCheckbox"+currentStageId+"_"+i+"' type='radio'  name='"+formActiveName+"' value='true'/></td>";
    var formConfigOrder="";
    if(!newRow){
        formConfigOrder = $("#formConfigOrder_"+currentStageId+"_"+i).val();
    }
    var formConfigOrderName = "processingStages["+stageIndex+"].defaultStage.formConfig["+j+"].tabSequence";
    var formConfigOrderTd = "<td id='formConfigOrderTd"+currentStageId+"_"+i+"'><input  class='form-control tab-sequence' id='formConfigOrderDummy"+currentStageId+"_"+i+"' type='number' min='0' maxlength='10' step='1' name='"+formConfigOrderName+"' value='"+formConfigOrder+"'/><span class='color-red' style='display:block;'></span></td>";
    var dummyRow = "<tr id='dummyFormConfigRow"+currentStageId+"_"+i+"'> " + formConfigNameTd + " <td>"+ formConfigDescription +"</td>" + formConfigEnabledTd + formConfigModeTd + formConfigActiveTd +  formConfigOrderTd + "</tr>"
    $("#dummyFormConfigTable_"+currentStageId).find("tbody").append(dummyRow);
    $("#formConfigMode"+formConfigMode+currentStageId+"_"+i).prop('checked',true);
    if($("#checkbox_active_"+currentStageId+"_"+i).is(':checked')){
        $("#formConfigActiveCheckbox"+currentStageId+"_"+i).prop('checked',true);
    }
    if($("#radio_enabled_"+currentStageId+"_"+i).is(':checked')){
        if(formConfigMode == 'TNO'){
            $("#formConfigModeTDIVM").prop('checked',true);
            $("#formConfigModeTDIEM"+currentStageId+"_"+i).prop('checked',false);
        }
        $("#formConfigModeTNO"+currentStageId+"_"+i).prop('checked',false);
        $("#formConfigModeTNO"+currentStageId+"_"+i).prop("disabled", "disabled");

    } else{
        $("#formConfigModeTDIEM"+currentStageId+"_"+i).prop('checked',false);
        $("#formConfigModeTDIVM"+currentStageId+"_"+i).prop('checked',false);
        $("#formConfigModeTNO"+currentStageId+"_"+i).prop('checked',true);
        $("#formConfigModeTDIEM"+currentStageId+"_"+i).prop("disabled", "disabled");
        $("#formConfigModeTDIVM"+currentStageId+"_"+i).prop("disabled", "disabled");
        $("#formConfigModeTNO"+currentStageId+"_"+i).prop("disabled", "disabled");
        $("#formConfigActiveCheckbox"+currentStageId+"_"+i).prop('checked',false);
        $("#formConfigActiveCheckbox"+currentStageId+"_"+i).prop("disabled", "disabled");
    }
    if(isEditableFromFrontEnd=="false"){
        if($("#formConfigActiveCheckbox"+currentStageId+"_"+i).is(':checked')) {
            disableActiveTab = true;
        }
        $("#dummyFormConfigRow"+currentStageId+"_"+i).find("input,button,textarea,select").prop("disabled", "disabled");
    }

    return disableActiveTab;
}

function prepareDynamicDummyTableRow(stageIndex, currentStageId, i, j, newRow){
    var dynamicFormConfigEnabledTd;
    var dynamicFormName = $("#dynamicFormConfigName_"+currentStageId+"_"+i).val();
    var dynamicFormId = $("#dynamicFormConfig_Id_"+currentStageId+"_"+i).val();
    var dynamicFormNameName = "processingStages["+stageIndex+"].defaultStage.dynamicFormConfig["+j+"].formName";
    var dynamicFormIdName = "processingStages["+stageIndex+"].defaultStage.dynamicFormConfig["+j+"].id";
    var dynamicFormUuid = $("#dynamicFormConfigUuid_"+currentStageId+"_"+i).val();
    var dynamicFormUuidName = "processingStages["+stageIndex+"].defaultStage.dynamicFormConfig["+j+"].formuuid";
    var dynamicFormNameTd = "<td id='dynamicFormNameTd"+currentStageId+"_"+i+"'>"+ dynamicFormName +"<input type='hidden'name='"+dynamicFormNameName+"' value='"+dynamicFormName+"'/><input type='hidden'name='"+dynamicFormIdName+"' value='"+dynamicFormId+"'/><input type='hidden'name='"+dynamicFormUuidName+"' value='"+dynamicFormUuid+"'/></td>";
    var dynamicFormEnabledName="processingStages["+stageIndex+"].defaultStage.dynamicFormConfig["+j+"].enabled";
    if($("#dynamic_radio_enabled_"+currentStageId+"_"+i).is(':checked')){
        dynamicFormConfigEnabledTd = "<td id='dynamicFormConfigEnabledTd"+currentStageId+"_"+i+"'><input id='dynamicFormConfigEnabled"+currentStageId+"_"+i+"' type='radio'name='"+dynamicFormEnabledName+"' value='true' disabled checked='checked'/>Yes &nbsp <input id='dynamicFormConfigDisabled"+currentStageId+"_"+i+"' type='radio'name='"+dynamicFormEnabledName+"' value='false' disabled/>No</td>";
    } else{
        dynamicFormConfigEnabledTd = "<td id='dynamicFormConfigEnabledTd"+currentStageId+"_"+i+"'><input id='dynamicFormConfigEnabled"+currentStageId+"_"+i+"' type='radio' name='"+dynamicFormEnabledName+"' value='true' disabled/>Yes &nbsp <input id='dynamicFormConfigDisabled"+currentStageId+"_"+i+"' type='radio' name='"+dynamicFormEnabledName+"' value='false' disabled checked='checked'/>No</td>";
    }
    var dynamicFormConfigOrder="";
        if(!newRow){
            dynamicFormConfigOrder = $("#dynamicFormConfigOrder_"+currentStageId+"_"+i).val();
        }
    var dynamicFormConfigOrderName = "processingStages["+stageIndex+"].defaultStage.dynamicFormConfig["+j+"].tabSequence";
    var dynamicFormConfigOrderTd = "<td id='dynamicFormConfigOrderTd"+currentStageId+"_"+i+"'><input  class='form-control tab-sequence' id='dynamicFormConfigOrderDummy"+currentStageId+"_"+i+"' type='number' min='0' maxlength='10' step='1' name='"+dynamicFormConfigOrderName+"' value='"+dynamicFormConfigOrder+"'/><span class='color-red' style='display:block;'></span></td>";

    var dummyRow = "<tr id='dummyDynamicFormConfigRow"+currentStageId+"_"+i+"'> " + dynamicFormNameTd + " <td>"+ dynamicFormName +"</td>" + dynamicFormConfigEnabledTd + dynamicFormConfigOrderTd + "</tr>"
    $("#dummyDynamicFormConfigTable_"+currentStageId).find("tbody").append(dummyRow);
}

$(document).on("click","a[id^='eventMapping']", function(){
    var contextPath = getContextPath();
    var clickId = $(this).prop('id');
    var idArray = clickId.split('_');
    var ruleType = idArray[0].replace("eventMapping","").toLowerCase();
    var stageId = clickId.replace(idArray[0]+"_","");
    var invocationPoint = $("#"+ ruleType +"RuleInvocationPoint_" + stageId).val();
    if(invocationPoint==""){
        $("#"+ ruleType +"RuleInvocationPoint_" + stageId+"-control-group").addClass('error');
        return;
    }
    $.ajax({
        async:false,
        type: "post",
        url: contextPath +"/app/"+masterID+"/viewEventMapping",
        data : "invocationPoint=" + invocationPoint,
        success: function(result){
            if(result=="0L" || result=="0" || result=="" || result==null){
                showMessage(errorTitle, rule_does_not_exist, errorType);
            }
            else{
                var url = contextPath + "/app/RuleInvocationMapping/view/" + result;
                neutrinoNavigateTo(url);
            }
        },
        error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
        }
    });
});

$("#processingStageConfig").bind("processingStageConfigSelection", function(){
    nodeLabel = $("#Text_processingStageConfig").val();
    var nodeName = nodeLabel.replace(/_/g, " ");
    $("#subNetworkMain").show();
    $("#loadWorkflowSubNetwork").text(nodeName);
    currentStageId = nodeLabel.replace(/ /g,"_").toLowerCase();
    loadSubNetworkWorkflow(currentStageId);
});


$("#showWorkflowImagePopup").on('click', function(){
    var prop = $("#workFlowImg").prop('src');
    // For some browsers, `prop` is undefined; for others, `prop` is false.  Check for both.
    if (typeof prop === typeof undefined || prop === false || prop === "") {
        var src0 = getContextPath() + '/app/WorkflowEditor/showWorkFlow/' + currentVersion +'/'+ $("#processDefinitionKey option:selected").val() + ".jpeg";
        $("#workFlowImg").prop('src', src0);
    }
    $('#dialog-form-WorkflowImagePopup').modal('show');
});

$("#closeWorkflowImagePopup").click(function() {
    $('#dialog-form-WorkflowImagePopup').modal('hide');
});


$("#compareWorkflow").on('click', function(){

    $('#dialog-form-CompareWorkflowPopup').modal('show');
});

$("#closeCompareWorkflowPopup").click(function() {
    $('#dialog-form-CompareWorkflowPopup').modal('hide');
});


$("#stagePropertyTab").on('click', function(){
    $("#Text_processingStageConfig").val("");
    $("#subNetworkMain").hide();
});

$("#workflowPropertyTab").on('click', function(){
    $("#subNetworkMain").hide();
});


$("#versionLeftSelect").on("change", function(){
    var selectedVersion = $("#versionLeftSelect").val();
    var selectType = $("#compareWorkflowType").val();
    if(selectedVersion != ""){
        if (selectType ==="xml") {
            var xmlData = workflowXMLData(selectedVersion);
            $("#prettydiff").show();
            $("#baseText").text(xmlData);
            baseVersion = selectedVersion;
            if($("#baseText").text() != "" && $("#newText").text() != "") {
                    $("#executeWorkflowComparision").removeClass("disabled btn-default").addClass("btn-primary");
            } else {
                   $("#executeWorkflowComparision").addClass("disabled btn-default").removeClass("btn-primary");
            }
        } else if(selectType === "graph") {
            var processDefinitionKey = $("#processDefinitionKey option:selected").val();
            prepareNetworkGraph(processDefinitionKey, selectedVersion, workflowTypeSomeServiceTask, leftSide, "compareLeftGraph", "compareLeftNetworkDiv");
            $("#compareLeftGraph").show();
            $("#leftGraphVersion").html("<b>Version: "+selectedVersion);
        }
    } else{
            if (selectType ==="xml") {
                $("#baseText").text("");
            } else if(selectType === "graph") {
                $("#compareLeftGraph").hide();
            }
    }
});

$("#compareWorkflowType").on("change", function(){

    var processDefinitionKey = $("#processDefinitionKey option:selected").val();
    var selectType = $("#compareWorkflowType").val();
    var selectedVersionRight = $("#versionRightSelect").val();
    var selectedVersionLeft = $("#versionLeftSelect").val();

    if(selectType === "graph") {
        $("#prettydiff").hide();
        if(selectedVersionRight != "") {
            prepareNetworkGraph(processDefinitionKey, selectedVersionRight, workflowTypeSomeServiceTask, rightSide, "compareRightGraph", "compareRightNetworkDiv");
            $("#compareRightGraph").show();
            $("#rightGraphVersion").html("<b>Version: "+selectedVersionRight);
        }
        if(selectedVersionLeft != "") {
            prepareNetworkGraph(processDefinitionKey, selectedVersionLeft, workflowTypeSomeServiceTask, leftSide ,"compareLeftGraph", "compareLeftNetworkDiv");
            $("#compareLeftGraph").show();
            $("#leftGraphVersion").html("<b>Version: "+selectedVersionLeft);
        }
    } else {
        $("#compareLeftGraph").hide();
        $("#compareRightGraph").hide();

        if(selectedVersionRight != "") {
            var xmlData = workflowXMLData(selectedVersionRight);
            $("#prettydiff").show();
            $("#newText").text(xmlData);
            newVersion = selectedVersionRight;
        }
        if(selectedVersionLeft != "") {
            var xmlData = workflowXMLData(selectedVersionLeft);
            $("#prettydiff").show();
            $("#baseText").text(xmlData);
            baseVersion = selectedVersionLeft;
        }
    }
});

$("#versionRightSelect").on("change", function(){
    var selectedVersion = $("#versionRightSelect").val();
    var selectType = $("#compareWorkflowType").val();
    if(selectedVersion != ""){
        if (selectType ==="xml") {
            var xmlData = workflowXMLData(selectedVersion);
            $("#prettydiff").show();
            $("#newText").text(xmlData);
            newVersion = selectedVersion;
            if($("#baseText").text() != "" && $("#newText").text() != "") {
                $("#executeWorkflowComparision").removeClass("disabled btn-default").addClass("btn-primary");
            } else {
                   $("#executeWorkflowComparision").addClass("disabled btn-default").removeClass("btn-primary");
            }
        } else if(selectType === "graph") {
            var processDefinitionKey = $("#processDefinitionKey option:selected").val();
            prepareNetworkGraph(processDefinitionKey, selectedVersion, workflowTypeSomeServiceTask, rightSide, "compareRightGraph", "compareRightNetworkDiv");
            $("#compareRightGraph").show();
            $("#rightGraphVersion").html("<b>Version: "+selectedVersion);
        }
    } else{
            if (selectType ==="xml") {
                $("#newText").text("");
            } else if(selectType === "graph") {
                 $("#compareRightGraph").hide();
            }
    }
});


workflowXMLData = function(selectedVersion, side) {

     var procDefinitionKey = $("#processDefinitionKey option:selected").val();
     var contextPath = getContextPath();
     var bpmnXml;
     $.ajax({
             url: contextPath + "/app/WorkflowEditor/workflowXmlData",
             async : false,
             data : {
                "processDefinitionKey" : procDefinitionKey,
                "selectedVersion" : selectedVersion,
             },
             success: function(result){
                bpmnXml = result.bpmnXml;
             },error: function(){
                 showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
             }
     });
     return bpmnXml;
}

validateWorkflow = function(network){
    var ids = network.body.data.nodes.getIds();
    var result = false;
    for(i=0;i<ids.length;i++){
        var nodeId = ids[i];
        var nodeGroup = network.body.data.nodes["_data"][nodeId]["group"];
        switch(nodeGroup) {
            case "CallActivity" :
                    result = validateCallActivity(nodeId, network);
                    break;
            case "ServiceTask" :
                    result = validateServiceTask(nodeId, network);
                    break;
            case "ReceiveTask" :
                    result = validateReceiveTask(nodeId, network);
                    break;
            case "BoundaryEvent" :
                    result = validateBoundaryEvent(nodeId, network);
                    break;
            case "InclusiveGateway" :
                    result = validateInclusiveGateway(nodeId, network);
                    break;
            case "ExclusiveGateway" :
                    result = validateExclusiveGateway(nodeId, network);
                    break;
            case "ParallelGateway" :
                    result = validateParallelGateway(nodeId, network);
                    break;
            case "StartEvent" :
                    result = validateStartEvent(nodeId, network);
                    break;
            case "MessageStartEvent" :
                    result = validateMessageStartEvent(nodeId, network);
                    break;
            case "EndEvent" :
                    result = validateEndEvent(nodeId, network);
                    break;
        }
        if(!result) {
            return false;
        }
    }
    return validateMinimumOneStage(ids, network);
}

validateMinimumOneStage = function(ids, network){
    connectedCallActivityCount = 0;
    for(i=0;i<ids.length;i++){
        var nodeId = ids[i];
        var nodeGroup = network.body.data.nodes["_data"][nodeId]["group"];
        if("CallActivity" == nodeGroup){
            if(network.getConnectedNodes(nodeId, 'to').length>0
            && network.getConnectedNodes(nodeId, 'from').length>0){
                connectedCallActivityCount++;
            }
        }
    }
    if(connectedCallActivityCount == 0){
        showMessage(errorTitle, minimum_one_stage_should_connected, errorType);
        return false;
    }
    return true;
}

validateCallActivity = function(node, network) {
    if(!((network.getConnectedNodes(node, 'from').length >= 1 && network.getConnectedNodes(node, 'to').length == 1)
       ||
      (network.getConnectedNodes(node, 'to').length == 0 && network.getConnectedNodes(node, 'from').length == 0))
      ) {
            var nodeLabel = network.body.data.nodes["_data"][node]["label"];
            network.selectNodes([node], true);
            showMessage(errorTitle, invalid_stage_connection_error_message + " "+nodeLabel, errorType);
            return false;
    }
    return true;
}

validateServiceTask = function(node, network){
    if(!((network.getConnectedNodes(node, 'from').length >= 1 && network.getConnectedNodes(node, 'to').length == 1)
     ||
    (network.getConnectedNodes(node, 'to').length == 0 && network.getConnectedNodes(node, 'from').length == 0))
    ) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, invalid_service_task_connection_error_message + " " + nodeLabel, errorType);
        return false;
    }
    return true;
}

validateReceiveTask = function(node, network){
    if(!((network.getConnectedNodes(node, 'from').length >= 1 && network.getConnectedNodes(node, 'to').length == 1)
     ||
    (network.getConnectedNodes(node, 'to').length == 0 && network.getConnectedNodes(node, 'from').length == 0))
    ) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, invalid_receive_task_connection_error_message + " " + nodeLabel, errorType);
        return false;
    }
    return true;
}

validateBoundaryEvent = function(node, network){
    return true;
}

validateInclusiveGateway = function(node, network){
    if(!(network.getConnectedNodes(node, 'to').length == 1 && network.getConnectedNodes(node, 'from').length >= 1)) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, invalid_gateway_connection_error_message + " " + nodeLabel, errorType);
       return false;
    }
    return true;
}

validateExclusiveGateway = function(node, network){
    if((network.getConnectedNodes(node, 'to').length < 1 || network.getConnectedNodes(node, 'from').length < 1)) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, invalid_exclusive_connection_error_message + " " + nodeLabel, errorType);
        return false;
    }
    return true;
}

validateParallelGateway = function(node, network){
    if((network.getConnectedNodes(node, 'to').length < 1 || network.getConnectedNodes(node, 'from').length < 1)) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, invalid_parallel_connection_error_message + " " + nodeLabel, errorType);
        return false;
    }
    return true;
}

validateStartEvent = function(node, network) {
    if(!(network.getConnectedNodes(node, 'from').length == 0 && network.getConnectedNodes(node, 'to').length == 1)) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, start_node_connection_error_message, errorType);
        return false;
    }
    return true;
}

validateMessageStartEvent = function(node, network) {
    if(!(network.getConnectedNodes(node, 'from').length == 0 && network.getConnectedNodes(node, 'to').length == 1)) {
        var nodeLabel = network.body.data.nodes["_data"][node]["label"];
        network.selectNodes([node], true);
        showMessage(errorTitle, message_start_node_connection_error_message, errorType);
        return false;
    }
    return true;
}

validateEndEvent = function(node, network) {
    if(!(network.getConnectedNodes(node, 'from').length >= 1 && network.getConnectedNodes(node, 'to').length == 0)) {
        network.selectNodes([node], true);
        showMessage(errorTitle, end_node_connection_error_message, errorType);
        return false;
    }
    return true;
}

function showServiceTaskInfo(){
    $("#newStageBox").hide();
    $("#existingStageBox").hide();
    $("#newServiceTask").show();
    $("#content_workflowConfig").find('input').val("");
    $("#content_processingStage").find('input').val("");
    $("#stageNameInput").val("");
    $("#Text_processingStage").prop("disabled","disabled");
    $("#Text_processingStage").prop("readonly","readonly");
    $("#cloneExistingStage").prop("checked",false);
    $("#serviceTaskNameInput").focus();
}

function showStageInfo(){
    $("#newStageBox").show();
    $("#existingStageBox").hide();
    $("#newServiceTask").hide();
    $("#serviceTaskExpInput").val("");
    $("#serviceTaskNameInput").val("");
    $("#eventCode").val("");
    $("#newServiceTaskExpRadio").prop("checked",true);
    $("#existingServiceTaskExpRadio").prop("checked",false);
    showNewServiceDiv();
    $("#stageNameInput").focus();
}

function showNewServiceDiv(){
    $("#newServiceTaskDiv").show();
    $("#existingServiceTaskDiv").hide();
    $("#serviceTaskExpInput").val("");
}

function showExistingServiceDiv(){
    $("#newServiceTaskDiv").hide();
    $("#existingServiceTaskDiv").show();
    $("#eventCode").val("");
}

showExclusiveGatewayInfo = function() {
    $("#newStageBox").hide();
    $("#existingStageBox").hide();
    $("#newServiceTask").hide();
}

showParallelGatewayInfo = function() {
    $("#newStageBox").hide();
    $("#existingStageBox").hide();
    $("#newServiceTask").hide();
}

showInclusiveGatewayInfo = function() {
    $("#newStageBox").hide();
    $("#existingStageBox").hide();
    $("#newServiceTask").hide();
}

validateServiceTaskExpression = function(expression) {
   var isValidated = expression.startsWith("${") && expression.endsWith("}") ? true : false;
   return isValidated;
}

function showMessage(title, text, type){
    new PNotify({
        title : title,
        text : text,
        type : type,
        pnotify_animate_speed : .8,
        opacity : 1
    });
}

function com_setSideBySide(){
    $("#compareBoxModel").css("visibility","hidden");
    setTimeout(function(){
        var mw = $("#webtool .workFlow_Model .workFlow_Content").width() - 30;
        $("#prettydiff #webtool .diff").css({"overflow":"hidden","width":parseInt(mw)});
        $("#prettydiff #webtool .diff-left").css({"width":parseInt(mw/2)});
        $("#prettydiff #webtool .diff-right").css({"width":parseInt(mw/2)});
        $("#prettydiff #webtool .diff").css({"padding-left":parseInt(mw/2)});
        $("#compareBoxModel").css("visibility","visible");

        $("#prettydiff #webtool .diff-right").on("scroll",function(){
            var thisTop = $(this).scrollTop();
            var thisLeft = $(this).scrollLeft();
            $("#prettydiff #webtool .diff-left").scrollTop(thisTop);
            $("#prettydiff #webtool .diff-left").scrollLeft(thisLeft);
        });
    },10)
}

function openWorkflowAssignment(stageCode, productType){
    var viewUrl = getContextPath() + "/app/WorkflowAssignment/view/";
    $.ajax({
        url: getContextPath() + "/app/WorkflowAssignment/getWorkflowAssignmentId",
        data:{
            "stageCode" : stageCode,
            "productType" : productType
        },
        success: function(id){
            if(id == null || id == '' || id == 0){
                showMessage(errorTitle, "No associated assignment found", errorType);
            } else{
                 neutrinoNavigateTo(viewUrl + id);
            }
        },error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
        }
    });
}

function allowDrop(event){
    event.preventDefault();
}
function drop(event){
    event.preventDefault();
    var elementId = event.dataTransfer.getData("id");
    if(elementId != null && elementId != ''){
        var network = eval("networkData.network_" + workflowTypeSomeServiceTask + currentVersion);
        var nodeXY = network.DOMtoCanvas({
            x : event.x,
            y : event.y
        });
        openPropertyPanel(elementId, nodeXY);
    }
}
function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
}
function addNodeDynamically(node) {
    var network = eval("networkData.network_" + workflowTypeSomeServiceTask + currentVersion);
    network.body.data.nodes.add([{
        id: node.id,
        label: node.label,
        group: node.group,
        x: node.x,
        y: node.y
    }]);
}

function openPropertyPanel(elementId, nodeXY){
    $.ajax({
        url: getContextPath() + "/app/WorkflowEditor/loadPropertyPanel",
        data : {
            "elementId" : elementId,
            "nodeX" : nodeXY.x,
            "nodeY" : nodeXY.y,
            "workflowEditorId" : $("#workflowEditorId").val(),
            "workflowConfigTypeId" : $("#workflowConfigType").val(),
            "isDynamic" : isDynamic,
            "isSubProcess" : isSubProcess
        },
        success: function(result){
            $('#childPropertyPanel').html(result);
            $('#propertyPanelDiv').modal('show');
            $('#propertyPanelDiv').parent('div').css({
                "z-index" : "100000"
            });
        },error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
        }
    });
}
function submitPropertyDetails(){
    var isEditMode = $("#panelEditModeInput").val();
    var formTemp = $("#propertyForm");
    if(formTemp.valid()){
        var disabled = formTemp.find(':input:disabled').removeAttr('disabled');
        var serializedFormTemp = $("#propertyForm").serialize();
        disabled.prop('disabled','disabled');
        if(isEditMode == 'true'){
            submitPropertyDetailsEditMode(serializedFormTemp);
        } else{
            submitPropertyDetailsNonEditMode(serializedFormTemp);
        }
    }
}

function submitPropertyDetailsEditMode(serializedFormTemp){
    $.ajax({
        url: getContextPath() + "/app/WorkflowEditor/updatePropertyDetails",
        data : serializedFormTemp,
        success: function(result){
            $('#propertyPanelDiv').modal('hide');
        },error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
        }
    });
}

function submitPropertyDetailsNonEditMode(serializedFormTemp){
    var processingStageId = $("#processingStage").val();
    var workFlowConfigId = $("#workflowConfig").val();
    if(processingStageId != null && processingStageId != undefined && processingStageId != ''
        && workFlowConfigId != null && workFlowConfigId != undefined && workFlowConfigId != ''){

        $.ajax({
            url: getContextPath() + "/app/WorkflowEditor/submitPropertyDetails",
            data : serializedFormTemp + "&workFlowConfigId=" + workFlowConfigId +
            "&processingStageId=" + processingStageId + "&isDynamicProcess=" + isDynamic + "&isSubProcess=" + isSubProcess,
            success: function(result){
                if(result.id == "Duplicate-Record-Error"){
                    showMessage(errorTitle, duplicate_id_already_exist, errorType);
                } else{
                    addNodeDynamically(result);
                    $('#propertyPanelDiv').modal('hide');
                }
            },error: function(){
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
        });
    } else{
        $.ajax({
            url: getContextPath() + "/app/WorkflowEditor/submitPropertyDetails",
            data : serializedFormTemp + "&isDynamicProcess=" + isDynamic + "&isSubProcess=" + isSubProcess,
            success: function(result){
                if(result.id == "Duplicate-Record-Error"){
                    showMessage(errorTitle, duplicate_id_already_exist, errorType);
                } else{
                    addNodeDynamically(result);
                    $('#propertyPanelDiv').modal('hide');
                }
            },error: function(){
                showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
            }
        });
    }

}

function getCurrentSelectedType(){
    if($("#showWithServiceTask").is(':checked')){
        return $("#showWithServiceTask").val();
    } else {
        return $("#showFullWorkflow").val();
    }
}

function showPropertyPanelEditMode(){
    var componentId = $("#proertyComponentId").val();
    var selectedVersion = $("#currentVersion").val();
    var viewTemp = view;
    if(selectedVersion != currentVersion){
        viewTemp = true;
    }
    $.ajax({
         url: getContextPath() + "/app/WorkflowEditor/showPropertyPanelEditMode",
         async : false,
         data : {
            "componentId" : componentId,
            "workflowEditorId" : $("#workflowEditorId").val(),
            "workflowConfigTypeId" : $("#workflowConfigType").val(),
            "isDynamic" : isDynamic,
            "isSubProcess" : isSubProcess,
            "processDefinitionKey" : $("#processDefinitionKey option:selected").val(),
            "selectedVersion" : selectedVersion,
            "currentVersion" : currentVersion,
            "viewable" : viewTemp
         },
         success: function(result){
            $('#box').hide();
            $('#childPropertyPanel').html(result);
            $('#propertyPanelDiv').modal('show');
            $('#propertyPanelDiv').parent('div').css({
                "z-index" : "100000"
            });
         },error: function(){
             showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
         }
     });
}

function addNewRowInTable(tagId){
    var field = tagId[0];
    var component = $("#component").val();
    var subPanelName = $("#subPanelName_"+tagId[1]).val();
    var maxIndex = getMaxIndex(tagId);
    $.ajax({
        url: getContextPath() + "/app/WorkflowEditor/addRowInTable",
        data : {
            "component" : component,
            "subPanelName" : subPanelName,
            "field" : field,
            "isDynamic" : isDynamic,
            "isSubProcess" : isSubProcess,
            "iIndex" : tagId[1],
            "jIndex" : tagId[2],
            "kIndex" : maxIndex
         },
        success: function(result){
            var res=$(result);
            $("#table_"+field+"_"+tagId[1]+"_"+tagId[2]).append(res.find("table tbody").html());
        },error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
        }
    });
}

function getMaxIndex(tagId){
    var maxIndex = $("#table_"+tagId[0]+"_"+tagId[1]+"_"+tagId[2] + " tr:last").find('input.tableFieldNameInput').val();
    if(maxIndex == null || maxIndex == undefined){
        maxIndex = 0;
    } else{
        maxIndex++;
    }
    return maxIndex;
}

function showConfiguration(){
    var componentId = $("#proertyComponentId").val();
    var network = eval("networkData.network_" + getCurrentSelectedType() + $("#currentVersion").val());
    var nodeName = network.body.data.nodes["_data"][componentId]["label"];
    $("#proertyComponentId").val('');
    $('#box').hide();
    chechStageConfigExist(nodeName);
}

function chechStageConfigExist(nodeName){
    var isSubProcessExists = false;
    var isUserTask = false;
    $.ajax({
        type: "POST",
        async : false,
        url : getContextPath() + "/app/WorkflowEditor/checkSubProcess",
        data : {
            "stageName" : nodeName,
            "workflowId" : $("#workflowEditorId").val(),
            "workflowConfigTypeId" : $("#workflowConfigType").val()
        },
        success : function(result){
            isSubProcessExists = result.isSubProcess;
            isUserTask = result.isUserTask;
            if(isSubProcessExists){
                showMessage(errorTitle, sub_stage_warning_message, errorType);
            }
        },
        error: function(){
            showMessage(errorTitle, workflow_some_error_occurred_message, errorType);
        }

    });
    if(!isSubProcessExists){
        $("body").removeClass("fullWindowPanelPalet");
        var src = $(".fullScreenPanel img").attr('src');
        src = src.replace('minimize','maximize');
        $(".fullScreenPanel img").attr('src', src);
        nodeLabel = nodeName;
        currentStageId = nodeLabel.replace(/ /g,"_").toLowerCase();
        $("#subNetworkMain").show();
        $("#loadWorkflowSubNetwork").text(nodeLabel);
        loadSubNetworkWorkflow(currentStageId);
    }
}

function fitNetworkGraph(){
    if(!fitOnceCalled){
        var network = eval("networkData.network_" + workflowTypeSomeServiceTask + currentVersion);
        setTimeout(function(){
            network.fit();
            fitOnceCalled = true;
        },100);
    }
}

function removeMandatoryClass(){
    $("select[id^='tatPassed_new_']"||"select[id^='escalationType_new_']" || "select[id^='notification_new_']" || "select[id^='escalationLevel_new_']").each(function(){
        $(this).removeClass('required');
    });
    $("select[id^='escalationType_new_']" ).each(function(){
        $(this).removeClass('required');
        });
    $( "select[id^='notification_new_']" ).each(function(){
        $(this).removeClass('required');
    });
     $(  "select[id^='escalationLevel_new_']").each(function(){
        $(this).removeClass('required');
     });
}

function addMandatoryClass(){
   $("select[id^='tatPassed_new_']").each(function(){
        $(this).addClass('required');
    });
    $("select[id^='escalationType_new_']" ).each(function(){
        $(this).addClass('required');
    });
    $( "select[id^='notification_new_']" ).each(function(){
        $(this).addClass('required');
     });
     $(  "select[id^='escalationLevel_new_']").each(function(){
        $(this).addClass('required');
     });
}