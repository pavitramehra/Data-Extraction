/* ===========================================================
 * neutrino-bootstrap-utility.js
 * ===========================================================
 * @author Debendra
 *
 * @Description :
 *
 * ========================================================== */

/**
 *
 * */

var modalTabHandler =function(){
		this.fEle 	 ='';
		this.mdStack =new Array();
}


modalTabHandler.prototype.init = function(evt){
	this.setFocusAndControlTab(evt);
	mdhandler =this;
	$(evt.element).on('hidden.bs.modal',function(){ mdhandler.closeModal();});
}
Array.min = function( array ){return Math.min.apply( Math, array );};
modalTabHandler.prototype.getFirstEle = function(modal,modalSection){
	var max = Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:9007199254740991,
		e1 = $(modal).find(modalSection).find('.chosen-container:not(".chosen-disabled"),select:not("disabled"):not([readonly="readonly"]):not([tabindex=-1]),button:not("disabled"):not([readonly="readonly"]):not([tabindex=-1]),a:not("disabled"):not([readonly="readonly"]):not([tabindex=-1])').filter(':visible:first'),
		e2 = $(modal).find(modalSection).find('textarea:not([readonly="readonly"]):not([disabled="disabled"]):not(:hidden):not([tabindex=-1])').filter(':visible:first'),
		e3 = $(modal).find(modalSection).find('input:not([readonly="readonly"]):not([disabled="disabled"]):not(:submit):not(:hidden):not([tabindex=-1])').filter(':visible:first');
	var t1 = e1.length?e1.offset().top:max,
		t2 = e2.length?e2.offset().top:max,
		t3 = e3.length?e3.offset().top:max;
	var l1 = e1.length?e1.offset().left:max,
		l2 = e2.length?e2.offset().left:max,
		l3 = e3.length?e3.offset().left:max;
	var a = [t1,t2,t3],
		b = [l1,l2,l3], 
		c = [e1,e2,e3];
	var ina = $.map(a, function(o,i) { if (o === Array.min(a)) return i; }), // returns indecies of the min top offsets
		newaar = [];
		if(ina.length==1){return c[a.indexOf(Array.min(a))];}
		else{
			ina.forEach(function(value,index){
				if(value!=undefined){newaar.push(b[value])}
			});
			return c[ina[newaar.indexOf(Array.min(newaar))]];
		}
}
modalTabHandler.prototype.lastEleTabHandler = function(){
	if(this.fEle !=undefined){
		this.fEle.focus();
	}
}
modalTabHandler.prototype.setFocusAndControlTab = function(e){
	this.mdStack.push(document.activeElement);
	setTimeout(function(){
		this.fEle =this.getFirstEle(e.element,'.modal-body');
		if(this.fEle) {
			this.fEle =this.fEle.length>0?this.fEle:this.getFirstEle(e.element,'.modal-footer');
		}
		if(this.fEle && this.fEle.length>0){
			if(this.fEle.hasClass('chosen-container')){
				this.fEle.find('input').focus();
			}else if(this.fEle.attr('multiple')=='multiple'){
				this.fEle.siblings('div').find('input:first').focus();
			}else{
				this.fEle.focus();
			}
		}
		if($(e.element).find('.ghostModalEle').length==0)
			$(e.element).append('<input class="ghostModalEle" id="ghostModalEle" type="text" name="text" style="position: absolute; left:-99999999px" onfocus="mdhandler.lastEleTabHandler()">');
		if(this.fEle) {
			this.fEle.on('keydown', function (evt) {
				if (evt.keyCode==9 && evt.shiftKey){
					//evt.preventDefault();
				}
			});
		}
	}.bind(this),0);
}

modalTabHandler.prototype.closeModal = function(){
	this.fEle =this.mdStack.pop();
	this.lastEleTabHandler();
}

function check_modalTabHandler_initialization(e){
	if($(e).hasClass('loading')){return true;}
	else{return false;}
}

window.addEventListener('modalLoaded',function(e){
		if(check_modalTabHandler_initialization(e.element)){
			return;
		}
		if(modalTabHandlerObj==null)
			modalTabHandlerObj = new modalTabHandler();
		modalTabHandlerObj.init(e);
	
});
var modalTabHandlerObj;
