(function () {
    "use strict"
    angular
        .module("Application")
        .directive("createpickupchallan", CreatePickupChallanDirective)
        .directive("createPickupChallanEdit", CreatePickupChallanEditDirective);

    function CreatePickupChallanDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/create-pickup-challan/create-pickup-challan-task-list.html",
            link: Link,
            controller: "CreatePickupChallanController",
            controllerAs: "CreatePickupChallanCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function CreatePickupChallanEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/create-pickup-challan/create-pickup-challan-activity.html",
            link: Link,
            controller: "CreatePickupChallanController",
            controllerAs: "CreatePickupChallanCtrl",
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
