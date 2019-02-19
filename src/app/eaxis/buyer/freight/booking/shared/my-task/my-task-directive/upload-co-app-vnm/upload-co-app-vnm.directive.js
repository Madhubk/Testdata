(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadcoappvnm", UploadCoAppVnmDirective);

    function UploadCoAppVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-vnm/upload-co-app-vnm.html",
            link: Link,
            controller: "UploadCoAppVnmDirectiveController",
            controllerAs: "UploadCoAppVnmDirectiveCtrl",
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