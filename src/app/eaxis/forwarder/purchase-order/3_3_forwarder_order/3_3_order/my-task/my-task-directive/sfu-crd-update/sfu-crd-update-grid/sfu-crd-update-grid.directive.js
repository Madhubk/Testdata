(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfuUpdateGridDirective", SFUUpdateGridDirective);

    SFUUpdateGridDirective.$inject = [];

    function SFUUpdateGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid-directive.html",
            link: Link,
            controller: "SFUUpdateGridDirectiveController",
            controllerAs: "SFUUpdateGridDirectiveCtrl",
            scope: {
                input: "=",
                taskObj: "=",
                gridChange: "&",
                master: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();