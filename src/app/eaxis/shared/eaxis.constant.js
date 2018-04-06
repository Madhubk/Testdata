(function () {
    'use strict';

    var EAXIS_CONSTANT = {
        ocLazyLoadModules: [
            // --------------------- Common --------------------------
            // region
            {
                name: 'dynamicMultiDashboard',
                files: [
                    'app/eaxis/shared/dynamic-multi-dashboard/dynamic-multi-dashboard.css',
                    'app/eaxis/shared/dynamic-multi-dashboard/dynamic-multi-dashboard.directive.js',
                    'app/eaxis/shared/dynamic-multi-dashboard/dynamic-multi-dashboard.controller.js'
                ]
            }, {
                name: 'dynamicDetails',
                files: [
                    'app/eaxis/shared/dynamic-details/dynamic-details.css',
                    'app/eaxis/shared/dynamic-details/dynamic-details.controller.js'
                ]
            }, {
                name: 'dynamicDirective',
                files: [
                    'app/eaxis/shared/dynamic-directive/dynamic-directive.js'
                ]
            }, {
                name: 'EADynamicListView',
                files: [
                    'app/eaxis/shared/dynamic-list-view/dynamic-list-view.css',
                    'app/eaxis/shared/dynamic-list-view/dynamic-list-view.controller.js'
                ]
            }, {
                name: 'EADynamicDetailsView',
                files: [
                    'app/eaxis/shared/dynamic-details-view/dynamic-details-view.css',
                    'app/eaxis/shared/dynamic-details-view/dynamic-details-view.controller.js'
                ]
            },
            // endregion
            // --------------------- Single Record View --------------------------
            // #region
            {
                name: 'singleRecordView',
                files: [
                    'app/shared/single-record-view/single-record-view.css',
                    'app/shared/single-record-view/single-record-view.controller.js'
                ]
            }, {
                name: 'SRVShipment',
                files: [
                    'app/shared/single-record-view/shipment/shipment.controller.js'
                ]
            }, {
                name: 'SRVSupplier',
                files: [
                    'app/shared/single-record-view/supplier-follow-up/supplier-follow-up.controller.js'
                ]
            }, {
                name: 'SRVPreAdvice',
                files: [
                    'app/shared/single-record-view/shipment-pre-advice/shipment-pre-advice.controller.js'
                ]
            }, {
                name: 'SRVPickOrder',
                files: [
                    'app/shared/single-record-view/pick-order/pick-order-page.controller.js'
                ]
            }, {
                name: 'SRVTransOrder',
                files: [
                    'app/shared/single-record-view/trans-order/trans-order-page.controller.js'
                ]
            }, {
                name: 'SRVTransinOrder',
                files: [
                    'app/shared/single-record-view/trans-inorder/trans-inorder-page.controller.js'
                ]
            }, {
                name: 'SRVOutwardPick',
                files: [
                    'app/shared/single-record-view/outward-pick/outward-pick.controller.js'
                ]
            }, {
                name: 'SRVOutwardRelease',
                files: [
                    'app/shared/single-record-view/outward-release/outward-release.controller.js'
                ]
            }, {
                name: 'SRVOrder',
                files: [
                    'app/shared/single-record-view/order/orderSRV.controller.js'
                ]
            }, {
                name: 'SRVBooking',
                files: [
                    'app/shared/single-record-view/booking/booking-SRV.controller.js'
                ]
            }, {
                name: 'SRVConsignment',
                files: [
                    'app/shared/single-record-view/consignment/consignment.controller.js'
                ]
            }, {
                name: 'SRVManifestItem',
                files: [
                    'app/shared/single-record-view/manifest-item/manifest-item.controller.js'
                ]
            }, {
                name: 'SRVReceiveLines',
                files: [
                    'app/shared/single-record-view/receive-lines/receive-lines.controller.js'
                ]
            }, {
                name: 'SRVConsignmentItem',
                files: [
                    'app/shared/single-record-view/consignment-item/consignment-item.controller.js'
                ]
            }, {
                name: 'SRVManifest',
                files: [
                    'app/shared/single-record-view/manifest/manifest.controller.js'
                ]
            }, {
                name: 'SRVManifestEditable',
                files: [
                    'app/shared/single-record-view/manifest-editable/manifest-editable.controller.js'
                ]
            }, {
                name: 'SRVPoUpload',
                files: [
                    'app/shared/single-record-view/po-upload/pouploadSRV.controller.js'
                ]
            },
            // #endregion
            // --------------------- EAxis --------------------------
            // #region
            {
                name: 'eAxis',
                files: [
                    'app/eaxis/shared/eaxis.css',
                    'app/eaxis/shared/eaxis.controller.js'
                ]
            }, {
                name: 'eAxisHome',
                files: [
                    'app/eaxis/home/home.css',
                    'app/eaxis/home/home.controller.js'
                ]
            }, {
                name: 'eAxisDashboard',
                files: [
                    'app/eaxis/dashboard/dashboard.css',
                    'app/eaxis/dashboard/dashboard.controller.js'
                ]
            }, {
                name: 'externalDashboard',
                files: [
                    'app/eaxis/externaldashboard/external-dashboard.css',
                    'app/eaxis/externaldashboard/external-dashboard.controller.js',
                    'app/eaxis/externaldashboard/external-dashboard-config.factory.js'
                ]
            }, {
                name: 'warehouseDashboard',
                files: [
                    'app/eaxis/dashboard/warehouse/warehouse-dashboard.css',
                    'app/eaxis/dashboard/warehouse/warehouse-dashboard.controller.js',
                ]
            },
            // endregion
            // ------------ EAxis Lab ------------------
            // region
            {
                name: 'EALab',
                files: [
                    'app/eaxis/lab/lab.css',
                    'app/eaxis/lab/lab.controller.js'
                ]
            }, {
                name: 'eAxisDynamicPageList',
                files: [
                    'app/eaxis/lab/dynamic-page-list/dynamic-page-list.css',
                    'app/eaxis/lab/dynamic-page-list/dynamic-page-list.controller.js'
                ]
            }, {
                name: 'eAxisHtmlGeneration',
                files: [
                    'lib/html-generation/google-api.js',
                    'app/eaxis/lab/html-generation/html-generation.controller.js',
                    'app/eaxis/lab/html-generation/html-generation-config.factory.js'
                ]
            }, {
                serie: true,
                name: 'eAxisGraphicalInterface',
                files: [
                    'lib/graphical-interface/go.js',
                    'lib/graphical-interface/DrawCommandHandler.js',
                    'lib/graphical-interface/BPMNClasses.js',
                    'app/eaxis/lab/graphical-interface/graphical-interface.css',
                    'app/eaxis/lab/graphical-interface/graphical-interface.controller.js',
                    'app/eaxis/lab/graphical-interface/graphical-interface-config.factory.js'
                ]
            },
            // endregion
            // --------------------- My Task --------------------------
            // region
            {
                name: 'toDo',
                files: [
                    'app/eaxis/to-do/to-do.css',
                    'app/eaxis/to-do/to-do.controller.js',
                    'app/eaxis/to-do/to-do-config.factory.js'
                ]
            }, {
                name: 'MyTask',
                files: [
                    'app/eaxis/my-task/my-task.css',
                    'app/eaxis/my-task/my-task.controller.js',
                    'app/eaxis/my-task/my-task-config.factory.js'
                ]
            }, {
                name: 'MyTaskDynamicDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-dynamic-directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-dynamic-edit-directive.js'
                ]
            },
            // Default Directive
            {
                name: 'MyTaskDefaultDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default.css'
                ]
            }, {
                name: 'MyTaskDefaultEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default-edit/my-task-default-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default-edit/my-task-default-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default-edit/my-task-default-edit.css'
                ]
            },
            // Order 
            {
                name: 'OrderTaskDirectives',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks.css'
                ]
            }, {
                name: 'OrderTaskEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-edit/order-tasks-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-edit/order-tasks-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-edit/order-tasks-edit.css'
                ]
            },
            // Task
            {
                name: 'TaskEffortDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort.css'
                ]
            }, {
                name: 'TaskEffortEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.css'
                ]
            }, {
                name: 'TaskCreateDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create.css'
                ]
            }, {
                name: 'TaskCreateEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create-edit/tsk-create-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create-edit/tsk-create-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create-edit/tsk-create-edit.css'
                ]
            },
            // WMS
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
            // Shipment
            {
                name: 'SupplementaryTaxInvDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/supp-tax-inv.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/revcost-revenue-upl/revcost-revenue-upl.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/raise-supp-tax-inv/raise-supp-tax-inv-controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/verify-supp-tax-inv/verify-supp-tax-inv.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/amend-supp-tax-inv/amend-supp-tax-inv.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/dispatch-supp-tax-inv/dispatch-supp-tax-inv.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/supp-tax-inv.css'
                ]
            }, {
                name: 'SupplementaryTaxInvEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/supp-tax-inv-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/revcost-revenue-upl/revcost-revenue-upl-edit/revcost-revenue-upl-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/raise-supp-tax-inv/raise-supp-tax-inv-edit/raise-supp-tax-inv-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/verify-supp-tax-inv/verify-supp-tax-inv-edit/verify-supp-tax-inv-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/amend-supp-tax-inv/amend-supp-tax-inv-edit/amend-supp-tax-inv-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/supplementary/dispatch-supp-tax-inv/dispatch-supp-tax-inv-edit/dispatch-supp-tax-inv-edit.controller.js',
                ]
            }, {
                name: 'TaxInvoiceDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/tax-inv.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/cost-revenue-upl/cost-revenue-upl.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/generate-tax-invoice/generate-tax-invoice.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/verify-tax-invoice/verify-tax-invoice.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/amend-tax-invoice/amend-tax-invoice.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/dispatch-tax-invoice/dispatch-tax-invoice.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/tax-invoice.css'
                ]
            }, {
                name: 'TaxInvoiceEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/tax-inv-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/cost-revenue-upl/cost-revenue-upl-edit/cost-revenue-upl-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/generate-tax-invoice/generate-tax-invoice-edit/generate-tax-invoice-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/verify-tax-invoice/verify-tax-invoice-edit/verify-tax-invoice-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/amend-tax-invoice/amend-tax-invoice-edit/amend-tax-invoice-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/dispatch-tax-invoice/dispatch-tax-invoice-edit/dispatch-tax-invoice-edit.controller.js',
                ]
            }, {
                name: 'GSTInvoiceDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/gst-invoice.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/revcost-revenue-upl-gst/revcost-revenue-upl-gst.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/generate-gst-invoice/generate-gst-invoice.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/dispatch-gst-invoice/dispatch-gst-invoice.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/coll-pay-gst-inv/coll-pay-gst-inv.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/gst-invoice.css'
                ]
            }, {
                name: 'GSTInvoiceEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/gst-invoice-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/revcost-revenue-upl-gst/revcost-revenue-upl-gst-edit/revcost-revenue-upl-gst-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/generate-gst-invoice/generate-gst-invoice-edit/generate-gst-invoice-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/dispatch-gst-invoice/dispatch-gst-invoice-edit/dispatch-gst-invoice-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/coll-pay-gst-inv/coll-pay-gst-inv-edit/coll-pay-gst-inv-edit.controller.js',
                ]
            },
            // TMS
            {
                name: 'DispatchManifestDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest.css'
                ]
            }, {
                name: 'DispatchManifestEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.css'
                ]
            }, {
                name: 'ArrivalAtPortDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port.css'
                ]
            }, {
                name: 'ArrivalAtPortEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port-edit/confirm-arr-port-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port-edit/confirm-arr-port-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port-edit/confirm-arr-port-edit.css'
                ]
            }, {
                name: 'ReceiveItemDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm.css'
                ]
            }, {
                name: 'ReceiveItemEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.css'
                ]
            }, {
                name: 'ArrivalAtDepotDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-man-arr/confirm-man-arr.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-man-arr/confirm-man-arr.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-man-arr/confirm-man-arr.css'
                ]
            }, {
                name: 'ArrivalAtDepotEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.css'
                ]
            }, {
                name: 'DispatchPortDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port.css'
                ]
            }, {
                name: 'DispatchPortEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port-edit/dispatch-port-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port-edit/dispatch-port-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port-edit/dispatch-port-edit.css'
                ]
            },
            // Supplier Follow Up 
            {
                name: 'SfuMailDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail.css'
                ]
            },
            {
                name: 'SfuMailEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.css'
                ]
            },
            {
                name: 'SfuCRDUpdateDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update.css'
                ]
            },
            {
                name: 'SfuCRDUpdateEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.css'
                ]
            },
            {
                name: 'SfuReadOnlyGridDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid-directive.css'
                ]
            },
            {
                name: 'SfuMailModal',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-modal/sfu-mail-modal.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-modal/sfu-mail-modal.css'
                ]
            },
            {
                name: 'SfuUpdateGridDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/sfu-crd-update/sfu-crd-update-grid/sfu-crd-update-grid-directive.css'
                ]
            },
            // Shipment Pre-Advice Task
            {
                name: 'SpaMailDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail.css'
                ]
            },
            {
                name: 'SpaMailEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-edit/spa-mail-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-edit/spa-mail-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-edit/spa-mail-edit.css'
                ]
            },
            {
                name: 'SpaReadOnlyGridDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-grid/spa-mail-grid.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-grid/spa-mail-grid.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-grid/spa-mail-grid-directive.css'
                ]
            },
            {
                name: 'SpaMailModal',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-modal/spa-mail-modal.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-modal/spa-mail-modal.css'
                ]
            },
            {
                name: 'SpaVesselModal',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-vessel-modal/spa-mail-vessel-modal.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-vessel-modal/spa-mail-vessel-modal.css'
                ]
            },
            // endregion
            // --------------------- EA Admin --------------------------
            // region
            {
                name: 'eAxisAdmin',
                files: [
                    'app/trust-center/shared/trust-center.css',
                    'app/trust-center/shared/trust-center-config.factory.js',
                    'app/eaxis/admin/admin.css',
                    'app/eaxis/admin/admin.controller.js'
                ]
            }, {
                name: 'EAAdminHome',
                files: [
                    'app/eaxis/admin/home/home.css',
                    'app/eaxis/admin/home/home.controller.js'
                ]
            }, {
                name: 'EAUser',
                files: [
                    'app/trust-center/user/user.css',
                    'app/trust-center/user/user.controller.js'
                ]
            }, {
                name: 'EASession',
                files: [
                    'app/trust-center/session/session.css',
                    'app/trust-center/session/session.controller.js'
                ]
            }, {
                name: 'EAValidation',
                files: [
                    'app/trust-center/validation/validation.css',
                    'app/trust-center/validation/validation.controller.js'
                ]
            }, {
                name: 'EALanguage',
                files: [
                    'app/trust-center/language/language.css',
                    'app/trust-center/language/language.controller.js'
                ]
            }, {
                name: 'EAManageStaticListing',
                files: [
                    'app/trust-center/manage-static-listing/manage-static-listing.css',
                    'app/trust-center/manage-static-listing/manage-static-listing.controller.js'
                ]
            }, {
                name: 'EAPage',
                files: [
                    'app/trust-center/page/page/page.css',
                    'app/trust-center/page/page/page.controller.js'
                ]
            }, {
                name: 'EAEditPage',
                files: [
                    'app/trust-center/page/edit/edit-page.css',
                    'app/trust-center/page/edit/edit-page.controller.js'
                ]
            }, {
                name: 'EAUserSettings',
                files: [
                    'app/trust-center/settings/user-settings/user-settings.css',
                    'app/trust-center/settings/user-settings/user-settings.controller.js'
                ]
            }, {
                name: 'EAMapping',
                files: [
                    'app/trust-center/mapping/mapping-config.factory.js',
                    'app/trust-center/mapping/mapping-vertical/mapping-vertical.css',
                    'app/trust-center/mapping/mapping-vertical/mapping-vertical.controller.js'
                ]
            }, {
                name: 'EASecurity',
                files: [
                    'app/eaxis/admin/security/security.css',
                    'app/eaxis/admin/security/security.controller.js'
                ]
            }, {
                name: 'EAConfiguration',
                files: [
                    'app/eaxis/admin/configuration/configuration.css',
                    'app/eaxis/admin/configuration/configuration.controller.js'
                ]
            }, {
                name: 'EAEmailSettings',
                files: [
                    'app/trust-center/settings/application-settings/application-settings.css',
                    'app/trust-center/settings/application-settings/application-settings.controller.js'
                ]
            },
            // endregion
            // --------------------- Freight --------------------------
            // region
            {
                name: 'Freight',
                files: [
                    'app/eaxis/freight/freight.css',
                    'app/eaxis/freight/freight.controller.js'
                ]
            },
            // --------------------- Shipment --------------------------
            // region
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
            },
            // endregion
            // --------------------- Booking --------------------------
            // region
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
            },
            // endregion
            // --------------------Consol-----------------
            // region
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
            },
            // endregion
            // --------------------Container-----------------
            // region
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
            },
            // endregion
            // endregion
            // --------------------- Purchase Order --------------------------
            // region
            {
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
                name: 'sendFollowupMail',
                files: [
                    'app/eaxis/purchase-order/sfu-directive/send-follwup-modal/send-followup-modal.css',
                    'app/eaxis/purchase-order/sfu-directive/send-follwup-modal/send-followup-modal.controller.js'
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
                name: 'sendPreAdviceMail',
                files: [
                    'app/eaxis/purchase-order/pre-advice-directive/send-pre-advice-modal/send-pre-advice-modal.css',
                    'app/eaxis/purchase-order/pre-advice-directive/send-pre-advice-modal/send-pre-advice-modal.controller.js'
                ]
            }, {
                name: 'VesselPanningPreAdvice',
                files: [
                    'app/eaxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.css',
                    'app/eaxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.controller.js'
                ]
            },
            // --------------------Order Lines-----------------
            // region
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
            // --------------------Supplier FollowUp-----------------
            // region
            {
                name: 'supplierFollowUp',
                files: [
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup.css',
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup.controller.js',
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup-directive/supplier-followup.directive.js',
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup-config.factory.js'
                ]
            }, {
                name: 'supplierFollowUpDirective',
                files: [
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup-directive/supplier-followup.directive.css',
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup-directive/supplier-followup-directive.controller.js',
                    'app/eaxis/purchase-order/supplier-followup/supplier-followup-directive/supplier-followup.directive.js',
                ]
            }, {
                name: 'supplierFollowUpModal',
                files: [
                    'app/eaxis/purchase-order/supplier-followup/supplier-follow-up-modal/supplier-follow-up-modal.css',
                    'app/eaxis/purchase-order/supplier-followup/supplier-follow-up-modal/supplier-follow-up-modal.controller.js'
                ]
            }, {
                name: 'detachModal',
                files: [
                    'app/eaxis/purchase-order/supplier-followup/detach-modal/detach-modal.css',
                    'app/eaxis/purchase-order/supplier-followup/detach-modal/detach-modal.controller.js'
                ]
            }, {
                name: 'cancelModal',
                files: [
                    'app/eaxis/purchase-order/supplier-followup/cancel-modal/cancel-modal.css',
                    'app/eaxis/purchase-order/supplier-followup/cancel-modal/cancel-modal.controller.js'
                ]
            },
            // endregion
            // --------------------Pre Advice-----------------
            // region
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
            // --------------------PO Batch Upload-----------------
            // region
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
            // region
            // PO Upload
            {
                name: 'POBatchUploadedDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po.css'
                ]
            }, {
                name: 'POBatchUploadedEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po-edit/upload-po-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po-edit/upload-po-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/upload-po/upload-po-edit/upload-po-edit.css'
                ]
            },
            // endregion
            // endregion
            // --------------------- Smart Track --------------------------
            // region
            {
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
            },
            // endregion
            // --------------------- Customer Portal Document -------------------
            // region
            {
                name: 'CustomerPortalDocument',
                files: [
                    'app/eaxis/my-documents/documents/document.css',
                    'app/eaxis/my-documents/documents/document-config.factory.js',
                    'app/eaxis/my-documents/documents/document.controller.js'
                ]
            },
            // endregion
            //------------------------Warehouse---------------
            // region
            {
                name: 'EAwarehouse',
                files: [
                    'app/eaxis/warehouse/warehouse.css',
                    'app/eaxis/warehouse/warehouse.controller.js',
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
                name: 'inwardmytask',
                files: [
                    'app/eaxis/warehouse/inward/my-task/inward-my-task.css',
                    'app/eaxis/warehouse/inward/my-task/inward-my-task.directive.js',
                    'app/eaxis/warehouse/inward/my-task/inward-my-task.controller.js'
                ]
            }, {
                name: 'chart',
                files: [
                    'lib/chart/chart.min.js'
                ],
                serie: true
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
                name: 'reference',
                files: [
                    'app/eaxis/warehouse/inw-out-common/reference/reference.css',
                    'app/eaxis/warehouse/inw-out-common/reference/reference.controller.js',
                    'app/eaxis/warehouse/inw-out-common/reference/reference.directive.js'
                ]
            }, {
                name: 'container',
                files: [
                    'app/eaxis/warehouse/inw-out-common/container/container.css',
                    'app/eaxis/warehouse/inw-out-common/container/container.controller.js',
                    'app/eaxis/warehouse/inw-out-common/container/container.directive.js'
                ]
            }, {
                name: 'services',
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
                name: 'outwardCrossdock',
                files: [
                    'app/eaxis/warehouse/outward/outward-crossdock/outward-crossdock.css',
                    'app/eaxis/warehouse/outward/outward-crossdock/outward-crossdock.controller.js',
                    'app/eaxis/warehouse/outward/outward-crossdock/outward-crossdock.directive.js'
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
                    'app/eaxis/warehouse/pick/pick-slip/pick-slip.css',
                    'app/eaxis/warehouse/pick/pick-slip/pick-slip.controller.js',
                    'app/eaxis/warehouse/pick/pick-slip/pick-slip.directive.js'
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
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/wh-releases-details.css',
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/wh-releases-details.controller.js',
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/wh-releases-details.directive.js',
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/wh-releases-order-details.controller.js'
                ]
            }, {
                name: 'whReleasesOutward',
                files: [
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/outward-form/outward-form.css',
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/outward-form/outward-form.controller.js',
                    'app/eaxis/warehouse/wh-releases/wh-releases-details/outward-form/outward-form.directive.js',
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
            // ------------ Warehouse report ------------------
            // region
            {
                name: 'warehouseReport',
                files: [
                    'app/eaxis/warehouse/reports/report.css',
                    'app/eaxis/warehouse/reports/report.controller.js',
                    'app/eaxis/warehouse/reports/report-config.factory.js'
                ]
            }, {
                name: 'generateBarcode',
                files: [
                    'app/eaxis/warehouse/reports/generate-barcode/generate-barcode.css',
                    'app/eaxis/warehouse/reports/generate-barcode/generate-barcode.directive.js',
                    'app/eaxis/warehouse/reports/generate-barcode/generate-barcode.controller.js'
                ]
            },
            // endregion
            // --------------Transports - dashboard---------------------
            // region
            {
                name: 'Transports',
                files: [
                    'app/eaxis/transports/transports.css',
                    'app/eaxis/transports/transports.controller.js'
                ]
            },
            {
                name: 'consolidatedDashboard',
                files: [
                    'app/eaxis/transports/consolidated-dashboard/consolidated-dashboard.css',
                    'app/eaxis/transports/consolidated-dashboard/consolidated-dashboard.controller.js'
                ]
            },
            {
                name: 'scanItem',
                files: [
                    'app/eaxis/transports/scan-item/scan-item.css',
                    'app/eaxis/transports/scan-item/scan-item.controller.js'
                ]
            }, {
                name: 'dcDashboard',
                files: [
                    'app/eaxis/transports/dc-dashboard/dc-dashboard.css',
                    'app/eaxis/transports/dc-dashboard/dc-dashboard.controller.js'
                ]
            },
            // endregion
            // --------------Transports -Track Manifest----------------------
            // region
            {
                name: 'manifest',
                files: [
                    'app/eaxis/transports/track-manifest/manifest.css',
                    'app/eaxis/transports/track-manifest/manifest-config.factory.js',
                    'app/eaxis/transports/track-manifest/manifest.controller.js'
                ]
            },
            {
                name: 'manifestAddress',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-general/address/address.css',
                    'app/eaxis/transports/track-manifest/manifest-general/address/address.controller.js',
                ]
            },
            {
                name: 'manifestMenu',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.css',
                    'app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.controller.js'
                ]
            },
            {
                name: 'manifestGeneral',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-general/manifest-general.css',
                    'app/eaxis/transports/track-manifest/manifest-general/manifest-general.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-general/manifest-general.controller.js'
                ]
            },
            {
                name: 'manifestConsignment',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.css',
                    'app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.controller.js'
                ]
            },
            {
                name: 'manifestItem',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-item/manifest-item.css',
                    'app/eaxis/transports/track-manifest/manifest-item/manifest-item.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-item/manifest-item.controller.js'
                ]
            }, {
                name: 'manifestReadOnly',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-read-only/manifest-read-only.css',
                    'app/eaxis/transports/track-manifest/manifest-read-only/manifest-read-only.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-read-only/manifest-read-only.controller.js'
                ]
            }, {
                name: 'receiveItems',
                files: [
                    'app/eaxis/transports/track-manifest/receive-items/receive-items.css',
                    'app/eaxis/transports/track-manifest/receive-items/receive-items.directive.js',
                    'app/eaxis/transports/track-manifest/receive-items/receive-items.controller.js'
                ]
            },
            // endregion
            // -------------------Transport- Track consignment----------------
            // region
            {
                name: 'consignment',
                files: [
                    'app/eaxis/transports/track-consignment/consignment.css',
                    'app/eaxis/transports/track-consignment/consignment-config.factory.js',
                    'app/eaxis/transports/track-consignment/consignment.controller.js'
                ]
            },
            {
                name: 'consignmentMenu',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.css',
                    'app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.directive.js',
                    'app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.controller.js'
                ]
            },
            {
                name: 'consignmentGeneral',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-general.css',
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-general.directive.js',
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-general.controller.js'
                ]
            },
            {
                name: 'consignConsignmentItem',
                files: [
                    'app/eaxis/transports/track-consignment/consign-consignment-item/consign-consignment-item.css',
                    'app/eaxis/transports/track-consignment/consign-consignment-item/consign-consignment-item.directive.js',
                    'app/eaxis/transports/track-consignment/consign-consignment-item/consign-consignment-item.controller.js'
                ]
            }, {
                name: 'consignmentManifest',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-manifest/consignment-manifest.css',
                    'app/eaxis/transports/track-consignment/consignment-manifest/consignment-manifest.directive.js',
                    'app/eaxis/transports/track-consignment/consignment-manifest/consignment-manifest.controller.js'
                ]
            }, {
                name: 'consignmentAddress',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-address/consignment-address.css',
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-address/consignment-address.controller.js'
                ]
            }, {
                name: 'consignmentReadOnly',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-read-only/consignment-read-only.css',
                    'app/eaxis/transports/track-consignment/consignment-read-only/consignment-read-only.directive.js',
                    'app/eaxis/transports/track-consignment/consignment-read-only/consignment-read-only.controller.js'
                ]
            },
            // endregion
            // ----------------------Transport- Track item------------------
            // region
            {
                name: 'item',
                files: [
                    'app/eaxis/transports/track-item/item.css',
                    'app/eaxis/transports/track-item/item-config.factory.js',
                    'app/eaxis/transports/track-item/item.controller.js'
                ]
            },
            {
                name: 'itemMenu',
                files: [
                    'app/eaxis/transports/track-item/item-menu/item-menu.css',
                    'app/eaxis/transports/track-item/item-menu/item-menu.directive.js',
                    'app/eaxis/transports/track-item/item-menu/item-menu.controller.js'
                ]
            },
            {
                name: 'itemGeneral',
                files: [
                    'app/eaxis/transports/track-item/item-general/item-general.css',
                    'app/eaxis/transports/track-item/item-general/item-general.directive.js',
                    'app/eaxis/transports/track-item/item-general/item-general.controller.js'
                ]
            },
            {
                name: 'itemConsignment',
                files: [
                    'app/eaxis/transports/track-item/item-consignment/item-consignment.css',
                    'app/eaxis/transports/track-item/item-consignment/item-consignment.directive.js',
                    'app/eaxis/transports/track-item/item-consignment/item-consignment.controller.js'
                ]
            }, {
                name: 'itemManifest',
                files: [
                    'app/eaxis/transports/track-item/item-manifest/item-manifest.css',
                    'app/eaxis/transports/track-item/item-manifest/item-manifest.directive.js',
                    'app/eaxis/transports/track-item/item-manifest/item-manifest.controller.js'
                ]
            }, {
                name: 'itemAddress',
                files: [
                    'app/eaxis/transports/track-item/item-general/item-address/item-address.css',
                    'app/eaxis/transports/track-item/item-general/item-address/item-address.controller.js'
                ]
            }, {
                name: 'itemReadOnly',
                files: [
                    'app/eaxis/transports/track-item/item-read-only/item-read-only.css',
                    'app/eaxis/transports/track-item/item-read-only/item-read-only.directive.js',
                    'app/eaxis/transports/track-item/item-read-only/item-read-only.controller.js'
                ]
            },

            // endregion
            // --------------Transports - Manifest----------------------
            // region
            {
                name: 'adminManifest',
                files: [
                    'app/eaxis/transports/manifest/manifest.css',
                    'app/eaxis/transports/manifest/manifest-config.factory.js',
                    'app/eaxis/transports/manifest/manifest.controller.js'
                ]
            },
            {
                name: 'adminManifestAddress',
                files: [
                    'app/eaxis/transports/manifest/manifest-general/address/address.css',
                    'app/eaxis/transports/manifest/manifest-general/address/address.controller.js',
                ]
            },
            {
                name: 'adminManifestMenu',
                files: [
                    'app/eaxis/transports/manifest/manifest-menu/manifest-menu.css',
                    'app/eaxis/transports/manifest/manifest-menu/manifest-menu.directive.js',
                    'app/eaxis/transports/manifest/manifest-menu/manifest-menu.controller.js'
                ]
            },
            {
                name: 'adminManifestGeneral',
                files: [
                    'app/eaxis/transports/manifest/manifest-general/manifest-general.css',
                    'app/eaxis/transports/manifest/manifest-general/manifest-general.directive.js',
                    'app/eaxis/transports/manifest/manifest-general/manifest-general.controller.js'
                ]
            },
            {
                name: 'adminManifestConsignment',
                files: [
                    'app/eaxis/transports/manifest/manifest-consignment/manifest-consignment.css',
                    'app/eaxis/transports/manifest/manifest-consignment/manifest-consignment.directive.js',
                    'app/eaxis/transports/manifest/manifest-consignment/manifest-consignment.controller.js'
                ]
            },
            {
                name: 'adminManifestItem',
                files: [
                    'app/eaxis/transports/manifest/manifest-item/manifest-item.css',
                    'app/eaxis/transports/manifest/manifest-item/manifest-item.directive.js',
                    'app/eaxis/transports/manifest/manifest-item/manifest-item.controller.js'
                ]
            },
            // endregion
            // -------------------Transport- consignment----------------
            // region
            {
                name: 'adminConsignment',
                files: [
                    'app/eaxis/transports/consignment/consignment.css',
                    'app/eaxis/transports/consignment/consignment-config.factory.js',
                    'app/eaxis/transports/consignment/consignment.controller.js'
                ]
            },
            {
                name: 'adminConsignmentMenu',
                files: [
                    'app/eaxis/transports/consignment/consignment-menu/consignment-menu.css',
                    'app/eaxis/transports/consignment/consignment-menu/consignment-menu.directive.js',
                    'app/eaxis/transports/consignment/consignment-menu/consignment-menu.controller.js'
                ]
            },
            {
                name: 'adminConsignmentGeneral',
                files: [
                    'app/eaxis/transports/consignment/consignment-general/consignment-general.css',
                    'app/eaxis/transports/consignment/consignment-general/consignment-general.directive.js',
                    'app/eaxis/transports/consignment/consignment-general/consignment-general.controller.js'
                ]
            },
            {
                name: 'adminConsignConsignmentItem',
                files: [
                    'app/eaxis/transports/consignment/consign-consignment-item/consign-consignment-item.css',
                    'app/eaxis/transports/consignment/consign-consignment-item/consign-consignment-item.directive.js',
                    'app/eaxis/transports/consignment/consign-consignment-item/consign-consignment-item.controller.js'
                ]
            },
            {
                name: 'adminConsignmentManifest',
                files: [
                    'app/eaxis/transports/consignment/consignment-manifest/consignment-manifest.css',
                    'app/eaxis/transports/consignment/consignment-manifest/consignment-manifest.directive.js',
                    'app/eaxis/transports/consignment/consignment-manifest/consignment-manifest.controller.js'
                ]
            }, {
                name: 'adminConsignmentAddress',
                files: [
                    'app/eaxis/transports/consignment/consignment-general/consignment-address/consignment-address.css',
                    'app/eaxis/transports/consignment/consignment-general/consignment-address/consignment-address.controller.js'
                ]
            },
            // endregion
            // ----------------------Transport-item------------------
            // region
            {
                name: 'adminItem',
                files: [
                    'app/eaxis/transports/item/item.css',
                    'app/eaxis/transports/item/item-config.factory.js',
                    'app/eaxis/transports/item/item.controller.js'
                ]
            },
            {
                name: 'adminItemMenu',
                files: [
                    'app/eaxis/transports/item/item-menu/item-menu.css',
                    'app/eaxis/transports/item/item-menu/item-menu.directive.js',
                    'app/eaxis/transports/item/item-menu/item-menu.controller.js'
                ]
            },
            {
                name: 'adminItemGeneral',
                files: [
                    'app/eaxis/transports/item/item-general/item-general.css',
                    'app/eaxis/transports/item/item-general/item-general.directive.js',
                    'app/eaxis/transports/item/item-general/item-general.controller.js'
                ]
            },
            {
                name: 'adminItemConsignment',
                files: [
                    'app/eaxis/transports/item/item-consignment/item-consignment.css',
                    'app/eaxis/transports/item/item-consignment/item-consignment.directive.js',
                    'app/eaxis/transports/item/item-consignment/item-consignment.controller.js'
                ]
            },
            {
                name: 'adminItemManifest',
                files: [
                    'app/eaxis/transports/item/item-manifest/item-manifest.css',
                    'app/eaxis/transports/item/item-manifest/item-manifest.directive.js',
                    'app/eaxis/transports/item/item-manifest/item-manifest.controller.js'
                ]
            },
            {
                name: 'adminItemAddress',
                files: [
                    'app/eaxis/transports/item/item-general/item-address/item-address.css',
                    'app/eaxis/transports/item/item-general/item-address/item-address.controller.js'
                ]
            },
            // endregion
            // ------------ create manifest ------------
            // region
            {
                name: 'createManifest',
                files: [
                    'app/eaxis/transports/create-manifest/create-manifest.css',
                    'app/eaxis/transports/create-manifest/create-manifest-config.factory.js',
                    'app/eaxis/transports/create-manifest/create-manifest.controller.js'
                ]
            }, {
                name: 'createManifestGeneral',
                files: [
                    'app/eaxis/transports/create-manifest/general/create-manifest-general.css',
                    'app/eaxis/transports/create-manifest/general/create-manifest-general.directive.js',
                    'app/eaxis/transports/create-manifest/general/create-manifest-general.controller.js'
                ]
            },
            // endregion
            // ------------ create consignment ------------
            // region
            {
                name: 'createConsignment',
                files: [
                    'app/eaxis/transports/create-consignment/create-consign.css',
                    'app/eaxis/transports/create-consignment/create-consign-config.factory.js',
                    'app/eaxis/transports/create-consignment/create-consign.controller.js'
                ]
            }, {
                name: 'createConsignmentGeneral',
                files: [
                    'app/eaxis/transports/create-consignment/general/create-consign-general.css',
                    'app/eaxis/transports/create-consignment/general/create-consign-general.directive.js',
                    'app/eaxis/transports/create-consignment/general/create-consign-general.controller.js'
                ]
            },
            // endregion
            // ------------ Address ------------------
            // region
            {
                name: 'addressDirective',
                files: [
                    'app/eaxis/shared/address-directive/address-directive.css',
                    'app/eaxis/shared/address-directive/address-directive.js',
                    'app/eaxis/shared/address-directive/address-directive.controller.js',
                ]
            }, {
                name: 'addressWrapper',
                files: [
                    'app/eaxis/shared/address-wrapper/address-wrapper.css',
                    'app/eaxis/shared/address-wrapper/address-wrapper.js',
                    'app/eaxis/shared/address-wrapper/address-wrapper.controller.js',
                ]
            }, {
                name: 'addressModal',
                files: [
                    'app/eaxis/shared/address-directive/address-modal/address-modal.css',
                    'app/eaxis/shared/address-directive/address-modal/address-modal.controller.js',
                ]
            },
            // endregion
        ]
    };

    angular
        .module("Application")
        .constant("EAXIS_CONSTANT", EAXIS_CONSTANT);
})();
