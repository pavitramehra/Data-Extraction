var buildingId = 0;
var viewMode = viewMode;
$(function() {
   if ($("#id").val() != "" && $("#id").val() != undefined) {
      buildingId = $("#id").val();
   }
   $("table").each(function() {
         if(this.id !== "building_payment_plan_table"){
            var isDataTable = $.fn.DataTable.fnIsDataTable( this );
            if (isDataTable)
            {
               $(this).DataTable().destroy();
            }
         }
      });

   $('#parameterTable').css('width', '');
   var baseURL = getContextPath() + "/app/Building/" + childId
         + "/loadPage/" + buildingId;
   // load content for first tab and initialize
   $('#BuildingWingDiv').load(baseURL, function() {
      //$('#childTabs').tab(); // initialize tabs
   });
	/*$('#childTabs').bind('show.bs.tab', function(e) {
     var pattern = /#.+/gi // use regex to get anchor(==selector)
      var contentID = e.target.toString().match(pattern)[0]; // get anchor
      // load content for selected tab
      $(contentID).load(baseURL, function() {
         $('#childTabs').tab(); // reinitialize tabs
      });
   });*/

   $("#buildingWingForm").validate({
      errorClass : "help-block",
      errorElement : "span",
      highlight : function(element, errorClass, validClass) {
         $(element).parents('.form-group').addClass('error');
         $(element).parents('.form-group').removeClass('success');
      },
      unhighlight : function(element, errorClass, validClass) {
         $(element).parents('.form-group').removeClass('error');
         $(element).parents('.form-group').addClass('success');
      },
      invalidHandler : function(form, validator) {
         $.sticky(error_message, {
            autoclose : 5000,
            position : "top-right",
            type : "st-error"
         });
      }
   });

});

function createBuildingWing() {
	$('#childModalWindowDoneButtonBuildingWing').show();
	$('#create_another_BuildingWing').removeAttr("disabled");
	$
			.ajax({

				url : getContextPath() + "/app/" + parentid + "/" + childId
						+ "/create",
				type : 'POST',
				async : true,
				data : $('#masterForm').serialize(),
				success : function(jqXHR) {
					$('#childModal' + childId).html(jqXHR);
					$('#dialog-form-' + childId).modal('show');
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});

}

function checkForCreateAnotherBuildingWing() {
	var isBuildingWingChecked = $("#create_another_"+childId).prop('checked') ? true : false;
	if (isBuildingWingChecked) {
		var millisecondsToWait = 1000;
		setTimeout(function() {
			createBuildingWing();
		}, millisecondsToWait); 		
	}
	else{
		closeChildDialog(childId);
	}
}

function saveToSession() {
	$("#buildingWingForm").validate({
		errorClass : "help-block",
		errorElement : "span",
		highlight : function(element, errorClass, validClass) {
			$(element).parents('.form-group').addClass('error');
			$(element).parents('.form-group').removeClass('success');
		},
		unhighlight : function(element, errorClass, validClass) {
			$(element).parents('.form-group').removeClass('error');
			$(element).parents('.form-group').addClass('success');
		},
		invalidHandler : function(form, validator) {
			$.sticky(error_message, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
	});
	if ($("#buildingWingForm").valid()) {

	if(returnId==undefined){
    		returnId= "";
    	}
	checkForDuplicateWingCodes($('#buildingWingCode').val());
	}
}

	function checkForDuplicateWingCodes(wingCode){
	$.ajax({
		url : getContextPath() + "/app/" + parentid + "/" + childId
		+ "/checkDuplicateWingCode",
		async : false,
		data : {
			wingCode : wingCode,
			wingId : wingId,
			buildingId : buildingId,
		},
		success : function(status) {
			if(status == "true" || status == true){
				new PNotify({
					title : error,
					text : 'Duplicate Codes are not allowed for Building Wings',
					type : 'error',
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				  });
				  return;
			}
			else{
				$.ajax({
					type : "POST",
					url : getContextPath() + "/app/" + parentid + "/" + childId
							+ "/validationOnBuildingWing",
					data : $('#buildingWingForm').serialize() + "&parentId="
							+ buildingId + "&returnId="+returnId,
					async : true,
					success : function(result) {
						if (!isNaN(result)) {
							copyPaymentPlan($("#id").val(),result);
							$("#id").val(result);
							loadPaymentPlan(false);
							buildingId = result;
							closeChildDialog(childId);
							var baseURL = getContextPath() + "/app/" + parentid + "/"
									+ childId + "/loadPage/" + buildingId;
							$('#BuildingWingDiv').load(baseURL, function() {
								$('#childTabs').tab(); // initialize tabs
							});
							// $("#externalBankBranchDiv").html(result);
							checkForCreateAnotherBuildingWing();
						} else {

							$('#childModal' + childId).html(result);
							$('#dialog-form-' + childId).modal('show');
							// $("#SubIndustryDiv").html(result);
						}
					}
				});
		    }
		}
	});		
}