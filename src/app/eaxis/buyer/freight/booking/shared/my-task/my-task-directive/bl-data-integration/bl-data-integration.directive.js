(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bldataintegration", BlDataIntegrationDirective);

    function BlDataIntegrationDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bl-data-integration/bl-data-integration.html",
            link: Link,
            controller: "BlDataIntegrationDirectiveController",
            controllerAs: "BlDataIntegrationDirectiveCtrl",
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