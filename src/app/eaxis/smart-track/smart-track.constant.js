(function () {
    'use strict';

    var SMART_TRACK_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'smartTrack',
            files: [
                'app/eaxis/smart-track/smart-track.css',
                'app/eaxis/smart-track/smart-track.controller.js'
            ]
        }, {
            name: 'orderTracking',
            files: [
                'app/eaxis/smart-track/track-orders/track-orders.css',
                'app/eaxis/smart-track/track-orders/track-orders.controller.js'
            ]
        }, {
            name: 'orderTrackingDirective',
            files: [
                'app/eaxis/smart-track/track-orders/track-orders-directive/track-orders-directive.css',
                'app/eaxis/smart-track/track-orders/track-orders-directive/track-orders.directive.js',
                'app/eaxis/smart-track/track-orders/track-orders-directive/track-orders-directive.controller.js'
            ]
        }, {
            name: 'shipmentTracking',
            files: [
                'app/eaxis/smart-track/track-shipments/track-shipments.css',
                'app/eaxis/smart-track/track-shipments/track-shipments.controller.js'
            ]
        }, {
            name: 'shipmentTrackingDirective',
            files: [
                'app/eaxis/smart-track/track-shipments/track-shipment-directive/track-shipment-directive.css',
                'app/eaxis/smart-track/track-shipments/track-shipment-directive/track-shipment.directive.js',
                'app/eaxis/smart-track/track-shipments/track-shipment-directive/track-shipment-directive.controller.js'
            ]
        }, {
            name: 'shipmentDetailsTracking',
            files: [
                'app/eaxis/smart-track/track-shipments-details/track-shipments-details.css',
                'app/eaxis/smart-track/track-shipments-details/track-shipments-details.controller.js'
            ]
        }, {
            name: 'shipmentDetailsTrackingDirective',
            files: [
                'app/eaxis/smart-track/track-shipments-details/track-shipment-details-directive/track-shipment-details-directive.css',
                'app/eaxis/smart-track/track-shipments-details/track-shipment-details-directive/track-shipment-details.directive.js',
                'app/eaxis/smart-track/track-shipments-details/track-shipment-details-directive/track-shipment-details-directive.controller.js'
            ]
        }, {
            name: 'containerTracking',
            files: [
                'app/eaxis/smart-track/track-containers/track-containers.css',
                'app/eaxis/smart-track/track-containers/track-containers.controller.js',
                'app/eaxis/smart-track/track-containers/track-containers-config.factory.js'
            ]
        }, {
            name: 'containerTrackingDirective',
            files: [
                'app/eaxis/smart-track/track-containers/track-containers-directive/track-containers-directive.css',
                'app/eaxis/smart-track/track-containers/track-containers-directive/track-containers.directive.js',
                'app/eaxis/smart-track/track-containers/track-containers-directive/track-containers-directive.controller.js'
            ]
        }, {
            name: 'orderLinesTracking',
            files: [
                'app/eaxis/smart-track/track-order-lines/track-order-lines.css',
                'app/eaxis/smart-track/track-order-lines/track-order-lines.controller.js'
            ]
        }, {
            name: 'orderLinesTrackingDirective',
            files: [
                'app/eaxis/smart-track/track-order-lines/track-order-lines-directive/track-order-line-directive.css',
                'app/eaxis/smart-track/track-order-lines/track-order-lines-directive/track-order-line.directive.js',
                'app/eaxis/smart-track/track-order-lines/track-order-lines-directive/track-order-line-directive.controller.js'
            ]
        },{
            name: 'PackingGridDirective',
            files: [
                'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.css',
                'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.directive.js',
                'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.controller.js',
                'app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid-popup.controller.js'
            ]
        }, {
            name: 'ContainerEditableGridDirective1',
            files: [
                'app/eaxis/freight/consolidation/container-editable-grid/container/container.controller.js',
                'app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-edit.controller.js',
                'app/eaxis/freight/consolidation/container-editable-grid/container.directive.js',
                'app/eaxis/freight/consolidation/container-editable-grid/container.css'
            ]
        }
    ]
    };

    angular
        .module("Application")
        .constant("SMART_TRACK_CONSTANT", SMART_TRACK_CONSTANT);
})();
