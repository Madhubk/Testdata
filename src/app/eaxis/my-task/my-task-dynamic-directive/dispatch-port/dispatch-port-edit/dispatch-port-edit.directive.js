(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dispatchportedit", DispatchPortEditDirective);

    DispatchPortEditDirective.$inject = [];

    function DispatchPortEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port-edit/dispatch-port-edit.html",
            controller: "DispatchPortEditDirectiveController",
            controllerAs: "DispatchPortEditDirectiveCtrl",
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
