(function () {
    'use strict';

    var TRANSPORT_CONSTANT = {
        ocLazyLoadModules: [
            // region
            {
                name: 'eAxisTransports',
                files: [
                    'app/eaxis/transports/transports.css',
                    'app/eaxis/transports/transports.controller.js'
                ]
            }, {
                name: 'scanItem',
                files: [
                    'app/eaxis/transports/scan-item/scan-item.css',
                    'app/eaxis/transports/scan-item/scan-item.controller.js'
                ]
            }, {
                name: 'TMSDashboard',
                files: [
                    'app/eaxis/transports/dashboard/dashboard.css',
                    'app/eaxis/transports/dashboard/dashboard.controller.js'
                ]
            },
            // region Track Manifest
            {
                name: 'manifest',
                files: [
                    'app/eaxis/transports/track-manifest/manifest.css',
                    'app/eaxis/transports/track-manifest/manifest-config.factory.js',
                    'app/eaxis/transports/track-manifest/manifest.controller.js'
                ]
            }, {
                name: 'manifestAddress',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-general/address/address.css',
                    'app/eaxis/transports/track-manifest/manifest-general/address/address.controller.js',
                ]
            }, {
                name: 'manifestMenu',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.css',
                    'app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.controller.js'
                ]
            }, {
                name: 'manifestGeneral',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-general/manifest-general.css',
                    'app/eaxis/transports/track-manifest/manifest-general/manifest-general.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-general/manifest-general.controller.js'
                ]
            }, {
                name: 'manifestConsignment',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.css',
                    'app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.controller.js'
                ]
            }, {
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
                name: 'manifestCustomToolBar',
                files: [
                    'app/eaxis/transports/track-manifest/manifest-tool-bar/manifest-tool-bar.css',
                    'app/eaxis/transports/track-manifest/manifest-tool-bar/manifest-tool-bar.directive.js',
                    'app/eaxis/transports/track-manifest/manifest-tool-bar/manifest-tool-bar.controller.js'
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
            // region Track consignment
            {
                name: 'consignment',
                files: [
                    'app/eaxis/transports/track-consignment/consignment.css',
                    'app/eaxis/transports/track-consignment/consignment-config.factory.js',
                    'app/eaxis/transports/track-consignment/consignment.controller.js'
                ]
            }, {
                name: 'consignmentMenu',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.css',
                    'app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.directive.js',
                    'app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.controller.js'
                ]
            }, {
                name: 'consignmentGeneral',
                files: [
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-general.css',
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-general.directive.js',
                    'app/eaxis/transports/track-consignment/consignment-general/consignment-general.controller.js'
                ]
            }, {
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
            }, {
                name: 'consignmentOrder',
                files: [
                    'app/eaxis/transports/track-consignment/consign-consignment-order/consign-consignment-order.css',
                    'app/eaxis/transports/track-consignment/consign-consignment-order/consign-consignment-order.directive.js',
                    'app/eaxis/transports/track-consignment/consign-consignment-order/consign-consignment-order.controller.js'
                ]
            },
            // endregion
            // region Track item
            {
                name: 'item',
                files: [
                    'app/eaxis/transports/track-item/item.css',
                    'app/eaxis/transports/track-item/item-config.factory.js',
                    'app/eaxis/transports/track-item/item.controller.js'
                ]
            }, {
                name: 'itemMenu',
                files: [
                    'app/eaxis/transports/track-item/item-menu/item-menu.css',
                    'app/eaxis/transports/track-item/item-menu/item-menu.directive.js',
                    'app/eaxis/transports/track-item/item-menu/item-menu.controller.js'
                ]
            }, {
                name: 'itemGeneral',
                files: [
                    'app/eaxis/transports/track-item/item-general/item-general.css',
                    'app/eaxis/transports/track-item/item-general/item-general.directive.js',
                    'app/eaxis/transports/track-item/item-general/item-general.controller.js'
                ]
            }, {
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
            }, {
                name: 'transportsReport',
                files: [
                    'app/eaxis/transports/transports-reports/report.css',
                    'app/eaxis/transports/transports-reports/report.controller.js',
                    'app/eaxis/transports/transports-reports/report-config.factory.js'
                ]
            },
            // endregion
            // region Manifest
            {
                name: 'adminManifest',
                files: [
                    'app/eaxis/transports/manifest/manifest.css',
                    'app/eaxis/transports/manifest/manifest-config.factory.js',
                    'app/eaxis/transports/manifest/manifest.controller.js'
                ]
            }, {
                name: 'adminManifestMenu',
                files: [
                    'app/eaxis/transports/manifest/manifest-menu/manifest-menu.css',
                    'app/eaxis/transports/manifest/manifest-menu/manifest-menu.directive.js',
                    'app/eaxis/transports/manifest/manifest-menu/manifest-menu.controller.js'
                ]
            },
            // endregion
            // region Consignment
            {
                name: 'adminConsignment',
                files: [
                    'app/eaxis/transports/consignment/consignment.css',
                    'app/eaxis/transports/consignment/consignment-config.factory.js',
                    'app/eaxis/transports/consignment/consignment.controller.js'
                ]
            }, {
                name: 'adminConsignmentMenu',
                files: [
                    'app/eaxis/transports/consignment/consignment-menu/consignment-menu.css',
                    'app/eaxis/transports/consignment/consignment-menu/consignment-menu.directive.js',
                    'app/eaxis/transports/consignment/consignment-menu/consignment-menu.controller.js'
                ]
            },
            // endregion
            // region Item
            {
                name: 'adminItem',
                files: [
                    'app/eaxis/transports/item/item.css',
                    'app/eaxis/transports/item/item-config.factory.js',
                    'app/eaxis/transports/item/item.controller.js'
                ]
            }, {
                name: 'adminItemMenu',
                files: [
                    'app/eaxis/transports/item/item-menu/item-menu.css',
                    'app/eaxis/transports/item/item-menu/item-menu.directive.js',
                    'app/eaxis/transports/item/item-menu/item-menu.controller.js'
                ]
            },
            // endregion
            // region Create manifest
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
            // region Create consignment
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
            // region Pickup Manifest
            {
                name: 'pickupManifest',
                files: [
                    'app/eaxis/transports/pickup-manifest/pickup-manifest.css',
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-config.factory.js',
                    'app/eaxis/transports/pickup-manifest/pickup-manifest.controller.js'
                ]
            }, {
                name: 'pickupManifestMenu',
                files: [
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-menu/pickup-manifest-menu.css',
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-menu/pickup-manifest-menu.directive.js',
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-menu/pickup-manifest-menu.controller.js'
                ]
            }, {
                name: 'pickupManifestCustomToolbar',
                files: [
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-custom-toolbar/pickup-manifest-custom-toolbar.css',
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-custom-toolbar/pickup-manifest-custom-toolbar.directive.js',
                    'app/eaxis/transports/pickup-manifest/pickup-manifest-custom-toolbar/pickup-manifest-custom-toolbar.controller.js'
                ]
            },
            // endregion
            // region Delivery Manifest
            {
                name: 'deliveryManifest',
                files: [
                    'app/eaxis/transports/delivery-manifest/delivery-manifest.css',
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-config.factory.js',
                    'app/eaxis/transports/delivery-manifest/delivery-manifest.controller.js'
                ]
            }, {
                name: 'deliveryManifestMenu',
                files: [
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-menu/delivery-manifest-menu.css',
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-menu/delivery-manifest-menu.directive.js',
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-menu/delivery-manifest-menu.controller.js'
                ]
            }, {
                name: 'deliveryManifestCustomToolbar',
                files: [
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-custom-toolbar/delivery-manifest-custom-toolbar.css',
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-custom-toolbar/delivery-manifest-custom-toolbar.directive.js',
                    'app/eaxis/transports/delivery-manifest/delivery-manifest-custom-toolbar/delivery-manifest-custom-toolbar.controller.js'
                ]
            },
            // endregion
            // region Pickup Consignment
            {
                name: 'pickupConsignment',
                files: [
                    'app/eaxis/transports/pickup-consignment/pickup-consignment.css',
                    'app/eaxis/transports/pickup-consignment/pickup-consignment-config.factory.js',
                    'app/eaxis/transports/pickup-consignment/pickup-consignment.controller.js'
                ]
            }, {
                name: 'pickupConsignmentMenu',
                files: [
                    'app/eaxis/transports/pickup-consignment/pickup-consign-menu/pickup-consign-menu.css',
                    'app/eaxis/transports/pickup-consignment/pickup-consign-menu/pickup-consign-menu.directive.js',
                    'app/eaxis/transports/pickup-consignment/pickup-consign-menu/pickup-consign-menu.controller.js'
                ]
            }, {
                name: 'pickupConsignmentCustomToolbar',
                files: [
                    'app/eaxis/transports/pickup-consignment/pickup-consign-custom-toolbar/pickup-consign-custom-toolbar.css',
                    'app/eaxis/transports/pickup-consignment/pickup-consign-custom-toolbar/pickup-consign-custom-toolbar.directive.js',
                    'app/eaxis/transports/pickup-consignment/pickup-consign-custom-toolbar/pickup-consign-custom-toolbar.controller.js'
                ]
            },
            // endregion
            // region Delivery Consignment
            {
                name: 'deliveryConsignment',
                files: [
                    'app/eaxis/transports/delivery-consignment/delivery-consignment.css',
                    'app/eaxis/transports/delivery-consignment/delivery-consignment-config.factory.js',
                    'app/eaxis/transports/delivery-consignment/delivery-consignment.controller.js'
                ]
            }, {
                name: 'deliveryConsignmentMenu',
                files: [
                    'app/eaxis/transports/delivery-consignment/delivery-consign-menu/delivery-consign-menu.css',
                    'app/eaxis/transports/delivery-consignment/delivery-consign-menu/delivery-consign-menu.directive.js',
                    'app/eaxis/transports/delivery-consignment/delivery-consign-menu/delivery-consign-menu.controller.js'
                ]
            }, {
                name: 'deliveryConsignmentCustomToolbar',
                files: [
                    'app/eaxis/transports/delivery-consignment/delivery-consign-custom-toolbar/delivery-consign-custom-toolbar.css',
                    'app/eaxis/transports/delivery-consignment/delivery-consign-custom-toolbar/delivery-consign-custom-toolbar.directive.js',
                    'app/eaxis/transports/delivery-consignment/delivery-consign-custom-toolbar/delivery-consign-custom-toolbar.controller.js'
                ]
            },
            // endregion
            // region National Depot
            {
                name: 'nationalDepot',
                files: [
                    'app/eaxis/transports/national-depot/national-depot.css',
                    'app/eaxis/transports/national-depot/national-depot.directive.js',
                    'app/eaxis/transports/national-depot/national-depot.controller.js',
                    'app/eaxis/transports/national-depot/national-depot.json'
                ]
            },
            // endregion
            // region Load Planning
            {
                name: 'loadPlanning',
                files: [
                    'app/eaxis/transports/load-planning/load-planning.css',
                    'app/eaxis/transports/load-planning/load-planning.directive.js',
                    'app/eaxis/transports/load-planning/load-planning.controller.js',
                    'app/eaxis/transports/load-planning/load-planning.json'
                ]
            },
             {
                name: 'loadPlanningEdit',
                files: [
                    'app/eaxis/transports/load-planning/load-planning-edit/load-planning-edit.css',
                    'app/eaxis/transports/load-planning/load-planning-edit/load-planning-edit.controller.js',
                ]
            },
            // endregion
            // region Depot Contact
            {
                name: 'depotContact',
                files: [
                    'app/eaxis/transports/depot-contact/depot-contact.css',
                    'app/eaxis/transports/depot-contact/depot-contact.directive.js',
                    'app/eaxis/transports/depot-contact/depot-contact.controller.js',
                    'app/eaxis/transports/depot-contact/depot-contact.json'
                ]
            },
            // endregion
            // region Level Load
            {
                name: 'levelLoad',
                files: [
                    'app/eaxis/transports/level-load/level-load.css',
                    'app/eaxis/transports/level-load/level-load.directive.js',
                    'app/eaxis/transports/level-load/level-load.controller.js',
                ]
            }, {
                name: 'levelLoadEdit',
                files: [
                    'app/eaxis/transports/level-load/level-load-edit/level-load-edit.css',
                    'app/eaxis/transports/level-load/level-load-edit/level-load-edit.controller.js',
                ]
            },
            // end region
            // region Supplier
            {
                name: 'supplier',
                files: [
                    'app/eaxis/transports/supplier/supplier.css',
                    'app/eaxis/transports/supplier/supplier-config.factory.js',
                    'app/eaxis/transports/supplier/supplier.controller.js'
                ]
            }, {
                name: 'supplierGeneral',
                files: [
                    'app/eaxis/transports/supplier/supplier-general/supplier-general.css',
                    'app/eaxis/transports/supplier/supplier-general/supplier-general.directive.js',
                    'app/eaxis/transports/supplier/supplier-general/supplier-general.controller.js'
                ]
            }, {
                name: 'supplierMenu',
                files: [
                    'app/eaxis/transports/supplier/supplier-menu/supplier-menu.css',
                    'app/eaxis/transports/supplier/supplier-menu/supplier-menu.directive.js',
                    'app/eaxis/transports/supplier/supplier-menu/supplier-menu.controller.js'
                ]
            },
            // endregion
            //region Date Revision Manifest
            {
                name: 'dateRevision',
                files: [
                    'app/eaxis/transports/date-revision-manifest/date-revision.css',
                    'app/eaxis/transports/date-revision-manifest/date-revision-config.factory.js',
                    'app/eaxis/transports/date-revision-manifest/date-revision.controller.js'
                ]
            },
            // endregion
            //region Date Revision Consignment

            {
                name: 'dateRevisionConsignment',
                files: [
                    'app/eaxis/transports/date-revision-consignment/date-revision.css',
                    'app/eaxis/transports/date-revision-consignment/date-revision-config.factory.js',
                    'app/eaxis/transports/date-revision-consignment/date-revision.controller.js'
                ]
            },

            // endregion
            // region MyTask
            {
                name: 'DispatchManifestDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest.css'
                ]
            }, {
                name: 'DispatchManifestEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.css'
                ]
            }, {
                name: 'ReceiveItemDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm.css'
                ]
            }, {
                name: 'ReceiveItemEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.css'
                ]
            }, {
                name: 'ArrivalAtDepotDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr.css'
                ]
            }, {
                name: 'ArrivalAtDepotEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.css'
                ]
            }, {
                name: 'ApproveConsignmentDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment.css'
                ]
            }, {
                name: 'ApproveConsignmentEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment-edit/approve-consignment-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment-edit/approve-consignment-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment-edit/approve-consignment-edit.css'
                ]
            }, {
                name: 'PickupConsignmentDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment.css'
                ]
            }, {
                name: 'PickupConsignmentEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment-edit/pickup-consignment-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment-edit/pickup-consignment-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-consignment/pickup-consignment-edit/pickup-consignment-edit.css'
                ]
            }, {
                name: 'DeliveryConsignmentDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment.css'
                ]
            }, {
                name: 'DeliveryConsignmentEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment-edit/delivery-consignment-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment-edit/delivery-consignment-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-consignment/delivery-consignment-edit/delivery-consignment-edit.css'
                ]
            }, {
                name: 'PickupManifestDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest.css'
                ]
            }, {
                name: 'PickupManifestEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest-edit/pickup-manifest-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest-edit/pickup-manifest-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest-edit/pickup-manifest-edit.css'
                ]
            }, {
                name: 'DeliveryManifestDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest.css'
                ]
            }, {
                name: 'DeliveryManifestEditDirective',
                files: [
                    'app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest-edit/delivery-manifest-edit.directive.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest-edit/delivery-manifest-edit.controller.js',
                    'app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest-edit/delivery-manifest-edit.css'
                ]
            }
            // endregion
        ]
    };

    angular
        .module("Application")
        .constant("TRANSPORT_CONSTANT", TRANSPORT_CONSTANT);
})();
