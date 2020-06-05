function uploadRuleMatrixDetails(){
  if(fileDropped==""){
		new PNotify({
					title : 'Failure',
					text : "Please upload a file to continue.",
					type : 'error',
					pnotify_animate_speed : fadeOutduration,
					opacity : .9
				});
		return;
	}
	var master = $("#masterName").val();
	formData = new FormData();
	formData.append('commonsMultipartFile', fileDropped, fileDropped.name);
	formData.append('master', master);
 	var verificationResult = false;

 	$.ajax({
		type : "POST",
		enctype : "multipart/form-data",
		cache : false,
		contentType : false,
		async : false,
		processData : false,
		url : getContextPath()
				+ "/app/ruleMatrixUpload/uploadFile",
		data : formData,

		success : function(data) {
		    var key=data.key;
		    var result = data.status;
			checkForErrorMessage(result);
		    setTimeout(function(){
                location.reload(true);
            },4000);
			neutrinoNavigateTo(getContextPath() + "/app/ruleMatrixUpload/downloadUploadResult"+"?master="+master+"&fileName="+fileDropped.name+"&key="+key);
		}
	});
}

function checkForErrorMessage(result){
	if(result=="failure"){
    				new PNotify({
    								title : 'Failure',
    								text : "There are some errors in the uploaded file.",
    								type : 'error',
    								pnotify_animate_speed : fadeOutduration,
    								opacity : .9
    							});
    			}else if(result=="success"){
    				new PNotify({
    								title : 'Success',
    								text : "File uploaded successfully.",
    								type : 'success',
    								pnotify_animate_speed : fadeOutduration,
    								opacity : .9
    							});
    			}
}

function cancelUpload(){
	var master = $("#masterName").val();
	var url=getContextPath()+"/app/grid/"+master+"/"+master+"/loadColumnConfig";
	neutrinoNavigateTo(url);
}