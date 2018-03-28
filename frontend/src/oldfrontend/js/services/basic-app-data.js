angular
    .module('basic-app-data', [])
    .factory(
        'basicAppData',
        function ($http) {
            var basicData = {};

            $http.get('/realty-objects/building-types')
                .then(
                    function (response) {
                        basicData.buildingTypes = response.data;
                    }, function () {
                        console.log('Error on getting building types!');
                    });

            $http.get('/realty-objects/supported-operations')
                .then(
                    function (response) {
                        basicData.supportedOperations = response.data;
                    }, function () {
                        console.log('Error on getting realt estate agency supported operations!');
                    });

            basicData.init = function () {
            }

            return basicData;
        });