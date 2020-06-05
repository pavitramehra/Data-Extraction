$(document).ready(function() {
	
	//Preparing View/Edit Mode
	if (viewMode == "true") {
		$("input[type='checkbox']").attr("disabled", "disabled");
		$("input.transferButtons").attr("disabled", "disabled");
	} else {
		$("input[type='checkbox']").removeAttr("disabled");
		$("input.transferButtons").removeAttr("disabled");
	}
	
});

(function(){
	var masterSaveForm=saveForm;
	saveForm=function(){
		if(!isTeamLeadSet()){
			return;
		}
		masterSaveForm.apply(this,arguments);
	}
	
	var mastersaveAndSendForApproval=saveAndSendForApproval;
	saveAndSendForApproval=function(){
		if(!isTeamLeadSet()){
			return;
		}
		mastersaveAndSendForApproval.apply(this,arguments);
	}
	var isTeamLeadSet=function (){
		if($("#teamLeader").val()==""){
			new PNotify({
				title : "Error",
				text : label_team_lead_cant_empty,
				type : "error",
				pnotify_animate_speed : 10,
				opacity : 1
			});
			return false;
		}
		return true;
	}
	
})();
