$(document).ready(function() {

    showApplicationData('assigned');
    $("#assigned_anchor").on("click", function(){
        showApplicationData('assigned');
    });
    $("#pool_anchor").on("click", function(){
        showApplicationData('pool');
    });
    $("#hold_anchor").on("click", function(){
        showApplicationData('hold');
    });
    $("#cancel_anchor").on("click", function(){
        showApplicationData('cancel');
    });
    $("#reject_anchor").on("click", function(){
        showApplicationData('reject');
    });
    $("#archive_anchor").on("click", function(){
        showApplicationData('archive');
    });
});

    function showApplicationData(type) {
            $.ajax({
                url : getContextPath()+"/app/DynamicWorkflowConfiguration/loadPage?actionType="+type,
                type : 'GET',
                async : false,
                success : function(jqXHR) {
                    $("div[id^='appData_']").html("");
                    $('#appData_'+type).html(jqXHR);
                },
                failure : function(msg) {
                    $.sticky(sticky_error, {
                        autoclose : 5000,
                        position : "top-right",
                        type : "st-error"
                    });
                }
            });
    }
function checkListFII(a,b){}