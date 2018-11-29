(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gateoutedit", GateOutEditDirective);

    GateOutEditDirective.$inject = [];

    function GateOutEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out-edit/gate-out-edit.html",
            controller: "GateOutEditDirectiveController",
            controllerAs: "GateOutEditDirectiveCtrl",
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
