(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryMyTask", DeliveryMyTask);

        DeliveryMyTask.$inject = [];

    function DeliveryMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/my-task/delivery-my-task.html",
            link: Link,
            controller: "DeliveryMyTaskController",
            controllerAs: "DeliveryMyTaskCtrl",
            scope: {
                currentDelivery: "=",
                listSource: "=",
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
