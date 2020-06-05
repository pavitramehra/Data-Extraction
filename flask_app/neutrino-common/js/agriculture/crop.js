var cropId = 0;
var viewMode = viewMode;
var districtIds;
$(document).ready(function() {
	
	districtIds  =$("#districtIds").val();
	
	if ($("#id").val() != "" && $("#id").val() != undefined) {
		cropId = $("#id").val();
	}
	if(viewMode == ""){
		viewMode = false;
	}
	
	var baseURL = getContextPath() + "/app/" + parentid + "/" + childId
			+ "/loadPage/" + cropId+"/"+viewMode;
	// load content for first tab and initialize
	$('#CropDetailsVoDiv').load(baseURL, function() {
		$('#childTabs').tab(); // initialize tabs
	});
	$('#childTabs').bind('show.bs.tab', function(e) {
		var pattern = /#.+/gi // use regex to get anchor(==selector)
		var contentID = e.target.toString().match(pattern)[0]; // get anchor
		// load content for selected tab
		$(contentID).load(baseURL, function() {
			$('#childTabs').tab(); // reinitialize tabs
		});
	});
});


function createCropDetailsVo() {

	$('#childModalWindowDoneButtonCropDetailsVo').show();
	$('#create_another_CropDetailsVo').removeAttr("disabled");

	$
			.ajax({

				url : getContextPath() + "/app/" + parentid + "/" + childId
						+ "/create",
				type : 'POST',
				async : false,
				data : $('#masterForm').serialize(),
				success : function(jqXHR) {
					$('#childModal' + childId).html(jqXHR);
					$('#dialog-form-' + childId).modal('show');
					$('#dialog-form-CropDetails').css('width','100%!important');
					$('#dialog-form-CropDetails').css('height','auto');
				},
				error : function(jqXHR, textStatus, errorThrown) {
					new PNotify({
						title : "Failure",
						text : errorThrown,
						type : "error",
					});
				}
			});
			var timeInterval = setTimeout(function() {
				$('#country').focus();
				clearTimeout(timeInterval);
			}, 500);
}

function saveToSession(){
	
	var isChecked = $("#create_another_CropDetails").prop('checked') ? true : false;
	if ($("#cropDetailsForm").valid() &&  $('#masterForm').valid()) {
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/" + parentid + "/" + childId
					+ "/validationOnCropDetails",
			data : $('#cropDetailsForm').serialize() + "&" + $('#masterForm').serialize() + "&parentId=" + cropId,

			success : function(result) {
				if (!isNaN(result)) {
					$("#id").val(result);
					$("#crop_master_id").val(result);
					$("#cropId").val(result);
					cropId = result;
					//closeChildDialog(childId);
					$('#dialog-form-' + childId).modal('hide');
					/*alert(cropId);
					var baseURL = getContextPath() + "/app/" + parentid + "/"
							+ childId + "/loadPage/" + cropId+"/"+viewMode;
					$('#CropDetailsVoDiv').load(baseURL, function() {
						$('#childTabs').tab(); // initialize tabs
					});*/
					var baseURL = getContextPath() + "/app/" + parentid + "/"+masterId +"/" +  "loadPage/" + cropId+"/false";
					
					$('#CropDetailsVoDiv').load(baseURL, function() {
						$('#childTabs').tab(); // initialize tabs
						if(isChecked == true)
						 {
						  createCropDetailsVo();
						  isChecked=false;
						  }
					});

				} else {
					
					var combError= $("#combError",result).val();
					if(combError=="true"){
					new PNotify({
						title : "Failure",
						text : "Combination of Crop, State, District, Product already exists",
						type : "error",
					});
}
					$('#childModal' + childId).html(result);
					$('#dialog-form-' + childId).modal('show');
				}
			},error : function(result,textStatus,errorThrown) {
					new PNotify({
						title : "Failure",
						text : errorThrown,
						type : "error",
					});
			}
		});
	}
}

function saveForm() {

 if( (($('#CropDetails').DataTable()).row().length) == 0){
            new PNotify({
                     title : "Failure",
                     text : "No Child Record Found!",
                     type : "error",
                 });
     	return;
         }
	 var isChecked = $("#create_another_master").prop('checked') ? true
			: false;

	var formTemp = $("#masterForm");
	$("#createAnotherMaster").val(isChecked);        		        		
	if(formTemp.valid()){
		formTemp.submit();	
		$('body').modalmanager('loading');
	    }

}	
function saveAndSendForApproval(context) {
    var masterID = document.getElementById("masterID").value;
        var form = document.getElementById("masterForm");
         		if(form==null) {
         			new PNotify({
         				title : 'error',
         				text : 'Please fill required fields',
         				type : 'error',
         				pnotify_animate_speed : .8,
         				opacity : 1
         			});
         	return;
         }
		
     if( (($('#CropDetails').DataTable()).row().length) == 0){
            new PNotify({
                     title : "Failure",
                     text : "No Child Record Found!",
                     type : "error",
                 });
     	return;
         }
	var isChecked = $("#create_another_master").prop('checked') ? true : false;
	$("#createAnotherMaster").val(isChecked);
	var masterID = document.getElementById("masterID").value;
	var form = document.getElementById("masterForm");
	if ($(".form").valid()){
		form.action = context + "/app/" + masterID + "/saveAndSendForApproval";
		updateChileRecords('masterForm');
		form.submit();
	$('body').modalmanager('loading');
	}
}

$('body').on("click","#Delete",function() {
	/*alert("inside");
	var currUrl = window.location.href;
	var splitString = currUrl.split('?');
	var paramString = splitString[1];
	if(typeof paramString =="undefined"){
		paramString="";
	}
	var a = $("#id").val();
	//alert(a);
	//alert(parentId);
	var baseURL = contextPath
	+ "/app/"+parentId+"/edit/"+$("#id").val()+"?"
	+ paramString;
	setTimeout(function(){neutrinoNavigateTo(baseURL), 1000});*/
	
		  $.getScript(getContextPath()+"/static-resources/neutrino/neutrino-common/js/agriculture/cropDetails.js");
		  
			

	
});


$('body').on("click","#DeleteCropDetailsBttn",function() {
	/*alert("inside");
	var currUrl = window.location.href;
	var splitString = currUrl.split('?');
	var paramString = splitString[1];
	if(typeof paramString =="undefined"){
		paramString="";
	}
	var a = $("#id").val();
	//alert(a);
	//alert(parentId);
	var baseURL = contextPath
	+ "/app/"+parentId+"/edit/"+$("#id").val()+"?"
	+ paramString;
	setTimeout(function(){neutrinoNavigateTo(baseURL), 1000});*/

		  $.getScript(getContextPath()+"/static-resources/neutrino/neutrino-common/js/agriculture/cropDetails.js");
		  
			

	
});