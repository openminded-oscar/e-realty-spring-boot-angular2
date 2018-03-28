angular.module('new-object', ['ui.bootstrap', 'ngFileUpload', 'ui.router', 'basic-app-data']).controller('new-object',
    function ($http, $scope, $uibModal, $state, Upload, $timeout, basicAppData) {
        $scope.$state = $state;
        $scope.buildingTypes = basicAppData.buildingTypes;
        $scope.operations = [];

        $scope.setRealter = function (selected) {
            var selected = selected.originalObject;

            if (selected) {
                $scope.realty.realter = selected;
            }
        }

        var i;
        for (i = 0; i < basicAppData.supportedOperations.length; ++i) {
            $scope.operations[i] = {
                name: basicAppData.supportedOperations[i],
                selected: false
            }
        }

        $http.get('/user').then(function (response) {
            $scope.user = response.data;
        });

        $http.get('/cities').then(function (response) {
            $scope.cities = response.data;
        });

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function () {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });
        $scope.log = '';
        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: '/upload-photo',
                            data: {
                                realtyId: $scope.realty.id,
                                userId: $scope.user.principal.id,
                                category: $scope.uploadCategory,
                                file: file
                            }
                        }).then(function (resp) {
                            $timeout(function () {
                                $scope.log = 'file: ' +
                                    resp.config.data.file.name +
                                    ', Response: ' + JSON.stringify(resp.data) +
                                    '\n' + $scope.log;
                            });
                        }, function (resp) {
                            if ($scope.uploadError) {
                                $scope.uploadError += "\nFile was not uploaded properly: " + file.name;
                            } else {
                                $scope.uploadError = "File was not uploaded properly: " + file.name;
                            }
                        }, function (evt) {
                            $scope.progressPercentage = parseInt(100.0 *
                                evt.loaded / evt.total);
                        });
                    }
                }
            }
        };

        $scope.setConfirmationUpload = function () {
            $scope.uploadCategory = 'realty-ownership-confirmation';
        };

        $scope.setObjectPhotosUpload = function () {
            $scope.uploadCategory = 'realty-photo';
        };


        $scope.isApt = true;

        this.addRealtyObject = function () {
            if ($scope.newobjectform.$valid) {
                $scope.realty.owner.id = $scope.user.principal.id;
                $scope.realty.targetOperations = [];
                for (var i = 0; i < $scope.operations.length; ++i) {
                    if ($scope.operations[i].selected) {
                        $scope.realty.targetOperations.push($scope.operations[i].name);
                    }
                }

                $http.post('/realty-object/add', $scope.realty).then(function (response) {
                    $scope.realty.id = response.data.id;
                    console.log('success' + response);
                }, function (response) {
                    console.log('failure' + response);
                });
            }
        };

        $scope.addCity = function () {
            $uibModal.open({
                templateUrl: 'js/city/add-city-dialog.html',
                controller: 'add-city'
            });
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
            },
            owner: {
                id: null
            }
        };
    });