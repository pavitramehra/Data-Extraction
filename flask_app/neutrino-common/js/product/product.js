var categoryArray = new Array();
var makeArray = new Array();
var modelArray = new Array();
var variantArray = new Array();
var categoryOne = new Array();
var makeArrayOne = new Array();
var modelArrayOne = new Array();
var variantArrayOne = new Array();
var companyArray = new Array();
var projectArray = new Array();
var buildingArray = new Array();
var wingArray = new Array();
var companyOne = new Array();
var projectArrayOne = new Array();
var buildingArrayOne = new Array();
var wingArrayOne = new Array();
var productTypeName = "";
var branchIdArray = new Array();


if (view == "" || view == null) {
	view = false;
}

$(document)
		.ready(
				function() {
				var count;
					hideLeasingFields();
					var productType = $("#productType").val();

					productTypeName = $('#productType option:selected').attr(
							'data-code');
					$("#product_collateral_mapping").hide();
					$("#product_card_mapping").hide();
					$("#dynamic_form_mapping").hide();
					if((view || edit) && productTypeName!="CC") {
						showLeasingFields();
					}
					$("#productType").change(function() {

						if($('#productType option:selected').attr('data-code') == 'CC'){
							$(".CCIcici").hide();
							$("#isAvlblOnAllBranches").parents('span:first').addClass('uni-checked');
						}
						else{
							$("#isAvlblOnAllBranches").parents('span:first').removeClass('uni-checked');
							$(".CCIcici").show();
						}
						var productId = $("#productType").val();
						getProductTypeData();
						$(".leasingDiv").hide();
						hideLeasingFields();
						$("#policy-container").load(
                       		 getContextPath() + "/app/LoanProduct/populatePolicies/" + $("#productType").val(),
                       		 function() {}
                        );
						
					});
					$("#moduleNameProductBranch option").eq(1).attr("selected","selected"); 
					
					var systemName = $("#moduleNameProductBranch option:selected").data('code');

					loadBranchTree(systemName);
					setTimeout(function(){
						var checked = jQuery('#isAvlblOnAllBranches').is(':checked');
						
		if(checked){
          var count=$("#productBranchTree").dynatree("getTree").count();		
		$("#productBranchTree").dynatree("getTree").visit(function (node) {		
        node.select(true);
    });
		}
},1000);

	
					

					if (productType != "") {
						loadAssetBuilderDiv(productTypeName);
					}

					var validProductCode = function(value) {

						var validProductCode = new RegExp('^['+allowedAlphaCharSet+'0-9_]{1,8}$');

						return validProductCode.test(value);

					}

					$.validator.addMethod("validProductCode", function(value,
							element) {

						return validProductCode(value);

					}, "Please Enter a Valid Code");

					function getProductTypeData() {
						var productType;
						if ($("#productType").val() != "") {
							$
									.ajax({
										url : getContextPath()
												+ "/app/LoanProduct/populateProductDetails",
										data : "productType1="
												+ $("#productType").val(),
										success : function(data) {
											var dataObj = jQuery.parseJSON(data);
											/*var sel = $("#loanType")[0];
											$("#loanType").children().remove();
											option = document
													.createElement('option');
											option.setAttribute('value',
													dataObj.loanTypes.id);
											option
													.appendChild(document
															.createTextNode(dataObj.loanTypes.loanTypeName));
											sel.appendChild(option);*/
											$('#loanSecuredType').val(
													dataObj.loanSecuredType.id);
											$('#loanSecuredType').trigger(
													"chosen:updated");
											$('#loanSecuredType').valid();
											
											if (dataObj.loanSecuredType.code == 'LoanSecurityTypeUnsecured') {
												$('#loanSecuredType_chosen').addClass("chosen-disabled").css('pointer-events','none');
												disableUnSecuredType();
											}	
											
											if (dataObj.loanSecuredType.code == 'LoanSecurityTypeSecured') {
												$('#loanSecuredType_chosen').css('pointer-events','');
												enableSecuredType();
											}	

											if (dataObj.loanSecuredType.code == 'Unsecured') {
												$(
														"#loanSecuredType option[value=dataObj.loanSecuredType.id]")
														.attr("selected",
																"selected");
												$("#loanSecuredType")
														.removeClass('chosen_a');
												var a = document
														.getElementById("loanSecuredType");
												if (a.options[0].value == dataObj.loanSecuredType.id) {
													a.options[0].selected = true;
												}
											}
											//getSecurityType(dataObj.loanSecuredType.id);
											getSecurityTypeValue($(
													"#secureIdType").val());
											/*$("#productCategoryTree").dynatree(
													"getTree").reload();*/
											productType = $("#productType")
													.val();
											productTypeName = $(
													'#productType option:selected')
													.attr('data-code');
											loadAssetBuilderDiv(productTypeName);
											getSecurityType(dataObj.loanSecuredType.id);

										}
									});
						}
						if($("#hiddenProfile").val() == 'icici')
						{
						if($('#productType option:selected').attr('data-code') == 'CC'){
							$(".CCIcici").hide();
							$("#isAvlblOnAllBranches").parents('span:first').addClass('uni-checked');
						}
						else{
							$("#isAvlblOnAllBranches").parents('span:first').removeClass('uni-checked');
							$(".CCIcici").show();
						}
						}
					}

					$("#loanSecuredType").change(function() {		
					    var loanSecuredTypeName = $("#loanSecuredType option[value=" + $("#loanSecuredType").val()+ "]").attr('data-code')
						if (loanSecuredTypeName  == "LoanSecurityTypeSecured") {		
							var productTypeCode=$("#productType option:selected").attr("data-code");
							if(productTypeCode==personalLoanShortName || productTypeCode==agriLoanShortName)
							{                  
								$("#secureIdType option[data-code='CollateralBasedSecurity']").attr("selected","selected");
							}
						}						
						getSecurityType($("#loanSecuredType").val());
					});
					$("#secureIdType").change(function() {
						getSecurityTypeValue($("#secureIdType").val());
					});
					$(".productpolicy").hide();
					$(".productbranch").hide();
					$(".productcollateral").hide();
					$(".productcard").hide();
					$(".productDynamicForm").hide();

					// Function for the tabs Currency and Policy
					$('#childTabs')
							.bind(
									'show.bs.tab',
									function(e) {
										var pattern = /#.+/gi // use regex to
										// get
										// anchor(==selector)
										var contentID = e.target.toString()
												.match(pattern)[0]; // get
										// anchor
                                        
										if (contentID == "#currency") {
											$(".productpolicy").hide();
											$(".currency").show();
											$(".productbranch").hide();
											$(".productcollateral").hide();
											$(".productcard").hide();
											$(".productDynamicForm").hide();
										}
										
										if (contentID == "#productpolicy" ) {
											$(".currency").hide();
											$(".productpolicy").show();
											$(".productbranch").hide();
											$(".productcollateral").hide();
											$(".productcard").hide();
											$(".productDynamicForm").hide();
							
										}
									
										/*if (contentID == "#productpolicy" &&  $('#productType option:selected').attr('data-code') == 'CC' ) {
											$(".currency").hide();
											$(".productpolicy").hide();
											$(".productbranch").hide();
											$(".productcollateral").hide();
											$(".productcard").hide();
											$(".productDynamicForm").hide();
							
										}*/
										
										if (contentID == "#productbranch") {
											$(".currency").hide();
											$(".productpolicy").hide();
											$(".productbranch").show();
											$(".productcollateral").hide();
											$(".productcard").hide();
											$(".productDynamicForm").hide();
											
										}
										if (contentID == "#productcollateral") {
											$(".currency").hide();
											$(".productpolicy").hide();
											$(".productbranch").hide();
											$(".productcollateral").show();
											$(".productcard").hide();
											$(".productDynamicForm").hide();
											if (productTypeName == "ML" || productTypeName == "MHL") {
												/*loadProductCompanyTree(
														$(
																"#product_collateralSubType")
																.val(), view);*/
												if (companyOne != null
														&& companyOne != []
														&& companyOne.length > 0) {
													loadProductProjectTree(
															companyOne, view);
													if (projectArrayOne != null
															&& projectArrayOne != []
															&& projectArrayOne.length > 0) {
														loadProductBuildingTree(
																projectArrayOne,
																view);
														if (buildingArrayOne != null
																&& buildingArrayOne != []
																&& buildingArrayOne.length > 0) {
															loadProductWingTree(
																	buildingArrayOne,
																	view);
														}
													}
												}
											} else {
												/*loadProductCategoryTree(
														$(
																"#product_collateralSubType")
																.val(), view);
												expandCategoryTree();
												if (categoryOne != null
														&& categoryOne != []
														&& categoryOne.length > 0) {
													loadProductMakeTree(
															categoryOne, view);
													if (makeArrayOne != null
															&& makeArrayOne != []
															&& makeArrayOne.length > 0) {
														loadProductModelTree(
																makeArrayOne,
																view);
														if (modelArrayOne != null
																&& modelArrayOne != []
																&& modelArrayOne.length > 0) {
															loadProductVariantTree(
																	modelArrayOne,
																	view);
														}
													}
												}*/
											}

										}
										if (contentID == "#productcard") {
											$(".currency").hide();
											$(".productpolicy").hide();
											$(".productbranch").hide();
											$(".productcollateral").hide();
											$(".productcard").show();
											$(".productDynamicForm").hide();
										}
										
										if(contentID == "#productDynamicForm"){
											$(".currency").hide();
											$(".productpolicy").hide();
											$(".productbranch").hide();
											$(".productcollateral").hide();
											$(".productcard").hide();
											$(".productDynamicForm").show();
											
										}
									});
					if (view== false) {
						var secureId = $("#loanSecuredType").val();
						getSecurityTypeValue($("#secureIdType").val());
						var loanSecuredTypeName = $(
								"#loanSecuredType option[value=" + secureId
										+ "]").attr('data-code')
						if (loanSecuredTypeName == "LoanSecurityTypeSecured") {
							$("#secureIdType").attr("mandatory", true);
							$("#secureIdType").addClass("required");
							$("#secureIdType").attr("disabled", false);
							$("#secureIdType").parent("div").find("label").append("<span class='clr' style='color:red'>&nbsp;*</span>");
							updateChosenTag();

						} else {
							$("#secureIdType").removeAttr("mandatory");
							$("#secureIdType").removeClass("required");
							$("#secureIdType").attr("disabled", true);
							updateChosenTag();
						}
					} else {
						view = true;
						getSecurityTypeValue($("#secureIdType").val());
						/*loadProductCategoryTree($("#product_collateralSubType")
								.val(), view);
						$("#productBranchTree").dynatree("disable");
						$("#productCategoryTree").dynatree("disable");
						$("#productMakeTree").dynatree("disable");
						$("#productModelTree").dynatree("disable");
						$("#productVariantTree").dynatree("disable");*/

					}
					/*$('body').on('change', '.product_collateralSubType',
							function() {
								if (productTypeName != 'ML' && productTypeName != 'MHL') {
									reloadDyna($(this));
								} else {

								}

							});*/

					/*$('body').on('click', '#product_collateral_mapping',
							function() {
								getColleteralPage();
								//getColletoralTypeFromProductCode();
								if (productTypeName != 'ML') {
									$("#productCategoryTree").dynatree("getTree")
											.reload();
									$("#productMakeTree").dynatree("getTree")
											.reload();
									$("#productModelTree").dynatree("getTree")
											.reload();
									$("#productVariantTree").dynatree("getTree")
											.reload();
								} else {

								}
							});*/
					var loanTypeCascadeError;
					$('#productType').on('change',function() {
					    if($('#contractTypeId').parents('.form-group').find('span.help-block').length==0){
					    	loanTypeCascadeError=false;        
					    }
					    else{
					    	loanTypeCascadeError=true;
					    }
					});

					$('#contractTypeId').on('change',function(){
						$(this).parents('.form-group').find('.help-block').remove();
						$(this).parents('.form-group').removeClass('error');
						$(this).parents('.form-group').removeClass('outset-shadow-focus clearfix');
						
						if(loanTypeCascadeError){
							 $(this).valid();
						}
					});
					
					if(disableLoanSecurityType != undefined && disableLoanSecurityType == 'true') {
			        	$('#loanSecuredType_chosen').addClass("chosen-disabled").css('pointer-events','none');
					}
				});

function getColletoralTypeFromProductCode(index , selectedId) {
	$.ajax({
		type : "GET",
		url : getContextPath()
				+ "/app/LoanProduct/getColleoralTypeFromProductType/"
				+ $('#productType').val(),
		async : false,
		success : function(data) {
			var mydata = JSON.parse(data);
			if ($('#colDetail_collateralType' + index + ' option').attr(
					"value", mydata.id).length > 0) {
				$('#colDetail_collateralType' + index + ' option').attr(
						"value", mydata.id).remove();
			}
			$.each(mydata, function(key, val) {

				$('#colDetail_collateralType' + index).append($('<option>', {
					value : key,
					text : val
				}));
			});
			
			$('#colDetail_collateralType' + index).trigger("chosen:updated");
			$('#colDetail_collateralType'+index).addClass('collateralType');
			$('#colDetail_collateralType'+index).attr('index',index);
			if(selectedId!=''){
				$('#colDetail_collateralType'+index).val(selectedId);
			}
		
			getColletoralSubTypeFromType(index);
			getUnderlyingFlagValue(index);
			
		}
	});
}

function reloadDyna(Obj) {
	if(categoryArray!=null){
	categoryArray.length = 0;
	makeArray.length = 0;
	modelArray.length = 0;
	variantArray.length = 0;
	$("#categoryListId").val(categoryArray);
	$("#categoryId").val(categoryArray);
	$("#makeListId").val(makeArray);
	$("#makeId").val(makeArray);
	$("#modelListId").val(modelArray);
	$("#modelId").val(modelArray);
	$("#variantListId").val(variantArray);
	$("#variantId").val(variantArray);

	if (Obj) {
		loadProductCategoryTree(Obj.val(), view);
	}
	
	$("#productCategoryTree").dynatree("getTree").reload();
	$("#productMakeTree").dynatree("getTree").reload();
	$("#productModelTree").dynatree("getTree").reload();
	$("#productVariantTree").dynatree("getTree").reload();
	}
}

function getColleteralPage() {
	$.ajax({
		type : "GET",
		url : getContextPath() + "/app/LoanProduct/getColleteralPage/"
				+ $('#productType').val()+"/"+ view,
		success : function(data) {
			$("#asset-container").html(data);
			if (view== false && edit == false) {
				
				getColletoralTypeFromProductCode(0, '');
			}
			var productType = $("#productType").val();
			productTypeName = $('#productType option:selected').attr(
					'data-code');
			loadAssetBuilderDiv(productTypeName);
			var securityTypeName = $(
					"#secureIdType option[value=" + $("#secureIdType").val()
							+ "]").attr('data-code');
			/*if (securityTypeName == "AssetBasedSecurity") {
				$(".underlyingAsset").prop("checked", true);
				$(".underlyingAsset").attr("readonly", "readonly");
				$(".underlyingAsset").attr("onClick",'return false;');
			} else if (securityTypeName == "CollateralBasedSecurity") {
				$(".underlyingAsset").attr("readonly", "readonly");
				$(".underlyingAsset").attr("onClick",'return false;');
			}*/
		}
	});
}

function getColletoralSubTypeFromType(index) {
	
	if ($('#colDetail_collateralType' + index).val()
			&& $('#colDetail_collateralType' + index).val() != 'undefined') {
		$
				.ajax({
					type : "GET",
					url : getContextPath()
							+ "/app/LoanProduct/getColletoralSubType/"
							+ $('#colDetail_collateralType' + index).val(),
					async : false,
					success : function(data) {
						var mydata = JSON.parse(data);
						if ($(
								'#colDetail_collateralSubType' + index
										+ ' option').attr("value", mydata.id)
								.length > 0) {
							$(
									'#colDetail_collateralSubType' + index
											+ ' option').attr("value",
									mydata.id).remove();
						}
						$.each(mydata, function(key, val) {

							$('#colDetail_collateralSubType' + index).append(
									$('<option>', {
										value : key,
										text : val
									}));
						});

						/*var subType = document
								.getElementById("colDetail_collateralSubType"
										+ index);*/
						if(edit == 'true' || view == 'true')
							{
						 getOptionsSelected(index);
							
							}
						$('#colDetail_collateralSubType' + index).trigger(
								"chosen:updated");
						getUnderlyingFlagValue(index);
						/*no need to call as it is already called on click of view collateral details */
					/*	loadProductCategoryTree($(
								"#colDetail_collateralSubType" + index).val(),
								view);*/
					}
				});
	}
}

function getUnderlyingFlagValue(index) {
	if ($('#colDetail_collateralType' + index).val()
			&& $('#colDetail_collateralType' + index).val() != 'undefined') {
		$
				.ajax({
					type : "GET",
					url : getContextPath()
							+ "/app/LoanProduct/getUnderlyingFlag/",
					data : "colTypeId="+ $('#colDetail_collateralType' + index).val() + "&productTypeId="+$("#productType").val() + "&collateralSubType="+ $('#colDetail_collateralSubType' + index).val(),
					async : false,
					success : function(data) {
						if(data == true){
						 $('#colDetail_underlyingAsset' + index).val(data);
						 $('#colDetail_underlyingAsset' + index).prop("checked",true);
						 /*link will be shown only if collateral is underlying collateral */
						 $('#AddViewcolDetails' + index).show();
						 //$("#collateralDetailList").find("div.createCollateral").removeClass("hidden");
						 $('#colDetail_addViewDetails'+index+'-control-group').removeClass("hidden");
						}
						if(data == false){
							 $('#colDetail_underlyingAsset' + index).val(data);
							 $('#colDetail_underlyingAsset' + index).prop("checked",false);
							 /*link will be shown only if collateral is underlying collateral */
							 $('#AddViewcolDetails' + index).hide();
						}
						 $('#colDetail_underlyingAsset' + index).attr("readonly","readonly");
					}
				});
	}
}

function loadProductCategoryTree(productTypeId, viewable) {
	$.ajax({
	url : getContextPath() + "/app/LoanProduct/renderCategoryTree",
	type : "POST",
	data : {productId:productTypeId,viewable:viewable},
	success : function(data) {
		if(data.length==0)
		{
			new PNotify({
				title : 'Warning',
				text : "No Asset Category found for the selected collateral sub type",
				type : 'warning',
				opacity : .8
			});
		}
	 var rootNode = $("#productCategoryTree").dynatree("getRoot");
	 $(data).each(function(index, element){
		var node = new CategoryNode(element.title,element.key);
		var childNode = rootNode.addChild(node);
	 });
	 
	 if(view){
		 $("#productCategoryTree").addClass("ui-dynatree-disabled");
	 }
	 
	},
	
	error : function() {
		}
});	
$("#productCategoryTree")
		.dynatree(
				{
					checkbox : true,
					selectMode : 3,
					expand : true,
					onSelect : function(select, node) {
						 node.data.markSelected(select);
					},
					onCreate : function(node, nodeSpan) {
						var selectedCategories = $("#categoryId").val();
						if (selectedCategories != "") {
							var selCategoryArray = selectedCategories.split(",");
							for (i = 0; i < selCategoryArray.length; i++) {
								if (selCategoryArray[i] == node.data.key) {										
										node.select(true);
								}
							
							} 
						}
						if(view){
							node.data.unselectable = true;
						}
					}
				});

}

CategoryNode.prototype.markSelected = function(selected){
	var makeDynatree = $("#productMakeTree").data("makeDynatree");
	if(makeDynatree == null || makeDynatree == undefined) 
	{
		makeDynatree = $("#productMakeTree").dynatree({
						checkbox: true,
						selectMode: 3,
						onSelect: function(select, node) {
							if(node.data.key == null || node.data.key.startsWith("_")){
								$(node.data.children).each(function(index,element){
									element.markSelected(select);
								});
							} else{
								node.data.markSelected(select);
							}
							
							},
						onCreate : function(node, nodeSpan){
							var selectedMakes = $("#makeId").val();
							if (selectedMakes != "") {
								var selMakeArray = selectedMakes.split(",");
									for (i = 0; i < selMakeArray.length; i++) {
											if (selMakeArray[i] == node.data.key) {
												node.select(true);
										}
								}
							} 
							node.expand(true);
							node.expand(false);
							if(view){
								node.data.unselectable = true;
							}
						}
						});
	$("#productMakeTree").data("makeDynatree",makeDynatree);
	if(view){
		 $("#productMakeTree").addClass("ui-dynatree-disabled");
	 }
	} 

	var rootNode = $("#productMakeTree").dynatree("getRoot");

	if(selected) {
		this.selected = true;
		var tempNode = this;
		categoryArray.push(this.key);
		$.ajax({
		type : "POST",
		url : getContextPath() + "/app/LoanProduct/renderMakeTree",
		data : "category=" + this.key,
		success : function(data) {
		 $(data).each(function(index, element){
			if(element.key == null){
				var childArray = new Array();
				var children = element.children;
				$(children).each(function(index, elem){
						var childNode = new MakeNode(elem.title,element.id+"_"+elem.key, elem.children);
						childArray.push(childNode);
				});
				var node = new MakeNode(element.title,element.key, childArray);
			} else{
			}
			var childNode = rootNode.addChild(node);
			tempNode.childList.push(childNode);
		 });
		}
	});
	} else {
		this.selected = false;
		var categoryId = $("#categoryId").val().split(",");
		if(categoryId.indexOf(this.key) != -1){
			categoryId.splice(categoryId.indexOf(this.key),1);
		}
		$("#categoryId").val(categoryId);
		var index = categoryArray.indexOf(this.key);
		if(index != -1){
			categoryArray.splice(index,1);
		}
		if(this.childList.length != 0){
			if(this.childList[0].childList.length != 0){
				$(this.childList[0].childList).each(function(index,element){
					if(element.data.childList.length != 0){
						$(element.data.childList).each(function(index1,element1){
							if(element1.childList.length != 0){
								$(element1.childList).each(function(index2,element2){
									if(element2.data.childList.length != 0){
										$(element2.data.childList).each(function(index3,element3){
											$(element3.childList).each(function(index,element){
												var index = variantArray.indexOf(element.data.key);
												if(index != -1){
													variantArray.splice(index,1);
												}
												var variantId = $("#variantId").val().split(",");
												if(variantId.indexOf(element.data.key) != -1){
													variantId.splice(variantId.indexOf(element.data.key),1);
												}
												$("#variantId").val(variantId);
												
											});
											$("#productVariantTree").dynatree("getRoot").removeChild(element3);
											element2.data.childList.splice(0,1)
										});
									}
								});
							}
								$(element1.childList).each(function(index,element){
									var index = modelArray.indexOf(element.data.key);
									if(index != -1){
										modelArray.splice(index,1);
									}
									var modelId = $("#modelId").val().split(",");
									if(modelId.indexOf(element.data.key) != -1){
										modelId.splice(modelId.indexOf(element.data.key),1);
									}
									$("#modelId").val(modelId);
								});
							$("#productModelTree").dynatree("getRoot").removeChild(element1);
							element.data.childList.splice(0,1)
						});

					}
				});
			}
				$(this.childList[0].data.children).each(function(index,element){
				var index = makeArray.indexOf(element.key);
				if(index != -1){
					makeArray.splice(index,1);
				}
					var makeId = $("#makeId").val().split(",");
					if(makeId.indexOf(element.key) != -1){
						makeId.splice(makeId.indexOf(element.key),1);
					}
					$("#makeId").val(makeId);
			});
			
			rootNode.removeChild(this.childList[0])
			this.childList.splice(0,1);
		}
	}
}


MakeNode.prototype.markSelected = function(selected){
	var modelDynatree = $("#productModelTree").data("modelDynatree");
	if(modelDynatree == null || modelDynatree == undefined) 
	{
		modelDynatree = $("#productModelTree").dynatree({
						checkbox: true,
						selectMode: 3,
						onSelect: function(select, node) {
							if(node.data.key == null || node.data.key.startsWith("_")){
								$(node.data.children).each(function(index,element){
									element.markSelected(select);
								});
							} else{
								node.data.markSelected(select);
							}
							
							
							},
						onCreate : function(node, nodeSpan){
							
							
							var selectedModels = $("#modelId").val();
							if (selectedModels != "") {
									var selModelArray = selectedModels.split(",");
										for (i = 0; i < selModelArray.length; i++) {
												if (selModelArray[i] == node.data.key) {
														node.select(true);
									}
								}
							}
							node.expand(true);
							node.expand(false);
							if(view){
								node.data.unselectable = true;
							}
						
						}
						});
	$("#productModelTree").data("modelDynatree",modelDynatree);
	if(view){
		 $("#productModelTree").addClass("ui-dynatree-disabled");
	 }
	} 

	var rootNode = $("#productModelTree").dynatree("getRoot");

	if(selected) {
		this.selected = true;
		var tempNode = this;
		if(makeArray.indexOf(this.key) == -1){
				makeArray.push(this.key);
				var makeMap = new Object(); 
				var splitArr = this.key.split('_');
				var keyArr = new Array();
				keyArr.push(splitArr[1]);
				makeMap[splitArr[0]] = keyArr;
				var requestString = JSON.stringify(makeMap);
				$.ajax({
				type : "POST",
				url : getContextPath() + "/app/LoanProduct/renderModelTree",
				data : "make=" + requestString,
				success : function(data) {
				 $(data).each(function(index, element){
						if(element.key == null){
							var childArray = new Array();
							var children = element.children;
							$(children).each(function(index, elem){
								var childNode = new ModelNode(elem.title,elem.key, elem.children);
								childArray.push(childNode);
						});
						var node = new ModelNode(element.title,element.key, childArray);
						}else{
						}
						var childNode = rootNode.addChild(node);
						tempNode.childList.push(childNode);
				 });
				}
			});
		}

	} else {
		this.selected = false;
		var makeId = $("#makeId").val().split(",");
		if(makeId.indexOf(this.key) != -1){
		makeId.splice(makeId.indexOf(this.key),1);
		}
		$("#makeId").val(makeId);
		var index = makeArray.indexOf(this.key);
		if(index != -1){
			makeArray.splice(index,1);
		}
		if(this.childList.length != 0){
			if(this.childList[0].childList.length !=0){
					$(this.childList[0].childList).each(function(index,element){
						if(element.data.childList.length !=0){
							$(element.data.childList).each(function(index1,element1){
								$(element1.childList).each(function(index2,element2){
									var index = variantArray.indexOf(element2.data.key);
									if(index != -1){
										variantArray.splice(index,1);
									}
										var variantId = $("#variantId").val().split(",");
										if(variantId.indexOf(element2.data.key) != -1){
											variantId.splice(variantId.indexOf(element2.data.key),1);
										}
										$("#variantId").val(variantId);
								});
								$("#productVariantTree").dynatree("getRoot").removeChild(element1);
								element.data.childList.splice(0,1);
							});
						}
					});
				}
				if(this.childList[0].childList.length !=0){
					$(this.childList[0].childList).each(function(index3,element3){
						var index = modelArray.indexOf(element3.data.key);
						if(index != -1){
							modelArray.splice(index,1);
						}
							var modelId = $("#modelId").val().split(",");
							if(modelId.indexOf(element3.data.key) != -1){
							modelId.splice(modelId.indexOf(element3.data.key),1);
							}
							$("#modelId").val(modelId);
					});
				}
			rootNode.removeChild(this.childList[0])
			this.childList.splice(0,1);
		}
		
	}
	}


ModelNode.prototype.markSelected = function(selected){
	var variantDynatree = $("#productVariantTree").data("variantDynatree");
	if(variantDynatree == null || variantDynatree == undefined) 
	{
		variantDynatree = $("#productVariantTree").dynatree({
						checkbox: true,
						selectMode: 3,
						onSelect: function(select, node) {
							if(node.data.key == null || node.data.key.startsWith("_")){
								$(node.data.children).each(function(index,element){
									element.markSelected(select);
								});
							} else{
								node.data.markSelected(select);
							}
							
							},
						onCreate : function(node, nodeSpan){
							var selectedVariant = $("#variantId").val();
							if (selectedVariant != "") {
								var selVariantArray = selectedVariant.split(",");
									for (i = 0; i < selVariantArray.length; i++) {
											if (selVariantArray[i] == node.data.key) {
												node.select(true);
									}
								}
							} 
							
							node.expand(true);
							node.expand(false);
							if(view){
								node.data.unselectable = true;
							}
						}
						});
	$("#productVariantTree").data("variantDynatree",variantDynatree);
	if(view){
		 $("#productVariantTree").addClass("ui-dynatree-disabled");
	 }
	} 

	var rootNode = $("#productVariantTree").dynatree("getRoot");

	if(selected) {
		this.selected = true;
		var tempNode = this;
		if(modelArray.indexOf(this.key) == -1){
				modelArray.push(this.key);
				$.ajax({
				type : "POST",
				url : getContextPath() + "/app/LoanProduct/renderVariantTree",
				data : "model=" + this.key,
				success : function(data) {
				$(data).each(function(index, element){
						if(element.key == null){
							var childArray = new Array();
							var children = element.children;
							$(children).each(function(index, elem){
								var childNode = new VariantNode(elem.title,elem.key,elem.children);
								childArray.push(childNode);
						});
						var node = new VariantNode(element.title,element.key, childArray);
						}else{
						}
						var childNode = rootNode.addChild(node);
						tempNode.childList.push(childNode);
				 });
				}
			});
		}

	} else {
		this.selected = false;
		var modelId = $("#modelId").val().split(",");
		if(modelId.indexOf(this.key) != -1){
				modelId.splice(modelId.indexOf(this.key),1);
			}
		$("#modelId").val(modelId);
		var index = modelArray.indexOf(this.key);
		if(index != -1){
			modelArray.splice(index,1);
		}
		if(this.childList.length != 0){
			if(this.childList[0].childList != 0){
					$(this.childList[0].childList).each(function(index,element){
					var index = variantArray.indexOf(element.data.key);
					if(index != -1){
						variantArray.splice(index,1);
					}
					var variantId = $("#variantId").val().split(",");
					if(variantId.indexOf(element.data.key) != -1){
							variantId.splice(variantId.indexOf(element.data.key),1);
						}
					$("#variantId").val(variantId);
				});
			}
				if(this.childList[0] != null){
					rootNode.removeChild(this.childList[0])
					this.childList.splice(0,1);
				}
		}
	}
	}

VariantNode.prototype.markSelected = function(selected){
	if(selected){
		this.selected = true;
		variantArray.push(this.key);
	}else{
		this.selected = false;
		var variantId = $("#variantId").val().split(",");
		if(variantId.indexOf(this.key) != -1){
				variantId.splice(variantId.indexOf(this.key),1);
			}
		$("#variantId").val(variantId);
		var index = variantArray.indexOf(this.key);
		if(index != -1){
			variantArray.splice(index,1);
		}
	}
	}

function updateChosenTag() {
	$("#secureIdType").trigger("chosen:updated");
}

// Function for disabling security type if unsecured is selected
function getSecurityType(loanId) {
	var loanSecuredTypeName = $("#loanSecuredType option[value=" + loanId + "]")
			.attr('data-code');
	if (loanSecuredTypeName == "LoanSecurityTypeSecured") {
		enableSecuredType();
		} 
	else {
		disableUnSecuredType();
		}
}

function enableSecuredType() {
	$("#secureIdType").attr("disabled", false);
	$("#secureIdType").attr("mandatory", true);
	$("#secureIdType").addClass("required");
	$("#secureIdType").parent("div").find(".clr").remove();
	$("#secureIdType").parent("div").find("label").append("<span class='clr' style='color:red'>&nbsp;*</span>");
	updateChosenTag();
}

function disableUnSecuredType() {
	$("#product_collateral_mapping").hide();
	$('#product_currency a').trigger('click');
	$("#secureIdType").attr("disabled", true);
	$("#secureIdType").val("");
	$("#secureIdType").removeAttr("mandatory");
	$("#secureIdType").removeClass("required");
	$("#secureIdType").parent("div").find(".clr").remove();
	$("#secureIdType").parent("div").removeClass("error outset-shadow-focus clearfix");
	$("#secureIdType").parent("div").addClass("success");
	$("#secureIdType").parent("div").children(".help-block").hide();
	updateChosenTag();
}

function getSecurityTypeValue(id) {
	
	if (typeof(id)!="undefined" && id!=null && id!="" ){
		
		var securityTypeName = $("#secureIdType option[value=" + id + "]").attr('data-code');
		var productType = $('#productType option:selected').data('code');
		if ((securityTypeName == "AssetBasedSecurity" || securityTypeName == "BOTH" || securityTypeName == "CollateralBasedSecurity") && productType !== "OMNI") {
			$("#product_collateral_mapping").show();
			getColleteralPage();

		} else {
			$("#product_collateral_mapping").hide();
			$("#product_collateral_mapping").removeClass("active");
			$("#product_branch").removeClass("active");
			$("#product_policy").removeClass("active");
			$(".productcollateral").hide();
			$('#product_currency a').trigger('click');
		}
	}
	else {
			$("#product_collateral_mapping").hide();
			$("#product_collateral_mapping").removeClass("active");
			$("#product_branch").removeClass("active");
			$("#product_policy").removeClass("active");
			$(".productcollateral").hide();
			$('#product_currency a').trigger('click');
	}
}

function loadBranchTree(sysName) {
	
	$("#productBranchTree")
			.dynatree(

					{
						checkbox : true,
						selectMode : 3,
						expand : true,
						initAjax : {
							type : "POST",
							url : getContextPath() + "/app/UserInfo/branchTree",
							data : {
								key : "organizationType", // Optional
								// arguments
								// to
								// append
								// to
								// the
								// url
								mode : "all",
								systemName : sysName
							},
						},
						expand : true,
						onSelect : function(select, node) {
						    var counter = $("#productBranchTree").dynatree("getTree").count();
							var selectedNodes = node.tree.getSelectedNodes();						
							if(selectedNodes.length!=counter)
								{
								$("#isAvlblOnAllBranches").prop('checked',false);
                                $("#isAvlblOnAllBranches").parent().removeClass('uni-checked');
								}
								if(selectedNodes.length==counter)
								{
								$('#isAvlblOnAllBranches').prop("checked", true);					
								$("#isAvlblOnAllBranches").parents('span:first').addClass('uni-checked');
								}
							var selectedKeys = $.map(selectedNodes, function(
									node) {
								return node.data.key;
							});
							$("#orgBrnachListId").val(selectedKeys);												
						},

						onCreate : function(node, nodeSpan) {

							var selectedBranches = $("#initailId").val();
							
							var selBranchArray = selectedBranches.split(",");
							if (selectedBranches == "") {
								if ($.inArray(node.data.key, branchIdArray) == -1
										&& node.data.key != "_statusNode") {
								}
							} else {
								for (i = 0; i < selBranchArray.length; i++) {
									if (selBranchArray[i] == node.data.key) {
										if ($.inArray(node.data.key,
												branchIdArray) == -1) {
											node.toggleSelect();
											node.select(true);

										}
									}
								}
							}
						}

					});
	if (view) {
		$("#productBranchTree").dynatree("disable");
	}	
}


function CompanyNode(title,key){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
}

function ProjectNode(title, key, children){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
	this.children = children;
}

function BuildingNode(title, key, children){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
	this.children = children;
}

function WingNode(title, key, children){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
	this.children = children;
}

function CategoryNode(title,key){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
}

function MakeNode(title, key, children){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
	this.children = children;
}

function ModelNode(title, key, children){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
	this.children = children;
}

function VariantNode(title, key, children){
	this.title = title;
	this.key = key;
	this.selected = false;
	this.childList = new Array();
	this.children = children;
}



	jQuery('#isAvlblOnAllBranches').click(function(){
		 var checked = jQuery('#isAvlblOnAllBranches').is(':checked');
		if(checked){
         count=$("#productBranchTree").dynatree("getTree").count();		
		$("#productBranchTree").dynatree("getTree").visit(function (node) {		
        node.select(true);
    });
		}
		if(!checked){
		    $("#productBranchTree").dynatree("getTree").visit(function (node) {		
	        node.select(false);
	    });
			
			}
		
	});


	function loadProductCompanyTree(collateralTypeId, viewable) {
		$.ajax({
				url : getContextPath() + "/app/LoanProduct/renderCompanyTree",
				type : "POST",
				data : {collateralId:collateralTypeId,viewable:viewable}, 
				success : function(data) {
						 var rootNode = $("#productCompanyTree").dynatree("getRoot");
						 $(data).each(function(index, element){
							var node = new CompanyNode(element.title,element.key);
							var childNode = rootNode.addChild(node);
						 });
						 if(view){
							 $("#productCompanyTree").addClass("ui-dynatree-disabled");
						 }
				 
				}
		});

$("#productCompanyTree").dynatree({
		  checkbox: true,
		  selectMode: 3,
		  onSelect: function(select, node) {
			  node.data.markSelected(select);
			 
		  },
		  onCreate : function(node, nodeSpan){
								var selectedCompanies = $("#companyId").val();
								if (selectedCompanies != "") {
									var selCompanyArray = selectedCompanies.split(",");
									for (i = 0; i < selCompanyArray.length; i++) {
											if (selCompanyArray[i] == node.data.key) {
													node.select(true);
											}
									}
								} 
								if(view){
									node.data.unselectable = true;
								}
			}
});

}


	CompanyNode.prototype.markSelected = function(selected) {
		
		var projectDynaTree = $("#productProjectTree").data("projectDynatree");
		if(projectDynaTree == null || projectDynaTree == undefined) 
		{
			projectDynatree = $("#productProjectTree").dynatree({
							checkbox: true,
							selectMode: 3,
							onSelect: function(select, node) {
								if(node.data.key == null || node.data.key.startsWith("_")){
									$(node.data.children).each(function(index,element){
										element.markSelected(select);
									});
								} else{
									node.data.markSelected(select);
								}
								
								},
							onCreate : function(node, nodeSpan){
								var selectedProjects = $("#projectId").val();
								if (selectedProjects != "") {
									var selProjectArray = selectedProjects.split(",");
										for (i = 0; i < selProjectArray.length; i++) {
												if (selProjectArray[i] == node.data.key) {
													node.select(true);
											}
									}
								} 
								node.expand(true);
								node.expand(false);
								if(view){
									node.data.unselectable = true;
								}
							}
							});
		$("#productProjectTree").data("projectDynatree",projectDynatree);
		if(view){
			 $("#productProjectTree").addClass("ui-dynatree-disabled");
		 }
		} 
		
		var rootNode = $("#productProjectTree").dynatree("getRoot");
		
		if(selected) {
			this.selected = true;
			var tempNode = this;
			if(companyArray.indexOf(this.key) == -1){
						companyArray.push(this.key);
							$.ajax({
							type : "POST",
							url : getContextPath() + "/app/LoanProduct/renderProjectTree",
							data : "company=" + this.key,
							success : function(data) {
							 $(data).each(function(index, element){
								if(element.key == null){
									var childArray = new Array();
									var children = element.children;
									$(children).each(function(index, elem){
											var childNode = new ProjectNode(elem.title,elem.key, elem.children);
											childArray.push(childNode);
									});
									var node = new ProjectNode(element.title,element.key, childArray);
								} else{
								}
								var childNode = rootNode.addChild(node);
								tempNode.childList.push(childNode);
							 });
							}
						});
			}

		} else {
			this.selected = false;
			var companyId = $("#companyId").val().split(",");
			if(companyId.indexOf(this.key) != -1){
				companyId.splice(companyId.indexOf(this.key),1);
			}
			$("#companyId").val(companyId);
			var index = companyArray.indexOf(this.key);
			if(index != -1){
				companyArray.splice(index,1);
			}
			if(this.childList[0] != null){
				$(this.childList[0].childList).each(function(index,element){
					if(element.data.childList.length != 0){
						$(element.data.childList).each(function(index1,element1){
							if(element1.childList.length != 0){
								$(element1.childList).each(function(index2,element2){
									if(element2.data.childList.length != 0){
										$(element2.data.childList).each(function(index3,element3){
											$(element3.childList).each(function(index,element){
												var index = wingArray.indexOf(element.data.key);
												if(index != -1){
													wingArray.splice(index,1);
												}
												var wingId = $("#wingId").val().split(",");
												if(wingId.indexOf(element.data.key) != -1){
													wingId.splice(wingId.indexOf(element.data.key),1);
												}
												$("#wingId").val(wingId);
												
											});
											$("#productWingTree").dynatree("getRoot").removeChild(element3);
											element2.data.childList.splice(0,1)
										});
									}
								});
							}
								$(element1.childList).each(function(index,element){
									var index = buildingArray.indexOf(element.data.key);
									if(index != -1){
										buildingArray.splice(index,1);
									}
									var buildingId = $("#buildingId").val().split(",");
									if(buildingId.indexOf(element.data.key) != -1){
										buildingId.splice(buildingId.indexOf(element.data.key),1);
									}
									$("#buildingId").val(buildingId);
								});
							$("#productBuildingTree").dynatree("getRoot").removeChild(element1);
							element.data.childList.splice(0,1)
						});

					}
				});
					$(this.childList[0].data.children).each(function(index,element){
					var index = projectArray.indexOf(element.key);
					if(index != -1){
						projectArray.splice(index,1);
					}
						var projectId = $("#projectId").val().split(",");
						if(projectId.indexOf(element.key) != -1){
							projectId.splice(projectId.indexOf(element.key),1);
						}
						$("#projectId").val(projectId);
				});
				
				rootNode.removeChild(this.childList[0])
				this.childList.splice(0,1);
			}
		}
	}

	ProjectNode.prototype.markSelected = function(selected) {
		
		var buildingDynatree = $("#productBuildingTree").data("buildingDynatree");
		if(buildingDynatree == null || buildingDynatree == undefined) 
		{
			buildingDynatree = $("#productBuildingTree").dynatree({
							checkbox: true,
							selectMode: 3,
							onSelect: function(select, node) {
								if(node.data.key == null || node.data.key.startsWith("_")){
									$(node.data.children).each(function(index,element){
										element.markSelected(select);
									});
								} else{
									node.data.markSelected(select);
								}
								
								
								},
							onCreate : function(node, nodeSpan){
								
								
								var selectedBuildings = $("#buildingId").val();
								if (selectedBuildings != "") {
										var selBuildingArray = selectedBuildings.split(",");
											for (i = 0; i < selBuildingArray.length; i++) {
													if (selBuildingArray[i] == node.data.key) {
															node.select(true);
										}
									}
								}
								node.expand(true);
								node.expand(false);
								if(view){
									node.data.unselectable = true;
								}
							
							}
							});
		$("#productBuildingTree").data("buildingDynatree",buildingDynatree);
		if(view){
			 $("#productBuildingTree").addClass("ui-dynatree-disabled");
		 }
		} 
		
		var rootNode = $("#productBuildingTree").dynatree("getRoot");
		
		if(selected) {
			this.selected = true;
			var tempNode = this;
			
			if(projectArray.indexOf(this.key) == -1){
				projectArray.push(this.key);
					$.ajax({
					type : "POST",
					url : getContextPath() + "/app/LoanProduct/renderBuildingTree",
					data : "project=" + this.key,
					success : function(data) {
					 $(data).each(function(index, element){
							if(element.key == null){
								var childArray = new Array();
								var children = element.children;
								$(children).each(function(index, elem){
									var childNode = new BuildingNode(elem.title,elem.key, elem.children);
									childArray.push(childNode);
							});
							var node = new BuildingNode(element.title,element.key, childArray);
							}else{
							}
							var childNode = rootNode.addChild(node);
							tempNode.childList.push(childNode);
					 });
					}
				});
			}
			
		} else {
			this.selected = false;
			var projectId = $("#projectId").val().split(",");
			if(projectId.indexOf(this.key) != -1){
			projectId.splice(projectId.indexOf(this.key),1);
			}
			$("#projectId").val(projectId);
			var index = projectArray.indexOf(this.key);
			if(index != -1){
				projectArray.splice(index,1);
			}
			if(this.childList[0] != null){
						$(this.childList[0].childList).each(function(index,element){
							if(element.data.childList.length !=0){
								$(element.data.childList).each(function(index1,element1){
									$(element1.childList).each(function(index2,element2){
										var index = wingArray.indexOf(element2.data.key);
										if(index != -1){
											wingArray.splice(index,1);
										}
											var wingId = $("#wingId").val().split(",");
											if(wingId.indexOf(element2.data.key) != -1){
												wingId.splice(wingId.indexOf(element2.data.key),1);
											}
											$("#wingId").val(wingId);
									});
									$("#productWingTree").dynatree("getRoot").removeChild(element1);
									element.data.childList.splice(0,1);
								});
							}
						});
				$(this.childList[0].childList).each(function(index3,element3){
					var index = buildingArray.indexOf(element3.data.key);
					if(index != -1){
						buildingArray.splice(index,1);
					}
						var buildingId = $("#buildingId").val().split(",");
						if(buildingId.indexOf(element3.data.key) != -1){
						buildingId.splice(buildingId.indexOf(element3.data.key),1);
						}
						$("#buildingId").val(buildingId);
				});		
				rootNode.removeChild(this.childList[0])
				this.childList.splice(0,1);
			}
			
		}
	}

	BuildingNode.prototype.markSelected = function(selected) {
		
		var wingDynatree = $("#productWingTree").data("wingDynatree");
		if(wingDynatree == null || wingDynatree == undefined) 
		{
			wingDynatree = $("#productWingTree").dynatree({
							checkbox: true,
							selectMode: 3,
							onSelect: function(select, node) {
								if(node.data.key == null || node.data.key.startsWith("_")){
									$(node.data.children).each(function(index,element){
										element.markSelected(select);
									});
								} else{
									node.data.markSelected(select);
								}
								
								},
							onCreate : function(node, nodeSpan){
								
								var selectedWings = $("#wingId").val();
								if (selectedWings != "") {
									var selWingArray = selectedWings.split(",");
										for (i = 0; i < selWingArray.length; i++) {
												if (selWingArray[i] == node.data.key) {
													node.select(true);
										}
									}
								} 
								
								node.expand(true);
								node.expand(false);
								if(view){
									node.data.unselectable = true;
								}
							}
							});
		$("#productWingTree").data("wingDynatree",wingDynatree);
		if(view){
			 $("#productWingTree").addClass("ui-dynatree-disabled");
		 }
		} 
		
		var rootNode = $("#productWingTree").dynatree("getRoot");
		
		if(selected) {
			this.selected = true;
			var tempNode = this;
			if(buildingArray.indexOf(this.key) == -1){
				buildingArray.push(this.key);
					$.ajax({
					type : "POST",
					url : getContextPath() + "/app/LoanProduct/renderWingTree",
					data : "building=" + this.key,
					success : function(data) {
					 $(data).each(function(index, element){
							if(element.key == null){
								var childArray = new Array();
								var children = element.children;
								$(children).each(function(index, elem){
									var childNode = new WingNode(elem.title,elem.key, elem.children);
									childArray.push(childNode);
							});
							var node = new WingNode(element.title,element.key, childArray);
							}else{
							}
							var childNode = rootNode.addChild(node);
							tempNode.childList.push(childNode);
					 });
					}
				});
			}

		} else {
			this.selected = false;
			var buildingId = $("#buildingId").val().split(",");
			if(buildingId.indexOf(this.key) != -1){
					buildingId.splice(buildingId.indexOf(this.key),1);
				}
			$("#buildingId").val(buildingId);
			var index = buildingArray.indexOf(this.key);
			if(index != -1){
				buildingArray.splice(index,1);
			}
			$(this.childList[0].childList).each(function(index,element){
				var index = wingArray.indexOf(element.data.key);
				if(index != -1){
					wingArray.splice(index,1);
				}
				var wingId = $("#wingId").val().split(",");
				if(wingId.indexOf(element.data.key) != -1){
						wingId.splice(wingId.indexOf(element.data.key),1);
					}
				$("#wingId").val(wingId);
			});
			if(this.childList[0] != null){
				rootNode.removeChild(this.childList[0])
				this.childList.splice(0,1);
			}
			
		}
	}

	WingNode.prototype.markSelected = function(selected) {
		if(selected){
			this.selected = true;
			if(wingArray.indexOf(this.key) == -1){
				wingArray.push(this.key);
			}
		}else{
			this.selected = false;
			var wingId = $("#wingId").val().split(",");
			if(wingId.indexOf(this.key) != -1){
					wingId.splice(wingId.indexOf(this.key),1);
				}
			$("#wingId").val(wingId);
			var index = wingArray.indexOf(this.key);
			if(index != -1){
				wingArray.splice(index,1);
			}
		}
	}
	
function hideLeasingFields() {
	
	var productTypeNameLocal = $('#productType option:selected').attr('data-code');
	if(productTypeNameLocal == undefined) {
		$(".leasingDiv").hide();
	} else {
		
		var contractType = $('#contractTypeId option:selected').text();
		if (contractType == undefined) {
			$(".leasingDiv").hide();
			
		
		} else {
		
			if (contractType == "Lease") {
				if(productTypeNameLocal == "CC") {
					$(".leasingDiv").hide();
					$('#leaseType').removeClass('required');
				} else {
					if(productTypeNameLocal != "CV" || productTypeNameLocal != "MAL") {
						$(".closedOpenDiv").hide();
						$(".buyBackDiv").hide();
					}
				}
			} else {
				$(".leasingDiv").hide();
				$('#leaseType').removeClass('required');
			}
		}
	}
}

function showLeasingFields() {
	var productTypeNameLocal = $('#productType option:selected').attr('data-code');
	if($('#contractTypeId option:selected').text()=="Loan"){
		
	}
	else if((productTypeNameLocal == "CV" || productTypeNameLocal == "MAL") && $('#contractTypeId option:selected').text() == "Lease") {
		$(".leasingDiv").show();
		$('#leaseType').addClass('required');
	} else {
		$(".leaseTypeDiv").show();
		$(".dryWetDiv").show();
		$('#leaseType').addClass('required');
	}
	
}

$("#contractTypeId").change(function() {
	   if ($('#contractTypeId option:selected').text() == "Lease") {
	          showLeasingFields();
	   } else {
	          hideLeasingFields();
	   }
	   if(isNaN($('#contractTypeId').val())) {
		   $("#policy-container").load(
				   getContextPath() + "/app/LoanProduct/populateContractPolicies/"
				   + $("#productType").val() + "/" + $('#contractTypeId').val().split(":")[1],
		  		 function() {}
		   );
	   } else {
		   $("#policy-container").load(
				   getContextPath() + "/app/LoanProduct/populateContractPolicies/"
				   + $("#productType").val() + "/" + $('#contractTypeId').val(),
		  		 function() {}
		   );
	   }
	   
});

function loadAssetBuilderDiv(productTypeName) {
	if (productTypeName != null) {
		if (productTypeName == "CC") {
			$('#contractTypeId').attr('disabled', 'disabled');
			$('#lineOfBusiness').attr('disabled', 'disabled');
			$('#coApplicationRequired').attr('disabled', 'disabled');
			$('#gurantorRequired').attr('disabled', 'disabled');
			$('#loanSecuredType').attr('disabled', 'disabled');
			$('#secureIdType').attr('disabled', 'disabled');
			$('#cardTypeList').attr('mandatory', true);
			$('#loanTypeDivID').hide();
			$('#checkBoxDivID').hide();
			$('#secureTypeDivID').hide();
			$("#product_card_mapping").show();
			$(".productCard").removeClass("hide");
			$("#dynamic_form_mapping").show();
			$("#product_collateral_mapping").hide();
			$(".productDynamicForm").removeClass("hide");
			$("#product_collateral_mapping").removeClass("active");
			$(".productcollateral").hide();
		}
		if (productTypeName != "CC" && (view== false)) {

			$('#contractTypeId').removeAttr('disabled');
			$('#lineOfBusiness').removeAttr('disabled');
			$('#coApplicationRequired').removeAttr('disabled');
			$('#gurantorRequired').removeAttr('disabled');
			$('#loanSecuredType').removeAttr('disabled');
			$('#secureIdType').removeAttr('disabled');

			$('#loanTypeDivID').show();
			$('#checkBoxDivID').show();
			$('#secureTypeDivID').show();
			$("#product_card_mapping").hide();
			$(".productCard").addClass("hide");
			$('#cardTypeList').removeAttr('mandatory');
			$("#product_property").hide();
			$("#dynamic_form_mapping").hide();
			$("#product_property").attr("disabled", true);
			$("#product_asset").show();
			$("#product_asset").removeAttr("disabled");
			$(".productDynamicForm").addClass("hide");
		}
		if (productTypeName == "ML" || productTypeName == "LAP" || productTypeName=="MHL" ) {
			$("#product_card_mapping").hide();
			$("#product_asset").hide();
			$("#product_asset").attr("disabled", true);
			$("#product_property").show();
			$("#product_property").removeAttr("disabled");
			$("#dynamic_form_mapping").hide();
		}
		$('#contractTypeId').trigger("chosen:updated");
		$('#lineOfBusiness').trigger("chosen:updated");
		$('#coApplicationRequired').trigger("chosen:updated");
		$('#gurantorRequired').trigger("chosen:updated");
		$('#loanSecuredType').trigger("chosen:updated");
		$('#secureIdType').trigger("chosen:updated");
	}

}



function getGlobalActiveFlagProduct(activeFlagVal,viewMode,editMode)
{
	if (viewMode == "" && editMode == "" && activeFlagVal == "") {
		$("#activeFlagProduct").addClass(" btn-primary active");
		$("#activeStatusHidden").removeAttr("checked", "checked");
	} else if (viewMode == "true") {
		$("#activeFlagProduct").attr("disabled", "disabled");
		$("#inActiveFlagProduct").attr("disabled", "disabled");
		if (activeFlagVal == "true") {
			$("#activeFlagProduct").addClass(" btn-primary active");
			$("#activeStatusHidden").prop("checked", true);
		} else {
			$("#inActiveFlagProduct").addClass(" btn-primary active");
			$("#activeStatusHidden").removeAttr("checked", "checked");
		}
	} else if (editMode == "true") {
		if (activeFlagVal == "true") {
			$("#activeFlagProduct").addClass(" btn-primary active");
			$("#activeStatusHidden").prop("checked", true);
		} else {
			$("#inActiveFlagProduct").addClass(" btn-primary active");
			$("#activeStatusHidden").removeAttr("checked", "checked");
		}
	} else {
		$("#activeFlagProduct").addClass(" btn-primary active");
		$("#activeStatusHidden").prop("checked", true);
	}
}

function onClickActiveButtonsProduct() {
	if (!$("#activeFlagProduct").hasClass("btn-primary active")) {
		$("#activeFlagProduct").addClass(" btn-primary active");
		$("#inActiveFlagProduct").removeClass(" btn-primary active");
		$("#activeStatusHidden").prop("checked",true);  
	}
}
function onClickInActiveButtonsProduct() {
	if (!$("#inActiveFlagProduct").hasClass("btn-primary active")) {
		$("#inActiveFlagProduct").addClass(" btn-primary active");
		$("#activeFlagProduct").removeClass(" btn-primary active");
		$("#activeStatusHidden").prop("checked",false);
	}
}


