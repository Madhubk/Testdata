(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicControl", DynamicControlDirective);

    DynamicControlDirective.$inject = [];

    function DynamicControlDirective() {
        var exports = {
            restrict: 'EA',
            templateUrl: 'app/shared/dynamic-control/dynamic-control.html',
            controller: "DynamicControlController",
            controllerAs: "DynamicControlCtrl",
            scope: {
                input: '=',
                mode: '@',
                listMode: "=",
                viewType: "=",
                dataentryName: "=",
                configName: "=",
                current: "=",
                controlsData: "&",
                controlStyle: '@',
                isSaveBtn: "=",
                selectedGridRow: "&",
                pkey: "=",
                baseFilterFields: "="
            },
            bindToController: true
        };
        return exports;
    }
})();
