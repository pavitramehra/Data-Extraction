
/* need more work in the same */
$('select.chosen_a').livequery(function(){ 
    $(this).hover(function() { 
         
        	var optionSelected = $("option:selected", this);
 		    $(this).attr("data-original-title", optionSelected.text());
 		    $(this).tooltip({
 		        'placement': 'right',
 		      'delay': { show: 500, hide: 100 }
 		    });
 	// console.info( optionSelected.text() + ' select hover');
 	// $(this).css('background','red');
 		
        });
    
    $(this).focus(function() { 
         
    	var optionSelected = $("option:selected", this);
	    $(this).attr("data-original-title", optionSelected.text());
    $(this).tooltip({
	        'placement': 'right',
	        'delay': { show: 500, hide: 100 }
	    });
	  
	// console.info( optionSelected.text() + ' select focus');
// $(this).css('background','orange');
    });
    
    
	$(this).change(function (f) {
		$(this).tooltip('hide');
	    var optionSelected = $("option:selected", this);
	    $(this).attr("data-original-title", optionSelected.text());
	// console.info( optionSelected.text() +' select change');
	// $(this).css('background','green');
	    
	   $(this).tooltip({
	        'placement': 'right',
	       'delay': { show: 500, hide: 100 }
	    });
	   
	   /*
		 * $('.chosen-single').attr("data-original-title",
		 * optionSelected.text());
		 * 
		 * $(this).tooltip('show'); });
		 */
    
	
/*
 * $(this).keyup(function( event ) { if ( event.keyCode == 38 ) {
 * 
 * $(this).tooltip('hide'); var optionSelected = $("option:selected", this);
 * $(this).attr("data-original-title", optionSelected.text()); $(this).tooltip({
 * 'placement': 'right', 'delay': { show: 500, hide: 100 } });
 * $(this).tooltip('show'); console.info( optionSelected.text() +' select up
 * arrow change');
 *  }
 * 
 * if ( event.keyCode == 40 ) {
 * 
 * $(this).tooltip('hide'); var optionSelected = $("option:selected", this);
 * $(this).attr("data-original-title", optionSelected.text()); $(this).tooltip({
 * 'placement': 'right', 'delay': { show: 500, hide: 100 } });
 * $(this).tooltip('show'); console.info( optionSelected.text() +' select down
 * arrow change');
 *  }
 * 
 * });
 */
    	
        
    }, function() { 
        
    }); 
 

		
		
/*******************************************************************************************/
/*******************************************************************************************/		

 	function info_tooltip()
 	{
 		
 	}