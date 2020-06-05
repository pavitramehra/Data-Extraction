function ajaxSessionTimeout()
{
    if(typeof ssoActive != "undefined" && ssoActive!=null && ssoActive == 'true'){
        neutrinoNavigateTo(ssoLoginUrlVar);
        return;
    }

	 $("#ajax_session_timeout").dialog({
		modal : true,
		bgiframe : true,
		width : 300,
		height : 200,
		autoOpen : false,
		title : 'Session TimeOut',
	});
	$("#ajax_session_timeout")
	.dialog(
			'option',
			'buttons',
			{
				"OK" : function() {
					$(this).dialog("close");
					neutrinoNavigateTo(getContextPath() + '/app/auth/login');
				}
			});
	$("#ajax_session_timeout")
	.dialog({
			   close:function(event, ui){
				   neutrinoNavigateTo(getContextPath() + '/app/auth/login');
			   }
			});
$("#ajax_session_timeout").html("Please Login again");
$("#ajax_session_timeout").dialog("open");

    // Handle Ajax session timeout here
	//window.location.reload();
}

function getContextPath() {
	var contextPath = cnontexxt;
	return contextPath;
}

function getNotifications() {
        if((typeof triggerNotificationCheck === "function") && !triggerNotificationCheck()){
                	        return;
                	    }
    	if (userName != "" && showNotifications=="true") {
    		setInterval(function() {
    		}, 100000);
    		$
    				.ajax({
    					type : "GET",
    					url : cnontexxt+"/app/getNotifications",
    					async : false,
    					data : {"number" : maxNumber},
    					global : false,
    					dataType:'json',
    					success : function(result) {
    					if (result != "") {
    							for (i = 0; i < result.length; i++) {
    						 if(i-1>=0)
    						 {
                                  if(result[i].message!=result[i-1].message)
                                	{
                                	    if(result[i].notificationType == 'LOGOUT'){
                                             alert(result[i].message)
                                           }else{
                                                new PNotify({
                                                   title : capitalizeFirstLetter(result[i].notificationType),
                                                   text : result[i].message,
                                                   type : result[i].notificationType,
                                                   pnotify_animate_speed : fadeOutduration,
                                                   opacity : .8
                                                });
                                         }
                                	 }
    						   }
    								 else{
    									 if(result[i].notificationType == 'LOGOUT'){
                                               alert(result[i].message)
                                          }else{
                                              new PNotify({
                                                 title : capitalizeFirstLetter(result[i].notificationType),
                                                 text : result[i].message,
                                                 type : result[i].notificationType,
                                                 pnotify_animate_speed : fadeOutduration,
                                                 opacity : .8
                                              });
                                           }
    									 }

    								if (i == maxNumber) {
    									setInterval(function() {
    									}, timer);
    								}
    							}
    						}

    					}

    				});
    	}


}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getResource(){
	jQuery.i18n.properties({
	    name:'JS_Messages',
	    path: getContextPath()+'/resource-bundles/JS_Messages/',
	    mode:'both',
	    cache:true,
	    language:getSystemLocale(),
	    callback: function() {
	    	jQuery.i18n.prop('error_message');
	    }
	});
}
/* The function which is target on required and non-required field to show and hide,used in modal window */
function showChildModalAllFields() {
	$('.modal .nonMandatory').show();
}
function showChildModalMandatoryFields() {
	
	$('.modal .nonMandatory').hide();
}


