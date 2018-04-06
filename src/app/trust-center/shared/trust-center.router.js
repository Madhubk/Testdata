(function () {
    'use strict';
    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', 'APP_CONSTANT', "TRUST_CENTER_CONSTANT"];

    function Config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, APP_CONSTANT, TRUST_CENTER_CONSTANT) {
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }

                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['navBar', 'navbarDropdownMenu', 'confirmation', 'trustCenter']);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCTenant"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCApplication"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUser"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCFilterList"]);
                    }]
                }
            })
            .state('TC.dataConfig', {
                url: '/data-config/:id',
                templateUrl: 'app/trust-center/data-config/data-config.html',
                controller: "DataConfigController as DataConfigCtrl",
                ncyBreadcrumb: {
                    label: 'Data Config'
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
                        return $ocLazyLoad.load(["JsonModal", "TCDataConfig"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCComponent"]);
                    }]
                }
            })
            .state('TC.processOld', {
                url: '/process-old/:id',
                templateUrl: 'app/trust-center/process-old/process/process.html',
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
                        return $ocLazyLoad.load(["TCProcessOld"]);
                    }]
                }
            })
            .state('TC.processTask', {
                url: '/proccess-task/:id',
                templateUrl: 'app/trust-center/process-old/process-task/process-task.html',
                controller: "ProcessTaskController as ProcessTaskCtrl",
                ncyBreadcrumb: {
                    label: 'Process Task'
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
                        return $ocLazyLoad.load(["TCProcessTask"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "dynamicControl", "dynamicGrid", "dynamicList", "dynamicLookup", "dynamicTable", "TCProcessInstanceModal", "TCProcessInstanceWorkItemDetails", "TCProcessInstance"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "IconColorList", "TCProcessWorkStepAccessModal", "TCProcessWorkStepRules", "TCProcessWorkStepDirective", "TCProcessWorkStep"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["drogAndDrop", "JsonModal", "TCEditPage"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCShareField"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "IconColorList", "TCMenu"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMenuGroups"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCRoles"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCApplicationSettings"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["JsonModal", "TCUserSettings"]);
                    }]
                }
            })
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCMappingHorizontal"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserList"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicTable", "TCLoginHistory"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCSession"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["dynamicTable", "TCCompanyList"]);
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
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
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCValidation"]);
                    }]
                }
            });
    }
})();
