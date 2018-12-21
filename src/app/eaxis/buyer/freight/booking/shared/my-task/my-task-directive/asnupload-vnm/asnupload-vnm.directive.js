(function () {
    "use strict";

    angular
        .module("Application")
        .directive("asnuploadvnm", AsnUploadVnmDirective);

    function AsnUploadVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/asnupload-vnm/asnupload-vnm.html",
            link: Link,
            controller: "AsnUploadVnmDirectiveController",
            controllerAs: "AsnUploadVnmDirectiveCtrl",
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