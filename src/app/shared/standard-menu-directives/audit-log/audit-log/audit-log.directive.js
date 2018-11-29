(function () {
    "use strict";

    angular
        .module("Application")
        .directive("auditLog", AuditLog);

    AuditLog.$inject = ["$templateCache"];

    function AuditLog($templateCache) {
        var _template = `<div class="clearfix sm-audit-log-container">
            <dynamic-list dataentry-name="AuditLogCtrl.ePage.Masters.dataentryName" mode="1" default-filter="AuditLogCtrl.ePage.Masters.DefaultFilter" dataentry-object="AuditLogCtrl.ePage.Masters.DataEntryObject"></dynamic-list>
        </div>`;
        $templateCache.put("AuditLog.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "AuditLog.html",
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

        function Link(scope, ele, attr) {}
    }
})();
