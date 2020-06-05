var businessPartnerType_Dealer;
var businessPartnerId = 0;
var bpTypeCode ="";
$(function() {
	if ($("#businessPartnerId").val() != ""
			&& $("#businessPartnerId").val() != undefined) {
		businessPartnerId = $("#businessPartnerId").val();
	}
	bpTypeCode = $('option:selected', $("#businessPartnerType")).attr('data-code');
	var contextPath = getContextPath();
	
	var addressURL = contextPath + "/app/BusinessPartner/Address/loadPage/"+bpTypeCode+"/"
			+ businessPartnerId;
	if(viewMode) {
		$.ajax({
			type : "GET",
			url : addressURL,
			data : ({
				viewable : viewMode
			}),

			async : false,
			success : function(result) {
				$('#addressGrid').html(result);
			}
		});
	} else {
		$('#addressGrid').load(addressURL, function() {

		});
	}

	$('#childTabs').bind(
			'show.bs.tab',
			function(e) {
				var pattern = /#.+/gi // use regex to get anchor(==selector)

				var contentID = e.target.toString().match(pattern)[0];

				loadChildTabs(contentID);
			});





});

function loadChildTabs(contentID){
	var contextPath = getContextPath();
	bpTypeCode = $('option:selected', $("#businessPartnerType")).attr('data-code');
var	addressURL = contextPath
			+ "/app/BusinessPartner/Address/loadPage/"+bpTypeCode+"/"+ businessPartnerId;
var	bankAccountURL = contextPath+ "/app/BusinessPartner/BankAccount/loadPage/"+bpTypeCode+"/" + businessPartnerId;
	// $("#bankAccount").html("");
var branchUrl=contextPath+"/app/BusinessPartner/loadBranches/"+bpTypeCode+"/"+businessPartnerId;
var productUrl=contextPath+"/app/BusinessPartner/loadBranchProducts/"+bpTypeCode+"/"+businessPartnerId;

	var url = "";
	if (contentID == "#addressGrid" ) {
		if($(contentID).html()=="")
		{
		url = addressURL;
		}
		$("#BankAccountDiv").hide();
		$("#product").hide();
		$('#branch').hide();
		$("#addressGrid").show();
	}
	if (contentID == "#BankAccountDiv") {
		if($(contentID).html()=="")
		{
		url = bankAccountURL;
		}

		$("#addressGrid").hide();
		$("#product").hide();
		$('#branch').hide();
		$("#BankAccountDiv").show();

	}

	if (contentID == "#product") {
		if($(contentID).html()=="" || branchChangedFlag)
		{
		url = productUrl;
		}
		$("#addressGrid").hide();
		$('#branch').hide();
		$("#BankAccountDiv").hide();
		$("#product").show();


	}
	if (contentID == "#branch" ) {
		if($(contentID).html()=="")
		{
		url = branchUrl;
		}
		$("#product").hide();
		$("#addressGrid").hide();
		$("#BankAccountDiv").hide();
		$("#product").hide();
		$("#branch").show();

	}

	
	if(url!=""){
		if (contentID == "#BankAccountDiv" && viewMode)
			
				
				
			{
			$
			.ajax({
				type : "GET",
				url : bankAccountURL,
				data : ({
					viewable : viewMode
				}),

				async : false,
				success : function(result) {
					$(contentID)
					.html(result);
				}
			});
			
			
			
			
			}
	
		
		else
		$(contentID).load(url,"approvalStatusForBusinessPartner="+$("#approvalStatusForBusinessPartner").val(), function() {
			if(viewMode) {
				$("#businessPartnerBranchTree").dynatree("disable");
				$("#businessPartnerBranchProductTree").dynatree("disable");
				$("#defaultBranch").attr("disabled", "disabled");
			}
  		});
	}
}


	function getMandatoryTabs(code) {
		if (code == "Dealer_Supplier") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").removeClass("hide");
			$("#productMandatorySpan").removeClass("hide");
		}
		else if (code == "Manufacturer") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").addClass("hide");
			$("#productMandatorySpan").removeClass("hide");
		}
		else if (code == "FI_Agent") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").removeClass("hide");
			$("#productMandatorySpan").removeClass("hide");
		}
		else if (code == "FI_Agency") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").removeClass("hide");
			$("#productMandatorySpan").removeClass("hide");
		}
		else if (code == "Insurance_Company") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").removeClass("hide");
			$("#productMandatorySpan").addClass("hide");
		}
		else if (code == "DSA") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").removeClass("hide");
			$("#productMandatorySpan").removeClass("hide");
		}
		else if (code == "DME") {
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").addClass("hide");
			$("#productMandatorySpan").addClass("hide");
		}else if(code == "DSE"){
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").addClass("hide");
			$("#productMandatorySpan").addClass("hide");
		}
		else{
			$("#addressMandatorySpan").addClass("hide");
			$("#bankAccMandatorySpan").addClass("hide");
			$("#branchMandatorySpan").addClass("hide");
			$("#productMandatorySpan").addClass("hide");
		}
	}

$(document).ready(function() {


	getResource();

	bpTypeCode = $('option:selected', $("#businessPartnerType")).attr(
			'data-code');

	if ($("#businessPartnerType").val() != "") {
		$("#businessPartnerChildTabs").removeClass("block-no");
		getMandatoryTabs(bpTypeCode);
	} else {
		$("#businessPartnerChildTabs").addClass("block-no");
	}
	$("#businessPartnerType").change(
			function() {
				bpTypeCode = $('option:selected',this).attr('data-code');
				if ($("#businessPartnerType").val() != "") {
					$("#businessPartnerChildTabs").removeClass(
							"block-no");
					getMandatoryTabs(bpTypeCode);
					var contentID = "#addressGrid";
					$("#product").html("");
					$("#addressGrid").html("");
					$("#BankAccountDiv").html("");
					$("#branch").html("");
					$("#addressTab").addClass("active");
					$("#bankAccountTab").removeClass("active");
					$("#branchTab").removeClass("active");
					$("#productTab").removeClass("active");
					loadChildTabs(contentID);



				} else {
					$("#businessPartnerChildTabs").addClass(
							"block-no");
				}


			});



});

function getResource() {
	jQuery.i18n.properties({
		name : 'JS_Messages',
		path : getContextPath() + '/resource-bundles/JS_Messages/',
		mode : 'both',
		cache : true ,
		// language:lang,
		callback : function() {

			// jQuery.i18n.prop('businessPartnerType_Dealer');
			jQuery.i18n.prop('relationship');
			jQuery.i18n.prop('dateOfBirth');
			jQuery.i18n.prop('phoneNumber');
			jQuery.i18n.prop('emailID');
			jQuery.i18n.prop('occupation');

			colNames = [ 'viewId', 'id', member.name, relationship,
					dateOfBirth, 'Education Status', phoneNumber, emailID,
					occupation, isDependent, 'numberOfDependentChildrens' ];

		}
	});

}


