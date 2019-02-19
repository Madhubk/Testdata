(function () {
    "use strict";

    angular
        .module("Application")
        .directive("icmuploaddhc", ICMUploadDhcDirective);

    function ICMUploadDhcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icmupload-dhc/icmupload-dhc.html",
            link: Link,
            controller: "ICMUploadDhcDirectiveController",
            controllerAs: "ICMUploadDhcDirectiveCtrl",
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