var oTableParam;
var firstIndex;
var packageName;
var id;
function onChangeLoadDetailsCustomer() {
    packageName = $("#selectSupportedContext").val();
    loadConfigDetails();
    $("#tableVisibilty").show();
    if (oTableParam) {
        oTableParam.fnDestroy();
    }

    var loadUrl = getContextPath() + "/app/WorkflowEditor/loadEntityPage/"+ packageName + "/";
    oTableParam = $('#dynamicTable').dataTable({
        "bServerSide": true,
        "sAjaxSource" : loadUrl,
        "bFilter": true,
        "aoColumns" : [ {
            mDataProp : "id",
            sDefaultContent : ""
        }, {
            sDefaultContent : ""
        },
        {
            mDataProp : $('#mastername').html(),
            sDefaultContent : ""
        }, {
            mDataProp : $('#mastercode').html(),
            sDefaultContent : ""
        } ],
        "aoColumnDefs" : [ {
            "aTargets" : [ 0 ],
            "sClass" : "hide",
            "sType" : "string",
            "bSortable": false
        }, {
            "aTargets" : [ 1 ],
            "render" : function(data, type,fullObj) {
                htmlCode = "";
                var radioId = "startWorkflowRadio_"+fullObj.id;
                htmlCode = "<input id="+radioId+" name='button' type='checkbox'/>";
                return htmlCode;
            },
            "bSortable": false
        }, {
            "aTargets" : [ 2 ],
            "bSearchable" : true,
            "sType" : "string"
        }, {
            "aTargets" : [ 3 ],
            "bSearchable" : true,
            "sType" : "string"
        } ],
        "bPaginate" : true,
        "bSearchable" : true,
        "bInfo" : true,
        "drawCallback":function(data){
            $("#selectAllApp").prop("checked",false);
            $("#startDynamicWorkflow").addClass('disabled');
            $("#startDynamicWorkflow").prop("disabled", true);
        }
    });

    $('div.dataTables_filter input ').keyup(function () {   oTableParam.fnFilter( $(this).val() );  } );
}


function onChangeLoadDetailsLoanApplication() {
    var product = $("#context_product").val();
    var scheme= $("#context_scheme").val();
    var stage = $("#context_stageName").val();
    var appNumber = $("#appNumber").val();
    var productTypeIds = $("#product_type").val().join(",");
    packageName = $("#selectSupportedContext").val();

    loadConfigDetails();
    $("#tableVisibilty").show();
    if (oTableParam) {
        oTableParam.fnDestroy();
    }

    var loadUrl = getContextPath() + "/app/WorkflowEditor/loadEntityPage/"+ packageName + "/?applicationNumber="+appNumber+"&productType="+productTypeIds
                        +"&productName="+product+"&scheme="+scheme+"&stage="+stage;
    oTableParam = $('#dynamicTable').dataTable({
        "bServerSide": true,
        "sAjaxSource" : loadUrl,
        "bFilter": true,
        "aoColumns" : [ {
            mDataProp : "id",
            sDefaultContent : ""
        }, {
            sDefaultContent : ""
        },
        {
            mDataProp : $('#mastername').html(),
            sDefaultContent : ""
        }, {
            mDataProp : $('#mastercode').html(),
            sDefaultContent : ""
        }, {
            mDataProp : $('#product').html(),
            sDefaultContent : ""
        }, {
            mDataProp : $('#productType').html(),
            sDefaultContent : ""
        }, {
            mDataProp : $('#schemeName').html(),
            sDefaultContent : ""
        }],
        "aoColumnDefs" : [ {
            "aTargets" : [ 0 ],
            "sClass" : "hide",
            "sType" : "string",
                                          "bSortable": false
        }, {
            "aTargets" : [ 1 ],
            "render" : function(data, type,fullObj) {
                htmlCode = "";
                var radioId = "startWorkflowRadio_"+fullObj.id;
                htmlCode = "<input id="+radioId+" name='button' type='checkbox'/>";
                return htmlCode;
            },
                         "bSortable": false
        }, {
            "aTargets" : [ 2 ],
            "bSearchable" : true,
            "sType" : "string"
        }, {
            "aTargets" : [ 3 ],
            "bSearchable" : true,
            "sType" : "string"
        },{
            "aTargets" : [ 4 ],
            "bSearchable" : true,
            "sType" : "string"
        },{
            "aTargets" : [ 5 ],
            "bSearchable" : true,
            "sType" : "string"
        },{
            "aTargets" : [ 6 ],
            "bSearchable" : true,
            "sType" : "string"
        }],
        "bPaginate" : true,
        "bSearchable" : true,
        "bInfo" : true,
        "drawCallback":function(data){
            $("#selectAllApp").prop("checked",false);
            $("#startDynamicWorkflow").addClass('disabled');
            $("#startDynamicWorkflow").prop("disabled", true);
        }
    });

    $('div.dataTables_filter input ').keyup(function () {   oTableParam.fnFilter( $(this).val() );  } );
     $("#footer").show();
}

function loadConfigDetails() {
    packageName = $("#selectSupportedContext").val();
    var loadUrl = getContextPath() + "/app/WorkflowEditor/loadConfig/" + packageName + "/";

    $.ajax({
        type : "POST",
        url : loadUrl,
        async : false,
        success : function(result) {
            firstIndex = result[0];
            $('#mastername').html(result[0]);
            $('#mastercode').html(result[1]);
            if(packageName == 'com.nucleus.core.loan.LoanApplication'){
                $('#product').html(result[2]);
                $('#productType').html(result[3]);
                $('#schemeName').html(result[4]);
            }
        },
        error : function() {
        }
    });
}
function getTableData(obj) {
    var iPos = oTableParam.fnGetPosition(obj);
    rownum = iPos;
    var aData = oTableParam.fnGetData(iPos);
    return aData;

}
var className =  $("#selectSupportedContext").val();
$(document).ready(function() {
    $("#tableVisibilty").hide();
     if(className == 'com.nucleus.core.loan.LoanApplication'){
        getSearchModal();
        //onChangeLoadDetailsLoanApplication();
    }else{
        onChangeLoadDetailsCustomer();
    }
});

function getSearchModal(){
    var loadUrl = getContextPath() + "/app/WorkflowEditor/showLAContextSearchModal/"+className+"/";
    $.ajax({
        type : "POST",
        url : loadUrl,
        async : false,
        success : function(jQXHR) {
            $("#contextInfo").hide();
            $("#footer").hide();
            $("#searchModal").html("");
            $("#searchModal").html(jQXHR);
        },
        error : function() {
        }
    });
}

$("#startDynamicWorkflow").on("click",function(){
    var radioButtonIds =[];
    var supportedContexts =[];
    $("[id^='startWorkflowRadio_']").each(function(){
       if($(this).is(':checked')){
           radioButtonIds.push($(this).attr('id'));
       }else{
            radioButtonIds.remove($(this).attr('id'));
       }
    });
    var packageName = $("#selectSupportedContext").val();

    $.each( radioButtonIds, function( key, value ) {
      var rowIndex = value.replace("startWorkflowRadio_","");
      var supportedContext = packageName + ":" + rowIndex;
      supportedContexts.push(supportedContext);
    });
    console.log(supportedContexts);
    var contextPath = getContextPath();
        $.ajax({
            url: contextPath + "/app/DynamicWorkflowConfiguration/startDynamicWorkflow/"+dynamicWorkflowId,
            data : {
                "supportedContexts" : supportedContexts.join(",")
            },
            success: function(response){
                location.reload(true);
            }, error: function(){
                showMessage("error", "Something went wrong.", "error");
            }
        });
        });


$(document).on("click","input[id^='startWorkflowRadio_']",function(){
    var radioOn = $("input[id^='startWorkflowRadio_']");
    var count=0;
    radioOn.each(function(){
         if($(this).is(":checked")) {
            count++;
         }
    });
    if(count==0){
        $("#startDynamicWorkflow").addClass('disabled');
        $("#startDynamicWorkflow").prop("disabled", true);
        $("#selectAllApp").prop('checked', false);
    }
    else{
        $("#startDynamicWorkflow").removeClass('disabled');
         $("#startDynamicWorkflow").removeAttr("disabled");
    }
});
function submitRefreshForm(){
    $("#product_type").val("");
    $("#tableVisibilty").hide();
    getSearchModal();
}
$("#selectAllApp").on("click",function(){
    $("[id^='startWorkflowRadio_']").each(function(){
       if($("#selectAllApp").is(':checked')){
           $("[id^='startWorkflowRadio_']").prop('checked', true);
       }else{
            $("[id^='startWorkflowRadio_']").prop('checked', false);
       }
    });
    var radioOn = $("input[id^='startWorkflowRadio_']");
    var count=0;
    radioOn.each(function(){
         if($(this).is(":checked")) {
            count++;
         }
    });
    if(count==0){
        $("#startDynamicWorkflow").addClass('disabled');
        $("#startDynamicWorkflow").prop("disabled", true);
    }
    else{
        $("#startDynamicWorkflow").removeClass('disabled');
        $("#startDynamicWorkflow").removeAttr("disabled");
    }

});