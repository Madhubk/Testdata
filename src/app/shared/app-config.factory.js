(function () {
    "use strict";

    angular
        .module("Application")
        .factory('appConfig', AppConfig);

    AppConfig.$inject = [];

    function AppConfig() {
        var exports = {
            "Entities": {
                "Menu": {
                    "List": [],
                    "VisibleType": null
                },
                "standardMenuConfigList": {
                    "MenuList": [{
                        "Name": "comment",
                        "DisplayName": "Comment",
                        "Icon": "fa fa-comments"
                    }, {
                        "Name": "document",
                        "DisplayName": "Document",
                        "Icon": "fa fa-file"
                    }, {
                        "Name": "email-template",
                        "DisplayName": "Email",
                        "Icon": "fa fa-envelope"
                    }, {
                        "Name": "email-template-creation",
                        "DisplayName": "Email Template",
                        "Icon": "fa fa-envelope"
                    }, {
                        "Name": "exception",
                        "DisplayName": "Exception",
                        "Icon": "fa fa-warning"
                    }, {
                        "Name": "email",
                        "DisplayName": "Email",
                        "Icon": "fa fa-envelope"
                    }, {
                        "Name": "event",
                        "DisplayName": "Event",
                        "Icon": "fa fa-calendar"
                    }, {
                        "Name": "audit-log",
                        "DisplayName": "Audit Log",
                        "Icon": "fa fa-user"
                    }, {
                        "Name": "integration",
                        "DisplayName": "Integration",
                        "Icon": "fa fa-user"
                    }, {
                        "Name": "task",
                        "DisplayName": "Task",
                        "Icon": "fa fa-user"
                    }, {
                        "Name": "event-data",
                        "DisplayName": "Data Event",
                        "Icon": "fa fa-calendar"
                    }],
                    "ShipmentSearch": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIShipmentHeader",
                        "keyObjectNo": "ShipmentNo",
                        "configName": "shipmentConfig",
                        "entity": "Shipment",
                        "entitySource": "SHP"
                    },
                    "Booking": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "UIShipmentHeader",
                        "keyObjectNo": "ShipmentNo",
                        "configName": "BookingConfig",
                        "entity": "Booking",
                        "entitySource": "SHP"
                    },
                    "ConsolHeader": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "UIConConsolHeader",
                        "keyObjectNo": "ConsolNo",
                        "configName": "consolidationConfig",
                        "entity": "Consol",
                        "entitySource": "CON"
                    },
                    "OrderHeader": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": true,
                            "integration": false,
                        },
                        "keyObject": "UIPorOrderHeader",
                        "keyObjectNo": "OrderNo",
                        "configName": "orderConfig",
                        "entity": "Order",
                        "entitySource": "POH"
                    },
                    "TrackOrder": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": true,
                            "integration": false,
                        },
                        "keyObject": "UIPorOrderHeader",
                        "keyObjectNo": "OrderNo",
                        "configName": "orderConfig",
                        "entity": "Order",
                        "entitySource": "POH"
                    },
                    "TrackShipment": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "UIShipmentHeader",
                        "keyObjectNo": "ShipmentNo",
                        "configName": "shipmentConfig",
                        "entity": "Shipment",
                        "entitySource": "SHP"
                    },
                    "supplierfollowup": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": false,
                            "integration": false,
                        },
                        "keyObject": "UIOrderFollowUp",
                        "keyObjectNo": "FollowUpId",
                        "configName": "sufflierFollowupConfig",
                        "entity": "supplierfollowup",
                        "entitySource": "POH"
                    },
                    "preadvice": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": false,
                            "integration": false,
                        },
                        "keyObject": "UIPorPreAdviceShipment",
                        "keyObjectNo": "PreAdviceId",
                        "configName": "preAdviceConfig",
                        "entity": "shipmentPreAdvice",
                        "entitySource": "POH"
                    },
                    "orderlines": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": false,
                            "integration": false,
                        },
                        "keyObject": "UIPorOrderLines",
                        "keyObjectNo": "LineNo",
                        "configName": "orderLinesConfig",
                        "entity": "orderlines",
                        "entitySource": "POH"
                    },
                    "PorOrderLine": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": false,
                            "integration": false,
                        },
                        "keyObject": "UIPorOrderLines",
                        "keyObjectNo": "LineNo",
                        "configName": "orderLinesConfig",
                        "entity": "orderlines",
                        "entitySource": "POH"
                    },
                    "POBatchUpload": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "event-data": false,
                            "task": false,
                            "integration": false,
                        },
                        "keyObject": "UIPorOrderLines",
                        "keyObjectNo": "BatchUploadNo",
                        "configName": "poBatchUploadConfig",
                        "entity": "PorBatchUpload",
                        "entitySource": "BAT"
                    },
                    "OrderReport": {
                        "StandardMenuConfig": {
                            "comment": false,
                            "document": false,
                            "email": false,
                            "email-template": false,
                            "event": false,
                            "exception": false,
                            "audit-log": false,
                            "event-data": false,
                            "task": false,
                            "integration": false,
                        },
                        "keyObject": "UIPorOrderHeader",
                        "keyObjectNo": "OrderNo",
                        "configName": "orderConfig",
                        "entity": "Order",
                        "entitySource": "POH"
                    },
                    "WarehouseArea": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsInwardHeader",
                        "keyObjectNo": "Name",
                        "configName": "areasConfig",
                        "entity": "WarehouseArea",
                        "entitySource": "WAK"
                    },
                    "WarehouseRow": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "WmsLocation",
                        "keyObjectNo": "Name",
                        "configName": "locationConfig",
                        "entity": "WarehouseLocation",
                        "entitySource": "WLO"
                    },
                    "Warehouse": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "WmsWarehouse",
                        "keyObjectNo": "WarehouseCode",
                        "configName": "warehousesConfig",
                        "entity": "Warehouse",
                        "entitySource": "WAR"
                    },
                    "OrgSupplierPart": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIProductGeneral",
                        "keyObjectNo": "PartNum",
                        "configName": "productConfig",
                        "entity": "OrgSupplierPart",
                        "entitySource": "OSP"
                    },
                    "WarehouseInward": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsInwardHeader",
                        "keyObjectNo": "WorkOrderID",
                        "configName": "inwardConfig",
                        "entity": "WarehouseInward",
                        "EntitySource": "WMS"
                    },
                    "WarehousePick": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsPickHeader",
                        "keyObjectNo": "PickNo",
                        "configName": "pickConfig",
                        "entity": "WarehousePick",
                        "entitySource": "WPK"
                    },
                    "TransportPickupandDelivery": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsPickupAndDeliveryPointsHeader",
                        "keyObjectNo": "ReferenceNo",
                        "configName": "pickupanddeliveryConfig",
                        "entity": "TransportPickupandDelivery",
                        "entitySource": "TPD"
                    },
                    "TransportsManifest": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "TmsManifestHeader",
                        "keyObjectNo": "ManifestNumber",
                        "configName": "manifestConfig",
                        "entity": "TransportsManifest",
                        "entitySource": "TMM"
                    },
                    "Journey": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "TmsJourneyHeader",
                        "keyObjectNo": "Title",
                        "configName": "journeyConfig",
                        "entity": "Journey",
                        "entitySource": "TMJ"
                    },
                    "Leg": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "TmsLegHeader",
                        "keyObjectNo": "Title",
                        "configName": "legConfig",
                        "entity": "Leg",
                        "entitySource": "TML"
                    },
                    "Zone": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "TmsZoneHeader",
                        "keyObjectNo": "Name",
                        "configName": "zoneConfig",
                        "entity": "Zone",
                        "entitySource": "TMZ"
                    },
                    "CfxMapping": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "TmsCfxMappingHeader",
                        "keyObjectNo": "MappingCode",
                        "configName": "senderCarrierConfig",
                        "entity": "CfxMapping",
                        "entitySource": "CFM"
                    },
                    "TransportsConsignment": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "TmsConsignmentHeader",
                        "keyObjectNo": "ConsignmentNumber",
                        "configName": "consignmentConfig",
                        "entity": "TransportsConsignment",
                        "entitySource": "TMC"
                    },
                    "TransportItem": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "TmsItemHeader",
                        "keyObjectNo": "ItemCode",
                        "configName": "itemConfig",
                        "entity": "TransportItem",
                        "entitySource": "TIT"
                    },
                    "ProductRelatedParty": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIProductGeneral",
                        "keyObjectNo": "ProductCode",
                        "configName": "mhuConfig",
                        "entity": "ProductRelatedParty",
                        "entitySource": "OPR"
                    },
                    "WarehouseRelease": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsPickHeader",
                        "keyObjectNo": "PickNo",
                        "configName": "releaseConfig",
                        "entity": "WarehouseRelease",
                        "entitySource": "WPK"
                    },
                    "report": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsPickHeader",
                        "keyObjectNo": "PickNo",
                        "configName": "reportConfig",
                        "entity": "WarehouseReports",
                        "entitySource": "WPK"
                    },
                    "WarehouseOutward": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsOutwardHeader",
                        "keyObjectNo": "WorkOrderID",
                        "configName": "outwardConfig",
                        "entity": "WarehouseOutward",
                        "entitySource": "WMS"
                    },
                    "WarehouseTransport": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "WmsTransport",
                        "keyObjectNo": "TransportRefNo",
                        "configName": "transportConfig",
                        "entity": "WarehouseTransport",
                        "entitySource": "TPT"
                    },
                    "WarehouseInventory": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsInventory",
                        "keyObjectNo": "WorkInventoryID",
                        "configName": "inventoryConfig",
                        "entity": "WarehouseInventory",
                        "entitySource": "REC"
                    },
                    "InventorySummary": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsInventory",
                        "keyObjectNo": "WorkInventoryID",
                        "configName": "inventoryConfig",
                        "entity": "InventorySummary",
                        "entitySource": "REC"
                    },
                    "WarehouseAdjustments": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIAdjustmentHeader",
                        "keyObjectNo": "WorkOrderID",
                        "configName": "adjustmentConfig",
                        "entity": "WarehouseAdjustments",
                        "entitySource": "WOD"
                    },
                    "WarehouseCycleCount": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsCycleCounttHeader",
                        "keyObjectNo": "StocktakeNumber",
                        "configName": "cycleCountConfig",
                        "entity": "WarehouseCycleCount",
                        "entitySource": "WCC"
                    },
                    "WarehouseStockTransfer": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "UIWmsStockTransferHeader",
                        "keyObjectNo": "WorkOrderID",
                        "configName": "stocktransferConfig",
                        "entity": "WarehouseStockTransfer",
                        "entitySource": "WOD"
                    },
                    "OrganizationList": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "email-template-creation": false,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": false,
                            "event-data": false,
                            "integration": false,
                        },
                        "keyObject": "OrgHeader",
                        "keyObjectNo": "Code",
                        "configName": "organizationConfig",
                        "entity": "OrganizationList",
                        "entitySource": "ORG"
                    },
                    "ContainerList": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "UICntContainer",
                        "keyObjectNo": "ContainerNo",
                        "configName": "ContainerConfig",
                        "entity": "ContainerList",
                        "entitySource": "CNT"
                    },
                    "TrackContainer": {
                        "StandardMenuConfig": {
                            "comment": true,
                            "document": true,
                            "email": false,
                            "email-template": true,
                            "event": true,
                            "exception": true,
                            "audit-log": true,
                            "task": true,
                            "event-data": true,
                            "integration": false,
                        },
                        "keyObject": "UICntContainer",
                        "keyObjectNo": "ContainerNo",
                        "configName": "trackContainerConfig",
                        "entity": "TrackContainer",
                        "entitySource": "CNT"
                    }
                },
                "Token": {
                    "RowIndex": -1,
                    "API": {
                        "token": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "token"
                        },
                        "SoftLoginToken": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Token/SoftLoginToken"
                        },
                        "Logout": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Token/Logout"
                        }
                    }
                },
                "SecApp": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecApp/FindAll",
                            "FilterID": "SECAPP"
                        },
                        "FindAllAccess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecApp/FindAllAccess",
                            "FilterID": "SECAPP"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecApp/Upsert"
                        }
                    }
                },
                "SecAppUrl": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecAppUrl/FindAll",
                            "FilterID": "SECAPUL"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecAppUrl/Upsert"
                        }
                    }
                },
                "SecMappings": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecMappings/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecMappings/GetColumnValuesWithFilters",
                            "FilterID": "SECMAPP"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecMappings/Upsert"
                        }
                    }
                },
                "SecTenant": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecTenant/FindAll",
                            "FilterID": "SECTENA"
                        },
                        "MasterFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecTenant/MasterFindAll",
                            "FilterID": "SECTENA"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecTenant/Upsert"
                        }
                    }
                },
                "SecOperation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecOperation/FindAll",
                            "FilterID": "SECOPER"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecOperation/GetColumnValuesWithFilters",
                            "FilterID": "SECOPER"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecOperation/Upsert"
                        }
                    }
                },
                "UserExtended": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserExtended/FindAll",
                            "FilterID": "USEREXT"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserExtended/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserExtended/Update"
                        }
                    }
                },
                "SecUserSession": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecUserSession/FindAll",
                            "FilterID": "SECSESU"
                        }
                    }
                },
                "SecLoginHistory": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecLoginHistory/FindAll",
                            "FilterID": "SECLOGI"
                        }
                    }
                },
                "SecSessionActivity": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecSessionActivity/FindAll",
                            "FilterID": "SECSESS"
                        }
                    }
                },
                "NLog": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "NLog/FindAll",
                            "FilterID": "NLOG"
                        }
                    }
                },
                "ElmahError": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ElmahError/FindAll",
                            "FilterID": "ELMAHERR"
                        }
                    }
                },
                "SecTenantUserMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecTenantUserMapping/FindAll",
                            "FilterID": "SETUSM"
                        }
                    }
                },
                "AuthTrust": {
                    "RowIndex": -1,
                    "API": {
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AuthTrust/GetColumnValuesWithFilters",
                            "FilterID": "AUTHTRU"
                        }
                    }
                },
                "User": {
                    "RowIndex": -1,
                    "API": {
                        "ChangePassword": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "User/ChangePassword"
                        }
                    }
                },
                "HomeMenuUserRoleAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "HomeMenuUserRoleAccess/FindAll",
                            "FilterID": "HOMURA"
                        }
                    }
                },
                "CompUserRoleAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CompUserRoleAccess/FindAll",
                            "FilterID": "COMURA"
                        }
                    }
                },
                "ComFilterGroup": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ComFilterGroup/FindAll",
                            "FilterID": "FILTERG"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ComFilterGroup/Upsert"
                        }
                    }
                },
                "ComFilterList": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ComFilterList/FindAll",
                            "FilterID": "FILTERL"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ComFilterList/Upsert"
                        }
                    }
                },
                "ProcessMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "Url": "ProcessMaster/FindAll",
                            "FilterID": "DYN_PRO"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "Url": "ProcessMaster/Upsert",
                        }
                    }
                },
                "EventMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "Url": "EventMaster/FindAll",
                            "FilterID": "EVEMA"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "Url": "EventMaster/Upsert",
                        }
                    }
                },
                "DataEntryProcessTaskMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataEntryProcessTaskMapping/FindAll",
                            "FilterID": "DYN_PRS"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataEntryProcessTaskMapping/Upsert"
                        }
                    }
                },
                "TypeMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TypeMaster/FindAll",
                            "FilterID": "DYN_TYP"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TypeMaster/GetColumnValuesWithFilters",
                            "FilterID": "DYN_TYP"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TypeMaster/Upsert"
                        }
                    }
                },
                "EntityMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "Url": "EntityMaster/FindAll",
                            "FilterID": "DYN_ENT"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "Url": "EntityMaster/Upsert"
                        }
                    }
                },
                "DataEntryDetails": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "Url": "DataEntryDetails/GetById/"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "Url": "DataEntryDetails/Upsert"
                        }
                    }
                },
                "TeamProjectMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TeamProjectMaster/FindAll",
                            "FilterID": "TEAM_PR"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TeamProjectMaster/Upsert"
                        }
                    }
                },
                "FieldMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "FieldMaster/FindAll",
                            "FilterID": "DYN_FIE"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "FieldMaster/Upsert",
                            "FilterID": ""
                        }
                    }
                },
                "SecRole": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecRole/FindAll",
                            "FilterID": "SECROLE"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecRole/Upsert"
                        }
                    }
                },
                "SecRoleOperation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecRoleOperation/FindAll",
                            "FilterID": "SECROLE"
                        }
                    }
                },
                "AppSettings": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AppSettings/FindAll/",
                            "FilterID": "APPSETT"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AppSettings/Upsert/"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AppSettings/GetColumnValuesWithFilters/",
                            "FilterID": "APPSETT"
                        },
                        "StaredFindAll": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "AppSettings/StaredFindAll/DASHBOARD/"
                        }
                    }
                },
                "UserSettings": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserSettings/FindAll/",
                            "FilterID": "USRSETT"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserSettings/Upsert/"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserSettings/GetColumnValuesWithFilters/",
                            "FilterID": "USRSETT"
                        }
                    }
                },
                "Country": {
                    "RowIndex": -1,
                    "API": {
                        "FindLookup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindLookup",
                            "FilterID": "MSTCOUN",
                            "DBObjectName": "MstCountry"
                        }
                    }
                },
                "MstContainer": {
                    "RowIndex": -1,
                    "API": {
                        "FindLookup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindLookup",
                            "FilterID": "MSTCONT",
                            "DBObjectName": "MstContainer"
                        }
                    }
                },
                "CountryState": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CountryState/FindAll",
                            "FilterID": "MSTCSTE"
                        }
                    }
                },
                "Currency": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstCurrency/FindAll",
                            "FilterID": "MSTCURR"
                        }
                    }
                },
                "ServiceLevel": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstServiceLevel/FindAll",
                            "FilterID": "MSTPACK"
                        }
                    }
                },
                "CfxMenus": {
                    "RowIndex": -1,
                    "API": {
                        "FindAllMenuWise": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/FindAllMenuWise",
                            "FilterID": "CFXMENU"
                        },
                        "MasterFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/MasterFindAll",
                            "FilterID": "CFXMENU"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/FindAll",
                            "FilterID": "CFXMENU"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/Upsert"
                        },
                        "MasterCascadeFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/MasterCascadeFindAll",
                            "FilterID": "CFXMENU"
                        }
                    }
                },
                "MenuGroups": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MenuGroups/FindAll",
                            "FilterID": "MENUGRO"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MenuGroups/Upsert"
                        }
                    }
                },
                "CfxTypes": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/FindAll/",
                            "FilterID": "CFXTYPE"
                        },
                        "DynamicFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/DynamicFindAll/",
                            "FilterID": "CFXTYPE"
                        },
                        "GetColumnValues": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "cfxtypes/GetColumnValues/"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/GetColumnValuesWithFilters/",
                            "FilterID": "CFXTYPE"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/Upsert/"
                        }
                    }
                },
                "DataEntry": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "SaveAndComplete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/SaveAndComplete"
                        }
                    }
                },
                "DataEntryMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/GetColumnValuesWithFilters",
                            "FilterID": "DYNDAT"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/Upsert"
                        }
                    }
                },
                "MstPackType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstPackType/FindAll",
                            "FilterID": "MSTPACK"
                        }
                    }
                },
                "DocTypeMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DocTypeMaster/FindAll",
                            "FilterID": "MSTDOCT"
                        }
                    }
                },
                "SecSession": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecSessionActivity/FindAll",
                            "FilterID": "SECSESS"
                        }
                    }
                },
                "OrgHeader": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgHeader/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeader/FindAll",
                            "FilterID": "ORGHEAD"
                        }
                    },
                },
                "OrgAddress": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgAddress/FindAll",
                            "FilterID": "ORGADDR"
                        },
                        "DynamicFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgAddress/DynamicFindAll",
                            "FilterID": "ORGADDR"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgAddress/Delete/"
                        },
                        "CountryState": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CountryState/FindAll",
                            "FilterID": "MSTCSTE"
                        },
                        "UNLOCO": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstUnloco/FindAll",
                            "FilterID": "MSTUNL"
                        },
                    },
                },
                "OrgContact": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgContact/FindAll",
                            "FilterID": "ORGCONT"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgContact/Delete/"
                        }
                    }
                },
                "WmsClientParameterByWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsClientParameterByWarehouse/Delete/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientParameterByWarehouse/Insert/"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "T",
                            "Url": "WmsClientParameterByWarehouse/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientParameterByWarehouse/FindAll",
                            "FilterID": "WMSWCP"
                        }
                    }
                },
                "WmsClientPickPackParamsByWms": {
                    "RowIndex": -1,
                    "API": {
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsClientPickPackParamsByWms/Delete/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "T",
                            "Url": "WmsClientPickPackParamsByWms/Insert/"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "T",
                            "Url": "WmsClientPickPackParamsByWms/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientPickPackParamsByWms/FindAll",
                            "FilterID": "WMSWPP"
                        }
                    }
                },
                "JobAddress": {
                    "RowIndex": -1,
                    "API": {
                        "DynamicFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/DynamicFindAll",
                            "FilterID": "JOBADDR"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/FindAll",
                            "FilterID": "JOBADDR"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/Insert",

                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/Update",

                        }
                    }
                },
                "JobRoutes": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/FindAll",
                            "FilterID": "JOBROUT"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Delete/"
                        },
                        "UpdateList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/UpdateList",
                            "FilterID": "JOBROUT"
                        }
                    },
                    "Grid": {
                        "ColumnDef": [{
                                "field": "LegOrder",
                                "displayName": "LegOrder",
                            }, {
                                "field": "TransportMode",
                                "displayName": "Mode",
                            }, {
                                "field": "TransportType",
                                "displayName": "Type",
                            }, {
                                "field": "Status",
                                "displayName": "Status",
                            }, {
                                "field": "Vessel",
                                "displayName": "Vessel",
                            }, {
                                "field": "VoyageFlight",
                                "displayName": "Voyage/ Flight",
                            }, {
                                "field": "LoadPort",
                                "displayName": "Load",
                            }, {
                                "field": "DischargePort",
                                "displayName": "Discharge",
                            }, {
                                "field": "IsDomestic",
                                "displayName": "Is Domestic",
                            }, {
                                "field": "ETD",
                                "displayName": "ETD",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ETD | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "ETA",
                                "displayName": "ETA",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ETA | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "ATD",
                                "displayName": "ATD",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ATD | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "ATA",
                                "displayName": "ATA",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ATA | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            },
                            /*{
                                                       "field": "Edit",
                                                       "displayName": "Edit",
                                                       "width": 60,
                                                       "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-pencil-square-o cursor-pointer' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnEditSelectedRow(row)'></span></div>",
                                                   }, {
                                                       "field": "Delete",
                                                       "displayName": "Delete",
                                                       "width": 60,
                                                       "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-trash-o cursor-pointer danger' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnDeleteSelectedRow(row)'></span></div>",
                                                   }*/
                        ],
                        /*"GridConfig": {
                            "_gridHeight": 230,
                            "_enableRowSelection": false,
                            "_enableRowHeaderSelection": false,
                            "_multiSelect": false,
                            "_exporterCsvFilename": "data",
                            '_exporterPdfFilename': "data",
                            "_enablePaginationControls": false,
                            "_enableGridMenu": false,
                            "_enableColumnMenus": false,
                            "_enableCellSelection": false,
                            "_enableCellEdit": false,
                            "_enableSorting": true,
                            "_useExternalSorting": false,
                            "_useExternalPagination": false,
                            "_isAPI": false,
                            "_rowTemplate": "<div ng-dblclick='grid.appScope.GridCtrl.ePage.Masters.OnRowDoubleClick(grid, row)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                            "_columnPrefix": "RUT_",
                            "_sortColumn": "ATA",
                            "_sortType": "ASC",
                            "_pageNumber": 1,
                            "_paginationPageSize": 5000,
                            "_paginationPageSizes": [25, 50, 100]
                        }*/
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": ""
                        }
                    }
                },
                "JobComments": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/FindAll",
                            "FilterID": "JOBCMTS"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/Insert",
                            // "FilterID": "JOBCMTS"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/Update",
                            // "FilterID": "JOBCMTS"
                        }
                    }
                },
                "JobExceptions": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/FindAll",
                            "FilterID": "JOBEXCP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Insert",
                            // "FilterID": "JOBEXCP"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Update",
                            // "FilterID": "JOBEXCP"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Upsert"
                        }
                    }
                },
                "MstExceptionType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstExceptionType/FindAll",
                            "FilterID": "MSTEXCE"
                        }
                    }
                },
                "JobDocument": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobDocument/FindAll/",
                            "FilterID": "JOBDOC"
                        },
                        "GetLogoFile": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobDocument/GetLogoFile/"
                        },
                        "JobDocumentDownload": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobDocument/DownloadFile/"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobDocument/Upsert/"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobDocument/Delete/"
                        },
                        "AmendDocument": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobDocument/AmendDocument/",
                            "FilterID": "JOBDOC"
                        }
                    },
                    "Grid": {
                        "ColumnDef": [{
                            "field": "FileName",
                            "displayName": "File Name"
                        }, {
                            "field": "Download",
                            "displayName": "Download",
                            "width": 80,
                            "cellTemplate": "<div  class='p-5 text-single-line text-center'><span class='fa fa-download cursor-pointer' data-ng-click='DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"download\")'></span></div>"
                        }],
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Document",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 25,
                            "isRowTemplate": false
                        }
                    },
                    // "Grid": {
                    //     "ColumnDef": [{
                    //         "field": "FileName",
                    //         "displayName": "File Name",
                    //     }, {
                    //         "field": "Edit",
                    //         "displayName": "Edit",
                    //         "width": 45,
                    //         "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-pencil-square-o cursor-pointer danger' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnEditSelectedRow(row)'></span></div>",
                    //     }, {
                    //         "field": "Delete",
                    //         "displayName": "Delete",
                    //         "width": 60,
                    //         "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-trash-o cursor-pointer danger' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnDeleteSelectedRow(row)'></span></div>",
                    //     }, {
                    //         "field": "Download",
                    //         "displayName": "Download",
                    //         "width": 80,
                    //         "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-download cursor-pointer' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnDownloadSelectedRowDoc(row)'></span></div>",
                    //     }],
                    //     "GridConfig": {
                    //         "_gridHeight": 230,
                    //         "_enableRowSelection": false,
                    //         "_enableRowHeaderSelection": false,
                    //         "_multiSelect": false,
                    //         "_exporterCsvFilename": "data",
                    //         "_exporterPdfFilename": "data",
                    //         "_enablePaginationControls": false,
                    //         "_enableGridMenu": false,
                    //         "_enableColumnMenus": false,
                    //         "_enableCellSelection": false,
                    //         "_enableCellEdit": false,
                    //         "_enableSorting": true,
                    //         "_useExternalSorting": false,
                    //         "_useExternalPagination": false,
                    //         "_isAPI": false,
                    //         "_rowTemplate": "<div ng-dblclick='grid.appScope.GridCtrl.ePage.Masters.OnRowDoubleClick(grid, row)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                    //         "_columnPrefix": "DOC_",
                    //         "_sortColumn": "DocCategory",
                    //         "_sortType": "ASC",
                    //         "_pageNumber": 1,
                    //         "_paginationPageSize": 5000,
                    //         "_paginationPageSizes": [25, 50, 100]
                    //     }
                    // }
                },
                "DataConfig": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataConfig/FindAll",
                            "FilterID": 'DATACOF'
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataConfig/Upsert"
                        }
                    }
                },
                "DataConfigFields": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataConfigFields/FindAll",
                            "FilterID": 'DACONF'
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataConfigFields/Upsert"
                        }
                    }
                },
                "DataAudit": {
                    "RowIndex": -1,
                    "API": {
                        "DynamicFindAll": {
                            "IsAPI": true,
                            "Url": "DataAudit/DynamicFindAll",
                            "FilterID": "DATAAUD"
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataAudit/FindAll",
                            "FilterID": "DATAAUD"
                        }
                    }
                },
                "JobRequiredDocument": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRequiredDocument/FindAll",
                            "FilterID": "JOBREQU"
                        }
                    }
                },
                "DMS": {
                    "RowIndex": -1,
                    "API": {
                        "DMSDownload": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DMS/DownloadFile"
                        },
                        "DMSUpload": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DMS/Upload"
                        },
                        "DeleteFile": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DMS/DeleteFile/"
                        }
                    }
                },
                "ConShpMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConShpMapping/FindAll",
                            "FilterID": "CONSHPMAP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConShpMapping/Insert",
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ConShpMapping/Delete/",
                        }
                    }
                },
                "ConConsolHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConConsolHeader/FindAll",
                            "FilterID": "CONSHEAD"
                        }
                    }
                },
                "Communication": {
                    "RowIndex": -1,
                    "API": {
                        "CreateGroupEmail": {
                            "IsAPI": true,
                            "Url": "Communication/CreateGroupEmail/"
                        }
                    }
                },
                "JobService": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobService/FindAll",
                            "FilterID": "JOBSERV"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobService/Upsert"
                        }
                    }
                },
                "JobEntryNum": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEntryNum/FindAll",
                            "FilterID": "JENTNUM"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEntryNum/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEntryNum/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobEntryNum/Delete/"
                        }
                    }
                },
                "JobHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobHeader/FindAll",
                            "FilterID": "JOBHEAD"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobHeader/Insert",
                            "FilterID": "JOBHEAD"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobHeader/Update",
                            "FilterID": "JOBHEAD"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobHeader/Delete/",
                            "FilterID": "JOBHEAD"
                        }
                    },
                    "Grid": {
                        "ColumnDef": [{
                                "field": "CompanyName",
                                "displayName": "Company Name",
                            }, {
                                "field": "BranchName",
                                "displayName": "Branch Name",
                            }, {
                                "field": "DeptName",
                                "displayName": "Department Name",
                            }, {
                                "field": "Status",
                                "displayName": "Status",
                            }
                            /*{
                                                       "field": "Edit",
                                                       "displayName": "Edit",
                                                       "width": 60,
                                                       "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-pencil-square-o cursor-pointer' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnEditSelectedRow(row)'></span></div>",
                                                   }, {
                                                       "field": "Delete",
                                                       "displayName": "Delete",
                                                       "width": 60,
                                                       "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-trash-o cursor-pointer danger' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnDeleteSelectedRow(row)'></span></div>",
                                                   }*/
                        ],
                        /*"GridConfig": {
                            "_gridHeight": 230,
                            "_enableRowSelection": false,
                            "_enableRowHeaderSelection": false,
                            "_multiSelect": false,
                            "_exporterCsvFilename": "data",
                            '_exporterPdfFilename': "data",
                            "_enablePaginationControls": false,
                            "_enableGridMenu": false,
                            "_enableColumnMenus": false,
                            "_enableCellSelection": false,
                            "_enableCellEdit": false,
                            "_enableSorting": true,
                            "_useExternalSorting": false,
                            "_useExternalPagination": false,
                            "_isAPI": false,
                            "_rowTemplate": "<div ng-dblclick='grid.appScope.GridCtrl.ePage.Masters.OnRowDoubleClick(grid, row)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                            "_columnPrefix": "RUT_",
                            "_sortColumn": "ATA",
                            "_sortType": "ASC",
                            "_pageNumber": 1,
                            "_paginationPageSize": 5000,
                            "_paginationPageSizes": [25, 50, 100]
                        }*/
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": ""
                        }
                    }
                },
                "PorOrderHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderHeader/FindAll",
                            "FilterID": "ORDHEAD"
                        },
                        "GetSplitOrdersByOrderNo": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderHeader/GetSplitOrdersByOrderNo/"
                        },
                        "SplitOrderByOrderPk": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderHeader/SplitOrderByOrderPk/",
                            "FilterID": "ORDHEAD"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderHeader/UpdateRecords"
                        },
                        "CheckOrderNumber": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderHeader/CheckOrderNumber/",
                            "FilterID": "ORDHEAD"
                        }
                    }
                },
                "ShipmentHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/FindAll",
                            "FilterID": "SHIPHEAD"
                        },
                        "Count": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/FindCount",
                            "FilterID": "SHIPHEAD"
                        }
                    }
                },
                "ShipmentList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/GetById/"
                        },
                        "ShipmentActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/ShipmentActivityClose/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentList/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentList/Update"
                        }
                    }
                },
                "JobPackLines": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/FindAll",
                            "FilterID": "JOBPACK"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/Upsert"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobPackLines/Delete/"
                        }
                    }
                },
                "CmpDepartment": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CmpDepartment/FindAll",
                            "FilterID": "CMPDEPT",
                            "DBObjectName": "CmpDepartment"
                        }
                    }
                },
                "CmpCompany": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CmpCompany/FindAll",
                            "FilterID": "CMPCOMP",
                            "DBObjectName": "CmpCompany"
                        }
                    }
                },
                "CmpBranch": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CmpBranch/FindAll",
                            "FilterID": "CMPBRAN",
                            "DBObjectName": "CmpBranch"
                        }
                    }
                },
                "WmsWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        }
                    }
                },
                "InwardList": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                        },
                        "UpdateInwardProcess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/ProcessUpdate"
                        },
                    }
                },
                "ManifestList": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifestList/GetById/",
                        },
                        "UpdateManifestProcess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Update"
                        },
                    }
                },
                "MstDebtorGroup": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstDebtorGroup/FindAll",
                            "FilterID": "MSTDEGP",
                        }
                    }
                },
                "MstCreditorGroup": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstCreditorGroup/FindAll",
                            "FilterID": "MSTCEGP",
                        }
                    }
                },
                "OrgCompanyData": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgCompanyData/FindAll",
                            "FilterID": "ORGCDTA"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgCompanyData/GetById/"
                        }
                    }
                },
                "Organization": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Org/FindAll",
                            "FilterID": ""
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "Org/GetById/"
                        }
                    }
                },
                "OrgEmployeeAssignments": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgEmployeeAssignments/FindAll",
                            "FilterID": "ORGSASS"
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgEmployeeAssignments/GetColumnValuesWithFilters",
                            "FilterID": "ORGSASS"
                        }
                    }
                },
                "OrgRelatedPartiesMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgRelatedPartiesMapping/FindAll",
                            "FilterID": "RELPARTY"
                        }
                    }
                },
                "SaveSettings": {
                    "RowIndex": -1,
                    "API": {
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SaveSettings/Upsert/"
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "SaveSettings/FindAll/",
                            "FilterID": "SAVESET"
                        }
                    }
                },
                "DataEvent": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataEvent/FindAll",
                            "FilterID": "DATAEVT"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataEvent/Upsert",
                            "FilterID": ""
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataEvent/GetColumnValuesWithFilters",
                            "FilterID": "DATAEVT"
                        }
                    }
                },
                "OrgPartyType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "OrgPartyType/FindAll",
                            "FilterID": "ORGPTY"
                        }
                    }
                },
                "JobEmail": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEmail/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEmail/Update"
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "JobEmail/FindAll",
                            "FilterID": "JOBEML"
                        }
                    }
                },
                "NotificationEmail": {
                    "RowIndex": -1,
                    "API": {
                        "Send": {
                            "IsAPI": true,
                            "Url": "Notification/Email/Send",

                        },

                    }
                },
                "JobException": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "Title",
                            "displayName": "Title"
                        }, {
                            "field": "Description",
                            "displayName": "Description"
                        }, {
                            "field": "Reply",
                            "displayName": "Reply",
                            "width": 60,
                            "cellTemplate": "<i class='fa fa-reply' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"link\")'></i>",
                        }],
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "JobException List",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='padding-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "TeamTargetRelease": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamTargetRelease/FindAll",
                            "FilterID": "TEAMTRL"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamTargetRelease/Insert",
                            "FilterID": ""
                        },
                        "Update": {
                            "IsAPI": true,
                            "Url": "TeamTargetRelease/Update",
                            "FilterID": ""
                        }
                    }
                },
                "TeamTaskTagging": {
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamTaskTagging/FindAll",
                            "FilterID": "TEAMTAG"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamTaskTagging/Insert"
                        },
                        "Delete": {
                            "IsAPI": true,
                            "Url": "TeamTaskTagging/Delete/"
                        }
                    }
                },
                "TeamChat": {
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamChat/FindAll",
                            "FilterID": "TEAMCHAT"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamChat/Insert",
                            "FilterID": "TEAMCHAT"
                        }
                    }
                },
                "TeamEffort": {
                    "API": {
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamEffort/Insert",
                            "FilterID": ""
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "TeamEffort/Upsert",
                            "FilterID": ""
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamEffort/FindAll",
                            "FilterID": "TEAMEFT"
                        },
                    }
                },
                "TeamTask": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamTask/FindAll",
                            "FilterID": "TEAMTSK"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamTask/Insert",
                            "FilterID": ""
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "TeamTask/Upsert",
                            "FilterID": ""
                        },
                        "GetColumnValues": {
                            "IsAPI": true,
                            "Url": "TeamTask/GetColumnValues/TSK_Remarks",
                            "FilterID": "TEAMTSK"
                        }
                    }
                },
                "EBPMProcessMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMProcessMaster/FindAll",
                            "FilterID": "BPMPSM"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMProcessMaster/Upsert"
                        }
                    }
                },
                "EBPMProcessScenario": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMProcessScenario/FindAll",
                            "FilterID": "BPMPSS"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMProcessScenario/Upsert"
                        }
                    }
                },
                "TableColumn": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TableColumn/FindAll",
                            "FilterID": "TABLECOL"
                        }
                    }
                },
                "EBPMWorkStepInfo": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepInfo/FindAll",
                            "FilterID": "BPMWSI"
                        },
                        "DynamicFindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepInfo/DynamicFindAll",
                            "FilterID": "BPMWSI"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepInfo/Upsert"
                        }
                    }
                },
                "EBPMWorkStepAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepAccess/FindAll",
                            "FilterID": "BPMWSA"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepAccess/Upsert"
                        }
                    }
                },
                "EBPMWorkStepRules": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepRules/FindAll",
                            "FilterID": "BPMWSR"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepRules/Upsert"
                        }
                    }
                },
                "EBPMWorkStepActions": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepActions/FindAll",
                            "FilterID": "BPMSTA"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMWorkStepActions/Upsert"
                        }
                    }
                },
                "EBPMWorkItem": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAll",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithEntity": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithEntity",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllStatusCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllStatusCount",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithEntityCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithEntityCount",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllCount",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithAccess",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithAccessWithEntity": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithAccessWithEntity",
                            "FilterID": "BPMWKI"
                        }
                    }
                },
                "EBPMWorkFlow": {
                    "RowIndex": -1,
                    "API": {
                        "GetByInstanceNo": {
                            "IsAPI": true,
                            "Url": "EBPMWorkFlow/GetByInstanceNo/"

                        }
                    }
                },
                "EBPMEngine": {
                    "RowIndex": -1,
                    "API": {
                        "InitiateProcess": {
                            "IsAPI": true,
                            "Url": "EBPMEngine/InitiateProcess",

                        },
                        "AssignActivity": {
                            "IsAPI": true,
                            "Url": "EBPMEngine/AssignActivity",
                        },
                        "MovetoCommonQue": {
                            "IsAPI": true,
                            "Url": "EBPMEngine/MovetoCommonQue",
                        },
                        "CompleteProcess": {
                            "IsAPI": true,
                            "Url": "EBPMEngine/CompleteProcess",

                        }
                    }
                },
                "Multilingual": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "Multilingual/FindAll",
                            "FilterID": "MLTILIG"
                        },
                        "DynamicFindAll": {
                            "IsAPI": true,
                            "Url": "Multilingual/DynamicFindAll",
                            "FilterID": "MLTILIG"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "Multilingual/Upsert"
                        }
                    }
                },
                "Validation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                        "DynamicFindAll": {
                            "ISAPI": true,
                            "Url": "Validation/DynamicFindAll",
                            "FilterID": "VALIDAT"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "Validation/Upsert"
                        }
                    }
                },
                // Sailing 
                "SailingDetails": {
                    "API": {
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/Insert"
                        },
                        "ListInsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/ListInsert"
                        }
                    }
                },
                // Order
                "PO": {
                    "RowIndex": -1,
                    "API": {
                        "GetOpenOrdersCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetOpenOrdersCount",
                            "FilterID": "ORDHEAD"
                        },
                        "GetPendingCargoReadinessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetPendingCargoReadinessCount",
                            "FilterID": "ORDHEAD"
                        },
                        "GetPendingVesselPlanningCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetPendingVesselPlanningCount",
                            "FilterID": "ORDHEAD"
                        },
                        "GetPendingConvertToBookingCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetPendingConvertToBookingCount",
                            "FilterID": "ORDHEAD"
                        }
                    }
                },
                "OrderList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/GetById/",
                            "FilterID": "ORDHEAD"
                        },
                        "OrderCopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/OrderCopy/",
                            "FilterID": "ORDHEAD"
                        }
                    }
                },
                "CargoReadiness": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/FindAll",
                            "FilterID": "SFULIST"
                        },
                        "SendFollowUp": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/SendFollowUp",
                            "FilterID": "SFULIST"
                        },
                        "CreateFollowUpGroup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/CreateFollowUpGroup",
                            "FilterID": "SFULIST"
                        },
                        "GetGroupHeaderByGroupId": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CargoReadiness/FollowUpGroup/GetGroupHeaderByGroupId/",
                            "FilterID": "SFULIST"
                        },
                        "GetOrdersByGroupId": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CargoReadiness/FollowUpGroup/GetOrdersByGroupId/",
                            "FilterID": "SFULIST"
                        },
                        "CompleteFollowUpTask": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/CompleteFollowUpTask",
                            "FilterID": "SFULIST"
                        }
                    }
                },
                "PreAdviceList": {
                    "API": {
                        "PreAdviceSendList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/PreAdviceSendList",
                            "FilterID": "SPALIST"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/Delete"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/Insert"
                        },
                        "SendPreAdvice": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/SendPreAdvice"
                        }
                    }
                },
                "VesselPlanning": {
                    "API": {
                        "PreAdviceList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/PreAdviceList",
                            "FilterID": "SPALIST"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/Delete"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/Insert"
                        },
                        "SendPreAdvice": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/SendPreAdvice"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "VesselPlanning/GetById/"
                        },
                        "GetOrdersByVesselPk": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "VesselPlanning/PPAGroup/GetOrdersByVesselPk/"
                        },
                        "GetPPAGroupHeaderByVesselPk": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "VesselPlanning/PPAGroup/GetPPAGroupHeaderByVesselPk/"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/PPAGroupDetails/UpdateRecords"
                        },
                    }
                },
                "ConShpMapping": {
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConShpMapping/FindAll",
                            "FilterID": "CONSHPMAP"
                        }
                    }
                },
                "PorOrderLineDelivery": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLineDelivery/FindAll",
                            "FilterID": "ORDLDEL"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderLineDelivery/GetById/"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderLineDelivery/Delete/",
                            "FilterID": "ORDLDEL"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLineDelivery/Insert",
                            "FilterID": "ORDLDEL"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLineDelivery/Update",
                            "FilterID": "ORDLDEL"
                        }
                    }
                },
                "PorOrderLine": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderLine/GetById/",
                            "FilterID": "ORDLINE"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/FindAll",
                            "FilterID": "ORDLINE"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/Upsert",
                            "FilterID": "ORDLINE"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/Update",
                            "FilterID": "ORDLINE"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/Delete",
                            "FilterID": "ORDLINE"
                        }
                    }
                },
                // PO Upload
                "BatchUploadList": {
                    "RowIndex": -1,
                    "API": {
                        "CompletePOUpload": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "BatchUploadList/CompletePOUpload/",
                            "FilterID": ""
                        },
                        "InitatePOUpload": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "BatchUploadList/InitatePOUpload/",
                            "FilterID": ""
                        }
                    }
                },
                // PorOrderFollowUp
                "PorOrderFollowUp": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderFollowUp/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderFollowUp/Update"
                        }
                    }
                },
                // FollowUpList
                "FollowUpList": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/Delete"
                        },
                        "ActivateCRDUpdate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/ActivateCRDUpdate"
                        }
                    }
                },
                // Smart Track
                "PorOrderContainer": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderContainer/FindAll",
                            "FilterID": "ORDCONT"
                        }
                    }
                },
                "PkgCntMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PkgCntMapping/FindAll",
                            "FilterID": "PKGCNTMA"
                        }
                    }
                },
                "CntContainer": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CntContainer/FindAll",
                            "FilterID": "CONTHEAD"
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
