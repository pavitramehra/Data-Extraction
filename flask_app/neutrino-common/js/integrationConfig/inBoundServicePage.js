$(function() {
		var buttonHeight = "custom-multiselect";
		var buttonWidth = "100%";
		var buttonClass = "btn";
		var showCountAfter = 1;

		$('.dr_multi_select')
				.multiselect(
						{

							buttonText : function(options, select) {
								if (options.length == 0) {
									return none_granted+' &nbsp;<b class="caret"></b>';
								} else if (options.length > showCountAfter) {
									return options.length
											+ ' '+ granted +'  &nbsp;<b class="caret"></b>';
								} else {
									var selected = '';
									options.each(function() {
										selected += $(this).text() + ' ,';
									});
									return selected.substr(0, selected.length
											- showCountAfter - 1)
											+ '&nbsp;<b class="caret"></b>';
								}
							},
							buttonClass : buttonClass,
							maxHeight : 200,
							includeSelectAllOption : false,
							buttonWidth : buttonWidth,
							buttonContainer : '<div class="btn-group reset-m col-sm-12 '
					+ buttonHeight + '" />'
						});
		
		$('.custom-multiselect input[type="checkbox"]').attr("disabled","disabled");

		$('body')
				.on(
						"click",
						'#createCertificateNow',
						function() {

							if ($("#systemUserCreateFormId").valid()) {
								if ($("#dynamicFormReport").is(":checked")) {
									var submitUrl = getContextPath()
											+ "/app/integrationConfig/submit/getCertNow";
								} else {
									var submitUrl = getContextPath()
											+ "/app/integrationConfig/submit/getCertNow";
								}

								$("#systemUserCreateFormId").attr("action",
										submitUrl);
								$("#systemUserCreateFormId").submit();
							} else {
								// notify error
								notifyStatusTags(
										label_application_fill_required_fields,
										failure);
							}
						});
		
		 $('.access_hrs').change(function(e) {
		        if (this.id == 'fullDay') {
		            $('.access_hrs_window input').attr("disabled","disabled");
		        } else {
		            $('.access_hrs_window input').removeAttr("disabled");
		        }
		      });
		 
		 
		 $('body').on("click","#saveAndApplySettingsBtn",function(e) {
			 $("#inBoundServiceForm").attr('action', getContextPath()+"/app/integrationConfig/inbound/update").submit();
		      });
		 
		 
		
		});