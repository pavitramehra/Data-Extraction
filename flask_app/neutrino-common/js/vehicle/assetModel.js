var assetModelId = 0;
var viewMode = viewMode;
$(function() {
	if ($("#id").val() != "" && $("#id").val() != undefined) {
		assetModelId = $("#id").val();
	}
	if(viewMode == ""){
		viewMode = false;
	}
	var baseURL = getContextPath() + "/app/" + parentid + "/" + childId
	+ "/loadPage/" + assetModelId+"/"+viewMode;
	// load content for first tab and initialize
	$('#assetVariant').load(baseURL, function() {
		$('#childTabs').tab(); // initialize tabs
	});
	$('#childTabs').bind('show.bs.tab', function(e) {
		var pattern = /#.+/gi // use regex to get anchor(==selector)
		var contentID = e.target.toString().match(pattern)[0]; // get anchor
		// load content for selected tab
		/*$(contentID).load(baseURL + contentID.replace('#', ''), function() {
			$('#childTabs').tab(); // reinitialize tabs
		});*/

		loadChildTabs(contentID);
	});
	

});
function loadChildTabs(contentID){
	var contextPath = getContextPath();

	var baseURL = getContextPath() + "/app/" + parentid + "/" + childId
	+ "/loadPage/" + assetModelId+"/"+viewMode;
	var slpUrl = getContextPath() + "/app/" + parentid +"/loadPageForSellingPrice/" + assetModelId+"/"+viewMode;
	var url = "";
	if (contentID == "#assetVariant" ) {
	 url = baseURL;
	 $("#sellingPrice").hide();
		$("#assetVariant").show();
		$("#createVariantButton").show();
	}
	if (contentID == "#sellingPrice") {
			url = slpUrl;
	
		$("#assetVariant").hide();
		$("#createVariantButton").hide();
			$("#sellingPrice").show();

	}



	
	if(url!=""){
			$
			.ajax({
				type : "GET",
				url : url,
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
}
function createAssetVariant() {

	$('#childModalWindowDoneButtonAssetVariant').show();
	$('#create_another_AssetVariant').removeAttr("disabled");

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
				$('#variantName').focus();
				clearTimeout(timeInterval);
			}, 500);
}

function saveToSession() {
	if(viewMode == ""){
		viewMode = false;
	}
	
	if ($("#assetVariantForm").valid()) {
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/" + parentid + "/" + childId
					+ "/validationOnAssetVariant",
			data : $('#assetVariantForm').serialize() + "&parentId="
					+ assetModelId+"&sellingPriceDetListFinalJson="+$('#sellingPriceDetailListJsonForVar').val(),

			success : function(result) {

				if (!isNaN(result)) {
					$("#id").val(result);
					assetModelId = result;
					closeChildDialog(childId);
					
					var baseURL = getContextPath() + "/app/" + parentid + "/"
							+ childId + "/loadPage/" + assetModelId+"/"+viewMode;
					$('#assetVariant').load(baseURL, function() {
						$('#childTabs').tab(); // initialize tabs
					});
					closeChildDialog(childId);
					checkForCreateAnother();
				} else {

					$('#childModal' + childId).html(result);
					$('#dialog-form-' + childId).modal('show');
				}
			}
		});
	}
}

function checkForCreateAnother() {

	var createAnother = $("#create_another_AssetVariant").prop('checked') ? true
			: false;
	if (createAnother) {
		var millisecondsToWait = 1000;
		setTimeout(function() {
			openChildDialog('create', 0, childId, 'AssetModel');
		}, millisecondsToWait);

	} else {
		closeChildDialog(childId);
	}

}