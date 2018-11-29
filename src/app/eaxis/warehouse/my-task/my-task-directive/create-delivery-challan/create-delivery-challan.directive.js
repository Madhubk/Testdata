(function () {
    "use strict"
    angular
        .module("Application")
        .directive("createdeliverychallan", CreateDeliveryChallanDirective)
        .directive("createDeliveryChallanEdit", CreateDeliveryChallanEditDirective);

    function CreateDeliveryChallanDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/create-delivery-challan/create-delivery-challan-task-list.html",
            link: Link,
            controller: "CreateDelChallanController",
            controllerAs: "CreateDelChallanCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function CreateDeliveryChallanEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/create-delivery-challan/create-delivery-challan-activity.html",
            link: Link,
            controller: "CreateDelChallanController",
            controllerAs: "CreateDelChallanCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
