var neutrinoMoneyUtil = (function () {

	var moneyUtilGlobalOptions = {};

    var MAX_LENGTH = 15;

	function moneyUtil() {
	}

	/**
	 * formattingArguments={amount:'',localeString:'',currencyCode:'',precision:'',
	 * multipleOf:'',roundingMethod:'RO/RU/RD',roundNumber:'true/false',isSimpleNumber:'true/false'}
	 */
	moneyUtil.prototype.formatteNumber = function (formattingArguments, callback) {
		if (callback != null) {
			loadCurrencyDetails(true, function () {
				callback.call(null, formateNumberInternal(formattingArguments));
			});
		} else {
			loadCurrencyDetails(false);
			return formateNumberInternal(formattingArguments);
		}
	}


	moneyUtil.prototype.parseNumber=function(parsingArguments){
		if(parsingArguments.localeString == null || parsingArguments.localeString == ""){
			parsingArguments.localeString = getLocaleString();
		}
		return convertToSimpleNumber(parsingArguments.amount, parsingArguments.localeString);
	}

	moneyUtil.prototype.getDecimalFormatSymbols=function(localeString){
		localeString=getLocaleString(localeString);
		return {'groupingSymbol' : getSeparator(localeString, 'group'),
		'decimalSymbol' : getSeparator(localeString, 'decimal')};
	}


	function formateNumberInternal(formattingArguments) {
		var moneyInput = validateAndInitializeInput(formattingArguments);
		if (moneyInput.amount == null) {
			return null;
		}
		if(!moneyInput.isSimpleNumber){
			moneyInput.amount = convertToSimpleNumber(moneyInput.amount, moneyInput.localeString);
		}
		if (formattingArguments.roundNumber == "true" || formattingArguments.roundNumber == true) {
			moneyInput.amount = roundNumber(moneyInput.amount, moneyInput.multipleOf, moneyInput.roundingMethod);
		}
		if(!canFormat(moneyInput)){
		    return moneyInput.amount;
		}
        return new Intl.NumberFormat(moneyInput.localeString,
            { minimumFractionDigits: moneyInput.precision, maximumFractionDigits: moneyInput.precision })
            .format(moneyInput.amount);

	}
	function roundNumber(number, multiplesOff, roundingMethod) {
		var roundedNumber = number;
		if (isNaN(roundedNumber)) {
			roundedNumber = 0;
		}
		roundedNumber = new BigDecimal("" + roundedNumber);
		if (multiplesOff != null) {
			var multipleOf = new BigDecimal("" + multiplesOff);
			roundedNumber = roundedNumber.divide(multipleOf, 34, MathContext.ROUND_HALF_UP);
		}
		if (roundingMethod == 'RU') {
			roundedNumber = roundedNumber.setScale(0, BigDecimal.ROUND_CEILING);
		}
		if (roundingMethod == 'RD') {
			roundedNumber = roundedNumber.setScale(0, BigDecimal.ROUND_FLOOR);
		} else {
			roundedNumber = roundedNumber.setScale(0, BigDecimal.ROUND_HALF_UP);
		}
		if (multiplesOff != null) {
			roundedNumber = roundedNumber.multiply(multipleOf);
		}
		return roundedNumber.toString();
	}


	function validateAndInitializeInput(formattingArguments) {
		var moneyInput = {};
		var moneyString = formattingArguments.amount;

		//Setting amount
		if (formattingArguments.amount == null) {
			moneyInput.amount = formattingArguments.amount;
			return moneyInput;
		}
		moneyInput.isSimpleNumber=formattingArguments.isSimpleNumber;
		if (typeof formattingArguments.amount != "string") {
			moneyString = formattingArguments.amount.toString();
			moneyInput.isSimpleNumber=true;
		}
		if(moneyInput.isSimpleNumber==null){
			moneyInput.isSimpleNumber=false;
		}


		//Setting locale
		if (formattingArguments.localeString == null) {
			moneyInput.localeString = getLocaleString();
		}else{
		    moneyInput.localeString = formattingArguments.localeString;
		}

		//Setting currency code and amount
		moneyInput.currencyCode = formattingArguments.currencyCode;
		if (moneyString.indexOf('~') != -1) {
			var moneyParts = moneyString.split("~");
			moneyInput.amount = moneyParts[1];
			if (moneyInput.currencyCode == null) {
				moneyInput.currencyCode = moneyParts[0];
			}
		} else {
			moneyInput.amount = moneyString;
		}
		//Setting precision
		if (formattingArguments.precision == null) {
			moneyInput.precision = getCurrencyFormattingInfoObj(moneyInput.currencyCode).precision;
		} else {
			moneyInput.precision = formattingArguments.precision;
		}
		if (moneyInput.precision == null) {
			moneyInput.precision = 2;
		}

		//Setting rounding info
		moneyInput.multipleOf = formattingArguments.multipleOf;
		moneyInput.roundingMethod = formattingArguments.roundingMethod;
		if (formattingArguments.multipleOf == null) {
			moneyInput.multipleOf = getCurrencyFormattingInfoObj(moneyInput.currencyCode).multipleOf;
		}
		if (formattingArguments.roundingMethod == null) {
			moneyInput.roundingMethod = getCurrencyFormattingInfoObj(moneyInput.currencyCode).roundingMethod;
		}

		return moneyInput;
	}

    function canFormat(moneyInput){
        var amount = moneyInput.amount;
        if(amount.indexOf('.')!=-1){
            return amount.length<= MAX_LENGTH+1;
        }
        return amount.length<= MAX_LENGTH;
    }

	function getLocaleString(localeInput){
		if(localeInput==null){
			if(typeof userLocale != "undefined" && userLocale!=""){
				localeInput=userLocale;
			}else{
				localeInput=getSystemLocale();
			}
		}
		return localeInput.toLocaleString().replace('_', '-');
	}

	function getCurrencyFormattingInfoObj(currencyCode) {
		if (currencyCode == null) {
			currencyCode = 'tenant_currency';
		}
		return moneyUtilGlobalOptions.currencyDetails[currencyCode];
	}

	function loadCurrencyDetails(asyncMode, callback) {
		if (moneyUtilGlobalOptions.currencyDetails != null) {
			if (callback != null) {
				callback.apply();
			}
		} else if (typeof currencyFormatInfo != "undefined" && !currencyFormatInfo.length==0) {
			moneyUtilGlobalOptions.currencyDetails =
				currencyFormatInfo.map(function (currencyInfo) {
					return {
						'currencyCode': currencyInfo[0], 'precision': currencyInfo[1], 'multipleOf': currencyInfo[2],
						'roundingMethod': currencyInfo[3]
					}
				}).reduce(function (accumulator, currentValue) {
					accumulator[currentValue.currencyCode] = currentValue;
					return accumulator;
				}, {});
			if (callback != null) {
				callback.apply();
			}
		} else {
			$.ajax({
				url: getContextPath() + "/app/money/getCurrencyDetails",
				async: asyncMode,
				type: 'GET',
				success: function (currencyDetailsData) {
					var currencies = Object.keys(currencyDetailsData);
					var currencyDetail = {};
					moneyUtilGlobalOptions.currencyDetails = {};
					currencies.forEach(function (currencyKey) {
						moneyUtilGlobalOptions.currencyDetails[currencyKey] =
							{
								'currencyCode': currencyDetailsData[currencyKey].isoCode,
								'precision': currencyDetailsData[currencyKey].decimalPlaces,
								'multipleOf': currencyDetailsData[currencyKey].multiplesOff,
								'roundingMethod': currencyDetailsData[currencyKey].roundMethod
							}
					})
					if (callback != null) {
						callback.apply();
					}
				}
			});
		}
	}

	function convertToSimpleNumber(moneyAmount, localeString) {
		var groupingSeparator = getSeparator(localeString, 'group');
		var decimalSeparator = getSeparator(localeString, 'decimal');
		if(/\s/.test(groupingSeparator)){
			groupingSeparator="\s";
		}
		if(/\s/.test(decimalSeparator)){
			decimalSeparator="\s";
		}

		moneyAmount = moneyAmount.replace(new RegExp("\\" + groupingSeparator, "g"), "");
		return moneyAmount.replace(new RegExp("\\" + decimalSeparator, "g"), ".");
	}

	function getSeparator(locale, separatorType) {
		return supportedLocaleToSymbolMap[locale.toLocaleString().replace('_', '-')][separatorType];
	}

	var supportedLocaleToSymbolMap={
		'vi-VN' : {
			decimal : ',',
			group : '.'
		},
		'fr-FR' : {
			decimal : ',',
			group : ' '
		},
		'ar-SA' : {
			decimal : '.',
			group : ','
		},
		'en-US' : {
			decimal : '.',
			group : ','
		},
		'en-IN' : {
			decimal : '.',
			group : ','
		},
		'hi-IN' : {
			decimal : '.',
			group : ','
		},
		'ja-JP' : {
			decimal : '.',
			group : ','
		}		
	};
	return new moneyUtil();
})();

