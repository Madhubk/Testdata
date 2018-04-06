(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentMyTask", ShipmentMyTask);

    ShipmentMyTask.$inject = [];

    function ShipmentMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shipment-my-task.html",
            link: Link,
            controller: "ShipmentMyTaskController",
            controllerAs: "ShipmentMyTaskCtrl",
            scope: {
                currentShipment: "=",
                listSource: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
