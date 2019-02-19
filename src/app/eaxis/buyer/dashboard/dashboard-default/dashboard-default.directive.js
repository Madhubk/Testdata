(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dashboarddefault", DashboardDefaultDirective);

    DashboardDefaultDirective.$inject = [];

    function DashboardDefaultDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/dashboard/dashboard-default/dashboard-default.html",
            link: Link,
            controller: "DashboardDefaultDirectiveController",
            controllerAs: "DashboardDefaultDirectiveCtrl",
            scope: {
                currentAsn: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();