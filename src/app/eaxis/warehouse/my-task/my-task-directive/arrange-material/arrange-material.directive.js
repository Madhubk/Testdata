(function () {
    "use strict"
    angular
        .module("Application")
        .directive("arrangematerial", ArrangeMaterialDirective)
        .directive("arrangeMaterialEdit", ArrangeMaterialEditDirective);

    function ArrangeMaterialDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/arrange-material/arrange-material-task-list.html",
            link: Link,
            controller: "ArrangeMaterialController",
            controllerAs: "ArrangeMaterialCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ArrangeMaterialEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/arrange-material/arrange-material-activity.html",
            link: Link,
            controller: "ArrangeMaterialController",
            controllerAs: "ArrangeMaterialCtrl",
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
