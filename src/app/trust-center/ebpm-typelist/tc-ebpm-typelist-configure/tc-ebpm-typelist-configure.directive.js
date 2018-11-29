(function () {
    "use strict";

    angular
        .module("Application")
        .directive("typelistConfigure", TypelistConfigure);

        TypelistConfigure.$inject = [];

    function TypelistConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/ebpm-typelist/tc-ebpm-typelist-configure/tc-ebpm-typelist-configure.html",
            link: Link,
            controller: "TCEBPMTypelistConfigureController",
            controllerAs: "TCEBPMTypelistConfigureCtrl",
            scope: {
                currentTypelist: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
