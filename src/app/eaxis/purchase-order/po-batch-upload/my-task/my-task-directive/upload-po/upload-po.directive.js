(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadpo", UploadPODirective);

    function UploadPODirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po.html",
            link: Link,
            controller: "UploadPODirectiveController",
            controllerAs: "UploadPODirectiveCtrl",
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