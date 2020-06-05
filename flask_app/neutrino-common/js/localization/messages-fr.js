/*
* Translated default messages for the jQuery validation plugin.
*/
(function ($) {
$.extend($.validator.messages, {
	required: "Ce champ est obligatoire.",
	character: "Seuls les caractères autorisés.",
	alphanum: "Seulement valeur alphanumérique est autorisé.",
	isoCode: "Seuls les chiffres sont autorisés préfixe '+'",
	remote: "S'il vous plaît corriger ce domaine.",
	email: "S'il vous plaît entrer une adresse email valide.",
	url: "S'il vous plaît entrer une URL valide.",
	date: "S'il vous plaît entrer une date valide.",
	dateISO: "S'il vous plaît entrer une date valide (ISO).",
	dateDE: "S'il vous plaît entrer une date valide.",
	number: "S'il vous plaît entrer un nombre valide.",
	numberDE: "S'il vous plaît, entrez un numéro.",
	digits: "S'il vous plaît saisir que des chiffres",
	creditcard: "S'il vous plaît entrer un numéro de carte de crédit valide.",
	equalTo: "S'il vous plaît entrer de nouveau la même valeur.",
	accept: "S'il vous plaît entrer une valeur avec une extension valide.",
	maxlength: $.validator.format("S'il vous plaît entrez pas plus de {0} caractères."),
	minlength: $.validator.format("S'il vous plaît entrer au moins {0} caractères."),
	rangelength: $.validator.format("S'il vous plaît entrer une valeur comprise entre {0} et {1} caractères."),
	range: $.validator.format("S'il vous plaît entrer une valeur comprise entre {0} et {1}."),
	max: $.validator.format("S'il vous plaît entrer une valeur inférieure ou égale à {0}."),
	min: $.validator.format("S'il vous plaît entrer une valeur supérieure ou égale à {0}."),
	amount: "Veuillez entrer un montant valide.",
	percent:"Entrez une valeur comprise entre 0 et 100 jusqu'à 2 décimales.",
	floatingDigits:"S'il vous plait, entrez un nombre valide",
	personName:"Merci d'entrer un nom valide"		
});
}(jQuery));