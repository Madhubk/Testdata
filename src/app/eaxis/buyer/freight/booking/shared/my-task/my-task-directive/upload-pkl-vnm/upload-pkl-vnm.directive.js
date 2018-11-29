(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadpklvnm", UploadPklVnmDirective);

    function UploadPklVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-pkl-vnm/upload-pkl-vnm.html",
            link: Link,
            controller: "UploadPklVnmDirectiveController",
            controllerAs: "UploadPklVnmDirectiveCtrl",
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