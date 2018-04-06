(function () {
    "use strict";

    angular
        .module("Application")
        .directive("auditLog", AuditLog);

    AuditLog.$inject = [];

    function AuditLog() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/audit-log/audit-log/audit-log.html",
            controller: 'AuditLogController',
            controllerAs: 'AuditLogCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                entity: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
