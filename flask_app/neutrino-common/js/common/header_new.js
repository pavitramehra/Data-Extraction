angular.module("myHeaderApp", ["advanceSearchApp","userProfileApp"]).controller("myHeaderCtrl", function($scope, $http) {
	$scope.msgCount=0;
	$scope.showMessageCount = function(){
		$http({
			method : "GET",
			url : getContextPath() + "/app/email/count"
		}).then(function mySuccess(response) {
			$scope.msgCount=response.data;
		}, function myError(response) {
			console.log("error while getting Message Count  "+response);
		});
	}

	$scope.openOutOfOfficeDialog=function() {
		$.ajax({

			url : getContextPath()+"/app/User/loadOutOfOffice",
			//type : 'POST',
			async : false,
			data : "userId="+getUserID(),
			success : function(jqXHR) {
				$('#modal_body_out_of_office').html(jqXHR);

			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert(jqXHR + " : " + textStatus + " : " + errorThrown);
			}
		});
		$('#outOfOfficeModalWindow').modal('show');
		userProfileFn.hidePanel();
	}
	
	$scope.openEditTargetUrlDialog = function(){
		$.ajax({
			url : getContextPath()+"/app/UserInfo/view/getUrlMappingPage",
			data : "userId="+getUserID(),
			success : function(jqXHR) {
				$('#targetUrlForm').html(jqXHR);
				$('#editTargetUrlModalWindow').modal('show');
				},
			error : function(jqXHR, textStatus, errorThrown) {
				new PNotify({
    				title : 'Error',
    				text : errorThrown,
    				type : 'error',
    				opacity : .8
    			});
			}
		});
		userProfileFn.hidePanel();
	}

	$scope.loadAllMail = function(){
		$http({
			method : "GET",
			async : false,
			url : getContextPath() + "/app/email/viewAllMail"
		}).then(function mySuccess(response) {
			$scope.allMails = response.data;
		}, function myError(response) {
			console.log("error while getting all mails  "+response);
		});
	}
	$scope.showAdvancedSearchPanel = function(){
		$scope.getAdvanceSearchAttributes();
		$("body").addClass("openDrawer OverLay_with_header");
		$("#advancedSearchBox").addClass("showDrawer");
		$("#advancedSearchResult").hide();
		$("#advSearchDeatil").hide();
		$("#advancedSearchForm").show();
	}
	$scope.advanceSearchAttributes = null;
	$scope.getAdvanceSearchAttributes = function(){
		if($scope.advanceSearchAttributes == null){
			$http({
				method : "GET",
				url : getContextPath() + "/app/searchFramwork/getAdvanceSearchAttributes/loanApplication"
			}).then(function mySuccess(response) {
				if(response.data.result == "success"){
					$scope.advanceSearchAttributes = response.data.searchAttributeBeanList.searchAttributeList;
				}
			}, function myError(response) {
				console.log("error while getAdvanceSearchAttributes  "+response);
			});
		}
	}
	$scope.hideModel = function(modalId){
		$('#'+modalId).modal('hide');
	}

	// User profile controller changes
	$scope.getUserProfilePanel = function(){
		$("body").addClass("openDrawer OverLay_with_header");
		$("#userProfileDraw").addClass("showDrawer");
		$scope.getUserProfile();
	}

	$scope.getUserProfile = function(){
		$http({
			method : "GET",
			url : getContextPath() + "/app/User/userProfileMap/",
			contentType : "application/json",
		}).then(function mySuccess(response) {
			$scope.paintUserProfile(response.data);
			$scope.maxUserProfileImgSize = response.data.maxUserProfileImgSize;
		}, function myError(response) {
			console.log("error while getting userProfileMap "+response);
		});
	}



$scope.uploadProfileImg = function(event){
        var userImageSize;
        if(event.files[0]!=undefined){
            userImageSize = event.files[0].size;
        }
        if($scope.checkFile() && $scope.validateFileSize(userImageSize)){
            var fd = new FormData();
            fd.append('fileData', $('#userProfileHeaderImg')[0].files[0],$('#userProfileHeaderImg')[0].files[0].name);


        $http({
            method : "POST",
            url : getContextPath()+'/app/upload/saveimage',
            processData : false,
            headers: { 'Content-Type': undefined},
            data: fd,
            cache : false

        }).then(function successFunction(response){
            $scope.showResponse(response.data);
        });
        }
    }


$scope.checkFile = function() {

		var fileElement = document.getElementById("userProfileHeaderImg");
		var fileExtension = "";
		if (fileElement.value.lastIndexOf(".") > 0) {
			fileExtension = fileElement.value.substring(fileElement.value
					.lastIndexOf(".") + 1, fileElement.value.length).toLowerCase();
		}
		if (fileExtension == "gif" || fileExtension == "jpeg"
				|| fileExtension == "jpg" || fileExtension == "png") {
			return true;
		} else if (fileElement.value != "") {
			handleuploadError("Please upload image with extension .jpeg, .jpg, .png or .gif only.");
			$(fileElement).closest('div').find('a.fileupload-exists').click();
			new PNotify({
				title : "Error",
				text : "Please upload image with extension .jpeg, .jpg, .png or .gif only.",
				type : "error",
				opacity : .8,
				before_open: function(PNotify) {
                                    PNotify.get().css("z-index","999999");
                           }
			});
			$("#dummyImage").removeClass("hidden");
			return false;
		}
	}


    $scope.validateFileSize = function (userImageSize){
	    var sizeMessage='File size should be greater than 0 byte and less than or equal to '+$scope.maxUserProfileImgSize+ ' bytes.';
		if (userImageSize<=0 || userImageSize>$scope.maxUserProfileImgSize) {
		    new PNotify({
                title : "Error",
                text : sizeMessage,
                type : "error",
                pnotify_animate_speed : fadeOutduration,
                opacity : .8,
                before_open: function(PNotify) {
                         PNotify.get().css("z-index","999999");
                }
            });

			$(document.getElementById("userProfileHeaderImg")).closest('div').find('a.fileupload-exists').click();
			$("#dummyImage").removeClass("hidden");
		  	return false;
	  	} else{
	  		return true;
	  	}
	}


	$scope.showResponse = function(responseText) {
		var newImgSrc = $(".userInfo > div .fileupload-preview > img").attr('src');

       $http({
			method : "POST",
			url : getContextPath() + "/app/UserInfo/saveImage",
			params : { "photoUrl" : responseText},
			headers: {
                        'Content-Type': undefined
                    }

			}).then(function successFunction(){
			        
                    if (showNotifications == "true") {
                        new PNotify({
                                    title : "success",
                                    text : "Image saved successfully",
                                    type : "success",
                                    pnotify_animate_speed : fadeOutduration,
                                    opacity : .8,
                                    before_open: function(PNotify) {
                                             PNotify.get().css("z-index","999999");
                                    }
                                });
                    }
                    $("#dummyImage").addClass("hidden");
                    $("#userProfileImage").attr('src',newImgSrc);
			   },
                    function myError(response) {
                        if (showNotifications == "true") {
                            new PNotify({
                                        title : "Failure",
                                        text : "Error occured in saving image",
                                        type : "error",
                                        pnotify_animate_speed : fadeOutduration,
                                        opacity : .8,
                                        before_open: function(PNotify) {
                                                   PNotify.get().css("z-index","999999");
                                         }
                                    });
                        }
                    });
	}

	function handleuploadError(responseText) {

	}



	$scope.userPhotoUrl = "images/man.png";

	$scope.paintUserProfile = function(data){
		$scope.userProf = data;
		if($scope.userProf.photoUrl != null){
			$scope.userPhotoUrl = "app/upload/renderimage/"+$scope.userProf.photoUrl;
		}else if($scope.userProf.salutation != null && $scope.userProf.salutation !="MR"){
			$scope.userPhotoUrl = "images/female.jpg";
		}
			
		$scope.branchList = data.userAccessToBranchesList;
		$scope.roleList = data.userRoleList;
		$scope.userTeamList = data.userTeamList;
		$scope.passwordExpiresAfter = data.passwordExpiresAfter;
		if($scope.passwordExpiresAfter == null)
			$scope.passwordExpiresAfter = "never";
		$scope.allSecurityQuestions = data.allSecurityQuestions;
		$scope.ques1 = 'select';
		$scope.ques2 = 'select';
		if(data.userQuesAns!=null && data.userQuesAns[0] !== undefined){
			$scope.ques1 = data.userQuesAns[0].code;
			$scope.answer1 = data.userQuesAns[0].answer;
		}
		if(data.userQuesAns!=null && data.userQuesAns[1] !== undefined){
			$scope.ques2 = data.userQuesAns[1].code;
			$scope.answer2 = data.userQuesAns[1].answer;
		}	
	}
	$scope.saveSecurityQuestionsJson = function(userSecQuesForm){
		if(userSecQuesForm.$invalid || $scope.ques1 == 'select' || $scope.ques2 == 'select'){
			console.log("userSecQuesForm invalid");
			return;
		}
		var req = [{
						"questionCode": $scope.ques1,
						"answer": $scope.answer1
					}, {
						"questionCode": $scope.ques2,
						"answer": $scope.answer2
					}];
		$http({
			method : "POST",
			url : getContextPath() + "/app/User/saveUserSecurityQuestionsJson",
			headers: {'CSRFToken': getCsrfTokenValue()},
			contentType : "application/json;",
			data: req
		}).then(function mySuccess(response) {
			if(response.data != null && response.data.result == 'success'){
				new PNotify({
					title : 'Success',
					text : 'User security question answers saved successfully',
					type : 'success',
					opacity : .8
				});
				$scope.hideModel('editSecurityQuesModalWindow');	
			}			
		}, function myError(response) {
			console.log("error while saving securityQuestion "+response);
		});	
	}
       //User Pref Controller changes
    	$scope.loadUserPreference = function(){
			$("body").addClass("openDrawer OverLay_with_header");
			$("#preference-form").addClass("showDrawer");
    		$http({
    			method : "GET",
    			url : getContextPath() + "/app/configuration/loadPreferencesJson/",
    			contentType : "application/json",
    		}).then(function mySuccess(response) {
				$scope.prefData = response.data;
				$scope.configVOCAList = $scope.prefData.preferences.configVOCAList;
				$scope.configVOList = $scope.prefData.preferences.configVOList;
				$scope.supportedDateFormats = $scope.prefData.supportedDateFormats;
				$scope.gridsForDefaultTabPref = $scope.prefData.gridsForDefaultTabPref;
				$scope.timeZones = $scope.prefData.timeZones;
				$scope.oldTheme = $scope.prefData.preferredTheme;
				$scope.preferredTheme = $scope.prefData.preferredTheme;
				$scope.dashboardWidgets = $scope.prefData.dashboardWidgets;
				$scope.notificationConfigList = $scope.prefData.configNotificationVOList;
				$scope.supportedUserLocales = $scope.prefData.supportedUserLocales;
				//need to upadte dashbaord widget prop key in request using below list
				//$scope.dashboardWidgetsList = $scope.prefData.dashboardWidgetsList;
				$scope.dwg = [];
				angular.forEach($scope.dashboardWidgets, function (value) {
					$scope.dwg[value] = true;
				});
    		}, function myError(response) {
    			//console.log("error while getting userPreference "+response);
    		});
		}
		
		$scope.createConfigVo = function(propKey,propValue,valueType,text,configurable,date,dayOfWeek){
			return configVo = { 
				propertyKey : propKey,
				propertyValue : propValue,
				valueType : valueType,
				text : text,
				configurable : configurable,
				date : date,
				//fromDate : propValue,
				//toDate : propValue,
				day : dayOfWeek,
				// fromDay : propValue,
				// toDay : propValue
			};
		}

		$scope.createConfigByType = function(eachConfig,configArr){
			if(eachConfig.valueType=='BOOLEAN_VALUE'){
				eachConfig.propertyValue = eachConfig.propertyValue.toLowerCase();				
				configArr.push($scope.createConfigVo(eachConfig.propertyKey,eachConfig.propertyValue,eachConfig.valueType,
					eachConfig.propertyValue,eachConfig.configurable,null,null));
			}else if(eachConfig.valueType=='DATE'){
				configArr.push($scope.createConfigVo(eachConfig.propertyKey,eachConfig.propertyValue,eachConfig.valueType,
					eachConfig.propertyValue,null,eachConfig.propertyValue,null));
			}else if(eachConfig.valueType=='DAY_OF_WEEK'){
				configArr.push($scope.createConfigVo(eachConfig.propertyKey,eachConfig.propertyValue,eachConfig.valueType,
					eachConfig.propertyValue,null,null,eachConfig.propertyValue));
			}else{
				configArr.push($scope.createConfigVo(eachConfig.propertyKey,eachConfig.propertyValue,eachConfig.valueType,
					eachConfig.text,null,null,null));
			}
		}

    	$scope.saveUserPreference = function(){
			$('#loading').show();
			var configArr = [];
			//push widgets data
			var xx = $scope.dwg;
            var newArrar =[];
            for(var x in xx){
				if(typeof xx[x] != "function"){
					var temp = [];
					temp.push(x);
					temp.push(xx[x]);
					newArrar.push(temp);
				}
            }
            // newArrar.splice(newArrar.length-1, 1);
            angular.forEach(newArrar, function (key,index) {

				var propKey = "config.dashboard."+key[0];
				var propVal = key[1];
				var orgValue = "";
				if(propVal == true){
					propVal = "enable";
					orgValue = "enable";
				}					
				else if(propVal == false){
					orgValue = "disable";
					propVal = "disable";
				}								
				var dashboardWidgetsReq = $scope.createConfigVo(propKey,propVal,'BOOLEAN_VALUE',propVal);	
				dashboardWidgetsReq[key[0]] = orgValue;
				configArr.push(dashboardWidgetsReq);
			});	
			angular.forEach(($scope.configVOList), function (eachConfig,index) {
				$scope.createConfigByType(eachConfig,configArr);	
			});	

			var configVOCArr = [];
			angular.forEach(($scope.configVOCAList), function (eachConfig,index) {
				$scope.createConfigByType(eachConfig,configVOCArr);
			});

			//push notification data
			angular.forEach(($scope.notificationConfigList), function (eachConfig,index) {
				$scope.createConfigByType(eachConfig,configArr);
			});	

			var req ={};
				 req.configVOList = configArr;
				req.configVOCAList = configVOCArr;
			
    		$http({
    			method : "POST",
				url : getContextPath() + "/app/configuration/saveJson?preferredTheme="+$scope.preferredTheme,
				headers: {'CSRFToken': getCsrfTokenValue()},
				contentType : "application/json;",
    			data: req
    		}).then(function mySuccess(response) {
				$('#loading').hide();
				if(response.data != null && response.data.result == 'success'){
					new PNotify({
						title : 'Success',
						text : 'Preference Saved Successfully',
						type : 'success',
						opacity : .8
					});
					MyprefernceFn.hidePanel();	
					// if($scope.preferredTheme != $scope.oldTheme){
						window.location.reload();
					// }
				}else{
					console.log("error while saving preference");
				}	
    		}, function myError(response) {
				$('#loading').hide();
    			console.log("error while save userPreference "+response);
			});					

    	}
		$scope.assTabPlaceholder = "Search branch";
		$scope.selectedAssTab = "branchList";
       //END

	$scope.resetValuesforResetPasswordModel = function(){
		$('#oldUserPassword').val("");
		$('#newUserPassword').val("");
		$('#confirmPassword').val("");
		$('#newUserPassword').next().remove();
		$('#passwordNotMatchError').addClass("hidden");
		$('#passwordMatchError').addClass("hidden");
	}

		//USER Acitivty Controller changes
		$scope.getUserActivityJson = function(eventType){
			if(eventType=='loginLogout' && $scope.loginLogoutActivityInfoList == null){
				$('#loading').show();
			}else if(eventType=='mine' && $scope.mineActivityInfoList == null && $scope.mineEventLoaded){
				$('#loading').show();
			}
			$http({
				method : "GET",
				url : getContextPath() + "/app/User/paginatedUserActivityJson/0/20?lastGroupName=&eventType="+eventType,
				contentType : "application/json",
			}).then(function mySuccess(response) {
				$('#loading').hide();
				if(eventType=='mine'){
					$scope.mineActivityInfoList = response.data.mineActivityInfoList;
				}else if(eventType=='loginLogout'){
					$scope.loginLogoutActivityInfoList = response.data.loginLogoutActivityInfoList;
				}
				$scope.currentUserDateFormat = response.data.currentUserDateFormat;
				$scope.currentUserDateFormat = $scope.currentUserDateFormat +" hh:mm:ss a";
				if(eventType=='loginLogout' && $scope.mineActivityInfoList == null){
					$scope.getUserActivityJson('mine');
					$scope.mineEventLoaded = true;
				}
			}, function myError(response) {
				$('#loading').hide();
				console.log("error while getting user activity json "+response);
			});
		}
		$scope.mineEventLoaded = false;
		$scope.selectedActivity="loginLogout";
		$scope.loginLogoutActivityInfoList = null;
		$scope.traversedList = null;
		$scope.getScreenTraversedData = function(){
			if($scope.traversedList == null){
				$('#loading').show();
			}
			$http({
				method : "GET",
				url : getContextPath() + "/app/AuditManager/getMyScreenTraversedLogs",
				contentType : "application/json",
			}).then(function mySuccess(response) {
				$('#loading').hide();
				if(response.data.result == 'success'){
					$scope.traversedList = response.data.screenTraversLogs;
						if($scope.currentUserDateFormat == null || $scope.currentUserDateFormat===undefined){
							$scope.currentUserDateFormat = "dd/MM/yyyy hh:mm:ss a";
						}
					}
			}, function myError(response) {
				$('#loading').hide();
				console.log("error while getting screen traversed data "+response);
			});
		}

		$scope.updateActivityEvent = function(){
			if($scope.selectedActivity=="loginLogout"){
				$scope.getUserActivityJson('loginLogout');
			}else if($scope.selectedActivity=="mine"){
				$scope.getUserActivityJson('mine');
			}else if($scope.selectedActivity=="traversed"){
				$scope.getScreenTraversedData()
			}
		}

		$scope.deleteUserBefore = function(days){

			var url = getContextPath() + "/app/User/deleteBeforeByAjax?days="+days
			if($scope.selectedActivity == 'traversed'){
				url = getContextPath() + "/app/webAudit/deleteBeforeByAjax?days="+days
			}

			$http({
    			method : "GET",
    			url : url,
    		}).then(function mySuccess(res) {
				if(res.data.result == 'success'){
					new PNotify({
						title : 'Success',
						text : 'User Activity Deleted Successfully',
						type : 'success',
						opacity : .8
					});
				}else{
					console.log("error while deleting activity "+res);
				}
				userActivityFn.hidePanel();
    		}, function myError(res) {
    			console.log("error while deleting activity "+res);
    		});
		}
		$scope.downloadActivityReport = function(){
			$http({
    			method : "GET",
				url : getContextPath() + "/app/User/downloadCSV"
    		}).then(function mySuccess(res) {
				userActivityFn.hidePanel();
    		}, function myError(res) {
    			console.log("error while download CSV "+res);
    		});
		}
		//END
});




var app = angular.module("advanceSearchApp", []);

app.controller("advanceSearchCtrl", function($scope, $http,$timeout) {
	$scope.advSrchInputLabel = "Application Number";
	$scope.searchBy =  "loanApplication";
	$scope.count = 0;
	$scope.performAdvanceSearch = function(advancedSearchForm){
		$scope.advanceSearchData = null;
		$("#advSearchTable").DataTable().destroy();
		$scope.showError = false;
		$scope.errorMsg = "";
		$scope.searchedText = advancedSearchForm.searchedText.$modelValue;
		if(!advancedSearchForm.$valid){
			console.log("Invalid advance Search form");
			return;
		}
		 $http({
				method : "GET",
				url : getContextPath()
							+ "/app/LoanApplication/populateMenu"+"?item=" + $scope.searchedText + "&searchEntityId="+ $scope.searchBy,
				contentType : "application/json; charset=utf-8",
				async : true,
			}).then(function mySuccess(response) {
				if(response.data == null || response.data.aaData == null){
					$scope.showError = true;
					$scope.errorMsg = "error while doing Advance Search";
					return;
				}
					if(response.data.aaData.length<1){
						$scope.showError = true;
						$scope.errorMsg = "No data found";
						return;
					}
					$('#loading').show();			
					$scope.count = response.data.aaData.length;		
					$scope.advanceSearchData = response.data.aaData;
					var searchResult = response.data;
					$timeout(function () {
						$("#advSearchTable").DataTable();
						$scope.showAdvanceSearchResult();
						$('#loading').hide();
					}, 1000);
				}, function myError(response) {
						console.log("error while performAdvanceSearch "+response);
				});
		}
		
	
	$scope.performAdvanceSearchForAllFields = function(){
			$scope.advanceSearchData = null;
			$("#advSearchTable").DataTable().destroy();
			$scope.showErrorForAllFields = false;
			$scope.errorMsg = "";
			$scope.searchedText = "";
			if($scope.validateAdvScrhForm()){
				console.log("Invalid advance Search form for all fields");
				return;
			}

			var req = {
			};
			req.searchRequestEntityId = "loanApplication";
			req.searchAttributeList = $scope.advanceSearchAttributes;
			 $http({
					method : "POST",
					async : true,
					headers: {'CSRFToken': getCsrfTokenValue()},
					url : getContextPath()+ "/app/searchFramwork/restAdvanceSearch",
					contentType : "application/json; charset=utf-8",
					data : req					
			}).then(function mySuccess(response) {
				if(response.data.result == 'success'){
					if(response.data.searchCount<1){
						$scope.showErrorForAllFields = true;
						$scope.errorMsg = "No data found";
						return;
					}
					$('#loading').show();			
					$scope.count = response.data.searchCount;		
					$scope.advanceSearchData = response.data.resultList;
					var searchResult = response.data;
					$timeout(function () {
						$("#advSearchTable").DataTable();
						$scope.showAdvanceSearchResult();
						$('#loading').hide();
					}, 1000);
				}else{
					new PNotify({
						title : 'Error',
						text : 'Something went wrong, pls try again later',
						type : 'error',
						opacity : .8
					});
					advancedSearchControll.hidePanel();
				}			
			}, function myError(response) {
					console.log("error while performAdvanceSearchForAllFields "+response);
			});
	}	

	
	$scope.validateAdvScrhForm = function(){
		var notValid = true;
		angular.forEach($scope.advanceSearchAttributes, function(value, key) {
			if(value.display == 'visible' && value.value.length>0){
				notValid = false;
				return false;
			}			
		  });
		  return notValid;
	}

	$scope.showAdvanceSearchResult = function(){
		$scope.showAppDetailHeader = false;
		$("#advancedSearchResult").show();
		$("#advSearchDeatil").hide();
		$("#advancedSearchForm").hide();
		$(".advHeading").html("Advanced Search");
		$(".advHeading").removeClass("appDeatilHeading");
	}
		
		$scope.showAppDetailHeader = false;
		
		$scope.showDetail = function(data){

			$scope.customerDetail = data;
			 $scope.currAppNumber = data.applicationNumber;
			 $scope.customerImage = data.photoUrl;
			 if($scope.customerImage == null){
				$scope.customerImage = "images/man.png"; 
				if(data.gender == 'Female'){
					$scope.customerImage = "images/female.jpg";
				 }
					
			 }
			// $scope.currAppStage = data.applicationStage;
			// $scope.currCustName = data.name;
			// $scope.currCustNUm = data.primaryApplicantCustNumber;
			// $scope.currProductType = data.productType;
		
			$("#advSearchDeatil").show();
			$("#advancedSearchResult").hide();
			$(".advHeading").html("");
			$(".advHeading").addClass("appDeatilHeading");
			$scope.showAppDetailHeader = true;
		}
		$scope.viewSearchedApp = function(){
			openApplicationInViewMode($scope.currAppNumber);
		}
});

var userProfileApp = angular.module("userProfileApp", ["userApp"]);
userProfileApp.controller("userProfileCtrl", function($scope, $http,userApp) {
	$scope.openModel = function(modalId){
		$('#'+modalId).modal('show');
		userProfileFn.hidePanel();
	}
	$scope.hideModel = function(modalId){
		$('#'+modalId).modal('hide');
	}
});
var userApp = angular.module('userApp',[]);
userApp.factory('userApp', function($http) {
    return {
        alertA: function() {
            alert('a');
		},
		getUserProfile : function(){
			$http({
				method : "GET",
				//url : getContextPath() + "/app/User/paginatedUserActivityJson/70/10?lastGroupName=rr",
				url : getContextPath() + "/app/User/userProfileMap/",
				contentType : "application/json",
			}).then(function mySuccess(response) {
				$scope.paintUserprofile();
				$scope.maxUserProfileImgSize = response.data.maxUserProfileImgSize;
				return response.data;
			}, function myError(response) {
				console.log("error while getting userProfileMap "+response);
			});
		}
    };
});

userApp.controller("userCtrl", function($scope, $http,userApp) {
	// $scope.getUserProfilePanel = function(){
	// 	$("body").addClass("openDrawer OverLay_with_header");
	// 	$("#userProfileDraw").addClass("showDrawer");
	// 	var userProfileData = userApp.getUserProfile();
	// }
	$scope.paintUserprofile = function(data){
	}
}).filter('replace', [function () {
    return function (input, from, to) {
      if(input === undefined) {
        return;
      }
      var regex = new RegExp(from, 'g');
      return input.replace(regex, to);
    };


}]);