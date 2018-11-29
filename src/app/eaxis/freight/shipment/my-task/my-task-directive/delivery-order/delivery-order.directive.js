(function () {
    "use strict"
    angular
        .module("Application")
        .directive("generatedeliveryorder", GenerateDeliveryOrder)
        .directive("decisiondeliveryorder", DecisionDeliveryOrder)
        .directive("dispatchdeliveryorder", DispatchDeliveryOrder);

    function GenerateDeliveryOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/delivery-order/generate-delivery-order/generate-delivery-order.html",
            link: Link,
            controller: "GenerateDeliveryOrderController",
            controllerAs: "GenerateDeliveryOrderCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function DecisionDeliveryOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/delivery-order/decision-delivery-order/decision-delivery-order.html",
            link: Link,
            controller: "DecisionDeliveryOrderController",
            controllerAs: "DecisionDeliveryOrderCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function DispatchDeliveryOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/delivery-order/dispatch-delivery-order/dispatch-delivery-order.html",
            link: Link,
            controller: "DispatchDeliveryOrderController",
            controllerAs: "DispatchDeliveryOrderCtrl",
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