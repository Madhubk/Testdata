(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupconsignment", PickupConsignmentDirective);

    function PickupConsignmentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment.html",
            link: Link,
            controller: "PickupConsignmentDirectiveController",
            controllerAs: "PickupConsignmentDirectiveCtrl",
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
