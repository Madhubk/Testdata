(function () {
    'use strict';

    angular
        .module("Application")
        .factory("auditLogConfig", AuditLogConfig);

    AuditLogConfig.$inject = [];

    function AuditLogConfig() {
        var exports = {
            "Entities": {
                "SHP": {
                    "ListSource": [{
                        "ClassSource": "ShpShipmentHeader",
                        "DisplayName": "Shipment",
                        "icon": "menu-icon fa fa-truck",
                        "EntitySource": "SHP",
                        "EntityRefKey": "SHP_PK",
                        "EntityRefCode": "SHP_ShipmentNo",
                        "IsParentEntityRefKey": false,
                        "IsAdditionalEntityRefKey": false
                    }, {
                        "ClassSource": "JobPickupAndDelivery",
                        "DisplayName": "Pickup And Delivery",
                        "icon": "menu-icon fa fa-truck",
                        "EntitySource": "PAD",
                        "EntityRefKey": "PAD_PK",
                        "EntityRefCode": "PAD_ShipmentNo",
                        "IsParentEntityRefKey": true,
                        "ParentEntitySource": "SHP",
                        "ParentEntityRefKey": "SHP_PK",
                        "ParentEntityRefCode": "SHP_ShipmentNo",
                        "IsAdditionalEntityRefKey": false,
                        "AdditionalEntitySource": undefined,
                        "AdditionalEntityRefKey": undefined,
                        "AdditionalEntityRefCode": undefined
                    }]
                },
                "POH": {
                    "ListSource": [{
                        "ClassSource": "PorOrderHeader",
                        "DisplayName": "Order",
                        "icon": "menu-icon fa fa-truck",
                        "EntitySource": "POH",
                        "EntityRefKey": "POH_PK",
                        "EntityRefCode": "POH_OrderNo",
                        "IsParentEntityRefKey": false,
                        "IsAdditionalEntityRefKey": false
                    }, {
                        "ClassSource": "PorPreAdviceShipment",
                        "DisplayName": "PorPreAdvice Shipment",
                        "icon": "menu-icon fa fa-truck",
                        "EntitySource": "SPA",
                        "EntityRefKey": "SPA_PK",
                        "EntityRefCode": "SPA_PreAdviceId",
                        "IsParentEntityRefKey": true,
                        "ParentEntitySource": "POH",
                        "ParentEntityRefKey": "POH_PK",
                        "ParentEntityRefCode": "POH_OrderNo",
                        "IsAdditionalEntityRefKey": false,
                        "AdditionalEntitySource": undefined,
                        "AdditionalEntityRefKey": undefined,
                        "AdditionalEntityRefCode": undefined
                    }]
                }
            }
        };

        return exports;
    }
})();
