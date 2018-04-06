(function () {
    'user strict';

    angular
        .module('Application')
        .directive('dynamicTable', DynamicTable);

    function DynamicTable() {
        var exports = {
            restrict: "EA",
            scope: {
                gridConfig: '=',
                gridData: '=',
                selectedGridRow: "&"
            },
            link: Link,
            bindToController: true,
            controller: "DynamicTableController",
            controllerAs: "DynamicTableCtrl",
            templateUrl: "app/shared/dynamic-table/dynamic-table.html"
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
