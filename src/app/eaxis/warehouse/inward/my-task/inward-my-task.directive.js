(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inwardMyTask", InwardMyTask);

    InwardMyTask.$inject = [];

    function InwardMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inward/my-task/inward-my-task.html",
            link: Link,
            controller: "InwardMyTaskController",
            controllerAs: "InwardMyTaskCtrl",
            scope: {
                currentInward: "=",
                listSource: "=",
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
