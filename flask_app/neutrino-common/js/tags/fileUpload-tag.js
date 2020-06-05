var fileDropped;
function fileUploadTagScript(fileUploadTagScriptInput) {
	//File Drag Drop
	$(document).ready(
			function() {
				var obj="";
				var inputTag="";
							
				var disabled = fileUploadTagScriptInput.disabled_fileUpload;
				if (disabled && (disabled == true || disabled == 'true')) {
					$('#browsediv_'+fileUploadTagScriptInput.id_fileUpload).addClass('gray');
					$('#browse_'+fileUploadTagScriptInput.id_fileUpload).addClass('gray').removeClass(
							'btn-primary').attr('disabled', 'disabled');
					$('#upload_'+fileUploadTagScriptInput.id_fileUpload).addClass('gray').removeClass('btn-primary')
							.attr('disabled', 'disabled');
					$('#remark_'+fileUploadTagScriptInput.id_fileUpload).addClass('gray').attr('disabled',
							'disabled');
					return;
				}

				obj = $("#dragandrophandler_"+fileUploadTagScriptInput.id_fileUpload);
				inputTag = $('#commonsMultipartFile_'+fileUploadTagScriptInput.id_fileUpload);
				initialiseDropBox2();
				obj.on('dragenter', function(e) {
					e.stopPropagation();
					e.preventDefault();
					$(this).css('border', '2px solid #0B85A1');
				});
				obj.on('dragover', function(e) {
					e.stopPropagation();
					e.preventDefault();
				});
				obj.on('drop', function(e) {

					$(this).css('border', '2px dotted #0B85A1');
					e.preventDefault();
					var files = e.originalEvent.dataTransfer.files;

					// We need to send dropped files to Server
					handleFileUpload(files, obj);
				});

				$(document).on('dragenter', function(e) {
					e.stopPropagation();
					e.preventDefault();
				});
				$(document).on('dragover', function(e) {
					e.stopPropagation();
					e.preventDefault();
					obj.css('border', '2px dotted #0B85A1');
				});
				$(document).on('drop', function(e) {
					e.stopPropagation();
					e.preventDefault();
				});

				inputTag.on('change', function(e) {
					//For stackoverflow.com/questions/44524390/
					//IE 11 fires another change event ONCE whenever 
					//.val('') is called on a type='file' element
					if (!inputTag.val()) {
						return;
					}
					fileDropped = inputTag[0].files[0];
					if (fileExtensionValidator(fileDropped)) {
						inputTag.val("");
						addToDropBox();
					}
					e.stopImmediatePropagation();
				});
				
				//inputTag.unbind('change');
			});

	function handleFileUpload(files, obj) {
		if (files.length != 1) {
			new PNotify({
				title : 'Error',
				text : drop_single_file,
				type : 'error',
				opacity : .8
			});
			return;
		}
		fileDropped = files[0];
		if(fileExtensionValidator(fileDropped)){
		
		addToDropBox();
		}
	}

	this.initialiseDropBox2 = function () {
		fileDropped = "";
		$("#dragandrophandler_"+fileUploadTagScriptInput.id_fileUpload).html("<span>" + $("#dragDrop_"+fileUploadTagScriptInput.id_fileUpload).html() + "</span>");
		$('#dbId_'+fileUploadTagScriptInput.id_fileUpload).val("");
	}

	/* function initialiseDropBox2(){
	 initialiseDropBox();
	 } */

function addToDropBox() {
		 $("#dragandrophandler_"+fileUploadTagScriptInput.id_fileUpload).html("<span>"
						+ fileDropped.name
						+ "</span><a onclick='initialiseDropBox2()' class='btn btn-xs'><i class='glyphicon glyphicon-remove'></i> </a>");
		 $("#commonsMultipartFile_"+fileUploadTagScriptInput.id_fileUpload).val("");
	}
	//file drag drop end

this.onClickEventWapper = function () {
	var remarkMandatory = fileUploadTagScriptInput.remarkMandatory;
	var functionNameWithBrackets = fileUploadTagScriptInput.uploadEvent;
	if(remarkMandatory == "false"){
			eval(functionNameWithBrackets);
	}else{
		var isValid = onFocusOutListener();
		if(isValid){
			eval(functionNameWithBrackets);
		}
	}
	
		
	
}

this.onFocusOutListener = function () {
	var remarkMandatory = fileUploadTagScriptInput.remarkMandatory;
	if(remarkMandatory == "false"){
		return true;
	}
	var remarksFieldId = "remark_"+fileUploadTagScriptInput.id_fileUpload;
	var element = $("#" + remarksFieldId);
	element.valid();
	if(element.val()){
		element.closest('.outset-shadow-focus').removeClass('outset-shadow-focus');
		return true;
		
	}else{
		return false;
	}
}

}

function getfileExtension(fileName){
	return fileName.split('.').pop();
}

function fileExtensionValidator(file){
		var fileExtn = getfileExtension(file.name);
		if (!fileExtn || !(fileExtn == "xls" || fileExtn == "xlsx" || fileExtn == "odt")) {
			new PNotify({
				title : 'Error',
				text : unsupported_file_format+ xls_xlsx_odt_support,
				type : 'error',
				opacity : .8
			});
			return false;;
		}
		return true;
}




















