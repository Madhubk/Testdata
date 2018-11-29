(function () {
    "use strict"
    angular
        .module("Application")
        .directive("generatedeliveryorderedit", GenerateDeliveryOrderEdit)
        .directive("decisiondeliveryorderedit", DecisionDeliveryOrderEdit)
        .directive("dispatchdeliveryorderedit", DispatchDeliveryOrderEdit);

    function GenerateDeliveryOrderEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/delivery-order/generate-delivery-order/generate-delivery-order-edit/generate-delivery-order-edit.html",
            link: Link,
            controller: "GenerateDeliveryOrderEditController",
            controllerAs: "GenerateDeliveryOrderEditCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function DecisionDeliveryOrderEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/delivery-order/decision-delivery-order/decision-delivery-order-edit/decision-delivery-order-edit.html",
            link: Link,
            controller: "DecisionDeliveryOrderEditController",
            controllerAs: "DecisionDeliveryOrderEditCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function DispatchDeliveryOrderEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/delivery-order/dispatch-delivery-order/dispatch-delivery-order-edit/dispatch-delivery-order-edit.html",
            link: Link,
            controller: "DispatchDeliveryOrderEditController",
            controllerAs: "DispatchDeliveryOrderEditCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

   

})();