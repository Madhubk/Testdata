(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirminward", ConfirmInwardDirective)
        .directive("confirmInwardEdit", ConfirmInwardEditDirective);

    function ConfirmInwardDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-inward/confirm-inward-task-list.html",
            link: Link,
            controller: "ConfirmInwardController",
            controllerAs: "ConfirmInwardCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ConfirmInwardEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/confirm-inward/confirm-inward-activity.html",
            link: Link,
            controller: "ConfirmInwardController",
            controllerAs: "ConfirmInwardCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
