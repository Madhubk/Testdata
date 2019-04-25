(function () {
    'use strict';

    var DYNAMIC_DASHBOARD_CONSTANT = {
        ocLazyLoadModules: [
            // #region
            {
                name: 'eAxisDynamicDashboard',
                files: [
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js',
                    'app/mdm/warehouse/custom/customfilter.js'

                ]
            },
            //#region WMS Dynamic Dashboard
            {
                name: 'dynamicDashboard',
                files: [
                    'app/eaxis/dynamic-dashboard/dynamic-dashboard.css',
                    'app/eaxis/dynamic-dashboard/dynamic-dashboard.controller.js',
                    'app/eaxis/dynamic-dashboard/dynamic-dashboard.directive.js',
                    'app/eaxis/dynamic-dashboard/dynamic-dashboard-config.factory.js'
                ]
            }, {
                name: 'PreviewDashboard',
                files: [
                    'app/eaxis/dynamic-dashboard/preview-dashboard/preview-dashboard.controller.js',
                    // 'app/eaxis/dynamic-dashboard/asn-received-status/asn-received-status.directive.js',
                ]
            }, {
                name: 'AsnReceivedWithStatus',
                files: [
                    'app/eaxis/dynamic-dashboard/asn-received-status/asn-received-status.controller.js',
                    'app/eaxis/dynamic-dashboard/asn-received-status/asn-received-status.directive.js',
                ]
            }, {
                name: 'AsnTrend',
                files: [
                    'app/eaxis/dynamic-dashboard/asn-trend/asn-trend.controller.js',
                    'app/eaxis/dynamic-dashboard/asn-trend/asn-trend.directive.js',
                ]
            }, {
                name: 'OpenSO',
                files: [
                    'app/eaxis/dynamic-dashboard/open-so/open-so.controller.js',
                    'app/eaxis/dynamic-dashboard/open-so/open-so.directive.js',
                ]
            }, {
                name: 'PickWithShortfall',
                files: [
                    'app/eaxis/dynamic-dashboard/pick-with-shortfall/pick-with-shortfall.controller.js',
                    'app/eaxis/dynamic-dashboard/pick-with-shortfall/pick-with-shortfall.directive.js',
                ]
            }, {
                name: 'PutawayStatus',
                files: [
                    'app/eaxis/dynamic-dashboard/putaway-status/putaway-status.controller.js',
                    'app/eaxis/dynamic-dashboard/putaway-status/putaway-status.directive.js',
                ]
            }, {
                name: 'GrnStatus',
                files: [
                    'app/eaxis/dynamic-dashboard/grn-status/grn-status.controller.js',
                    'app/eaxis/dynamic-dashboard/grn-status/grn-status.directive.js',
                ]
            }, {
                name: 'CycleCountJobs',
                files: [
                    'app/eaxis/dynamic-dashboard/cycle-count-jobs/cycle-count-jobs.controller.js',
                    'app/eaxis/dynamic-dashboard/cycle-count-jobs/cycle-count-jobs.directive.js',
                ]
            }, {
                name: 'Notification',
                files: [
                    'app/eaxis/dynamic-dashboard/notification/notification.css',
                    'app/eaxis/dynamic-dashboard/notification/notification.controller.js',
                    'app/eaxis/dynamic-dashboard/notification/notification.directive.js',
                ]
            },
            //#endregion
            //#endregion
        ]
    };

    angular
        .module("Application")
        .constant("DYNAMIC_DASHBOARD_CONSTANT", DYNAMIC_DASHBOARD_CONSTANT);
})();
