(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadtroublereportvnm", UploadTroubleReportVnmDirective);

    function UploadTroubleReportVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-trouble-report-vnm/upload-trouble-report-vnm.html",
            link: Link,
            controller: "UploadTroubleReportVnmDirectiveController",
            controllerAs: "UploadTroubleReportVnmDirectiveCtrl",
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