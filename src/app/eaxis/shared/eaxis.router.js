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
                        return $ocLazyLoad.load(['eAxis', 'navBar', 'navbarDropdownMenu', 'confirmation', 'errorWarning', 'sideBar', 'changePassword', 'oneLevelMapping', 'customDatepicker', 'compareDate', 'dynamicListModal', "chromeTab", "dynamicControl", "dynamicGrid", "dynamicList", "dynamicLookup", "dynamicTable", "tcGrid", "standardMenu", "QuickView", "JsonModal", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Event", "EventModal", "Exception", "ExceptionModal", "DataEvent", "DataEventModal", "AuditLog", "AuditLogModal", "EmailTemplate", "EmailTemplateModal", "EmailTemplateDirective", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "OrderAction", "ActivityTab", "MyTaskDynamicDirective", "MyTaskDefaultDirective", "MyTaskDefaultEditDirective", "TaskEffortDirective", "TaskEffortEditDirective", "TaskCreateDirective", "TaskCreateEditDirective", "AsnirUpdateLineDirective", "AsnirUpdateLineEditDirective", "SupplementaryTaxInvDirective", "SupplementaryTaxInvEditDirective", "TaxInvoiceDirective", "TaxInvoiceEditDirective", "GSTInvoiceDirective", "GSTInvoiceEditDirective", "DispatchManifestDirective", "DispatchManifestEditDirective", "ArrivalAtPortDirective", "ArrivalAtPortEditDirective", "ReceiveItemDirective", "ReceiveItemEditDirective", "ArrivalAtDepotDirective", "ArrivalAtDepotEditDirective", "DispatchPortDirective", "DispatchPortEditDirective", "POBatchUploadedDirective", "POBatchUploadedEditDirective", "SfuMailDirective", "SfuMailEditDirective", "SfuCRDUpdateDirective", "SfuCRDUpdateEditDirective", "SpaMailDirective", "SpaMailEditDirective"]);
                    }]
                }
            })
            // Home
            .state('EA.home', {
                abstract: true,
                url: '/home',
                templateUrl: 'app/eaxis/home/home.html',
                controller: "EAxisHomeController as EAxisHomeCtrl",
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
                        return $ocLazyLoad.load(['eAxisHome', 'dynamicDirective', "dynamicMultiDashboard"]);
                    }]
                }
            })
            .state('EA.home.dashboard', {
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
                        return $ocLazyLoad.load('eAxisDashboard');
                    }]
                }
            })
            // External Dashboard
            .state('EA.externaldashboard', {
                url: '/externaldashboard',
                templateUrl: 'app/eaxis/externaldashboard/external-dashboard.html',
                controller: "externalDashboardController as ExternalDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'External Dashboard'
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
                        return $ocLazyLoad.load('externalDashboard');
                    }]
                }
            })
            // Warehouse Dashboard
            .state('EA.home.warehousedashboard', {
                url: '/warehouse-dashboard',
                templateUrl: 'app/eaxis/dashboard/warehouse/warehouse-dashboard.html',
                controller: "WarehouseDashboardController as WarehouseDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Warehouse Dashboard'
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
                        return $ocLazyLoad.load(['warehouseDashboard', "chart", 'inwardDashboard', 'outwardDashboard', 'locationDashboard']);
                    }]
                }
            })
            .state('EA.home.todo', {
                url: '/to-do',
                templateUrl: 'app/eaxis/to-do/to-do.html',
                controller: "ToDoController as ToDoCtrl",
                ncyBreadcrumb: {
                    label: 'To Do'
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
                        return $ocLazyLoad.load(["toDo"]);
                    }]
                }
            })
            .state('EA.home.myTask', {
                url: '/my-task',
                templateUrl: 'app/eaxis/my-task/my-task.html',
                controller: "MyTaskController as MyTaskCtrl",
                ncyBreadcrumb: {
                    label: 'My Task'
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
                        return $ocLazyLoad.load(["MyTask", "OrderTaskDirectives", "OrderTaskEditDirective", "inwardAsnLines", "inward", "EAwarehouse", "manifest", "manifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems", "adminManifest", "createManifest", "SfuReadOnlyGridDirective", "SfuMailModal", "SfuUpdateGridDirective", "SpaReadOnlyGridDirective", "SpaMailModal", "SpaVesselModal"]);
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
                        return $ocLazyLoad.load('EADynamicListView');
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
                        return $ocLazyLoad.load(['dynamicDetailsViewDirective', 'EADynamicDetailsView']);
                    }]
                }
            })
            // Lab
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
            .state('EA.lab.dynamicDetails', {
                url: '/dynamic-details',
                templateUrl: 'app/eaxis/shared/dynamic-details/dynamic-details.html',
                controller: "DynamicDetailsController as DynamicDetailsCtrl",
                ncyBreadcrumb: {
                    label: 'Dynamic Details'
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
                        return $ocLazyLoad.load('dynamicDetails');
                    }]
                }
            })
            // Admin
            .state('EA.admin', {
                abstract: true,
                url: '/admin',
                templateUrl: 'app/eaxis/admin/admin.html',
                controller: "EAxisAdminController as EAxisAdminCtrl",
                ncyBreadcrumb: {
                    label: 'Admin'
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
                        return $ocLazyLoad.load(['eAxisAdmin']);
                    }]
                }
            })
            .state('EA.admin.home', {
                url: '/home',
                templateUrl: 'app/eaxis/admin/home/home.html',
                controller: "EAAdminHomeController as EAAdminHomeCtrl",
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
                        return $ocLazyLoad.load(["EAAdminHome"]);
                    }]
                }
            })
            .state('EA.admin.user', {
                url: '/user',
                templateUrl: 'app/eaxis/admin/user/user.html',
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
                        return $ocLazyLoad.load(["EAUser"]);
                    }]
                }
            })
            .state('EA.admin.security', {
                url: '/security',
                templateUrl: 'app/eaxis/admin/security/security.html',
                controller: "TCSecurityController as TCSecurityCtrl",
                ncyBreadcrumb: {
                    label: 'Security'
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
                        return $ocLazyLoad.load(["EASecurity"]);
                    }]
                }
            })
            .state('EA.admin.configuration', {
                url: '/configuration',
                templateUrl: 'app/eaxis/admin/configuration/configuration.html',
                controller: "TCConfigurationController as TCConfigurationCtrl",
                ncyBreadcrumb: {
                    label: 'Configuration'
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
                        return $ocLazyLoad.load(["EAConfiguration"]);
                    }]
                }
            })
            .state('EA.admin.mapping', {
                url: '/mapping/:id',
                templateUrl: 'app/eaxis/admin/mapping/mapping.html',
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
                        return $ocLazyLoad.load(["EAMapping"]);
                    }]
                }
            })
            .state('EA.admin.session', {
                url: '/session/:id',
                templateUrl: 'app/eaxis/admin/session/session.html',
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
                        return $ocLazyLoad.load(["EASession"]);
                    }]
                }
            })
            .state('EA.admin.emailsettings', {
                url: '/application-settings/:id',
                templateUrl: 'app/eaxis/admin/application-settings/application-settings.html',
                controller: "ApplicationSettingsController as AppSettingsCtrl",
                ncyBreadcrumb: {
                    label: 'Email'
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
                        return $ocLazyLoad.load(["EAEmailSettings"]);
                    }]
                }
            })
            .state('EA.admin.validation', {
                url: '/validation/:id',
                templateUrl: 'app/eaxis/admin/validation/validation.html',
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
                        return $ocLazyLoad.load(["EAValidation"]);
                    }]
                }
            })
            .state('EA.admin.language', {
                url: '/language/:id',
                templateUrl: 'app/eaxis/admin/language/language.html',
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
                        return $ocLazyLoad.load(["EALanguage"]);
                    }]
                }
            })
            .state('EA.admin.page', {
                url: '/page/:id',
                templateUrl: 'app/eaxis/admin/page/page.html',
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
                        return $ocLazyLoad.load(["EAPage"]);
                    }]
                }
            })
            .state('EA.admin.editPage', {
                url: '/page/edit/:id',
                templateUrl: 'app/eaxis/admin/page/edit/edit-page.html',
                controller: "EditPageController as EditPageCtrl",
                ncyBreadcrumb: {
                    label: 'Edit Page'
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
                        return $ocLazyLoad.load(["EAEditPage"]);
                    }]
                }
            })
            .state('EA.admin.userSettings', {
                url: '/user-settings/:id',
                templateUrl: 'app/eaxis/admin/user-settings/user-settings.html',
                controller: "UserSettingsController as UserSettingsCtrl",
                ncyBreadcrumb: {
                    label: 'Starred'
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
                        return $ocLazyLoad.load(["EAUserSettings"]);
                    }]
                }
            })
            .state('EA.admin.manageStaticListing', {
                url: '/manage-static-listing/:id',
                templateUrl: 'app/eaxis/admin/manage-static-listing/manage-static-listing.html',
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
                        return $ocLazyLoad.load(["EAManageStaticListing"]);
                    }]
                }
            })
            // SingleRecordView
            .state('EA.singleRecordView', {
                abstract: true,
                url: '/single-record-view',
                templateUrl: 'app/shared/single-record-view/single-record-view.html',
                controller: "SingleRecordViewController as SingleRecordViewCtrl",
                ncyBreadcrumb: {
                    label: 'Single Record View'
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
                        return $ocLazyLoad.load(["singleRecordView"]);
                    }]
                }
            })
            .state('EA.singleRecordView.shipment', {
                url: '/shipment/:taskNo',
                templateUrl: 'app/shared/single-record-view/shipment/shipment.html',
                controller: "SRVShipmentController as SRVShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -Shipment'
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
                        return $ocLazyLoad.load(["SRVShipment", "shipment", "shipmentMenu", "shipmentGeneral", "shipmentOrder", "shipmentConsoleAndPacking", "shipmentServiceAndReference", "routing", "relatedShipment", "shipmentPickupAndDelivery", "shipmentBilling", "shipmentDocuments", "shipmentDynamicTable"]);
                    }]
                }
            })
            .state('EA.singleRecordView.booking', {
                url: '/booking/:taskNo',
                templateUrl: 'app/shared/single-record-view/booking/booking-SRV.html',
                controller: "SRVBookingController as SRVBookingCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -Booking'
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
                        return $ocLazyLoad.load(["SRVBooking", "Booking", "BookingMenu", "addressDirective", "addressModal", "BookingDirective", "BookingOrder", "BookingServiceAndReference", "BookingPickupAndDelivery"]);
                    }]
                }
            })
            .state('EA.singleRecordView.supplier', {
                url: '/supplier/:folowUpId',
                templateUrl: 'app/shared/single-record-view/supplier-follow-up/supplier-follow-up.html',
                controller: "SRVSupplierController as SRVSupplierCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -FollowUp'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["SRVSupplier", "supplierFollowUp", "supplierFollowUpDirective", "supplierFollowUpModal", "detachModal", "cancelModal", "shipment"]);
                    }]
                }
            })
            .state('EA.singleRecordView.preAdvice', {
                url: '/pre-advice/:preadviceId',
                templateUrl: 'app/shared/single-record-view/shipment-pre-advice/shipment-pre-advice.html',
                controller: "SRVPreAdviceController as SRVPreAdviceCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -PreAdvice'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["SRVPreAdvice", "preAdvice", "preAdviceDirective", "preAdviceModal", "preAdviceDetachModal", "preAdviceCancelModal", "shipment"]);
                    }]
                }
            })
            .state('EA.singleRecordView.pickOrder', {
                url: '/pickorder/:workorderid',
                templateUrl: 'app/shared/single-record-view/pick-order/pick-order-page.html',
                controller: "SRVPickOrderController as SRVPickOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -PickOrder'
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
                        return $ocLazyLoad.load(["SRVPickOrder", "EAwarehouse", "inward", "outward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "reference", "container", "services", "outwardCrossdock", "outwardDocument", "pick"]);
                    }]
                }
            })
            .state('EA.singleRecordView.outwardPick', {
                url: '/outwardpick/:workorderid',
                templateUrl: 'app/shared/single-record-view/outward-pick/outward-pick.html',
                controller: "SRVOutwardPickController as SRVOutwardPickCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -OutwardPick'
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

                        return $ocLazyLoad.load(["SRVOutwardPick", "EAwarehouse", "pick", "pickMenu", "pickGeneral", "pickSlip", "outward"]);
                    }]
                }
            })
            .state('EA.singleRecordView.transOrder', {
                url: '/transorder/:workorderid',
                templateUrl: 'app/shared/single-record-view/trans-order/trans-order-page.html',
                controller: "SRVTransOrderController as SRVTransOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -TransOrder'
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
                        return $ocLazyLoad.load(["SRVTransOrder", "EAwarehouse", "outward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "reference", "container", "services", "outwardCrossdock", "outwardDocument"]);
                    }]
                }
            })
            .state('EA.singleRecordView.transinOrder', {
                url: '/transinorder/:workorderid',
                templateUrl: 'app/shared/single-record-view/trans-inorder/trans-inorder-page.html',
                controller: "SRVTransinOrderController as SRVTransinOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -TransinOrder'
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
                        return $ocLazyLoad.load(["SRVTransinOrder", "EAwarehouse", "inward", "inwardMenu", "inwardGeneral", "inwardLines", "reference", "container", "services", "inwardmytask"]);
                    }]
                }
            })
            .state('EA.singleRecordView.order', {
                url: '/order/:orderId',
                templateUrl: 'app/shared/single-record-view/order/orderSRV.html',
                controller: "SRVOrderController as SRVOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -Order'
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
                        return $ocLazyLoad.load(["SRVOrder", "order", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "supplierFollowUp", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sendFollowupMail", "sfuGridDirective", "pagination", "sfuHistory", "orderVesselPlanning"]);
                    }]
                }
            })
            .state('EA.singleRecordView.poBatchUpload', {
                url: '/po-batch-upload/:taskNo',
                templateUrl: 'app/shared/single-record-view/po-upload/pouploadSRV.html',
                controller: "SRVPOUploadController as SRVPOUploadCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -PO Batch Upload'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["SRVPoUpload", "poBatchUpload", "poBatchUploadDirective", "order", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "supplierFollowUp", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sendFollowupMail", "sfuGridDirective", "pagination", "sfuHistory", "orderVesselPlanning"]);
                    }]
                }
            })
            .state('EA.singleRecordView.outwardrelease', {
                url: '/outwardrelease/:workorderid',
                templateUrl: 'app/shared/single-record-view/outward-release/outward-release.html',
                controller: "SRVOutwardReleaseController as SRVOutwardReleaseCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -OutwardRelease'
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

                        return $ocLazyLoad.load(["SRVOutwardRelease", "whReleases", "EAwarehouse", "whReleasesMenu", "whReleasesGeneral", "pick", "pickSlip", "whReleasesOutward", "outward", "outwardGeneral", "outwardMenu", "outwardLine", "outwardPick", "outwardDocument"]);
                    }]
                }
            })
            .state('EA.singleRecordView.consignment', {
                url: '/consignment/:ConsignmentNumber',
                templateUrl: 'app/shared/single-record-view/consignment/consignment.html',
                controller: "SRVConsignmentController as SRVConsignCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -Consignment'
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

                        return $ocLazyLoad.load(["SRVConsignment", "consignment", "consignmentMenu", "consignmentGeneral", "Transports", "consignConsignmentItem", "consignmentManifest", "consignmentAddress", "consignmentReadOnly"]);
                    }]
                }
            })
            .state('EA.singleRecordView.manifestItem', {
                url: '/manifestitem/:ItemCode',
                templateUrl: 'app/shared/single-record-view/manifest-item/manifest-item.html',
                controller: "SRVManifestItemController as SRVManifestItemCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -ManifestItem'
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

                        return $ocLazyLoad.load(["SRVManifestItem", "item", "itemMenu", "itemAddress", "itemGeneral", "Transports", "itemConsignment", "itemManifest", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.singleRecordView.receiveLines', {
                url: '/receivelines/:ManifestNumber',
                templateUrl: 'app/shared/single-record-view/receive-lines/receive-lines.html',
                controller: "SRVReceiveLinesController as SRVReceiveLinesCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -ReceiveLines'
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

                        return $ocLazyLoad.load(["SRVReceiveLines", "manifest", "manifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems", "adminManifest", "createManifest"]);
                    }]
                }
            })
            .state('EA.singleRecordView.consignmentItem', {
                url: '/consignmentitem/:ItemCode',
                templateUrl: 'app/shared/single-record-view/consignment-item/consignment-item.html',
                controller: "SRVConsignmentItemController as SRVConsignItemCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -ConsignmentItem'
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

                        return $ocLazyLoad.load(["SRVConsignmentItem", "item", "itemMenu", "itemAddress", "itemGeneral", "Transports", "itemConsignment", "itemManifest", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.singleRecordView.manifest', {
                url: '/manifest/:ManifestNumber',
                templateUrl: 'app/shared/single-record-view/manifest/manifest.html',
                controller: "SRVManifestController as SRVManifestCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -Manifest'
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

                        return $ocLazyLoad.load(["SRVManifest", "manifest", "manifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "adminManifest", "createManifest"]);
                    }]
                }
            })
            .state('EA.singleRecordView.manifestedit', {
                url: '/manifest/:ManifestNumber',
                templateUrl: 'app/shared/single-record-view/manifest-editable/manifest-editable.html',
                controller: "SRVManifestEditableCtrl as SRVManifestEditableCtrl",
                ncyBreadcrumb: {
                    label: 'SRV -manifestedit'
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

                        return $ocLazyLoad.load(["SRVManifest", "manifest", "manifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "SRVManifestEditable", "adminManifest", "createManifest"]);
                    }]
                }
            })
            // Freight
            .state('EA.freight', {
                abstract: true,
                url: '/freight',
                templateUrl: 'app/eaxis/freight/freight.html',
                controller: "FreightController as FreightCtrl",
                ncyBreadcrumb: {
                    label: 'Freight'
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
                        return $ocLazyLoad.load(['Freight']);
                    }]
                }
            })
            .state('EA.freight.shipment', {
                url: '/shipment',
                templateUrl: 'app/eaxis/freight/shipment/shipment.html',
                controller: "ShipmentController as ShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'Shipment'
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
                        return $ocLazyLoad.load(["fileUpload", "fileUploadModal", "addressDirective", "addressWrapper", "addressModal", "shipment", "shipmentMenu", "shipmentGeneral", "shipmentOrder", "shipmentConsoleAndPacking", "shipmentServiceAndReference", "routing", "relatedShipment", "shipmentPickupAndDelivery", "shipmentBilling", "shipmentDocuments", "shipmentDynamicTable", "shipmentMyTask"]);
                    }]
                }
            })
            .state('EA.freight.booking', {
                url: '/booking',
                templateUrl: 'app/eaxis/freight/booking/booking.html',
                controller: "BookingController as BookingCtrl",
                ncyBreadcrumb: {
                    label: 'Booking'
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
                        return $ocLazyLoad.load(["addressDirective", "addressWrapper", "addressModal", "Booking", "BookingMenu", "BookingDirective", "BookingOrder", "BookingServiceAndReference", "BookingPickupAndDelivery"]);
                    }]
                }
            })
            .state('EA.freight.consolidation', {
                url: '/consolidation',
                templateUrl: 'app/eaxis/freight/consolidation/consolidation.html',
                controller: "ConsolidationController as ConsolidationCtrl",
                ncyBreadcrumb: {
                    label: 'Consolidation'
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
                        return $ocLazyLoad.load(["addressDirective", "addressWrapper", "addressModal", "consolidation", "consolGeneral", "ConsolArrivalDeparture", "consolContainer", "ContainerDirectives", "consolMenu", "routing", "consolContainerPopup", "ConsolShipment", "ConsolPacking"]);
                    }]
                }
            })
            .state('EA.freight.container', {
                url: '/container',
                templateUrl: 'app/eaxis/freight/container/container.html',
                controller: "ContainerController as ContainerCtrl",
                ncyBreadcrumb: {
                    label: 'Container'
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
                        return $ocLazyLoad.load(["containerFiles", "containerFilesDirective", "ContainerDirectives"]);
                    }]
                }
            })
            // Purchase Order
            .state('EA.PO', {
                abstract: true,
                url: '/PO',
                templateUrl: 'app/eaxis/purchase-order/purchase-order.html',
                controller: "PurchaseOrderController as PurchaseOrderCtrl",
                ncyBreadcrumb: {
                    label: 'Purchase Order'
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
                        return $ocLazyLoad.load(['PurchaseOrder']);
                    }]
                }
            })
            .state('EA.PO.orderDashboard', {
                url: '/order-dashboard',
                templateUrl: 'app/eaxis/purchase-order/order-dashboard/order-dashboard.html',
                controller: "OrderDashController as OrderDashCtrl",
                ncyBreadcrumb: {
                    label: 'Order'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chart", "orderDashboard"]);
                    }]
                }
            })
            .state('EA.PO.order', {
                url: '/order',
                templateUrl: 'app/eaxis/purchase-order/order/order.html',
                controller: "OrderController as OrderCtrl",
                ncyBreadcrumb: {
                    label: 'Order'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chart", "order", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "supplierFollowUp", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sendFollowupMail", "sfuGridDirective", "pagination", "sfuHistory", "orderVesselPlanning"]);
                    }]
                }
            })
            .state('EA.PO.orderLines', {
                url: '/order-lines',
                templateUrl: 'app/eaxis/purchase-order/order-lines/order-lines.html',
                controller: "OrderLinesController as OrderLinesCtrl",
                ncyBreadcrumb: {
                    label: 'Order Lines'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["order", "orderLinesFiles", "orderLinesDirective", "orderLinesFormDirective"]);
                    }]
                }
            })
            .state('EA.PO.supplierFollowUp', {
                url: '/supplier-follow-up',
                templateUrl: 'app/eaxis/purchase-order/supplier-followup/supplier-followup.html',
                controller: "SFUController as SFUCtrl",
                ncyBreadcrumb: {
                    label: 'Supplier FollowUp'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["supplierFollowUp", "supplierFollowUpDirective", "supplierFollowUpModal", "detachModal", "cancelModal"]);
                    }]
                }
            })
            .state('EA.PO.preAdvice', {
                url: '/pre-advice',
                templateUrl: 'app/eaxis/purchase-order/pre-advice/pre-advice.html',
                controller: "preAdviceController as PreAdviceCtrl",
                ncyBreadcrumb: {
                    label: 'Pre Advice'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chart", "preAdvice", "preAdviceDirective", "preAdviceModal", "preAdviceDetachModal", "preAdviceCancelModal", "preAdviceBookingDirective", "sendPreAdviceMail", "preAdviceGirdDirective", "VesselPanningPreAdvice", "pagination"]);
                    }]
                }
            })
            .state('EA.PO.poBatchUpload', {
                url: '/po-batch-upload',
                templateUrl: 'app/eaxis/purchase-order/po-batch-upload/po-batch-upload.html',
                controller: "POBatchUploadController as POBatchUploadCtrl",
                ncyBreadcrumb: {
                    label: 'PO Batch Upload'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["poBatchUpload", "poBatchUploadDirective", "order", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "supplierFollowUp", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sendFollowupMail", "sfuGridDirective", "pagination", "sfuHistory", "orderVesselPlanning"]);
                    }]
                }
            })
            .state('EA.PO.orderReport', {
                url: '/order-report',
                templateUrl: 'app/eaxis/purchase-order/order-report/order-report.html',
                controller: "orderReportController as OrderReportCtrl",
                ncyBreadcrumb: {
                    label: 'Order Report'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["orderReport"]);
                    }]
                }
            })
            // Smart Track
            .state('EA.smartTrack', {
                abstract: true,
                url: '/smart-track',
                templateUrl: 'app/eaxis/smart-track/smart-track.html',
                controller: "SmartTrackController as SmartTrackCtrl",
                ncyBreadcrumb: {
                    label: 'Smart Track'
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
                        return $ocLazyLoad.load(['smartTrack']);
                    }]
                }
            })
            .state('EA.smartTrack.trackOrders', {
                url: '/track-orders',
                templateUrl: 'app/eaxis/smart-track/track-orders/track-orders.html',
                controller: "trackOrderController as TrackOrderCtrl",
                ncyBreadcrumb: {
                    label: 'Track Orders'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["orderTracking", "order", "orderTrackingDirective"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackOrderLines', {
                url: '/track-order-lines',
                templateUrl: 'app/eaxis/smart-track/track-order-lines/track-order-lines.html',
                controller: "trackOrderLineController as TrackOrderLineCtrl",
                ncyBreadcrumb: {
                    label: 'Track OrderLines'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["orderLinesTracking", "orderLinesTrackingDirective", "orderLinesFiles"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackShipments', {
                url: '/track-shipments',
                templateUrl: 'app/eaxis/smart-track/track-shipments/track-shipments.html',
                controller: "trackShipmentController as TrackShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'Track Shipments'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["shipmentTracking", "shipment", "shipmentTrackingDirective"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackContainers', {
                url: '/track-containers',
                templateUrl: 'app/eaxis/smart-track/track-containers/track-containers.html',
                controller: "trackContainerController as TrackContainerCtrl",
                ncyBreadcrumb: {
                    label: 'Track Containers'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["containerTracking", "containerTrackingDirective"]);
                    }]
                }
            })
            // Customer Portal Document
            .state('EA.myDocuments', {
                url: '/my-documents',
                templateUrl: 'app/eaxis/my-documents/documents/document.html',
                controller: "documentController as DocumentCtrl",
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
                        return $ocLazyLoad.load(["shipment", "CustomerPortalDocument"]);
                    }]
                }
            })
            // Warehouse
            .state('EA.WMS', {
                abstract: true,
                url: '/WMS',
                templateUrl: 'app/eaxis/warehouse/warehouse.html',
                controller: "WarehouseController as WarehouseCtrl",
                ncyBreadcrumb: {
                    label: 'Warehouse'
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
                        return $ocLazyLoad.load(["EAwarehouse"]);
                    }]
                }
            })
            .state('EA.WMS.inward', {
                url: '/inward',
                templateUrl: 'app/eaxis/warehouse/inward/inward.html',
                controller: "InwardController as InwardCtrl",
                ncyBreadcrumb: {
                    label: 'Inward'
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
                        return $ocLazyLoad.load(["inwardAddress", "addressWrapper", "inward", "inwardProductSummary", "outward", "inwardMenu", "inwardGeneral", "inwardAsnLines", "inwardLines", "inwardDocument", "reference", "container", "services", "inwardmytask", "MyTask", "AsnirUpdateLineDirective", "AsnirUpdateLineEditDirective", "MyTaskDefaultDirective", "MyTaskDefaultEditDirective", "LocationDashboardModal"]);
                    }]
                }
            })
            .state('EA.WMS.inwardDashboard', {
                url: '/inward-dashboard',
                templateUrl: 'app/eaxis/warehouse/inward/inward-dashboard/inward-dashboard.html',
                controller: "InwardDashboardController as InwardDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Inward'
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
                        return $ocLazyLoad.load(["chart", "inwardDashboard"]);
                    }]
                }
            })
            .state('EA.WMS.outward', {
                url: '/outward',
                templateUrl: 'app/eaxis/warehouse/outward/outward.html',
                controller: "OutwardController as OutwardCtrl",
                ncyBreadcrumb: {
                    label: 'Outward'
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
                        return $ocLazyLoad.load(["outwardAddress", "outward", "inward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "reference", "container", "services", "outwardCrossdock", "pick", "outwardDocument"]);
                    }]
                }
            })
            .state('EA.WMS.outwardDashboard', {
                url: '/outward-dashboard',
                templateUrl: 'app/eaxis/warehouse/outward/outward-dashboard/outward-dashboard.html',
                controller: "OutwardDashboardController as OutwardDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Outward'
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
                        return $ocLazyLoad.load(["chart", "outwardDashboard"]);
                    }]
                }
            })
            .state('EA.WMS.asnRequest', {
                url: '/asn-request',
                templateUrl: 'app/eaxis/warehouse/asn-request/asnrequest.html',
                controller: "AsnrequestController as AsnrequestCtrl",
                ncyBreadcrumb: {
                    label: 'ASN Request'
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
                        return $ocLazyLoad.load(["asnRequest", "asnRequestGeneral", "asnRequestAddress"]);
                    }]
                }
            })
            .state('EA.WMS.pick', {
                url: '/pick',
                templateUrl: 'app/eaxis/warehouse/pick/pick.html',
                controller: "PickController as PickCtrl",
                ncyBreadcrumb: {
                    label: 'Pick'
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
                        return $ocLazyLoad.load(["pick", "pickMenu", "pickGeneral", "pickSlip", "outward"]);
                    }]
                }
            })
            .state('EA.WMS.releases', {
                url: '/releases',
                templateUrl: 'app/eaxis/warehouse/wh-releases/wh-releases.html',
                controller: "ReleaseController as ReleaseCtrl",
                ncyBreadcrumb: {
                    label: 'Release'
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
                        return $ocLazyLoad.load(["whReleases", "whReleasesMenu", "whReleasesGeneral", "pick", "pickSlip", "whReleasesOutward", "outward", "outwardGeneral", "outwardMenu", "outwardLine", "outwardPick"]);
                    }]
                }
            })
            .state('EA.WMS.transport', {
                url: '/transport',
                templateUrl: 'app/eaxis/warehouse/transport/transport.html',
                controller: "TransportController as TransportCtrl",
                ncyBreadcrumb: {
                    label: 'Transport'


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
                        return $ocLazyLoad.load(["transport", "transportmenu", "transportorders", "transportgeneral", "transportvehicle", "transportpickupanddelivery", "outward", "inward"]);
                    }]
                }
            })
            .state('EA.WMS.pickupAndDelivery', {
                url: '/pickup-and-delivery',
                templateUrl: 'app/eaxis/warehouse/PickupandDelivery/PickupandDelivery.html',
                controller: "PickupanddeliveryController as PickupanddeliveryCtrl",
                ncyBreadcrumb: {
                    label: 'Pickup And Delivery'
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
                        return $ocLazyLoad.load(["pickupandDelivery", "pickupandDeliverymenu", "pickupandDeliverygeneral", "pickupanddeliveryDetails"]);
                    }]
                }
            })
            .state('EA.WMS.inventory', {
                url: '/inventory',
                templateUrl: 'app/eaxis/warehouse/inventory/inventory.html',
                controller: "InventoryController as InventoryCtrl",
                ncyBreadcrumb: {
                    label: 'Inventory'
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
                        return $ocLazyLoad.load(["inventory", "inventoryMenu", "inventoryGeneral"]);
                    }]
                }
            })
            .state('EA.WMS.adjustment', {
                url: '/adjustment',
                templateUrl: 'app/eaxis/warehouse/adjustment/adjustment.html',
                controller: "AdjustmentController as AdjustmentCtrl",
                ncyBreadcrumb: {
                    label: 'Adjustment'
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
                        return $ocLazyLoad.load(["adjustment", "adjustmentMenu", "adjustmentGeneral", "LocationDashboardModal"]);
                    }]
                }
            })
            .state('EA.WMS.cycleCount', {
                url: '/cycle-count',
                templateUrl: 'app/eaxis/warehouse/cycle-count/cycle-count.html',
                controller: "CycleCountController as CycleCountCtrl",
                ncyBreadcrumb: {
                    label: 'Cycle Count'
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
                        return $ocLazyLoad.load(["cycleCount", "cycleCountMenu", "cycleCountGeneral", "cycleCountLine", "LocationDashboardModal"]);
                    }]
                }
            })
            .state('EA.WMS.stockTransfer', {
                url: '/stock-transfer',
                templateUrl: 'app/eaxis/warehouse/stock-transfer/stock-transfer.html',
                controller: "StocktransferController as StocktransferCtrl",
                ncyBreadcrumb: {
                    label: 'Stock Transfer'
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
                        return $ocLazyLoad.load(["stockTransfer", "stockTransferEntry", "stockTransferMenu", "LocationDashboardModal"]);
                    }]
                }
            })
            .state('EA.WMS.warehouseReport', {
                url: '/warehouse-report',
                templateUrl: 'app/eaxis/warehouse/reports/report.html',
                controller: "WarehosueReportController as ReportCtrl",
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
                        return $ocLazyLoad.load(["warehouseReport", "generateBarcode", "dynamicControl"]);
                    }]
                }
            })
            .state('EA.WMS.generateBarcode', {
                url: '/generate-barcode',
                templateUrl: 'app/eaxis/warehouse/reports/generate-barcode/generate-barcode.html',
                controller: "GenerateBarcodeController as GenerateBarcodeCtrl",
                ncyBreadcrumb: {
                    label: 'Generate-Barcode'
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
                        return $ocLazyLoad.load(["warehouseReport", "generateBarcode", "dynamicControl"]);
                    }]
                }
            })
            // Spot Light
            // Trasnport Management System
            .state('EA.TMS', {
                abstract: true,
                url: '/TMS',
                templateUrl: 'app/eaxis/transports/transports.html',
                controller: "TransportsController as TransportsCtrl",
                ncyBreadcrumb: {
                    label: 'Transport'
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
                        return $ocLazyLoad.load(["Transports"]);
                    }]
                }
            })
            .state('EA.TMS.consolidatedDashboard', {
                url: '/consolidated-dashboard',
                templateUrl: 'app/eaxis/transports/consolidated-dashboard/consolidated-dashboard.html',
                controller: "ConsolidatedDashboardController as ConsolidatedDashboardCtrl",
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
                        return $ocLazyLoad.load(["consolidatedDashboard", "chart", "manifest", "manifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "consignment", "consignmentMenu", "consignmentGeneral", "consignConsignmentItem", "consignmentManifest", "item", "itemMenu", "itemGeneral", "consignmentAddress", "itemAddress", "manifestAddress", "manifestReadOnly", "receiveItems", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.TMS.scanItem', {
                url: '/scan-item',
                templateUrl: 'app/eaxis/transports/scan-item/scan-item.html',
                controller: "ScanItemController as ScanItemCtrl",
                ncyBreadcrumb: {
                    label: 'Scan Item'
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
                        return $ocLazyLoad.load(["scanItem", "Transports"]);
                    }]
                }
            })
            .state('EA.TMS.trackmanifest', {
                url: '/track-manifest',
                templateUrl: 'app/eaxis/transports/track-manifest/manifest.html',
                controller: "ManifestController as ManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Manifest'
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
                        return $ocLazyLoad.load(["manifest", "createManifest", "manifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems", "adminManifest"]);
                    }]
                }
            })
            .state('EA.TMS.trackconsignment', {
                url: '/track-consignment',
                templateUrl: 'app/eaxis/transports/track-consignment/consignment.html',
                controller: "ConsignmentController as ConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'Consignment'
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
                        return $ocLazyLoad.load(["consignment", "consignmentMenu", "consignmentGeneral", "Transports", "consignConsignmentItem", "consignmentManifest", "consignmentAddress", "consignmentReadOnly"]);
                    }]
                }
            })
            .state('EA.TMS.trackitem', {
                url: '/track-item',
                templateUrl: 'app/eaxis/transports/track-item/item.html',
                controller: "ItemController as ItemCtrl",
                ncyBreadcrumb: {
                    label: 'item'
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
                        return $ocLazyLoad.load(["item", "itemMenu", "itemAddress", "itemGeneral", "Transports", "itemConsignment", "itemManifest", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.TMS.manifest', {
                url: '/manifest',
                templateUrl: 'app/eaxis/transports/manifest/manifest.html',
                controller: "AdminManifestController as AdminManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Manifest'
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
                        return $ocLazyLoad.load(["adminManifest", "createManifest", "manifest", "adminManifestMenu", "manifestGeneral", "Transports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems"]);
                    }]
                }
            })
            .state('EA.TMS.consignment', {
                url: '/consignment',
                templateUrl: 'app/eaxis/transports/consignment/consignment.html',
                controller: "AdminConsignmentController as AdminConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'Consignment'
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
                        return $ocLazyLoad.load(["adminConsignment", "adminConsignmentMenu", "consignment", "consignmentGeneral", "Transports", "consignConsignmentItem", "consignmentManifest", "consignmentAddress"]);
                    }]
                }
            })
            .state('EA.TMS.item', {
                url: '/item',
                templateUrl: 'app/eaxis/transports/item/item.html',
                controller: "AdminItemController as AdminItemCtrl",
                ncyBreadcrumb: {
                    label: 'item'
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
                        return $ocLazyLoad.load(["adminItem", "adminItemMenu", "item", "itemAddress", "itemGeneral", "Transports", "itemConsignment", "itemManifest"]);
                    }]
                }
            })
            .state('EA.TMS.createmanifest', {
                url: '/create-manifest',
                templateUrl: 'app/eaxis/transports/create-manifest/create-manifest.html',
                controller: "CreateManifestController as CreateManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Manifest'
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
                        return $ocLazyLoad.load(["createManifest", "createManifestGeneral", "Transports", "manifestAddress", "manifest", "manifestMenu", "manifestGeneral", "manifestReadOnly", "dcDashboard", "adminManifest"]);
                    }]
                }
            })
            .state('EA.TMS.createConsignment', {
                url: '/create-consignment',
                templateUrl: 'app/eaxis/transports/create-consignment/create-consign.html',
                controller: "CreateConsignController as CreateConsignCtrl",
                ncyBreadcrumb: {
                    label: 'Consignment'
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
                        return $ocLazyLoad.load(["createConsignment", "createConsignmentGeneral", "consignment", "consignmentMenu", "consignmentGeneral", "Transports", "consignmentAddress"]);
                    }]
                }
            })
            .state('EA.TMS.transportsDashboard', {
                url: '/transports-dashboard',
                templateUrl: 'app/eaxis/transports/dc-dashboard/dc-dashboard.html',
                controller: "DcDashboardController as DcDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'DC-Dashboard'
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
                        return $ocLazyLoad.load(["dcDashboard", "chart", "Transports"]);
                    }]
                }
            })
    }
})();
