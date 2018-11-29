(function () {
    "use strict";

    angular
        .module("Application")
        .filter('toArray', function () {
            return function (obj) {
                if (!(obj instanceof Object)) return obj;
                return _.map(obj, function (val, key) {
                    return Object.defineProperty(val, '$key', {
                        __proto__: null,
                        value: key
                    });
                });
            }
        });


    angular
        .module("Application")
        .controller("AuditLogController", AuditLogController);

    AuditLogController.$inject = ["helperService"];

    function AuditLogController(helperService) {
        /* jshint validthis: true */
        var AuditLogCtrl = this;

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
                    "EntityRefKey": AuditLogCtrl.ePage.Entities.EntityRefKey,
                    "EntityRefCode": AuditLogCtrl.ePage.Entities.EntityRefCode
                }
            }
        }

        Init();
    }
})();
