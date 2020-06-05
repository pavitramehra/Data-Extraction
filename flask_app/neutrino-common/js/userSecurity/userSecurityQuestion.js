$(function() {
		
		var selectedFirstSecurityQuestion='';
		var selectedSecondSecurityQuestion='';
		
		$(document).on("keyup keydown change","select[id*='securityQuestion']", function(e) {
			
			selectedFirstSecurityQuestion=$('#securityQuestion\\[0\\]').val();
			selectedSecondSecurityQuestion=$('#securityQuestion\\[1\\]').val();
			
			disableOptionElementOnKeyEvent(e.keyCode);
						
			if(selectedFirstSecurityQuestion =="" || selectedSecondSecurityQuestion =="")
			getSecutiryQusetion($(this).prop('id'));
			
			
			if(selectedFirstSecurityQuestion !="")
			{
				$('#securityQuestion\\[1\\]').find("option").each(function(){
					if(selectedFirstSecurityQuestion == $(this).val()){
						$(this).prop('disabled', true).hide()
					}else{
						$(this).prop('disabled',false).show();
					}
				});
			}else{
				enableOptionElementIfDisabled('securityQuestion\\[1\\]');
			} 
			
			if(selectedSecondSecurityQuestion !="")
			{
				$('#securityQuestion\\[0\\]').find("option").each(function(){
					if(selectedSecondSecurityQuestion == $(this).val()){
						$(this).prop('disabled', true).hide()
					}else{
						$(this).prop('disabled',false).show();
					}
				});
			}else{
				enableOptionElementIfDisabled('securityQuestion\\[0\\]');
			} 
			
		});
		
		function enableOptionElementIfDisabled(elementId){
			 $('#'+elementId).find("option").each(function(){
					if($(this).is(':disabled')){
						$(this).prop('disabled',false);
					}
			});	
		}
		
		function disableOptionElementOnKeyEvent(keyCode){
			
			if(keyCode == 40 || keyCode == 38){							
					if(selectedFirstSecurityQuestion !=""){
						$('#securityQuestion\\[1\\]').find("option").each(function(){
							if(selectedFirstSecurityQuestion == $(this).val()){
								$(this).prop('disabled',true);
							}else{
								$(this).prop('disabled',false);
							}
						});
					}
					
					if(selectedSecondSecurityQuestion !=""){
						$('#securityQuestion\\[0\\]').find("option").each(function(){
							if(selectedSecondSecurityQuestion == $(this).val()){
								$(this).prop('disabled',true);
							}else{
								$(this).prop('disabled',false);
							}
						});
					}		
					
			 }			
		}				
				
		$(document).on("click","select[id*='securityQuestion']", function() {

			if($('#securityQuestion\\[0\\]').find('option:visible').length == 1){
				$('#securityQuestion\\[1\\]').find("option").each(function(){
					if($(this).val() != "" && selectedSecondSecurityQuestion != $(this).val())
							$('#securityQuestion\\[0\\]').find('option[value="' + $(this).val() + '"]').removeAttr('style');
				});
			}
			
			if($('#securityQuestion\\[1\\]').find('option:visible').length == 1){
				$('#securityQuestion\\[0\\]').find("option").each(function(){
					if($(this).val() != "" && selectedFirstSecurityQuestion != $(this).val())
							$('#securityQuestion\\[1\\]').find('option[value="' + $(this).val() + '"]').removeAttr('style');
				});
			}
			
		});
		
		function getSecutiryQusetion(id)
		{
			if(id=='securityQuestion[0]'){
				if(selectedFirstSecurityQuestion =="")
				{
					$('#securityQuestion\\[0\\]').find("option").each(function(){
						$('#securityQuestion\\[1\\]').find('option').removeAttr('style');
					});
				}
			}
			else{
				if(selectedSecondSecurityQuestion =="")
				{
					$('#securityQuestion\\[1\\]').find("option").each(function(){
						$('#securityQuestion\\[0\\]').find('option').removeAttr('style');
					});
				}
			}
				
		}

	});
	
function saveSecurityQuestions() {
	$("#securityQuestionsForm").validate();
		if($("#securityQuestionsForm").valid()){
			$.ajax({

				type : 'POST',
				url : getContextPath() + "/app/User/saveSecurityQuestions",
				async : false,
				data : $("#securityQuestionsForm").serialize() ,
					success : function(jqXHR) {
						new PNotify({
							title : "",
							text : "User Security Questions updated successfully",
							type : "success",
							pnotify_animate_speed : fadeOutduration,
							opacity : .8
						});
						
					$('#editSecurityQuesModalWindow').modal('hide');
					},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
					}
			});
	}
}