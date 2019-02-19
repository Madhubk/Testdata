(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadcivpklvnm", UploadCivPklVnmDirective);

    function UploadCivPklVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-civ-pkl-vnm/upload-civ-pkl-vnm.html",
            link: Link,
            controller: "UploadCivPklVnmDirectiveController",
            controllerAs: "UploadCivPklVnmDirectiveCtrl",
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