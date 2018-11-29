(function () {
    "use strict";

    angular
        .module("Application")
        .directive("mytaskdefaultedit", MyTaskDefaultEditDirective);

    MyTaskDefaultEditDirective.$inject = [];

    function MyTaskDefaultEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default-edit/my-task-default-edit.html",
            controller: "MyTaskDefaultEditDirectiveController",
            controllerAs: "MyTaskDefaultEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
