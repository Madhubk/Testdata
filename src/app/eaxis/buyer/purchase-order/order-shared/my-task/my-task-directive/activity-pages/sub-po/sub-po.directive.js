(function () {
    "use strict";

    angular
        .module("Application")
        .directive("activityPageSubPo", ActivityPageSubPo);

    ActivityPageSubPo.$inject = [];

    function ActivityPageSubPo() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/activity-pages/sub-po/sub-po.html",
            controller: "ActivityPageSubPoController",
            controllerAs: "ActivityPageSubPoCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();