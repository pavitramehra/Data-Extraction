

(function() {
	var fileDownloadObject=$.fileDownload;
	if($==null || $.fileDownload==null || $.fileDownload.loadIdentificationFlag)
	{
		return;
	}
	$.fileDownload=function(fileUrl,options){

		if (options != null && options.httpMethod != null
				&& options.httpMethod.toUpperCase() == 'GET'
					&& options.data != null )
		{
			var data;
			if( typeof options.data === "string")
			{
				data=options.data;
			}
			else
			{
				data=$.param(options.data);
			}
			var url=arguments[0];
			var separator = url.indexOf('?') !== -1 ? "&" : "?";
			if(data!="")
			{
				url=url+separator+data;
			}
			arguments[0]=url;
			options.data=null;

		}
		arguments[0]=getLinkUrlWithSecurityToken(arguments[0]);
		fileDownloadObject.apply(this,arguments);
	}
	$.fileDownload.loadIdentificationFlag=true;
})();
$(function() {
		$('.popover-link').popover({
		    html : true,

		    content : function() {
		        return $('#popover-keys-content').html();
		    }
		});

		$(':not(#hidden) .popover-link').on('click', function (e) {
		    $('.popover-link').each(function () {
 	if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
		    	{
		            $(this).popover('hide');
		            return;
		        }
		    });
		});

		$('.popover-link-last').popover({
		    html : true,

		    content : function() {
		        return $('#popover-last-content').html();
		    }
		});

		$(':not(#hidden) .popover-link-last').on('click', function (f) {
		    $('.popover-link-last').each(function () {
 	if (!$(this).is(f.target) && $(this).has(f.target).length === 0 && $('.popover').has(f.target).length === 0)
		    	{
		            $(this).popover('hide');
		            return;
		        }
		    });
		});



		$('.bubbleInfo').each(function() {
			// options
			var distance = 10;
			var time = 250;
			var hideDelay = 500;

			var hideDelayTimer = null;

			// tracker
			var beingShown = false;
			var shown = false;

			var trigger = $('.trigger', this);
			var popup = $('.popup', this).css('opacity', 0);

			// set the mouseover and mouseout on both element
			$([ trigger.get(0), popup.get(0) ]).mouseover(function() {
				// stops the hide event if we move from the trigger to the popup element
				if (hideDelayTimer)
					clearTimeout(hideDelayTimer);

				// don't trigger the animation again if we're being shown, or already visible
				if (beingShown || shown) {
					return;
				} else {
					beingShown = true;

					// reset position of popup box
					popup.css({
						top : -224,
						//left:,
						display : 'block' // brings the popup back in to view
					})

					// (we're using chaining on the popup) now animate it's opacity and position
					.animate({
						top : '-=' + distance + 'px',
						opacity : 1
					}, time, 'swing', function() {
						// once the animation is complete, set the tracker variables
						beingShown = false;
						shown = true;
					});
				}
				getLastNotifications();
			}).mouseout(function() {
				// reset the timer if we get fired again - avoids double animations
				if (hideDelayTimer)
					clearTimeout(hideDelayTimer);

				// store the timer so that it can be cleared in the mouseover if required
				hideDelayTimer = setTimeout(function() {
					hideDelayTimer = null;
					popup.animate({
						top : '-=' + distance + 'px',
						opacity : 0
					}, time, 'swing', function() {
						// once the animate is complete, set the tracker variables
						shown = false;
						// hide the popup entirely after the effect (opacity alone doesn't do the job)
						popup.css('display', 'none');
					});
				}, hideDelay);
			});
		});
	});

	function getLastNotifications(){
		$.ajax({
			type : "POST",
			url : "${pageContext.request.contextPath}/app/getLastNotifications",
			data : "number=10",
			async : false,
			success : function(result) {
				if(result!=""){

					var createParent = document.createElement("div");
					createParent.setAttribute("class", "row");

					var createHeader = document.createElement("div");
					createHeader.setAttribute("class", "notifications-row");
					createHeader.setAttribute("style", "font-size:20px;border-bottom:solid 2px #1B84B0");
					createHeader.innerHTML=footer_Lastaction;
					createParent.appendChild(createHeader);



					var resultData = jQuery.parseJSON(result);
					for(i=0; i<resultData.length;i++){
						 var textMsg = "<table class=table table-hover table-condensed table-striped><tr ><td ><div class=row style=font-size:13px;>"+
						 "<i class= glyphicon glyphicon-share-alt></i>"+resultData[i].message+" </div></td></tr></table>";
						 var createNotification = document.createElement("div");
						 createNotification.setAttribute("class", "col-sm-12");
						/*  createNotification.appendChild(createImg);
						 createNotification.appendChild(createImg); */
						 createNotification.innerHTML +=textMsg ;
						 createParent.appendChild(createNotification);
					}

					var notificationDiv = document.getElementById("lastNotifications");
					notificationDiv.innerHTML="";

					notificationDiv.appendChild(createParent);
				}
			}
		});

	}

	var inputCount = $(":input");
	var length = inputCount.length;
	var spanCount = $("span").length;

	function disableToolTip() {
		var selectCount=$(".chosen-container");
		var elt = document.getElementById("toolTipId");

		if (!($("#toolTipId").is(':checked'))) {
			$.ajax({
				url : getContextPath() + "/app/configuration/setConfig",
				type : 'POST',
				async : false,
				data:{key:"config.notifications.tooltip",value:"false"},
				success : function(data) {

					},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});
			addRemoveInputSpanAttr(false,false);
		}else {
			$.ajax({
				url : getContextPath() + "/app/configuration/setConfig",
				type : 'POST',
				async : false,
				data:{key:"config.notifications.tooltip",value:"true"},
				success : function(data) {

					},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}
			});
			addRemoveInputSpanAttr(true,false);
		}

	}

	function createSearchMap() {
		menuSearchMap = new Object();
		$("#neutrino-mega-menu").find(".meg-links li").each(function() {
			var key = $(this).find("a:first").text().trim();
			//update menuSearchMap when menu item call from ajax
			var value = $(this).find('a:first').attr('href');
			value = (value && value!='#')?"loadMenu('"+value+"')":$(this).find('a:first').attr('onClick');
			if(key && value && value.indexOf("javascript:void(0)") == -1) {
				menuSearchMap[key]=value;
			}
		});
	}





var footerApp = angular.module("footerApp", []);
footerApp.controller("footerAppCtrl", function($scope, $http) {

$scope.loadLicenseDetails =function(){
			$scope.showLicenseDetailPanel();
			$(document).on('change', '#licensedProductCode', function(){$scope.loadLicense();});
			};
			

$scope.loadLicense=function(){

	var licensedProductCode=$("#licensedProductCode").val();

	
	
	if(licensedProductCode!=undefined &&licensedProductCode !="")
		{
	$http({
		method : "GET",
		url : getContextPath() + "/app/systemSetup/license/getDetailsJson/"+licensedProductCode
	}).then(function mySuccess(res) {
		if(res != null && res.data != null){
			$scope.licenseDetailData =  res.data;
			 $('.nav-tabs a[href="#licenseContent"]').tab('show');
		
		}
	}, function myError(res) {
		console.log("error while loadLicenseDetails "+res);
	});
		}
	else if($scope.licenseDetailData!=null)
		{
		$scope.licenseDetailData =null;
		$scope.$apply();
		}

}
$scope.loadlicensedProductCodeList =function(){
	
	
	$http({
		method : "GET",
		url : getContextPath() + "/app/systemSetup/license/getLicensedProductCode"
	}).then(function mySuccess(res) {
		$("#licensedProductCode option").remove();
		if(res != null && res.data != null){
			$('#licensedProductCode').append('<option value="">Select One Option</option>');
			angular.forEach(res.data, function(value) {
				$('#licensedProductCode').append('<option value="'+value+'">'+value+'</option>');
	     	  
				});
			  $('#licensedProductCode').trigger("chosen:updated");
			  showCoreModuleLicense();
		}
	}, function myError(res) {
		console.log("error while loadlicensedProductCodeList "+res);
	});
	
		}

$scope.showLicenseDetailPanel = function(){
	$scope.loadlicensedProductCodeList();
	
	
	
	$("body").addClass("openDrawer OverLay_with_header");
	$("#licenseDetails").addClass("showDrawer");
}

$scope.hideLicenseDetailPanel = function(){
	$("#licensedProductCode option").remove();
	$("body").removeClass("openDrawer OverLay_with_header");
	$("#licenseDetails").removeClass("showDrawer");
}

$scope.showShorCutPanel = function(){
	$("body").addClass("openDrawer OverLay_with_header");
	$("#short_cut_panel").addClass("showDrawer");
}

$scope.hideShorCutPanel = function(){
	$("body").removeClass("openDrawer OverLay_with_header");
	$("#short_cut_panel").removeClass("showDrawer");
}

$scope.paintShortCutKeys = function(){
	$scope.showShorCutPanel();
	$scope.globalShortcutData = JSON.parse(localStorage[getContextPath() + "/app/gethotkeys" + "type=0"]).response;
	$scope.menuShortcutData = JSON.parse(localStorage[getContextPath() + "/app/gethotkeys" + "type=1"]).response;
}

$scope.enablekey=true;

$scope.enableDisableHotkeys = function(isChecked) {
	// Enable
		if (isChecked) {
			hiddenActionsShortcutMapping.forEach(function (item) {
				$(document).on('keydown.' + item.shortCutKey, function (evt) {
					item.identifierList.forEach(function (subitem, index) {
						if(!$(subitem[0]).prop("disabled")){
						var shortCutAnchorHref = $(subitem[0]).attr("href");
						if (typeof shortCutAnchorHref !== typeof undefined && shortCutAnchorHref != false && shortCutAnchorHref.match("^[^\#]") && shortCutAnchorHref !== "" && shortCutAnchorHref.indexOf("javascript:void") == -1) {
							$(subitem[0]).mousedown();
							window.location.href = $(subitem[0]).attr("href");
						}else{
							$(subitem[0]).trigger("click");
						}
					}
				});
			});
		})
		globalActionsShortcutMapping.forEach(function (item) {
			$(document).on('keydown.' + item.shortCutKey, function (evt) {
				var childArray = [];
				var grandChildArray = [];
				var filteredGlobalActionsShortcutMapping = [];
				var relatedToArray = [];
				item.identifierList.forEach(function (subitem, index) {
					subitem.forEach(function (sub_subitem, sub_index) {
						if ($(sub_subitem).length != 0 && isReallyVisible($(sub_subitem).filter(':visible'))) {
							grandChildArray.push(sub_subitem);
						}
					})
					if (grandChildArray.length != 0) {
						childArray.push(grandChildArray);
						grandChildArray = [];
					}
				})
				if (childArray.length != 0) {
					filteredGlobalActionsShortcutMapping.push({
						identifierList: childArray
					});
					childArray = [];
				}

				var all=[],
					  extra=[];
					filteredGlobalActionsShortcutMapping.forEach(function(item) {
							all.push.apply(all, item.identifierList[0]); // Push 0th element in all Array
								for (i = 1; i < item.identifierList.length; i++) {	// Start Array from 1
									var row = item.identifierList[i];
									for (j = 0; j < row.length; j++) {
										if (all.indexOf(row[j]) > -1) { // Check if row[j] element is present in all Array
											all.push.apply(all, item.identifierList[i]); // If Present Push whole row Array in all Array
											for (k = 0; k < row.length; k++) { //Check weather any of the element of this row is present in extra Array
												while (extra.indexOf(row[k]) > -1) { // If present remove element from extra Array
													extra.splice(extra.indexOf(row[k]), 1);
												}
											}
											break; //Since we have found one element from row Array which is present in all Array hence, no further iteration is needed
										} else {
											extra.push(row[j]); // If not present in all Array Push element in extra Array
										}
									}
								}

					// Checking if any related data is left in the extra Array
					if(extra.length>0){
								for (i = item.identifierList.length - 1; i > 0; i--) {
									var row = item.identifierList[i];
									for 	(j = 0; j < row.length; j++) {
										if (extra.indexOf(row[j]) > -1) { // Check if row[j] element is present in extra Array
											for (k = 0; k < row.length; k++) {
												if (all.indexOf(row[k]) > -1) { // Check if row[k] element is present in all Array
													all.push.apply(all, item.identifierList[i]);  // If Present Push whole item.identifierList at i Array in all Array
													for (l = 0; l < row.length; l++) { //Check weather any of the element of this row is present in extra Array
														while (extra.indexOf(row[l]) > -1) {  // If present remove element from extra Array
															extra.splice(extra.indexOf(row[l]), 1);
														}
													}
													break;
												}
											}
										}
									}
								}
							}
					});

				filteredGlobalActionsShortcutMapping=[];
				filteredGlobalActionsShortcutMapping.push({identifierList: []});
				if(extra.length==0 && all.length!=0){
					filteredGlobalActionsShortcutMapping[0]['identifierList'].push([all[0]]);
				}
				filteredGlobalActionsShortcutMapping.forEach(function (item) {
					var alreadyTriggered = false;
					if (item.identifierList.length == 1) {
						item.identifierList[0].forEach(function (item1) {
							$(item1).filter(function(){
								if($(this).is(":visible")){
									if ($("body").hasClass("modal-open")) {return item1 = $('.modal:visible').find($(this));}
									else{return item1 = $(item1).filter(':visible');}
								}
							})
							if (!alreadyTriggered) {
								if ($(item1).length==1) {
									if ($(item1).prop("disabled") != true && $(item1).css('visibility') !== 'hidden' && $(item1).css('opacity') !== 0) {
										var shortCutAnchorHref = $(item1).attr("href");

										var containerIsAccordion = $(document.activeElement).parents(".panel-collapse");
										var customDivSeperator = $(document.activeElement).parents(".customDivSeperatorClass");
										if (containerIsAccordion.length == 0 && customDivSeperator.length == 0) {
											if (typeof shortCutAnchorHref !== typeof undefined && shortCutAnchorHref != false && shortCutAnchorHref.match("^[^\#]") && shortCutAnchorHref !== "" && shortCutAnchorHref.indexOf("javascript:void") == -1) {
												$(item1).mousedown();
												window.location.href = $(item1).attr("href");
												alreadyTriggered = true;
											} else {
												$(item1).trigger("click");
												alreadyTriggered = true;
											}
										} else if (containerIsAccordion.length == 1) {
											if (typeof shortCutAnchorHref !== typeof undefined && shortCutAnchorHref != false && shortCutAnchorHref.match("^[^\#]") && shortCutAnchorHref !== "" && shortCutAnchorHref.indexOf("javascript:void") == -1) {
												if ($(containerIsAccordion).find(item1).length != 0) {
													$(containerIsAccordion).find(item1).mousedown();
													window.location.href = $(containerIsAccordion).find(item1).attr("href");
													alreadyTriggered = true;
												} else {
													alreadyTriggered = false;
												}
											} else {
												if ($(containerIsAccordion).find(item1).length != 0) {
													$(containerIsAccordion).find(item1).trigger("click");
													alreadyTriggered = true;
												} else {
													alreadyTriggered = false;
												}
											}
										} else if (customDivSeperator.length == 1) {
											if (typeof shortCutAnchorHref !== typeof undefined && shortCutAnchorHref != false && shortCutAnchorHref.match("^[^\#]") && shortCutAnchorHref !== "" && shortCutAnchorHref.indexOf("javascript:void") == -1) {
												if ($(customDivSeperator).find(item1).length != 0) {
													$(customDivSeperator).find(item1).mousedown();
													window.location.href = $(customDivSeperator).find(item1).attr("href");
													alreadyTriggered = true;
												} else {
													alreadyTriggered = false;
												}
											} else {
												if ($(customDivSeperator).find(item1).length != 0) {
													$(customDivSeperator).find(item1).trigger("click");
													alreadyTriggered = true;
												} else {
													alreadyTriggered = false;
												}
											}
										}
									} else {
										console.error("Element or parent not active");
									}
								}else if(item1.length>1){
									console.error("More Than one element of same Identifier");
								} else {
									console.error("Element doesn't exist");
								}
							}
						})
					} else {
						console.error("No element mapped.");
					}
				});
			})
		})
		// Bind actions with each shortcut key, for opening respective menu and navigating through them
		shortcutMenuMapping.forEach(function (item) {
			$(document).on('keydown.' + item.shortCutKey, function (evt) {
				if ($("body").hasClass("modal-open")) {
					return;
				} else {
					var focusedItem = document.activeElement;
					$(focusedItem).blur();
					$("li.meg-drop").popover("hide");
					$(item.identifierList[0][0]).filter(function () {
						// If duplicate menu ID exists do nothing
						if ($(this).length >= 1 && $(this).css('display') == 'none') {
							return
						} else {
							activeMenuIndex = 0;
							linkIndex = 0
							lastLinkIndex = 0;
							$("#neutrino-mega-menu li.meg-drop.active").removeClass("active");
							$(this).addClass('active');
							activeMenu = $(".neutrino-nav").find(".meg-drop.active").find(".meg-content").find("[class*='-col']");
							activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
							activeMenu.find("li").find("a").removeClass("activeMenuFirstLink");
							activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
							// Menu - down navigation
							$(document).off('keydown.down').on('keydown.down', function (evt) {
								evt.preventDefault();
								if (linkIndex != activeMenuAllLi.length - 1) {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
									linkIndex = linkIndex + 1;
									activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
								} else {
									if (activeMenuIndex < activeMenu.length - 1) {
										activeMenuAllLi.removeClass("activeMenuFirstLink");
										activeMenuIndex = activeMenuIndex + 1;
										linkIndex = 0;
										activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
										activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
									} else {
										activeMenuAllLi.removeClass("activeMenuFirstLink");
										activeMenuIndex = 0;
										linkIndex = 0;
										activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
										activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
									}
								}
							});
							// Menu - up navigation
							$(document).off('keydown.up').on('keydown.up', function (evt) {
								evt.preventDefault();
								if (linkIndex >= 1) {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
									linkIndex = linkIndex - 1;
									activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
								} else {
									if (activeMenuIndex > 0) {
										activeMenuAllLi.removeClass("activeMenuFirstLink");
										activeMenuIndex = activeMenuIndex - 1;
										activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
										linkIndex = activeMenuAllLi.length - 1;
										activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
									} else {
										activeMenuAllLi.removeClass("activeMenuFirstLink");
										activeMenuIndex = activeMenu.length - 1;
										activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
										linkIndex = activeMenuAllLi.length - 1
										activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
									}
								}

							});
							// Menu - right navigation
							$(document).off('keydown.right').on('keydown.right', function (evt) {
								if (activeMenuIndex < activeMenu.length - 1) {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
									activeMenuIndex = activeMenuIndex + 1;
									linkIndex = 0;
									activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
									activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
								} else {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
									activeMenuIndex = 0;
									linkIndex = 0;
									activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
									activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
								}
							});
							// Menu - left navigation
							$(document).off('keydown.left').on('keydown.left', function (evt) {
								if (activeMenuIndex >= 1) {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
									activeMenuIndex = activeMenuIndex - 1;
									linkIndex = 0;
									activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
									activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
								} else {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
									activeMenuIndex = activeMenu.length - 1;
									linkIndex = 0;
									activeMenuAllLi = activeMenu.eq(activeMenuIndex).find("li").find("a");
									activeMenuAllLi.eq(linkIndex).addClass("activeMenuFirstLink");
								}
							});
							// Trigger click on menu link
							$(document).off('keydown.return').on('keydown.return', function (evt) {
								var shortCutAnchorHref = activeMenu.find("a.activeMenuFirstLink").attr("href");
								if (typeof shortCutAnchorHref !== typeof undefined && shortCutAnchorHref != false && shortCutAnchorHref.match("^[^\#]") && shortCutAnchorHref !== "" && shortCutAnchorHref.indexOf("javascript:void") == -1) {
									activeMenu.find("a.activeMenuFirstLink").mousedown();
									window.location.href = activeMenu.find("a.activeMenuFirstLink").attr("href");
								} else {
									activeMenu.find("a.activeMenuFirstLink").trigger("click");
								}
								$("#neutrino-mega-menu li.meg-drop").removeClass("active");
								if (activeMenuAllLi.length != 0) {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
								}
								activeMenuIndex = 0;
								linkIndex = 0;
								$(document).off('keydown.down');
								$(document).off('keydown.up');
								$(document).off('keydown.left');
								$(document).off('keydown.right');
								$(document).off('keydown.return');
							});
							// On hover over menu item unbind shortcuts and
							// reset active links
							$("#neutrino-mega-menu .meg-content ").off("mouseover").on("mouseover", function () {
								$(document).off('keydown.right');
								$(document).off('keydown.left');
								$(document).off('keydown.up');
								$(document).off('keydown.down');
								$(document).off('keydown.return');
								$("li.meg-drop").popover("hide");
								$("#neutrino-mega-menu li.meg-drop").removeClass("active");
								if (activeMenuAllLi.length != 0) {
									activeMenuAllLi.removeClass("activeMenuFirstLink");
								}
								activeMenuIndex = 0;
								linkIndex = 0;
								$("#neutrino-mega-menu .meg-content ").off("mouseover");
							})
						}
					})
				}
			});
		})
		// Close open menu on pressing ESC
		$(document).off('keydown.esc').on('keydown.esc', function (evt) {
			$(document).off('keydown.right');
			$(document).off('keydown.left');
			$(document).off('keydown.up');
			$(document).off('keydown.down');
			$(document).off('keydown.return');
			$("li.meg-drop").popover("hide");
			$("#neutrino-mega-menu .meg-content ").off("mouseover");
			$("#neutrino-mega-menu li.meg-drop").removeClass("active");
			if (activeMenuAllLi.length != 0) {
				activeMenuAllLi.removeClass("activeMenuFirstLink");
			}
			activeMenuIndex = 0;
			linkIndex = 0;
		});
		// Show-hide shortcut key suggestion for respective menu
		$(document).on('keydown.alt_shift', function (evt) {
			if ($("body").hasClass("modal-open")) {
				return;
			} else {
				if ($(".megamenu .popover.in").length > 0) {
					$("li.meg-drop").popover("hide");
				} else {
					shortcutMenuMapping.forEach(function (item) {
						$(item.identifierList[0][0]).popover({
							content: item.shortCutKeySuggestion,
							placement: "bottom"
						});
					});
					$("li.meg-drop").popover("show");
				}
			}
		});
		$("body").on("click", function () {
			if ($(".megamenu .popover.in").length > 0) {
				$("li.meg-drop").popover("hide");
			}
		});
	}
	// Disable
	else {
		$(document).off('keydown.down');
		$(document).off('keydown.up');
		$(document).off('keydown.left');
		$(document).off('keydown.right');
		$(document).off('keydown.return');
		$(document).off('keydown.esc');
		$(document).off('keydown.alt_shift');
		shortcutMenuMapping.forEach(function (item) {
			$(document).off('keydown.' + item.shortCutKey);
		});
		globalActionsShortcutMapping.forEach(function (item) {
			$(document).off('keydown.' + item.shortCutKey);
		});
	}
}
$scope.enableDisableHotkeys(true);


});

var footerAppDiv = document.getElementById('footerApp');
//BootStrap your multiple app
angular.element(document).ready(function() {
      angular.bootstrap(footerAppDiv, [ 'footerApp' ]);
});
