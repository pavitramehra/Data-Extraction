/**
 * Script is used for communication history
 */


/* JAVASCRIPT CODE FOR Lead,Lead Communication. */
/* ==================PART-1====================== */
var FILE_NUMBER = 0;
var currentCount = 1;
var fadeOutduration = 1;
var casVersion = "";



/*
 * get the slected communication type form from radio buttons
 */
 $(document)
	.ready(
			function() {
				getNotificationList("phone_mode");
$('#lead_comm_modal').on(
		'change',
		".comm_mode_selector :radio",
		function() {
			if ($(this).val() == 1) {
				$("span.help-block").remove();
				getNotificationList("phone_mode");
				$("#notificationdescription").val("");
				$("#lead_comm_appointment").hide();
				$("#lead_comm_appointment").find('select')
						.attr('disabled', 'disabled');
				$("#lead_comm_email").hide();
				$("#lead_comm_email").find('input').attr(
						'disabled', 'disabled');
				$("#lead_comm_phone").show();
				$("#lead_comm_phone").find('input,select')
						.removeAttr('disabled');
				$('.emailList').removeClass('required');
				$('#phone_number_list').addClass('required');
				$('#lead_response').removeClass('form-group required');
				$('#comm_status').removeClass('form-group required');
				$('#notificationType').addClass('required');
				$('.repeatable_fragment_clone').addClass('hide');
			} else if ($(this).val() == 2) {
				$("span.help-block").remove();
				getNotificationList("email_mode");
				$("#notificationdescription").val("");
				$("#lead_comm_phone").hide();
				$("#lead_comm_phone").find('input,select')
						.attr('disabled', 'disabled');
				$("#lead_comm_appointment").hide();
				$("#lead_comm_appointment").find('select')
						.attr('disabled', 'disabled');
				$("#lead_comm_email").show();
				$("#lead_comm_email").find('input')
						.removeAttr('disabled');
				$('.emailList').addClass('required');
				$('#phone_number_list').removeClass('required');
				$('#lead_response').removeClass('form-group required');
				$('#comm_status').removeClass('form-group required');
				$('#notificationType').addClass('required');
				$('.repeatable_fragment_clone').addClass('hide');
			
			} else if ($(this).val() == 3) {
				$("span.help-block").remove();
				$("#lead_comm_phone").hide();
				$("#lead_comm_phone").find('input,select')
						.attr('disabled', 'disabled');
				$("#lead_comm_email").hide();
				$("#lead_comm_email").find('input').attr(
						'disabled', 'disabled');
				$("#lead_comm_appointment").show();
				$("#lead_comm_appointment").find('select')
						.removeAttr('disabled');
				$("#lead_appointment").trigger(
						"chosen:updated");
				$("#add_notification").hide();
				$("#repeatable_fragment").show();
				$('#add_Response_Fragment').show();
				$('#lead_response').addClass('form-group required');
				$('#comm_status').addClass('form-group required');
				$('.emailList').removeClass('required');
				$('#phone_number_list').removeClass('required');
				$('#notificationType').removeClass('required');
				$('.repeatable_fragment_clone').removeClass('hide');
			}
			
		
			
		});

$('#leadAccordian').on(
		'show.bs.collapse',
		function(event) {

			if ($(event.target).is(
					"#collapseOnee_lead_comm")) {
				$(this).find('#icon_plus_lead')
						.toggleClass("glyphicon glyphicon-minus");
				retrieveCommunicationHistroy();
			}
		});


// when a file is selected show it in a table.
$('#lead_comm_modal')
.on(
		'change',
		".single_file",
		function() {
			var filePath = $(this).val();
			var fieldId = $(this).attr("id");
			var fileName = getFileName(filePath);
			$(this)
					.parents(
							".multifileupload:first")
					.find(".selected_files")
					.append(
							'<tr><td><i class="glyphicon glyphicon-file"/></td><td>'
									+ fileName
									+ '</td><td><input type="button" id='
									+ fieldId
									+ ' class="btn btn-xs btn-warning remove_file" value="Remove"/></td></tr>')
			checkDoc1(this);
			// $(this).parents(".multifileupload:first").find(".selected_files").append('<div
			// class="row label label-info"><i
			// class="glyphicon glyphicon-file"/>'+fileName+'<input
			// type="button" id='+fieldId+'
			// class="btn btn-xs remove_file"
			// value="Remove"/></div>')

		});

$('#lead_comm_modal').on('click', ".remove_file",
function() {

	var fieldId = $(this).attr("id");
	$(this).parents("tr:first").remove();
	$('#' + fieldId).remove();

});


			});


function retrieveCommunicationHistroy() {
var	ownerid = $("#appId").val();
	if (ownerid) {
		$.ajax({
			type : "GET",
			url : getContextPath() + "/app/loanComm/getcommunicationhistory",
			data : {
				"ownerEntityId" : ownerid
			},
			success : function(data) {

				$("#lead_comm_history").html(data);
			}

		});

	}

}
function submitCommunicationForm() {
	
	var form = $("#lead_communication_form");
	var formData = new FormData(form[0]);
	var ownerid = $("#appId").val();
	formData.append('ownerEntityId', ownerid);
	if ($("#lead_communication_form").valid()) {
		$.ajax({
			type : "POST",
			url : form.attr("action"),
			enctype : "multipart/form-data",
			data : formData,
			success : function(data) {
				closeLeadDialog();
				retrieveCommunicationHistroy();
				// $(".lead_comm_count").after(data);
				new PNotify({
                                title : success,
                                text : label.comm.sent.successfully,
                                type : 'success',
                                pnotify_animate_speed : fadeOutduration,
                                opacity : .8
                             });
			},
			processData : false,
			contentType : false

		});
	}

}

function getFileName(fullPath) {
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath
				.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
		return filename;

		/*
		 * filenameWithoutExtenstion = filename.substring(0,
		 * filename.lastIndexOf('.')); return filenameWithoutExtenstion;
		 */
	}
}
function multiFileUpload(current) {
	
	var fragmentNumber = $(current).parents(".multifileupload:first").find(
			".fragment_number").val();
	$(current).after(
			'<input type="file" class="single_file" id="single_file_'
					+ FILE_NUMBER + '" name="communicationTrails['
					+ fragmentNumber + '].attachedFiles[' + FILE_NUMBER
					+ ']" style="display:none;" />');
	$('#single_file_' + FILE_NUMBER).click();
	FILE_NUMBER += 1;

}

function checkDoc1(fileElement) {
	var fileExtension = "";
	if (fileElement.value.lastIndexOf(".") > 0) {
		fileExtension = fileElement.value.substring(fileElement.value
				.lastIndexOf(".") + 1, fileElement.value.length).toLowerCase();
	}
	if (fileExtension == "gif" || fileExtension == "jpeg"
			|| fileExtension == "jpg" || fileExtension == "png"||fileExtension == "doc" || fileExtension == "docx"
				|| fileExtension == "pdf" || fileExtension == "txt") {
		return true;
	} else if (fileElement.value != "") {
		var id = $(fileElement).attr("id");
		$("#"+id+".remove_file").click();
		try{
			unsupported_file_format;
			doc_support;
		}
		catch(err)
		{
			unsupported_file_format = "Unsupported file format.";
			doc_support = "Please upload doc with extension .doc, .docx, .pdf, .txt, .jpeg, .jpg, .png or .gif only.";
		}
		handleuploadError(unsupported_file_format+" "+doc_support)
		$.sticky(unsupported_file_format+" "+doc_support, {
			autoclose : 5000,
			position : "top-right",
			type : "st-error"
		});
		
		return false;
	}
}

function handleuploadError(responseText){
}

function closeLeadDialog() {
	$("#lead_comm_modal").hide();
	currentCount = 1;
}

function showCommunicationForm() {
	openPhoneCommDialog(0);
	if (!$('#collapseOnee_lead_comm').hasClass("in")) {
		$('#collapseOnee_lead_comm').collapse('show');
	}
	$("#lead_comm_modal").show();
}

function addResponseFragment() {
	openPhoneCommDialog(1);

}

function showAppointmentForm() {
	openPhoneCommDialog(2);
	if (!$('#collapseOnee_lead_comm').hasClass("in")) {
		$('#collapseOnee_lead_comm').collapse('show');
	}
	$("#lead_comm_modal").show();
}

function openPhoneCommDialog(responseType) {
	var	ownerid = $("#appId").val();
	if (responseType != null) {
		$.ajax({
			type : "GET",
			url : getContextPath() + "/app"+communicationHistoryURL+"/getCommunicationDialog/"
					+ responseType + "/" + currentCount+"/"+ownerid,
			success : function(data) {

				if (responseType == 1) {
					data = data.replace(/leadCommunicationForm./gi, "");
					$("#add_Response_Fragment").before(data);
					currentCount += 1;
					
				} else {
					$("#lead_comm_modal").html(data);
				}
			},
			error : function() {

			}
		});
	
	}
}

function getNotificationList(type){
	
	$
	.ajax({
		type : 'POST',
		url :   getContextPath() +"/app/loanComm/getNotificationList/"+type,
		
		success : function(p) {
		
		var $Select=	$("#notificationType");
		$Select.html("");
		 $Select.append("<option value=''> Select  </option>")
			for (var key in p) {
				  if (p.hasOwnProperty(key)) {
					  $Select.append("<option  value=' " + key + "'> " + p[key]  + " </option>")
				  		  }
				}
	
				$("#add_notification").show();
				$("#repeatable_fragment").hide();
				$('#add_Response_Fragment').hide();

		}


	});
}
notificationListener();
function notificationListener() {
		$('body')
		.on('change','#notificationType',
		
						function() {
		
			var reasonVal = $(this);
			var typeId = $(this).attr("id");
			var	typeCode = $("#"+typeId).children(":selected").val();
			if(typeCode){
				
			
						

							$
									.ajax({
										type : 'POST',
										url : getContextPath()+"/app/loanComm/getNotificationDescription/"
												+ typeCode,

										success : function(data) {
											
											$("#notificationdescription").val(data);
										
									
													

										}

									});
			}else{
				$("#notificationdescription").val("");
			}
						});
		

	}



