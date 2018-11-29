(function () {
    "use strict"
    angular
        .module("Application")
        .directive("receivematerial", ReceiveMaterialDirective)
        .directive("receiveMaterialEdit", ReceiveMaterialEditDirective);

    function ReceiveMaterialDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/receive-material/receive-material-task-list.html",
            link: Link,
            controller: "ReceiveMaterialController",
            controllerAs: "ReceiveMaterialCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ReceiveMaterialEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/receive-material/receive-material-activity.html",
            link: Link,
            controller: "ReceiveMaterialController",
            controllerAs: "ReceiveMaterialCtrl",
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
