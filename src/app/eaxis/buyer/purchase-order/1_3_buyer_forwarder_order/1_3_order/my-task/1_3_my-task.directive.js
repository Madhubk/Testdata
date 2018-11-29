(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeMyTask", OneThreeMyTask);

    OneThreeMyTask.$inject = [];

    function OneThreeMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/my-task/1_3_my-task.html",
            link: Link,
            controller: "one_three_MyTaskController",
            controllerAs: "one_three_MyTaskCtrl",
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