(function () {
    "use strict"
    angular
        .module("Application")
        .directive("collectmaterial", CollectMaterialDirective)
        .directive("collectMaterialEdit", CollectMaterialEditDirective);

    function CollectMaterialDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/collect-material/collect-material-task-list.html",
            link: Link,
            controller: "CollectMaterialController",
            controllerAs: "CollectMaterialCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function CollectMaterialEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/collect-material/collect-material-activity.html",
            link: Link,
            controller: "CollectMaterialController",
            controllerAs: "CollectMaterialCtrl",
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
