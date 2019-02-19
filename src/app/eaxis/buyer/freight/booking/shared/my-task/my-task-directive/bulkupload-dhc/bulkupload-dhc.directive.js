(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bulkuploaddhc", BulkUploadDhcDirective);

    function BulkUploadDhcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bulkupload-dhc/bulkupload-dhc.html",
            link: Link,
            controller: "BulkUploadDhcDirectiveController",
            controllerAs: "BulkUploadDhcDirectiveCtrl",
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