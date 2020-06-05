var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	
	//Select all pin codes
	$scope.addItems = function (fromTarget,toTarget,itemCount,modelData,searchModelData) {		
		value1 = angular.fromJson(modelData);
		$scope[toTarget].push(value1);
		angular.forEach($scope[fromTarget], function(value,index){
			if(value1.itemValue == value.itemValue){
				$scope[fromTarget].splice(index,1);
			}
		})

		
		$scope.dataToIdArray = [];
		angular.forEach($scope[toTarget], function(value,index){
			
			$scope.dataToIdArray.push(value.itemValue);
		});
	}
	$scope.addAllItems = function (fromTarget,toTarget,itemCount,modelData,searchModelData) {
		if($scope[itemCount] > 10){				
			$scope[itemCount] = 10;
		}		
		$scope[searchModelData] = "";
		$scope[fromTarget] = [];
		$scope[toTarget] = angular.copy($scope.responseData);
		$scope.dataToIdArray = [];
		angular.forEach($scope[toTarget], function(value,index){
			
			$scope.dataToIdArray.push(value.itemValue);
		});
	}
	
	//Remove all selected pin codes
	$scope.removeAllAddedItems = function (fromTarget,toTarget,itemCount,modelData,searchModelData) {	
		if($scope[itemCount] > 10){				
			$scope[itemCount] = 10;
		}
		$scope[searchModelData] = "";
		$scope[fromTarget] = [];
		$scope[toTarget] = angular.copy($scope.responseData);	
		
		$scope.dataToIdArray = [];
		if($scope[fromTarget].length != 0){
			angular.forEach($scope[fromTarget], function(value,index){
				
				$scope.dataToIdArray.push(value.itemValue);
			});
		}
		else {
			$scope.dataToIdArray = null;
		}
	}	
	$scope.removeAddedItems = function (fromTarget,toTarget,itemCount,modelData,searchModelData) {
		
		valueSelected = angular.fromJson(modelData);	
		$scope[toTarget].unshift(valueSelected);
		angular.forEach($scope[fromTarget], function(value,index){
			if(value.itemValue == valueSelected.itemValue){
				$scope[fromTarget].splice(index,1);
			}
		})			
		
		$scope.dataToIdArray = [];
		if($scope[fromTarget].length != 0){
			angular.forEach($scope[fromTarget], function(value,index){
				
				$scope.dataToIdArray.push(value.itemValue);
			});
		}
		else {
			$scope.dataToIdArray = null;
		}
	}	
	
});

//Custom directive to updated model data on scroll event
app.directive('scroller', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
			//Load 10 more item each time the scroll reaches bottom
			elem.on('scroll', function(event){
			
				var element = event.target;
				if (element.scrollHeight - element.scrollTop === element.clientHeight)
				{
					scope[attrs.limitto] = scope[attrs.limitto] + 10;
				}
			});
            elem.bind('scroll', function () {
                scope.$apply();
            });
        }
    };
});

//Custom directive to updated model data on scroll event
app.directive('multiselectbox', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
		
		
			scope.responseData = $(elem).data("optionsItemsMap");
			scope[attrs.from] = [];
			
			//Array to store selected pin codes
			scope[attrs.to] = $(elem).data("optionsValuesMap");
			scope.dataToIdArray = [];
			angular.forEach(scope[attrs.to], function(value,index){
				
				scope.dataToIdArray.push(value.itemValue);
			});
			scope.dataToIdArray = scope.dataToIdArray.toString();
			if(scope[attrs.to].length!=0){
				angular.forEach(scope.responseData, function(value,index){
					//Get Pin codes
					
					for(var i=0;i<scope[attrs.to].length;i++){
						var check = false; 
						if(scope[attrs.to][i].itemValue != value.itemValue){
							check = true; 
						}
						else {

							check = false; 
							break;
						}
					}
					if(check){
						scope[attrs.from].push(value);
					}		
				})
			}
			else {
				scope[attrs.from] =  angular.copy(scope.responseData);
			}
			
        }
    };
});

