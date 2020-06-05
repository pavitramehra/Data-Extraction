(function(){
	var keyMap={};
	window.AesUtil = function() {

		if(typeof getEncryptionData!=='undefined'){
			this.iv=getEncryptionData().Iv;
			this.salt=getEncryptionData().Salt;
			this.keySize=parseInt(getEncryptionData().Keysize)/32;
			this.iterationCount=parseInt(getEncryptionData().IterationCount);
			return;
		}
		var tempIv;
		var tempSalt;
		var tempkeySize;
		var tempIterationCount
	   $.ajax({

			url : getContextPath() + "/app/auth/getEncryptionParameters",
			type : 'POST',
			async : false,
			data : {
	      	
	      },
			success : function(data) {
				tempIv = data.iv;
				tempSalt = data.salt;
				tempkeySize = parseInt(data.keysize)/32;
				tempIterationCount = parseInt(data.iterationcount);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log("Session has expired.jqXHR is " + jqXHR +  " textstatus is " + textStatus + " errorThrown " + errorThrown);
			}
		});
		this.iv=tempIv;
		this.salt=tempSalt;
		this.keySize=tempkeySize;
		this.iterationCount=tempIterationCount;
	};

	AesUtil.prototype.generateKey = function(passPhrase) {
	  var key = CryptoJS.PBKDF2(
	      passPhrase, 
	      CryptoJS.enc.Hex.parse(this.salt),
	      { keySize: this.keySize, iterations: this.iterationCount });
	  return key;
	}

	AesUtil.prototype.encrypt = function(passPhrase, plainText) {
		if(keyMap[passPhrase]==null){
			keyMap[passPhrase]= this.generateKey(passPhrase);
		}
	  var encrypted = CryptoJS.AES.encrypt(
	      plainText,
	      keyMap[passPhrase],
	      { iv: CryptoJS.enc.Hex.parse(this.iv) });
	  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	}

	AesUtil.prototype.decrypt = function(passPhrase, cipherText) {
	  var key = this.generateKey(passPhrase);
	  var cipherParams = CryptoJS.lib.CipherParams.create({
	    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
	  });
	  var decrypted = CryptoJS.AES.decrypt(
	      cipherParams,
	      key,
	      { iv: CryptoJS.enc.Hex.parse(this.iv) });
	  return decrypted.toString(CryptoJS.enc.Utf8);
	}

})();