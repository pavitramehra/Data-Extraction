/**
 * Js file to keep propagating conversational id with all requests and to open
 * new tabs/windows with new conversational id
 */
var RANDOM_NUM_LENGHT = 15;
var _HKSTDTOKEN="_hkstd";
var _HKSTD_REQUEST_DATA_PARAM="__hkstd_data_st";
var getAbsoluteUrl = (function() {
	var a;
	return function(url) {
		if(!a) 
		{
			a = document.createElement('a');
		}
		a.href = url;
		return a.href;
	};
})();

var getActualEncodedUrl = (function() {
	return function(url) {
		url=getAbsoluteUrl(url);
		var absBaseUrl=getAbsoluteUrl(getContextPath())
		url=url.replace(absBaseUrl,"");
		return getContextPath()+url;
	};
})();

var getUrlWithData=(function() {
	return function(form,url) {
		if(form.method==null || form.method.toUpperCase()!='GET')
		{
			return url;
		}
		var query=$(form).serialize();
		if(query!="")
		{
			var separator = url.indexOf('?') !== -1 ? "&" : "?";
			url=url+separator+query;
		}
		return url;
	};
})();
var removeExistingHkstdFromForm=(function(){
	return function(form){
		if($(form).children("input[name='"+_HKSTDTOKEN+"']").length>0)
		{
			$(form).children("input[name='"+_HKSTDTOKEN+"']").remove();
		}
	}
})();

var removeParamByNameFromQuery=(function(){
	return function( queryString,  param) {
		var regex = new RegExp("&"+param+"=[^&]*?(?=(&|$))|\\?"+param+"=[^&]*?($)|(?<=(\\?))"+param+"=[^&]*?(&)");
		return queryString.replace(regex, "");
	}
})();


/**
 * So far formData.entries not supported in IE-11, so adding custom support - PDDEV-18350
 */
(function(){
	if(typeof FormData.prototype.entries=="undefined"){
		
		var NativeFormData=FormData;
		FormData=function(){
			if(arguments[0]!=null){
				var data=$(arguments[0]).serializeObject();
				var	dataMap=[];
				Object.keys(data).forEach(function(key){
					var entry={'key':key};
					if (typeof data[key] != 'string' && data[key] != null
							&& typeof data[key] != 'object') {
						entry.value = JSON.stringify(data[key]);
					} else {
						entry.value = data[key];
					}
					dataMap.push(entry);
				})
				var formDataObj= new NativeFormData(arguments[0])
				formDataObj.dataMap=dataMap;
				return formDataObj;
			}
			return new NativeFormData();
		}
		FormData.prototype=NativeFormData.prototype;
		
		var realAppend=FormData.prototype.append;
		FormData.prototype.append=function(){
			if(this.dataMap==null){
				this.dataMap=[];
			}
			var entry={'key':arguments[0]};
			if (typeof arguments[1] != 'string' && arguments[1] != null
					&& typeof arguments[1] != 'object') {
				entry.value = JSON.stringify(arguments[1]);
			} else {
				entry.value = arguments[1];

			}
			
			this.dataMap.push(entry);
			return realAppend.apply(this, arguments);
		}
		
		FormData.prototype.entries=function(){
			var array=this.dataMap;
			if(array==null){
				array=[];
			}
			 var nextIndex = 0;
			    return {
			       next: function() {
			    	   var index=nextIndex;
			    	   nextIndex++;
			           return index < array.length ?
			               {value: [array[index].key,array[index].value], done: false} :
			               {done: true};
			       }
			    };
		}

	}
})()

$.fn.formToJsonObject = function(formData) {
	var jsonObject = {};
	var iterator = formData.entries();
	var next = iterator.next();
	while (!next.done) {
		var key = next.value[0];
		var value = next.value[1];
		if(value!=null && typeof value=='object' && Object.getPrototypeOf(value)==File.prototype){
			next = iterator.next();
			continue;
		}
		if (typeof jsonObject[key] === "undefined") {
			jsonObject[key] = value;
		} else if (typeof jsonObject[key] === "string") {
			var arr = [ jsonObject[key], value ];
			jsonObject[key] = arr;
		} else {
			jsonObject[key].push(value);
		}
		next = iterator.next();
	}
	return jsonObject;
};

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};


$.fn.deparamQueryString = function (query) {
	var query_string = {};
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		pair[0] = decodeURIComponent(pair[0]);
		pair[1] = decodeURIComponent(pair[1]);
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
};

(function() {
	if(XMLHttpRequest.prototype.open.loadIdentification!=null && XMLHttpRequest.prototype.open.loadIdentification==true)
	{
		return;
	}
	var realOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {
		arguments[1]=getLinkUrlWithSecurityToken(arguments[1]);
		if(arguments[1].indexOf("getEncryptionParameters")==-1 &&
				arguments[0].toUpperCase()=='POST' && isEncryptionEnabledForParam())
		{
			this.httpMethodName='POST';
		}
		return realOpen.apply(this, arguments);
	}
	XMLHttpRequest.prototype.open.loadIdentification=true;
	
	var realSend = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function() {
			if(arguments[0]!=null && this.httpMethodName=='POST')
			{
				if(typeof arguments[0]=='object' && Object.getPrototypeOf(arguments[0])==FormData.prototype){
					var encryptedStr=addEncryptedDataStr(null,'POST',$.fn.formToJsonObject(arguments[0]));
					arguments[0].append("__hkstd_data_st",encryptedStr);
				}
				else{
					var orgStr=arguments[0];
					if(orgStr.indexOf(_HKSTD_REQUEST_DATA_PARAM)!=-1){
						orgStr=removeParamByNameFromQuery(orgStr,_HKSTD_REQUEST_DATA_PARAM);
					}
					var strWithOutPlus=arguments[0].replace(/\+/g,'%20');
					var data=$.fn.deparamQueryString(strWithOutPlus);	
					var encryptedStr=addEncryptedDataStr(null,'POST',data);
					arguments[0]=orgStr+"&__hkstd_data_st="+encryptedStr;
				}
			}
		return realSend.apply(this, arguments);
	}

	
	var submitFunc=HTMLFormElement.prototype.submit;
	HTMLFormElement.prototype.submit=function()
	{

		if( typeof unmodifiableDatakey !== "undefined" && unmodifiableDatakey!="null" &&  unmodifiableDatakey!=null ){
			$(this).append("<input type='hidden' name='"+unmodifiableDatakey+"' value='"+getAllValidationElements()+"' />");
		}

		var url=this.action.substring(this.action.indexOf(getContextPath()));
		removeExistingHkstdFromForm(this);
		url=getUrlWithData(this,url);
		$(this).append("<input type='hidden' name='"+_HKSTDTOKEN+"' value='"+generateHkstdTkn(url)+"' />");
		addEncryptedDataStr(this,this.method);
		submitFunc.apply(this, arguments);
	}
	
	
	var jquerySubmitFunction=$.fn.submit;
		$.fn.submit=function(){	
			if(this[0]!==undefined && arguments[0]==null){
				addEncryptedDataStr(this[0],this[0].method);
			}
			jquerySubmitFunction.apply(this, arguments);
		}
})();
function addEncryptedDataStr(formObj,method,data){
	if(!isEncryptionEnabledForParam()){
		return;
	}
	if(data!=null){
		return encryptJsonString(data);
	}
	if(method==null || method.toUpperCase()!='POST' )
	{
		return;
	}
	if(typeof $(formObj)[0][_HKSTD_REQUEST_DATA_PARAM]!=='undefined'){
		$($(formObj)[0][_HKSTD_REQUEST_DATA_PARAM]).remove();
	}
	var values=$(formObj).serializeObject();
	
	$(formObj).append("<input type='hidden' name='"+_HKSTD_REQUEST_DATA_PARAM+"' value='"+encryptJsonString(values)+"' />");
}
function encryptJsonString(jsonStr){
	if(jsonStr[_HKSTD_REQUEST_DATA_PARAM]!=null){
		delete jsonStr[_HKSTD_REQUEST_DATA_PARAM];
	}
	var jsonValues=JSON.stringify(jsonStr);
	var aesUtil = new AesUtil();
	return encodeURIComponent(aesUtil.encrypt(getHkstdSecret(), jsonValues).toString());
}
function isStaticResourceRequest(url){
	if(url.indexOf("/static-resources/")!=-1 || url.indexOf("/resource-bundles/")!=-1){
		return true;
	}
	if(url.indexOf("/js/")!=-1 && url.indexOf(".js")!=-1){
		return true;
	}
	return false;
}
function generateHkstdTkn(url)
{
	if(url==null)
	{
		return "";
	}	
	if(isStaticResourceRequest(url))
	{
		return "";
	}
	if(url.indexOf(_HKSTDTOKEN)!=-1)
	{
		url=removeParamByNameFromQuery(url,_HKSTDTOKEN);
	}
	url=removeExtraQuestionMark(url);
	url=getActualEncodedUrl(url);
	var timeStamp = new Date().getTime().toString();
	return md5(url+getCsrfTokenValue()) + md5(timeStamp)+btoa(timeStamp);
}
function removeExtraQuestionMark(url){
	var resp = url.endsWith("?");
	if(resp==true){
		return url.slice(0,-1);
	} else {
		return url;
	}
}
$(document).ready(function() {	

	$('body').on("mousedown", "a", function(event) {

		var converId = CONV_ID;
		var realHref=$(this).data("real-href-url");
		if(realHref){
			$(this).attr('href',realHref);
		}
		var href = $(this).attr("href");
		if (href) {
			href = href.trim();
		}
		if (event.shiftKey || event.ctrlKey) {
			converId = randomAlphaNumOfLength(RANDOM_NUM_LENGHT);
			if (href && href.indexOf('#') != 0 && href.indexOf('javascript') != 0
					&& converId) {
				var linkUrl=getContextPath() + dashboardURL + "?_cid=" + converId;
				window.open(getLinkUrlWithSecurityToken(linkUrl));
			}
		}

		if ((event.which == 1)) {
			// left click--> do nothing
		}else if ((event.which == 3)) {
			// right click
			if (href && href.indexOf('#') != 0 && href.indexOf('javascript') != 0
					&& converId) {
				converId = randomAlphaNumOfLength(RANDOM_NUM_LENGHT);
				$(this).data("real-href-url",href);
				href=getContextPath() + dashboardURL;
			}
		} else if ((event.which == 2)) {
			// middle mouse button
			converId = randomAlphaNumOfLength(RANDOM_NUM_LENGHT);
			if (href && href.indexOf('#') != 0 && href.indexOf('javascript') != 0
					&& converId) {
				var	linkUrl=getContextPath() + dashboardURL + "?_cid=" + converId;				
				window.open(getLinkUrlWithSecurityToken(linkUrl));
			}
		}

		href=addConversationIdToHref(href, converId);
		$(this).attr('href',getLinkUrlWithSecurityToken(href));

	});
	
	$(document).on("keydown","a",function(e){
		if(e.which == 13){
			var targetHref = $(e.target).attr("href");
			if(typeof targetHref !== typeof undefined && targetHref != false && targetHref.match("^[^\#]") && targetHref !== "" && targetHref.indexOf("javascript:void") == -1){
				$(e.target).mousedown();
				window.location.href = $(e.target).attr("href");
			}
		}
	})

	$('body').on("click", "img", function(event) {

		var converId = CONV_ID;
		var targetURLImg = $(this).attr("targeturl");
		targetURLImg=addConversationIdToHref(targetURLImg, converId);
		$(this).attr('targeturl',getLinkUrlWithSecurityToken(targetURLImg));

	});


	$(document).on("submit","form",function()
			{
		if(typeof unmodifiableDatakey !== "undefined" && unmodifiableDatakey!="null" &&  unmodifiableDatakey!=null ){
			$(this).append("<input type='hidden' name='"+unmodifiableDatakey+"' value='"+getAllValidationElements()+"' />");
		}

		var url=this.action.substring(this.action.indexOf(getContextPath()));
		removeExistingHkstdFromForm(this);
		url=getUrlWithData(this,url);
		$(this).append("<input type='hidden' name='"+_HKSTDTOKEN+"' value='"+generateHkstdTkn(url)+"' />");

		addEncryptedDataStr(this,this.method);
	});

});
function getLinkUrlWithSecurityToken(url)
{
	var securityToken=generateHkstdTkn(url);
	return addSecurityTokenToUrl(url, securityToken);
}


function neutrinoNavigateTo(targetUrl) {

	if (CONV_ID && targetUrl && targetUrl.trim() != "") {

		targetUrl = addOrUpdateQueryStringParameter(targetUrl, "_cid", CONV_ID);
	}
	targetUrl=getLinkUrlWithSecurityToken(targetUrl);
	window.location.href = targetUrl;
}

function neutrinoOpenInNewWindow(targetUrl) {

	if (CONV_ID && targetUrl && targetUrl.trim() != "") {

		targetUrl = addOrUpdateQueryStringParameter(targetUrl, "_cid", CONV_ID);
	}
	targetUrl=getLinkUrlWithSecurityToken(targetUrl)
	window.open(targetUrl);
}

function neutrinoOpenInNewCustomWindow(targetUrl, name, specs, replace) {

	if (CONV_ID && targetUrl && targetUrl.trim() != "") {

		targetUrl = addOrUpdateQueryStringParameter(targetUrl, "_cid", CONV_ID);
	}
	targetUrl=getLinkUrlWithSecurityToken(targetUrl)
	window.open(targetUrl, name, specs, replace);
}

function addSecurityTokenToUrl(href,token)
{
	if (href && href.indexOf('#') != 0 && href.indexOf('javascript') != 0
			&& token) {
		return addOrUpdateQueryStringParameter(href, _HKSTDTOKEN, token);
	}
	return href;

}
/* Private utility functions */

function addConversationIdToHref(href, converId) {

	if (href && href.indexOf('#') != 0 && href.indexOf('javascript') != 0
			&& converId) {
		return addOrUpdateQueryStringParameter(href, "_cid", converId);
	}
	return href;
}

function randomAlphaNumOfLength(len) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < len; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function addOrUpdateQueryStringParameter(uri, key, value) {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");

	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (endsWith(uri, "?")) {
		separator = "";
	}

	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		return uri + separator + key + "=" + value;
	}
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function appendSecurityTokenToImageSource() {
	$("img").on("error",function() {
		var targetURLImg = $(this).attr("src");
		//if img url is either empty or it contains hkstd token then return
		if (!targetURLImg || targetURLImg.indexOf(_HKSTDTOKEN) != -1) {
			return;
		}
		var converId = CONV_ID;
		targetURLImg = addConversationIdToHref(targetURLImg, converId);
		$(this).attr('src', getLinkUrlWithSecurityToken(targetURLImg));
	});
}

$(document).ajaxComplete(function() {
	$(document).ready(function() {
		appendSecurityTokenToImageSource();
	});
});

function getAllValidationElements(){
	var data =[];
	$.each($('#'+unmodifiableDatakey),function(i,ele){
		data.push($(ele).val());
	});
	return data;
}