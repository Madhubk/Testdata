(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryconsignmentedit", DeliveryConsignmentEditDirective);

    DeliveryConsignmentEditDirective.$inject = [];

    function DeliveryConsignmentEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment-edit/delivery-consignment-edit.html",
            controller: "DeliveryConsignmentEditDirectiveController",
            controllerAs: "DeliveryConsignmentEditDirectiveCtrl",
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
