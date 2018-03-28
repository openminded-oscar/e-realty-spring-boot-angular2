var app = angular
    .module('real-estate-app', ['ngRoute',
        'auth',
        'basic-app-data',
        'new-object',
        'objects-search',
        'navigation',
        'add-city',
        'object-details',
        "angucomplete-alt",
        "ui.router"
    ])
    .config(
        function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(true);
            $urlRouterProvider.when('/', '/new');
            $urlRouterProvider.otherwise('/');

            $stateProvider.state('new-object', {
                url: '/new',
                templateUrl: 'js/new-object/new-object.html',
                controller: 'new-object',
                controllerAs: 'controller'
            }).state('new-object.step1', {
                url: '/step1',
                templateUrl: 'js/new-object/new-object-step1.html',
            }).state('new-object.step2', {
                url: '/step2',
                templateUrl: 'js/new-object/new-object-step2.html',
            }).state('new-object.step3', {
                url: '/step3',
                templateUrl: 'js/new-object/new-object-step3.html',
            }).state('new-object.step4', {
                url: '/step4',
                templateUrl: 'js/new-object/new-object-step4.html',
            }).state('new-object.step5', {
                url: '/step5',
                templateUrl: 'js/new-object/new-object-step5.html',
            }).state('all-objects', {
                url: '/all-objects',
                templateUrl: 'js/objects-search/objects-search.html',
                controller: 'objects-search',
                controllerAs: 'controller'
            }).state('login', {
                url: '/login',
                templateUrl: 'js/navigation/login.html',
                controller: 'navigation',
                controllerAs: 'controller'
            }).state('object-details', {
                url: '/object-details/:id',
                templateUrl: 'js/object-details/object-details.html',
                controller: 'object-details',
                controllerAs: 'controller'
            });

            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        }).run(function (auth, basicAppData) {
        // Initialize auth module with the home page and login/logout path
        auth.init('/', '/login', '/logout');
    });

module.directive('addressAutoComplete', function ($http) {
    return {
        restrict: 'E',
        controller: 'objects-search',
        scope: {
            autoCompleteUrl: '@',
            parametersElementsIds: '@',
            resultElementId: '@',
            //ngModel: '='
            currentId: '='
        },
        //require: 'ngModel',
        link: function (scope, elm, attrs, $scope) {
            var variantView = elm.find("input[type='text']");
            var variantId = elm.find("input[type='hidden']");
            variantView.autocomplete({
                source: function (request, response) {
                    $http({
                        method: 'post',
                        url: scope.autoCompleteUrl,
                        data: constructAutoCompleteRequestBody(request.term,
                            scope.parametersElementsIds)
                    }).success(function (data) {
                        response(transformAddressComponentResponse(data));
                    });
                },
                minLength: 2,
                select: function (event, ui) {
                    scope.$apply(function () {
                        // scope.ngModel = ui.item.value;
                        scope.currentId = ui.item.id;
                        variantId.val(ui.item.id);
                    });
                }
            });
        }
    }
});

constructAutoCompleteRequestBody = function (inputString, parameterIds) {
    var parameterIds = JSON.parse(parameterIds);

    var body = {};
    body.q = inputString;

    var i;
    for (i = 0; i < parameterIds.length; ++i) {
        var currentId = parameterIds[i];
        body[currentId] = $('#' + currentId).val();
    }

    return body;
}

transformAddressComponentResponse = function (addressComponentVariants) {
    var i;

    for (i = 0; i < addressComponentVariants.length; ++i) {
        var addressComponent = addressComponentVariants[i];
        addressComponent.value = (addressComponent.name
        + (addressComponent.district ? (', ' + addressComponent.district + ' distr.') : '')
        + (addressComponent.region ? (', ' + addressComponent.region + ' reg.') : ''));
    }

    return addressComponentVariants;
}