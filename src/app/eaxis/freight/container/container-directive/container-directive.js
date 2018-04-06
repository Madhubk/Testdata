(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerListDirective", ContainerListDirective);

        ContainerListDirective.$inject = [];

    function ContainerListDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/freight/container/container-directive/container-directive.html",
            link: Link,
            controller: "ContainerListDirectiveController",
            controllerAs: "ContainerListDirectiveCtrl",
            scope: {
                currentContainer: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
