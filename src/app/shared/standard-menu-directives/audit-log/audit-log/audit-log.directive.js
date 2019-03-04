(function () {
    "use strict";

    angular
        .module("Application")
        .directive("auditLog", AuditLog);

    AuditLog.$inject = ["$templateCache"];

    function AuditLog($templateCache) {
        let _template = `<div class="clearfix sm-audit-log-container">
                <dynamic-list dataentry-name="AuditLogCtrl.ePage.Masters.dataentryName" mode="1" default-filter="AuditLogCtrl.ePage.Masters.DefaultFilter" dataentry-object="AuditLogCtrl.ePage.Masters.DataEntryObject"></dynamic-list>
            </div>`;
        $templateCache.put("AuditLog.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "AuditLog.html",
            controller: 'AuditLogController',
            controllerAs: 'AuditLogCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                entity: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("AuditLogController", AuditLogController);

    AuditLogController.$inject = ["helperService"];

    function AuditLogController(helperService) {
        /* jshint validthis: true */
        let AuditLogCtrl = this;

        function Init() {
            AuditLogCtrl.ePage = {
                "Title": "",
                "Prefix": "Audit Log",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": AuditLogCtrl.input
            };

            if (AuditLogCtrl.ePage.Entities) {
                InitAuditLog();
            }
        }

        function InitAuditLog() {
            AuditLogCtrl.ePage.Masters.AuditLog = {};
            AuditLogCtrl.ePage.Masters.AuditLog.Entity = AuditLogCtrl.entity;
            AuditLogCtrl.ePage.Masters.dataentryName = "DataAudit";

            if (AuditLogCtrl.ePage.Masters.AuditLog.Entity) {
                AuditLogCtrl.ePage.Masters.DefaultFilter = {
                    "ClassSource": AuditLogCtrl.ePage.Masters.AuditLog.Entity.ClassSource,
                    "EntityRefKey": AuditLogCtrl.ePage.Entities.EntityRefKey
                };
            }
        }

        Init();
    }
})();
