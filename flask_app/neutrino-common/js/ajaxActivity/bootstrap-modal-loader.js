/********************************************
	Global bootstrap modal loader
	$('body').modalmanager('loading');
	http://api.jquery.com/ajaxStart/
	http://api.jquery.com/ajaxComplete/
 *********************************************/


/*
var isModalLoadingShow=false;
var requestsInProcess= 0;
var isBusy=false;


$(document).ready(function() {		 
	
	$(document).ajaxStart(function(event) {		
		
		  requestsInProcess++;	
		  setTimeout( function() { callOnStart() },100 );	
		
	});
	
	$(document).ajaxStop(function(event) {
		
		requestsInProcess--;		
	
		if (isModalLoadingShow && requestsInProcess<=0)
			{		
			 $('#neutrino-header .loader-test').remove(); 
			  
			  isModalLoadingShow=false;
			}	
	});
	
	
	function callOnStart()
	{			
		 if (!isModalLoadingShow && requestsInProcess>0 )
		  {
		 $('#neutrino-header .loader-test').html('<div class="ajax-loader" >Loading...</div>'); 
		  isModalLoadingShow=true;	  
		  }
	}

 


	
}); */

/***********************************
	MODAL MANAGER PLUGIN DEFINITION
*************************************/

!function ($) {

	$.fn.modalmanager.defaults = {
			loading: true,
			backdropLimit: 999,
			resize: true,
			spinner: '<div class="loading-spinner modal-manager-loader fade" style="width: 200px; margin-left: -43px;"><div class="windows8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div></div><div class="neutrino-loader-txt">Loading</div></div>'
		};

	$.fn.modal.defaults = {
			keyboard: false,
			backdrop: 'static',
			loading: false,
			show: true,
			width: null,
			height: null,
			maxHeight: null,
			modalOverflow: false,
			consumeTab: true,
			focusOn: null,
			replace: false,
			resize: false,
			attentionAnimation: 'shake',
			manager: 'body',
			spinner: '<div class="loading-spinner modal-window-loader fade" style="width: 200px; margin-left: -43px;"><div class="windows8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div></div><div class="neutrino-loader-txt">Loading</div></div>'
		};

}(window.jQuery);







































