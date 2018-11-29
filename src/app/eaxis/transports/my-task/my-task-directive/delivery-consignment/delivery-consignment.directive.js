(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryconsignment", DeliveryConsignmentDirective);

    function DeliveryConsignmentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment.html",
            link: Link,
            controller: "DeliveryConsignmentDirectiveController",
            controllerAs: "DeliveryConsignmentDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
