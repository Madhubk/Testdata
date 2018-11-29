(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneContainerListDirective", ThreeOneContainerListDirective);

        ThreeOneContainerListDirective.$inject = [];

    function ThreeOneContainerListDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/freight/container/3_1_forwarder_buyer-container/3_1_container-directive/three-one-container-directive.html",
            link: Link,
            controller: "ThreeOneContainerListDirectiveController",
            controllerAs: "ThreeOneContainerListDirectiveCtrl",
            scope: {
                currentContainer: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
