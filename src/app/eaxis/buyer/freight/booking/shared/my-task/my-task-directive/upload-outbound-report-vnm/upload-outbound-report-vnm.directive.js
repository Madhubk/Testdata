(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadoutboundreportvnm", UploadOutboundReportVnmDirective);

    function UploadOutboundReportVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-outbound-report-vnm/upload-outbound-report-vnm.html",
            link: Link,
            controller: "UploadOutboundReportVnmDirectiveController",
            controllerAs: "UploadOutboundReportVnmDirectiveCtrl",
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