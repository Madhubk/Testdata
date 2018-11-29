(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptreject", ExceptRejectDirective);

    function ExceptRejectDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject.html",
            link: Link,
            controller: "ExceptRejectDirectiveController",
            controllerAs: "ExceptRejectDirectiveCtrl",
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
