(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneMyTask", OneOneMyTask);

    OneOneMyTask.$inject = [];

    function OneOneMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/my-task/1_1_my-task.html",
            link: Link,
            controller: "one_one_MyTaskController",
            controllerAs: "one_one_MyTaskCtrl",
            scope: {
                currentOrder: "=",
                listSource: "=",
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
