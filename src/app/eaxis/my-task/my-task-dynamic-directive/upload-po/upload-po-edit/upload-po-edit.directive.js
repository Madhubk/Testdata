(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadpoedit", UploadPOEditDirective);

    UploadPOEditDirective.$inject = [];

    function UploadPOEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po-edit/upload-po-edit.html",
            controller: "uploadPOEditDirectiveController",
            controllerAs: "UploadPOEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) { }
    }
})();
