(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ebpmTypesConfigure", EbpmTypesConfigure);

        EbpmTypesConfigure.$inject = [];

    function EbpmTypesConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/ebpm-types/tc-ebpm-types-configure/tc-ebpm-types-configure.html",
            link: Link,
            controller: "TCEBPMTypesConfigureController",
            controllerAs: "TCEBPMTypesConfigureCtrl",
            scope: {
                currentEbpmTypes: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();