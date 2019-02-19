(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadcovnm", UploadCoVnmDirective);

    function UploadCoVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-vnm/upload-co-vnm.html",
            link: Link,
            controller: "UploadCoVnmDirectiveController",
            controllerAs: "UploadCoVnmDirectiveCtrl",
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