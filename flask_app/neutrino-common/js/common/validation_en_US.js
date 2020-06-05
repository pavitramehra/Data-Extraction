function getRegexValueForValidations(){
	var regexForValidation = new Object();
	regexForValidation.alphaNumWithDecimal=	/^[A-Za-z0-9\-. ]+$/;
	regexForValidation.characterRegex=/^[a-zA-Z ]+$/i;
	regexForValidation.validBPName=/^[a-zA-Z0-9_,#:.)(&\]\[\-\s]*$/;
	regexForValidation.validRuleName = /^[A-Za-z0-9_\- ]*$/;
	regexForValidation.validName = /^[A-Za-z& ]{1,30}$/;
	regexForValidation.alphanum = /^[a-z0-9\- ]+$/i;
	regexForValidation.personName = /^([a-zA-Z]+([\']([a-zA-Z])+)*)$/i;
	regexForValidation.validCommunicationName=/^[A-Za-z ]*$/;
	regexForValidation.validLocation=/^[a-zA-Z0-9_\-:\\.\/ ]*$/;
	regexForValidation.validBranchCode = /^[A-Za-z0-9_]{1,20}$/;
	regexForValidation.validNoteCode = /^[A-Za-z0-9_]{1,20}$/;
	regexForValidation.validCode = /^[A-Za-z0-9_]{0,8}$/;
	regexForValidation.validElementKey = /^[A-Za-z0-9_\-]+( [A-Za-z0-9_\-]+)*$/;
	regexForValidation.validateDefaultRate = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;
	regexForValidation.validateCurrConvRate = /^[0-9]*(\.[0-9]{0,12})?$/;
	regexForValidation.validateDefaultPercentage = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;
	regexForValidation.validateLtv = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/;
	regexForValidation.validNameWithoutSpaces = /^[A-Za-z0-9_]{1,20}$/;
	regexForValidation.validTimecode = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
	regexForValidation.validInteger = /^-?\d+$/;
	regexForValidation.isoCode = /^[0-9+ ]+$/i;
	regexForValidation.amount = /^[0-9.,-]+$/i;
	regexForValidation.percent = /^[0-9]{0,2}(\.[0-9]{1,2})?$|^(100)(\.[0]{1,2})?$/i;
	regexForValidation.floatingDigits = /^[0-9]*(\.[0-9]+)?$/i;
	regexForValidation.dateDE = /^\d\d?\.\d\d?\.\d\d\d?\d?$/;
	regexForValidation.numberDE = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/;
	regexForValidation.lettersOnly = /^[a-z]+$/i;
	regexForValidation.letterswithbasicpunc = /^[a-z\-.,()'\"\s]+$/i;
	return regexForValidation;
}


