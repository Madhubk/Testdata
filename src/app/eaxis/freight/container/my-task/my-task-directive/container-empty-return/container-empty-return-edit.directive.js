(function () {
    "use strict"
    angular
        .module("Application")
        .directive("containeremptyreturnedit", ContainerEmptyReturnEditDirective);

    function ContainerEmptyReturnEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return/container-empty-return-edit/container-empty-return-edit.html",
            link: Link,
            controller: "ContainerEmptyReturnEditController",
            controllerAs: "ContainerEmptyReturnEditCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();