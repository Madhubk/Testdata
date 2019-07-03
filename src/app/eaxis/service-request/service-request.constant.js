(function () {
    'use strict';

    var SERVICE_REQUEST_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'EAserviceRequest',
            files: [
                'app/eaxis/service-request/service-request.css',
                'app/eaxis/service-request/service-request.controller.js',
                'app/mdm/warehouse/customize-table/customize-table.css',
                'app/mdm/warehouse/customize-table/customize-table.directive.js',
            ]
        }, {
            name: 'serviceRequestDashboard',
            files: [
                'app/eaxis/service-request/dashboard/dashboard.css',
                'app/eaxis/service-request/dashboard/dashboard.controller.js',
            ]
        },        
        // --------------------- Downtime Request -----------------------
        // region
        {
            name: 'downtimeRequest',
            files: [
                'app/eaxis/service-request/downtime-request/downtime-request.css',
                'app/eaxis/service-request/downtime-request/downtime-request.controller.js',
                'app/eaxis/service-request/downtime-request/downtime-request-config.factory.js'
            ]
        }, {
            name: 'downtimeRequestMenu',
            files: [
                'app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.css',
                'app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.controller.js',
                'app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.directive.js'
            ]
        }, {
            name: 'downtimeRequestGeneral',
            files: [
                'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.css',
                'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.controller.js',
                'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.directive.js'
            ]
        },
        // endregion 

        // --------------------- My Request -----------------------
        // region
        {
            name: 'myRequest',
            files: [
                'app/eaxis/service-request/my-request/my-request.css',
                'app/eaxis/service-request/my-request/my-request.controller.js',
                'app/eaxis/service-request/my-request/my-request-config.factory.js'
            ]
        },{
            name: 'myRequestReadOnly',
            files: [
                'app/eaxis/service-request/my-request/my-request-read-only/my-request-read-only.css',
                'app/eaxis/service-request/my-request/my-request-read-only/my-request-read-only.controller.js',
                'app/eaxis/service-request/my-request/my-request-read-only/my-request-read-only.directive.js'
            ]
        }, 
        // endregion    
        
        // --------------------- Service Request -----------------------
        // region
        {
            name: 'serviceRequestList',
            files: [
                'app/eaxis/service-request/service-request-list/service-request-list.css',
                'app/eaxis/service-request/service-request-list/service-request-list.controller.js',
                'app/eaxis/service-request/service-request-list/service-request-list-config.factory.js'
            ]
        },{
            name: 'serviceRequestListReadOnly',
            files: [
                'app/eaxis/service-request/service-request-list/service-request-list-read-only/service-request-list-read-only.css',
                'app/eaxis/service-request/service-request-list/service-request-list-read-only/service-request-list-read-only.controller.js',
                'app/eaxis/service-request/service-request-list/service-request-list-read-only/service-request-list-read-only.directive.js'
            ]
        },  
        // endregion 

        // --------------------- My Task -----------------------
        // region
        {
            name: 'downtimeApproval',
            files: [
                'app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval.css',
                'app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval.controller.js',
                'app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval.directive.js'
            ]
        },{
            name: 'downtimeApprovalEdit',
            files: [
                'app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval-edit/downtime-approval-edit.css',
                'app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval-edit/downtime-approval-edit.controller.js',
                'app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval-edit/downtime-approval-edit.directive.js'
            ]
        },{
            name: 'deploymentCompletion',
            files: [
                'app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion.css',
                'app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion.controller.js',
                'app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion.directive.js'
            ]
        },{
            name: 'deploymentCompletionEdit',
            files: [
                'app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion-edit/deployment-completion-edit.css',
                'app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion-edit/deployment-completion-edit.controller.js',
                'app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion-edit/deployment-completion-edit.directive.js'
            ]
        },
        // endregion 
        
        // --------------------- General Module -----------------------
        // region
        {
            name: 'serviceRequestReports',
            files: [
                'app/eaxis/service-request/general-module/service-request-report/service-request-report.controller.js',
                'app/eaxis/service-request/general-module/service-request-report/service-request-report.css'
            ]
        },{
            name: 'reportGrid',
            files: [
                'app/eaxis/service-request/general-module/service-request-report/report-grid-page/report-grid-page.controller.js'
            ]
        }
        // endregion
        ]
    };

    angular
        .module("Application")
        .constant("SERVICE_REQUEST_CONSTANT", SERVICE_REQUEST_CONSTANT);
})();
