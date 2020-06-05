
var validVillageName = function(value) {
	var validVillageName = new RegExp('^['+allowedAlphaCharSet+'0-9_,~#:.@/)(&\\]\\[\\-\\s]*$');
						return validVillageName.test(value);
					}

			       $.validator.addMethod("validVillageName", function(value,
							element) {
						return validVillageName(value);
					}, "Only some special character like ,/@-#:()~ [].and _& are allowed in name");


var validVillageCode1 = function(value) {

                    						var validVillageCode1 = new RegExp('^['+allowedAlphaCharSet+'0-9_]{0,22}$');

                    						return validVillageCode1.test(value);

                    					}
		 $.validator.addMethod("validVillageCode1", function(value,element) {

                       return validVillageCode1(value);

                         },error_valid_village_code);