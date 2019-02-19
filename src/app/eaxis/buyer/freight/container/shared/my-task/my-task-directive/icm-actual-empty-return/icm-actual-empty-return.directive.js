(function () {
    "use strict";

    angular
        .module("Application")
        .directive("icmactualemptyreturn", icmactualemptyreturn)
        .directive("icmActualEmptyReturnEdit", icmActualEmptyReturnEdit);

    function icmactualemptyreturn() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-empty-return/icm-actual-empty-return-task-list.html",
            link: Link,
            controller: "IcmActualEmptyReturnController",
            controllerAs: "IcmActualEmptyReturnCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function icmActualEmptyReturnEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-empty-return/icm-actual-empty-return-activity.html",
            link: Link,
            controller: "IcmActualEmptyReturnController",
            controllerAs: "IcmActualEmptyReturnCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();