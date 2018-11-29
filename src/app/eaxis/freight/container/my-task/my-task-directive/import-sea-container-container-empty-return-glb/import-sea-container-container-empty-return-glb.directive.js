(function () {
    "use strict"
    angular
        .module("Application")
        .directive("containeremptyreturn", containerEmptyReturn)
        .directive("importSeaContainerContainerEmptyReturnGlb", ImportSeaContainerContainerEmptyReturnGlb);

    function containerEmptyReturn() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/container/my-task/my-task-directive/import-sea-container-container-empty-return-glb/import-sea-container-container-empty-return-glb-task-list.html",
            link: Link,
            controller: "ImpSeaContainerContainerEmptyReturnRequestGlbController",
            controllerAs: "ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ImportSeaContainerContainerEmptyReturnGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/container/my-task/my-task-directive/import-sea-container-container-empty-return-glb/import-sea-container-container-empty-return-glb-activity.html",
            link: Link,
            controller: "ImpSeaContainerContainerEmptyReturnRequestGlbController",
            controllerAs: "ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl",
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