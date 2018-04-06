(function () {
    'user strict';

    angular
        .module('Application')
        .directive('tcGrid', TCGrid);

    function TCGrid() {
        var exports = {
            restrict: "EA",
            scope: {
                dataentryName: '=',
                searchInput: '=',
                attributeDetails: "=",
                entity: "=",
                selectedGridRow: "&"
            },
            link: Link,
            bindToController: true,
            controller: "TCGridController",
            controllerAs: "TCGridCtrl",
            templateUrl: "app/shared/tc-grid/tc-grid.html"
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
