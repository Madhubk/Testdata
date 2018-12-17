(function () {
    "use strict";

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
                baseFilter: "=",
                selectedGridRow: "&",
                lookupConfigControlKey: "=",
                isNewButton: "=",
                url:"="
            },
            bindToController: true
        };
        return exports;
    }
})();
