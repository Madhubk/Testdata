'use strict';

var app = angular.module("Application");

angular
    .module("Application")
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
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
    .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            libraries: 'geometry,visualization'
        });
    }]);

// angular
//     .module("Application")
//     .config(function ($translateProvider) {
//         $translateProvider.preferredLanguage('en-US');
//         $translateProvider.useLoader('languageService');
//         $translateProvider.useSanitizeValueStrategy(null);
//         $translateProvider.useLocalStorage();
//     });
