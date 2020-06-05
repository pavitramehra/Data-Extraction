	var industryId = 0;

	var viewMode = viewMode;
	var baseURL = "";

	$(function() {
		if ($("#id").val() != "" && $("#id").val() != undefined) {
			industryId = $("#id").val();
		}

		baseURL = getContextPath() + "/app/" + parentid + "/"+ childId + "/loadPage/"
				+ industryId;

		/*//load content for first tab and initialize
		$('#SubIndustryDiv').load(baseURL, function() {
			$('#childTabs').tab(); //initialize tabs
		});
		$('#childTabs').bind('show.bs.tab', function(e) {
			var pattern = /#.+/gi //use regex to get anchor(==selector)
			var contentID = e.target.toString().match(pattern)[0]; //get anchor   
			//load content for selected tab
			$(contentID).load(baseURL, function() {
				$('#childTabs').tab(); //reinitialize tabs
			});
		});*/
	});

	function createSubIndustry() {
		$("#childModalWindowDoneButtonSubIndustry").show();
		$
				.ajax({

					url : getContextPath() + "/app/" + parentid + "/"+ childId + "/create",
					type : 'POST',
					async : false,
					data : $('#masterForm').serialize(),
					success : function(jqXHR) {

						$('#childModal'+childId).html(jqXHR);
						$('#dialog-form-'+childId).modal('show');
					},
					error : function(jqXHR, textStatus, errorThrown) {
						alert(jqXHR + " : " + textStatus + " : " + errorThrown);
					}
				});

	}

	function saveToSession() {
		if ($("#subIndustryForm").valid()) {

			$
					.ajax({
						type : "POST",
						url : getContextPath() + "/app/" + parentid + "/"+ childId + "/validationOnSubIndustry",
						data : $('#subIndustryForm').serialize() + "&parentId="
								+ industryId,

						success : function(result) {

							if (!isNaN(result)) {
								industryId = result;
								$("#id").val(result);
								closeChildDialog();
								var baseURL = getContextPath() + "/app/" + parentid + "/"+ childId + "/loadPage/"
										+ industryId;
								$('#SubIndustryDiv').load(baseURL, function() {
									$('#childTabs').tab(); //initialize tabs
								});
								closeChildDialog();
								
							} else {
								$('#childModal'+childId).html(result);
								$('#dialog-form-'+childId).modal('show');
								//$("#SubIndustryDiv").html(result);
							}
						},
						error : function(result) {
							alert(result);
						}
					});

		}
	}