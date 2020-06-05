window.openChildDialog = function (action,id, masterId, parentId) {
	     var splitId = id.split("-");
	     id=splitId[0];
				 $.ajax({
						url : getContextPath()+"/app/"+parentId+"/"+masterId+"/"+action,
						type : 'POST',
						data : { id : id,
						         originatedFrom : splitId[1]},
						async : false,
						success : function(jqXHR) {
							
						    $('#deviationActivityMappingDiv').html('');
							$('#deviationActivityMappingDiv').html(jqXHR);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							alert(jqXHR + " : " + textStatus + " : " + errorThrown);
						}
					});

			 } 

function openChildDialogs(action,id, masterId, parentId){
		var ids = $("#id").val();
		var splitId = id.split("-");
		id=splitId[0];
		
		if(typeof ids =='undefined' ||ids ==""){		
			ids=0;
		}
		 $.ajax({
				url : getContextPath()+"/app/DeviationPolicy/DeviationActivityMapping/"+action+"/"+id,
				type : 'POST',
				data : { deviationPolicyId : ids,
					     originatedFrom : splitId[1]},
				async : false,
				success : function(jqXHR) {
			    $('#deviationActivityMappingDiv').html('');
				$('#deviationActivityMappingDiv').html(jqXHR);
				
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});

}
 
 var actionURL;
 var delSingleAction=false;
 var masterIdOnClick = "";
 var parentIdOnClick = ""

 function closeDialogUser() {
 	$('#dialog-form-users').modal('hide');
 }

 window.editDataTableRecord = function(id, actionURL) {
 	if (childtable == 'true' && viewModeProperty=='false') {
 		var finalUrl = getContextPath() + actionURL + id;
 		openChildDialogs('edit', id , masterIdOnClick, parentIdOnClick);
 	} else if(childtable == '' && viewModeProperty=='false') {
 		neutrinoNavigateTo(getContextPath() + actionURL + id);
 	}
 	else{
 		return false;
 	}

 }


 function deleteDataTableRecord(iId,actionURL, singleAction, masterId, parentId) {
	var ids = $("#id").val();
	if(typeof ids =='undefined' ||ids ==""){		
		ids=0;
	}
	var splitId = iId.split("-");
	iId=splitId[0];
	
	 $.ajax({
			url : getContextPath()+"/app/DeviationPolicy/DeviationActivityMapping/delete/"+iId,
			type : 'POST',
			data : { deviationPolicyId : ids,
				     tempId :$("#tempId").val(),
				     originatedFrom : splitId[1]},
			async : false,
			success : function(jqXHR) {
				
				var id =ids;
				var tempId = $("#tempId").val();
				if(typeof tempId =='undefined' ||tempId ==""){		
					tempId=0;
				}
				resetDeviationActivityMapping();
				var baseURL = getContextPath() + "/app/DeviationPolicy/loadPage/" +id +"/"+tempId+"/"+viewMode;
				// load content for first tab and initialize
				$('#deviationMitigantDiv').load(baseURL, function() {
					
				});
			
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert(jqXHR + " : " + textStatus + " : " + errorThrown);
			}
		});
 }

 window.deleteTableRecord = function(iId,masterId, parentId){
 	deleteDataTableRecord(iId,actionURL,delSingleAction,masterId, parentId);

 }

 window.deleteRecord =function(masterId, parentId){
	 
	 var ids = $("#id").val();
		if(typeof ids =='undefined' ||ids ==""){		
			ids=0;
		}
		if(typeof tempId =='undefined' || tempId==""){
			tempId =0;		
		}
		 $.ajax({
				url : getContextPath()+"/app/DeviationPolicy/DeviationActivityMapping/multipleDelete",
				type : 'POST',
				data : { deviationPolicyId : ids,
					     "recordIds":multipleIds,
					     tempId :tempId },
				async : false,
				success : function(jqXHR) {
					closeConfirmDialog('DeviationActivityMapping');
					var id =ids;
					var tempId = $("#tempId").val();
					if(typeof tempId =='undefined' ||tempId ==""){		
						tempId=0;
					}
					resetDeviationActivityMapping();
					var baseURL = getContextPath() + "/app/DeviationPolicy/loadPage/" +id +"/"+tempId+"/"+viewMode;
					// load content for first tab and initialize
					$('#deviationMitigantDiv').load(baseURL, function() {
						
					});
				
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});
 }


 function closeConfirmDialog(masterId)

 {
 	$('.deleteRecord_'+masterId).modal('hide');
 }

 $(document).ready(function() {

 	htmlTableIdtBody.off('click').on("click", "tr", function(event) {
 		var img = event.target.nodeName;
 		var masterId = $(event.target).closest('table').attr('data-masterId');
 		var parentId = $(event.target).closest('table').attr('data-parentId');
 		parentIdOnClick =parentId;
 		masterIdOnClick =masterId;

 		if($(event.target).attr("id")){
 			var imgId = $(event.target).attr("id");
 		}

 		else{
 			var imgId = $(event.target).attr("class");
 		}

 		if (img != null && (viewModeProperty=='false' || viewModeProperty=="")) {
 			// couple of example on what can be done with the clicked row...

 				var aData = getTableData(this); // get data of the clicked row
 				var iId = aData[linkIndex];// get column data of the row
 				var taskId = aData[3];
 				lastRowId = iId;
 				lastTaskId = taskId; 			
 			if (imgId == "Edit") {
 				editDataTableRecord(iId, actionURL);
 			}
 			if (imgId == "Delete") {
 				delSingleAction = true;
 				var aData = getTableData(this); // get data of the clicked row
 				var iId = aData[linkIndex];
 				$('.deleteRecord_'+masterId).modal('hide');
 				deleteTableRecord(iId,masterId, parentId)
 			}
			if (imgId == ("selectThis_"+masterId) && img == "INPUT") {

				var test = event.target.checked;
				displayBttns(test, lastRowId);
				$('#Temp-Assign'+masterId+'Bttn').hide();
			}
 			
 		}
 		else{
 			return false;
 		}
 	});

 });

 
 function resetDeviationActivityMapping(){
	 $("#deviationActivityMap")[0].reset();
	 $("[name='tempDeviationActivityMapping.id']").val('');
	 $("[name='tempDeviationActivityMapping.childApprovalStatus']").val('');
	 $("[name='tempDeviationActivityMapping.deviationAcivityMapping']").val('');
	 $("#Text_deviationCode0").attr('data-custom-controller','/DeviationPolicy/populateDeviationDefinition/'+false);
	 $("#Text_deviation_name0").attr('data-custom-controller','/DeviationPolicy/populateDeviationDefinition/'+false);
	 
	 $("#deviationCode0").val('');
	 $("#Text_deviationCode0").val('');
	 $("#deviation_name0").val('');
	 $("#Text_deviation_name0").val('');
	 $("#temporaryWaiver0").prop('checked',false);
	 $("#temporaryWaiver0").parent('span').removeClass('checked');
	 var selectedVal = $("option:selected", "#deviationActivity_id0").text().trim();
	 if(selectedVal != 'Select'){
		 $("option:selected", "#deviationActivity_id0").removeAttr('selected');
	 }
	 
 }
