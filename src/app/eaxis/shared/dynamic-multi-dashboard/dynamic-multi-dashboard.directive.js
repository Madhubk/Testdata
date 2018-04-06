(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicMultiDashboard", DynamicMultiDashboard);

    DynamicMultiDashboard.$inject = [];

    function DynamicMultiDashboard() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/shared/dynamic-multi-dashboard/dynamic-multi-dashboard.html",
            controller: "DynMultiDashboardController",
            controllerAs: "DynMultiDashboardCtrl",
            scope: {
                pageType: "=",
                parentMenu: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
