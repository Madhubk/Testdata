(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfucrdupdate", SfuCRDUpdateDirective);

    function SfuCRDUpdateDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update.html",
            link: Link,
            controller: "SfuCRDUpdateDirectiveController",
            controllerAs: "SfuCRDUpdateDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();