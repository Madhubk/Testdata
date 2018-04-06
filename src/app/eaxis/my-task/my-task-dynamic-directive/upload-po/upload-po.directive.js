(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadpo", UploadPODirective);

    function UploadPODirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po.html",
            link: Link,
            controller: "UploadPODirectiveController",
            controllerAs: "UploadPODirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
