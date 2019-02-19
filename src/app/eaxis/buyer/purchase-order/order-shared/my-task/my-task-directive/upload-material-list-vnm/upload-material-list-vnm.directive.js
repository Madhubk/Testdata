(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadmateriallistvnm", UploadMaterialListVnmDirective);

    function UploadMaterialListVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/upload-material-list-vnm/upload-material-list-vnm.html",
            link: Link,
            controller: "UploadMaterialListVnmDirectiveController",
            controllerAs: "UploadMaterialListVnmDirectiveCtrl",
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