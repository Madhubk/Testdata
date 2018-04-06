(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pageWidthHeight", PageWidthHeight);

    PageWidthHeight.$inject = [];

    function PageWidthHeight() {
        var exports = {
            restrict: "A",
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            angular.element(ele).css({
                'height': window.innerHeight - 150
            });
        }
    }

    angular
        .module("Application")
        .directive("dynamicList", DynamicList);

    DynamicList.$inject = [];

    function DynamicList() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/dynamic-list/dynamic-list.html",
            controller: "DynamicListController",
            controllerAs: "DynamicListCtrl",
            scope: {
                mode: "=",
                dataentryName: "=",
                dataentryObject: "=",
                defaultFilter: "=",
                selectedGridRow: "&",
                lookupConfigFieldName: "=",
                gridConfigType: "="
            },
            bindToController: true
        };
        return exports;
    }
})();
