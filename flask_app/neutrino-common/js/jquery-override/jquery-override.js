/*Below will override jquery .val method in order to achieve auto update of chosen on value change of select without having 
 * to trigger chosen:updated event 
 */
(function(){
	var overrideJqueryFnPlugin=function(methodName,elementIdentifier,action)
	{
		var originalMethod = $.fn[methodName];
		$.fn[methodName]=function()
		{
			var result=originalMethod.apply(this,arguments);
			if(elementIdentifier.apply(this,arguments))
			{
				action.apply(this, arguments);
			}
			return result;
		}
	}
	overrideJqueryFnPlugin('val',function(){
		if($(this).attr('chosen_auto_update') && arguments.length >= 1 && arguments[1]!='internal')
		{
			return true;
		}
		return false;
	},function(){
		$(this).trigger('chosen:updated');
		console.warn('Auto update of chosen will be removed, So instead use trigger\(\'chosen:updated\'\)');
	})
	
	overrideJqueryFnPlugin('removeAttr',function(){
		if(arguments.length == 1 &&  (arguments[0] == 'selected' || arguments[0] == 'checked' || arguments[0] == 'readonly' ))
		{
			return true;
		}
		return false;
	},function(){
		$(this).prop(arguments[0], false);
	})
})();

//* ECMAScript 6 specification for endsWith() that may not be available in all JavaScript implementations yet
(function(){
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(search, this_len) {
			if (this_len === undefined || this_len > this.length) {
				this_len = this.length;
			}
			return this.substring(this_len - search.length, this_len) === search;
		};
	}
})();