(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sopTypelistConfigure", SOPTypelistConfigure);

        SOPTypelistConfigure.$inject = [];

    function SOPTypelistConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/sop-typelist/tc-sop-typelist-configure/tc-sop-typelist-configure.html",
            link: Link,
            controller: "TCSOPTypelistConfigureController",
            controllerAs: "TCSOPTypelistConfigureCtrl",
            scope: {
                currentSopTypelist: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
