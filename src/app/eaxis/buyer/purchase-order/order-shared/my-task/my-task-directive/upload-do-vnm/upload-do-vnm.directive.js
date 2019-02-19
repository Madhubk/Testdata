(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploaddovnm", UploadDoVnmDirective);

    function UploadDoVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/upload-do-vnm/upload-do-vnm.html",
            link: Link,
            controller: "UploadDoVnmDirectiveController",
            controllerAs: "UploadDoVnmDirectiveCtrl",
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