$(function() {
		var buttonHeight = "custom-multiselect";
		var buttonWidth = "100%";
		var buttonClass = "btn";
		var showCountAfter = 1;
		var selectAllText = "Select/Deselect All";

		$('.dr_multi_select')
				.multiselect(
						{

							buttonText : function(options, select) {
								if (options.length == 0) {
									return none_granted+'&nbsp;<b class="caret"></b>';
								} else if (options.length > showCountAfter) {
									return options.length
											+' '+granted+' &nbsp;<b class="caret"></b>';
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
							includeSelectAllOption : true,
							selectAllValue : "",
							selectAllText : selectAllText,
							enableFiltering : true,
							filterPlaceholder : 'Search',
							buttonWidth : buttonWidth,
							buttonContainer : '<div class="btn-group reset-m col-sm-12 '
					+ buttonHeight + '" />'
						});

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

		$.extend($.inputmask.defaults.definitions, {
			
			'x' : {
				validator : "[0-2]",
				cardinality : 1,
				definitionSymbol : "i" //this allows shifting values from other definitions, with the same masksymbol or definitionSymbol
			},
			'y' : {
				validator : function(chrs, buffer, pos, strict, opts) {
					var valExp2 = new RegExp("2[0-5]|[01][0-9]");
					return valExp2.test(buffer[pos - 1] + chrs);
				},
				cardinality : 1,
				definitionSymbol : "i"
			},
			'z' : {
				validator : function(chrs, buffer, pos, strict, opts) {
					var valExp3 = new RegExp(
							"25[0-5]|2[0-4][0-9]|[01][0-9][0-9]");
					return valExp3.test(buffer[pos - 2] + buffer[pos - 1]
							+ chrs);
				},
				cardinality : 1,
				definitionSymbol : "i"
			}

		});

		$(".time_range input").inputmask("h:s", {
			"placeholder" : "HH:MM"
		});
		$(".ipaddress_range input").inputmask("xyz.xyz.xyz.xyz");
		
		
		 $('.access_hrs').change(function(e) {
		        if (this.id == 'fullDay') {
		            $('.access_hrs_window input').attr("disabled","disabled");
		        } else {
		            $('.access_hrs_window input').removeAttr("disabled");
		        }
		      });
		 
		 $('body')
			.on(
					"change",
					'#throttleRequests',
					function() {

						if ($(this).is(":checked")) {
							$(".throttle_config_div input").removeAttr('disabled');
							if($('#fullDay').is(':checked'))
							{
								 $('.access_hrs_window input').attr("disabled","disabled");
							}
							
							
						} else {
							
							$(".throttle_config_div input").attr('disabled', 'disabled');
						}
					});
		
	});