$(document).ready(function() {
	$("#countryName").change(function() {
		loadOtherDetails();
	});
});

function loadOtherDetails() {

	var countryName = $("#countryName").val();
	if(countryName != ""){
	$.ajax({
		type : "GET",
		url : getContextPath()+"/app/Country/getOtherDetailsByCountryName/"
				+ countryName,
		success : function(otherDetails) {
			$("#countryISOCode").val(otherDetails[0]);
			$("#countryISDCode").val(otherDetails[1]);
		}
	});
	}
	
}
