(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneContainerFormDirective", ThreeOneContainerFormDirective);

    ThreeOneContainerFormDirective.$inject = [];

    function ThreeOneContainerFormDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/3_1_container-form/three-one-container-form.html",
            link: Link,
            controller: "ThreeOneContainerFormDirectiveController",
            controllerAs: "ThreeOneContainerFormDirectiveCtrl",
            scope: {
                currentContainer: "=",
                currentConsol:"=",
                refCode: "@"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();