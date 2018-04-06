(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicControl", DynamicControlDirective);

    DynamicControlDirective.$inject = ["$rootScope", "$timeout", "$location", "apiService"];

    function DynamicControlDirective($rootScope, $timeout, $location, apiService) {
        var exports = {
            restrict: 'EA',
            templateUrl: 'app/shared/dynamic-control/dynamic-control.html',
            controller: "DynamicControlController",
            controllerAs: "DynamicControlCtrl",
            scope: {
                input: '=',
                mode: '@',
                viewType: "=",
                dataentryName: "=",
                configName: "=",
                current: "=",
                controlsData: "&",
                controlStyle: '@',
                isSaveBtn: "=",
                selectedGridRow: "&",
                pkey: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {

        }
    }
})();
