(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tcEmailConfigure", TCEmailConfigure);

        TCEmailConfigure.$inject = [];

    function TCEmailConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/email/tc-email-configure/tc-email-configure.html",
            link: Link,
            controller: "TCEmailConfigureController",
            controllerAs: "TCEmailConfigureCtrl",
            scope: {
                currentEmail: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
