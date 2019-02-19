(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadmblhblvnm", UploadMblHblVnmDirective);

    function UploadMblHblVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-mbl-hbl-vnm/upload-mbl-hbl-vnm.html",
            link: Link,
            controller: "UploadMblHblVnmDirectiveController",
            controllerAs: "UploadMblHblVnmDirectiveCtrl",
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