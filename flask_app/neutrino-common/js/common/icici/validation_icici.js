function saveForm_icici() {
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	
	var formTemp = $("#masterForm");
	$("#createAnotherMaster").val(isChecked);
	
	formTemp.submit();
	if(formTemp.valid()){
	$('body').modalmanager('loading');
    }
	 
}

function saveAndSendForApproval_icici(context) {
	
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	form.action = context + "/app/" + masterID + "/ICICI/saveAndSendForApproval";
	if ($(".form").valid()){
		form.submit();
	//$('body').modalmanager('loading');
	}
}

function editMasterRecord_icici(context) {
	var masterID = document.getElementById("masterID").value;
	var ID = document.getElementById("id").value;
	var form = document.getElementById("masterForm");
	form.action = context + "/app/" + masterID + "/ICICI/edit/" + ID;
	if ($(".form").valid())
		form.submit();
}