(function () {
    'use strict';

    var APP_CONSTANT = {
        ocLazyLoadModules: [
            // region Pages
            {
                name: 'Login',
                files: [
                    'app/login/login.css',
                    'app/login/login.controller.js',
                    'app/login/login-form/login-form.controller.js',
                ]
            }, {
                name: 'TenantList',
                files: [
                    'app/tenant-list/tenant-list.css',
                    'app/tenant-list/tenant-list.controller.js'
                ]
            }, {
                name: 'userSetting',
                files: [
                    'app/user-setting/user-setting.css',
                    'app/user-setting/user-setting.controller.js'
                ]
            }, {
                name: 'ELink',
                files: [
                    'app/shared/elink/elink.css',
                    'app/shared/elink/elink.controller.js'
                ]
            }, {
                name: 'PartyList',
                files: [
                    'app/party-list/party-list.css',
                    'app/party-list/party-list.controller.js'
                ]
            }, {
                name: 'RoleList',
                files: [
                    'app/role-list/role-list.css',
                    'app/role-list/role-list.controller.js'
                ]
            },
            // endregion
            // region Common Directives
            {
                name: 'chromeTab',
                files: [
                    'assets/css/chrome-tab.css'
                ]
            }, {
                name: 'changePassword',
                files: [
                    'app/shared/change-password/change-password.css',
                    'app/shared/change-password/change-password.directive.js',
                    'app/shared/change-password/change-password.controller.js'
                ]
            }, {
                name: 'confirmation',
                files: [
                    'app/shared/confirmation/confirmation.factory.js'
                ]
            }, {
                name: 'errorWarning',
                files: [
                    'app/shared/error-warning/error-warning.css',
                    'app/shared/error-warning/error-warning.factory.js',
                    'app/shared/error-warning/error-warning-modal.factory.js',
                    'app/shared/error-warning/error-warning.directive.js'
                ]
            }, {
                name: 'oneLevelMapping',
                files: [
                    'app/shared/one-level-mapping/one-level-mapping.css',
                    'app/shared/one-level-mapping/one-level-mapping.directive.js',
                    'app/shared/one-level-mapping/one-level-mapping.controller.js'
                ]
            }, {
                name: 'IconColorList',
                files: [
                    'app/shared/icon-color-list/icon-color-list.css',
                    'app/shared/icon-color-list/icon-color-list.directive.js',
                    'app/shared/icon-color-list/icon-color-list-modal.controller.js'
                ]
            },
            // endregion
            // region Navbar, SideBar & Footerbar
            {
                name: 'navBar',
                files: [
                    'app/shared/nav-bar/nav-bar.css',
                    'app/shared/nav-bar/nav-bar.directive.js',
                    'app/shared/nav-bar/nav-bar.controller.js'
                ]
            }, {
                name: 'navbarDropdownMenu',
                files: [
                    'app/shared/nav-bar/navbar-dropdown-menu/navbar-dropdown-menu.css',
                    'app/shared/nav-bar/navbar-dropdown-menu/navbar-dropdown-menu.directive.js',
                    'app/shared/nav-bar/navbar-dropdown-menu/navbar-dropdown-menu.controller.js'
                ]
            }, {
                name: 'sideBar',
                files: [
                    'app/shared/side-bar/side-bar.css',
                    'app/shared/side-bar/side-bar.directive.js',
                    'app/shared/side-bar/side-bar.controller.js'
                ]
            }, {
                name: 'footerBar',
                files: [
                    'app/shared/footer-bar/footer-bar.directive.js'
                ]
            },
            // endregion
            // region Compare Date
            {
                name: 'compareDate',
                files: [
                    'app/shared/compare-date/compare-date.css',
                    'app/shared/compare-date/compare-date.directive.js',
                    'app/shared/compare-date/compare-date.controller.js'
                ]
            },
            // endregion
            // region Standard Menu
            {
                name: 'standardMenu',
                files: [
                    'app/shared/standard-menu/standard-menu.css',
                    'app/shared/standard-menu/standard-menu.directive.js',
                    'app/shared/standard-menu/standard-menu.controller.js'
                ]
            }, {
                name: 'Comment',
                files: [
                    'app/shared/standard-menu-directives/comment/comment/comment.css',
                    'app/shared/standard-menu-directives/comment/comment/comment.directive.js',
                    'app/shared/standard-menu-directives/comment/comment/comment.controller.js'
                ]
            }, {
                name: 'CommentModal',
                files: [
                    'app/shared/standard-menu-directives/comment/comment-modal/comment-modal.css',
                    'app/shared/standard-menu-directives/comment/comment-modal/comment-modal.directive.js',
                    'app/shared/standard-menu-directives/comment/comment-modal/comment-modal.controller.js'
                ]
            }, {
                name: 'Document',
                files: [
                    'app/shared/standard-menu-directives/document/document/document.css',
                    'app/shared/standard-menu-directives/document/document/document.directive.js',
                    'app/shared/standard-menu-directives/document/document/document.controller.js'
                ]
            }, {
                name: 'DocumentModal',
                files: [
                    'app/shared/standard-menu-directives/document/document-modal/document-modal.css',
                    'app/shared/standard-menu-directives/document/document-modal/document-modal.directive.js',
                    'app/shared/standard-menu-directives/document/document-modal/document-modal.controller.js'
                ]
            }, {
                name: 'DownloadAmendCountModal',
                files: [
                    'app/shared/standard-menu-directives/document/download-amend-count-modal/download-amend-count-modal.css',
                    'app/shared/standard-menu-directives/document/download-amend-count-modal/download-amend-count-modal.controller.js'
                ]
            }, {
                name: 'EmailGroup',
                files: [
                    'app/shared/standard-menu-directives/email-group/email-group/email-group.css',
                    'app/shared/standard-menu-directives/email-group/email-group/email-group.directive.js',
                    'app/shared/standard-menu-directives/email-group/email-group/email-group.controller.js'
                ]
            }, {
                name: 'EmailGroupModal',
                files: [
                    'app/shared/standard-menu-directives/email-group/email-group-modal/email-group-modal.css',
                    'app/shared/standard-menu-directives/email-group/email-group-modal/email-group-modal.directive.js',
                    'app/shared/standard-menu-directives/email-group/email-group-modal/email-group-modal.controller.js'
                ]
            }, {
                name: 'Event',
                files: [
                    'app/shared/standard-menu-directives/event/event/event.css',
                    'app/shared/standard-menu-directives/event/event/event.directive.js',
                    'app/shared/standard-menu-directives/event/event/event.controller.js',
                    'app/shared/standard-menu-directives/event/event/sm-event-dynamic-directive/sm-event-dynamic-directive.js',
                    'app/shared/standard-menu-directives/event/event/sm-event-dynamic-directive/sm-event-default/sm-event-default.directive.js'
                ]
            }, {
                name: 'EventModal',
                files: [
                    'app/shared/standard-menu-directives/event/event-modal/event-modal.css',
                    'app/shared/standard-menu-directives/event/event-modal/event-modal.directive.js',
                    'app/shared/standard-menu-directives/event/event-modal/event-modal.controller.js'
                ]
            }, {
                name: 'DataEvent',
                files: [
                    'app/shared/standard-menu-directives/data-event/data-event/data-event.css',
                    'app/shared/standard-menu-directives/data-event/data-event/data-event.directive.js',
                    'app/shared/standard-menu-directives/data-event/data-event/data-event.controller.js'
                ]
            }, {
                name: 'DataEventModal',
                files: [
                    'app/shared/standard-menu-directives/data-event/data-event-modal/data-event-modal.css',
                    'app/shared/standard-menu-directives/data-event/data-event-modal/data-event-modal.directive.js',
                    'app/shared/standard-menu-directives/data-event/data-event-modal/data-event-modal.controller.js'
                ]
            }, {
                name: 'Exception',
                files: [
                    'app/shared/standard-menu-directives/exception/exception/exception.css',
                    'app/shared/standard-menu-directives/exception/exception/exception.directive.js',
                    'app/shared/standard-menu-directives/exception/exception/exception.controller.js'
                ]
            }, {
                name: 'ExceptionModal',
                files: [
                    'app/shared/standard-menu-directives/exception/exception-modal/exception-modal.css',
                    'app/shared/standard-menu-directives/exception/exception-modal/exception-modal.directive.js',
                    'app/shared/standard-menu-directives/exception/exception-modal/exception-modal.controller.js'
                ]
            }, {
                name: 'AuditLog',
                files: [
                    'app/shared/standard-menu-directives/audit-log/audit-log/audit-log.css',
                    'app/shared/standard-menu-directives/audit-log/audit-log/audit-log.directive.js',
                    'app/shared/standard-menu-directives/audit-log/audit-log/audit-log-config.factory.js',
                    'app/shared/standard-menu-directives/audit-log/audit-log/audit-log.controller.js'
                ]
            }, {
                name: 'AuditLogModal',
                files: [
                    'app/shared/standard-menu-directives/audit-log/audit-log-modal/audit-log-modal.css',
                    'app/shared/standard-menu-directives/audit-log/audit-log-modal/audit-log-modal.directive.js',
                    'app/shared/standard-menu-directives/audit-log/audit-log-modal/audit-log-modal.controller.js'
                ]
            }, {
                name: 'Email',
                files: [
                    'app/shared/standard-menu-directives/email/email/email.css',
                    'app/shared/standard-menu-directives/email/email/email.directive.js',
                    'app/shared/standard-menu-directives/email/email/email.controller.js'
                ]
            }, {
                name: 'EmailModal',
                files: [
                    'app/shared/standard-menu-directives/email/email-modal/email-modal.css',
                    'app/shared/standard-menu-directives/email/email-modal/email-modal.directive.js',
                    'app/shared/standard-menu-directives/email/email-modal/email-modal.controller.js'
                ]
            }, {
                name: 'EmailDirective',
                files: [
                    'app/shared/standard-menu-directives/email/email/email-directive/email-directive.js'
                ]
            }, {
                name: 'EmailTemplateCreation',
                files: [
                    'app/shared/standard-menu-directives/email-template-creation/email-template-creation/email-template-creation.css',
                    'app/shared/standard-menu-directives/email-template-creation/email-template-creation/email-template-creation.directive.js',
                    'app/shared/standard-menu-directives/email-template-creation/email-template-creation/email-template-creation.controller.js'
                ]
            }, {
                name: 'EmailTemplateCreationModal',
                files: [
                    'app/shared/standard-menu-directives/email-template-creation/email-template-creation-modal/email-template-creation-modal.css',
                    'app/shared/standard-menu-directives/email-template-creation/email-template-creation-modal/email-template-creation-modal.directive.js',
                    'app/shared/standard-menu-directives/email-template-creation/email-template-creation-modal/email-template-creation-modal.controller.js'
                ]
            }, {
                name: 'Task',
                files: [
                    'app/shared/standard-menu-directives/task/task/task.css',
                    'app/shared/standard-menu-directives/task/task/task.directive.js',
                    'app/shared/standard-menu-directives/task/task/task.controller.js'
                ]
            }, {
                name: 'TaskModal',
                files: [
                    'app/shared/standard-menu-directives/task/task-modal/task-modal.css',
                    'app/shared/standard-menu-directives/task/task-modal/task-modal.directive.js',
                    'app/shared/standard-menu-directives/task/task-modal/task-modal.controller.js'
                ]
            }, {
                name: 'Keyword',
                files: [
                    'app/shared/standard-menu-directives/keyword/keyword/keyword.css',
                    'app/shared/standard-menu-directives/keyword/keyword/keyword.directive.js',
                    'app/shared/standard-menu-directives/keyword/keyword/keyword.controller.js'
                ]
            }, {
                name: 'KeywordModal',
                files: [
                    'app/shared/standard-menu-directives/keyword/keyword-modal/keyword-modal.css',
                    'app/shared/standard-menu-directives/keyword/keyword-modal/keyword-modal.directive.js',
                    'app/shared/standard-menu-directives/keyword/keyword-modal/keyword-modal.controller.js'
                ]
            }, {
                name: 'Parties',
                files: [
                    'app/shared/standard-menu-directives/parties/parties/parties.css',
                    'app/shared/standard-menu-directives/parties/parties/parties.directive.js',
                    'app/shared/standard-menu-directives/parties/parties/parties.controller.js'
                ]
            }, {
                name: 'PartiesModal',
                files: [
                    'app/shared/standard-menu-directives/parties/parties-modal/parties-modal.css',
                    'app/shared/standard-menu-directives/parties/parties-modal/parties-modal.directive.js',
                    'app/shared/standard-menu-directives/parties/parties-modal/parties-modal.controller.js'
                ]
            }, {
                name: 'DelayReason',
                files: [
                    'app/shared/standard-menu-directives/delay-reason/delay-reason/delay-reason.css',
                    'app/shared/standard-menu-directives/delay-reason/delay-reason/delay-reason.directive.js',
                    'app/shared/standard-menu-directives/delay-reason/delay-reason/delay-reason.controller.js'
                ]
            }, {
                name: 'DelayReasonModal',
                files: [
                    'app/shared/standard-menu-directives/delay-reason/delay-reason-modal/delay-reason-modal.css',
                    'app/shared/standard-menu-directives/delay-reason/delay-reason-modal/delay-reason-modal.directive.js',
                    'app/shared/standard-menu-directives/delay-reason/delay-reason-modal/delay-reason-modal.controller.js'
                ]
            }, {
                name: 'Checklist',
                files: [
                    'app/shared/standard-menu-directives/checklist/checklist/checklist.css',
                    'app/shared/standard-menu-directives/checklist/checklist/checklist.directive.js',
                    'app/shared/standard-menu-directives/checklist/checklist/checklist.controller.js'
                ]
            }, {
                name: 'ChecklistModal',
                files: [
                    'app/shared/standard-menu-directives/checklist/checklist-modal/checklist-modal.css',
                    'app/shared/standard-menu-directives/checklist/checklist-modal/checklist-modal.directive.js',
                    'app/shared/standard-menu-directives/checklist/checklist-modal/checklist-modal.controller.js'
                ]
            },
            // endregion
            // region Standard Menu Min
            {
                name: 'UploadDocument',
                files: [
                    'app/shared/standard-menu-directives-min/upload-document/upload-document.css',
                    'app/shared/standard-menu-directives-min/upload-document/upload-document.directive.js',
                    'app/shared/standard-menu-directives-min/upload-document/upload-document.controller.js'
                ]
            }, {
                name: 'ViewDocument',
                files: [
                    'app/shared/standard-menu-directives-min/view-document/view-document.css',
                    'app/shared/standard-menu-directives-min/view-document/view-document.directive.js',
                    'app/shared/standard-menu-directives-min/view-document/view-document.controller.js'
                ]
            }, {
                name: 'AddComment',
                files: [
                    'app/shared/standard-menu-directives-min/add-comment/add-comment.css',
                    'app/shared/standard-menu-directives-min/add-comment/add-comment.directive.js',
                    'app/shared/standard-menu-directives-min/add-comment/add-comment.controller.js'
                ]
            }, {
                name: 'ViewComment',
                files: [
                    'app/shared/standard-menu-directives-min/view-comment/view-comment.css',
                    'app/shared/standard-menu-directives-min/view-comment/view-comment.directive.js',
                    'app/shared/standard-menu-directives-min/view-comment/view-comment.controller.js'
                ]
            }, {
                name: 'ActivityTemplate1',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template1/activity-template1.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template1/activity-template1.controller.js'
                ]
            }, {
                name: 'ActivityFormTemplate1',
                files: [
                    'app/shared/standard-menu-directives-min/activity-form-template1/activity-form-template1.css',
                    'app/shared/standard-menu-directives-min/activity-form-template1/activity-form-template1.directive.js',
                    'app/shared/standard-menu-directives-min/activity-form-template1/activity-form-template1.controller.js'
                ]
            }, {
                name: 'ActivityTemplateConsol1',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-consol1/activity-template-consol1.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-consol1/activity-template-consol1.controller.js'
                ]
            }, {
                name: 'ActivityTemplateContainer1',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-container1/activity-template-container1.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-container1/activity-template-container1.controller.js'
                ]
            }, {
                name: 'ActivityTemplateOrder',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-order/activity-template-order.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-order/activity-template-order.controller.js'
                ]
            }, {
                name: 'ActivityTemplateInward',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-inward/activity-template-inward.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-inward/activity-template-inward.controller.js'
                ]
            }, {
                name: 'ActivityTemplatePick',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-pick/activity-template-pick.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-pick/activity-template-pick.controller.js'
                ]
            }, {
                name: 'ActivityTemplateDelivery2',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-delivery2/activity-template-delivery2.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-delivery2/activity-template-delivery2.controller.js'
                ]
            }, {
                name: 'ActivityTemplateOutward2',
                files: [
                    'app/shared/standard-menu-directives-min/activity-template-outward2/activity-template-outward2.directive.js',
                    'app/shared/standard-menu-directives-min/activity-template-outward2/activity-template-outward2.controller.js'
                ]
            },
            // endregion
            // region Standard Menu Min
            {
                name: 'UploadDocumentOrd',
                files: [
                    'app/shared/standard-menu-directives-min/upload-document-ord/upload-document-ord.css',
                    'app/shared/standard-menu-directives-min/upload-document-ord/upload-document-ord.directive.js',
                    'app/shared/standard-menu-directives-min/upload-document-ord/upload-document-ord.controller.js'
                ]
            }, {
                name: 'ViewDocumentOrd',
                files: [
                    'app/shared/standard-menu-directives-min/view-document-ord/view-document-ord.css',
                    'app/shared/standard-menu-directives-min/view-document-ord/view-document-ord.directive.js',
                    'app/shared/standard-menu-directives-min/view-document-ord/view-document-ord.controller.js'
                ]
            },
            // endregion
            // region Custom Toolbar
            {
                name: 'customToolbar',
                files: [
                    'app/shared/custom-toolbar/custom-toolbar.directive.js',
                ]
            },
            // endregion
            // region Dynamic List, Grid, Control, Table
            {
                name: 'dynamicControl',
                files: [
                    'app/shared/dynamic-control/dynamic-control.directive.js',
                    'app/shared/dynamic-control/dynamic-control.controller.js'
                ]
            }, {
                name: 'dynamicGrid',
                files: [
                    'lib/angular/angular-ui-grid/ui-grid.min.css',
                    'lib/angular/angular-ui-grid/ui-grid-custom.css',
                    'lib/angular/angular-ui-grid/ui-grid.min.js',

                    'app/shared/dynamic-grid/dynamic-grid.css',
                    'app/shared/dynamic-grid/dynamic-grid.directive.js',
                    'app/shared/dynamic-grid/dynamic-grid.controller.js'
                ]
            }, {
                name: 'dynamicList',
                files: [
                    'app/shared/dynamic-list/dynamic-list.css',
                    'app/shared/dynamic-list/dynamic-list.directive.js',
                    'app/shared/dynamic-list/dynamic-list.controller.js'
                ]
            }, {
                name: 'dynamicListModal',
                files: [
                    'app/shared/dynamic-list-modal/dynamic-list-modal-config.factory.js',
                    'app/shared/dynamic-list-modal/dynamic-list-modal.directive.js',
                    'app/shared/dynamic-list-modal/dynamic-list-modal.controller.js'
                ]
            }, {
                name: 'dynamicLookup',
                files: [
                    'app/shared/dynamic-lookup/dynamic-lookup-config.factory.js',
                    'app/shared/dynamic-lookup/dynamic-lookup.directive.js',
                    'app/shared/dynamic-lookup/dynamic-lookup.controller.js'
                ]
            }, {
                name: 'dynamicTable',
                files: [
                    'app/shared/dynamic-table/dynamic-table.css',
                    'app/shared/dynamic-table/dynamic-table.directive.js',
                    'app/shared/dynamic-table/dynamic-table.controller.js'
                ]
            }, {
                name: 'tcGrid',
                files: [
                    'app/shared/tc-grid/tc-grid.css',
                    'app/shared/tc-grid/tc-grid.directive.js',
                    'app/shared/tc-grid/tc-grid.controller.js'
                ]
            },
            // --------------------- Dynamic Details view --------------------------
            // region
            {
                name: 'dynamicDetailsViewDirective',
                files: [
                    'app/shared/dynamic-details-view/dynamic-details-view-directive.directive.js',
                    'app/shared/dynamic-details-view/dynamic-details-view-directive.controller.js'
                ]
            },
            // endregion
            // endregion
            // region Task Assign, Start and Complete Directive
            {
                name: 'TaskAssignStartComplete',
                files: [
                    'app/shared/task-assign-start-complete/task-assign-start-complete.css',
                    'app/shared/task-assign-start-complete/task-assign-start-complete.directive.js',
                    'app/shared/task-assign-start-complete/task-assign-start-complete.controller.js',
                ]
            }, {
                name: 'OverrideKPI',
                files: [
                    'app/shared/override-kpi/override-kpi.css',
                    'app/shared/override-kpi/override-kpi.directive.js',
                    'app/shared/override-kpi/override-kpi.controller.js',
                ]
            },
            //endregion
            // region Process
            {
                name: 'ProcessInstanceWorkItemDetails',
                files: [
                    'app/shared/process-instance-work-item-details/process-instance-work-item-details.css',
                    'app/shared/process-instance-work-item-details/process-instance-work-item-details.directive.js',
                    'app/shared/process-instance-work-item-details/process-instance-work-item-details.controller.js'
                ]
            },
            // endregion
            // region Expression, Notification, Task Configuration
            {
                name: 'PartyMapping',
                files: [
                    'app/shared/party-mapping/party-mapping.css',
                    'app/shared/party-mapping/party-mapping.directive.js'
                ]
            }, {
                name: 'ExpressionFormatter',
                files: [
                    'app/shared/expression-builder/expression-formatter/expression-formatter.css',
                    'app/shared/expression-builder/expression-formatter/expression-formatter.directive.js'
                ]
            }, {
                name: 'ExpressionGroupFormatter',
                files: [
                    'app/shared/expression-builder/expression-group-formatter/expression-group-formatter.css',
                    'app/shared/expression-builder/expression-group-formatter/expression-group-formatter.directive.js'
                ]
            }, {
                name: 'NotificationFormatter',
                files: [
                    'app/shared/expression-builder/notification-formatter/notification-formatter.css',
                    'app/shared/expression-builder/notification-formatter/notification-formatter.directive.js'
                ]
            }, {
                name: 'TaskConfigFormatter',
                files: [
                    'app/shared/expression-builder/task-config-formatter/task-config-formatter.css',
                    'app/shared/expression-builder/task-config-formatter/task-config-formatter.directive.js'
                ]
            }, {
                name: 'NotificationTemplateFormatter',
                files: [
                    'app/shared/expression-builder/notification-template-formatter/notification-template-formatter.css',
                    'app/shared/expression-builder/notification-template-formatter/notification-template-formatter.directive.js'
                ]
            },
            // endregion
            // region Editable Table
            {
                name: 'EditableTableDirective',
                files: [
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js'
                ]
            },
            // endregion
            // region Dynamic Tab Left
            {
                name: 'DynamicTabLeft',
                files: [
                    'app/shared/dynamic-tab-left/dynamic-tab-left.directive.js',
                ]
            },
            // endregion
            // region ======= Library Files =======
            , {
                name: 'UIGrid',
                files: [
                    'lib/angular/angular-ui-grid/ui-grid.min.css',
                    'lib/angular/angular-ui-grid/ui-grid-custom.css',
                    'lib/angular/angular-ui-grid/csv.js',
                    'lib/angular/angular-ui-grid/pdfmake.js',
                    'lib/angular/angular-ui-grid/vfs_fonts.js',
                    'lib/angular/angular-ui-grid/ui-grid.js'
                ]
            }, {
                name: 'chart',
                files: [
                    'lib/chart/chart.min.js'
                ]
            }, {
                name: 'D3Js',
                files: [
                    'lib/d3/d3.v4.min.js'
                ]
            }, {
                name: 'Summernote',
                files: [
                    'lib/angular-summernote/dist/summernote.css',
                    'lib/angular-summernote/dist/summernote.min.js',
                    'lib/angular-summernote/angular-summernote.min.js'
                ]
            }, {
                name: 'AngularPrint',
                files: [
                    'lib/angular-print/angular-print.js'
                ]
            }, {
                name: 'NgTruncate',
                files: [
                    'lib/ng-text-truncate/ng-text-truncate.js'
                ]
            }, {
                name: 'QRCode',
                files: [
                    'lib/angular-barcode/angular-qrbarcode.js',
                    'lib/angular-barcode/qrcode.js'
                ]
            }, {
                name: 'drogAndDrop',
                files: [
                    'lib/angular/drog-drop/angular-drag-and-drop-lists.js'
                ]
            }, {
                name: 'DNDUITress',
                files: [
                    'lib/angular-ui-tree/angular-ui-tree.min.css',
                    'lib/angular-ui-tree/angular-ui-tree.min.js'
                ]
            }, {
                name: 'JsonModal',
                files: [
                    'lib/angular/json-edit/jsoneditor.css',
                    'lib/angular/json-edit/jsoneditor.min.js',
                    'lib/angular/json-edit/ng-jsoneditor.js',
                    'app/shared/json-edit-modal/json-edit-modal.factory.js'
                ]
            }, {
                name: 'CustomFileUpload',
                files: [
                    'lib/angular/ng-custom-file-upload/ng-custom-file-upload.js'
                ]
            }
            //endregion
        ],
        URL: {
            eAxisAPI: "http://dev.myhubplusapi.20cube.com/eaxis/",
            authAPI: "http://dev.myhubplusapi.20cube.com/auth/",
            alertAPI: "http://uat.api.20cube.com/alert/"
        },
        Crypto: {
            key: CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c"),
            iv: CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97")
        },
        DatePicker: {
            showWeeks: false,
            dateFormat: "dd-MMM-yyyy",
            timeFormat: "h:mm a",
            dateTimeFormat: "dd-MMM-yyyy hh:mm a",
            dateTimeFullFormat: "dd-MMM-yyyy hh:mm:ss a",
            dateFormatDB: "MM-dd-yyyy",
            saveFormat: "ISO",
            startingDay: 0,
            TimeOptions: {
                "readonlyInput": false,
                "showMeridian": true
            },
            defaultTime: '00:00:00',
            // maxDate: new Date(),
            // minDate: new Date(),
            html5Types: {
                "date": 'dd-MMM-yyyy',
                'datetime-local': 'dd-MMM-yyyyTHH:mm:ss.sss',
                'month': 'MM-yyyy'
            },
            initialPicker: 'date',
            reOpenDefault: false,
            enableDate: true,
            enableTime: true,
            buttonBar: {
                show: true,
                now: {
                    show: true,
                    text: 'Now',
                    cls: 'btn-sm btn-primary'
                },
                today: {
                    show: true,
                    text: 'Today',
                    cls: 'btn-sm btn-default'
                },
                clear: {
                    show: true,
                    text: 'Clear',
                    cls: 'btn-sm btn-default'
                },
                date: {
                    show: true,
                    text: 'Date',
                    cls: 'btn-sm btn-default'
                },
                time: {
                    show: true,
                    text: 'Time',
                    cls: 'btn-sm btn-default'
                },
                close: {
                    show: true,
                    text: 'Close',
                    cls: 'btn-sm btn-default'
                },
                cancel: {
                    show: false,
                    text: 'Cancel',
                    cls: 'btn-sm btn-default'
                }
            },
            closeOnDateSelection: true,
            closeOnTimeNow: true,
            appendToBody: false,
            altInputFormats: [],
            ngModelOptions: {},
            saveAs: false,
            readAs: false
        },
        SummernoteOptions: {
            height: 300,
            focus: false,
            airMode: false,
            toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ]
        },
        Version: "1.0"
    };

    angular
        .module("Application")
        .constant("APP_CONSTANT", APP_CONSTANT);
})();
