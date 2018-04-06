(function () {
    'use strict';

    var APP_CONSTANT = {
        ocLazyLoadModules: [
            // --------------- Common ---------------
            // region
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
                    'app/shared/confirmation/confirmation.css',
                    'app/shared/confirmation/confirmation.factory.js'
                ]
            }, {
                name: 'errorWarning',
                files: [
                    'app/shared/error-warning/error-warning.css',
                    'app/shared/error-warning/error-warning.factory.js',
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
                name: 'drogAndDrop',
                files: [
                    'lib/angular/drog-drop/angular-drag-and-drop-lists.js'
                ]
            }, {
                name: 'JsonModal',
                files: [
                    'lib/angular/json-edit/jsoneditor.css',
                    'lib/angular/json-edit/jsoneditor.min.js',
                    'lib/angular/json-edit/ng-jsoneditor.js',
                    'app/shared/json-edit-modal/json-edit-modal.css',
                    'app/shared/json-edit-modal/json-edit-modal.factory.js'
                ]
            }, {
                name: 'IconColorList',
                files: [
                    'app/shared/icon-color-list/icon-color-list.css',
                    'app/shared/icon-color-list/icon-color-list.directive.js',
                    'app/shared/icon-color-list/icon-color-list-modal.controller.js'
                ]
            }, {
                name: 'OrderAction',
                files: [
                    'app/shared/standard-menu-directives/order-action/order-action.css',
                    'app/shared/standard-menu-directives/order-action/order-action.directive.js',
                    'app/shared/standard-menu-directives/order-action/order-action.controller.js'
                ]
            }, {
                name: 'ActivityTab',
                files: [
                    'app/shared/activity-tab/activity-tab.css',
                    'app/shared/activity-tab/activity-tab.controller.js',
                    'app/shared/activity-tab/activity-tab.directive.js'
                ]
            },
            // endregion
            // --------------- File Upload ---------------
            // region
            {
                name: 'fileUpload',
                files: [
                    'app/shared/file-upload/file-upload.css',
                    'app/shared/file-upload/file-upload.directive.js',
                    'app/shared/file-upload/file-upload.controller.js'
                ]
            }, {
                name: 'fileUploadModal',
                files: [
                    'app/shared/file-upload-modal/file-upload-modal.css',
                    'app/shared/file-upload-modal/file-upload-modal.directive.js',
                    'app/shared/file-upload-modal/file-upload-modal.controller.js'
                ]
            },
            // endregion
            // --------------- Navbar & SideBar ---------------
            // region
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
            },
            // endregion
            // --------------- Date ---------------
            // region
            {
                name: 'compareDate',
                files: [
                    'app/shared/compare-date/compare-date.css',
                    'app/shared/compare-date/compare-date.directive.js',
                    'app/shared/compare-date/compare-date.controller.js'
                ]
            }, {
                name: 'customDatepicker',
                files: [
                    'app/shared/custom-datepicker/custom-datepicker.directive.js'
                ]
            },
            // endregion
            // --------------- Standard Menu ---------------
            // region
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
                name: 'Event',
                files: [
                    'app/shared/standard-menu-directives/event/event/event.css',
                    'app/shared/standard-menu-directives/event/event/event.directive.js',
                    'app/shared/standard-menu-directives/event/event/event.controller.js'
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
                name: 'EmailTemplate',
                files: [
                    'app/shared/standard-menu-directives/email-template/email-template/email-template.css',
                    'app/shared/standard-menu-directives/email-template/email-template/email-template.directive.js',
                    'app/shared/standard-menu-directives/email-template/email-template/email-template.controller.js'
                ]
            }, {
                name: 'EmailTemplateModal',
                files: [
                    'app/shared/standard-menu-directives/email-template/email-template-modal/email-template-modal.css',
                    'app/shared/standard-menu-directives/email-template/email-template-modal/email-template-modal.directive.js',
                    'app/shared/standard-menu-directives/email-template/email-template-modal/email-template-modal.controller.js'
                ]
            }, {
                name: 'EmailTemplateDirective',
                files: [
                    'app/shared/standard-menu-directives/email-template/email-template/email-directive/email-directive.js'
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
            },
            // endregion
            // --------------- Pages ---------------
            // region
            {
                name: 'login',
                files: [
                    'app/login/login.css',
                    'app/login/login.controller.js'
                ]
            }, {
                name: 'home',
                files: [
                    'app/home/home.css',
                    'app/home/home.controller.js'
                ]
            }, {
                name: 'userSetting',
                files: [
                    'app/user-setting/user-setting.css',
                    'app/user-setting/user-setting.controller.js'
                ]
            }, {
                name: 'ExternalUrlRedirect',
                files: [
                    'app/shared/external-url-redirect/external-url-redirect.css',
                    'app/shared/external-url-redirect/external-url-redirect.controller.js'
                ]
            },
            // endregion
            // ------------- Dynamic List, Grid, Control, Table
            // region
            {
                name: 'dynamicControl',
                files: [
                    'app/shared/dynamic-control/dynamic-control.css',
                    'app/shared/dynamic-control/dynamic-control.directive.js',
                    'app/shared/dynamic-control/dynamic-control.controller.js'
                ]
            }, {
                name: 'dynamicGrid',
                files: [
                    'lib/angular/angular-ui-grid/ui-grid.min.css',
                    'lib/angular/angular-ui-grid/ui-grid-custom.css',
                    'lib/angular/angular-ui-grid/csv.js',
                    'lib/angular/angular-ui-grid/pdfmake.js',
                    'lib/angular/angular-ui-grid/vfs_fonts.js',
                    'lib/angular/angular-ui-grid/ui-grid.js',

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
                    'app/shared/dynamic-list-modal/dynamic-list-modal.css',
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
            // ------------- UI Grid
            // region
            {
                name: 'UIGrid',
                files: [
                    'lib/angular/angular-ui-grid/ui-grid.min.css',
                    'lib/angular/angular-ui-grid/ui-grid-custom.css',
                    'lib/angular/angular-ui-grid/csv.js',
                    'lib/angular/angular-ui-grid/pdfmake.js',
                    'lib/angular/angular-ui-grid/vfs_fonts.js',
                    'lib/angular/angular-ui-grid/ui-grid.js'
                ]
            },
            // endregion
            // ------------- QR Code
            // region
            {
                name: 'QRCode',
                files: [
                    'lib/angular-barcode/angular-qrbarcode.js',
                    'lib/angular-barcode/qrcode.js'
                ]
            },
            //endregion
            // ------------- Print
            // region
            {
                name: 'AngularPrint',
                files: [
                    'lib/angular-print/angular-print.js'
                ]
            },
            //endregion
            // ------------- Text Angular
            // region
            {
                name: 'TextAngular',
                files: [
                    'lib/angular/text-angular/textAngular-sanitize.min.js',
                    'lib/angular/text-angular/textAngular-rangy.min.js',
                    'lib/angular/text-angular/textAngular.min.js',
                ]
            }
            //endregion
        ],
        URL: {
            // Uat
            // eAxisAPI: "http://uat.myhubplusapi.20cube.com/eaxis/",
            // authAPI: "http://uat.myhubplusapi.20cube.com/auth/",
            // Sit
            // eAxisAPI: "http://sit.myhubplusapi.20cube.com/eaxis/",
            // authAPI: "http://sit.myhubplusapi.20cube.com/auth/",
            // Dev
            //eAxisAPI: "http://localhost:4396/",
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
            format: "dd-MMM-yyyy",
            dateFormat: "dd-MMM-yyyy",
            timeFormat: "h:mm a",
            dateTimeFormat: "dd-MMM-yyyy h:mm a",
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
        DynamicGridConfig: [{
            "GridConfig": {
                "_enableColumnResizing": true,
                "_enableRowSelection": true,
                "_enableRowHeaderSelection": true,
                "_multiSelect": false,
                "_exporterMenuCsv": false,
                "_exporterCsvFilename": "data",
                "_exporterMenuPdf": false,
                "_exporterPdfFilename": "data",
                "_cellTooltip": true,
                "_enablePaginationControls": true,
                "_gridMenuShowHideColumns": false,
                "_enableGridMenu": true,
                "_enableColumnMenus": true,
                "_enableCellSelection": false,
                "_enableCellEdit": false,
                "_enableCellEditOnFocus": false,
                "_enableSorting": true,
                "_useExternalSorting": true,
                "_useExternalPagination": true,
                "_enablePinning": false,
                "_enableFiltering": false,
                "_headerRowHeight": 30,
                "_rowHeight": 30,
                "_isAPI": true,
                "_rowTemplate": "<div ng-dblclick='grid.appScope.GridCtrl.ePage.Masters.SelectedGridRow(row,  \"dblClick\")' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                "_sortColumn": "PK",
                "_sortType": "ASC",
                "_pageNumber": 1,
                "_paginationPageSize": 25,
                "_paginationPageSizes": [25, 50, 100]
            }
        }]
    };

    angular
        .module("Application")
        .constant("APP_CONSTANT", APP_CONSTANT);
})();
