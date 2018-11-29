(function () {
    'use strict';

    var FREIGHTS_CONSTANT = {
        ocLazyLoadModules: [{
                name: 'Freights',
                files: [
                    'app/eaxis/shared/freights/freights.css',
                    'app/eaxis/shared/freights/freights.controller.js'
                ]
            }, {
                name: '3_BookingList',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/3_booking_list/3_booking.css',
                    'app/eaxis/buyer/freight/booking/shared/3_booking_list/3_booking.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/3_booking_list/3_booking-config.factory.js'
                ]
            }, {
                name: '1_3_BookingMenu',
                files: [
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/bkg-buyer-forwarder-view-template/bkg-buyer-forwarder-view-template.css',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/bkg-buyer-forwarder-view-template/bkg-buyer-forwarder-view-template.directive.js',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/bkg-buyer-forwarder-view-template/bkg-buyer-forwarder-view-template.controller.js'
                ]
            }, {
                name: '1_3_BookingDirective',
                files: [
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.css',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.js',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.controller.js'
                ]
            }, {
                name: '1_3_BookingOrder',
                files: [
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-order/1_3_booking-order.css',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-order/1_3_booking-order.directive.js',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-order/1_3_booking-order.controller.js'
                ]
            }, {
                name: '1_3_BookingPlanning',
                files: [
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.css',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.directive.js',
                    'app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.controller.js'
                ]
            }, {
                name: '1_2_BookingMenu',
                files: [
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/bkg-buyer-supplier-view-template/bkg-buyer-supplier-view-template.css',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/bkg-buyer-supplier-view-template/bkg-buyer-supplier-view-template.directive.js',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/bkg-buyer-supplier-view-template/bkg-buyer-supplier-view-template.controller.js'
                ]
            }, {
                name: '1_2_BookingDirective',
                files: [
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-directive/1_2_booking-directive.css',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-directive/1_2_booking-directive.js',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-directive/1_2_booking-directive.controller.js'
                ]
            }, {
                name: '1_2_BookingOrder',
                files: [
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-order/1_2_booking-order.css',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-order/1_2_booking-order.directive.js',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-order/1_2_booking-order.controller.js'
                ]
            }, {
                name: '1_2_BookingPlanning',
                files: [
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-planning/1_2_booking-planning.css',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-planning/1_2_booking-planning.directive.js',
                    'app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-planning/1_2_booking-planning.controller.js'
                ]
            },
            // ASN Upload
            {
                name: '1_2_BookingASNUpload',
                files: [
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload.css',
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload.controller.js',
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload-config.factory.js',
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload-directive.js'
                ]
            }, {
                name: '1_2_BookingASNUploadDirective',
                files: [
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload-directive/1_2_asn-upload-directive.css',
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload-directive/1_2_asn-upload-directive.js',
                    'app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload-directive/1_2_asn-upload-directive.controller.js'
                ]
            },
            // ShipmentList
            {
                name: '3_ShipmentList',
                files: [
                    'app/eaxis/buyer/freight/shipment/shared/3_shipment_list/3_shipment.css',
                    'app/eaxis/buyer/freight/shipment/shared/3_shipment_list/3_shipment.controller.js',
                    'app/eaxis/buyer/freight/shipment/shared/3_shipment_list/3_shipment-config.factory.js'
                ]
            },
            {
                name: '1_3_shipmentMenu',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-menu/1_3_shipment-menu.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-menu/1_3_shipment-menu.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-menu/1_3_shipment-menu.controller.js'
                ]
            }, {
                name: '1_3_shipmentGeneral',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_general/1_3_shipment-general.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_general/1_3_shipment-general.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_general/1_3_shipment-general.controller.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_general/tabs/packing-modal.controller.js'
                ]
            }, {
                name: '1_3_shipmentOrder',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-order/1_3_shipment-order.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-order/1_3_shipment-order.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-order/1_3_shipment-order.controller.js'
                ]
            }, {
                name: '1_3_shipmentConsoleAndPacking',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_shipment-console-and-packing.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_shipment-console-and-packing.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_shipment-console-and-packing.controller.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/tabs/consol-packing-modal.controller.js'
                ]
            }, {
                name: '1_3_shipmentServiceAndReference',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_service-and-reference/1_3_shipment-service-and-reference.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_service-and-reference/1_3_shipment-service-and-reference.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_service-and-reference/1_3_shipment-service-and-reference.controller.js'
                ]
            }, {
                name: '1_3_relatedShipment',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_related-shipment/1_3_related-shipment.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_related-shipment/1_3_related-shipment.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_related-shipment/1_3_related-shipment.controller.js'
                ]
            }, {
                name: '1_3_shipmentPickupAndDelivery',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_pickup-and-delivery/1_3_pickup-and-delivery.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_pickup-and-delivery/1_3_pickup-and-delivery.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_pickup-and-delivery/1_3_pickup-and-delivery.controller.js'
                ]
            }, {
                name: '1_3_shipmentBilling',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_billing/1_3_shipment-billing.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_billing/1_3_shipment-billing.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_billing/1_3_shipment-billing.controller.js'
                ]
            }, {
                name: '1_3_ConsolGrid',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_consol-grid/1_3_consol-grid.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_consol-grid/1_3_consol-grid.controller.js',
                ]
            }, {
                name: '1_3_ContainerGrid',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_container-grid/1_3_container-grid.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_container-grid/1_3_container-grid.controller.js',
                ]
            },
            {
                name: '1_3_PackingGridDirective',
                files: [
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_packing-grid/1_3_packing-grid.css',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_packing-grid/1_3_packing-grid.directive.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_packing-grid/1_3_packing-grid.controller.js',
                    'app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_packing-grid/1_3_packing-grid-popup.controller.js'
                ]
            },
            // MyTask
            {
                name: 'ActivityTemplateBooking',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/activity-template-booking/activity-template-booking.directive.js',
                    'app/eaxis/buyer/freight/booking/shared/activity-template-booking/activity-template-booking.controller.js'
                ]
            },
            {
                name: 'ActivityFormTemplateBooking',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/activity-form-template-booking/activity-form-template-booking.directive.js',
                    'app/eaxis/buyer/freight/booking/shared/activity-form-template-booking/activity-form-template-booking.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/activity-form-template-booking/activity-form-template-booking.css'
                ]
            },
            {
                name: 'BookingDetails',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/booking-details/booking-details.directive.js',
                    'app/eaxis/buyer/freight/booking/shared/booking-details/booking-details.controller.js'
                ]
            },
            {
                name: 'VerifyBooking',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/verify-booking/verify-booking.directive.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/verify-booking/verify-booking.controller.js'
                ]
            },
            {
                name: 'BookingApproval',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/booking-approval/booking-approval.directive.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/booking-approval/booking-approval.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/booking-approval/booking-approval.css'
                ]
            }, {
                name: 'ConfirmCarrier',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/confirm-carrier/confirm-carrier.directive.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/confirm-carrier/confirm-carrier.controller.js'
                ]
            },
            {
                name: 'confirm-arrival',
                files: [
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-arrival/confirm-arrival.directive.js',
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-arrival/confirm-arrival.controller.js'
                ]
            }, {
                name: 'confirm-tran-arrival',
                files: [
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival.directive.js',
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival.controller.js'
                ]
            },
            {
                name: 'confirm-departure',
                files: [
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-departure/confirm-departure.directive.js',
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-departure/confirm-departure.controller.js'
                ]
            }, {
                name: 'confirm-tran-departure',
                files: [
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure.directive.js',
                    'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure.controller.js'
                ]
            },
            // region Consolidation
            {
                name: '3_consol-list',
                files: [
                    'app/eaxis/buyer/freight/consolidation/shared/3_consol_list/3_consol_list.css',
                    'app/eaxis/buyer/freight/consolidation/shared/3_consol_list/3_consol_list.controller.js',
                    'app/eaxis/buyer/freight/consolidation/shared/3_consol_list/3_consol_list-config.factory.js'
                ]
            }, {
                name: 'three-one-consolMenu',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-menu/three-one-consol-menu.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-menu/three-one-consol-menu.controller.js'
                ]
            }, {
                name: 'three-one-QuickView',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_quickview/three-one-quickview.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_quickview/three-one-quickview.controller.js'
                ]
            }, {
                name: 'three-one-consolMyTask',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-my-task/three-one-consol-my-task.css',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-my-task/three-one-consol-my-task.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-my-task/three-one-consol-my-task.controller.js'
                ]
            }, {
                name: 'three-one-consolGeneral',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_general/three-one-consol-general.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_general/three-one-consol-general.controller.js'
                ]
            }, {
                name: 'three-one-ConsolArrivalDeparture',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_arrival-departure/three-one-arrival-departure.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_arrival-departure/three-one-arrival-departure.controller.js'
                ]
            }, {
                name: 'three-one-ConsolShipment',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-shipment/three-one-consol-shipment.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-shipment/three-one-consol-shipment.controller.js'
                ]
            }, {
                name: 'three-one-consolContainer',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/three-one-consol-container.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/three-one-consol-container.controller.js'
                ]
            }, {
                name: 'three-one-ContainerDirectives',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/3_1_container-form/three-one-container-form.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/3_1_container-form/three-one-container-form.controller.js'
                ]
            }, {
                name: 'three-one-consolContainerPopup',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/3_1_container-modal/three-one-container-modal.controller.js'
                ]
            }, {
                name: 'three-one-ConsolPacking',
                files: [
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-packing/three-one-consol-packing.directive.js',
                    'app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-packing/three-one-consol-packing.controller.js'
                ]
            }, {
                name: '3_1_ConsolActivityDetailsDirective',
                files: [
                    'app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.css',
                    'app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.directive.js',
                    'app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.controller.js'
                ]
            }, {
                name: '3_1_LinkedShipment',
                files: [
                    'app/eaxis/freight/consolidation/linked-shipment/linked-shipment.css',
                    'app/eaxis/freight/consolidation/linked-shipment/linked-shipment.directive.js',
                    'app/eaxis/freight/consolidation/linked-shipment/linked-shipment.controller.js'
                ]
            },
            // endregion
            // region Container
            {
                name: '3_container-list',
                files: [
                    'app/eaxis/buyer/freight/container/shared/3_container-list/3_container-list.css',
                    'app/eaxis/buyer/freight/container/shared/3_container-list/3_container-list.controller.js',
                    'app/eaxis/buyer/freight/container/shared/3_container-list/3_container-list-config.factory.js'
                ]
            }, {
                name: 'three-container-directive',
                files: [
                    'app/eaxis/buyer/freight/container/3_1_forwarder_buyer-container/3_1_container-directive/three-one-container-directive.js',
                    'app/eaxis/buyer/freight/container/3_1_forwarder_buyer-container/3_1_container-directive/three-one-container-directive.controller.js'
                ]
            },
            // endregion
            // Freight Dashboard
            {
                name: 'freight-dashboard',
                files: [
                    'app/eaxis/buyer/freight/dashboard/dashboard.css',
                    'app/eaxis/buyer/freight/dashboard/dashboard.controller.js'
                ]
            }, {
                name: 'buyer-dashboard',
                files: [
                    'app/eaxis/buyer/freight/dashboard/tabs/buyer/buyer-dashboard.css',
                    'app/eaxis/buyer/freight/dashboard/tabs/buyer/buyer-dashboard.controller.js'
                ]
            }, {
                name: 'supplier-dashboard',
                files: [
                    'app/eaxis/buyer/freight/dashboard/tabs/supplier/supplier-dashboard.css',
                    'app/eaxis/buyer/freight/dashboard/tabs/supplier/supplier-dashboard.controller.js'
                ]
            }, {
                name: 'exporter-dashboard',
                files: [
                    'app/eaxis/buyer/freight/dashboard/tabs/exporter/exporter-dashboard.css',
                    'app/eaxis/buyer/freight/dashboard/tabs/exporter/exporter-dashboard.controller.js'
                ]
            }, {
                name: 'importer-dashboard',
                files: [
                    'app/eaxis/buyer/freight/dashboard/tabs/importer/importer-dashboard.css',
                    'app/eaxis/buyer/freight/dashboard/tabs/importer/importer-dashboard.controller.js'
                ]
            },
            // my-task for Domestic Booking Vietnam
            {
                name: 'receive-asn-vnm',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/receive-asn-vnm/receive-asn-vnm.css',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/receive-asn-vnm/receive-asn-vnm.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/receive-asn-vnm/receive-asn-vnm.directive.js'
                ]
            },
            {
                name: 'upload-pkl-vnm',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-pkl-vnm/upload-pkl-vnm.css',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-pkl-vnm/upload-pkl-vnm.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-pkl-vnm/upload-pkl-vnm.directive.js'
                ]
            },
            {
                name: 'upload-export-permit-vnm',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-export-permit-vnm/upload-export-permit-vnm.css',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-export-permit-vnm/upload-export-permit-vnm.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-export-permit-vnm/upload-export-permit-vnm.directive.js'
                ]
            },
            {
                name: 'upload-inbound-report-vnm',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-inbound-report-vnm/upload-inbound-report-vnm.css',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-inbound-report-vnm/upload-inbound-report-vnm.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-inbound-report-vnm/upload-inbound-report-vnm.directive.js'
                ]
            },{
                name: 'upload-leasing-contract-vnm',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.css',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.directive.js'
                ]
            },
            {
                name: 'upload-trouble-report-vnm',
                files: [
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-trouble-report-vnm/upload-trouble-report-vnm.css',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-trouble-report-vnm/upload-trouble-report-vnm.controller.js',
                    'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-trouble-report-vnm/upload-trouble-report-vnm.directive.js'
                ]
            }
        ]
    };

    angular
        .module("Application")
        .constant("FREIGHTS_CONSTANT", FREIGHTS_CONSTANT);
})();