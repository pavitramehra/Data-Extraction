/*jQuery(document).ready(function(){jQuery("#viewUploadTrackingReport").hide();
jQuery("#clearBtn").click(function(){cleanForm()
});
if(singleUserFormatExists){setSelectedvalue("formatId",userFormatId);
formatId=jQuery("#formatId").val();
populateProcessingModeOnformatchange(formatId)
}jQuery("#instDesc_counter0_formatDescription").hide();
var a=jQuery("#formatDsp").val();
if(a!=""){jQuery("#formatDescription").val(jQuery("#formatDsp").val())
}jQuery("#formatId").change(function(){var b=jQuery("#formatId").val();
jQuery("#processingModeId").empty();
jQuery("#processingModeId").trigger("chosen:updated");
populateProcessingModeOnformatchange(b)
});
jQuery("#masterForm").iframePostForm({json:true,post:function(){},complete:function(b){WaitModal.hide();
try{var d=JSON.parse(b.find("pre").text())
}catch(c){jQuery("#ajaxDiv").html("<li>Connection Timed Out</li>");
jQuery("#ajaxDiv").show()
}if(d.success!=null){cleanForm();
displayAjaxSuccessMessages(d);
if(d.processingMode=="S"){jQuery("#batchId").val(d.batchId);
jQuery("#viewUploadTrackingReport").show()
}}if(d.error!=null){displayAjaxMessages(d);
jQuery("#batchId").val("")
}}});
jQuery("#masterForm").validate({onkeyup:false,errorClass:"error",validClass:"valid",highlight:function(b){jQuery(b).closest("div").addClass("f_error");
if(jQuery(b).parents(".outset-shadow-focus").length<1){jQuery(b).parents(".form-group").wrapInner('<div class="outset-shadow-focus clearfix" />')
}},unhighlight:function(b){jQuery(b).closest("div").removeClass("f_error")
},errorPlacement:function(b,c){jQuery(c).closest("div").append(b)
},rules:{},invalidHandler:function(c,b){jQuery("#fileupload").closest("div").addClass("outset-shadow-focus clearfix f_error");
jQuery.sticky("There are some errors. Please corect them and submit again.",{autoclose:5000,position:"top-right",type:"st-error"})
}});
jQuery("#fileupload").css("color","black")
});
function cleanForm(){jQuery("#masterForm").validate().resetForm();
jQuery(".error").removeClass("error");
jQuery("#fileupload").css("color","black");
jQuery(".success").removeClass("success");
jQuery(".outset-shadow-focus").removeClass("outset-shadow-focus");
jQuery("#fileupload").val("");
jQuery("#ajaxDiv").hide();
setSelectedvalue("formatId","");
jQuery("#processingModeId").empty();
jQuery("#processingModeId").trigger("chosen:updated");
jQuery("#formatDescription").val("");
jQuery("#viewUploadTrackingReport").hide();
jQuery("#batchId").val("");
jQuery(".outset-shadow-focus").removeClass("outset-shadow-focus")
}*/
function upload(){
	jQuery("#ajaxDiv").hide();
	var a=document.getElementById("fileupload");
	var d=a.value;
	var c=extension(d);
	if(jQuery("#masterForm").valid())
	 {
		if(c!="csv")
		  {
			var b=new Array();
			b[0]=c;
			b[1]="csv";
			errorAlert.showLmsAlert(getMessage("fmsg.00000105",b),error_label);
			return false
		  }
		return true
	}else{
		return false
		 }
	}

function extension(f){var e=f.lastIndexOf(".");
var d=f.length;
if(e!=-1&&d!=e+1){var b=f.split(".");
var a=b.length;
var c=b[a-1].toLowerCase()
}else{c="No extension found"
}return c
}
function downloadUploadLimitDetail(){jQuery("#downloadReport").hide();
var b=jQuery("#batchId").val();
var a=pageContextPath+"/lms/LoanBooking/downloadUploadRecordDetails?batchId="+b;
jQuery.fileDownload(a,{httpMethod:"GET",data:jQuery("#masterForm").serialize(),failCallback:function(e,d){var c=jQuery(e).text();
var f=JSON.parse(c);
if(f.success!=null){cleanForm();
displayAjaxSuccessMessages(f)
}if(f.error!=null){displayAjaxMessages(f)
}}})
}function populateProcessingModeOnformatchange(a){if(a!=""&&a!=null){WaitModal.show(pageContextPath);
jQuery.ajax({url:pageContextPath+"/lms/fileconsolidatorcontroller/loadProcessingModes",dataType:"json",type:"post",data:{formatId:jQuery("#formatId").val(),processingMode:jQuery("#processingTypeId").val(),processId:jQuery("#processId").val(),CSRFToken:getCsrfToken()},success:function(c){WaitModal.hide();
jQuery("#formatDescription").val(c.formatDescription);
top.location.href="#topPage";
var b=0;
jQuery.each(c.processingModesMap,function(d,e){b++
});
if(b==1){jQuery.each(c.processingModesMap,function(d,e){jQuery("#processingModeId").append('<option value="'+d+'" selected="selected">'+e+"</option>")
});
jQuery("#processingModeId").trigger("chosen:updated")
}else{jQuery.each(c.processingModesMap,function(d,e){jQuery("#processingModeId").append('<option value="'+d+'">'+e+"</option>")
});
jQuery("#processingModeId").trigger("chosen:updated");
setSelectedvalue("processingModeId","");
jQuery("#processingModeId").prop("selectedIndex",-1);
jQuery("#processingModeId").trigger("chosen:updated")
}},error:function(d,b,c){WaitModal.hide();
handlingAjaxCommunicationError(d,b,c)
}})
}else{jQuery("#formatDescription").val("")
}};