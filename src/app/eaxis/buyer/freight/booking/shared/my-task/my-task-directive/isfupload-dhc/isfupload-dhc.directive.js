(function () {
    "use strict";

    angular
        .module("Application")
        .directive("isfuploaddhc", ISFUploadDhcDirective);

    function ISFUploadDhcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/isfupload-dhc/isfupload-dhc.html",
            link: Link,
            controller: "ISFUploadDhcDirectiveController",
            controllerAs: "ISFUploadDhcDirectiveCtrl",
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