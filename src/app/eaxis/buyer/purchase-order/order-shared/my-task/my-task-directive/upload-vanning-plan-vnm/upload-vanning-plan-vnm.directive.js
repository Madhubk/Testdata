(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadvanningplanvnm", UploadVanningPlanVnmDirective);

    function UploadVanningPlanVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/upload-vanning-plan-vnm/upload-vanning-plan-vnm.html",
            link: Link,
            controller: "UploadVanningPlanVnmDirectiveController",
            controllerAs: "UploadVanningPlanVnmDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();