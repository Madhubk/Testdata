(function () {
    "use strict"
    angular
        .module("Application")
        //.directive("containeremptyreturn", ContainerEmptyReturn)

    function ContainerEmptyReturn() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return/container-empty-return.html",
            link: Link,
            controller: "ContainerEmptyReturnController",
            controllerAs: "ContainerEmptyReturnCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();