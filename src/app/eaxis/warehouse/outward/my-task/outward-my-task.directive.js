(function () {
    "use strict";

    angular
        .module("Application")
        .directive("outwardMyTask", OutwardMyTask);

    OutwardMyTask.$inject = [];

    function OutwardMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/outward/my-task/outward-my-task.html",
            link: Link,
            controller: "OutwardMyTaskController",
            controllerAs: "OutwardMyTaskCtrl",
            scope: {
                currentOutward: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
