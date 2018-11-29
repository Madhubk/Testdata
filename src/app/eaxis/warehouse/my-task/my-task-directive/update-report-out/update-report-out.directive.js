(function () {
    "use strict"
    angular
        .module("Application")
        .directive("updatereportout", UpdateReportOutDirective)
        .directive("updateReportOutEdit", UpdateReportOutEditDirective);

    function UpdateReportOutDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/update-report-out/update-report-out-task-list.html",
            link: Link,
            controller: "UpdateReportController",
            controllerAs: "UpdateReportCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function UpdateReportOutEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/update-report-out/update-report-out-activity.html",
            link: Link,
            controller: "UpdateReportController",
            controllerAs: "UpdateReportCtrl",
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
