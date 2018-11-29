(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockinedit", AllocateDockEditDirective);

    AllocateDockEditDirective.$inject = [];

    function AllocateDockEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in-edit/dock-in-edit.html",
            controller: "AllocateDockEditDirectiveController",
            controllerAs: "AllocateDockEditCtrl",
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
