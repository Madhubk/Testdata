(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploaddo", UploadDODirective);

    function UploadDODirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/upload-do/upload-do.html",
            link: Link,
            controller: "UploadDODirectiveController",
            controllerAs: "UploadDODirectiveCtrl",
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