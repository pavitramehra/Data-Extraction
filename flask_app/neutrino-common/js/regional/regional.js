/*$(document).ready(function() {
		var screenSectionIdValue = $('#screenSectionId').val();
		$.ajax({
			type :'POST',
			async :false,
			url  :getContextPath()+"/app/regionalDynamicFields/paintRegionalFields",
			data : ({"screenSectionIdValue" : screenSectionIdValue}),
			success :function(data){
				//alert(data);	
				var html = null;
				$.each(data.regionalsFields, function(i, field) {
					var regionalVisibility =field.regionalVisibility;
					var divId =field.divId;
					divId="#"+divId;
					if(regionalVisibility =="false" ){
					 //$(divId).attr("hidden","true");
						$(divId).hide();
					}
					
					
                });
			}
		});
});*/

function changeDateFormat(date) {

	if (date.indexOf("/") > 0 && date.indexOf("-") < 0) {
		var datePartition = date.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

		if (datePartition)
			return dateInMMddyyyFormat = datePartition[2] + "/"
					+ datePartition[1] + "/" + datePartition[3];

	}

	if (date.indexOf("-") > 0 && date.indexOf("/") < 0) {
		var datePartition = date.split(/(\d{1,2})\-(\d{1,2})\-(\d{4})/);

		if (datePartition)
			return dateInMMddyyyFormat = datePartition[2] + "-"
					+ datePartition[1] + "-" + datePartition[3];
	}
}

//function changeToGregorianOrHijriDate(id,date, convertTo) {
//	var dateInMMddyyyFormat = changeDateFormat(date);
//
//	jQuery.ajax({
//		url : getContextPath() + "/app/hijriGregorianMapping/convertDate",
//		type : "POST",
//		dataType : "json",
//		data : {
//			date : dateInMMddyyyFormat,
//			convertTo : convertTo
//		},
//		success : function(data) {
//			
//			if (convertTo == "hijri") {
//				$('#'+id).val(data.hijriDate);
//			} else if (convertTo == "gregorian") {
//				$('#'+id).val(data.gregorianDate);
//			}
//
//		}
//
//	});
//
//}