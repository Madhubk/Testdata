(function () {
    'use strict';

    var FREIGHT_CONSTANT = {
        ocLazyLoadModules: [{
                name: 'Freight',
                files: [
                    'app/eaxis/freight/freight.css',
                    'app/eaxis/freight/freight.controller.js'
                ]
            },
            // region Dashboard
            {
                name: 'FreightDashboard',
                files: [
                    'app/eaxis/freight/dashboard/dashboard.css',
                    'app/eaxis/freight/dashboard/dashboard.controller.js'
                ]
            }, {
                name: 'BuyerDashboard',
                files: [
                    'app/eaxis/freight/dashboard/tabs/buyer/buyer-dashboard.css',
                    'app/eaxis/freight/dashboard/tabs/buyer/buyer-dashboard.controller.js'
                ]
            }, {
                name: 'SupplierDashboard',
                files: [
                    'app/eaxis/freight/dashboard/tabs/supplier/supplier-dashboard.css',
                    'app/eaxis/freight/dashboard/tabs/supplier/supplier-dashboard.controller.js'
                ]
            }, {
                name: 'ExporterDashboard',
                files: [
                    'app/eaxis/freight/dashboard/tabs/exporter/exporter-dashboard.css',
                    'app/eaxis/freight/dashboard/tabs/exporter/exporter-dashboard.controller.js'
                ]
            }, {
                name: 'ImporterDashboard',
                files: [
                    'app/eaxis/freight/dashboard/tabs/importer/importer-dashboard.css',
                    'app/eaxis/freight/dashboard/tabs/importer/importer-dashboard.controller.js'
                ]
            },
            // endregion
            // region Shipment
            {
                name: 'shipment',
                files: [
                    'app/eaxis/freight/shipment/shipment.css',
                    'app/eaxis/freight/shipment/shipment.controller.js',
                    'app/eaxis/freight/shipment/shipment-config.factory.js'
                ]
            }, {
                name: 'shipmentMenu',
                files: [
                    'app/eaxis/freight/shipment/shipment-menu/shipment-menu.css',
                    'app/eaxis/freight/shipment/shipment-menu/shipment-menu.directive.js',
                    'app/eaxis/freight/shipment/shipment-menu/shipment-menu.controller.js'
                ]
            }, {
                name: 'shipmentGeneral',
                files: [
                    'app/eaxis/freight/shipment/general/shipment-general.css',
                    'app/eaxis/freight/shipment/general/shipment-general.directive.js',
                    'app/eaxis/freight/shipment/general/shipment-general.controller.js',
                    'app/eaxis/freight/shipment/general/tabs/packing-modal.controller.js'
                ]
            }, {
                name: 'shipmentOrder',
                files: [
                    'app/eaxis/freight/shipment/shipment-order/shipment-order.css',
                    'app/eaxis/freight/shipment/shipment-order/shipment-order.directive.js',
                    'app/eaxis/freight/shipment/shipment-order/shipment-order.controller.js'
                ]
            }, {
                name: 'shipmentConsoleAndPacking',
                files: [
                    'app/eaxis/freight/shipment/console-and-packing/shipment-console-and-packing.css',
                    'app/eaxis/freight/shipment/console-and-packing/shipment-console-and-packing.directive.js',
                    'app/eaxis/freight/shipment/console-and-packing/shipment-console-and-packing.controller.js',
                    'app/eaxis/freight/shipment/console-and-packing/tabs/consol-packing-modal.controller.js'
                ]
            }, {
                name: 'shipmentServiceAndReference',
                files: [
                    'app/eaxis/freight/shipment/service-and-reference/shipment-service-and-reference.css',
                    'app/eaxis/freight/shipment/service-and-reference/shipment-service-and-reference.directive.js',
                    'app/eaxis/freight/shipment/service-and-reference/shipment-service-and-reference.controller.js'
                ]
            }, {
                name: 'routing',
                files: [
                    'app/eaxis/freight/shipment/routing/routing.css',
                    'app/eaxis/freight/shipment/routing/routing.directive.js',
                    'app/eaxis/freight/shipment/routing/routing.controller.js'
                ]
            }, {
                name: 'relatedShipment',
                files: [
                    'app/eaxis/freight/shipment/related-shipment/related-shipment.css',
                    'app/eaxis/freight/shipment/related-shipment/related-shipment.directive.js',
                    'app/eaxis/freight/shipment/related-shipment/related-shipment.controller.js'
                ]
            }, {
                name: 'shipmentPickupAndDelivery',
                files: [
                    'app/eaxis/freight/shipment/pickup-and-delivery/pickup-and-delivery.css',
                    'app/eaxis/freight/shipment/pickup-and-delivery/pickup-and-delivery.directive.js',
                    'app/eaxis/freight/shipment/pickup-and-delivery/pickup-and-delivery.controller.js'
                ]
            }, {
                name: 'shipmentBilling',
                files: [
                    'app/eaxis/freight/shipment/billing/shipment-billing.css',
                    'app/eaxis/freight/shipment/billing/shipment-billing.directive.js',
                    'app/eaxis/freight/shipment/billing/shipment-billing.controller.js'
                ]
            }, {
                name: 'shipmentDocuments',
                files: [
                    'app/eaxis/freight/shipment/documents/shipment-documents.css',
                    'app/eaxis/freight/shipment/documents/shipment-documents.directive.js',
                    'app/eaxis/freight/shipment/documents/shipment-documents.controller.js'
                ]
            }, {
                name: 'shipmentDynamicTable',
                files: [
                    'app/eaxis/freight/shipment/shipment-dynamic-table/shipment-dynamic-table.css',
                    'app/eaxis/freight/shipment/shipment-dynamic-table/shipment-dynamic-table.directive.js',
                    'app/eaxis/freight/shipment/shipment-dynamic-table/shipment-dynamic-table.controller.js'
                ]
            }, {
                name: 'shipmentMyTask',
                files: [
                    'app/eaxis/freight/shipment/my-task/shipment-my-task.css',
                    'app/eaxis/freight/shipment/my-task/shipment-my-task.directive.js',
                    'app/eaxis/freight/shipment/my-task/shipment-my-task.controller.js'
                ]
            }, {
                name: 'ShpGeneralFieldsDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-general-details/shipment-general-details.controller.js',
                    'app/eaxis/freight/shipment/shipment-general-details/shipment-general-details.directive.js',
                    'app/eaxis/freight/shipment/shipment-general-details/shipment-general-details.css',
                ]
            }, {
                name: 'PackingEditableGrid',
                files: [
                    'app/eaxis/freight/shipment/packing-editable-grid/packing/packing.controller.js',
                    'app/eaxis/freight/shipment/packing-editable-grid/packing-editable-grid.directive.js',
                    'app/eaxis/freight/shipment/packing-editable-grid/packing-editable-grid.css'
                ]
            }, {
                name: 'ShipmentDetailsDirective',
                files: [
                    'app/eaxis/freight/shipment/Shipment-details/Shipment-details.controller.js',
                    'app/eaxis/freight/shipment/Shipment-details/Shipment-details.directive.js',
                    'app/eaxis/freight/shipment/Shipment-details/Shipment-details.css'
                ]
            }, {
                name: 'RoutingGridDirective',
                files: [
                    'app/eaxis/freight/shipment/routing-grid/routing-grid.css',
                    'app/eaxis/freight/shipment/routing-grid/routing-grid.directive.js',
                    'app/eaxis/freight/shipment/routing-grid/routing-grid.controller.js',
                    'app/eaxis/freight/shipment/routing-grid/routing-grid-popup.controller.js'
                ]
            }, {
                name: 'PackingGridDirective',
                files: [
                    'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.css',
                    'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.directive.js',
                    'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.controller.js',
                    'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid-popup.controller.js'
                ]
            }, {
                name: 'ShipmentActivityDetailsDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-activity-details/shipment-activity-details.css',
                    'app/eaxis/freight/shipment/shipment-activity-details/shipment-activity-details.directive.js',
                    'app/eaxis/freight/shipment/shipment-activity-details/shipment-activity-details.controller.js'
                ]
            }, {
                name: 'ShipmentHouseBillDetailsDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-housebill-details/shipment-housebill.css',
                    'app/eaxis/freight/shipment/shipment-housebill-details/shipment-housebill.directive.js',
                    'app/eaxis/freight/shipment/shipment-housebill-details/shipment-housebill.controller.js'
                ]
            }, {
                name: 'VerifyPreAlertDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert/verify-prealert.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert.css'
                ]
            }, {
                name: 'VerifyPreAlertEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert/verify-prealert-edit/verify-prealert-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert-edit.directive.js',
                ]
            }, {
                name: 'FollowUpBondDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond/followup-bond.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond.css'
                ]
            }, {
                name: 'FollowUpBondEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond/followup-bond-edit/followup-bond-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond-edit.directive.js',
                ]
            }, {
                name: 'ShipmentActiveCustomToolBar',
                files: [
                    'app/eaxis/freight/shipment/shipment-tool-bar/shipment-activation-directive/shipment-activation.css',
                    'app/eaxis/freight/shipment/shipment-tool-bar/shipment-activation-directive/shipment-activation.controller.js',
                    'app/eaxis/freight/shipment/shipment-tool-bar/shipment-activation-directive/shipment-activation.directive.js',
                ]
            }, {
                name: 'ShipmentCustomToolBar',
                files: [
                    'app/eaxis/freight/shipment/shipment-tool-bar/shipment-tool-bar.css',
                    'app/eaxis/freight/shipment/shipment-tool-bar/shipment-tool-bar.directive.js',
                    'app/eaxis/freight/shipment/shipment-tool-bar/shipment-tool-bar.controller.js'
                ]
            }, {
                name: 'shipmentAction',
                files: [
                    'app/eaxis/freight/shipment/shipment-action/shipment-action.css',
                    'app/eaxis/freight/shipment/shipment-action/shipment-action.directive.js',
                    'app/eaxis/freight/shipment/shipment-action/shipment-action.controller.js'
                ]
            }, {
                name: 'ShipmentSLIUpload',
                files: [
                    'app/eaxis/freight/shipment/sli-upload/sli-upload.css',
                    'app/eaxis/freight/shipment/sli-upload/sli-upload.controller.js',
                    'app/eaxis/freight/shipment/sli-upload/sli-upload-config.factory.js',
                    'app/eaxis/freight/shipment/sli-upload/sli-upload-directive.js'
                ]
            }, {
                name: 'ShipmentSLIUploadDirective',
                files: [
                    'app/eaxis/freight/shipment/sli-upload/sli-upload-directive/sli-upload-directive.css',
                    'app/eaxis/freight/shipment/sli-upload/sli-upload-directive/sli-upload-directive.js',
                    'app/eaxis/freight/shipment/sli-upload/sli-upload-directive/sli-upload-directive.controller.js'
                ]
            }, {
                name: 'ConsolGrid',
                files: [
                    'app/eaxis/freight/shipment/console-and-packing/consol-grid/consol-grid.directive.js',
                    'app/eaxis/freight/shipment/console-and-packing/consol-grid/consol-grid.controller.js',
                ]
            }, {
                name: 'ContainerGrid',
                files: [
                    'app/eaxis/freight/shipment/console-and-packing/container-grid/container-grid.directive.js',
                    'app/eaxis/freight/shipment/console-and-packing/container-grid/container-grid.controller.js',
                ]
            }, {
                name: 'shipmentNewOrder',
                files: [
                    'app/eaxis/freight/shipment/shipment-new-order/shipment-new-order.css',
                    'app/eaxis/freight/shipment/shipment-new-order/shipment-new-order.controller.js'
                ]
            },  {
                name: 'GateInGridDirective',
                files: [
                    'app/eaxis/freight/shipment/gate-in-grid/gate-in-grid.css',
                    'app/eaxis/freight/shipment/gate-in-grid/gate-in-grid.directive.js',
                    'app/eaxis/freight/shipment/gate-in-grid/gate-in-grid.controller.js'
                ]
            },
            // endregion
            // region Booking
            {
                name: 'Booking',
                files: [
                    'app/eaxis/freight/booking/booking.css',
                    'app/eaxis/freight/booking/booking.controller.js',
                    'app/eaxis/freight/booking/booking-config.factory.js'
                ]
            }, {
                name: 'BookingMenu',
                files: [
                    'app/eaxis/freight/booking/booking-menu/booking-menu.css',
                    'app/eaxis/freight/booking/booking-menu/booking-menu.directive.js',
                    'app/eaxis/freight/booking/booking-menu/booking-menu.controller.js'
                ]
            }, {
                name: 'BookingDirective',
                files: [
                    'app/eaxis/freight/booking/booking-directive/booking-directive.css',
                    'app/eaxis/freight/booking/booking-directive/booking-directive.js',
                    'app/eaxis/freight/booking/booking-directive/booking-directive.controller.js'
                ]
            }, {
                name: 'BookingOrder',
                files: [
                    'app/eaxis/freight/booking/booking-order/booking-order.css',
                    'app/eaxis/freight/booking/booking-order/booking-order.directive.js',
                    'app/eaxis/freight/booking/booking-order/booking-order.controller.js',
                    'app/eaxis/freight/booking/booking-order/orderItem-modal.controller.js'
                ]
            }, {
                name: 'BookingServiceAndReference',
                files: [
                    'app/eaxis/freight/booking/service-and-reference/booking-service-and-reference.css',
                    'app/eaxis/freight/booking/service-and-reference/booking-service-and-reference.directive.js',
                    'app/eaxis/freight/booking/service-and-reference/booking-service-and-reference.controller.js'
                ]
            }, {
                name: 'BookingPickupAndDelivery',
                files: [
                    'app/eaxis/freight/booking/pickup-and-delivery/pickup-and-delivery.css',
                    'app/eaxis/freight/booking/pickup-and-delivery/pickup-and-delivery.directive.js',
                    'app/eaxis/freight/booking/pickup-and-delivery/pickup-and-delivery.controller.js'
                ]
            }, {
                name: 'BookingPlanning',
                files: [
                    'app/eaxis/freight/booking/booking-planning/booking-planning.css',
                    'app/eaxis/freight/booking/booking-planning/booking-planning.js',
                    'app/eaxis/freight/booking/booking-planning/booking-planning.controller.js'
                ]
            }, {
                name: 'BookingAction',
                files: [
                    'app/eaxis/freight/booking/booking-action/booking-action.directive.js',
                    'app/eaxis/freight/booking/booking-action/booking-action.controller.js',
                    'app/eaxis/freight/booking/booking-action/booking-action.css'
                ]
            },
            // endregion
            // region Booking Branch
            {
                name: 'BookingBranch',
                files: [
                    'app/eaxis/freight/booking-branch/booking-branch.css',
                    'app/eaxis/freight/booking-branch/booking-branch.controller.js',
                    'app/eaxis/freight/booking-branch/booking-branch-config.factory.js'
                ]
            }, {
                name: 'BookingBranchDirective',
                files: [
                    'app/eaxis/freight/booking-branch/booking-branch-directive/booking-branch-directive.css',
                    'app/eaxis/freight/booking-branch/booking-branch-directive/booking-branch-directive.js',
                    'app/eaxis/freight/booking-branch/booking-branch-directive/booking-branch-directive.controller.js',
                    'app/eaxis/freight/booking-branch/booking-branch-directive/orderline-popup.controller.js'
                ]
            }, {
                name: 'BookingVesselPlanning',
                files: [
                    'app/eaxis/freight/booking-branch/booking-vessel-modal/booking-vessel-modal.css',
                    'app/eaxis/freight/booking-branch/booking-vessel-modal/booking-vessel-modal.controller.js'
                ]
            },
            // endregion
            // region Booking Supplier
            {
                name: 'BookingSupplier',
                files: [
                    'app/eaxis/freight/booking-supplier/booking-supplier.css',
                    'app/eaxis/freight/booking-supplier/booking-supplier.controller.js',
                    'app/eaxis/freight/booking-supplier/booking-supplier-config.factory.js'
                ]
            }, {
                name: 'BookingSupplierDirective',
                files: [
                    'app/eaxis/freight/booking-supplier/booking-supplier-directive/booking-supplier-directive.css',
                    'app/eaxis/freight/booking-supplier/booking-supplier-directive/booking-supplier-directive.js',
                    'app/eaxis/freight/booking-supplier/booking-supplier-directive/booking-supplier-directive.controller.js',
                    'app/eaxis/freight/booking-supplier/booking-supplier-directive/orderline-popup.controller.js'
                ]
            },
            // endregion
            // region Consolidation
            {
                name: 'consolidation',
                files: [
                    'app/eaxis/freight/consolidation/consolidation.css',
                    'app/eaxis/freight/consolidation/consolidation-controller.js',
                    'app/eaxis/freight/consolidation/consolidation-config.factory.js'
                ]
            }, {
                name: 'consolGeneral',
                files: [
                    'app/eaxis/freight/consolidation/general/consol-general.directive.js',
                    'app/eaxis/freight/consolidation/general/consol-general.controller.js',
                    'app/eaxis/freight/consolidation/general/consol-general.css'
                ]
            }, {
                name: 'QuickView',
                files: [
                    'app/eaxis/freight/consolidation/quickview/quickview.directive.js',
                    'app/eaxis/freight/consolidation/quickview/quickview.controller.js'
                ]
            }, {
                name: 'consolContainer',
                files: [
                    'app/eaxis/freight/consolidation/container/consol-container.directive.js',
                    'app/eaxis/freight/consolidation/container/consol-container.controller.js'
                ]
            }, {
                name: 'ContainerDirectives',
                files: [
                    'app/eaxis/freight/consolidation/container/container-form/container-form.css',
                    'app/eaxis/freight/consolidation/container/container-form/container-form.directive.js',
                    'app/eaxis/freight/consolidation/container/container-form/container-form.controller.js'
                ]
            }, {
                name: 'consolMenu',
                files: [
                    'app/eaxis/freight/consolidation/consol-menu/consol-menu.css',
                    'app/eaxis/freight/consolidation/consol-menu/consol-menu.directive.js',
                    'app/eaxis/freight/consolidation/consol-menu/consol-menu.controller.js'
                ]
            }, {
                name: 'consolContainerPopup',
                files: [
                    'app/eaxis/freight/consolidation/container/container-modal/container-modal.css',
                    'app/eaxis/freight/consolidation/container/container-modal/container-modal.controller.js'
                ]
            }, {
                name: 'ConsolShipment',
                files: [
                    'app/eaxis/freight/consolidation/consol-shipment/consol-shipment.css',
                    'app/eaxis/freight/consolidation/consol-shipment/consol-shipment.directive.js',
                    'app/eaxis/freight/consolidation/consol-shipment/consol-shipment.controller.js'
                ]
            }, {
                name: 'ConsolArrivalDeparture',
                files: [
                    'app/eaxis/freight/consolidation/arrival-departure/arrival-departure.css',
                    'app/eaxis/freight/consolidation/arrival-departure/arrival-departure.directive.js',
                    'app/eaxis/freight/consolidation/arrival-departure/arrival-departure.controller.js'
                ]
            }, {
                name: 'ConsolPacking',
                files: [
                    'app/eaxis/freight/consolidation/consol-packing/consol-packing.css',
                    'app/eaxis/freight/consolidation/consol-packing/consol-packing.directive.js',
                    'app/eaxis/freight/consolidation/consol-packing/consol-packing.controller.js'
                ]
            }, {
                name: 'consolidationMenu',
                files: [
                    'app/eaxis/freight/consolidation/consolidation-menu/consolidation-menu.css',
                    'app/eaxis/freight/consolidation/consolidation-menu/consolidation-menu.directive.js',
                    'app/eaxis/freight/consolidation/consolidation-menu/consolidation-menu.controller.js'
                ]
            }, {
                name: 'consolMyTask',
                files: [
                    'app/eaxis/freight/consolidation/my-task/consol-my-task.css',
                    'app/eaxis/freight/consolidation/my-task/consol-my-task.directive.js',
                    'app/eaxis/freight/consolidation/my-task/consol-my-task.controller.js'
                ]
            }, {
                name: 'ContainerEditableGridDirective',
                files: [
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container.controller.js',
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-edit.controller.js',
                    'app/eaxis/freight/consolidation/container-editable-grid/container.directive.js',
                    'app/eaxis/freight/consolidation/container-editable-grid/container.css',
                    //container Form
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-form/container-grid-form.css',
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-form/container-grid-form.directive.js',
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-form/container-grid-form.controller.js',
                    //container-modal
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-modal/container-grid-modal.css',
                    'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-modal/container-grid-modal.controller.js',
                ]
            }, {
                name: 'ConsolActivityDetailsDirective',
                files: [
                    'app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.css',
                    'app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.directive.js',
                    'app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.controller.js'
                ]
            }, {
                name: 'IGMFilingDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing/igm-filing.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-acknowledge/igm-acknowledge.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing.css'
                ]
            }, {
                name: 'IGMFilingEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing/igm-filing-edit/igm-filing-edit.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-acknowledge/igm-acknowledge-edit/igm-acknowledge-edit.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing-edit.directive.js'
                ]
            }, {
                name: 'LinkedShipment',
                files: [
                    'app/eaxis/freight/consolidation/linked-shipment/linked-shipment.css',
                    'app/eaxis/freight/consolidation/linked-shipment/linked-shipment.directive.js',
                    'app/eaxis/freight/consolidation/linked-shipment/linked-shipment.controller.js'
                ]
            }, {
                name: 'consolNewshipment',
                files: [
                    'app/eaxis/freight/consolidation/consol-new-shipment/consol-new-shipment.css',
                    'app/eaxis/freight/consolidation/consol-new-shipment/consol-new-shipment.controller.js'
                ]
            }, {
                name: 'ConsolCreationEvent',
                files: [
                    'app/eaxis/freight/consolidation/consol-event/consol-creation-event/consol-event.directive.js',
                    'app/eaxis/freight/consolidation/consol-event/consol-creation-event/consol-event.controller.js',
                    'app/eaxis/freight/consolidation/consol-event/consol-creation-event/consol-event.css',
                ]
            },
            // endregion
            // region Container
            {
                name: 'containerFiles',
                files: [
                    'app/eaxis/freight/container/container.css',
                    'app/eaxis/freight/container/container.controller.js',
                    'app/eaxis/freight/container/container-config.factory.js'
                ]
            }, {
                name: 'containerFilesDirective',
                files: [
                    'app/eaxis/freight/container/container-directive/container-directive.css',
                    'app/eaxis/freight/container/container-directive/container-directive.js',
                    'app/eaxis/freight/container/container-directive/container-directive.controller.js'
                ]
            }, {
                name: 'ContainerDetails',
                files: [
                    'app/eaxis/freight/container/container-details/container-details.controller.js',
                    'app/eaxis/freight/container/container-details/container-details.directive.js',
                    'app/eaxis/freight/container/container-details/container-details.css'
                ]
            },
            // endregion
            // region SLI Upload
            {
                name: 'SLIUpload',
                files: [
                    'app/eaxis/freight/sli-upload/sli-upload.css',
                    'app/eaxis/freight/sli-upload/sli-upload.controller.js',
                    'app/eaxis/freight/sli-upload/sli-upload-config.factory.js'
                ]
            }, {
                name: 'SLIUploadDirective',
                files: [
                    'app/eaxis/freight/sli-upload/sli-upload-directive/sli-upload-directive.css',
                    'app/eaxis/freight/sli-upload/sli-upload-directive/sli-upload-directive.js',
                    'app/eaxis/freight/sli-upload/sli-upload-directive/sli-upload-directive.controller.js'
                ]
            },
            // endregion
            // region MyTask ===============================
            // Shipment
            {
                name: 'TaskEffortDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-effort/tsk-effort.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-effort/tsk-effort.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-effort/tsk-effort.css'
                ]
            }, {
                name: 'TaskEffortEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.css'
                ]
            }, {
                name: 'TaskCreateDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-create/tsk-create.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-create/tsk-create.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-create/tsk-create.css'
                ]
            }, {
                name: 'TaskCreateEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-create/tsk-create-edit/tsk-create-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-create/tsk-create-edit/tsk-create-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tsk-create/tsk-create-edit/tsk-create-edit.css'
                ]
            }, {
                name: 'SupplementaryTaxInvDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/supp-tax-inv.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/revcost-revenue-upl/revcost-revenue-upl.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/raise-supp-tax-inv/raise-supp-tax-inv-controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/verify-supp-tax-inv/verify-supp-tax-inv.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/amend-supp-tax-inv/amend-supp-tax-inv.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/dispatch-supp-tax-inv/dispatch-supp-tax-inv.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/supp-tax-inv.css'
                ]
            }, {
                name: 'SupplementaryTaxInvEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/supp-tax-inv-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/revcost-revenue-upl/revcost-revenue-upl-edit/revcost-revenue-upl-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/raise-supp-tax-inv/raise-supp-tax-inv-edit/raise-supp-tax-inv-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/verify-supp-tax-inv/verify-supp-tax-inv-edit/verify-supp-tax-inv-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/amend-supp-tax-inv/amend-supp-tax-inv-edit/amend-supp-tax-inv-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/supplementary/dispatch-supp-tax-inv/dispatch-supp-tax-inv-edit/dispatch-supp-tax-inv-edit.controller.js',
                ]
            }, {
                name: 'TaxInvoiceDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/tax-inv.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/prepare-tax-invoice/prepare-tax-invoice.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/wait-for-liner/wait-for-liner.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/verify-tax-invoice/verify-tax-invoice.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/amend-tax-invoice/amend-tax-invoice.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/tax-invoice.css'
                ]
            }, {
                name: 'TaxInvoiceEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/tax-inv-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/wait-for-liner/wait-for-liner-edit/wait-for-liner-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/prepare-tax-invoice/prepare-tax-invoice-edit/prepare-tax-invoice-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/verify-tax-invoice/verify-tax-invoice-edit/verify-tax-invoice-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/tax-invoice/amend-tax-invoice/amend-tax-invoice-edit/amend-tax-invoice-edit.controller.js',
                ]
            }, {
                name: 'GSTInvoiceDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/gst-invoice.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/revcost-revenue-upl-gst/revcost-revenue-upl-gst.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/generate-gst-invoice/generate-gst-invoice.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/dispatch-gst-invoice/dispatch-gst-invoice.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/coll-pay-gst-inv/coll-pay-gst-inv.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/gst-invoice.css'
                ]
            }, {
                name: 'GSTInvoiceEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/gst-invoice-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/revcost-revenue-upl-gst/revcost-revenue-upl-gst-edit/revcost-revenue-upl-gst-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/generate-gst-invoice/generate-gst-invoice-edit/generate-gst-invoice-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/dispatch-gst-invoice/dispatch-gst-invoice-edit/dispatch-gst-invoice-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/gst-invoice/coll-pay-gst-inv/coll-pay-gst-inv-edit/coll-pay-gst-inv-edit.controller.js',
                ]
            }, {
                name: 'HBLDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/hbl.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/prepare-hbl/prepare-hbl.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/confirm-hbl/confirm-hbl.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/dispatch-hbl/dispatch-hbl.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/hbl-clarification/hbl-clarification.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/hbl.css'
                ]
            }, {
                name: 'HBLEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/hbl-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/prepare-hbl/prepare-hbl-edit/prepare-hbl-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/confirm-hbl/confirm-hbl-edit/confirm-hbl-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/dispatch-hbl/dispatch-hbl-edit/dispatch-hbl-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/hbl/hbl-clarification/hbl-clarification-edit/hbl-clarification-edit.controller.js'
                ]
            }, {
                name: 'ShippingBillDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/shipping-bill.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/shipping-bill-filling/shipping-bill-filling.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/confirm-check-list/confirm-check-list.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/clarify-check-list/clarify-check-list.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/custom-clearance/custom-clearance.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/custom-filling/custom-filling.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/shipping-bill.css'
                ]
            }, {
                name: 'ShippingBillEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/shipping-bill-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/shipping-bill-filling/shipping-bill-filling-edit/shipping-bill-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/confirm-check-list/confirm-check-list-edit/confirm-check-list-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/confirm-check-list/confirm-check-list-edit/confirm-check-list-edit.css',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/clarify-check-list/clarify-check-list-edit/clarify-checklist-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/custom-filling/custom-filling-edit/custom-filling-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/shipping-bill/custom-clearance/custom-clearance-edit/custom-clearance-edit.controller.js',
                ]
            }, {
                name: 'CargoPickUpDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/cargo-pickup/cargo-pickup.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/cargo-pickup/cargo-receipt/cargo-receipt.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/cargo-pickup/cargo-pickup.css'
                ]
            }, {
                name: 'CargoPickUpEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/cargo-pickup/cargo-pickup-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/cargo-pickup/cargo-receipt/cargo-receipt-edit/cargo-receipt-edit.controller.js',
                ]
            }, {
                name: 'JobCostSheetDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/job-cost-sheet/job-cost-sheet.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/job-cost-sheet/job-cost-sheet/job-cost-sheet.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/job-cost-sheet/job-cost-sheet.css'
                ]
            }, {
                name: 'JobCostSheetEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/job-cost-sheet/job-cost-sheet-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/job-cost-sheet/job-cost-sheet/job-cost-sheet-edit/job-cost-sheet-edit.controller.js',
                ]
            }, {
                name: 'VgmFilingDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing.css',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing/vgm-filing.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/plan-vgm-filing/plan-vgm-filing.controller.js'
                ]
            }, {
                name: 'VgmFilingEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing/vgm-filing-edit/vgm-filing-edit.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/plan-vgm-filing/plan-vgm-filing-edit/plan-vgm-filing-edit.controller.js'
                ]
            }, {
                name: 'ICDClearanceDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance/icd-clearance.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance.css'
                ]
            }, {
                name: 'ICDClearanceEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance/icd-clearance-edit/icd-clearance-edit.controller.js'
                ]
            }, {
                name: 'ExportSeaShipmentPrepareTaxInvoiceglbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-tax-invoice-glb/export-sea-shipment-prepare-tax-invoice-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-tax-invoice-glb/export-sea-shipment-prepare-tax-invoice-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentVerifyTaxInvoiceglbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-verify-tax-inv-glb/export-sea-shipment-verify-tax-inv-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-verify-tax-inv-glb/export-sea-shipment-verify-tax-inv-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentWaitForLinerTaxInvoiceglbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-wait-for-liner-glb/export-sea-shipment-wait-for-liner-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-wait-for-liner-glb/export-sea-shipment-wait-for-liner-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentShippingBillFillingGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-shipping-bill-filling-glb/export-sea-shipment-shipping-bill-filling-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-shipping-bill-filling-glb/export-sea-shipment-shipping-bill-filling-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentConfirmChecklistGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-checklist-glb/export-sea-shipment-confirm-checklist-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-checklist-glb/export-sea-shipment-confirm-checklist-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentClarifyChecklistGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-clarify-checklist-glb/export-sea-shipment-clarify-checklist-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-clarify-checklist-glb/export-sea-shipment-clarify-checklist-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentCustomsFillingGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-customs-filling-glb/export-sea-shipment-customs-filling-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-customs-filling-glb/export-sea-shipment-customs-filling-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentConfirmCustomClearanceGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-custom-clearance-glb/export-sea-shipment-confirm-custom-clearance-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-custom-clearance-glb/export-sea-shipment-confirm-custom-clearance-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentAmendTaxInvGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-amend-tax-inv-glb/export-sea-shipment-amend-tax-inv-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-amend-tax-inv-glb/export-sea-shipment-amend-tax-inv-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentCargoReceiptGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-receipt-glb/export-sea-shipment-cargo-receipt-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-receipt-glb/export-sea-shipment-cargo-receipt-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentJobCostSheetGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-job-cost-sheet-glb/export-sea-shipment-job-cost-sheet-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-job-cost-sheet-glb/export-sea-shipment-job-cost-sheet-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentAmendTaxInvGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-amend-tax-inv-glb/export-sea-shipment-amend-tax-inv-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-amend-tax-inv-glb/export-sea-shipment-amend-tax-inv-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentCargoReceiptGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-receipt-glb/export-sea-shipment-cargo-receipt-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-receipt-glb/export-sea-shipment-cargo-receipt-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentPrepareHBLGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-hbl-glb/export-sea-shipment-prepare-hbl-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-hbl-glb/export-sea-shipment-prepare-hbl-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentConfirmHBLGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-hbl-glb/export-sea-shipment-confirm-hbl-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-hbl-glb/export-sea-shipment-confirm-hbl-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentHBLClarificationGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-hbl-clarification-glb/export-sea-shipment-hbl-clarification-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-hbl-clarification-glb/export-sea-shipment-hbl-clarification-glb.directive.js"
                ]
            }, {
                name: 'ExportSeaShipmentDispatchHBLGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-dispatch-hbl-glb/export-sea-shipment-dispatch-hbl-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-dispatch-hbl-glb/export-sea-shipment-dispatch-hbl-glb.directive.js"
                ]
            }, {
                name: 'ShpModeEventDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/shp-mode/shp-mode-event.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-mode/shp-mode-event.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-mode/shp-mode-event.css'
                ]
            }, {
                name: 'ShpIncotermEventDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/shp-incoterm/shp-incoterm-event.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-incoterm/shp-incoterm-event.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-incoterm/shp-incoterm-event.css'
                ]
            }, {
                name: 'ShpBkgCuttOffDateEventDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/shp-bkg-cut-off-date/shp-bkg-cut-off-date-event.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-bkg-cut-off-date/shp-bkg-cut-off-date-event.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-bkg-cut-off-date/shp-bkg-cut-off-date-event.css'
                ]
            }, {
                name: 'ShpCargoCuttOffDateEventDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/shp-cargo-cutt-off-date/shp-cargo-cutt-off-date.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-cargo-cutt-off-date/shp-cargo-cutt-off-date.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-cargo-cutt-off-date/shp-cargo-cutt-off-date.css'
                ]
            }, {
                name: 'ShpDocCuttOffDateEventDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/shp-doc-cutt-off-date/shp-doc-cutt-off-date.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-doc-cutt-off-date/shp-doc-cutt-off-date.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-doc-cutt-off-date/shp-doc-cutt-off-date.css'
                ]
            }, {
                name: 'ShpCreationDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/shp-creation/shp-creation-event.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-creation/shp-creation-event.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/shp-creation/shp-creation-event.css'
                ]
            }, {
                name: 'BookingApprovalEventDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-event/bkg-approval-event/bkg-approval-event.directive.js',
                    'app/eaxis/freight/shipment/shipment-event/bkg-approval-event/bkg-approval-event.controller.js',
                    'app/eaxis/freight/shipment/shipment-event/bkg-approval-event/bkg-approval-event.css'
                ]
            },

            // Booking
            // {
            //     name: 'VerifyBookingDirective',
            //     files: [
            //         'app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking.directive.js',
            //         'app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking.controller.js',
            //         'app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking.css'
            //     ]
            // }, {
            //     name: 'VerifyBookingEditDirective',
            //     files: [
            //         'app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking-edit/verify-booking-edit.directive.js',
            //         'app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking-edit/verify-booking-edit.controller.js',
            //         'app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking-edit/verify-booking-edit.css'
            //     ]
            // }, {
            //     name: 'VerifyBookingVesselPlanning',
            //     files: [
            //         'app/eaxis/freight/booking/my-task/my-task-directive/Verify-booking/Verify-booking-vessel-modal/Verify-booking-vessel-modal.controller.js',
            //         'app/eaxis/freight/booking/my-task/my-task-directive/Verify-booking/Verify-booking-vessel-modal/Verify-booking-vessel-modal.css'
            //     ]
            // }, 
            {
                name: 'QuickBookingApprovalDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval.css'
                ]
            }, {
                name: 'QuickBookingApprovalEditDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval-edit/quick-booking-approval-edit.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval-edit/quick-booking-approval-edit.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval-edit/quick-booking-approval-edit.css'
                ]
            }, {
                name: 'QuickBookingApprovalNotifyDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify.css'
                ]
            }, {
                name: 'QuickBookingApprovalNotifyEditDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify-edit/quick-book-approval-notify-edit.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify-edit/quick-book-approval-notify-edit.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify-edit/quick-book-approval-notify-edit.css'
                ]
            }, {
                name: 'QuickBookingRejectDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject.css'
                ]
            }, {
                name: 'QuickBookingRejectEditDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject-edit/quick-book-reject-edit.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject-edit/quick-book-reject-branch-edit.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject-edit/quick-book-reject-supplier-edit.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject-edit/quick-book-reject-edit.css'
                ]
            }, {
                name: 'SLIBookingDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking.css'
                ]
            }, {
                name: 'SLIBookingEditDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking-edit/sli-booking-edit.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking-edit/sli-booking-edit.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking-edit/sli-booking-edit.css'
                ]
            }, {
                name: 'BookingCancellationDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation/booking-cancellation.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation/booking-cancellation.css'
                ]
            }, {
                name: 'BookingCancellationEditDirective',
                files: [
                    'app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation-edit.directive.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation/booking-cancellation-edit/booking-cancellation-edit.controller.js',
                    'app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation/booking-cancellation-edit/booking-cancellation-edit.css'
                ]
            },
            // Consol
            {
                name: 'ExportSeaConsolidationSIFilingGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-si-filing-glb/export-sea-consol-si-filing-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-si-filing-glb/export-sea-consol-si-filing-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolidationLinerInvoiceGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-liner-invoice-glb/export-sea-consol-liner-invoice-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-liner-invoice-glb/export-sea-consol-liner-invoice-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolDispatchPostShipmentGlbDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-dispatch-post-shipment-glb/export-sea-consol-dispatch-post-shipment-glb.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-dispatch-post-shipment-glb/export-sea-consol-dispatch-post-shipment-glb.directive.js'
                ]
            }, {
                name: 'ExportSeaConsolidationApproveMBLGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-glb/export-sea-consol-approve-mbl-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-glb/export-sea-consol-approve-mbl-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolClarifyMBLGlbDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-glb/export-sea-consol-clarify-mbl-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-glb/export-sea-consol-clarify-mbl-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolidationApproveMBLHBLGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-hbl-glb/export-sea-consol-approve-mbl-hbl-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-hbl-glb/export-sea-consol-approve-mbl-hbl-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolClarifyMBLHBLGlbDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-hbl-glb/export-sea-consol-clarify-mbl-hbl-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-hbl-glb/export-sea-consol-clarify-mbl-hbl-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolConfirmArrivalGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-arrival-glb/export-sea-consol-confirm-arrival-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-arrival-glb/export-sea-consol-confirm-arrival-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolConfirmtranArrivalGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-arrival-glb/export-sea-consol-confirm-tran-arrival-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-arrival-glb/export-sea-consol-confirm-tran-arrival-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolConfirmdepartureGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-departure-glb/export-sea-consol-confirm-departure-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-departure-glb/export-sea-consol-confirm-departure-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolConfirmtrandepartureGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-departure-glb/export-sea-consol-confirm-tran-departure-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-departure-glb/export-sea-consol-confirm-tran-departure-glb.controller.js'
                ]
            }, {
                name: 'ConfirmRailmentDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-railment/confirm-railment.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-railment/confirm-railment/confirm-railment.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-railment/confirm-railment.css'
                ]
            }, {
                name: 'ConfirmRailmentEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-railment/confirm-railment-edit.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-railment/confirm-railment/confirm-railment-edit/confirm-railment-edit.controller.js',
                ]
            }, {
                name: 'LinerDeliveryDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery-order.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery/liner-delivery.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery-order.css'
                ]
            }, {
                name: 'LinerDeliveryEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery-order-edit.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery/liner-delivery-edit/liner-delivery-edit.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolMBLApprovalToCarrierGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-glb-mbl-approval-to-carrier/export-sea-consol-mbl-approval-to-carrier.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-glb-mbl-approval-to-carrier/export-sea-consol-mbl-approval-to-carrier.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolMBLApprovalToCarrierGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-mbl-approval-to-carrier-glb/export-sea-consol-mbl-approval-to-carrier-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-mbl-approval-to-carrier-glb/export-sea-consol-mbl-approval-to-carrier-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolPreAlertGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-pre-alert-glb/export-sea-consol-pre-alert-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-pre-alert-glb/export-sea-consol-pre-alert-glb.controller.js'
                ]
            }, {
                name: 'ExportSeaConsolidationConsolCreationGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-consol-creation-glb/export-sea-consol-consol-creation-glb.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-consol-creation-glb/export-sea-consol-consol-creation-glb.controller.js'
                ]
            },
            // Container
            {
                name: 'containerEmptyReturnDirective',
                files: [
                    'app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return.directive.js',
                    'app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return/container-empty-return.controller.js',
                    'app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return.css'
                ]
            }, {
                name: 'containerEmptyReturnEditDirective',
                files: [
                    'app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return-edit.directive.js',
                    'app/eaxis/freight/container/my-task/my-task-directive/container-empty-return/container-empty-return/container-empty-return-edit/container-empty-return-edit.controller.js'
                ]
            }, {
                name: 'ImportContainerDetailsGlb',
                files: [
                    'app/eaxis/freight/container/my-task/shared/container/import-container-details-glb/import-container-details-glb.controller.js',
                    'app/eaxis/freight/container/my-task/shared/container/import-container-details-glb/import-container-details-glb.directive.js',
                ]
            }, {
                name: 'importSeaContainerContainerEmptyReturnGlbDirective',
                files: [
                    "app/eaxis/freight/container/my-task/my-task-directive/import-sea-container-container-empty-return-glb/import-sea-container-container-empty-return-glb.controller.js",
                    "app/eaxis/freight/container/my-task/my-task-directive/import-sea-container-container-empty-return-glb/import-sea-container-container-empty-return-glb.directive.js"
                ]
            },
            // endregion
            // region Reports
            {
                name: 'FreightReport',
                files: [
                    'app/eaxis/freight/freight-report/freight-report.controller.js',
                    'app/eaxis/freight/freight-report/freight-report.css'
                ]
            },
            // consol common fields 
            {
                name: 'ConsolCommonFieldsDirective',
                files: [
                    'app/eaxis/freight/consolidation/consol-details/consol-details.controller.js',
                    'app/eaxis/freight/consolidation/consol-details/consol-details.directive.js',
                    'app/eaxis/freight/consolidation/consol-details/consol-details.css'
                ]
            }, {
                name: 'ConsolDetailsDirective',
                files: [
                    'app/eaxis/freight/consolidation/consol-entity-details/consol-entity-details.controller.js',
                    'app/eaxis/freight/consolidation/consol-entity-details/consol-entity-details.directive.js',
                    'app/eaxis/freight/consolidation/consol-entity-details/consol-entity-details.css'
                ]
            },
            // consol common doc 
            {
                name: 'ConsolCommonDocsDirective',
                files: [
                    'app/eaxis/freight/consolidation/document-directive/document-directive.controller.js',
                    'app/eaxis/freight/consolidation/document-directive/document-directive.directive.js',
                    'app/eaxis/freight/consolidation/document-directive/document-directive.css'
                ]
            }, {
                name: 'ShipmentEntityDetailsDirective',
                files: [
                    'app/eaxis/freight/shipment/shipment-entity-details/shipment-entity-details.controller.js',
                    'app/eaxis/freight/shipment/shipment-entity-details/shipment-entity-details.directive.js',
                    'app/eaxis/freight/shipment/shipment-entity-details/shipment-entity-details.css'
                ]
            }, {
                name: 'ConfirmTranArrivalDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival/confirm-tran-arrival.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival.css'
                ]
            }, {
                name: 'ConfirmTranArrivalEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival-edit.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival/confirm-tran-arrival-edit/confirm-tran-arrival-edit.controller.js'
                ]
            }, {
                name: 'ConfirmTranDepartureDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure/confirm-tran-departure.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure.css'
                ]
            }, {
                name: 'ConfirmTranDepartureEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure-edit.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure/confirm-tran-departure-edit/confirm-tran-departure-edit.controller.js',
                ]
            }, {
                name: 'PartiesDetailsDirective',
                files: [
                    'app/eaxis/freight/shipment/parties-details/parties-details.controller.js',
                    'app/eaxis/freight/shipment/parties-details/parties-details.directive.js',
                    'app/eaxis/freight/shipment/parties-details/parties-details.css'
                ]
            }, {
                name: 'PreAlertDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/pre-alert/pre-alert.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/pre-alert/pre-alert/pre-alert.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/pre-alert/pre-alert.css'
                ]
            }, {
                name: 'PreAlertEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/pre-alert/pre-alert-edit.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/pre-alert/pre-alert/pre-alert-edit/pre-alert-edit.controller.js'
                ]
            }, {
                name: 'MBLCarrierDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/mbl-approval-to-carrier/mbl-approval-to-carrier.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/mbl-approval-to-carrier/mbl-approval-to-carrier/mbl-approval-to-carrier.controller.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/mbl-approval-to-carrier/mbl-approval-to-carrier.css'
                ]
            }, {
                name: 'MBLCarrierEditDirective',
                files: [
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/mbl-approval-to-carrier/mbl-approval-to-carrier-edit.directive.js',
                    'app/eaxis/freight/consolidation/my-task/my-task-directive/mbl-approval-to-carrier/mbl-approval-to-carrier/mbl-approval-to-carrier-edit/mbl-approval-to-carrier-edit.controller.js',
                ]
            }, {
                name: 'ObtainDestuffDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/destuff/destuff.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/destuff/obtain-destuff/obtain-destuff.controller.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/destuff/destuff.css'
                ]
            }, {
                name: 'ObtainDestuffEditDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/my-task-directive/destuff/destuff-edit.directive.js',
                    'app/eaxis/freight/shipment/my-task/my-task-directive/destuff/obtain-destuff/obtain-destuff-edit/obtain-destuff-edit.controller.js',
                ]
            }, {
                name: 'ConsolOrganizationDetailsDirective',
                files: [
                    'app/eaxis/freight/consolidation/consol-organization-details/consol-organization-details.css',
                    'app/eaxis/freight/consolidation/consol-organization-details/consol-organization-details.directive.js',
                    'app/eaxis/freight/consolidation/consol-organization-details/consol-organization-details.controller.js'
                ]
            }, {
                name: 'ExportShipmentDetailsSeaGlb',
                files: [
                    'app/eaxis/freight/shipment/my-task/shared/shipment/export-shipment-details-sea-glb/export-shipment-details-sea-glb.controller.js',
                    'app/eaxis/freight/shipment/my-task/shared/shipment/export-shipment-details-sea-glb/export-shipment-details-sea-glb.directive.js',
                ]
            }, {
                name: 'ExportConsolDetailsSeaGlb',
                files: [
                    'app/eaxis/freight/shipment/my-task/shared/consol/export-consol-details-sea-glb/export-consol-details-sea-glb.controller.js',
                    'app/eaxis/freight/shipment/my-task/shared/consol/export-consol-details-sea-glb/export-consol-details-sea-glb.directive.js',
                ]
            }, {
                name: 'ExportContainerDetailsSeaGlb',
                files: [
                    'app/eaxis/freight/shipment/my-task/shared/container/export-container-details-sea-glb/export-container-details-sea-glb.controller.js',
                    'app/eaxis/freight/shipment/my-task/shared/container/export-container-details-sea-glb/export-container-details-sea-glb.directive.js',
                ]
            }, {
                name: 'DynamicInformationSummaryDirective',
                files: [
                    'app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.controller.js',
                    'app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.directive.js',
                    'app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.css',
                ]
            }, {
                name: 'ExportSeaShipmentCargoPickupGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-pickup-glb/export-sea-shipment-cargo-pickup-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-pickup-glb/export-sea-shipment-cargo-pickup-glb.directive.js"
                ]
            }, {
                name: 'ExportConsolDetailsGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/shared/consol/export-consol-details-glb/export-consol-details-glb.controller.js',
                    'app/eaxis/freight/consolidation/my-task/shared/consol/export-consol-details-glb/export-consol-details-glb.directive.js',
                ]
            }, {
                name: 'ExportShipmentDetailsGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/shared/shipment/export-shipment-details-glb/export-shipment-details-glb.controller.js',
                    'app/eaxis/freight/consolidation/my-task/shared/shipment/export-shipment-details-glb/export-shipment-details-glb.directive.js',
                ]
            }, {
                name: 'ExportRoutingDetailsGlb',
                files: [
                    'app/eaxis/freight/consolidation/my-task/shared/routing/export-routing-details-glb/export-routing-details-glb.controller.js',
                    'app/eaxis/freight/consolidation/my-task/shared/routing/export-routing-details-glb/export-routing-details-glb.directive.js',
                ]
            }, {
                name: 'FreightConfirmation',
                files: [
                    'app/eaxis/freight/shared/freight-confirmation/freight-confirmation.factory.js'
                ]
            }, {
                name: 'FreightShpConfirmation',
                files: [
                    'app/eaxis/freight/shared/freight-shp-confirmation/freight-shp-confirmation.factory.js'
                ]
            },{
                name: 'ExportSeaShipmentEmptyPlacedGlbDirective',
                files: [
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-empty-placed-glb/export-sea-shipment-empty-placed-glb.controller.js",
                    "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-empty-placed-glb/export-sea-shipment-empty-placed-glb.directive.js"
                ]
            }
        ]
    };

    angular
        .module("Application")
        .constant("FREIGHT_CONSTANT", FREIGHT_CONSTANT);
})();
