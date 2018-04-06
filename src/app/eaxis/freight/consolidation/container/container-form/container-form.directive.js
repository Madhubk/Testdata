(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerFormDirective", containerForm);

        containerForm.$inject = [];

    function containerForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/container/container-form/container-form.html",
            link: Link,
            controller: "ContainerFormController",
            controllerAs: "ContainerFormCtrl",
            scope: {
                currentContainer: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
