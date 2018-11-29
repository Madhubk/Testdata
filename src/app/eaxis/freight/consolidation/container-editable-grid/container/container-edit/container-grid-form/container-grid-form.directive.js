(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerGridFormDirective", containerForm);

    containerForm.$inject = [];

    function containerForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-form/container-grid-form.html",
            link: Link,
            controller: "ContainerGridFormController",
            controllerAs: "ContainerGridFormCtrl",
            scope: {
                currentContainer: "=",
                refCode: "@"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();