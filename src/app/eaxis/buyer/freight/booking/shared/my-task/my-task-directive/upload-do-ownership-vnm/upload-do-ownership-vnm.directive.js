(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploaddoownershipvnm", UploadDoOwnershipVnmDirective);

    function UploadDoOwnershipVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-do-ownership-vnm/upload-do-ownership-vnm.html",
            link: Link,
            controller: "UploadDoOwnershipVnmDirectiveController",
            controllerAs: "UploadDoOwnershipVnmDirectiveCtrl",
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