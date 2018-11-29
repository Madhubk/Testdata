(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupconsignmentedit", PickupConsignmentEditDirective);

    PickupConsignmentEditDirective.$inject = [];

    function PickupConsignmentEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment-edit/pickup-consignment-edit.html",
            controller: "PickupConsignmentEditDirectiveController",
            controllerAs: "PickupConsignmentEditDirectiveCtrl",
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
