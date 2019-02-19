(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dhcusdeeconnycdashboard", DhcusDeeconnycDashboardDirective);

    DhcusDeeconnycDashboardDirective.$inject = [];

    function DhcusDeeconnycDashboardDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/dashboard/buyer-dashboard/dash_dhcus_deeconnyc/dash_dhcus_deeconnyc.html",
            link: Link,
            controller: "DhcusDeeconnycDashboardDirectiveController",
            controllerAs: "DhcusDeeconnycDashboardDirectiveCtrl",
            scope: {
                currentAsn: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();