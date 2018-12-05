(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupMyTask", PickupMyTask);

    PickupMyTask.$inject = [];

    function PickupMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pickup-request/my-task/pickup-my-task.html",
            link: Link,
            controller: "PickupMyTaskController",
            controllerAs: "PickupMyTaskCtrl",
            scope: {
                currentPickup: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
