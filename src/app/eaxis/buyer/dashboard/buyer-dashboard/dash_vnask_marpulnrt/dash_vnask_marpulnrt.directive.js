(function () {
    "use strict";

    angular
        .module("Application")
        .directive("vnaskmarpulnrtdashboard", VnaskMarpulnrtDashboardDirective);

    VnaskMarpulnrtDashboardDirective.$inject = [];

    function VnaskMarpulnrtDashboardDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/dashboard/buyer-dashboard/dash_vnask_marpulnrt/dash_vnask_marpulnrt.html",
            link: Link,
            controller: "VnaskMarpulnrtDashboardDirectiveController",
            controllerAs: "VnaskMarpulnrtDashboardDirectivetrl",
            scope: {
                currentAsn: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();