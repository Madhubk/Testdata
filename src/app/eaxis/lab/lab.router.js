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
                    label: 'Dynamic Pages'
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
                    label: 'Excel Template'
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
                    label: 'Queue Log'
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
            })
            .state('EA.lab.process', {
                url: '/process',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/process/process/process.html'"></div></div>`,
                controller: "ProcessController as ProcessCtrl",
                ncyBreadcrumb: {
                    label: 'Process'
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
                        return $ocLazyLoad.load(["confirmation", "trustCenter", "TCProcess"]);
                    }]
                }
            })
            .state('EA.lab.processInstance', {
                url: '/process-instance/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/process/process-instance/process-instance.html'"></div></div>`,
                controller: "ProcessInstanceController as ProcessInstanceCtrl",
                ncyBreadcrumb: {
                    label: 'Process Instance'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicControl", "dynamicGrid", "dynamicList", "dynamicLookup", "confirmation", "dynamicTable", "TaskAssignStartComplete", "TCProcessInstanceModal", "trustCenter", "ProcessInstanceWorkItemDetails", "TCProcessInstance"]);
                    }]
                }
            })
            .state('EA.lab.processScenarios', {
                url: '/process-scenarios/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/process/process-scenarios/process-scenarios.html'"></div></div>`,
                controller: "ProcessScenariosController as ProcessScenariosCtrl",
                ncyBreadcrumb: {
                    label: 'Process Scenarios'
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
                        return $ocLazyLoad.load(["dynamicTable", "confirmation", "trustCenter", "TCProcessScenarios"]);
                    }]
                }
            })
            .state('EA.lab.processWorkStep', {
                url: '/process-work-step/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/process/process-work-step/process-work-step.html'"></div></div>`,
                controller: "ProcessWorkStepController as ProcessWorkStepCtrl",
                ncyBreadcrumb: {
                    label: 'Process Work Step'
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
                        return $ocLazyLoad.load(["JsonModal", "IconColorList", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "confirmation", "TCProcessWorkStepAccessModal", "TCProcessWorkStepRules", "TCProcessWorkStepDirective", "PartyMapping", "trustCenter", "TCProcessWorkStep", "ExpressionFormatter", "ExpressionGroupFormatter", "NotificationFormatter", "NotificationTemplateFormatter", "TaskConfigFormatter", "TCActivityFormConfiguration"]);
                    }]
                }
            });
    }
})();
