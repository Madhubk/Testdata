(function () {
    "use strict"
    angular
        .module("Application")
        .directive("acknowledgecsr", AcknowledgeCsrDirective)
        .directive("acknowledgeCsrEdit", AcknowledgeCsrEditDirective);

    function AcknowledgeCsrDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-csr/acknowledge-csr-task-list.html",
            link: Link,
            controller: "AcknowledgeCsrController",
            controllerAs: "AcknowledgeCsrCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function AcknowledgeCsrEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-csr/acknowledge-csr-activity.html",
            link: Link,
            controller: "AcknowledgeCsrController",
            controllerAs: "AcknowledgeCsrCtrl",
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
