function getRegexValueForValidations(){
	var regexForValidation = new Object();	
	regexForValidation.alphaNumWithDecimal=	/^([\u0900-\u097F0-9\-. ]|[A-Za-z0-9\-. ])+$/;
	regexForValidation.characterRegex=/^([\u0900-\u097F ]|[a-zA-Z ])+$/i;
	regexForValidation.validBPName=/^([\u0900-\u097F_,#:.)(&\]\[\-\s]|[a-zA-Z0-9_,#:.)(&\]\[\-\s])*$/;
	regexForValidation.validRuleName = /^([\u0900-\u097F_\- ]|[A-Za-z0-9_\- ])*$/;
	regexForValidation.validName = /^([\u0900-\u097F_\- ]|[A-Za-z\- ]){1,30}$/;
	regexForValidation.alphanum = /^([\u0900-\u097F ]|[a-z0-9\- ])+$/i;
	regexForValidation.personName = /^(([\u0900-\u097F ]|[a-zA-Z])+([\']([\u0900-\u097F ]|[a-zA-Z])+)*)$/i;
	regexForValidation.validCommunicationName = /^([\u0900-\u097F ]|[A-Za-z ])*$/;		
	regexForValidation.validLocation = /^([\u0900-\u097F_\-:\\.\/ ]|[a-zA-Z0-9_\-:\\.\/ ])*$/;
	regexForValidation.validBranchCode = /^([\u0900-\u097F_]{1,20}|[A-Za-z0-9_]{1,20})$/;
	regexForValidation.validNoteCode = /^([\u0900-\u097F_]{1,20}|[A-Za-z0-9_]{1,20})$/;
	regexForValidation.validCode = /^([\u0900-\u097F_]{1,8}|[A-Za-z0-9_]{0,8})$/;	
	regexForValidation.validElementKey = /^([\u0900-\u097F0-9_\-]+( [\u0900-\u097F0-9_\-]+)|[A-Za-z0-9_\-]+( [A-Za-z0-9_\-]+))*$/;
	regexForValidation.validateDefaultRate = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;
	regexForValidation.validateCurrConvRate = /^[0-9]*(\.[0-9]{0,12})?$/;
	regexForValidation.validateDefaultPercentage = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;
	regexForValidation.validateLtv = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;	
	regexForValidation.validNameWithoutSpaces = /^([\u0900-\u097F0-9_]{1,20}|[A-Za-z0-9_]{1,20})$/;	
	regexForValidation.validTimecode = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
	regexForValidation.validInteger = /^-?\d+$/;
	regexForValidation.isoCode = /^[0-9+ ]+$/i;
	regexForValidation.amount = /^[0-9.,-]+$/i;
	regexForValidation.percent = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/i;
	regexForValidation.floatingDigits = /^[0-9]*(\.[0-9]+)?$/i;
	regexForValidation.dateDE = /^\d\d?\.\d\d?\.\d\d\d?\d?$/;
	regexForValidation.numberDE = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/;
	regexForValidation.lettersOnly = /^([\u0900-\u097F]|[a-z])+$/i;
	regexForValidation.letterswithbasicpunc = /^([\u0900-\u097F\-.,()'\"\s]|[a-z\-.,()'\"\s])+$/i;
	return regexForValidation;
}


