(function () {
    'use strict';

    var PURCHASE_ORDER_CONSTANT = {
        ocLazyLoadModules: [{
                name: 'PurchaseOrder',
                files: [
                    'app/eaxis/purchase-order/purchase-order.css',
                    'app/eaxis/purchase-order/purchase-order.controller.js'
                ]
            }, {
                name: 'orderDashboard',
                files: [
                    'app/eaxis/purchase-order/order-dashboard/order-dashboard.css',
                    'app/eaxis/purchase-order/order-dashboard/order-dashboard.controller.js',
                    'app/eaxis/purchase-order/order-dashboard/order-dashboard-config.factory.js'
                ]
            }, {
                name: 'order',
                files: [
                    'app/eaxis/purchase-order/order/order.css',
                    'app/eaxis/purchase-order/order/order.controller.js',
                    'app/eaxis/purchase-order/order/order-config.factory.js'
                ]
            }, {
                name: 'orderMenu',
                files: [
                    'app/eaxis/purchase-order/order/order-menu/order-menu.css',
                    'app/eaxis/purchase-order/order/order-menu/order-menu.directive.js',
                    'app/eaxis/purchase-order/order/order-menu/order-menu.controller.js',
                    'app/eaxis/purchase-order/order/order-menu/action-modal/action-modal.controller.js'
                ]
            }, {
                name: 'orderGeneral',
                files: [
                    'app/eaxis/purchase-order/order/general/order-general.css',
                    'app/eaxis/purchase-order/order/general/order-general.directive.js',
                    'app/eaxis/purchase-order/order/general/order-general.controller.js'
                ]
            }, {
                name: 'orderLines',
                files: [
                    'app/eaxis/purchase-order/order/order-lines/order-lines.css',
                    'app/eaxis/purchase-order/order/order-lines/order-lines.directive.js',
                    'app/eaxis/purchase-order/order/order-lines/order-lines.controller.js',
                    'app/eaxis/purchase-order/order/order-lines/order-lines-modal.controller.js'
                ]
            }, {
                name: 'prodSummary',
                files: [
                    'app/eaxis/purchase-order/order/prod-summary/prod-summary.css',
                    'app/eaxis/purchase-order/order/prod-summary/prod-summary.directive.js',
                    'app/eaxis/purchase-order/order/prod-summary/prod-summary.controller.js',
                ]
            }, {
                name: 'orderLinesFormDirective',
                files: [
                    'app/eaxis/purchase-order/order/order-lines/form-directive/lines-form.css',
                    'app/eaxis/purchase-order/order/order-lines/form-directive/lines-form.directive.js',
                    'app/eaxis/purchase-order/order/order-lines/form-directive/lines-form.controller.js'
                ]
            }, {
                name: 'orderCargoReadiness',
                files: [
                    'app/eaxis/purchase-order/order/cargo-readiness/order-cargo-readiness.css',
                    'app/eaxis/purchase-order/order/cargo-readiness/order-cargo-readiness.directive.js',
                    'app/eaxis/purchase-order/order/cargo-readiness/order-cargo-readiness.controller.js'
                ]
            }, {
                name: 'orderShipmentPreAdvice',
                files: [
                    'app/eaxis/purchase-order/order/shipment-pre-advice/order-shipment-pre-advice.css',
                    'app/eaxis/purchase-order/order/shipment-pre-advice/order-shipment-pre-advice.directive.js',
                    'app/eaxis/purchase-order/order/shipment-pre-advice/order-shipment-pre-advice.controller.js'
                ]
            }, {
                name: 'orderVesselPlanning',
                files: [
                    'app/eaxis/purchase-order/order/shipment-pre-advice/vessel-planning/vessel-planning-modal.css',
                    'app/eaxis/purchase-order/order/shipment-pre-advice/vessel-planning/vessel-planning-modal.controller.js'
                ]
            }, {
                name: 'orderShipment',
                files: [
                    'app/eaxis/purchase-order/order/shipment/order-shipment.css',
                    'app/eaxis/purchase-order/order/shipment/order-shipment.directive.js',
                    'app/eaxis/purchase-order/order/shipment/order-shipment.controller.js'
                ]
            }, {
                name: 'sfuDirective',
                files: [
                    'app/eaxis/purchase-order/sfu-directive/sfu-directive.css',
                    'app/eaxis/purchase-order/sfu-directive/sfu-directive.directive.js',
                    'app/eaxis/purchase-order/sfu-directive/sfu-directive.controller.js'
                ]
            }, {
                name: 'sfuGridDirective',
                files: [
                    'app/eaxis/purchase-order/sfu-directive/sfu-grid/sfu-grid-directive.css',
                    'app/eaxis/purchase-order/sfu-directive/sfu-grid/sfu-grid.directive.js',
                    'app/eaxis/purchase-order/sfu-directive/sfu-grid/sfu-grid.controller.js'
                ]
            }, {
                name: 'sfuHistory',
                files: [
                    'app/eaxis/purchase-order/sfu-directive/followup-history-modal/followup-history.css',
                    'app/eaxis/purchase-order/sfu-directive/followup-history-modal/followup-history.controller.js'
                ]
            }, {
                name: 'pagination',
                files: [
                    'app/eaxis/purchase-order/sfu-directive/pagination/pagination.css',
                    'app/eaxis/purchase-order/sfu-directive/pagination/pagination.directive.js',
                    'app/eaxis/purchase-order/sfu-directive/pagination/pagination.controller.js'
                ]
            }, {
                name: 'preAdviceBookingDirective',
                files: [
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-directive.css',
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-directive.directive.js',
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-directive.controller.js'
                ]
            }, {
                name: 'preAdviceGirdDirective',
                files: [
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-grid/pre-advice-grid.css',
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-grid/pre-advice-grid.directive.js',
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-grid/pre-advice-grid.controller.js'
                ]
            }, {
                name: 'VesselPanningPreAdvice',
                files: [
                    'app/eaxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.css',
                    'app/eaxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.controller.js'
                ]
            }, {
                name: 'SendPreAdviceMailHistory',
                files: [
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-history-modal/pre-advice-history-modal.css',
                    'app/eaxis/purchase-order/pre-advice-directive/pre-advice-history-modal/pre-advice-history-modal.controller.js'
                ]
            },
            // region Order Lines
            {
                name: 'orderSplit',
                files: [
                    'app/eaxis/purchase-order/order/split/order-split.css',
                    'app/eaxis/purchase-order/order/split/order-split.directive.js',
                    'app/eaxis/purchase-order/order/split/order-split.controller.js'
                ]
            }, {
                name: 'orderLinesFiles',
                files: [
                    'app/eaxis/purchase-order/order-lines/order-lines.css',
                    'app/eaxis/purchase-order/order-lines/order-lines.controller.js',
                    'app/eaxis/purchase-order/order-lines/order-lines-config.factory.js'
                ]
            }, {
                name: 'orderLinesDirective',
                files: [
                    'app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines.directive.css',
                    'app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines-directive.controller.js',
                    'app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines.directive.js',
                ]
            },
            // endregion
            // region Pre Advice
            {
                name: 'preAdvice',
                files: [
                    'app/eaxis/purchase-order/pre-advice/pre-advice.css',
                    'app/eaxis/purchase-order/pre-advice/pre-advice.controller.js',
                    'app/eaxis/purchase-order/pre-advice/pre-advice-config.factory.js'
                ]
            }, {
                name: 'preAdviceDirective',
                files: [
                    'app/eaxis/purchase-order/pre-advice/pre-advice-directive/pre-advice.directive.css',
                    'app/eaxis/purchase-order/pre-advice/pre-advice-directive/pre-advice.directive.controller.js',
                    'app/eaxis/purchase-order/pre-advice/pre-advice-directive/pre-advice.directive.js',
                ]
            }, {
                name: 'preAdviceModal',
                files: [
                    'app/eaxis/purchase-order/pre-advice/shipment-pre-advice-modal/shipment-pre-advice-modal.css',
                    'app/eaxis/purchase-order/pre-advice/shipment-pre-advice-modal/shipment-pre-advice-modal.controller.js'
                ]
            }, {
                name: 'preAdviceDetachModal',
                files: [
                    'app/eaxis/purchase-order/pre-advice/detach-modal/pre-advice-detach-modal.css',
                    'app/eaxis/purchase-order/pre-advice/detach-modal/pre-advice-detach-modal.controller.js'
                ]
            }, {
                name: 'preAdviceCancelModal',
                files: [
                    'app/eaxis/purchase-order/pre-advice/pre-advice-cancel-modal/pre-advice-cancel-modal.css',
                    'app/eaxis/purchase-order/pre-advice/pre-advice-cancel-modal/pre-advice-cancel-modal.controller.js'
                ]
            },
            // endregion
            // region PO Batch Upload
            {
                name: 'poBatchUpload',
                files: [
                    'app/eaxis/purchase-order/po-batch-upload/po-batch-upload.css',
                    'app/eaxis/purchase-order/po-batch-upload/po-batch-upload.controller.js',
                    'app/eaxis/purchase-order/po-batch-upload/po-batch-upload-config.factory.js'
                ]
            }, {
                name: 'poBatchUploadDirective',
                files: [
                    'app/eaxis/purchase-order/po-batch-upload/po-batch-upload-directive/po-batch-upload-directive.css',
                    'app/eaxis/purchase-order/po-batch-upload/po-batch-upload-directive/po-batch-upload-directive.controller.js',
                    'app/eaxis/purchase-order/po-batch-upload/po-batch-upload-directive/po-batch-upload.directive.js',
                ]
            }, {
                name: 'orderReport',
                files: [
                    'app/eaxis/purchase-order/order-report/order-report.css',
                    'app/eaxis/purchase-order/order-report/order-report.controller.js'
                ]
            }, {
                name: 'orderLinesDirective',
                files: [
                    'app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines.directive.css',
                    'app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines-directive.controller.js',
                    'app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines.directive.js',
                ]
            },
            // endregion
            // region MyTask
            // PO Upload
            {
                name: 'POBatchUploadedDirective',
                files: [
                    'app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po.directive.js',
                    'app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po.controller.js',
                    'app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po.css'
                ]
            }, {
                name: 'POBatchUploadedEditDirective',
                files: [
                    'app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po-edit/upload-po-edit.directive.js',
                    'app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po-edit/upload-po-edit.controller.js',
                    'app/eaxis/purchase-order/po-batch-upload/my-task/my-task-directive/upload-po/upload-po-edit/upload-po-edit.css'
                ]
            },
            // Supplier Follow Up 
            {
                name: 'SfuMailDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail.css'
                ]
            }, {
                name: 'SfuMailEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.css'
                ]
            }, {
                name: 'SfuCRDUpdateDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update.css'
                ]
            }, {
                name: 'SfuCRDUpdateEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.css'
                ]
            }, {
                name: 'SfuReadOnlyGridDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid-directive.css'
                ]
            }, {
                name: 'SfuUpdateGridDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid-directive.css'
                ]
            },
            // Shipment Pre-Advice Task
            {
                name: 'SpaMailDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail.css'
                ]
            }, {
                name: 'SpaMailEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-edit/spa-mail-edit.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-edit/spa-mail-edit.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-edit/spa-mail-edit.css'
                ]
            }, {
                name: 'SpaReadOnlyGridDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-grid/spa-mail-grid.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-grid/spa-mail-grid.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-grid/spa-mail-grid-directive.css'
                ]
            }, {
                name: 'SpaVesselModal',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-vessel-modal/spa-mail-vessel-modal.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-vessel-modal/spa-mail-vessel-modal.css'
                ]
            },
            // convert to booking
            {
                name: 'ConvertToBookingMail',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking.css'
                ]
            }, {
                name: 'ConvertToBookingMailEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/convert-booking-edit.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/convert-booking-branch-edit.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/convert-booking-supplier-edit.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/orderline-popup.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/convert-booking-edit.css'
                ]
            }, {
                name: 'ConvertToBookingVesselPlanning',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-vessel-modal/convert-booking-vessel-modal.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-vessel-modal/convert-booking-vessel-modal.css'
                ]
            }, {
                name: 'ConvertToBookingReadOnlyGrid',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-grid/convert-booking-grid.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-grid/convert-booking-grid.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-grid/convert-booking-grid-directive.css'
                ]
            },
            // endregion
            // region Order Action
            {
                name: 'orderAction',
                files: [
                    'app/eaxis/purchase-order/order/order-action/order-action.css',
                    'app/eaxis/purchase-order/order/order-action/order-action.directive.js',
                    'app/eaxis/purchase-order/order/order-action/order-action.controller.js'
                ]
            },
            // endregion
            // region Order Custom Tool Bar
            {
                name: 'OrderCustomToolBar',
                files: [
                    'app/eaxis/purchase-order/order/order-tool-bar/order-tool-bar.css',
                    'app/eaxis/purchase-order/order/order-tool-bar/order-tool-bar.directive.js',
                    'app/eaxis/purchase-order/order/order-tool-bar/order-tool-bar.controller.js'
                ]
            },
            {
                name: 'ActiveCustomToolBar',
                files: [
                    'app/eaxis/purchase-order/order/order-tool-bar/order-activation-directive/order-activation.css',
                    'app/eaxis/purchase-order/order/order-tool-bar/order-activation-directive/order-activation.controller.js',
                    'app/eaxis/purchase-order/order/order-tool-bar/order-activation-directive/order-activation.directive.js',
                ]
            },
            // endregion
            {
                name: 'ConfrimDirective',
                files: [
                    'app/eaxis/purchase-order/order/order-confirmation/order-confirmation.css',
                    'app/eaxis/purchase-order/order/order-confirmation/order-confirmation.directive.js',
                    'app/eaxis/purchase-order/order/order-confirmation/order-confirmation.controller.js'
                ]
            },
            // region Order Confirmation Task
            {
                name: 'OrdConfirmDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm.css'
                ]
            }, {
                name: 'OrdConfirmEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm-edit/ord-confirm-edit.directive.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm-edit/ord-confirm-edit.controller.js',
                    'app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm-edit/ord-confirm-edit.css'
                ]
            }, {
                name: 'OrderConfirmationDirective',
                files: [
                    'app/eaxis/purchase-order/order/order-tool-bar/order-confirm-directive/order-confirmation.css',
                    'app/eaxis/purchase-order/order/order-tool-bar/order-confirm-directive/order-confirmation.directive.js',
                    'app/eaxis/purchase-order/order/order-tool-bar/order-confirm-directive/order-confirmation.controller.js'
                ]
            }, {
                name: 'CargoReadinessToolBarDirective',
                files: [
                    'app/eaxis/purchase-order/order/order-tool-bar/cargo-readiness-directive/cargo-readiness.css',
                    'app/eaxis/purchase-order/order/order-tool-bar/cargo-readiness-directive/cargo-readiness.directive.js',
                    'app/eaxis/purchase-order/order/order-tool-bar/cargo-readiness-directive/cargo-readiness.controller.js'
                ]
            }, {
                name: 'CargoReadinessInLineEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/cargo-readiness-inline/cargo-readiness-inline.css',
                    'app/eaxis/purchase-order/order/cargo-readiness-inline/cargo-readiness-inline.directive.js',
                    'app/eaxis/purchase-order/order/cargo-readiness-inline/cargo-readiness-inline.controller.js'
                ]
            }, {
                name: 'PreAdviceToolBarDirective',
                files: [
                    'app/eaxis/purchase-order/order/order-tool-bar/pre-advice-custom-toolbar-directive/pre-advice-custom-toolbar.css',
                    'app/eaxis/purchase-order/order/order-tool-bar/pre-advice-custom-toolbar-directive/pre-advice-custom-toolbar.directive.js',
                    'app/eaxis/purchase-order/order/order-tool-bar/pre-advice-custom-toolbar-directive/pre-advice-custom-toolbar.controller.js'
                ]
            }, {
                name: 'PreAdviceInLineEditDirective',
                files: [
                    'app/eaxis/purchase-order/order/pre-advice-inline/pre-advice-inline.css',
                    'app/eaxis/purchase-order/order/pre-advice-inline/pre-advice-inline.directive.js',
                    'app/eaxis/purchase-order/order/pre-advice-inline/pre-advice-inline.controller.js'
                ]
            }
        ]
    };

    angular
        .module("Application")
        .constant("PURCHASE_ORDER_CONSTANT", PURCHASE_ORDER_CONSTANT);
})();