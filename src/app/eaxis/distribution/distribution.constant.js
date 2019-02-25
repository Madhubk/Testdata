(function () {
    'use strict';

    var DISTRIBUTION_CONSTANT = {
        ocLazyLoadModules: [
            // region
            {
                name: 'eAxisDistribution',
                files: [
                    'app/eaxis/distribution/distribution.css',
                    'app/eaxis/distribution/distribution.controller.js',
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js',
                    'app/mdm/warehouse/custom/customfilter.js'

                ]
            },
            // region
            {
                name: 'initiateGatepass',
                files: [
                    'app/eaxis/distribution/initiate-gatepass/initiate-gatepass.css',
                    'app/eaxis/distribution/initiate-gatepass/initiate-gatepass.controller.js',
                    'app/eaxis/distribution/initiate-gatepass/initiate-gatepass-config.factory.js',
                ]
            }, {
                name: 'gatepassMenu',
                files: [
                    'app/eaxis/distribution/initiate-gatepass/gatepass-menu/gatepass-menu.controller.js',
                    'app/eaxis/distribution/initiate-gatepass/gatepass-menu/gatepass-menu.directive.js'
                ]
            }, {
                name: 'gatepassGeneral',
                files: [
                    'app/eaxis/distribution/initiate-gatepass/gatepass-general/gatepass-general.css',
                    'app/eaxis/distribution/initiate-gatepass/gatepass-general/gatepass-general.controller.js',
                    'app/eaxis/distribution/initiate-gatepass/gatepass-general/gatepass-general.directive.js'
                ]
            }, {
                name: 'manifestDetails',
                files: [
                    'app/eaxis/distribution/initiate-gatepass/manifest-details/manifest-details.css',
                    'app/eaxis/distribution/initiate-gatepass/manifest-details/manifest-details.controller.js',
                    'app/eaxis/distribution/initiate-gatepass/manifest-details/manifest-details.directive.js'
                ]
            },
            // endregion
            // region
            {
                name: 'dmsManifestList',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-list.css',
                    'app/eaxis/distribution/manifest-list/manifest-list.controller.js',
                    'app/eaxis/distribution/manifest-list/manifest-list-config.factory.js'
                ]
            }, {
                name: 'manifestTab',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-tab/manifest-tab.controller.js',
                    'app/eaxis/distribution/manifest-list/manifest-tab/manifest-tab.directive.js'
                ]
            }, {
                name: 'dmsManifestMenu',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-menu/manifest-menu.css',
                    'app/eaxis/distribution/manifest-list/manifest-menu/manifest-menu.controller.js',
                    'app/eaxis/distribution/manifest-list/manifest-menu/manifest-menu.directive.js'
                ]
            }, {
                name: 'routePlanning',
                files: [
                    'app/eaxis/distribution/manifest-list/route-planning/route-planning.css',
                    'app/eaxis/distribution/manifest-list/route-planning/route-planning.controller.js',
                    'app/eaxis/distribution/manifest-list/route-planning/route-planning.directive.js'
                ]
            }, {
                name: 'tracking',
                files: [
                    'app/eaxis/distribution/manifest-list/tracking/tracking.css',
                    'app/eaxis/distribution/manifest-list/tracking/tracking.controller.js',
                    'app/eaxis/distribution/manifest-list/tracking/tracking.directive.js'
                ]
            }, {
                name: 'dmsManifestGeneral',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-general/manifest-general.css',
                    'app/eaxis/distribution/manifest-list/manifest-general/manifest-general.controller.js',
                    'app/eaxis/distribution/manifest-list/manifest-general/manifest-general.directive.js'
                ]
            }, {
                name: 'dmsManifestAddress',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-general/address/address.css',
                    'app/eaxis/distribution/manifest-list/manifest-general/address/address.controller.js',
                ]
            }, {
                name: 'dmsManifestOrders',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-orders/manifest-orders.css',
                    'app/eaxis/distribution/manifest-list/manifest-orders/manifest-orders.controller.js',
                    'app/eaxis/distribution/manifest-list/manifest-orders/manifest-orders.directive.js'
                ]
            }, {
                name: 'dmsManifestItem',
                files: [
                    'app/eaxis/distribution/manifest-list/manifest-item/manifest-item.css',
                    'app/eaxis/distribution/manifest-list/manifest-item/manifest-item.controller.js',
                    'app/eaxis/distribution/manifest-list/manifest-item/manifest-item.directive.js'
                ]
            }, {
                name: 'GatepassList',
                files: [
                    'app/eaxis/distribution/manifest-list/gatepass-list/gatepass-list.css',
                    'app/eaxis/distribution/manifest-list/gatepass-list/gatepass-list.controller.js',
                    'app/eaxis/distribution/manifest-list/gatepass-list/gatepass-list.directive.js',
                    'app/eaxis/distribution/manifest-list/gatepass-list/gatepass-list.json'
                ]
            }, {
                name: 'approveManifest',
                files: [
                    'app/eaxis/distribution/manifest-list/approve-manifest/approve-manifest.css',
                    'app/eaxis/distribution/manifest-list/approve-manifest/approve-manifest.controller.js',
                    'app/eaxis/distribution/manifest-list/approve-manifest/approve-manifest.directive.js'
                ]
            }, {
                name: 'confirmTransportBooking',
                files: [
                    'app/eaxis/distribution/manifest-list/confirm-transport-booking/confirm-transport-booking.css',
                    'app/eaxis/distribution/manifest-list/confirm-transport-booking/confirm-transport-booking.controller.js',
                    'app/eaxis/distribution/manifest-list/confirm-transport-booking/confirm-transport-booking.directive.js'
                ]
            }, {
                name: 'dockinVehicle',
                files: [
                    'app/eaxis/distribution/manifest-list/dockin-vehicle/dockin-vehicle.css',
                    'app/eaxis/distribution/manifest-list/dockin-vehicle/dockin-vehicle.controller.js',
                    'app/eaxis/distribution/manifest-list/dockin-vehicle/dockin-vehicle.directive.js'
                ]
            }, {
                name: 'loadItems',
                files: [
                    'app/eaxis/distribution/manifest-list/load-items/load-items.css',
                    'app/eaxis/distribution/manifest-list/load-items/load-items.controller.js',
                    'app/eaxis/distribution/manifest-list/load-items/load-items.directive.js'
                ]
            }, {
                name: 'dockoutVehicle',
                files: [
                    'app/eaxis/distribution/manifest-list/dockout-vehicle/dockout-vehicle.css',
                    'app/eaxis/distribution/manifest-list/dockout-vehicle/dockout-vehicle.controller.js',
                    'app/eaxis/distribution/manifest-list/dockout-vehicle/dockout-vehicle.directive.js'
                ]
            }, {
                name: 'issueExitGatepass',
                files: [
                    'app/eaxis/distribution/manifest-list/issue-exit-gatepass/issue-exit-gatepass.css',
                    'app/eaxis/distribution/manifest-list/issue-exit-gatepass/issue-exit-gatepass.controller.js',
                    'app/eaxis/distribution/manifest-list/issue-exit-gatepass/issue-exit-gatepass.directive.js'
                ]
            }, {
                name: 'completeManifest',
                files: [
                    'app/eaxis/distribution/manifest-list/complete-manifest/complete-manifest.css',
                    'app/eaxis/distribution/manifest-list/complete-manifest/complete-manifest.controller.js',
                    'app/eaxis/distribution/manifest-list/complete-manifest/complete-manifest.directive.js'
                ]
            }, {
                name: 'pickupDelivery',
                files: [
                    'app/eaxis/distribution/manifest-list/pickup-delivery/pickup-delivery.css',
                    'app/eaxis/distribution/manifest-list/pickup-delivery/pickup-delivery.controller.js',
                    'app/eaxis/distribution/manifest-list/pickup-delivery/pickup-delivery.directive.js'
                ]
            }, {
                name: 'startLoad',
                files: [
                    'app/eaxis/distribution/manifest-list/start-load/start-load.css',
                    'app/eaxis/distribution/manifest-list/start-load/start-load.controller.js',
                    'app/eaxis/distribution/manifest-list/start-load/start-load.directive.js'
                ]
            },
            {
                name: 'deliveryRunsheet',
                files: [
                    'app/eaxis/distribution/manifest-list/delivery-runsheet/delivery-runsheet.css',
                    'app/eaxis/distribution/manifest-list/delivery-runsheet/delivery-runsheet.controller.js',
                    'app/eaxis/distribution/manifest-list/delivery-runsheet/delivery-runsheet.directive.js'
                ]
            }, 
            //region read only
            {
                name: 'CreateManifestView',
                files: [
                    'app/eaxis/distribution/manifest-list/create-manifest-read-only/create-manifest-view.directive.js',
                    'app/eaxis/distribution/manifest-list/create-manifest-read-only/create-manifest-view.controller.js',
                    'app/eaxis/distribution/manifest-list/create-manifest-read-only/create-manifest-view.css'
                ]
            }, {
                name: 'AttachOrdersView',
                files: [
                    'app/eaxis/distribution/manifest-list/attach-orders-read-only/attach-orders-view.directive.js',
                    'app/eaxis/distribution/manifest-list/attach-orders-read-only/attach-orders-view.controller.js',
                    'app/eaxis/distribution/manifest-list/attach-orders-read-only/attach-orders-view.css'
                ]
            }, {
                name: 'AddItemsView',
                files: [
                    'app/eaxis/distribution/manifest-list/add-items-read-only/add-items-view.directive.js',
                    'app/eaxis/distribution/manifest-list/add-items-read-only/add-items-view.controller.js',
                    'app/eaxis/distribution/manifest-list/add-items-read-only/add-items-view.css'
                ]
            }, {
                name: 'ConfirmBookingView',
                files: [
                    'app/eaxis/distribution/manifest-list/confirm-transport-booking-read-only/confirm-transport-booking-view.directive.js',
                    'app/eaxis/distribution/manifest-list/confirm-transport-booking-read-only/confirm-transport-booking-view.controller.js',
                    'app/eaxis/distribution/manifest-list/confirm-transport-booking-read-only/confirm-transport-booking-view.css'
                ]
            },
            //endregion
            //region dms dashboard
            {
                name: 'Dashboard',
                files: [
                    'app/eaxis/distribution/dashboard/dashboard.css',
                    'app/eaxis/distribution/dashboard/dashboard.controller.js',
                ]
            },
            //endregion
            //region
            {
                name: 'createGatepass',
                files: [
                    'app/eaxis/distribution/create-gatepass/create-gatepass.css',
                    'app/eaxis/distribution/create-gatepass/create-gatepass.controller.js',
                    'app/eaxis/distribution/create-gatepass/create-gatepass-config.factory.js'
                ]
            },
            //endregion
            //region
            {
                name: 'createManifest',
                files: [
                    'app/eaxis/distribution/create-manifest/create-manifest.css',
                    'app/eaxis/distribution/create-manifest/create-manifest.controller.js',
                    'app/eaxis/distribution/create-manifest/create-manifest-config.factory.js'
                ]
            },
            //endregion
            //region manifest transaction 
            {
                name: 'manifestTransaction',
                files: [
                    'app/eaxis/distribution/manifest-transaction/manifest-transcation.controller.js',
                    'app/eaxis/distribution/manifest-transaction/manifest-transaction.config.factory.js',
                    'app/eaxis/distribution/manifest-transaction/manifest-transaction.css'
                ]
            }, {
                name: 'manifestTransactionMenu',
                files: [
                    'app/eaxis/distribution/manifest-transaction/manifest-transaction-menu/manifest-transaction-menu.controller.js',
                    'app/eaxis/distribution/manifest-transaction/manifest-transaction-menu/manifest-transaction-menu.directive.js',
                    'app/eaxis/distribution/manifest-transaction/manifest-transaction-menu/manifest-transaction-menu.css'
                ]
            }, {
                name: 'dmsGatepass',
                files: [
                    'app/eaxis/distribution/manifest-transaction/gatepass/gatepass.controller.js',
                    'app/eaxis/distribution/manifest-transaction/gatepass/gatepass.directive.js',
                    'app/eaxis/distribution/manifest-transaction/gatepass/gatepass.css'
                ]
            },
            // endregion
            // region MyTask
            {
                name: 'AttachManifestDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest.css'
                ]
            }, {
                name: 'AttachManifestEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest-edit/attach-manifest-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest-edit/attach-manifest-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest-edit/attach-manifest-edit.css'
                ]
            }, {
                name: 'DockInDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in.css'
                ]
            }, {
                name: 'DockInEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in-edit/dock-in-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in-edit/dock-in-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in-edit/dock-in-edit.css'
                ]
            }, {
                name: 'DockOutDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out.css'
                ]
            }, {
                name: 'DockOutEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out-edit/dock-out-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out-edit/dock-out-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out-edit/dock-out-edit.css'
                ]
            }, {
                name: 'GateOutDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out.css'
                ]
            }, {
                name: 'GateOutEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out-edit/gate-out-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out-edit/gate-out-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out-edit/gate-out-edit.css'
                ]
            }, {
                name: 'StartLoadDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/start-load/start-load.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-load/start-load.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-load/start-load.css'
                ]
            }, {
                name: 'StartLoadEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/start-load/start-load-edit/start-load-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-load/start-load-edit/start-load-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-load/start-load-edit/start-load-edit.css'
                ]
            }, {
                name: 'CompleteLoadDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load.css'
                ]
            }, {
                name: 'CompleteLoadEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load-edit/complete-load-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load-edit/complete-load-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load-edit/complete-load-edit.css'
                ]
            }, {
                name: 'StartUnloadDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload.css'
                ]
            }, {
                name: 'StartUnloadEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload-edit/start-unload-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload-edit/start-unload-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload-edit/start-unload-edit.css'
                ]
            }, {
                name: 'CompleteUnloadDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload.css'
                ]
            }, {
                name: 'CompleteUnloadEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload-edit/complete-unload-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload-edit/complete-unload-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload-edit/complete-unload-edit.css'
                ]
            }, {
                name: 'ConfirmManifestDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest.css'
                ]
            }, {
                name: 'ConfirmManifestEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest-edit/confirm-manifest-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest-edit/confirm-manifest-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest-edit/confirm-manifest-edit.css'
                ]
            }, {
                name: 'ApproveManifestDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest.css'
                ]
            }, {
                name: 'ApproveManifestEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest-edit/approve-manifest-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest-edit/approve-manifest-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest-edit/approve-manifest-edit.css'
                ]
            }, {
                name: 'TransportBookingDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking.css'
                ]
            }, {
                name: 'TransportBookingEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking-edit/transport-booking-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking-edit/transport-booking-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking-edit/transport-booking-edit.css'
                ]
            }, {
                name: 'CompleteManifestDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest.css'
                ]
            }, {
                name: 'CompleteManifestEditDirective',
                files: [
                    'app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest-edit/complete-manifest-edit.directive.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest-edit/complete-manifest-edit.controller.js',
                    'app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest-edit/complete-manifest-edit.css'
                ]
            },

            // endregion
            //region dms dashboard
            {
                name: 'Dashboard',
                files: [
                    'app/eaxis/distribution/dashboard/dashboard.css',
                    'app/eaxis/distribution/dashboard/dashboard.controller.js',
                ]
            },

            //endregion
            //region
            {
                name: 'createGatepass',
                files: [
                    'app/eaxis/distribution/create-gatepass/create-gatepass.css',
                    'app/eaxis/distribution/create-gatepass/create-gatepass.controller.js',
                    'app/eaxis/distribution/create-gatepass/create-gatepass-config.factory.js'
                ]
            },
            //endregion
            //region
            {
                name: 'createManifest',
                files: [
                    'app/eaxis/distribution/create-manifest/create-manifest.css',
                    'app/eaxis/distribution/create-manifest/create-manifest.controller.js',
                    'app/eaxis/distribution/create-manifest/create-manifest-config.factory.js'
                ]
            },

            {
                name: 'transportsReport',
                files: [
                    'app/eaxis/distribution/transports-reports/reports.css',
                    'app/eaxis/distribution/transports-reports/reports.controller.js',
                ]
            },
            //endregion
            // region
            // consignment screen in DMS
            {
                name: 'dmsconsignment',
                files: [
                    'app/eaxis/distribution/consignment/consignment.css',
                    'app/eaxis/distribution/consignment/consignment.controller.js',
                    'app/eaxis/distribution/consignment/consignment-config.factory.js'
                ]
            },
            {
                name: 'dmsconsignmentMenu',
                files: [
                    'app/eaxis/distribution/consignment/consignment-menu/consignment-menu.css',
                    'app/eaxis/distribution/consignment/consignment-menu/consignment-menu.controller.js',
                    'app/eaxis/distribution/consignment/consignment-menu/consignment-menu.directive.js'
                ]
            },
            {
                name: 'dmsconsignmentGeneral',
                files: [
                    'app/eaxis/distribution/consignment/consignment-general/consignment-general.css',
                    'app/eaxis/distribution/consignment/consignment-general/consignment-general.controller.js',
                    'app/eaxis/distribution/consignment/consignment-general/consignment-general.directive.js'
                ]
            },
            {
                name: 'dmsconsignmentaddress',
                files: [
                    'app/eaxis/distribution/consignment/consignment-general/consignment-address/consignment-address.css',
                    'app/eaxis/distribution/consignment/consignment-general/consignment-address/consignment-address.controller.js'
                ]
            },
            // endregion
            //OTP
            {
                name: 'otpList',
                files: [
                    'app/eaxis/distribution/otp-list/otp-list.config.factory.js',
                    'app/eaxis/distribution/otp-list/otp-list.controller.js',
                ]
            },

            // endregion
        ]
    };

    angular
        .module("Application")
        .constant("DISTRIBUTION_CONSTANT", DISTRIBUTION_CONSTANT);
})();
