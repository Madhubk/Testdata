(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadinboundreportvnm", UploadInboundReportVnmDirective);

    function UploadInboundReportVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-inbound-report-vnm/upload-inbound-report-vnm.html",
            link: Link,
            controller: "UploadInboundReportVnmDirectiveController",
            controllerAs: "UploadInboundReportVnmDirectiveCtrl",
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