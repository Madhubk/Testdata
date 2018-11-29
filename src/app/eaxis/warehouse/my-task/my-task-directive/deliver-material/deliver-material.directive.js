(function () {
    "use strict"
    angular
        .module("Application")
        .directive("delivermaterial", DeliverMaterialDirective)
        .directive("deliverMaterialEdit", DeliverMaterialEditDirective);

    function DeliverMaterialDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/deliver-material/deliver-material-task-list.html",
            link: Link,
            controller: "DeliverMaterialController",
            controllerAs: "DeliverMaterialCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function DeliverMaterialEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/deliver-material/deliver-material-activity.html",
            link: Link,
            controller: "DeliverMaterialController",
            controllerAs: "DeliverMaterialCtrl",
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
