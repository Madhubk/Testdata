(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "TRUST_CENTER_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, TRUST_CENTER_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: TRUST_CENTER_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('TC', {
                abstract: true,
                url: '/TC',
                templateUrl: 'app/trust-center/shared/trust-center.html',
                controller: "TrustCenterController as TrustCenterCtrl",
                ncyBreadcrumb: {
                    label: 'Trust Center'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['navBar', 'navbarDropdownMenu', 'footerBar', 'confirmation', 'changePassword', 'TCApplicationDropdown', 'trustCenter', "GenerateDBScript"]);
                    }]
                }
            })
            .state('TC.home', {
                url: '/home',
                templateUrl: 'app/trust-center/home/home.html',
                controller: "TCHomeController as TCHomeCtrl",
                ncyBreadcrumb: {
                    label: 'Home'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/home").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCHome"]);
                    }]
                }
            })
            .state('TC.dashboard', {
                url: '/dashboard/:id',
                templateUrl: 'app/trust-center/dashboard/dashboard.html',
                controller: "TCDashboardController as TCDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Dashboard'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/dashboard").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCDashboard"]);
                    }]
                }
            })
            .state('TC.tenant', {
                url: '/tenant',
                templateUrl: 'app/trust-center/tenant/tenant.html',
                controller: "TCTenantController as TCTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Tenant'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["CustomFileUpload", "TCTenant"]);
                    }]
                }
            })
            .state('TC.application', {
                url: '/application',
                templateUrl: 'app/trust-center/application/application.html',
                controller: "TCApplicationController as TCApplicationCtrl",
                ncyBreadcrumb: {
                    label: 'Application'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/application").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["CustomFileUpload", "JsonModal", "TCApplication"]);
                    }]
                }
            })
            .state('TC.user', {
                url: '/user',
                templateUrl: 'app/trust-center/user/user.html',
                controller: "TCUserController as TCUserCtrl",
                ncyBreadcrumb: {
                    label: 'User'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["CustomFileUpload", "TCUser"]);
                    }]
                }
            })
            .state('TC.maintenance', {
                url: '/maintenance',
                templateUrl: 'app/trust-center/maintenance/maintenance.html',
                controller: "TCMaintenanceController as TCMaintenanceCtrl",
                ncyBreadcrumb: {
                    label: 'Maintenance'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/maintenance").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMaintenance"]);
                    }]
                }
            })
            .state('TC.manageStaticListing', {
                url: '/manage-static-listing/:id',
                templateUrl: 'app/trust-center/manage-static-listing/manage-static-listing.html',
                controller: "TCManageStaticListingController as TCManageStaticListingCtrl",
                ncyBreadcrumb: {
                    label: 'Manage Static Listing'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/manage-static-listing").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCManageStaticListing"]);
                    }]
                }
            })
            .state('TC.filterGroup', {
                url: '/filter-group/:id',
                templateUrl: 'app/trust-center/filter/filter-group/filter-group.html',
                controller: "TCFilterGroupController as TCFilterGroupCtrl",
                ncyBreadcrumb: {
                    label: 'Filter Group'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/filter-group").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCFilterGroup"]);
                    }]
                }
            })
            .state('TC.filterList', {
                url: '/filter-list/:id',
                templateUrl: 'app/trust-center/filter/filter-list/filter-list.html',
                controller: "TCFilterListController as TCFilterListCtrl",
                ncyBreadcrumb: {
                    label: 'Filter List'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/filter-list").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCFilterList"]);
                    }]
                }
            })
            .state('TC.dataExtraction', {
                url: '/data-extraction',
                abstract: true,
                templateUrl: 'app/trust-center/data-extraction/data-extraction.html',
                controller: "DataExtractionController as DataExtractionCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCDataExtraction"]);
                    }]
                }
            })
            .state('TC.dataExtraction.audit', {
                url: '/audit/:id',
                templateUrl: 'app/trust-center/data-extraction/audit/audit.html',
                controller: "DataExtAuditController as DataExtAuditCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction - Audit'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction/audit").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCDataExtAudit"]);
                    }]
                }
            })
            .state('TC.dataExtraction.event', {
                url: '/event/:id',
                templateUrl: 'app/trust-center/data-extraction/event/event.html',
                controller: "DataExtEventController as DataExtEventCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction - Event'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction/event").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["ExpressionFormatter", "ExpressionGroupFormatter", "TCDataExtEvent"]);
                    }]
                }
            })
            .state('TC.dataExtraction.integration', {
                url: '/integration/:id',
                templateUrl: 'app/trust-center/data-extraction/integration/integration.html',
                controller: "DataExtIntegrationController as DataExtIntegrationCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction - Integration'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction/integration").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "ExpressionFormatter", "ExpressionGroupFormatter", "TCDataExtIntegration"]);
                    }]
                }
            })
            .state('TC.dataExtraction.fullTextSearch', {
                url: '/full-text-search/:id',
                templateUrl: 'app/trust-center/data-extraction/full-text-search/full-text-search.html',
                controller: "DataExtFullTextSearchController as DataExtFullTextSearchCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction - Full Text Search'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction/full-text-search").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCDataExtFullTextSearch"]);
                    }]
                }
            })
            .state('TC.dataExtraction.reportFields', {
                url: '/report-fields/:id',
                templateUrl: 'app/trust-center/data-extraction/report-fields/report-fields.html',
                controller: "DataExtReportFieldsController as DataExtReportFieldsCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction - Report Fields'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction/report-fields").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "ExpressionFormatter", "ExpressionGroupFormatter", "TCDataExtReportFields"]);
                    }]
                }
            })
            .state('TC.dataExtraction.entityScore', {
                url: '/entity-score/:id',
                templateUrl: 'app/trust-center/data-extraction/entity-score/entity-score.html',
                controller: "DataExtEntityScoreController as DataExtEntityScoreCtrl",
                ncyBreadcrumb: {
                    label: 'Data Extraction - Entity Score'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/data-extraction/entity-score").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "ExpressionFormatter", "ExpressionGroupFormatter", "TCDataExtEntityScore"]);
                    }]
                }
            })
            .state('TC.language', {
                url: '/language/:id',
                templateUrl: 'app/trust-center/language/language.html',
                controller: "LanguageController as LanguageCtrl",
                ncyBreadcrumb: {
                    label: 'Language'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/language").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCLanguage"]);
                    }]
                }
            })
            .state('TC.validation', {
                url: '/validation/:id',
                templateUrl: 'app/trust-center/validation/validation.html',
                controller: "ValidationController as ValidationCtrl",
                ncyBreadcrumb: {
                    label: 'Validation'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/validation").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCValidation", "TCValidationGroup", "TCValidationGroupMapping"]);
                    }]
                }
            })
            .state('TC.process', {
                url: '/process/:id',
                templateUrl: 'app/trust-center/process/process/process.html',
                controller: "ProcessController as ProcessCtrl",
                ncyBreadcrumb: {
                    label: 'Process'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/process").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCProcess"]);
                    }]
                }
            })
            .state('TC.processInstance', {
                url: '/process-instance/:id',
                templateUrl: 'app/trust-center/process/process-instance/process-instance.html',
                controller: "ProcessInstanceController as ProcessInstanceCtrl",
                ncyBreadcrumb: {
                    label: 'Process Instance'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/process-instance").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "dynamicControl", "dynamicGrid", "dynamicList", "dynamicLookup", "dynamicTable", "TaskAssignStartComplete", "TCProcessInstanceModal", "ProcessInstanceWorkItemDetails", "TCProcessInstance"]);
                    }]
                }
            })
            .state('TC.processScenarios', {
                url: '/process-scenarios/:id',
                templateUrl: 'app/trust-center/process/process-scenarios/process-scenarios.html',
                controller: "ProcessScenariosController as ProcessScenariosCtrl",
                ncyBreadcrumb: {
                    label: 'Process Scenarios'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/process-scenarios").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicTable", "TCProcessScenarios"]);
                    }]
                }
            })
            .state('TC.processWorkStep', {
                url: '/process-work-step/:id',
                templateUrl: 'app/trust-center/process/process-work-step/process-work-step.html',
                controller: "ProcessWorkStepController as ProcessWorkStepCtrl",
                ncyBreadcrumb: {
                    label: 'Process Work Step'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/process-work-step").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "IconColorList", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "TCProcessWorkStepAccessModal", "TCProcessWorkStepRules", "TCProcessWorkStepDirective", "PartyMapping", "TCProcessWorkStep", "ExpressionFormatter", "ExpressionGroupFormatter", "NotificationFormatter", "NotificationTemplateFormatter", "TaskConfigFormatter", "TCActivityFormConfiguration"]);
                    }]
                }
            })
            .state('TC.manageParameters', {
                url: '/manage-parameters/:id',
                templateUrl: 'app/trust-center/manage-parameters/manage-parameters.html',
                controller: "ManageParameterController as ManageParameterCtrl",
                ncyBreadcrumb: {
                    label: 'Manage Parameters'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/manage-parameters").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCManageParameters"]);
                    }]
                }
            })
            .state('TC.page', {
                url: '/page/:id',
                templateUrl: 'app/trust-center/page/page/page.html',
                controller: "PageController as PageCtrl",
                ncyBreadcrumb: {
                    label: 'Page'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/page").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCPage"]);
                    }]
                }
            })
            .state('TC.editPage', {
                url: '/page/edit/:id',
                templateUrl: 'app/trust-center/page/edit/edit-page.html',
                controller: "EditPageController as EditPageCtrl",
                ncyBreadcrumb: {
                    label: 'Page'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/page/edit").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["drogAndDrop", "JsonModal", "TCEditPage"]);
                    }]
                }
            })
            .state('TC.relatedLookup', {
                url: '/related-lookup/:id',
                templateUrl: 'app/trust-center/page/related-lookup/related-lookup.html',
                controller: "TCRelatedLookupController as TCRelatedLookupCtrl",
                ncyBreadcrumb: {
                    label: 'Related Lookup'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/page/related-lookup").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCRelatedLookup"]);
                    }]
                }
            })
            .state('TC.shareTable', {
                url: '/share-table/:id',
                templateUrl: 'app/trust-center/share-tables-and-fields/share-table/share-table.html',
                controller: "ShareTableController as ShareTableCtrl",
                ncyBreadcrumb: {
                    label: 'Share Table'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/share-table").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCShareTable"]);
                    }]
                }
            })
            .state('TC.shareField', {
                url: '/share-field/:id',
                templateUrl: 'app/trust-center/share-tables-and-fields/share-field/share-field.html',
                controller: "ShareFieldController as ShareFieldCtrl",
                ncyBreadcrumb: {
                    label: 'Share Field'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/share-field").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCShareField"]);
                    }]
                }
            })
            .state('TC.component', {
                url: '/component/:id',
                templateUrl: 'app/trust-center/component/component.html',
                controller: "ComponentController as ComponentCtrl",
                ncyBreadcrumb: {
                    label: 'Component'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/component").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCComponent"]);
                    }]
                }
            })
            .state('TC.menuGroup', {
                url: '/menu-group/:id',
                templateUrl: 'app/trust-center/menu-group/menu-group.html',
                controller: "MenuGroupsController as MenuGroupsCtrl",
                ncyBreadcrumb: {
                    label: 'Menu Group'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/menu-group").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMenuGroups"]);
                    }]
                }
            })
            .state('TC.menu', {
                url: '/menu/:id',
                templateUrl: 'app/trust-center/menu/menu.html',
                controller: "MenuController as MenuCtrl",
                ncyBreadcrumb: {
                    label: 'Menu'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/menu").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "IconColorList", "TCMenu"]);
                    }]
                }
            })
            .state('TC.applicationSettings', {
                url: '/application-settings/:id',
                templateUrl: 'app/trust-center/settings/application-settings/application-settings.html',
                controller: "ApplicationSettingsController as AppSettingsCtrl",
                ncyBreadcrumb: {
                    label: 'Application Settings'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/application-settings").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "NotificationTemplateFormatter", "TCApplicationSettings"]);
                    }]
                }
            })
            .state('TC.session', {
                url: '/session/:id',
                templateUrl: 'app/trust-center/session/session.html',
                controller: "SessionController as SessionCtrl",
                ncyBreadcrumb: {
                    label: 'Session'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/session").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCSession"]);
                    }]
                }
            })
            .state('TC.userList', {
                url: '/user-list/:id',
                templateUrl: 'app/trust-center/user-list/user-list.html',
                controller: "TCUserListController as TCUserListCtrl",
                ncyBreadcrumb: {
                    label: 'User'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user-list").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserList"]);
                    }]
                }
            })
            .state('TC.userSettings', {
                url: '/user-settings/:id',
                templateUrl: 'app/trust-center/settings/user-settings/user-settings.html',
                controller: "UserSettingsController as UserSettingsCtrl",
                ncyBreadcrumb: {
                    label: 'User Settings'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user-settings").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCUserSettings"]);
                    }]
                }
            })
            .state('TC.tenantUserSettings', {
                url: '/tenant-user-settings/:id',
                templateUrl: 'app/trust-center/settings/tenant-user-settings/tenant-user-settings.html',
                controller: "TenantUserSettingController as TenantUserSettingCtrl",
                ncyBreadcrumb: {
                    label: 'Tenant User Settings'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/tenant-user-settings").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });

                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCTenantUserSettings"]);
                    }]
                }
            })
            .state('TC.loginHistory', {
                url: '/login-history/:id',
                templateUrl: 'app/trust-center/login-history/login-history.html',
                controller: "LoginHistoryController as LoginHistoryCtrl",
                ncyBreadcrumb: {
                    label: 'Login History'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/login-history").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicTable", "TCLoginHistory"]);
                    }]
                }
            })
            .state('TC.parties', {
                url: '/parties/:id',
                templateUrl: 'app/trust-center/parties/parties.html',
                controller: "PartiesController as PartiesCtrl",
                ncyBreadcrumb: {
                    label: 'Parties'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/parties").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCParties"]);
                    }]
                }
            })
            .state('TC.roles', {
                url: '/roles/:id',
                templateUrl: 'app/trust-center/roles/roles.html',
                controller: "RolesController as RolesCtrl",
                ncyBreadcrumb: {
                    label: 'Roles'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/roles").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCRoles"]);
                    }]
                }
            })
            .state('TC.companyList', {
                url: '/company-list/:id',
                templateUrl: 'app/trust-center/company-list/company-list.html',
                controller: "CompanyListController as CompanyListCtrl",
                ncyBreadcrumb: {
                    label: 'Company'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/company-list").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicTable", "TCCompanyList"]);
                    }]
                }
            })
            .state('TC.dynamicListView', {
                url: '/dynamic-list-view/:taskName/:id',
                templateUrl: 'app/trust-center/dynamic-list-view/dynamic-list-view.html',
                controller: "DynamicListViewController as DynamicListViewCtrl",
                ncyBreadcrumb: {
                    label: 'Dynamic List View'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/dynamic-list-view").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicControl", "dynamicLookup", "dynamicList", "dynamicGrid", "TCDynamicListView"]);
                    }]
                }
            })
            .state('TC.dynamicDetailsView', {
                url: '/dynamic-details-view/:taskName/:id',
                templateUrl: 'app/trust-center/dynamic-details-view/dynamic-details-view.html',
                controller: "DynamicDetailsViewController as DynamicDetailsViewCtrl",
                ncyBreadcrumb: {
                    label: 'Dynamic Details View'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/dynamic-details-view").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicControl", "dynamicLookup", "dynamicList", "dynamicGrid", "tcGrid", 'confirmation', 'dynamicDetailsViewDirective', "TCDynamicDetailsView"]);
                    }]
                }
            })
            .state('TC.event', {
                url: '/event/:id',
                templateUrl: 'app/trust-center/event/event.html',
                controller: "EventController as EventCtrl",
                ncyBreadcrumb: {
                    label: 'Event'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/event").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "JsonModal", "ExpressionFormatter", "ExpressionGroupFormatter", "NotificationFormatter", "NotificationTemplateFormatter", "TaskConfigFormatter", "PartyMapping", "TCEvent", "TCEventConfigure"]);
                    }]
                }
            })
            .state('TC.document', {
                url: '/document/:id',
                templateUrl: 'app/trust-center/document-type/document-type.html',
                controller: "TCDocumentTypeController as TCDocumentTypeCtrl",
                ncyBreadcrumb: {
                    label: 'Document'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/document").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "PartyMapping", "TCDocumentType", "TCDocumentTypeConfigure"]);
                    }]
                }
            })
            .state('TC.exception', {
                url: '/exception/:id',
                templateUrl: 'app/trust-center/exception-type/exception-type.html',
                controller: "TCExceptionTypeController as TCExceptionTypeCtrl",
                ncyBreadcrumb: {
                    label: 'Exception'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/exception").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "PartyMapping", "TCExceptionType", "TCExceptionTypeConfigure"]);
                    }]
                }
            })
            .state('TC.comments', {
                url: '/comments/:id',
                templateUrl: 'app/trust-center/comments/comments.html',
                controller: "TCCommentsController as TCCommentsCtrl",
                ncyBreadcrumb: {
                    label: 'Comments'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/comments").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "PartyMapping", "TCComments", "TCCommentsConfigure"]);
                    }]
                }
            })
            .state('TC.email', {
                url: '/email/:id',
                templateUrl: 'app/trust-center/email/email.html',
                controller: "TCEmailController as TCEmailCtrl",
                ncyBreadcrumb: {
                    label: 'Email'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/email").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "PartyMapping", "TCEmail", "TCEmailConfigure"]);
                    }]
                }
            })
            .state('TC.ebpmTypes', {
                url: '/ebpm-types/:id',
                templateUrl: 'app/trust-center/ebpm-types/ebpm-types.html',
                controller: "TCEBPMTypesController as TCEBPMTypesCtrl",
                ncyBreadcrumb: {
                    label: 'EBPM Types'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/ebpm-types").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "dynamicControl", "dynamicLookup", "dynamicList", "dynamicGrid", "TCEBPMTypesList", "EBPMTypesConfigure"]);
                    }]
                }
            })
            .state('TC.sopTypelist', {
                url: '/sop-typelist/:id',
                templateUrl: 'app/trust-center/sop-typelist/sop-typelist.html',
                controller: "TCSOPTypelistController as TCSOPTypelistCtrl",
                ncyBreadcrumb: {
                    label: 'SOP TypeList'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/sop-typelist").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "chromeTab", "dynamicControl", "dynamicLookup", "dynamicList", "dynamicGrid", "TCSOPTypelist", "SOPTypelistConfigure"]);
                    }]
                }
            })
            // Mapping pages
            .state('TC.mappingVertical', {
                url: '/mapping-vertical/:id',
                templateUrl: 'app/trust-center/mapping/mapping-vertical/mapping-vertical.html',
                controller: "MappingVerticalController as MappingVerticalCtrl",
                ncyBreadcrumb: {
                    label: 'Mapping'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/mapping-vertical").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMappingVertical"]);
                    }]
                }
            })
            .state('TC.mappingHorizontal', {
                url: '/mapping-horizontal/:id',
                templateUrl: 'app/trust-center/mapping/mapping-horizontal/mapping-horizontal.html',
                controller: "MappingHorizontalController as MappingHorizontalCtrl",
                ncyBreadcrumb: {
                    label: 'Mapping'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/mapping-horizontal").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMappingHorizontal"]);
                    }]
                }
            })
            .state('TC.appTrustAppTenant', {
                url: '/app-trust-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/app-trust-app-tenant/app-trust-app-tenant.html',
                controller: "TCAppTrustAppTenantController as TCAppTrustAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'App Trust App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/app-trust-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCAppTrustAppTenant"]);
                    }]
                }
            })
            .state('TC.secAppSecTenant', {
                url: '/sec-app-sec-tenant/:id',
                templateUrl: 'app/trust-center/mapping/sec-app-sec-tenant/sec-app-sec-tenant.html',
                controller: "TCSecAppSecTenantController as TCSecAppSecTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Sec App Sec Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/sec-app-sec-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCSecAppSecTenant"]);
                    }]
                }
            })
            .state('TC.userRoleAppTenant', {
                url: '/user-role-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/user-role-app-tenant/user-role-app-tenant.html',
                controller: "TCUserRoleAppTenantController as TCUserRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Role Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserRoleAppTenant"]);
                    }]
                }
            })
            .state('TC.userCmpAppTenant', {
                url: '/user-cmp-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/user-cmp-app-tenant/user-cmp-app-tenant.html',
                controller: "TCUserCmpAppTenantController as TCUserCmpAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Cmp App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user-cmp-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserCmpAppTenant"]);
                    }]
                }
            })
            .state('TC.userWarehouseAppTenant', {
                url: '/user-warehouse-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/user-warehouse-app-tenant/user-warehouse-app-tenant.html',
                controller: "TCUserWarehouseAppTenantController as TCUserWarehouseAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Warehouse App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user-warehouse-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserWarehouseAppTenant"]);
                    }]
                }
            })
            .state('TC.userOrganizationAppTenant', {
                url: '/user-organization-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/user-organization-app-tenant/user-organization-app-tenant.html',
                controller: "TCUserOrganizationAppTenantController as TCUserOrganizationAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Organization App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/user-organization-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserOrganizationAppTenant"]);
                    }]
                }
            })
            .state('TC.userOrganizationRoleAppTenant', {
                url: '/user-organization-role-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/user-organization-role-app-tenant/user-organization-role-app-tenant.html',
                controller: "TCUserOrganizationRoleAppTenantController as TCUserOrganizationRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Organization Role App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("TC/user-organization-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });

                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserOrganizationRoleAppTenant"]);
                    }]
                }
            })
            .state('TC.compRoleAppTenant', {
                url: '/comp-role-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/comp-role-app-tenant/comp-role-app-tenant.html',
                controller: "TCCompRoleAppTenantController as TCCompRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Component Role App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/comp-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCCompRoleAppTenant"]);
                    }]
                }
            })
            .state('TC.compOrgAppTenant', {
                url: '/comp-org-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/comp-org-app-tenant/comp-org-app-tenant.html',
                controller: "TCCompOrgAppTenantController as TCCompOrgAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Component Organization App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/comp-org-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCCompOrgAppTenant"]);
                    }]
                }
            })
            .state('TC.groupRoleAppTenant', {
                url: '/group-role-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/group-role-app-tenant/group-role-app-tenant.html',
                controller: "TCGroupRoleAppTenantController as TCGroupRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Group Role App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/group-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCGroupRoleAppTenant"]);
                    }]
                }
            })
            .state('TC.menuRoleAppTenant', {
                url: '/menu-role-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/menu-role-app-tenant/menu-role-app-tenant.html',
                controller: "TCMenuRoleAppTenantController as TCMenuRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Menu Role App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/menu-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMenuRoleAppTenant"]);
                    }]
                }
            })
            .state('TC.filterRoleAppTenant', {
                url: '/filter-role-app-tenant/:id',
                templateUrl: 'app/trust-center/mapping/filter-role-app-tenant/filter-role-app-tenant.html',
                controller: "TCFilterRoleAppTenantController as TCFilterRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'Filter Role App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/TC/filter-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCFilterRoleAppTenant"]);
                    }]
                }
            });
    }
})();
