//code to prevent accidental double-click which my cause multiple form/data submits and other problems. 
$(document).ready(function() {
$("body").on("click.global","button,input[type='button'],input[type='submit']",function(){
       
	var buttonn=$(this);
	var btnType=buttonn.attr("type")?buttonn.attr("type"):'';
	var isToggle=buttonn.data("toggle")?true:false;
	//excluding submit type buttons in chrome for now
	var isChrome=/chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
	if(!(isChrome && (btnType=='submit')) && !(isToggle)){
	if(!(buttonn.hasClass("multiselect")||buttonn.hasClass("dropdown-toggle") || buttonn.hasClass("ignore_wait") || buttonn.hasClass("ColVis_Button")))
       {
       if(buttonn.is('button')){
		   
              buttonn.data("orgText",buttonn.html());
              buttonn.html("Wait..");
              buttonn.addClass("click-wait");
       }else if(buttonn.is('input')){
		   
              buttonn.data("orgText",buttonn.val());
              buttonn.val("Wait..");
              buttonn.addClass("click-wait");
       }
       buttonn.attr("disabled","disabled");
       
       setTimeout(function() { buttonn.removeAttr("disabled");
       
       if(buttonn.is('button')){
              buttonn.html(buttonn.data("orgText"));
              buttonn.removeClass("click-wait");
       }else if(buttonn.is('input')){
              buttonn.val(buttonn.data("orgText"));
              buttonn.removeClass("click-wait");
       }
       }, buttonn.hasClass("moveToNextStageBtn")?3000:3005);
       
       }}
       
});
              });