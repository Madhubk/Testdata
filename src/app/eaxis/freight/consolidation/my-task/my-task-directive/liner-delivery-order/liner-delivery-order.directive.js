(function () {
    "use strict"
    angular
        .module("Application")
        .directive("linerdelivery", LinerDelivery)

    function LinerDelivery() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery/liner-delivery.html",
            link: Link,
            controller: "LinerDeliveryController",
            controllerAs: "LinerDeliveryDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();