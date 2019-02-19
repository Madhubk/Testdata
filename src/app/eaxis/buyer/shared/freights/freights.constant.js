(function () {
    'use strict';

    var FREIGHTS_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'Freights',
            files: [
                'app/eaxis/buyer/shared/freights/freights.css',
                'app/eaxis/buyer/shared/freights/freights.controller.js',
                'app/eaxis/buyer/shared/buyer-app.css'
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
        },
        // External booking warehouse provider
        {
            name: '1_3_Ext_WHP_BookingMenu',
            files: [
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/bkg-buyer-warehouse-provider-view-template/bkg-buyer-warehouse-provider-view-template.css',
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/bkg-buyer-warehouse-provider-view-template/bkg-buyer-warehouse-provider-view-template.directive.js',
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/bkg-buyer-warehouse-provider-view-template/bkg-buyer-warehouse-provider-view-template.controller.js'
            ]
        }, {
            name: '1_3_Ext_WHP_BookingDirective',
            files: [
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.css',
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.js',
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.controller.js'
            ]
        }, {
            name: '1_3_Ext_WHP_BookingPlanning',
            files: [
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.css',
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.directive.js',
                'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.controller.js'
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
        {
            name: 'UploadBooking',
            files: [
                'app/eaxis/buyer/freight/booking/upload-booking/upload-booking.css',
                'app/eaxis/buyer/freight/booking/upload-booking/upload-booking.controller.js',
                'app/eaxis/buyer/freight/booking/upload-booking/upload-booking-config.factory.js'
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
        },
        // Entity Doc Upload
        {
            name: '1_2_EntityDocUploadDirective',
            files: [
                'app/eaxis/buyer/shared/1_2_entitydoc-upload/1_2_entitydoc-upload-directive/1_2_entitydoc-upload-directive.css',
                'app/eaxis/buyer/shared/1_2_entitydoc-upload/1_2_entitydoc-upload-directive/1_2_entitydoc-upload-directive.js',
                'app/eaxis/buyer/shared/1_2_entitydoc-upload/1_2_entitydoc-upload-directive/1_2_entitydoc-upload-directive.controller.js'
            ]
        },
        {
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
        // buyer read only screen
        {
            name: 'shp-buyer-view-template-list',
            files: [
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/3_track-shipment.css',
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/3_track-shipment-config.factory.js',
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/3_track-shipment.controller.js'
            ]
        },
        {
            name: 'shp-buyer-view-template',
            files: [
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view-template/shp-buyer-view-template.directive.js',
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view-template/shp-buyer-view-template.controller.js',
            ]
        },
        {
            name: 'shp-buyer-view-general',
            files: [
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/general/general.directive.js',
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/general/general.controller.js',
            ]
        },
        {
            name: 'shp-buyer-view-order',
            files: [
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/order/order.directive.js',
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/order/order.controller.js',
            ]
        },
        {
            name: 'shp-buyer-view-consol-packing',
            files: [
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/consol-packing/consol-packing.directive.js',
                'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/consol-packing/consol-packing.controller.js',
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
            name: 'upload-import-permit-document',
            files: [
                'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/upload-import-permit-document/upload-import-permit-document.directive.js',
                'app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/upload-import-permit-document/upload-import-permit-document.controller.js'
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
            name: 'dynamic-dashboard',
            files: [
                'app/eaxis/buyer/dashboard/dashboard.css',
                'app/eaxis/buyer/dashboard/dashboard.controller.js',
                'app/eaxis/buyer/shared/dynamic-dashboard/dynamic-dashboard-directive.js'
            ]
        }, {
            name: 'buyer-dashboard',
            files: [
                'app/eaxis/buyer/dashboard/buyer-dashboard/buyer-dashboard.css',
                'app/eaxis/buyer/dashboard/buyer-dashboard/buyer-dashboard.controller.js'
            ]
        },
        {
            name: 'dashboard-default',
            files: [
                'app/eaxis/buyer/dashboard/dashboard-default/dashboard-default.css',
                'app/eaxis/buyer/dashboard/dashboard-default/dashboard-default.controller.js',
                'app/eaxis/buyer/dashboard/dashboard-default/dashboard-default.directive.js'
            ]
        },
        {
            name: 'dash_dhcus_deeconnyc',
            files: [
                'app/eaxis/buyer/dashboard/buyer-dashboard/dash_dhcus_deeconnyc/dash_dhcus_deeconnyc.css',
                'app/eaxis/buyer/dashboard/buyer-dashboard/dash_dhcus_deeconnyc/dash_dhcus_deeconnyc.controller.js',
                'app/eaxis/buyer/dashboard/buyer-dashboard/dash_dhcus_deeconnyc/dash_dhcus_deeconnyc.directive.js'
            ]
        },
        {
            name: 'dash_vnask_marpulnrt',
            files: [
                'app/eaxis/buyer/dashboard/buyer-dashboard/dash_vnask_marpulnrt/dash_vnask_marpulnrt.css',
                'app/eaxis/buyer/dashboard/buyer-dashboard/dash_vnask_marpulnrt/dash_vnask_marpulnrt.controller.js',
                'app/eaxis/buyer/dashboard/buyer-dashboard/dash_vnask_marpulnrt/dash_vnask_marpulnrt.directive.js'
            ]
        }, {
            name: 'supplier-dashboard',
            files: [
                'app/eaxis/buyer/dashboard/tabs/supplier/supplier-dashboard.css',
                'app/eaxis/buyer/dashboard/tabs/supplier/supplier-dashboard.controller.js'
            ]
        }, {
            name: 'exporter-dashboard',
            files: [
                'app/eaxis/buyer/dashboard/tabs/exporter/exporter-dashboard.css',
                'app/eaxis/buyer/dashboard/tabs/exporter/exporter-dashboard.controller.js'
            ]
        }, {
            name: 'importer-dashboard',
            files: [
                'app/eaxis/buyer/dashboard/tabs/importer/importer-dashboard.css',
                'app/eaxis/buyer/dashboard/tabs/importer/importer-dashboard.controller.js'
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
        }, {
            name: 'upload-leasing-contract-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.directive.js'
            ]
        },
        {
            name: 'upload-do-ownership-transfer-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-do-ownership-vnm/upload-do-ownership-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-do-ownership-vnm/upload-do-ownership-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-do-ownership-vnm/upload-do-ownership-vnm.directive.js'
            ]
        },
        {
            name: 'asnupload-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/asnupload-vnm/asnupload-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/asnupload-vnm/asnupload-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/asnupload-vnm/asnupload-vnm.directive.js'
            ]
        },
        {
            name: 'upload-civ-pkl-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-civ-pkl-vnm/upload-civ-pkl-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-civ-pkl-vnm/upload-civ-pkl-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-civ-pkl-vnm/upload-civ-pkl-vnm.directive.js'
            ]
        }, {
            name: 'upload-outbound-report-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-outbound-report-vnm/upload-outbound-report-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-outbound-report-vnm/upload-outbound-report-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-outbound-report-vnm/upload-outbound-report-vnm.directive.js'
            ]
        }, {
            name: 'upload-mbl-hbl-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-mbl-hbl-vnm/upload-mbl-hbl-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-mbl-hbl-vnm/upload-mbl-hbl-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-mbl-hbl-vnm/upload-mbl-hbl-vnm.directive.js'
            ]
        }, {
            name: 'upload-co-app-request-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-request-vnm/upload-co-app-request-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-request-vnm/upload-co-app-request-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-request-vnm/upload-co-app-request-vnm.directive.js'
            ]
        }, {
            name: 'upload-co-app-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-vnm/upload-co-app-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-vnm/upload-co-app-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-app-vnm/upload-co-app-vnm.directive.js'
            ]
        }, {
            name: 'upload-co-vnm',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-vnm/upload-co-vnm.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-vnm/upload-co-vnm.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-co-vnm/upload-co-vnm.directive.js'
            ]
        }, {
            name: '2_ShipmentList',
            files: [
                'app/eaxis/buyer/freight/booking/shared/2_shipment_list/2_shipment.css',
                'app/eaxis/buyer/freight/booking/shared/2_shipment_list/2_shipment.controller.js',
                'app/eaxis/buyer/freight/booking/shared/2_shipment_list/2_shipment-config.factory.js'
            ]
        },
        {
            name: 'bulkupload-dhc',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bulkupload-dhc/bulkupload-dhc.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bulkupload-dhc/bulkupload-dhc.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bulkupload-dhc/bulkupload-dhc.directive.js',
            ]
        },
        {
            name: '1_2_Bulk_Upload',
            files: [
                'app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload-config.factory.js',
                'app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload-directive.js',
                'app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload.controller.js',
                'app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload.html',
                'app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload.css'
            ]
        },
        //ICM upload
        {
            name: 'icmupload-dhc',
            files: [
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icmupload-dhc/icmupload-dhc.css',
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icmupload-dhc/icmupload-dhc.controller.js',
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icmupload-dhc/icmupload-dhc.directive.js'
            ]
        }, {
            name: '1_3_ICM_List',
            files: [
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_3_icm_list/1_3_icm.css',
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_3_icm_list/1_3_icm.controller.js',
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_3_icm_list/1_3_icm-config.factory.js'
            ]
        },
        {
            name: '1_3_ICMUpload',
            files: [
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_2_icm-upload.css',
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_2_icm-upload.controller.js',
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_2_icm-upload-config.factory.js',
                'app/eaxis/buyer/freight/container/1_2_icm-upload/1_2_icm-upload-directive.js'
            ]
        },
        {
            name: 'isfupload-dhc',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/isfupload-dhc/isfupload-dhc.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/isfupload-dhc/isfupload-dhc.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/isfupload-dhc/isfupload-dhc.directive.js'
            ]
        },
        {
            name: 'icm-planned-delivery',
            files: [
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-planned-delivery/icm-planned-delivery.controller.js',
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-planned-delivery/icm-planned-delivery.directive.js'
            ]
        },
        {
            name: 'icm-actual-pickup',
            files: [
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-pickup/icm-actual-pickup.controller.js',
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-pickup/icm-actual-pickup.directive.js'
            ]
        },
        {
            name: 'icm-actual-delivery',
            files: [
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-delivery/icm-actual-delivery.controller.js',
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-delivery/icm-actual-delivery.directive.js'
            ]
        },
        {
            name: 'icm-actual-empty-return',
            files: [
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-empty-return/icm-actual-empty-return.controller.js',
                'app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-empty-return/icm-actual-empty-return.directive.js'
            ]
        },
        //ICM Track Containers
        {
            name: 'cnt-buyer-view-template-list',
            files: [
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/3_track-container.css',
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/3_track-container-config.factory.js',
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/3_track-container.controller.js'
            ]
        }, {
            name: 'cnt-buyer-view-template',
            files: [
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view-template/cnt-buyer-view-template.directive.js',
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view-template/cnt-buyer-view-template.controller.js',
            ]
        }, {
            name: 'cnt-buyer-view-general',
            files: [
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/general/general.directive.js',
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/general/general.controller.js',
            ]
        }, {
            name: 'cnt-buyer-view-order',
            files: [
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/order/order.directive.js',
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/order/order.controller.js',
            ]
        },
        {
            name: 'cnt-buyer-view-shipment',
            files: [
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/shipment/shipment.directive.js',
                'app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/shipment/shipment.controller.js',
            ]
        },
        {
            name: 'container-delivery-details',
            files: [
                'app/eaxis/buyer/freight/container/1_2_container-deliverydetails/1_2_container-deliverydetails.controller.js',
                'app/eaxis/buyer/freight/container/1_2_container-deliverydetails/1_2_container-deliverydetails.css',
                'app/eaxis/buyer/freight/container/1_2_container-deliverydetails/1_2_container-deliverydetails.directive.js'
            ]
        },
        {
            name: 'bl-data-integration',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bl-data-integration/bl-data-integration.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bl-data-integration/bl-data-integration.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/bl-data-integration/bl-data-integration.directive.js'
            ]
        },
        {
            name: 'icm-request-delivery-toolbar',
            files: [
                'app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar.controller.js',
                'app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar.css',
                'app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar.directive.js'
            ]
        },
        {
            name: 'icm-request-delivery-toolbar-modal',
            files: [
                'app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar_modal/icm_request_delivery_toolbar_modal.controller.js',
                'app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar_modal/icm_request_delivery_toolbar_modal.css'
            ]
        },
        {
            name: 'FreightDocList',
            files: [
                'app/eaxis/buyer/documents/all-documents.css',
                'app/eaxis/buyer/documents/all-documents.controller.js',
                'app/eaxis/buyer/documents/all-documents-config.factory.js'
            ]
        },
        //FTZ
        {
            name: 'ftzdoc-dhc',
            files: [
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/ftzdoc-dhc/ftzdoc-dhc.css',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/ftzdoc-dhc/ftzdoc-dhc.controller.js',
                'app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/ftzdoc-dhc/ftzdoc-dhc.directive.js'
            ]
        },
        //Import Process
        {
            name: '1_4_importSeaConsolManifestFilingVltDirective',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-manifest-filing-vlt/import-sea-consol-manifest-filing-vlt.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-manifest-filing-vlt/import-sea-consol-manifest-filing-vlt.controller.js'
            ]
        }, {
            name: '1_4_importSeaConsolForwarderDoVltDirective',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-forwarder-do-vlt/import-sea-consol-forwarder-do-vlt.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-forwarder-do-vlt/import-sea-consol-forwarder-do-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaConsolCnfrmTranshpVltDirective',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-cnfrm-transhp-vlt/import-sea-consol-cnfrm-transhp-vlt.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-cnfrm-transhp-vlt/import-sea-consol-cnfrm-transhp-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaConsolConfirmRailoutVltDirective',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-confirm-railout-vlt/import-sea-consol-confirm-railout-vlt.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-confirm-railout-vlt/import-sea-consol-confirm-railout-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaConsolConfirmArrivalVltDirective',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-confirm-arrival-vlt/import-sea-consol-confirm-arrival-vlt.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-confirm-arrival-vlt/import-sea-consol-confirm-arrival-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaShipmentChaInvVltDirective',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-cha-inv-vlt/import-sea-shipment-cha-inv-vlt.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-cha-inv-vlt/import-sea-shipment-cha-inv-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaShipmentChecklistApprovalVltDirective',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-checklist-approval-vlt/import-sea-shipment-checklist-approval-vlt.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-checklist-approval-vlt/import-sea-shipment-checklist-approval-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaShipmentChecklistVltDirective',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-checklist-vlt/import-sea-shipment-checklist-vlt.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-checklist-vlt/import-sea-shipment-checklist-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaShipmentCustomDeclarationVltDirective',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-custom-declaration-vlt/import-sea-shipment-custom-declaration-vlt.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-custom-declaration-vlt/import-sea-shipment-custom-declaration-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaShpFrwdInvDirective',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-forwarder-inv-vlt/import-sea-shipment-forwarder-inv-vlt.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-forwarder-inv-vlt/import-sea-shipment-forwarder-inv-vlt.controller.js'
            ]
        },
        {
            name: '1_4_importSeaShipmentInspectionClrVltDirective',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-inspection-clr-vlt/import-sea-shipment-inspection-clr-vlt.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-inspection-clr-vlt/import-sea-shipment-inspection-clr-vlt.controller.js'
            ]
        },
        {
            name: 'DynamicInformationSummaryDirective',
            files: [
                'app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.controller.js',
                'app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.directive.js',
                'app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.css',
            ]
        },
        {
            name: 'BuyerActivityTemplate1',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/buyer-activity-template1/buyer-activity-template1.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/buyer-activity-template1/buyer-activity-template1.controller.js'
            ]
        }, {
            name: 'BuyerActivityFormTemplate1',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/buyer-activity-form-template1/buyer-activity-form-template1.css',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/buyer-activity-form-template1/buyer-activity-form-template1.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/buyer-activity-form-template1/buyer-activity-form-template1.controller.js'
            ]
        }, {
            name: 'BuyerActivityTemplateContainer1',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/activity-template-container1/activity-template-container1.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/activity-template-container1/activity-template-container1.controller.js'
            ]
        }, {
            name: 'BuyerActivityTemplateConsol1',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/1_4_buyer_frwd.css',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/buyer-activity-template-consol1/buyer-activity-template-consol1.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/buyer-activity-template-consol1/buyer-activity-template-consol1.controller.js',
            ]
        }, {
            name: 'ConsolDetailsGlb',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/consol-details-glb/consol-details-glb.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/consol-details-glb/consol-details-glb.controller.js'
            ]
        },
        {
            name: 'ShipmentDetailsGlb',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/shipment-details-glb/shipment-details-glb.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/shipment-details-glb/shipment-details-glb.controller.js'
            ]
        }, {
            name: 'ContainerDetailsGlb',
            files: [
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/container-details-glb/container-details-glb.directive.js',
                'app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/container-details-glb/container-details-glb.controller.js'
            ]
        }, {
            name: 'RoutingGridDirective',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/routing-grid/routing-grid.css',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/routing-grid/routing-grid.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/routing-grid/routing-grid.controller.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/routing-grid/routing-grid-popup.controller.js'
            ]
        },
        {
            name: 'ShipmentDetailsListGlb',
            files: [
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/shipment-details-list-glb/shipment-details-list-glb.directive.js',
                'app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/shipment-details-list-glb/shipment-details-list-glb.controller.js'
            ]
        }

        ]
    };

    angular
        .module("Application")
        .constant("FREIGHTS_CONSTANT", FREIGHTS_CONSTANT);
})();