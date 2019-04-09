(function () {
    'use strict';

    var WAREHOUSE_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'EAwarehouse',
            files: [
                'app/eaxis/warehouse/warehouse.css',
                'app/eaxis/warehouse/warehouse.controller.js',
                'app/eaxis/warehouse/warehouse-config.factory.js',
                'app/mdm/warehouse/customize-table/customize-table.css',
                'app/mdm/warehouse/customize-table/customize-table.directive.js',
                'app/mdm/warehouse/custom/customfilter.js'
            ]
        }, {
            name: 'warehouseDashboard',
            files: [
                'app/eaxis/warehouse/dashboard/dashboard.css',
                'app/eaxis/warehouse/dashboard/dashboard.controller.js',
            ]
        },
        // endregion
        // ------------------------ Inward -------------------
        // region
        {
            name: 'inward',
            files: [
                'app/eaxis/warehouse/inward/inward.css',
                'app/eaxis/warehouse/inward/inward.controller.js',
                'app/eaxis/warehouse/inward/inward-config.factory.js'
            ]
        }, {
            name: 'inwardAddress',
            files: [
                'app/eaxis/warehouse/inward/general/supplieraddress/address.css',
                'app/eaxis/warehouse/inward/general/supplieraddress/address.controller.js',
            ]
        }, {
            name: 'inwardMenu',
            files: [
                'app/eaxis/warehouse/inward/inward-menu/inward-menu.css',
                'app/eaxis/warehouse/inward/inward-menu/inward-menu.controller.js',
                'app/eaxis/warehouse/inward/inward-menu/inward-menu.directive.js'
            ]
        }, {
            name: 'inwardGeneral',
            files: [
                'app/eaxis/warehouse/inward/general/inward-general.css',
                'app/eaxis/warehouse/inward/general/inward-general.controller.js',
                'app/eaxis/warehouse/inward/general/inward-general.directive.js'
            ]
        }, {
            name: 'inwardAsnLines',
            files: [
                'app/eaxis/warehouse/inward/inward-asnlines/inward-asnlines.css',
                'app/eaxis/warehouse/inward/inward-asnlines/inward-asnlines.controller.js',
                'app/eaxis/warehouse/inward/inward-asnlines/inward-asnlines.directive.js'
            ]
        }, {
            name: 'inwardLines',
            files: [
                'app/eaxis/warehouse/inward/inward-lines/inward-lines.css',
                'app/eaxis/warehouse/inward/inward-lines/inward-lines.controller.js',
                'app/eaxis/warehouse/inward/inward-lines/inward-lines.directive.js'
            ]
        }, {
            name: 'inwardProductSummary',
            files: [
                'app/eaxis/warehouse/inward/inward-productsummary/inward-productsummary.css',
                'app/eaxis/warehouse/inward/inward-productsummary/inward-productsummary.controller.js',
                'app/eaxis/warehouse/inward/inward-productsummary/inward-productsummary.directive.js'
            ]
        }, {
            name: 'inwardMyTask',
            files: [
                'app/eaxis/warehouse/inward/my-task/inward-my-task.css',
                'app/eaxis/warehouse/inward/my-task/inward-my-task.directive.js',
                'app/eaxis/warehouse/inward/my-task/inward-my-task.controller.js'
            ]
        }, {
            name: 'inwardDashboard',
            files: [
                'app/eaxis/warehouse/inward/inward-dashboard/inward-dashboard.css',
                'app/eaxis/warehouse/inward/inward-dashboard/inward-dashboard.controller.js',
                'app/eaxis/warehouse/inward/inward-config.factory.js'
            ],
            serie: true
        }, {
            name: 'inwardDocument',
            files: [
                'app/eaxis/warehouse/inward/inward-document/inward-document.css',
                'app/eaxis/warehouse/inward/inward-document/inward-document.controller.js',
                'app/eaxis/warehouse/inward/inward-document/inward-document.directive.js'
            ]
        },
        // endregion
        //--------------------- Asn Request--------------------
        // region
        {
            name: 'asnRequest',
            files: [
                'app/eaxis/warehouse/asn-request/asnrequest.css',
                'app/eaxis/warehouse/asn-request/asnrequest.controller.js',
                'app/eaxis/warehouse/asn-request/asnrequest-config.factory.js'
            ]
        }, {
            name: 'asnRequestGeneral',
            files: [
                'app/eaxis/warehouse/asn-request/general/asnrequest-general.css',
                'app/eaxis/warehouse/asn-request/general/asnrequest-general.controller.js',
                'app/eaxis/warehouse/asn-request/general/asnrequest-general.directive.js'
            ]
        }, {
            name: 'asnRequestAddress',
            files: [
                'app/eaxis/warehouse/asn-request/general/supplieraddress/address.css',
                'app/eaxis/warehouse/asn-request/general/supplieraddress/address.controller.js',
            ]
        },
        // endregion
        // -------------------- Inward and Outward Common Files ------------------------
        // region
        {
            name: 'WmsReference',
            files: [
                'app/eaxis/warehouse/inw-out-common/reference/reference.css',
                'app/eaxis/warehouse/inw-out-common/reference/reference.controller.js',
                'app/eaxis/warehouse/inw-out-common/reference/reference.directive.js'
            ]
        }, {
            name: 'WmsContainer',
            files: [
                'app/eaxis/warehouse/inw-out-common/container/container.css',
                'app/eaxis/warehouse/inw-out-common/container/container.controller.js',
                'app/eaxis/warehouse/inw-out-common/container/container.directive.js'
            ]
        }, {
            name: 'WmsServices',
            files: [
                'app/eaxis/warehouse/inw-out-common/services/services.css',
                'app/eaxis/warehouse/inw-out-common/services/services.controller.js',
                'app/eaxis/warehouse/inw-out-common/services/services.directive.js'
            ]
        },
        // endregion
        // -------------------- Outward ------------------------
        // region
        {
            name: 'outward',
            files: [
                'app/eaxis/warehouse/outward/outward.css',
                'app/eaxis/warehouse/outward/outward.controller.js',
                'app/eaxis/warehouse/outward/outward-config.factory.js'
            ]
        }, {
            name: 'outwardBatchUpload',
            files: [
                'app/eaxis/warehouse/outward/outward-batch-upload/outward-batch-upload.controller.js',
            ]
        }, {
            name: 'outwardAddress',
            files: [
                'app/eaxis/warehouse/outward/general/consigneeaddress/address.css',
                'app/eaxis/warehouse/outward/general/consigneeaddress/address.controller.js',
            ]
        }, {
            name: 'outwardDashboard',
            files: [
                'app/eaxis/warehouse/outward/outward-dashboard/outward-dashboard.css',
                'app/eaxis/warehouse/outward/outward-dashboard/outward-dashboard.controller.js',
                'app/eaxis/warehouse/outward/outward-config.factory.js'
            ],
            serie: true
        }, {
            name: 'outwardMenu',
            files: [
                'app/eaxis/warehouse/outward/outward-menu/outward-menu.css',
                'app/eaxis/warehouse/outward/outward-menu/outward-menu.controller.js',
                'app/eaxis/warehouse/outward/outward-menu/outward-menu.directive.js'
            ]
        }, {
            name: 'outwardGeneral',
            files: [
                'app/eaxis/warehouse/outward/general/outward-general.css',
                'app/eaxis/warehouse/outward/general/outward-general.controller.js',
                'app/eaxis/warehouse/outward/general/outward-general.directive.js'
            ]
        }, {
            name: 'outwardLine',
            files: [
                'app/eaxis/warehouse/outward/outward-line/outward-line.css',
                'app/eaxis/warehouse/outward/outward-line/outward-line.controller.js',
                'app/eaxis/warehouse/outward/outward-line/outward-line.directive.js'
            ]
        }, {
            name: 'outwardPick',
            files: [
                'app/eaxis/warehouse/outward/outward-pick/outward-pick.css',
                'app/eaxis/warehouse/outward/outward-pick/outward-pick.controller.js',
                'app/eaxis/warehouse/outward/outward-pick/outward-pick.directive.js'
            ]
        }, {
            name: 'outwardDocument',
            files: [
                'app/eaxis/warehouse/outward/outward-document/outward-document.css',
                'app/eaxis/warehouse/outward/outward-document/outward-document.controller.js',
                'app/eaxis/warehouse/outward/outward-document/outward-document.directive.js'
            ]
        }, {
            name: 'outwardDispatch',
            files: [
                'app/eaxis/warehouse/outward/outward-dispatch/outward-dispatch.css',
                'app/eaxis/warehouse/outward/outward-dispatch/outward-dispatch.controller.js',
                'app/eaxis/warehouse/outward/outward-dispatch/outward-dispatch.directive.js'
            ]
        }, {
            name: 'outwardMyTask',
            files: [
                'app/eaxis/warehouse/outward/my-task/outward-my-task.controller.js',
                'app/eaxis/warehouse/outward/my-task/outward-my-task.directive.js'
            ]
        },

        // endregion
        // --------------------- Pick -----------------------
        // region
        {
            name: 'pick',
            files: [
                'app/eaxis/warehouse/pick/pick.css',
                'app/eaxis/warehouse/pick/pick.controller.js',
                'app/eaxis/warehouse/pick/pick-config.factory.js'
            ]
        }, {
            name: 'pickMenu',
            files: [
                'app/eaxis/warehouse/pick/pick-menu/pick-menu.css',
                'app/eaxis/warehouse/pick/pick-menu/pick-menu.controller.js',
                'app/eaxis/warehouse/pick/pick-menu/pick-menu.directive.js'
            ]
        }, {
            name: 'pickGeneral',
            files: [
                'app/eaxis/warehouse/pick/pick-general/pick-general.css',
                'app/eaxis/warehouse/pick/pick-general/pick-general.controller.js',
                'app/eaxis/warehouse/pick/pick-general/pick-general.directive.js'
            ]
        }, {
            name: 'pickSlip',
            files: [
                'app/eaxis/warehouse/pick/pick-slip/pick-slip.controller.js',
                'app/eaxis/warehouse/pick/pick-slip/pick-slip.directive.js'
            ]
        },
        {
            name: 'pickAllocation',
            files: [
                'app/eaxis/warehouse/pick/pick-allocation/pick-allocation.controller.js',
                'app/eaxis/warehouse/pick/pick-allocation/pick-allocation.directive.js'
            ]
        }, {
            name: 'pickDocuments',
            files: [
                'app/eaxis/warehouse/pick/pick-documents/pick-documents.controller.js',
                'app/eaxis/warehouse/pick/pick-documents/pick-documents.directive.js',
                'app/eaxis/warehouse/pick/pick-documents/pick-documents.css'
            ]
        },
        // endregion
        //-----------------------Release ------------------
        // region
        {
            name: 'whReleases',
            files: [
                'app/eaxis/warehouse/wh-releases/wh-releases.css',
                'app/eaxis/warehouse/wh-releases/wh-releases.controller.js',
                'app/eaxis/warehouse/wh-releases/wh-releases-config.factory.js',
            ]
        }, {
            name: 'whReleasesMenu',
            files: [
                'app/eaxis/warehouse/wh-releases/wh-releases-menu/wh-releases-menu.css',
                'app/eaxis/warehouse/wh-releases/wh-releases-menu/wh-releases-menu.controller.js',
                'app/eaxis/warehouse/wh-releases/wh-releases-menu/wh-releases-menu.directive.js'
            ]
        }, {
            name: 'whReleasesGeneral',
            files: [
                'app/eaxis/warehouse/wh-releases/wh-releases-general/wh-releases-general.controller.js',
                'app/eaxis/warehouse/wh-releases/wh-releases-general/wh-releases-general.directive.js',
            ]
        }, {
            name: 'whReleasesDocuments',
            files: [
                'app/eaxis/warehouse/wh-releases/wh-releases-documents/wh-releases-documents.controller.js',
                'app/eaxis/warehouse/wh-releases/wh-releases-documents/wh-releases-documents.directive.js',
            ]
        },
        {
            name: 'whReleasesPickSlip',
            files: [
                'app/eaxis/warehouse/wh-releases/wh-releases-pickslip/wh-releases-pickslip.controller.js',
                'app/eaxis/warehouse/wh-releases/wh-releases-pickslip/wh-releases-pickslip.directive.js',
            ]
        },
        // endregion
        // --------------------- Adjustments -----------------------
        // region
        {
            name: 'adjustment',
            files: [
                'app/eaxis/warehouse/adjustment/adjustment.css',
                'app/eaxis/warehouse/adjustment/adjustment.controller.js',
                'app/eaxis/warehouse/adjustment/adjustment-config.factory.js'
            ]
        }, {
            name: 'adjustmentMenu',
            files: [
                'app/eaxis/warehouse/adjustment/adjustment-menu/adjustment-menu.css',
                'app/eaxis/warehouse/adjustment/adjustment-menu/adjustment-menu.controller.js',
                'app/eaxis/warehouse/adjustment/adjustment-menu/adjustment-menu.directive.js'
            ]
        }, {
            name: 'adjustmentGeneral',
            files: [
                'app/eaxis/warehouse/adjustment/adjustment-general/adjustment-general.css',
                'app/eaxis/warehouse/adjustment/adjustment-general/adjustment-general.controller.js',
                'app/eaxis/warehouse/adjustment/adjustment-general/adjustment-general.directive.js'
            ]
        },
        // endregion
        // --------------------- Stock Transfer ------------------
        // region
        {
            name: 'stockTransfer',
            files: [
                'app/eaxis/warehouse/stock-transfer/stock-transfer.css',
                'app/eaxis/warehouse/stock-transfer/stock-transfer.controller.js',
                'app/eaxis/warehouse/stock-transfer/stock-transfer-config.factory.js'
            ]
        }, {
            name: 'stockTransferEntry',
            files: [
                'app/eaxis/warehouse/stock-transfer/stock-transfer-entry/stock-transfer-entry.css',
                'app/eaxis/warehouse/stock-transfer/stock-transfer-entry/stock-transfer-entry.controller.js',
                'app/eaxis/warehouse/stock-transfer/stock-transfer-entry/stock-transfer-entry.directive.js'
            ]
        }, {
            name: 'stockTransferMenu',
            files: [
                'app/eaxis/warehouse/stock-transfer/stock-transfer-menu/stock-transfer-menu.css',
                'app/eaxis/warehouse/stock-transfer/stock-transfer-menu/stock-transfer-menu.controller.js',
                'app/eaxis/warehouse/stock-transfer/stock-transfer-menu/stock-transfer-menu.directive.js'
            ]
        },
        // endregion
        // --------------------- Cycle Count ---------------------
        // region
        {
            name: 'cycleCount',
            files: [
                'app/eaxis/warehouse/cycle-count/cycle-count.css',
                'app/eaxis/warehouse/cycle-count/cycle-count.controller.js',
                'app/eaxis/warehouse/cycle-count/cycle-count-config.factory.js'
            ]
        }, {
            name: 'cycleCountMenu',
            files: [
                'app/eaxis/warehouse/cycle-count/cycle-count-menu/cycle-count-menu.css',
                'app/eaxis/warehouse/cycle-count/cycle-count-menu/cycle-count-menu.directive.js',
                'app/eaxis/warehouse/cycle-count/cycle-count-menu/cycle-count-menu.controller.js'
            ]
        }, {
            name: 'cycleCountGeneral',
            files: [
                'app/eaxis/warehouse/cycle-count/cycle-count-general/cycle-count-general.css',
                'app/eaxis/warehouse/cycle-count/cycle-count-general/cycle-count-general.directive.js',
                'app/eaxis/warehouse/cycle-count/cycle-count-general/cycle-count-general.controller.js'
            ]
        }, {
            name: 'cycleCountLine',
            files: [
                'app/eaxis/warehouse/cycle-count/cycle-count-line/cycle-count-line.css',
                'app/eaxis/warehouse/cycle-count/cycle-count-line/cycle-count-line.directive.js',
                'app/eaxis/warehouse/cycle-count/cycle-count-line/cycle-count-line.controller.js'
            ]
        },
        // endregion
        // --------------------- Inventory -----------------------
        // region
        {
            name: 'inventory',
            files: [
                'app/eaxis/warehouse/inventory/inventory.css',
                'app/eaxis/warehouse/inventory/inventory.controller.js',
                'app/eaxis/warehouse/inventory/inventory-config.factory.js'
            ]
        }, {
            name: 'inventoryMenu',
            files: [
                'app/eaxis/warehouse/inventory/inventory-menu/inventory-menu.controller.js',
                'app/eaxis/warehouse/inventory/inventory-menu/inventory-menu.directive.js'
            ]
        }, {
            name: 'inventoryGeneral',
            files: [
                'app/eaxis/warehouse/inventory/inventory-general/inventory-general.controller.js',
                'app/eaxis/warehouse/inventory/inventory-general/inventory-general.directive.js'
            ]
        },
        // endregion
        // ---------------------Warehouse Transport ---------------------
        // region
        {
            name: 'transport',
            files: [
                'app/eaxis/warehouse/transport/transport.css',
                'app/eaxis/warehouse/transport/transport.controller.js',
                'app/eaxis/warehouse/transport/transport-config.factory.js'
            ]
        }, {
            name: 'transportmenu',
            files: [
                'app/eaxis/warehouse/transport/transport-menu/transport-menu.css',
                'app/eaxis/warehouse/transport/transport-menu/transport-menu.controller.js',
                'app/eaxis/warehouse/transport/transport-menu/transport-menu.directive.js'
            ]
        }, {
            name: 'transportorders',
            files: [
                'app/eaxis/warehouse/transport/transport-orders/transport-orders.css',
                'app/eaxis/warehouse/transport/transport-orders/transport-orders.controller.js',
                'app/eaxis/warehouse/transport/transport-orders/transport-orders.directive.js'
            ]
        }, {
            name: 'transportgeneral',
            files: [
                'app/eaxis/warehouse/transport/general/transport-general.css',
                'app/eaxis/warehouse/transport/general/transport-general.controller.js',
                'app/eaxis/warehouse/transport/general/transport-general.directive.js'
            ]
        }, {
            name: 'transportvehicle',
            files: [
                'app/eaxis/warehouse/transport/transport-vehiclemovement/transport-vehiclemovement.css',
                'app/eaxis/warehouse/transport/transport-vehiclemovement/transport-vehiclemovement.controller.js',
                'app/eaxis/warehouse/transport/transport-vehiclemovement/transport-vehiclemovement.directive.js'
            ]
        }, {
            name: 'transportpickupanddelivery',
            files: [
                'app/eaxis/warehouse/transport/transport-pickupanddelivery/transport-pickupanddelivery.css',
                'app/eaxis/warehouse/transport/transport-pickupanddelivery/transport-pickupanddelivery.controller.js',
                'app/eaxis/warehouse/transport/transport-pickupanddelivery/transport-pickupanddelivery.directive.js'
            ]
        },
        // endregion
        // ---------------------Transport - Pickup and deliveries---------------------
        // region
        {
            name: 'PickupAndDelivery',
            files: [
                'app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery.css',
                'app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery-config.factory.js',
                'app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery.controller.js'
            ]
        }, {
            name: 'PickupAndDeliveryMenu',
            files: [
                'app/eaxis/warehouse/pickup-and-delivery/PickupandDelivery-menu/PickupandDelivery-menu.css',
                'app/eaxis/warehouse/pickup-and-delivery/PickupandDelivery-menu/PickupandDelivery-menu.directive.js',
                'app/eaxis/warehouse/pickup-and-delivery/PickupandDelivery-menu/PickupandDelivery-menu.controller.js'
            ]
        }, {
            name: 'PickupAndDeliveryGeneral',
            files: [
                'app/eaxis/warehouse/pickup-and-delivery/general/PickupandDelivery-general.css',
                'app/eaxis/warehouse/pickup-and-delivery/general/PickupandDelivery-general.directive.js',
                'app/eaxis/warehouse/pickup-and-delivery/general/PickupandDelivery-general.controller.js'
            ]
        }, {
            name: 'PickupAndDeliveryDetails',
            files: [
                'app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery-details/PickupandDelivery-details.css',
                'app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery-details/PickupandDelivery-details.directive.js',
                'app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery-details/PickupandDelivery-details.controller.js'
            ]
        },
        // endregion
        // ------------ General Modules ------------------
        // region
        {
            name: 'warehouseReports',
            files: [
                'app/eaxis/warehouse/general-module/reports/reports.controller.js',
                'app/eaxis/warehouse/general-module/reports/reports.css'
            ]
        },
        {
            name: 'generateBarcode',
            files: [
                'app/eaxis/warehouse/general-module/barcode/generate-barcode.controller.js',
                'app/eaxis/warehouse/general-module/barcode/generate-barcode.directive.js',
                'app/eaxis/warehouse/general-module/barcode/generate-barcode.css'
            ]
        },
        // endregion
        // region MyTask
        {
            name: 'AsnirUpdateLineDirective',
            files: [
                'app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line.directive.js',
                'app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line.controller.js',
                'app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line.css'
            ]
        }, {
            name: 'AsnirUpdateLineEditDirective',
            files: [
                'app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line-edit/asnir-update-line-edit.directive.js',
                'app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line-edit/asnir-update-line-edit.controller.js',
                'app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line-edit/asnir-update-line-edit.css'
            ]
        },
        // endregion

        //#region WMS Customer Portal
        {
            name: 'inwardView',
            files: [
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view.css',
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view.controller.js',
                'app/eaxis/warehouse/customer-view/inward-customer-view//inward-view-config.factory.js',
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view.directive.js',
            ]
        },

        {
            name: 'inwardViewDetail',
            files: [
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail/inward-view-detail.css',
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail/inward-view-detail.controller.js',
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail/inward-view-detail.directive.js'
            ]
        },

        {
            name: 'inwardViewDetailCustom1',
            files: [
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail-custom1/inward-view-detail-custom1.css',
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail-custom1/inward-view-detail-custom1.controller.js',
                'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail-custom1/inward-view-detail-custom1.directive.js'
            ]
        },

        {
            name: 'outwardView',
            files: [
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view.css',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view.controller.js',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-config.factory.js',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view.directive.js',
            ]
        },

        {
            name: 'outwardViewDetail',
            files: [
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail/outward-view-detail.css',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail/outward-view-detail.controller.js',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail/outward-view-detail.directive.js'
            ]
        },

        {
            name: 'outwardViewDetailCustom1',
            files: [
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail-custom1/outward-view-detail-custom1.css',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail-custom1/outward-view-detail-custom1.controller.js',
                'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail-custom1/outward-view-detail-custom1.directive.js'
            ]
        },


        {
            name: 'adjustmentView',
            files: [
                'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view.css',
                'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view.controller.js',
                'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view-config.factory.js'
            ]
        },


        {
            name: 'adjustmentViewDetail',
            files: [
                'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view-detail/adjustment-view-detail.css',
                'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view-detail/adjustment-view-detail.controller.js',
                'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view-detail/adjustment-view-detail.directive.js'
            ]
        },

        {
            name: 'stockTransferView',
            files: [
                'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view.css',
                'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view.controller.js',
                'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view-config.factory.js'
            ]
        },

        {
            name: 'stockTransferViewDetail',
            files: [
                'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view-detail/stock-transfer-view-detail.css',
                'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view-detail/stock-transfer-view-detail.controller.js',
                'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view-detail/stock-transfer-view-detail.directive.js'
            ]
        },

        {
            name: 'cycleCountView',
            files: [
                'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view.css',
                'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view.controller.js',
                'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view-config.factory.js'
            ]
        },
        {
            name: 'cycleCountViewDetail',
            files: [
                'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view-detail/cycle-count-view-detail.css',
                'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view-detail/cycle-count-view-detail.controller.js',
                'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view-detail/cycle-count-view-detail.directive.js'
            ]
        },

        {
            name: 'inwardLineDetails',
            files: [
                'app/eaxis/warehouse/customer-view/inward-line/inward-line.css',
                'app/eaxis/warehouse/customer-view/inward-line/inward-line.controller.js',
                'app/eaxis/warehouse/customer-view/inward-line/inward-line-config.factory.js',
            ]
        },
        {
            name: 'outwardLineDetails',
            files: [
                'app/eaxis/warehouse/customer-view/outward-line/outward-line.css',
                'app/eaxis/warehouse/customer-view/outward-line/outward-line.controller.js',
                'app/eaxis/warehouse/customer-view/outward-line/outward-line-config.factory.js',
            ]
        },
        {
            name: 'customerDashboard',
            files: [
                'app/eaxis/warehouse/customer-view/dashboard/customer-dashboard.css',
                'app/eaxis/warehouse/customer-view/dashboard/customer-dashboard.controller.js',
                'app/eaxis/warehouse/customer-view/dashboard/customer-dashboard-config.factory.js',

            ]
        },
        {
            name: 'customerOutwardDashboard',
            files: [
                'app/eaxis/warehouse/customer-view/dashboard/customer-dashboard.css',
                'app/eaxis/warehouse/customer-view/dashboard/outward/customer-outward-dashboard.controller.js',
            ]
        },

        {
            name: 'inventoryCustomer',
            files: [
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory.css',
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory.controller.js',
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-config.factory.js'
            ]
        }, {
            name: 'inventoryMenuCustomer',
            files: [
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-menu/inventory-menu.controller.js',
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-menu/inventory-menu.directive.js'
            ]
        }, {
            name: 'inventoryGeneralCustomer',
            files: [
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-general/inventory-general.controller.js',
                'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-general/inventory-general.directive.js'
            ]
        },
        //#endregion
        // #region Delivery Request
        {
            name: 'deliveryRequest',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-request.css',
                'app/eaxis/warehouse/delivery-request/delivery-request.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-request-config.factory.js'
            ]
        }, {
            name: 'deliveryRequestMenu',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-request-menu/delivery-request-menu.css',
                'app/eaxis/warehouse/delivery-request/delivery-request-menu/delivery-request-menu.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-request-menu/delivery-request-menu.directive.js'
            ]
        }, {
            name: 'deliveryRequestGeneral',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-request-general/delivery-request-general.css',
                'app/eaxis/warehouse/delivery-request/delivery-request-general/delivery-request-general.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-request-general/delivery-request-general.directive.js'
            ]
        }, {
            name: 'deliveryRequestLine',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-request-line/delivery-request-line.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-request-line/delivery-request-line.directive.js'
            ]
        }, {
            name: 'deliveryOrders',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-orders/delivery-orders.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-orders/delivery-orders.directive.js'
            ]
        }, {
            name: 'deliveryDetails',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-details/delivery-details.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-details/delivery-details.directive.js'
            ]
        }, {
            name: 'deliveryMyTask',
            files: [
                'app/eaxis/warehouse/delivery-request/my-task/delivery-my-task.controller.js',
                'app/eaxis/warehouse/delivery-request/my-task/delivery-my-task.directive.js'
            ]
        }, {
            name: 'deliveryDocument',
            files: [
                'app/eaxis/warehouse/delivery-request/delivery-document/delivery-document.controller.js',
                'app/eaxis/warehouse/delivery-request/delivery-document/delivery-document.directive.js'
            ]
        },
        // #endregion
        // #region pickup request
        {
            name: 'pickupRequest',
            files: [
                'app/eaxis/warehouse/pickup-request/pickup-request.css',
                'app/eaxis/warehouse/pickup-request/pickup-request.controller.js',
                'app/eaxis/warehouse/pickup-request/pickup-request-config.factory.js'
            ]
        }, {
            name: 'pickupRequestMenu',
            files: [
                'app/eaxis/warehouse/pickup-request/pickup-request-menu/pickup-request-menu.css',
                'app/eaxis/warehouse/pickup-request/pickup-request-menu/pickup-request-menu.controller.js',
                'app/eaxis/warehouse/pickup-request/pickup-request-menu/pickup-request-menu.directive.js'
            ]
        }, {
            name: 'pickupRequestGeneral',
            files: [
                'app/eaxis/warehouse/pickup-request/pickup-request-general/pickup-request-general.css',
                'app/eaxis/warehouse/pickup-request/pickup-request-general/pickup-request-general.controller.js',
                'app/eaxis/warehouse/pickup-request/pickup-request-general/pickup-request-general.directive.js'
            ]
        }, {
            name: 'pickupRequestLine',
            files: [
                'app/eaxis/warehouse/pickup-request/pickup-request-line/pickup-request-line.controller.js',
                'app/eaxis/warehouse/pickup-request/pickup-request-line/pickup-request-line.directive.js'
            ]
        }, {
            name: 'pickupOrders',
            files: [
                'app/eaxis/warehouse/pickup-request/pickup-orders/pickup-orders.controller.js',
                'app/eaxis/warehouse/pickup-request/pickup-orders/pickup-orders.directive.js'
            ]
        }, {
            name: 'pickupDetails',
            files: [
                'app/eaxis/warehouse/pickup-request/pickup-details/pickup-details.controller.js',
                'app/eaxis/warehouse/pickup-request/pickup-details/pickup-details.directive.js'
            ]
        }, {
            name: 'pickupMyTask',
            files: [
                'app/eaxis/warehouse/pickup-request/my-task/pickup-my-task.controller.js',
                'app/eaxis/warehouse/pickup-request/my-task/pickup-my-task.directive.js'
            ]
        },
        // endregion
        // --------------------- Ownership Transfer ------------------
        // region
        {
            name: 'ownershipTransfer',
            files: [
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer.css',
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer.controller.js',
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer-config.factory.js'
            ]
        }, {
            name: 'ownershipTransferGeneral',
            files: [
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer-general/ownership-transfer-general.css',
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer-general/ownership-transfer-general.controller.js',
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer-general/ownership-transfer-general.directive.js'
            ]
        }, {
            name: 'ownershipTransferMenu',
            files: [
                // 'app/eaxis/warehouse/ownership-transfer/ownership-transfer-menu/ownership-transfer-menu.css',
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer-menu/ownership-transfer-menu.controller.js',
                'app/eaxis/warehouse/ownership-transfer/ownership-transfer-menu/ownership-transfer-menu.directive.js'
            ]
        },
        // endregion

        //#region WMS Common Dashboard
        {
            name: 'commonDashboard',
            files: [
                'app/eaxis/warehouse/common-dashboard/dashboard.css',
                'app/eaxis/warehouse/common-dashboard/dashboard.controller.js',
            ]
        },
        //#endregion
        //#region WMS Dynamic Dashboard
        {
            name: 'dynamicDashboard',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/dynamic-dashboard.css',
                'app/eaxis/warehouse/dynamic-dashboard/dynamic-dashboard.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/dynamic-dashboard.directive.js',
                'app/eaxis/warehouse/dynamic-dashboard/dynamic-dashboard-config.factory.js'
            ]
        }, {
            name: 'PreviewDashboard',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/preview-dashboard/preview-dashboard.controller.js',
                // 'app/eaxis/warehouse/dynamic-dashboard/asn-received-status/asn-received-status.directive.js',
            ]
        }, {
            name: 'AsnReceivedWithStatus',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/asn-received-status/asn-received-status.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/asn-received-status/asn-received-status.directive.js',
            ]
        }, {
            name: 'AsnTrend',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/asn-trend/asn-trend.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/asn-trend/asn-trend.directive.js',
            ]
        }, {
            name: 'OpenSO',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/open-so/open-so.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/open-so/open-so.directive.js',
            ]
        }, {
            name: 'PickWithShortfall',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/pick-with-shortfall/pick-with-shortfall.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/pick-with-shortfall/pick-with-shortfall.directive.js',
            ]
        }, {
            name: 'PutawayStatus',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/putaway-status/putaway-status.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/putaway-status/putaway-status.directive.js',
            ]
        }, {
            name: 'GrnStatus',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/grn-status/grn-status.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/grn-status/grn-status.directive.js',
            ]
        }, {
            name: 'CycleCountJobs',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/cycle-count-jobs/cycle-count-jobs.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/cycle-count-jobs/cycle-count-jobs.directive.js',
            ]
        }, {
            name: 'Notification',
            files: [
                'app/eaxis/warehouse/dynamic-dashboard/notification/notification.css',
                'app/eaxis/warehouse/dynamic-dashboard/notification/notification.controller.js',
                'app/eaxis/warehouse/dynamic-dashboard/notification/notification.directive.js',
            ]
        },
        //#endregion
        // #region Batch Upload
        {
            name: 'batchUpload',
            files: [
                'app/eaxis/warehouse/batch-upload-process/process.controller.js',
                'app/eaxis/warehouse/batch-upload-process/process.config.js',
            ]
        },
        {
            name: 'batchUploadDetails',
            files: [
                'app/eaxis/warehouse/batch-upload-process/details/details.directive.js',
                'app/eaxis/warehouse/batch-upload-process/details/details.controller.js',
            ]
        },
        //#endregion
        // #region Raise CSR
        {
            name: 'RaiseCSR',
            files: [
                "app/eaxis/warehouse/raise-csr/raise-csr.controller.js",
                "app/eaxis/warehouse/raise-csr/raise-csr.css"
            ]
        }, {
            name: 'RaiseCsrGeneral',
            files: [
                "app/eaxis/warehouse/raise-csr/raise-csr-general/raise-csr-general.controller.js",
                "app/eaxis/warehouse/raise-csr/raise-csr-general/raise-csr-general.directive.js",
                "app/eaxis/warehouse/raise-csr/raise-csr-general/raise-csr-general.css"
            ]
        },
        // #endregion
        // #region
        {
            name: 'pendingPickup',
            files: [
                'app/eaxis/warehouse/pending-pickup/pending-pickup.controller.js',
            ]
        }, {
            name: 'pickupLine',
            files: [
                'app/eaxis/warehouse/pickup-line/pickup-line.controller.js',
            ]
        }, {
            name: 'pendingPickupToolbar',
            files: [
                'app/eaxis/warehouse/pending-pickup-toolbar/pending-pickup-toolbar.controller.js',
                'app/eaxis/warehouse/pending-pickup-toolbar/pending-pickup-toolbar.directive.js',
            ]
        }, {
            name: 'deliveryLine',
            files: [
                'app/eaxis/warehouse/delivery-line/delivery-line.controller.js',
            ]
        }, {
            name: 'damagedSKU',
            files: [
                'app/eaxis/warehouse/track-damaged-sku/track-damaged-sku.controller.js',
            ]
        }, {
            name: 'damagedSkuToolbar',
            files: [
                'app/eaxis/warehouse/track-damaged-sku-toolbar/track-damaged-sku-toolbar.controller.js',
                'app/eaxis/warehouse/track-damaged-sku-toolbar/track-damaged-sku-toolbar.directive.js',
                'app/eaxis/warehouse/track-damaged-sku-toolbar/track-damaged-sku-toolbar.css',
            ]
        }, {
            name: 'deliveryRequestToolbar',
            files: [
                'app/eaxis/warehouse/delivery-request-toolbar/delivery-request-toolbar.controller.js',
                'app/eaxis/warehouse/delivery-request-toolbar/delivery-request-toolbar.directive.js',
            ]
        },
        // #endregion
        // #region my-task
        {
            name: 'ConfirmArrivalDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-arrival/confirm-arrival.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-arrival/confirm-arrival.directive.js"
            ]
        }, {
            name: 'ReceiveItemsDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/receive-items/receive-items.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/receive-items/receive-items.directive.js"
            ]
        }, {
            name: 'AllocateLocationDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/allocate-location/allocate-location.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/allocate-location/allocate-location.directive.js"
            ]
        }, {
            name: 'StartPutawayDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/start-putaway/start-putaway.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/start-putaway/start-putaway.directive.js"
            ]
        }, {
            name: 'CompletePutawayDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/complete-putaway/complete-putaway.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/complete-putaway/complete-putaway.directive.js"
            ]
        }, {
            name: 'ConfirmInwardDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-inward/confirm-inward.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-inward/confirm-inward.directive.js"
            ]
        }, {
            name: 'AllocateStockDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/allocate-stock/allocate-stock.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/allocate-stock/allocate-stock.directive.js"
            ]
        }, {
            name: 'AcknowledgeCsrDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-csr/acknowledge-csr.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-csr/acknowledge-csr.directive.js"
            ]
        }, {
            name: 'CreateDeliveryChallanDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/create-delivery-challan/create-delivery-challan.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/create-delivery-challan/create-delivery-challan.directive.js"
            ]
        }, {
            name: 'ArrangeMaterialDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/arrange-material/arrange-material.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/arrange-material/arrange-material.directive.js"
            ]
        }, {
            name: 'DeliverMaterialDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/deliver-material/deliver-material.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/deliver-material/deliver-material.directive.js"
            ]
        }, {
            name: 'PodReturnOutDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/pod-return-out/pod-return-out.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/pod-return-out/pod-return-out.directive.js"
            ]
        }, {
            name: 'ConfirmDeliveryDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-delivery/confirm-delivery.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-delivery/confirm-delivery.directive.js"
            ]
        }, {
            name: 'TransferMaterialDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/transfer-material/transfer-material.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/transfer-material/transfer-material.directive.js"
            ]
        }, {
            name: 'ReceiveMaterialDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/receive-material/receive-material.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/receive-material/receive-material.directive.js"
            ]
        }, {
            name: 'CreatePickupChallanDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/create-pickup-challan/create-pickup-challan.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/create-pickup-challan/create-pickup-challan.directive.js"
            ]
        }, {
            name: 'CollectMaterialDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/collect-material/collect-material.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/collect-material/collect-material.directive.js"
            ]
        }, {
            name: 'GetSignatureDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/get-signature/get-signature.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/get-signature/get-signature.directive.js"
            ]
        }, {
            name: 'AcknowledgePickupRequestDirective',
            files: [
                "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-pickup-request/acknowledge-pickup-request.controller.js",
                "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-pickup-request/acknowledge-pickup-request.directive.js"
            ]
        },
        // #endregion

        // #region inventory-view
        {
            name: 'inventoryView',
            files: [
                'app/eaxis/warehouse/customer-view/inventory-customer-system-view/inventory-customer-system-view.css',
                'app/eaxis/warehouse/customer-view/inventory-customer-system-view/inventory-customer-system-view.controller.js'
            ]
        },
        // #endregion
        // Track delivery
        {
            name: 'TrackDelivery',
            files: [
                'app/eaxis/warehouse/customer-view/track-delivery/track-delivery.controller.js'
            ]
        },
        //#region Finance
        {
            name: "Finance",
            files: [
                "app/eaxis/finance/finance-job/finance-config.factory.js"
            ]
        }, {
            name: "FinanceJobList",
            files: [
                "app/eaxis/finance/finance-job/finance-job-list/finance-job-list.controller.js",
                "app/eaxis/finance/finance-job/finance-job-list/finance-job-list.css",
            ]
        }, {
            name: "FinanceJobGeneral",
            files: [
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.directive.js",
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.controller.js",
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general-popup.controller.js",
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.css"
            ]
        }, {
            name: "FinanceJobMenu",
            files: [
                "app/eaxis/finance/finance-job/finance-job-menu/finance-job-menu.directive.js",
                "app/eaxis/finance/finance-job/finance-job-menu/finance-job-menu.controller.js",
            ]
        },
        //#endregion

        //#region Consolidated Document
        {
            name: 'consolidatedDocument',
            files: [
                'app/eaxis/warehouse/consolidated-document/consolidated-document.controller.js',
            ]
        },
            //#endregion
        ]
    };

    angular
        .module("Application")
        .constant("WAREHOUSE_CONSTANT", WAREHOUSE_CONSTANT);
})();
