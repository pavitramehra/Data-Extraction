/**
 * This file is with the overridden methods of header.js
 * These methods are modified to work with optimized performance by including ajax loading functionality
 * @returns
 */

function closePreferences(){
	
		$('#preference-form').modal('hide');
		var currentPathname = window.location.pathname;
		if(currentPathname.includes("applicationDatatableVo") && appId){
			var url=createLinkForApplicationViewing(taskId);
			openScreenByAjaxCall(url,"GET");
		}else{
			window.location.reload()
		}

	}
	function savePreferences(){
		
		$.ajax({
			url : getContextPath()+"/app/configuration/save",
			type : 'POST',
			async : false,
			data : $('#preferencesForm').serialize(),
			success : function(message) {
				//location.reload();
				if(showNotifications=="true"){
					new PNotify({
						title : data_saved,
						text : message,
						type : success,
						opacity : .8
					});
				}				
				/* showMyFav(); */
			},
			error : function(jqXHR, textStatus, errorThrown) {
				if(showNotifications=="true"){
					new PNotify({
						title : some_errror_occured,
						text : try_again,
						type : 'error',
						opacity : .8
					});
				}
			}
		});
		closePreferences();
	}	