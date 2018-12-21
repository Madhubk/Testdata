(function () {
    'use strict';

    var ORDER_CONSTANT = {
        ocLazyLoadModules: [{
                name: 'Order',
                files: [
                    'app/eaxis/shared/purchase-order/order.css',
                    'app/eaxis/shared/purchase-order/order.controller.js'
                ]
            }, {
                name: '1_order_list',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/1_order_list/1_order_list.css',
                    'app/eaxis/buyer/purchase-order/shared/1_order_list/1_order_list.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/1_order_list/1_order_list-config.factory.js'
                ]
            },
            {
                name: '1_1_order-menu',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-menu/1_1_order-menu.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-menu/1_1_order-menu.controller.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-menu/1_1_order-menu.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-menu/1_1_action-modal/1_1_action-modal.controller.js'
                ]
            }, {
                name: '1_1_order-general',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/general/1_1_order-general.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/general/1_1_order-general.controller.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/general/1_1_order-general.directive.js'
                ]
            }, {
                name: '1_1_orderLines',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/1_1_order-lines.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/1_1_order-lines.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/1_1_order-lines.controller.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/1_1_order-lines-modal.controller.js'
                ]
            }, {
                name: '1_1_orderLinesFormDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/form-directive/1_1_lines-form.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/form-directive/1_1_lines-form.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/form-directive/1_1_lines-form.controller.js'
                ]
            }, {
                name: '1_1_prodSummary',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_prod-summary/1_1_prod-summary.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_prod-summary/1_1_prod-summary.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_prod-summary/1_1_prod-summary.controller.js',
                ]
            }, {
                name: '1_1_orderCargoReadiness',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness/1_1_order-cargo-readiness.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness/1_1_order-cargo-readiness.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness/1_1_order-cargo-readiness.controller.js'
                ]
            }, {
                name: '1_1_orderShipmentPreAdvice',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_order-shipment-pre-advice.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_order-shipment-pre-advice.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_order-shipment-pre-advice.controller.js'
                ]
            }, {
                name: '1_1_orderVesselPlanning',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_vessel-planning/1_1_vessel-planning-modal.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_vessel-planning/1_1_vessel-planning-modal.controller.js'
                ]
            }, {
                name: '1_1_orderShipment',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment/1_1_order-shipment.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment/1_1_order-shipment.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment/1_1_order-shipment.controller.js'
                ]
            }, {
                name: '1_1_orderSplit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_split/1_1_order-split.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_split/1_1_order-split.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_split/1_1_order-split.controller.js'
                ]
            }, {
                name: '1_1_orderAction',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-action/1_1_order-action.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-action/1_1_order-action.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-action/1_1_order-action.controller.js'
                ]
            },
            // region Order Custom Tool Bar
            {
                name: '1_1_OrderCustomToolBar',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-tool-bar.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-tool-bar.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-tool-bar.controller.js'
                ]
            },
            {
                name: '1_1_ActiveCustomToolBar',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-activation-directive/1_1_order-activation.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-activation-directive/1_1_order-activation.controller.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-activation-directive/1_1_order-activation.directive.js',
                ]
            }, {
                name: '1_1_OrderConfirmationDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-confirm-directive/1_1_order-confirmation.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-confirm-directive/1_1_order-confirmation.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-confirm-directive/1_1_order-confirmation.controller.js'
                ]
            }, {
                name: '1_1_ConfrimDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-confirmation/1_1_order-confirmation.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-confirmation/1_1_order-confirmation.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-confirmation/1_1_order-confirmation.controller.js'
                ]
            }, {
                name: '1_1_CargoReadinessToolBarDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_cargo-readiness-directive/1_1_cargo-readiness.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_cargo-readiness-directive/1_1_cargo-readiness.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_cargo-readiness-directive/1_1_cargo-readiness.controller.js'
                ]
            }, {
                name: '1_1_CargoReadinessInLineEditDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness-inline/1_1_cargo-readiness-inline.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness-inline/1_1_cargo-readiness-inline.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness-inline/1_1_cargo-readiness-inline.controller.js'
                ]
            }, {
                name: '1_1_PreAdviceToolBarDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_pre-advice-custom-toolbar-directive/1_1_pre-advice-custom-toolbar.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_pre-advice-custom-toolbar-directive/1_1_pre-advice-custom-toolbar.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_pre-advice-custom-toolbar-directive/1_1_pre-advice-custom-toolbar.controller.js'
                ]
            }, {
                name: '1_1_PreAdviceInLineEditDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_pre-advice-inline/1_1_pre-advice-inline.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_pre-advice-inline/1_1_pre-advice-inline.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_pre-advice-inline/1_1_pre-advice-inline.controller.js'
                ]
            }, {
                name: '1_2_view-template',
                files: [
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/ord-buyer-supplier-view-template/ord-buyer-supplier-view-template.directive.js',
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/ord-buyer-supplier-view-template/ord-buyer-supplier-view-template.controller.js'
                ]
            }, {
                name: '1_2_order-view-default-general',
                files: [
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/general/general.directive.js',
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/general/general.controller.js'
                ]
            }, {
                name: '1_2_order-view-default-shipment',
                files: [
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/shipment/shipment.directive.js',
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/shipment/shipment.controller.js'
                ]
            }, {
                name: '1_2_order-view-default-sub-po',
                files: [
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/sub-po/sub-po.directive.js',
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/sub-po/sub-po.controller.js'
                ]
            }, {
                name: '1_2_order-view-default-order-line',
                files: [
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/order-line/order-line.directive.js',
                    'app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/order-line/order-line.controller.js'
                ]
            }, {
                name: '1_1_my-task',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/my-task/1_1_my-task.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/my-task/1_1_my-task.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/my-task/1_1_my-task.controller.js'
                ]
            },
            // buyer forwarder 
            {
                name: '1_3_order-menu',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-menu/1_3_order-menu.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-menu/1_3_order-menu.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-menu/1_3_order-menu.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-menu/1_3_action-modal/1_3_action-modal.controller.js'
                ]
            }, {
                name: '1_3_order_general',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/general/1_3_order-general.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/general/1_3_order-general.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/general/1_3_order-general.directive.js'
                ]
            }, {
                name: '1_3_orderLines',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/1_3_order-lines.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/1_3_order-lines.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/1_3_order-lines.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/1_3_order-lines-modal.controller.js'
                ]
            }, {
                name: '1_3_orderLinesFormDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/form-directive/1_3_lines-form.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/form-directive/1_3_lines-form.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/form-directive/1_3_lines-form.controller.js'
                ]
            }, {
                name: '1_3_prodSummary',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_prod-summary/1_3_prod-summary.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_prod-summary/1_3_prod-summary.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_prod-summary/1_3_prod-summary.controller.js',
                ]
            }, {
                name: '1_3_orderCargoReadiness',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_cargo-readiness/1_3_order-cargo-readiness.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_cargo-readiness/1_3_order-cargo-readiness.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_cargo-readiness/1_3_order-cargo-readiness.controller.js'
                ]
            }, {
                name: '1_3_orderShipmentPreAdvice',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment-pre-advice/1_3_order-shipment-pre-advice.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment-pre-advice/1_3_order-shipment-pre-advice.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment-pre-advice/1_3_order-shipment-pre-advice.controller.js'
                ]
            }, {
                name: '1_3_orderVesselPlanning',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment-pre-advice/1_3_vessel-planning/1_3_vessel-planning-modal.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment-pre-advice/1_3_vessel-planning/1_3_vessel-planning-modal.controller.js'
                ]
            }, {
                name: '1_3_orderShipment',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment/1_3_order-shipment.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment/1_3_order-shipment.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment/1_3_order-shipment.controller.js'
                ]
            }, {
                name: '1_3_orderSplit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_split/1_3_order-split.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_split/1_3_order-split.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_split/1_3_order-split.controller.js'
                ]
            }, {
                name: '1_3_orderAction',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-action/1_3_order-action.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-action/1_3_order-action.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-action/1_3_order-action.controller.js'
                ]
            }, {
                name: '1_3_my-task',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/my-task/1_3_my-task.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/my-task/1_3_my-task.directive.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/my-task/1_3_my-task.controller.js'
                ]
            },
            // forwarder_Buyer ReadOnly 
            , {
                name: '3_1_order-general',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_1_forwarder_buyer_order/3_1_order/general/3_1_order-general.css',
                    'app/eaxis/forwarder/purchase-order/3_1_forwarder_buyer_order/3_1_order/general/3_1_order-general.controller.js',
                    'app/eaxis/forwarder/purchase-order/3_1_forwarder_buyer_order/3_1_order/general/3_1_order-general.directive.js'
                ]
            },
            // region Buyer PO Batch Upload
            {
                name: '1_1_poBatchUpload',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload.controller.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload-config.factory.js'
                ]
            }, {
                name: '1_1_poBatchUploadDirective',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload-directive/1_1_po-batch-upload-directive.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload-directive/1_1_po-batch-upload-directive.controller.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload-directive/1_1_po-batch-upload.directive.js',
                ]
            },
            // forwarder only
            {
                name: '3_order_list',
                files: [
                    'app/eaxis/forwarder/purchase-order/shared/3_order_list/3_order_list.css',
                    'app/eaxis/forwarder/purchase-order/shared/3_order_list/3_order_list.controller.js',
                    'app/eaxis/forwarder/purchase-order/shared/3_order_list/3_order_list-config.factory.js'
                ]
            },
            {
                name: '3_3_order-menu',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-menu/3_3_order-menu.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-menu/3_3_order-menu.controller.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-menu/3_3_order-menu.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-menu/3_3_action-modal/3_3_action-modal.controller.js'
                ]
            }, {
                name: '3_3_order-general',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_general/3_3_order-general.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_general/3_3_order-general.controller.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_general/3_3_order-general.directive.js'
                ]
            }, {
                name: '3_3_orderLines',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_order-lines.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_order-lines.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_order-lines.controller.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_order-lines-modal.controller.js'
                ]
            }, {
                name: '3_3_orderLinesFormDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_form-directive/3_3_lines-form.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_form-directive/3_3_lines-form.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_form-directive/3_3_lines-form.controller.js'
                ]
            }, {
                name: '3_3_prodSummary',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_prod-summary/3_3_prod-summary.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_prod-summary/3_3_prod-summary.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_prod-summary/3_3_prod-summary.controller.js',
                ]
            }, {
                name: '3_3_orderCargoReadiness',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness/3_3_order-cargo-readiness.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness/3_3_order-cargo-readiness.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness/3_3_order-cargo-readiness.controller.js'
                ]
            }, {
                name: '3_3_orderShipmentPreAdvice',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_order-shipment-pre-advice.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_order-shipment-pre-advice.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_order-shipment-pre-advice.controller.js'
                ]
            }, {
                name: '3_3_orderVesselPlanning',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_vessel-planning/3_3_vessel-planning-modal.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_vessel-planning/3_3_vessel-planning-modal.controller.js'
                ]
            }, {
                name: '3_3_orderShipment',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment/3_3_order-shipment.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment/3_3_order-shipment.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment/3_3_order-shipment.controller.js'
                ]
            }, {
                name: '3_3_orderSplit',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_split/3_3_order-split.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_split/3_3_order-split.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_split/3_3_order-split.controller.js'
                ]
            }, {
                name: '3_3_orderAction',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-action/3_3_order-action.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-action/3_3_order-action.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-action/3_3_order-action.controller.js'
                ]
            }, // region Order Custom Tool Bar
            {
                name: '3_3_OrderCustomToolBar',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-tool-bar.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-tool-bar.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-tool-bar.controller.js'
                ]
            },
            {
                name: '3_3_ActiveCustomToolBar',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-activation-directive/3_3_order-activation.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-activation-directive/3_3_order-activation.controller.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-activation-directive/3_3_order-activation.directive.js',
                ]
            }, {
                name: '3_3_OrderConfirmationDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-confirm-directive/3_3_order-confirmation.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-confirm-directive/3_3_order-confirmation.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-confirm-directive/3_3_order-confirmation.controller.js'
                ]
            }, {
                name: '3_3_ConfrimDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-confirmation/3_3_order-confirmation.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-confirmation/3_3_order-confirmation.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-confirmation/3_3_order-confirmation.controller.js'
                ]
            }, {
                name: '3_3_CargoReadinessToolBarDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_cargo-readiness-directive/3_3_cargo-readiness.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_cargo-readiness-directive/3_3_cargo-readiness.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_cargo-readiness-directive/3_3_cargo-readiness.controller.js'
                ]
            }, {
                name: '3_3_CargoReadinessInLineEditDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness-inline/3_3_cargo-readiness-inline.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness-inline/3_3_cargo-readiness-inline.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness-inline/3_3_cargo-readiness-inline.controller.js'
                ]
            }, {
                name: '3_3_PreAdviceToolBarDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_pre-advice-custom-toolbar-directive/3_3_pre-advice-custom-toolbar.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_pre-advice-custom-toolbar-directive/3_3_pre-advice-custom-toolbar.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_pre-advice-custom-toolbar-directive/3_3_pre-advice-custom-toolbar.controller.js'
                ]
            }, {
                name: '3_3_PreAdviceInLineEditDirective',
                files: [
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_pre-advice-inline/3_3_pre-advice-inline.css',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_pre-advice-inline/3_3_pre-advice-inline.directive.js',
                    'app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_pre-advice-inline/3_3_pre-advice-inline.controller.js'
                ]
            },
            // Buyer_Forwarder ReadOnly 
            , {
                name: '1_3_order-general',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/1_3_general/1_3_order-general.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/1_3_general/1_3_order-general.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/1_3_general/1_3_order-general.directive.js'
                ]
            },
            // my-task order_buyer_forwarder
            {
                name: '1_3_order-follow-up',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-followup/one-three-ord-followup.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-followup/one-three-ord-followup.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-followup/one-three-ord-followup.directive.js'
                ]
            }, {
                name: '1_3_order-follow-up-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-followup/one-three-ord-followup-edit/one-three-ord-followup-edit.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-followup/one-three-ord-followup-edit/one-three-ord-followup-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-followup/one-three-ord-followup-edit/one-three-ord-followup-edit.directive.js'
                ]
            }, {
                name: '1_3_order-follow-up-grid-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-followup-grid/one-three-ord-followup-grid.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-followup-grid/one-three-ord-followup-grid.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-followup-grid/one-three-ord-followup-grid.directive.js'
                ]
            }, {
                name: '1_3_order-vessel-plan',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan.directive.js'
                ]
            }, {
                name: '1_3_order-vessel-plan-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan-edit/one-three-ord-vessel-plan-edit.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan-edit/one-three-ord-vessel-plan-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan-edit/one-three-ord-vessel-plan-edit.directive.js'
                ]
            }, {
                name: '1_3_order-vessel-plan-grid-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan-grid/one-three-ord-vessel-plan-grid.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan-grid/one-three-ord-vessel-plan-grid.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-ord-vessel-plan-grid/one-three-ord-vessel-plan-grid.directive.js'
                ]
            }, {
                name: '1_3_order-vessel-plan-modal',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-vessel-plan-modal/one-three-vessel-plan-modal.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-vessel-plan-modal/one-three-vessel-plan-modal.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-vessel-plan/one-three-vessel-plan-modal/one-three-vessel-plan-modal.directive.js'
                ]
            }, {
                name: '1_3_order-crd-update',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update.directive.js'
                ]
            }, {
                name: '1_3_order-crd-update-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update-edit/one-three-ord-crd-update-edit.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update-edit/one-three-ord-crd-update-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update-edit/one-three-ord-crd-update-edit.directive.js'
                ]
            }, {
                name: '1_3_order-crd-update-grid-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update-grid/one-three-ord-crd-update-grid.css',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update-grid/one-three-ord-crd-update-grid.controller.js',
                    'app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order_readonly/my-task/my-task-directive/one-three-ord-crd-update/one-three-ord-crd-update-grid/one-three-ord-crd-update-grid.directive.js'
                ]
            },
            // PO Buyer Orchestration my-task 
            // order confirmation
            {
                name: 'ord-confirm-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc.directive.js'
                ]
            },
            {
                name: 'ord-confirm-buyer-orc-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc-edit/ord-confirm-buyer-orc-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc-edit/ord-confirm-buyer-orc-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc-edit/ord-confirm-buyer-orc-edit.directive.js'
                ]
            },
            // mytask common activity pages
            {
                name: 'order-activity-details',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/order-details/order-details.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/order-details/order-details.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/order-details/order-details.directive.js'
                ]
            },
            {
                name: 'order-activity-shipment',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/shipment/shipment.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/shipment/shipment.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/shipment/shipment.directive.js'
                ]
            },
            {
                name: 'order-activity-lines',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/order-line/order-line.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/order-line/order-line.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/order-line/order-line.directive.js'
                ]
            },
            {
                name: 'order-activity-sub-po',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/sub-po/sub-po.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/sub-po/sub-po.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/activity-pages/sub-po/sub-po.directive.js'
                ]
            },
            // order followup mail
            {
                name: 'sfu-mail-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc.directive.js'
                ]
            },
            {
                name: 'sfu-mail-buyer-orc-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc-edit/sfu-mail-buyer-orc-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc-edit/sfu-mail-buyer-orc-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc-edit/sfu-mail-buyer-orc-edit.directive.js'
                ]
            },
            // Cargo Ready date 
            {
                name: 'crd-update-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc.directive.js'
                ]
            },
            {
                name: 'crd-update-buyer-orc-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc-edit/crd-update-buyer-orc-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc-edit/crd-update-buyer-orc-edit.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc-edit/crd-update-branch-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc-edit/crd-update-supplier-edit.controller.js'
                ]
            },
            // vessel planning
            {
                name: 'vessel-plan-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc.directive.js'
                ]
            },
            {
                name: 'vessel-plan-buyer-orc-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc-edit/vessel-plan-buyer-orc-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc-edit/vessel-plan-buyer-orc-edit.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc-edit/vessel-plan-buyer-orc-edit.controller.js'
                ]
            },
            {
                name: 'vessel-plan-modal-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-modal/vessel-plan-modal.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-modal/vessel-plan-modal.controller.js'
                ]
            },
            // convert to booking
            {
                name: 'convert-booking-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc.directive.js'
                ]
            },
            {
                name: 'convert-booking-buyer-orc-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc-edit/convert-booking-buyer-orc-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc-edit/convert-booking-buyer-orc.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc-edit/convert-booking-branch-edit.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc-edit/convert-booking-supplier-edit.controller.js'
                ]
            },
            {
                name: 'convert-booking-grid-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-grid/convert-booking-grid.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-grid/convert-booking-grid.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-grid/convert-booking-branch-grid.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-grid/convert-booking-supplier-grid.controller.js'
                ]
            },
            {
                name: 'convert-booking-vessel-buyer-orc',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-vessel-modal/convert-booking-vessel-modal.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-vessel-modal/convert-booking-vessel-modal.controller.js'
                ]
            },
            // order exception task
            // exception notify
            {
                name: 'ord-except-notify',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify.directive.js'
                ]
            },
            {
                name: 'ord-except-notify-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify-edit/ord-except-notify-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify-edit/ord-except-notify-edit.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify-edit/ord-except-notify-edit.controller.js'
                ]
            },
            // exception approval
            {
                name: 'ord-except-approval',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-approval/ord-except-approval.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-approval/ord-except-approval.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-approval/ord-except-approval.directive.js'
                ]
            },
            {
                name: 'ord-except-approval-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-approval/ord-except-approval-edit/ord-except-approval-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-approval/ord-except-approval-edit/ord-except-approval-edit.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-approval/ord-except-approval-edit/ord-except-approval-edit.controller.js'
                ]
            },
            // exception reject
            {
                name: 'ord-except-reject',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject.directive.js'
                ]
            },
            {
                name: 'ord-except-reject-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject-edit/ord-except-reject-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject-edit/ord-except-reject-edit.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject-edit/ord-except-reject-edit.controller.js'
                ]
            },
            // exception notify
            {
                name: 'ord-approval-notify',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify.directive.js'
                ]
            },
            {
                name: 'ord-approval-notify-edit',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify-edit/ord-approval-notify-edit.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify-edit/ord-approval-notify-edit.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify-edit/ord-approval-notify-edit.controller.js'
                ]
            },
            // exception comments
            {
                name: 'exception-comments',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/exception-comments/exception-comments.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/exception-comments/exception-comments.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/exception-comments/exception-comments.directive.js'
                ]
            },
            // order batch upload my-task
            {
                name: 'upload-do',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/upload-do/upload-do.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/upload-do/upload-do.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/upload-do/upload-do.directive.js'
                ]
            },
            {
                name: 'upload-po',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/upload-po/upload-po.css',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/upload-po/upload-po.controller.js',
                    'app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/upload-po/upload-po.directive.js'
                ]
            },
            // batch upload po and do pop-up ui
            {
                name: 'batch-upload-modal',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-upload-modal/batch-upload-modal.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-upload-modal/batch-upload-modal.controller.js',
                ]
            },
            // region Batch Custom Tool Bar
            {
                name: '1_1_BatchCustomToolBar',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-tool-bar/1_1_batch-tool-bar.directive.js',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-tool-bar/1_1_batch-tool-bar.controller.js'
                ]
            },
            // doc upload in batch dynamic grid
            {
                name: 'doc-upload-modal',
                files: [
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/doc-upload-modal/doc-upload-modal.css',
                    'app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/doc-upload-modal/doc-upload-modal.controller.js',
                ]
            },
            // buyer read only screen
            {
                name: 'ord-buyer-view-template',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view-template/ord-buyer-view-template.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view-template/ord-buyer-view-template.controller.js',
                ]
            },
            {
                name: 'ord-buyer-view-general',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/general/general.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/general/general.controller.js',
                ]
            },
            {
                name: 'ord-buyer-view-order-line',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/order-line/order-line.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/order-line/order-line.controller.js',
                ]
            },
            {
                name: 'ord-buyer-view-shipment',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/shipment/shipment.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/shipment/shipment.controller.js',
                ]
            },
            {
                name: 'ord-buyer-view-sub-po',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/sub-po/sub-po.directive.js',
                    'app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/sub-po/sub-po.controller.js',
                ]
            },
            // track-orders
            {
                name: 'track-order-list',
                files: [
                    'app/eaxis/buyer/purchase-order/shared/track-order/track-order.css',
                    'app/eaxis/buyer/purchase-order/shared/track-order/track-order.controller.js'
                ]
            }
        ]
    };

    angular
        .module("Application")
        .constant("ORDER_CONSTANT", ORDER_CONSTANT);
})();