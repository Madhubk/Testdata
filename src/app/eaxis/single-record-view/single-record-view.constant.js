(function () {
    'use strict';

    var SRV_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'singleRecordView',
            files: [
                'app/eaxis/single-record-view/single-record-view.css',
                'app/eaxis/single-record-view/single-record-view.controller.js'
            ]
        }, {
            name: 'SRVShipment',
            files: [
                'app/eaxis/single-record-view/shipment/shipment.controller.js'
            ]
        }, {
            name: 'SRVPickOrder',
            files: [
                'app/eaxis/single-record-view/pick-order/pick-order-page.controller.js'
            ]
        }, {
            name: 'SRVTransOrder',
            files: [
                'app/eaxis/single-record-view/trans-order/trans-order-page.controller.js'
            ]
        }, {
            name: 'SRVTransinOrder',
            files: [
                'app/eaxis/single-record-view/trans-inorder/trans-inorder-page.controller.js'
            ]
        }, {
            name: 'SRVOutwardPick',
            files: [
                'app/eaxis/single-record-view/outward-pick/outward-pick.controller.js'
            ]
        }, {
            name: 'SRVOutwardRelease',
            files: [
                'app/eaxis/single-record-view/outward-release/outward-release.controller.js'
            ]
        }, {
            name: 'SRVOrder',
            files: [
                'app/eaxis/single-record-view/order/orderSRV.controller.js'
            ]
        }, {
            name: 'SRVBooking',
            files: [
                'app/eaxis/single-record-view/booking/booking-SRV.controller.js'
            ]
        }, {
            name: 'SRVConsignment',
            files: [
                'app/eaxis/single-record-view/consignment/consignment.controller.js'
            ]
        }, {
            name: 'SRVManifestItem',
            files: [
                'app/eaxis/single-record-view/manifest-item/manifest-item.controller.js'
            ]
        }, {
            name: 'SRVReceiveLines',
            files: [
                'app/eaxis/single-record-view/receive-lines/receive-lines.controller.js'
            ]
        }, {
            name: 'SRVConsignmentItem',
            files: [
                'app/eaxis/single-record-view/consignment-item/consignment-item.controller.js'
            ]
        }, {
            name: 'SRVManifest',
            files: [
                'app/eaxis/single-record-view/manifest/manifest.controller.js'
            ]
        }, {
            name: 'SRVManifestEditable',
            files: [
                'app/eaxis/single-record-view/manifest-editable/manifest-editable.controller.js'
            ]
        }, {
            name: 'SRVPoUpload',
            files: [
                'app/eaxis/single-record-view/po-upload/pouploadSRV.controller.js'
            ]
        }, {
            name: 'SRVPoOrder',
            files: [
                'app/eaxis/single-record-view/po-order/po-orderSRV.controller.js'
            ]
        }, {
            name: 'UploadSLI',
            files: [
                'app/eaxis/single-record-view/upload-sli/upload-sli.controller.js'
            ]
        }, {
            name: 'SRVConsignmentOutward',
            files: [
                'app/eaxis/single-record-view/consignment-outward/consignment-outward.controller.js'
            ]
        }, {
            name: 'SRVConsolidation',
            files: [
                'app/eaxis/single-record-view/consolidation/consolidation.controller.js'
            ]
        }, {
            name: "SRVOrderView",
            files: [
                'app/eaxis/buyer/purchase-order/shared/single-record-view/order-view/order-view.controller.js'
            ]
        }]
    };

    angular
        .module("Application")
        .constant("SRV_CONSTANT", SRV_CONSTANT);
})();