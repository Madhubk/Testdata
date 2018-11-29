(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadexportpermitvnm", UploadExportPermitVnmDirective);

    function UploadExportPermitVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-export-permit-vnm/upload-export-permit-vnm.html",
            link: Link,
            controller: "UploadExportPermitVnmDirectiveController",
            controllerAs: "UploadExportPermitVnmDirectiveCtrl",
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