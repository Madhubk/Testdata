(function () {
    "use strict";

    angular
        .module("Application")
        .directive("issueExitGatepass", IssueExitGatepass);

    IssueExitGatepass.$inject = [];

    function IssueExitGatepass() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/issue-exit-gatepass/issue-exit-gatepass.html",
            link: Link,
            controller: "IssueExitGatepassController",
            controllerAs: "IssueExitGatepassCtrl",
            scope: {
                currentManifest: "=",
                orgfk: "=",
                jobfk:"=",
                isShowFooter:"=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();