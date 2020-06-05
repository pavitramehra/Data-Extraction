$(document).ready(function(){
    $(document).off('click',"input[id^='formConfigActiveCheckbox']").on('click',"input[id^='formConfigActiveCheckbox']", function(){
        var checkboxId = $(this).prop('id');
        var rowIndexId = checkboxId.replace("formConfigActiveCheckbox","");
        var parentTBodyOfRadio = $(this).parent().parent().parent();
        parentTBodyOfRadio.find('tr').each(function(){
            $(this).find("td:nth-child(5)").find('input').prop('checked',false);
        });
        $(this).prop('checked',true);
    });
    $(document).off('click',"input[id^='checkbox_select_']").on("click","input[id^='checkbox_select_']",function() {
        var checkboxId = $(this).prop('id');
        var rowIndex = checkboxId.replace("checkbox_select_","");
        var checkbox_checked = $(this).prop('checked');
        var parentOfChecked = $(this).parent().parent().parent().prop('id');
        var stageId = parentOfChecked.replace('formconfig-data-tbody_','');
        var stageIndex = $("#stageIndex_" + stageId).val();
        if (checkbox_checked == true) {
            $("#enabled_div_" + rowIndex).show();
            $("#tabViewMode_" + rowIndex).val("TNO");
            var tableLength = $("#dummyFormConfigTable_" + stageId).find('tbody').find('tr').length;
            var rowNum = rowIndex.replace(stageId + "_", "");
            prepareDummyTableRow(stageIndex, stageId, rowNum, tableLength, true);
        } else {
            $("#enabled_div_" + rowIndex).hide();
            $("#formConfigOrder_" + rowIndex).val("0");
            $("#radio_disabled_" + rowIndex).prop('checked',true);
            $("#radio_enabled_" + rowIndex).prop('checked',false);
            $("#dummyFormConfigRow" + rowIndex).remove();
            i = 0;
            $("#dummyFormConfigTable_" + stageId).find('tbody').find('tr').each(function(){
                var rowId = $(this).prop('id');
                var rowIndexNew = rowId.replace("dummyFormConfigRow","");
                updateNameDummyTable(stageIndex, rowIndexNew, i);
                i++;
            });
        }
    });

    $(document).off('click',"input[id^='radio_enabled_']").on("click","input[id^='radio_enabled_']",function() {
        $(this).prop("checked", true);
        var radioId = $(this).prop('id');
        var rowIndex = radioId.replace("radio_enabled_","");
        var lastIndex = rowIndex.lastIndexOf('_');
        var stageId = rowIndex.substr(0, lastIndex);

        $("#radio_disabled_" + rowIndex).prop('checked',false);
        $("#formConfigEnabled"+rowIndex).prop("checked",true);
        $("#formConfigDisabled"+rowIndex).prop('checked',false);
        var tabViewModeVal = $("#tabViewMode_"+rowIndex).val();
        if(tabViewModeVal == "TNO"){
            $("#formConfigModeTDIVM"+rowIndex).prop("checked",false);
            $("#formConfigModeTDIEM"+rowIndex).prop('checked',true);
            $("#formConfigModeTNO"+rowIndex).prop('checked',false);
            $("#tabViewMode_" + rowIndex).val("TDIEM");
        }
        $("#formConfigActiveCheckbox"+rowIndex).removeAttr("disabled");
        $("#formConfigModeTNO"+rowIndex).prop('checked',false);
        $("#formConfigModeTNO"+rowIndex).prop("disabled","disabled");
        $("#formConfigModeTDIEM"+rowIndex).removeAttr('disabled');
        $("#formConfigModeTDIVM"+rowIndex).removeAttr('disabled');

        $("#dummyFormConfigTable_" + stageId).find('tbody').find('tr').each(function(){
            var rowId = $(this).prop('id');
            var rowIndexNew = rowId.replace("dummyFormConfigRow"+stageId+"_","");
            if($("#formConfigOrderDummy"+stageId+"_"+rowIndexNew).is(':disabled') && $("#formConfigActiveCheckbox"+stageId+"_"+rowIndexNew).is(':checked')) {
                $("#formConfigActiveCheckbox"+rowIndex).prop("disabled","disabled");
            }
        });

    });

    $(document).off('click',"input[id^='radio_disabled_']").on("click","input[id^='radio_disabled_']",function(){
        $(this).prop("checked", true);
        var radioId = $(this).prop('id');
        var rowIndex = radioId.replace("radio_disabled_", "");
        $("#radio_enabled_" + rowIndex).prop('checked',false);
        $("#checkbox_active_" + rowIndex).prop('checked',false);
        $("#formConfigDisabled"+rowIndex).prop("checked", true);
        $("#formConfigEnabled"+rowIndex).prop('checked',false);
        var tabViewModeVal = $("#tabViewMode_"+rowIndex).val();
        $("#formConfigModeTNO"+rowIndex).prop("checked", true);
        $("#formConfigModeTDIEM"+rowIndex).prop('checked',false);
        $("#formConfigModeTDIVM"+rowIndex).prop('checked',false);
        $("#formConfigModeTDIEM"+rowIndex).prop("disabled", "disabled");
        $("#formConfigModeTDIVM"+rowIndex).prop("disabled", "disabled");
        $("#tabViewMode_" + rowIndex).val("TNO");
        $("#formConfigActiveCheckbox"+rowIndex).prop('checked',false);
        $("#formConfigActiveCheckbox"+rowIndex).prop("disabled", "disabled");
    });

    $(document).off('click',"input[id^='dynamic_checkbox_select_']").on("click","input[id^='dynamic_checkbox_select_']",function() {
        var checkboxId = $(this).prop('id');
        var rowIndex = checkboxId.replace("dynamic_checkbox_select_","");
        var checkbox_checked = $(this).prop('checked');
        var parentOfChecked = $(this).parent().parent().parent().prop('id');
        var stageId = parentOfChecked.replace('dynamicFormconfig-data-tbody_','');
        var stageIndex = $("#stageIndex_" + stageId).val();
        if (checkbox_checked == true) {
            var formName = $("#dynamicFormConfigName_" + rowIndex).val();
            if(formName == ""){
                showMessage(errorTitle, cannot_select_empty_form, errorType);
                $(this).prop('checked',false);
                return;
            }
            $("#dynamic_enabled_div_" + rowIndex).show();
            var tableLength = $("#dummyDynamicFormConfigTable_" + stageId).find('tbody').find('tr').length;
            var rowNum = rowIndex.replace(stageId + "_", "");
            prepareDynamicDummyTableRow(stageIndex, stageId, rowNum, tableLength, true);
        } else {
            $("#dynamic_radio_disabled_" + rowIndex).prop('checked',true);
            $("#dyanmic_radio_enabled_" + rowIndex).prop('checked',false);
            $("#dynamic_enabled_div_" + rowIndex).hide();
            $("#dummyDynamicFormConfigRow" + rowIndex).remove();
            i = 0;
            $("#dummyDynamicFormConfigTable_" + stageId).find('tbody').find('tr').each(function() {
                var rowId = $(this).prop('id');
                var rowIndexNew = rowId.replace("dummyDynamicFormConfigRow","");
                updateNameDynamicDummyTable(stageIndex, rowIndexNew, i);
                i++;
            });
        }
    });
    $(document).off('click',"input[id^='dynamic_radio_enabled_']").on("click","input[id^='dynamic_radio_enabled_']",function(){
        $(this).prop("checked", true);
        var radioId = $(this).prop('id');
        var rowIndex = radioId.replace("dynamic_radio_enabled_","");
        $("#dynamic_radio_disabled_" + rowIndex).prop('checked',false);
        $("#dynamicFormConfigEnabled"+rowIndex).prop("checked",true);
        $("#dynamicFormConfigDisabled"+rowIndex).prop('checked',false);
    });
    $(document).off('click',"input[id^='dynamic_radio_disabled_']").on("click","input[id^='dynamic_radio_disabled_']",function(){
        $(this).prop("checked", true);
        var radioId = $(this).prop('id');
        var rowIndex = radioId.replace("dynamic_radio_disabled_","");
        $("#dynamic_radio_enabled_" + rowIndex).prop('checked',false);
        $("#dynamicFormConfigDisabled"+rowIndex).prop("checked",true);
        $("#dynamicFormConfigEnabled"+rowIndex).prop('checked',false);
    });
    $(document).off('click',"a[id^='nextFormConfig_']").on("click","a[id^='nextFormConfig_']", function(){
        var nextId = $(this).prop('id');
        var stageId = nextId.replace("nextFormConfig_","");
        $("#mainFormConfigDiv_"+stageId).hide();
        $("#dummyFormConfigDiv_"+stageId).show();
        if(view){
            $("#dummyFormConfigTableDiv_"+stageId).find("input,button,textarea,select").prop("disabled", "disabled");
            $("#dummyDynamicFormConfigTableDiv_"+stageId).find("input,button,textarea,select").prop("disabled", "disabled");
        }
        var dummyFormTable = $("#dummyFormConfigTable_"+stageId).DataTable({"aaSorting": [] });
        $('#dummyFormConfigTable_'+stageId + '_filter').find("input").on("keyup change", function(){
            dummyFormTable.search($(this).val()).draw();
        });
        var dummyDynamicFormTable = $("#dummyDynamicFormConfigTable_"+stageId).DataTable({"aaSorting": [] });
        $('#dummyDynamicFormConfigTable_'+stageId + '_filter').find("input").on("keyup change", function(){
            dummyDynamicFormTable.search($(this).val()).draw();
        });
        $("#nextFormConfig_div_"+stageId).hide();
        $("#backFormConfig_div_"+stageId).show();
    });
    $(document).off('click',"a[id^='backFormConfig_']").on("click","a[id^='backFormConfig_']", function(){
        var backId = $(this).prop('id');
        var stageId = backId.replace("backFormConfig_","");
        $("#mainFormConfigDiv_"+stageId).show();
        $("#dummyFormConfigDiv_"+stageId).hide();
        var table = $("#dummyFormConfigTable_"+stageId).DataTable();
        table.destroy();
        var dynamicTable = $("#dummyDynamicFormConfigTable_"+stageId).DataTable();
        dynamicTable.destroy();
        $("#nextFormConfig_div_"+stageId).show();
        $("#backFormConfig_div_"+stageId).hide();
    });

    $(document).off('click',"input[id^='showAllFormConfig_']").on("click","input[id^='showAllFormConfig_']", function(){
        var radioId = $(this).prop('id');
        var stageId = radioId.replace("showAllFormConfig_","");
        $("#formConfigMainTable_div_" + stageId).show();
        $("#dynamicFormConfigMainTable_div_" + stageId).hide();
    });
    $(document).off('click',"input[id^='showAllDynamicFormConfig_']").on("click","input[id^='showAllDynamicFormConfig_']", function(){
        var radioId = $(this).prop('id');
        var stageId = radioId.replace("showAllDynamicFormConfig_","");
        $("#formConfigMainTable_div_" + stageId).hide();
        $("#dynamicFormConfigMainTable_div_" + stageId).show();
    });
    $(document).off('click',"input[id^='showAllDummyFormConfig_']").on("click","input[id^='showAllDummyFormConfig_']", function(){
        var radioId = $(this).prop('id');
        var stageId = radioId.replace("showAllDummyFormConfig_","");
        $("#dummyFormConfigTableDiv_" + stageId).show();
        $("#dummyDynamicFormConfigTableDiv_" + stageId).hide();
    });
    $(document).off('click',"input[id^='showAllDummyDynamicFormConfig_']").on("click","input[id^='showAllDummyDynamicFormConfig_']", function(){
        var radioId = $(this).prop('id');
        var stageId = radioId.replace("showAllDummyDynamicFormConfig_","");
        $("#dummyFormConfigTableDiv_" + stageId).hide();
        $("#dummyDynamicFormConfigTableDiv_" + stageId).show();
    });
});

function updateNameDummyTable(stageIndex, rowIndex, i){
    var formConfigNameInput = $("#formConfigNameTd"+rowIndex).find("input:nth-child(1)");
    var formConfigIdInput = $("#formConfigNameTd"+rowIndex).find("input:nth-child(2)");
    var formEnabledNameInput = $("#formConfigEnabledTd"+rowIndex).find('input:nth-child(1)');
    var formDisabledNameInput = $("#formConfigEnabledTd"+rowIndex).find('input:nth-child(2)');
    var formConfigModeNameInputTDIEM = $("#formConfigModeTd"+rowIndex).find('input:nth-child(1)');
    var formConfigModeNameInputTDIVM = $("#formConfigModeTd"+rowIndex).find('input:nth-child(2)');
    var formConfigModeNameInputTNO = $("#formConfigModeTd"+rowIndex).find('input:nth-child(3)');
    var formActiveNameInput = $("#formConfigActiveTd"+rowIndex).find('input:nth-child(1)');
    var formConfigOrderNameInput = $("#formConfigOrderTd"+rowIndex).find('input:nth-child(1)');
    var formConfigName = "processingStages["
          + stageIndex
          + "].defaultStage.formConfig["
          + i + "].formConfigType.id";
    var formConfigIdName = "processingStages["
          + stageIndex
          + "].defaultStage.formConfig["
          + i + "].id";
    var formEnabledName = "processingStages["
          + stageIndex
          + "].defaultStage.formConfig["
          + i + "].enabled";
    var formConfigModeName = "processingStages["
          + stageIndex
          + "].defaultStage.formConfig["
          + i + "].tabViewMode";
    var formActiveName = "processingStages["
          + stageIndex
          + "].defaultStage.formConfig["
          + i + "].activeTab";
    var formConfigOrderName = "processingStages["
          + stageIndex
          + "].defaultStage.formConfig["
          + i + "].tabSequence";
    formConfigNameInput.prop('name',formConfigName);
    formConfigIdInput.prop('name',formConfigIdName);
    formEnabledNameInput.prop('name',formEnabledName);
    formDisabledNameInput.prop('name',formEnabledName);
    formConfigModeNameInputTDIEM.prop('name',formConfigModeName);
    formConfigModeNameInputTDIVM.prop('name',formConfigModeName);
    formConfigModeNameInputTNO.prop('name',formConfigModeName);
    formActiveNameInput.prop('name',formActiveName);
    formConfigOrderNameInput.prop('name',formConfigOrderName);
}

function updateNameDynamicDummyTable(stageIndex, rowIndex, i){
    var dynamicFormNameInput = $("#dynamicFormNameTd"+rowIndex).find("input:nth-child(1)");
    var dynamicFormIdInput = $("#dynamicFormNameTd"+rowIndex).find("input:nth-child(2)");
    var dynamicFormUuidInput = $("#dynamicFormNameTd"+rowIndex).find("input:nth-child(3)");
    var dynamicFormEnabledInput = $("#dynamicFormConfigEnabledTd"+rowIndex).find('input:nth-child(1)');
    var dynamicFormDisabledInput = $("#dynamicFormConfigEnabledTd"+rowIndex).find('input:nth-child(2)');
    var dynamicFormOrderInput = $("#dynamicFormConfigOrderTd"+rowIndex).find('input:nth-child(1)');
    var dynamicFormNameName = "processingStages["
          + stageIndex
          + "].defaultStage.dynamicFormConfig["
         + i + "].formName";
    var dynamicFormIdName = "processingStages["
          + stageIndex
          + "].defaultStage.dynamicFormConfig["
          + i + "].id";
    var dynamicFormUuidName = "processingStages["
          + stageIndex
          + "].defaultStage.dynamicFormConfig["
          + i + "].formuuid";
    var dynamicFormEnabledName = "processingStages["
          + stageIndex
          + "].defaultStage.dynamicFormConfig["
          + i + "].enabled";
    var dynamicFormOrderName = "processingStages["
          + stageIndex
          + "].defaultStage.dynamicFormConfig["
          + i + "].tabSequence";
    dynamicFormNameInput.prop('name',dynamicFormNameName);
    dynamicFormIdInput.prop('name',dynamicFormIdName);
    dynamicFormUuidInput.prop('name',dynamicFormUuidName);
    dynamicFormEnabledInput.prop('name',dynamicFormEnabledName);
    dynamicFormDisabledInput.prop('name',dynamicFormEnabledName);
    dynamicFormOrderInput.prop('name',dynamicFormOrderName);
}

function isInteger(n) {
    return /^[0-9]+$/.test(n);
}

$(document).off('change',"input[id^='formConfigOrderDummy']").on("change","input[id^='formConfigOrderDummy']", function(){
    if(!isInteger($(this).val())){
        $(this).parent('td').find('span').text('Please enter valid number');
        $(this).addClass('error-tab-seq');
    }
    else{
        $(this).parent('td').find('span').text('');
        $(this).removeClass('error-tab-seq');
    }
});

$(document).off('change',"input[id^='dynamicFormConfigOrderDummy']").on("change","input[id^='dynamicFormConfigOrderDummy']", function(){
    if(!isInteger($(this).val())){
        $(this).parent('td').find('span').text('Please enter valid number');
        $(this).addClass('error-tab-seq');
    }
    else{
        $(this).parent('td').find('span').text('');
        $(this).removeClass('error-tab-seq');
    }
});

