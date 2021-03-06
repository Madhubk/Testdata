(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "EAXIS_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, EAXIS_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: EAXIS_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA', {
                abstract: true,
                url: '/EA',
                templateUrl: 'app/eaxis/shared/eaxis.html',
                controller: "EAxisController as EAxisCtrl",
                ncyBreadcrumb: {
                    label: 'Cargoora'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["navBar", "navbarDropdownMenu", "footerBar", "sideBar", "changePassword", "errorWarning", "eAxis"]);
                    }]
                }
            })
            .state('EA.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/dashboard/dashboard.html',
                controller: "EAxisDashboardController as EAxisDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Dashboard'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["eAxisDashboard"]);
                    }]
                }
            })
            // MyTasks
            .state('EA.myTask', {
                url: '/my-tasks',
                templateUrl: 'app/eaxis/my-task/my-task.html',
                controller: "MyTaskController as MyTaskCtrl",
                ncyBreadcrumb: {
                    label: 'My Tasks'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["confirmation", "dynamicLookup", "dynamicControl", "oneLevelMapping", "Summernote", "CustomFileUpload", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "DelayReason", "DelayReasonModal", "Checklist", "ChecklistModal", "Event", "EventModal", "UploadDocument", "AddComment", "ViewDocument", "ViewComment", "TaskAssignStartComplete", "OverrideKPI", "MyTaskSnooze", "MyTaskHold", "MyTaskDynamicDirective", "MyTaskDirective", "MyTask", "MyTaskConfig"]);
                    }]
                }
            })
            // Control Tower
            .state('EA.controlTower', {
                url: '/control-tower',
                templateUrl: 'app/eaxis/control-tower/control-tower.html',
                controller: "ControlTowerController as ControlTowerCtrl",
                ncyBreadcrumb: {
                    label: "Control Tower"
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "confirmation", "compareDate", "WorkItemStatusCount", "ControlTowerTaskList", "ControlTower"]);
                    }]
                }
            })
            // Dynamic View
            .state('EA.dynamicListView', {
                url: '/dynamic-list-view/:taskName',
                templateUrl: 'app/eaxis/shared/dynamic-list-view/dynamic-list-view.html',
                controller: "DynamicListViewController as DynamicListViewCtrl",
                ncyBreadcrumb: {
                    label: 'Dynamic List View'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicControl", "dynamicGrid", "dynamicListModal", "dynamicList", "dynamicLookup", "tcGrid", "drogAndDrop", "confirmation", "compareDate", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "DelayReasonModal", "DelayReason", "Checklist", "ChecklistModal", "TaskFlowGraph", "TaskFlowGraphModal", "dynamicDetailsViewDirective", "EADynamicListView"]);
                    }]
                }
            })
            .state('EA.dynamicDetailsView', {
                url: '/dynamic-details-view/:taskName',
                templateUrl: 'app/eaxis/shared/dynamic-details-view/dynamic-details-view.html',
                controller: "DynamicDetailsViewController as DynamicDetailsViewCtrl",
                ncyBreadcrumb: {
                    label: 'Dynamic Details View'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicControl", "dynamicGrid", "dynamicListModal", "dynamicList", "dynamicLookup", "tcGrid", "confirmation", "compareDate", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "DelayReasonModal", "DelayReason", "Checklist", "ChecklistModal", "TaskFlowGraph", "TaskFlowGraphModal", 'dynamicDetailsViewDirective', 'EADynamicDetailsView']);
                    }]
                }
            })
            // Customer Portal Document
            .state('EA.allDocuments', {
                url: '/all-documents',
                templateUrl: 'app/eaxis/all-documents/all-documents.html',
                controller: "AllDocumentsController as AllDocumentsCtrl",
                ncyBreadcrumb: {
                    label: 'My Documents'
                },
                resolve: {
                    CheckAccess: ["$rootScope", "$q", "$location", "$timeout", "$state", "authService", "helperService", function ($rootScope, $q, $location, $timeout, $state, authService, helperService) {
                        var deferred = $q.defer();
                        if (!authService.getUserInfo().AuthToken) {
                            $location.path("/login").search({
                                continue: $rootScope.EnteredUrl
                            });
                            // deferred.resolve();
                        } else {
                            deferred.resolve();
                        }

                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "shipment", "AllDocuments"]);
                    }]
                }
            })

            //region report
            .state('EA.DMS.TrasnportsReports', {
                url: '/transports-report',
                templateUrl: 'app/eaxis/general-reports/reports.html',
                controller: "ReportController as ReportCtrl",
                ncyBreadcrumb: {
                    label: 'Reports'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "GeneralReports", "ReportGridPage"]);
                    }]
                }
            })


            .state('EA.WMS.warehouseReport', {
                url: '/warehouse-report',
                templateUrl: 'app/eaxis/general-reports/reports.html',
                controller: "ReportController as ReportCtrl",
                ncyBreadcrumb: {
                    label: 'Report'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "GeneralReports", "ReportGridPage"]);
                    }]
                }
            })

            .state('EA.WMS.sparePartsReport', {
                url: '/spare-parts-report',
                templateUrl: 'app/eaxis/general-reports/reports.html',
                controller: "ReportController as ReportCtrl",
                ncyBreadcrumb: {
                    label: 'Report'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "GeneralReports", "ReportGridPage"]);
                    }]
                }
            });

        //end region
    }
})();
