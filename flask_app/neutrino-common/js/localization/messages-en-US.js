/*
* Translated default messages for the jQuery validation plugin.
*/
(function ($) {
$.extend($.validator.messages, {
	required: "This field is required.",
	character: "Only characters allowed.",
	alphanum: "Only alphanumeric value is allowed.",
	isoCode: "Only digits are allowed prefix with '+'",
	remote: "Please fix this field.",
	email: "Please enter a valid email address.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	dateDE: "Bitte geben Sie ein gültiges Datum ein.",
	number: "Please enter a valid number.",
	numberDE: "Bitte geben Sie eine Nummer ein.",
	digits: "Please enter only digits",
	creditcard: "Please enter a valid credit card number.",
	equalTo: "Please enter the same value again.",
	accept: "Please enter a value with a valid extension.",
	maxlength: $.validator.format("Please enter no more than {0} characters."),
	minlength: $.validator.format("Please enter at least {0} characters."),
	rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
	range: $.validator.format("Please enter a value between {0} and {1}."),
	max: $.validator.format("Please enter a value less than or equal to {0}."),
	min: $.validator.format("Please enter a value greater than or equal to {0}."),
	amount: "Please enter a valid amount.",
	percent:"Please enter value between 0 to 100 upto 2 decimal places.",
	floatingDigits:"Please enter a valid number",
	personName:"Please enter a valid name"
});
}(jQuery));