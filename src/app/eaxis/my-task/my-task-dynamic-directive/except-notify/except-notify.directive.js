(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptnotify", ExceptNotifyDirective);

    function ExceptNotifyDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify.html",
            link: Link,
            controller: "ExceptNotifyDirectiveController",
            controllerAs: "ExceptNotifyDirectiveCtrl",
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
