(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ftzdocdhc", FTZDocDhcDirective);

    function FTZDocDhcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/ftzdoc-dhc/ftzdoc-dhc.html",
            link: Link,
            controller: "FTZDocDhcDirectiveController",
            controllerAs: "FTZDocDhcDirectiveCtrl",
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