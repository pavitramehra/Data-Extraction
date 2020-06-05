function saveForm_DCB() {
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	
	var formTemp = $("#masterForm");
	$("#createAnotherMaster").val(isChecked);
	
	if(formTemp.valid()){
		formTemp.submit();
		$('body').modalmanager('loading');
    }
	 
}

function saveAndSendForApproval_DCB(context) {
	
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	form.action = context + "/app/" + masterID + "/DCB/saveAndSendForApproval";
	if ($(".form").valid()){
		form.submit();
	//$('body').modalmanager('loading');
	}
}

function editMasterRecord_DCB(context) {
	var masterID = document.getElementById("masterID").value;
	var ID = document.getElementById("id").value;
	var form = document.getElementById("masterForm");
	form.action = context + "/app/" + masterID + "/DCB/edit/" + ID;
	if ($(".form").valid())
		form.submit();
}