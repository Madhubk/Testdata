(function () {
    'use strict';

    var EAXIS_CONSTANT = {
        ocLazyLoadModules: [
            // region EAxis
            {
                name: 'eAxis',
                files: [
                    'app/eaxis/shared/eaxis.css',
                    'app/eaxis/shared/eaxis-config.factory.js',
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
                name: 'dynamicMultiDashboard',
                files: [
                    'app/eaxis/shared/dynamic-multi-dashboard/dynamic-multi-dashboard.directive.js'
                ]
            }, {
                name: 'EADynamicListView',
                files: [
                    'app/eaxis/shared/dynamic-list-view/dynamic-list-view.controller.js'
                ]
            }, {
                name: 'EADynamicDetailsView',
                files: [
                    'app/eaxis/shared/dynamic-details-view/dynamic-details-view.controller.js'
                ]
            },
            // endregion
            // region Control Tower
            {
                name: 'ControlTower',
                files: [
                    'app/eaxis/control-tower/control-tower.css',
                    'app/eaxis/control-tower/control-tower.controller.js'
                ]
            }, {
                name: 'ControlTowerTaskList',
                files: [
                    'app/eaxis/control-tower/control-tower-task-list/control-tower-task-list.css',
                    'app/eaxis/control-tower/control-tower-task-list/control-tower-task-list.controller.js'
                ]
            }, {
                name: 'WorkItemStatusCount',
                files: [
                    'app/eaxis/control-tower/work-item-status-count/work-item-status-count.css',
                    'app/eaxis/control-tower/work-item-status-count/work-item-status-count.directive.js',
                    'app/eaxis/control-tower/work-item-status-count/work-item-status-count.controller.js'
                ]
            },
            // endregion
            // region My Task
            {
                name: 'MyTask',
                files: [
                    'app/eaxis/my-task/my-task.css',
                    'app/eaxis/my-task/my-task.controller.js'
                ]
            }, {
                name: 'MyTaskConfig',
                files: [
                    'app/eaxis/my-task/my-task-config.factory.js'
                ]
            }, {
                name: 'MyTaskDirective',
                files: [
                    'app/eaxis/my-task/my-task-directive/my-task-directive.css',
                    'app/eaxis/my-task/my-task-directive/my-task-directive.controller.js'
                ]
            }, {
                name: 'WorkItemListView',
                files: [
                    'app/eaxis/my-task/work-item-list-view/work-item-list-view.css',
                    'app/eaxis/my-task/work-item-list-view/work-item-list-view-config.factory.js',
                    'app/eaxis/my-task/work-item-list-view/work-item-list-view.controller.js'
                ]
            }, {
                name: 'MyTaskDynamicDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-dynamic-directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-dynamic-edit-directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default-edit/my-task-default-edit.directive.js'
                ]
            },
            // EXCEPTION NOTIFY
            {
                name: 'ExceptNotifyDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify.css'
                ]
            }, {
                name: 'ExceptNotifyEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify-edit/except-notify-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify-edit/except-notify-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-notify/except-notify-edit/except-notify-edit.css'
                ]
            },
            // EXCEPTION Approval
            {
                name: 'ExceptApprovalDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval.css'
                ]
            }, {
                name: 'ExceptApprovalEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval-edit/except-approval-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval-edit/except-approval-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval-edit/except-approval-edit.css'
                ]
            },
            // EXCEPTION Reject
            {
                name: 'ExceptRejectDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject.css'
                ]
            }, {
                name: 'ExceptRejectEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-edit/except-reject-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-edit/except-reject-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-edit/except-reject-edit.css'
                ]
            }, {
                name: 'ExceptRejectModalDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-comments-modal/except-reject-comments-modal.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-comments-modal/except-reject-comments-modal.css'
                ]
            },
            // Approval Notify
            {
                name: 'ApprovalNotifyDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify.css'
                ]
            }, {
                name: 'ApprovalNotifyEditDirective',
                files: [
                    'app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify-edit/approval-notify-edit.directive.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify-edit/approval-notify-edit.controller.js',
                    'app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify-edit/approval-notify-edit.css'
                ]
            },
            // endregion
            // region All Document
            {
                name: 'AllDocuments',
                files: [
                    'app/eaxis/all-documents/all-documents.css',
                    'app/eaxis/all-documents/all-documents-config.factory.js',
                    'app/eaxis/all-documents/all-documents.controller.js'
                ]
            },
            // endregion
            // region Address
            {
                name: 'addressDirective',
                files: [
                    'app/eaxis/shared/address-directive/address-directive.css',
                    'app/eaxis/shared/address-directive/address-directive.js',
                ]
            }, {
                name: 'addressWrapper',
                files: [
                    'app/eaxis/shared/address-wrapper/address-wrapper.css',
                    'app/eaxis/shared/address-wrapper/address-wrapper.directive.js'
                ]
            }, {
                name: 'addressModal',
                files: [
                    'app/eaxis/shared/address-directive/address-modal/address-modal.css',
                    'app/eaxis/shared/address-directive/address-modal/address-modal.controller.js'
                ]
            },
            // endregion
            // region Activity Tab
            {
                name: 'ActivityTab',
                files: [
                    'app/eaxis/shared/activity-tab/activity-tab.directive.js'
                ]
            },
            // endregion

            //region General Reports
            {
                name: 'GeneralReports',
                files: [
                    'app/eaxis/general-reports/reports.css',
                    'app/eaxis/general-reports/reports.controller.js',
                ]
            },
            {
                name: 'ReportGridPage',
                files: [
                    'app/eaxis/general-reports/grid-page/grid-page.controller.js'
                ]
            },

            //endregion
        ]
    };

    angular
        .module("Application")
        .constant("EAXIS_CONSTANT", EAXIS_CONSTANT);
})();
