(function () {
    "use strict";

    angular
        .module("Application")
        .directive("notification", Notification)
        .directive("kpiDirective", KpiDirective)
        .directive("myTaskDashboardDirective", MyTaskDirective)
        .directive("exceptionDirective", ExceptionDirective);

    function Notification() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/notification/notification.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

    function KpiDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/notification/kpi.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function MyTaskDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/notification/my-task.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExceptionDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/notification/exception.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
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