(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockoutedit", DockOutEditDirective);

    DockOutEditDirective.$inject = [];

    function DockOutEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out-edit/dock-out-edit.html",
            controller: "DockOutEditDirectiveController",
            controllerAs: "DockOutEditCtrl",
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
