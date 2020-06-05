

var toBeDeletedArray = [];
$(document).ready(function() {
    $("#documentChecklistDefGrid").DataTable({
        "aaSorting": [],
        "columnDefs": [ {
            "targets": [0,4,5],
            "orderable": false
        } ]

    });
    $("[id^=selectThis_DocumentChecklistDefinition]").click(function(){
        var isChecked = $(this).prop("checked");
        if(isChecked==true){
            toBeDeletedArray.push($(this).parents("td").find("[id^=indexId]").val());
        }else{

            var index = toBeDeletedArray.indexOf($(this).parents("td").find("[id^=indexId]").val());

            if (index > -1) {
               toBeDeletedArray.splice(index, 1);
            }
        }
        if(toBeDeletedArray.length>0){
            $("#actionButton").show();
            if($("#documentChecklistDefGrid").DataTable().rows().count()==toBeDeletedArray.length){
                $("#selectAll_DocumentChecklistDefinition").prop("checked",true);
            }else{
                 $("#selectAll_DocumentChecklistDefinition").prop("checked",false);
            }
        }else{
            $("#actionButton").hide();
            $("#selectAll_DocumentChecklistDefinition").prop("checked",false);
        }

    });

    $("#selectAll_DocumentChecklistDefinition").click(function(){
        var isChecked = $(this).prop("checked");
        if(isChecked==true){

            $('#documentChecklistDefGrid').DataTable().rows().iterator('row', function(context, index){

                var a = $(this.row(index).node());
                a.find("td:eq(0)").find("[id^=selectThis_DocumentChecklistDefinition]").prop("checked",true);
                toBeDeletedArray.push(a.find("td:eq(0)").find("[id^=indexId]").val());

            });
            if(toBeDeletedArray.length>0)
                $("#actionButton").show();
        }else{
            toBeDeletedArray=[];
            $('#documentChecklistDefGrid').DataTable().rows().iterator('row', function(context, index){
                var a = $(this.row(index).node());
                a.find("td:eq(0)").find("[id^=selectThis_DocumentChecklistDefinition]").prop("checked",false);
            });
            $("#actionButton").hide();
        }

    });

});

function editDocumentChecklistDefinition(indexId){
    $
        .ajax({

            url : getContextPath() + "/app/DocumentChecklist/DocumentChecklistDefinition/DocumentChecklist/edit",
            type : 'POST',
            async : false,
            data : {index : indexId},
            success : function(jqXHR) {
                $('#modal_body_document').html(jqXHR);
                $('#dialog-form-document').modal('show');
                $("#childModalWindowDoneButtonDocumentChecklistDefinition").show();
                $("#create_another_div_DocumentChecklistDefinition").show();
                index = indexId;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                new PNotify({
                    title : "Failure",
                    text : errorThrown,
                    type : "error",
                    pnotify_animate_speed : fadeOutduration,
                    opacity : .8
                });
            }
        });
}

function deleteDocumentChecklistDefinition(index){
    deleteIndex = index;
    $("#deleteRecord_DocumentChecklistDefinition").modal("show");
}

function deleteRecord(){
    $
        .ajax({

            url : getContextPath() +"/app/DocumentChecklist/DocumentChecklistDefinition/DocumentChecklist/delete",
            type : 'POST',
            async : false,
            data : {index : deleteIndex},
            success : function(jqXHR) {
                $("#deleteRecord_DocumentChecklistDefinition").modal("hide");
                new PNotify({
                    title : "Success",
                    text : 'Record(s) deleted successfully!',
                    type : "success",
                    pnotify_animate_speed : fadeOutduration,
                    opacity : .8
                });
                populateGrid();

            },
            error : function(jqXHR, textStatus, errorThrown) {
                new PNotify({
                    title : "Failure",
                    text : errorThrown,
                    type : "error",
                    pnotify_animate_speed : fadeOutduration,
                    opacity : .8
                });
            }
        });

}

function viewDocumentChecklistDefinition(indexId){
    $
        .ajax({

            url : getContextPath() +"/app/DocumentChecklist/DocumentChecklistDefinition/DocumentChecklist/view",
            type : 'POST',
            async : false,
            data : {index : indexId},
            success : function(jqXHR) {
                $('#modal_body_document').html(jqXHR);
                $('#dialog-form-document').modal('show');
                $("#childModalWindowDoneButtonDocumentChecklistDefinition").hide();
                $("#create_another_div_DocumentChecklistDefinition").hide();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                new PNotify({
                    title : "Failure",
                    text : errorThrown,
                    type : "error",
                    pnotify_animate_speed : fadeOutduration,
                    opacity : .8
                });
            }
        });
}

function deletebttnActions(){
     $("#deleteRecord_DocumentChecklistDefinition").modal("show");
     deleteIndex = toBeDeletedArray.join();
}


