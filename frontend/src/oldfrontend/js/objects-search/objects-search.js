var module = angular
    .module('objects-search', ['ngRoute'])

    .controller(
        'objects-search',
        function ($http, $scope) {
            $http.get('/user').then(function (response) {
                $scope.user = response.data.name;
            });

            $scope.filter = {
                "limit": 12,
                "offset": 0
            };

            ($scope.searchObjects = function () {
                $http.post('/realty-objects', $scope.filter).then(
                    function (response) {
                        $scope.realtyObjects = response.data;
                    });
            })();

            $scope.trimDescription = function (fullDescr) {
                return fullDescr.substr(0, 52) + '...';
            };


            $scope.transformCityToString = function (city) {
                return (city.name
                + (city.district ? (', ' + city.district + ' distr.')
                    : '') + (city.region ? (', '
                    + city.region + ' reg.') : ''));
            };

            $scope.cityURL = '/city/find';
            $scope.streetURL = '/street/find';
            $scope.citiesToSelect = {};
            $scope.cityIdElementId = 'cityId';
            $scope.streetIdElementId = 'streetId';
            $scope.streetParametersElementsIds = [$scope.cityIdElementId];
            $scope.cityParametersElementsIds = [];
            $scope.realty = {
                id: null,
                address: {
                    streetInCity: {
                        id: null,
                        name: null,
                        city: {
                            name: null,
                            id: null
                        }
                    }
                }
            };
        });