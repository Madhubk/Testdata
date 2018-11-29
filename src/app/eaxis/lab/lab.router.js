(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "EA_LAB_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, EA_LAB_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: EA_LAB_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.lab', {
                abstract: true,
                url: '/lab',
                templateUrl: 'app/eaxis/lab/lab.html',
                controller: "EALabController as EALabCtrl",
                ncyBreadcrumb: {
                    label: 'Lab'
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
                        return $ocLazyLoad.load(['EALab']);
                    }]
                }
            })
            .state('EA.lab.dynamicPageList', {
                url: '/dynamic-page-list',
                templateUrl: 'app/eaxis/lab/dynamic-page-list/dynamic-page-list.html',
                controller: "EAxisDynamicPageListController as EAxisDynamicPageListCtrl",
                ncyBreadcrumb: {
                    label: 'DynamicPageList'
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
                        return $ocLazyLoad.load('eAxisDynamicPageList');
                    }]
                }
            })
            .state('EA.lab.htmlGeneration', {
                url: '/html-generation',
                templateUrl: 'app/eaxis/lab/html-generation/html-generation.html',
                controller: "EAxisHtmlGenerationCodeController as EAxisHtmlGenerationCtrl",
                ncyBreadcrumb: {
                    label: 'Html Generation'
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
                        return $ocLazyLoad.load('eAxisHtmlGeneration');
                    }]
                }
            })
            .state('EA.lab.graphicalInterface', {
                url: '/graphical-interface',
                templateUrl: 'app/eaxis/lab/graphical-interface/graphical-interface.html',
                controller: "EAxisGraphicalInterfaceController as EAxisGraphicalInterfaceCtrl",
                ncyBreadcrumb: {
                    label: 'Graphical Interface'
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
                        return $ocLazyLoad.load('eAxisGraphicalInterface');
                    }]
                }
            })
            .state('EA.lab.excelTemplate', {
                url: '/excel-template',
                templateUrl: 'app/eaxis/lab/excel-template/excel-template.html',
                controller: "EAxisExcelTemplateController as EAxisExcelTemplateCtrl",
                ncyBreadcrumb: {
                    label: 'ExcelTemplate'
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
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "eAxisExcelTemplate", "eAxisExcelTemplateMenu", "NotificationTemplateFormatter"]);
                    }]
                }
            })
            .state('EA.lab.queueLog', {
                url: '/queue-log',
                templateUrl: 'app/eaxis/lab/queue-log/queue-log.html',
                controller: "EAxisQueueLogController as EAxisQueueLogCtrl",
                ncyBreadcrumb: {
                    label: 'QueueLog'
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
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "eAxisQueueLog", "eAxisQueueLogMenu"]);
                    }]
                }
            })
            .state('EA.lab.queue-log-single-record-view', {
                url: '/queue-log-single-record-view/:taskName',
                templateUrl: 'app/eaxis/lab/queue-log/queue-log-menu/queue-log-single-record-view/queue-log-single-record-view.html',
                controller: "EAxisQueueLogSingleRecordViewController as EAxisQueueLogSingleRecordViewCtrl",
                ncyBreadcrumb: {
                    label: 'Queue Log Single Record View'
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
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "eAxisQueueLogSingleRecordView"]);
                    }]
                }
            });
    }
})();