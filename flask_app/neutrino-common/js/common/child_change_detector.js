/**
 * 
 */
$(document).ready(function() {
	
	prepareChildDataFrTrckMdfctns();

});
function prepareChildDataFrTrckMdfctns()
{
	var childArr=$("[class*=trackChildModifications]");
	if(childArr.length==0)
		return;
	childArrRecordKeys=[];
	parentByChildId=[];
	var formIdForTrackingModifications=$("#"+childArr[0].id).parents("Form").attr("id")
	for(var i=0;i<childArr.length;i++)
	{
		var elm=childArr[i];
		var parentPath=elm.className.match("trackChildModifications_[^ ]*")[0].replace("trackChildModifications_","");
		childArrRecordKeys.push(elm.id);
		if($("#"+elm.id).prop("type")=="checkbox") {
			childArrRecordKeys[""+elm.id+""]=$("#"+elm.id).prop("checked");
		} else {
			childArrRecordKeys[""+elm.id+""]=elm.value;
		}
		
		parentByChildId[""+elm.id+""]=parentPath;
	}
	callBackFunOnSubmit(formIdForTrackingModifications);
};
function callBackFunOnSubmit(formIdForTrackingModifications)
{
	$("#"+formIdForTrackingModifications).submit(function() {
		  updateChileRecords(formIdForTrackingModifications);
	});
}
function updateChileRecords(formIdForTrackingModifications) {
	
	if(typeof childArrRecordKeys=="undefined")
	{
		return;
	}
	var parentElement=[];
	var operationType=[];
	for(var i=0;i<childArrRecordKeys.length;i++)
	{
		var elmId=childArrRecordKeys[i];
		var parentPath=parentByChildId[elmId];
		var parentIndex=parentElement.indexOf(parentPath);
		if(parentIndex==-1)
		{
			var prevVal=childArrRecordKeys[""+elmId+""];
			var elm=$("#"+elmId)[0];
			if(typeof elm=="undefined")
			{
				continue;
			}
			
			var currentVal
			if($("#"+elm.id).prop("type")=="checkbox") {
				currentVal=$("#"+elm.id).prop("checked");
			} else {
				currentVal=elm.value;
			}


			if(prevVal!=currentVal)
			{
				parentElement.push(parentPath);
				operationType.push("M");
			}
		}
	}
	
	for(var i=0;i<parentElement.length;i++)
	{
		$("#"+formIdForTrackingModifications).append("<input type='hidden' name='"+parentElement[i]+".operationType' id='"+parentElement[i]+".operationType' value='"+operationType[i]+"' />");
	}
}
