angular.module('add-city', [ 'ui.bootstrap' ]).controller('add-city',
		function($scope, $uibModalInstance, $http) {
			$scope.city = {};
			$scope.addCity = function() {
				$http.post('/city/add', $scope.city).then(function(response) {
					$uibModalInstance.close();
				}, function() {
					$uibModalInstance.close();
				});
			};

			$http.get('/regions').then(function(response) {
				$scope.regions = response.data;
			});

			$scope.close = function() {
				$uibModalInstance.close();
			};
		});