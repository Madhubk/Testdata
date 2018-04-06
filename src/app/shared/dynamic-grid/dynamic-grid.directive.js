(function () {
    "use strict";
    angular
        .module("Application")
        .directive("dynamicGrid", DynamicGrid);

    DynamicGrid.$inject = [];

    function DynamicGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/dynamic-grid/dynamic-grid.html",
            controller: "GridController",
            controllerAs: "GridCtrl",
            scope: {
                mode: "=",
                inputData: "=",
                gridConfig: "=",
                selectedGridRow: "&",
                selectedItems: "=",
                isLocalSearch: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
