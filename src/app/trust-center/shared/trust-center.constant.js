(function () {
    'use strict';

    var TRUST_CENTER_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'trustCenter',
            files: [
                'app/trust-center/shared/trust-center.css',
                'app/trust-center/shared/trust-center-config.factory.js',
                'app/trust-center/shared/trust-center.controller.js',
            ]
        }, {
            name: 'TCHome',
            files: [
                'app/trust-center/home/home.css',
                'app/trust-center/home/home.controller.js'
            ]
        }, {
            name: 'TCDashboard',
            files: [
                'app/trust-center/dashboard/dashboard.css',
                'app/trust-center/dashboard/dashboard.controller.js'
            ]
        }, {
            name: 'TCTenant',
            files: [
                'app/trust-center/tenant/tenant.css',
                'app/trust-center/tenant/tenant.controller.js'
            ]
        }, {
            name: 'TCApplication',
            files: [
                'app/trust-center/application/application.css',
                'app/trust-center/application/application.controller.js'
            ]
        }, {
            name: 'TCUser',
            files: [
                'app/trust-center/user/user.css',
                'app/trust-center/user/user.controller.js'
            ]
        }, {
            name: 'TCManageStaticListing',
            files: [
                'app/trust-center/manage-static-listing/manage-static-listing.css',
                'app/trust-center/manage-static-listing/manage-static-listing.controller.js'
            ]
        }, {
            name: 'TCFilterGroup',
            files: [
                'app/trust-center/filter/filter-group/filter-group.css',
                'app/trust-center/filter/filter-group/filter-group.controller.js'
            ]
        }, {
            name: 'TCFilterList',
            files: [
                'app/trust-center/filter/filter-list/filter-list.css',
                'app/trust-center/filter/filter-list/filter-list.controller.js'
            ]
        }, {
            name: 'TCDataConfig',
            files: [
                'app/trust-center/data-config/data-config.css',
                'app/trust-center/data-config/data-config.controller.js',
                'app/trust-center/data-config/data-config-modal/data-config-modal.controller.js'
            ]
        }, {
            name: 'TCComponent',
            files: [
                'app/trust-center/component/component.css',
                'app/trust-center/component/component.controller.js'
            ]
        }, {
            name: 'TCProcessOld',
            files: [
                'app/trust-center/process-old/process/process.css',
                'app/trust-center/process-old/process/process.controller.js'
            ]
        }, {
            name: 'TCProcessTask',
            files: [
                'app/trust-center/process-old/process-task/process-task.css',
                'app/trust-center/process-old/process-task/process-task.controller.js'
            ]
        }, {
            name: 'TCProcess',
            files: [
                'app/trust-center/process/process/process.css',
                'app/trust-center/process/process/process.controller.js'
            ]
        }, {
            name: 'TCProcessScenarios',
            files: [
                'app/trust-center/process/process-scenarios/process-scenarios.css',
                'app/trust-center/process/process-scenarios/process-scenarios.controller.js'
            ]
        }, {
            name: 'TCProcessWorkStep',
            files: [
                'app/trust-center/process/process-work-step/process-work-step.css',
                'app/trust-center/process/process-work-step/process-work-step.controller.js'
            ]
        }, {
            name: 'TCProcessWorkStepAccessModal',
            files: [
                'app/trust-center/process/process-work-step/process-work-step-access/process-work-step-access.css',
                'app/trust-center/process/process-work-step/process-work-step-access/process-work-step-access.controller.js'
            ]
        }, {
            name: 'TCProcessWorkStepRules',
            files: [
                'app/trust-center/process/process-work-step/process-work-step-rules/process-work-step-rules.css',
                'app/trust-center/process/process-work-step/process-work-step-rules/process-work-step-rules.controller.js'
            ]
        }, {
            name: 'TCProcessWorkStepDirective',
            files: [
                'app/trust-center/process/process-work-step-directive/process-work-step-directive.css',
                'app/trust-center/process/process-work-step-directive/process-work-step-directive.directive.js',
                'app/trust-center/process/process-work-step-directive/process-work-step-directive.controller.js'
            ]
        }, {
            name: 'TCProcessInstance',
            files: [
                'app/trust-center/process/process-instance/process-instance.css',
                'app/trust-center/process/process-instance/process-instance.controller.js',
                'app/trust-center/process/process-instance/process-instance-config.factory.js'
            ]
        }, {
            name: 'TCProcessInstanceWorkItemDetails',
            files: [
                'app/trust-center/process/process-instance/process-instance-work-item-details/process-instance-work-item-details.css',
                'app/trust-center/process/process-instance/process-instance-work-item-details/process-instance-work-item-details.controller.js',
                'app/trust-center/process/process-instance/process-instance-work-item-details/process-instance-work-item-details.directive.js'
            ]
        }, {
            name: 'TCProcessInstanceMenu',
            files: [
                'app/trust-center/process/process-instance/process-instance-menu/process-instance-menu.css',
                'app/trust-center/process/process-instance/process-instance-menu/process-instance-menu.directive.js',
                'app/trust-center/process/process-instance/process-instance-menu/process-instance-menu.controller.js'
            ]
        }, {
            name: 'TCProcessInstanceModal',
            files: [
                'app/trust-center/process/process-instance/process-instance-modal/process-instance-modal.css',
                'app/trust-center/process/process-instance/process-instance-modal/process-instance-modal.controller.js'
            ]
        }, {
            name: 'TCManageParameters',
            files: [
                'app/trust-center/manage-parameters/manage-parameters.css',
                'app/trust-center/manage-parameters/manage-parameters.controller.js'
            ]
        }, {
            name: 'TCPage',
            files: [
                'app/trust-center/page/page/page.css',
                'app/trust-center/page/page/page.controller.js'
            ]
        }, {
            name: 'TCEditPage',
            files: [
                'app/trust-center/page/edit/edit-page.css',
                'app/trust-center/page/edit/edit-page.controller.js'
            ]
        }, {
            name: 'TCShareTable',
            files: [
                'app/trust-center/share-tables-and-fields/share-table/share-table.css',
                'app/trust-center/share-tables-and-fields/share-table/share-table.controller.js'
            ]
        }, {
            name: 'TCShareField',
            files: [
                'app/trust-center/share-tables-and-fields/share-field/share-field.css',
                'app/trust-center/share-tables-and-fields/share-field/share-field.controller.js'
            ]
        }, {
            name: 'TCMenu',
            files: [
                'app/trust-center/menu/menu.css',
                'app/trust-center/menu/menu.controller.js'
            ]
        }, {
            name: 'TCMenuGroups',
            files: [
                'app/trust-center/menu-group/menu-group.css',
                'app/trust-center/menu-group/menu-group.controller.js'
            ]
        }, {
            name: 'TCRoles',
            files: [
                'app/trust-center/roles/roles.css',
                'app/trust-center/roles/roles.controller.js'
            ]
        }, {
            name: 'TCApplicationSettings',
            files: [
                'app/trust-center/settings/application-settings/application-settings.css',
                'app/trust-center/settings/application-settings/application-settings.controller.js'
            ]
        }, {
            name: 'TCUserSettings',
            files: [
                'app/trust-center/settings/user-settings/user-settings.css',
                'app/trust-center/settings/user-settings/user-settings.controller.js'
            ]
        }, {
            name: 'TCLoginHistory',
            files: [
                'app/trust-center/login-history/login-history.css',
                'app/trust-center/login-history/login-history.controller.js'
            ]
        }, {
            name: 'TCMappingVertical',
            files: [
                'app/trust-center/mapping/mapping-config.factory.js',
                'app/trust-center/mapping/mapping-vertical/mapping-vertical.css',
                'app/trust-center/mapping/mapping-vertical/mapping-vertical.controller.js'
            ]
        }, {
            name: 'TCMappingHorizontal',
            files: [
                'app/trust-center/mapping/mapping-config.factory.js',
                'app/trust-center/mapping/mapping-horizontal/mapping-horizontal.css',
                'app/trust-center/mapping/mapping-horizontal/mapping-horizontal.controller.js'
            ]
        }, {
            name: 'TCUserList',
            files: [
                'app/trust-center/user-list/user-list.css',
                'app/trust-center/user-list/user-list.controller.js'
            ]
        }, {
            name: 'TCCompanyList',
            files: [
                'app/trust-center/company-list/company-list.css',
                'app/trust-center/company-list/company-list.controller.js'
            ]
        }, {
            name: 'TCLanguage',
            files: [
                'app/trust-center/language/language.css',
                'app/trust-center/language/language.controller.js'
            ]
        }, {
            name: 'TCSession',
            files: [
                'app/trust-center/session/session.css',
                'app/trust-center/session/session.controller.js'
            ]
        }, {
            name: 'TCValidation',
            files: [
                'app/trust-center/validation/validation.css',
                'app/trust-center/validation/validation.controller.js'
            ]
        }]
    };

    angular.module("Application")
        .constant("TRUST_CENTER_CONSTANT", TRUST_CENTER_CONSTANT);
})();
