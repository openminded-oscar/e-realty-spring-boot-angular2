angular.module('object-details', [ 'ui.bootstrap' ]).controller(
		'object-details',
		function($http, $scope, $uibModal, $routeParams) {
			$scope.objectId = $routeParams.id;
			
			var objectDetailsUrl = '/realty-objects/'+$scope.objectId;
			
			$http.get(objectDetailsUrl).then(
					function(response) {
						$scope.currentObject = response.data;
						$scope.streetInCity = $scope.currentObject.address.streetInCity;
					});
		});