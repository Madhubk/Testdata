'use strict';

var app = angular.module("Application");

angular
    .module("Application")
    .config(
        [
            '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ]);

angular
    .module("Application")
    .config(function ($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            template: '<ul class="breadcrumb"><li><i class="fa fa-home"></i><a href="#">Home</a></li><li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li></ul>'
        });
    });


angular
    .module("Application")
    .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            libraries: 'geometry,visualization'
        });
    }]);

angular
    .module("Application")
    .config(function ($translateProvider) {
        $translateProvider.preferredLanguage('en-US');
        $translateProvider.useLoader('languageService');
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useLocalStorage();
    });
