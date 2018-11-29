(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptnotifyedit", ExceptNotifyEditDirective);

    ExceptNotifyEditDirective.$inject = [];

    function ExceptNotifyEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify-edit/except-notify-edit.html",
            controller: "ExceptNotifyEditDirectiveController",
            controllerAs: "ExceptNotifyEditDirectiveCtrl",
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
