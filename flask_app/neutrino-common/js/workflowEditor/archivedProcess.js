$(document).ready(function(){
    $("#dynamicArchiveDataTable").DataTable({"aaSorting": [[ 3, 'desc' ]]});
});

function exitArchivedForm(){
    neutrinoNavigateTo(getContextPath()+ "/app/DynamicWorkflowConfiguration/applicationDataTableVo");
}