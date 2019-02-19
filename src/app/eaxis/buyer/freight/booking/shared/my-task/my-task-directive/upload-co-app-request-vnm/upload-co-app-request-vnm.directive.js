(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadcoapprequestvnm", UploadCoAppRequestVnmDirective);

    function UploadCoAppRequestVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-request-vnm/upload-co-app-request-vnm.html",
            link: Link,
            controller: "UploadCoAppRequestVnmDirectiveController",
            controllerAs: "UploadCoAppRequestVnmDirectiveCtrl",
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