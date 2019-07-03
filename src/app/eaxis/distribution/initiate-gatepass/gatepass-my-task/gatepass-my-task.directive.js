(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gatepassMyTask", GatepassMyTask);

    GatepassMyTask.$inject = [];

    function GatepassMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/initiate-gatepass/gatepass-my-task/gatepass-my-task.html",
            link: Link,
            controller: "GatepassMyTaskController",
            controllerAs: "GatepassMyTaskCtrl",
            scope: {
                currentGatepass: "=",
                listSource: "=",
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
