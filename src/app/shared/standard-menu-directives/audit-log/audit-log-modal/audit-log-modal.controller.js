(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AuditLogModalController", AuditLogModalController);

    AuditLogModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function AuditLogModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var AuditLogModalCtrl = this;

        function Init() {
            AuditLogModalCtrl.ePage = {
                "Title": "",
                "Prefix": "AuditLogModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param
            };

            AuditLogModalCtrl.ePage.Masters.Close = Close;

            AuditLogModalCtrl.ePage.Masters.AuditEntity = {
                "ClassSource": "ShpShipmentHeader",
                "DisplayName": "Shipment",
                "icon": "menu-icon fa fa-truck",
                "EntitySource": "SHP",
                "EntityRefKey": "SHP_PK",
                "EntityRefCode": "SHP_ShipmentNo",
                "IsParentEntityRefKey": false,
                "ParentEntitySource": undefined,
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "IsAdditionalEntityRefKey": false,
                "AdditionalEntitySource": undefined,
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined
            };
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
