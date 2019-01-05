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
                'app/trust-center/user/user.controller.js'
            ]
        }, {
            name: 'TCMaintenance',
            files: [
                'app/trust-center/maintenance/maintenance.css',
                'app/trust-center/maintenance/maintenance.controller.js'
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
            name: 'TCDataExtraction',
            files: [
                'app/trust-center/data-extraction/data-extraction.css',
                'app/trust-center/data-extraction/data-extraction.controller.js'
            ]
        }, {
            name: 'TCDataExtAudit',
            files: [
                'app/trust-center/data-extraction/audit/audit.css',
                'app/trust-center/data-extraction/audit/audit.controller.js'
            ]
        }, {
            name: 'TCDataExtEvent',
            files: [
                'app/trust-center/data-extraction/event/event.css',
                'app/trust-center/data-extraction/event/event.controller.js'
            ]
        }, {
            name: 'TCDataExtIntegration',
            files: [
                'app/trust-center/data-extraction/integration/integration.css',
                'app/trust-center/data-extraction/integration/integration.controller.js'
            ]
        }, {
            name: 'TCDataExtFullTextSearch',
            files: [
                'app/trust-center/data-extraction/full-text-search/full-text-search.css',
                'app/trust-center/data-extraction/full-text-search/full-text-search.controller.js'
            ]
        }, {
            name: 'TCDataExtSharedEntities',
            files: [
                'app/trust-center/data-extraction/shared-entities/shared-entities.css',
                'app/trust-center/data-extraction/shared-entities/shared-entities.controller.js'
            ]
        }, {
            name: 'TCDataExtReportFields',
            files: [
                'app/trust-center/data-extraction/report-fields/report-fields.css',
                'app/trust-center/data-extraction/report-fields/report-fields.controller.js'
            ]
        }, {
            name: 'TCDataExtEntityScore',
            files: [
                'app/trust-center/data-extraction/entity-score/entity-score.css',
                'app/trust-center/data-extraction/entity-score/entity-score.controller.js'
            ]
        }, {
            name: 'TCComponent',
            files: [
                'app/trust-center/component/component.css',
                'app/trust-center/component/component.controller.js'
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
            name: 'TCActivityFormConfiguration',
            files: [
                'app/trust-center/process/tc-activity-form-configuration/tc-activity-form-configuration.directive.js',
                'app/trust-center/process/tc-activity-form-configuration/tc-activity-form-configuration.controller.js',
                'app/trust-center/process/tc-activity-form-configuration/tc-activity-form-configuration.css'
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
            name: 'TCRelatedLookup',
            files: [
                'app/trust-center/page/related-lookup/related-lookup.css',
                'app/trust-center/page/related-lookup/related-lookup.controller.js'
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
            name: 'TCParties',
            files: [
                'app/trust-center/parties/parties.css',
                'app/trust-center/parties/parties.controller.js'
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
            name: 'TCTenantUserSettings',
            files: [
                'app/trust-center/settings/tenant-user-settings/tenant-user-settings.css',
                'app/trust-center/settings/tenant-user-settings/tenant-user-settings.controller.js'
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
        }, {
            name: 'TCValidationGroup',
            files: [
                'app/trust-center/validation/validation-group/validation-group.controller.js'
            ]
        }, {
            name: 'TCValidationGroupMapping',
            files: [
                'app/trust-center/validation/validation-group-mapping/validation-group-mapping.controller.js'
            ]
        }, {
            name: 'TCDynamicListView',
            files: [
                'app/trust-center/dynamic-list-view/dynamic-list-view.css',
                'app/trust-center/dynamic-list-view/dynamic-list-view.controller.js'
            ]
        }, {
            name: 'TCDynamicDetailsView',
            files: [
                'app/trust-center/dynamic-details-view/dynamic-details-view.css',
                'app/trust-center/dynamic-details-view/dynamic-details-view.controller.js',
            ]
        }, {
            name: 'TCEvent',
            files: [
                'app/trust-center/event/event.css',
                'app/trust-center/event/event-config.factory.js',
                'app/trust-center/event/event.controller.js'
            ]
        }, {
            name: 'TCEventConfigure',
            files: [
                'app/trust-center/event/tc-event-configure/tc-event-configure.css',
                'app/trust-center/event/tc-event-configure/tc-event-configure.directive.js',
                'app/trust-center/event/tc-event-configure/tc-event-configure.controller.js'
            ]
        }, {
            name: 'TCDocumentType',
            files: [
                'app/trust-center/document-type/document-type.css',
                'app/trust-center/document-type/document-type-config.factory.js',
                'app/trust-center/document-type/document-type.controller.js'
            ]
        }, {
            name: 'TCDocumentTypeConfigure',
            files: [
                'app/trust-center/document-type/tc-document-type-configure/tc-document-type-configure.css',
                'app/trust-center/document-type/tc-document-type-configure/tc-document-type-configure.directive.js',
                'app/trust-center/document-type/tc-document-type-configure/tc-document-type-configure.controller.js'
            ]
        }, {
            name: 'TCExceptionType',
            files: [
                'app/trust-center/exception-type/exception-type.css',
                'app/trust-center/exception-type/exception-type-config.factory.js',
                'app/trust-center/exception-type/exception-type.controller.js'
            ]
        }, {
            name: 'TCExceptionTypeConfigure',
            files: [
                'app/trust-center/exception-type/tc-exception-type-configure/tc-exception-type-configure.css',
                'app/trust-center/exception-type/tc-exception-type-configure/tc-exception-type-configure.directive.js',
                'app/trust-center/exception-type/tc-exception-type-configure/tc-exception-type-configure.controller.js'
            ]
        }, {
            name: 'TCComments',
            files: [
                'app/trust-center/comments/comments.css',
                'app/trust-center/comments/comments-config.factory.js',
                'app/trust-center/comments/comments.controller.js'
            ]
        }, {
            name: 'TCCommentsConfigure',
            files: [
                'app/trust-center/comments/tc-comments-configure/tc-comments-configure.css',
                'app/trust-center/comments/tc-comments-configure/tc-comments-configure.directive.js',
                'app/trust-center/comments/tc-comments-configure/tc-comments-configure.controller.js'
            ]
        }, {
            name: 'TCEmail',
            files: [
                'app/trust-center/email/email.css',
                'app/trust-center/email/email-config.factory.js',
                'app/trust-center/email/email.controller.js'
            ]
        }, {
            name: 'TCEmailConfigure',
            files: [
                'app/trust-center/email/tc-email-configure/tc-email-configure.css',
                'app/trust-center/email/tc-email-configure/tc-email-configure.directive.js',
                'app/trust-center/email/tc-email-configure/tc-email-configure.controller.js'
            ]
        }, {
            name: 'TCSOPTypelist',
            files: [
                'app/trust-center/sop-typelist/sop-typelist.css',
                'app/trust-center/sop-typelist/sop-typelist-config.factory.js',
                'app/trust-center/sop-typelist/sop-typelist.controller.js'
            ]
        }, {
            name: 'SOPTypelistConfigure',
            files: [
                'app/trust-center/sop-typelist/tc-sop-typelist-configure/tc-sop-typelist-configure.directive.js',
                'app/trust-center/sop-typelist/tc-sop-typelist-configure/tc-sop-typelist-configure.controller.js',
                'app/trust-center/sop-typelist/tc-sop-typelist-configure/tc-sop-typelist-configure.css'
            ]
        }, {
            name: 'TCEBPMTypesList',
            files: [
                'app/trust-center/ebpm-types/ebpm-types.css',
                'app/trust-center/ebpm-types/ebpm-types-config.factory.js',
                'app/trust-center/ebpm-types/ebpm-types.controller.js'
            ]
        }, {
            name: 'EBPMTypesConfigure',
            files: [
                'app/trust-center/ebpm-types/tc-ebpm-types-configure/tc-ebpm-types-configure.directive.js',
                'app/trust-center/ebpm-types/tc-ebpm-types-configure/tc-ebpm-types-configure.controller.js',
                'app/trust-center/ebpm-types/tc-ebpm-types-configure/tc-ebpm-types-configure.css'
            ]
        }, {
            name: 'TCApplicationDropdown',
            files: [
                'app/trust-center/shared/tc-application-dropdown/tc-application-dropdown.directive.js',
            ]
        }, {
            name: 'TCAppTrustAppTenant',
            files: [
                'app/trust-center/mapping/app-trust-app-tenant/app-trust-app-tenant.css',
                'app/trust-center/mapping/app-trust-app-tenant/app-trust-app-tenant.controller.js'
            ]
        }, {
            name: 'TCSecAppSecTenant',
            files: [
                'app/trust-center/mapping/sec-app-sec-tenant/sec-app-sec-tenant.css',
                'app/trust-center/mapping/sec-app-sec-tenant/sec-app-sec-tenant.controller.js'
            ]
        }, {
            name: 'TCUserRoleAppTenant',
            files: [
                'app/trust-center/mapping/user-role-app-tenant/user-role-app-tenant.css',
                'app/trust-center/mapping/user-role-app-tenant/user-role-app-tenant.controller.js'
            ]
        }, {
            name: 'TCUserCmpAppTenant',
            files: [
                'app/trust-center/mapping/user-cmp-app-tenant/user-cmp-app-tenant.css',
                'app/trust-center/mapping/user-cmp-app-tenant/user-cmp-app-tenant.controller.js'
            ]
        }, {
            name: 'TCUserWarehouseAppTenant',
            files: [
                'app/trust-center/mapping/user-warehouse-app-tenant/user-warehouse-app-tenant.css',
                'app/trust-center/mapping/user-warehouse-app-tenant/user-warehouse-app-tenant.controller.js'
            ]
        }, {
            name: 'TCUserOrganizationAppTenant',
            files: [
                'app/trust-center/mapping/user-organization-app-tenant/user-organization-app-tenant.css',
                'app/trust-center/mapping/user-organization-app-tenant/user-organization-app-tenant.controller.js'
            ]
        }, {
            name: 'TCCompRoleAppTenant',
            files: [
                'app/trust-center/mapping/comp-role-app-tenant/comp-role-app-tenant.css',
                'app/trust-center/mapping/comp-role-app-tenant/comp-role-app-tenant.controller.js'
            ]
        }, {
            name: 'TCCompRoleAppTenant',
            files: [
                'app/trust-center/mapping/comp-role-app-tenant/comp-role-app-tenant.css',
                'app/trust-center/mapping/comp-role-app-tenant/comp-role-app-tenant.controller.js'
            ]
        }, {
            name: 'TCCompOrgAppTenant',
            files: [
                'app/trust-center/mapping/comp-org-app-tenant/comp-org-app-tenant.css',
                'app/trust-center/mapping/comp-org-app-tenant/comp-org-app-tenant.controller.js'
            ]
        }, {
            name: 'TCGroupRoleAppTenant',
            files: [
                'app/trust-center/mapping/group-role-app-tenant/group-role-app-tenant.css',
                'app/trust-center/mapping/group-role-app-tenant/group-role-app-tenant.controller.js'
            ]
        }, {
            name: 'TCMenuRoleAppTenant',
            files: [
                'app/trust-center/mapping/menu-role-app-tenant/menu-role-app-tenant.css',
                'app/trust-center/mapping/menu-role-app-tenant/menu-role-app-tenant.controller.js'
            ]
        }, {
            name: 'TCFilterRoleAppTenant',
            files: [
                'app/trust-center/mapping/filter-role-app-tenant/filter-role-app-tenant.css',
                'app/trust-center/mapping/filter-role-app-tenant/filter-role-app-tenant.controller.js'
            ]
        }]
    };

    angular.module("Application")
        .constant("TRUST_CENTER_CONSTANT", TRUST_CENTER_CONSTANT);
})();
