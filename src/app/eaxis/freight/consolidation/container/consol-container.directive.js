(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolContainer", ConsolContainer);

    ConsolContainer.$inject = [];

    function ConsolContainer() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/container/consol-container.html",
            link: Link,
            controller: "ContainerConController",
            controllerAs: "ContainerConCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
