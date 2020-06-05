function onClickDownloadCredentials()
{
	var id=$('#id').val();
	var url = getContextPath() + "/app/OauthClientDetails/downloadclientcredentials/"+id;
		neutrinoNavigateTo(url);
		$('#downloadCredentials').attr("disabled", "disabled");
		$('#mailCredentials').attr("disabled", "disabled");
}
function onClickMailCredentials()
{
	var id=$('#id').val();
	$.ajax({
		url : getContextPath() + "/app/OauthClientDetails/mailclientcredentials/"+id,
		type : 'GET',
		async : false,
	
		success : function(data) {
			$('#downloadCredentials').attr("disabled", "disabled");
			$('#mailCredentials').attr("disabled", "disabled");
		},
		error : function(jqXHR, textStatus, errorThrown) {
			new PNotify({
												title : "Failure",
												text : "Error Occured While Sending Email",
												type : "error",
												pnotify_animate_speed : fadeOutduration,
												opacity : .8
								});
		}

	});	
}

var secretValidFlag = false;
var clientIdValidFlag = false;
var secretMatchFlag = false;

$(function(){
			 var validSecretCode = function(value) {
				 var  validSecretCode = new RegExp(password_pattren);
				  
			  return  validSecretCode.test(value);

			}

		
		$.validator.addMethod("validSecretCode", function(value, element) {

			  return  validSecretCode(value);

			},'Secret Invalid' ); 
		
		
			var validRetypeSecretCode = function(value)
			{
				var pass = $('#secret').val();
				var pass2 = $('#retype_secret').val();
				return (pass == pass2);
			}
		
			$.validator.addMethod("validRetypeSecretCode", function(value, element) {

				  return  validRetypeSecretCode(value);

				},'Secrets Do Not Match' ); 
			
			
			var checkDuplicateClientId=function checkDuplicateClientId()
			{
				var result=false;
				
				$.ajax({
					url : getContextPath() + "/app/OauthClientDetails/checkDuplicateClientId",
					type : 'GET',
					async : false,
					data : $("#masterForm").serialize(),
					success : function(data) {
						if (data == "UnAvailable")
							{
							result=true;
							}
					},
					error : function(jqXHR, textStatus, errorThrown) {
						/* new PNotify({
															title : "Failure",
															text : "Error occured in While Emailing",
															type : "error",
															pnotify_animate_speed : fadeOutduration,
															opacity : .8
											}); */
					}

				});	
				return result;
			}
			
			 $.validator.addMethod("checkDuplicateClientId", function(value, element) {

				  return  !checkDuplicateClientId();

				},'Client ID Already Exists' ); 
			
			
			
			
		$("#secret_info").hover(function()
				{
			
			$("#secret_info").popover({
				trigger: "mouseenter mouseleave",
				html:true,
				title: "Secret Essentials",
			    content:function() {
			    	return $('#secret_info_content').html();
			    },
				placement : "top"
			});
			
				});
		});