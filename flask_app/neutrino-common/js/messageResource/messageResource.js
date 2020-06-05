function saveForm(){
	
	
	var form = $("#messageResourceForm");
	if(form.valid()){
		form.submit();
	}
}
$(document).ready(function() {
$.validator.addMethod("checkDuplicateMessageKey", function(value, element) {

	  return  !checkDuplicateMessageKey();

	},label.message.already.exist); 

var checkDuplicateMessageKey=function checkDuplicateMessageKey()
{
	var result=false;
	var messageKey=	$("#messageCode").val();
	var uuid=	$("#UUID").val();
	if(messageKey=="")
		return result;

	if(uuid==null||uuid=="" )
	{
		uuid="null";
	}
	$.ajax({
		url : getContextPath() + "/app/messageResource/checkDuplicateMessageKey/"+messageKey+"/"+uuid,
		type : 'POST',
		async : false,
		
		success : function(data) {
			if (data == "true")
				{
				result=true;
				}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		
		}

	});	
	return result;
}
});	

	
 
function cancelForm(context){
	var form = document.getElementById("messageResourceForm");
	form.action = context + "/app/messageResource/loanAllLabels";
	form.submit();
} 
