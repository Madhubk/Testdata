(function () {

    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "MDM_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, MDM_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: MDM_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('MD', {
                abstract: true,
                url: '/MD',
                templateUrl: 'app/Mdm/shared/mdm.html',
                controller: "MdmController as MdmCtrl",
                ncyBreadcrumb: {
                    label: 'MD'
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
                        return $ocLazyLoad.load(['navBar', 'navbarDropdownMenu', 'sideBar', 'footerBar', "changePassword", 'MDM']);
                    }]
                }
            })
            .state('MD.organization', {
                url: '/organization',
                templateUrl: 'app/mdm/organization/organization.html',
                controller: "OrganizationController as OrganizationCtrl",
                ncyBreadcrumb: {
                    label: 'Organization'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "JsonModal", "errorWarning", "dynamicTable", "GenerateDBScript", "organization", "organizationMenu", "organizationGeneral", "organizationAddress", "organizationContact", "organizationCompany", "organizationEmployee", "organizationRelatedParties", "organizationRelatedPartiesModal", "organizationVisibility", "organizationConsignee", "organizationConsigneeModal", "organizationConsigneeDocModal", "organizationConsignor", "organizationConsignorModal", "organizationConsignorDocModal", "organizationWarehouse", "organizationGenRelatedPartiesModal", "organizationGenRelatedParties", "organizationReference", "organizationAccessRights", "ExpressionFormatter", "ExpressionGroupFormatter", "NotificationFormatter", "NotificationTemplateFormatter", "TaskConfigFormatter", "PartyMapping", "organizationAccountReceivable", "organizationAccountPayable"]);
                    }]
                }
            })
            .state('MD.employee', {
                url: '/employee',
                templateUrl: 'app/mdm/employee/employee.html',
                controller: "EmployeeControllers as EmployeeCtrls",
                ncyBreadcrumb: {
                    label: 'Employee'
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
                        return $ocLazyLoad.load(['MDEmployee', 'MDEmployeeMenu', 'MDEmployeeDetails', 'MDEmployeeDetailsModal']);
                    }]
                }
            })
            .state('MD.department', {
                url: '/department',
                templateUrl: 'app/mdm/department/department.html',
                controller: "DepartmentController as DepartmentCtrl",
                ncyBreadcrumb: {
                    label: 'Department'
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
                        return $ocLazyLoad.load(['Finance', 'MDDepartment', 'MDDepartmentMenu', 'MDDepartmentDetails', 'dynamicLookup', 'dynamicListModal', 'dynamicList', 'dynamicGrid', 'dynamicControl', 'compareDate', 'customToolbar', 'confirmation', 'chromeTab', 'errorWarning']);
                    }]
                }
            })
            .state('MD.branch', {
                url: '/branch',
                templateUrl: 'app/mdm/branch/branch.html',
                controller: "BranchController as BranchCtrl",
                ncyBreadcrumb: {
                    label: 'Branch'
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
                        return $ocLazyLoad.load(['Finance','MDBranch', 'MDBranchMenu', 'MDBranchDetails',  'dynamicLookup', 'dynamicListModal', 'dynamicList', 'dynamicGrid', 'dynamicControl', 'compareDate', 'customToolbar', 'confirmation', 'chromeTab', 'errorWarning',"standardMenu", "Document", "DocumentModal"]);
                    }]
                }
            })
            .state('MD.company', {
                url: '/company',
                templateUrl: 'app/mdm/company/company.html',
                controller: "CompanyController as CompanyCtrl",
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
                        return $ocLazyLoad.load(['Finance', 'MDCompany', 'MDCompanyMenu', 'MDCompanyDetails', 'dynamicLookup', 'dynamicListModal', 'dynamicList', 'dynamicGrid', 'dynamicControl', 'compareDate', 'customToolbar', 'confirmation', 'chromeTab', 'errorWarning']);
                    }]
                }
            })
            .state('MD.products', {
                url: '/products',
                templateUrl: 'app/mdm/products/products.html',
                controller: "ProductsController as ProductsCtrl",
                ncyBreadcrumb: {
                    label: 'Products'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "products", "productBulkUpload", "productMenu", "productGeneral", "general", "unitConversions", "relatedOrganization", "productWarehouse", "pickFace", "bom", "barcodes", "additionalDetails"]);
                    }]
                }
            })
            //Warehouse Masters
            .state('MD.WMS', {
                abstract: true,
                url: '/WMS',
                templateUrl: 'app/mdm/warehouse/warehouse.html',
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
                        return $ocLazyLoad.load(["MasterWarehouse"]);
                    }]
                }
            })
            .state('MD.WMS.warehouses', {
                url: '/warehouses',
                templateUrl: 'app/mdm/warehouse/warehouses/warehouses.html',
                controller: "WarehousesController as WarehousesCtrl",
                ncyBreadcrumb: {
                    label: 'Warehouses'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "MasterWarehouse", "MasterWarehouses", "EAwarehouse", "MasterWarehousesMenu", "MasterWarehousesDetails", "MasterWarehouseAddress", "WarehouseAreaDetails", "ClientConfigDetails"]);
                    }]
                }
            })
            .state('MD.WMS.areas', {
                url: '/areas',
                templateUrl: 'app/mdm/warehouse/areas/areas.html',
                controller: "AreasController as AreasCtrl",
                ncyBreadcrumb: {
                    label: 'Areas'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "areas", "areasDetails", "areasMenu"]);
                    }]
                }
            })

            .state('MD.WMS.location', {
                url: '/location',
                templateUrl: 'app/mdm/warehouse/locations/location.html',
                controller: "LocationController as LocationCtrl",
                ncyBreadcrumb: {
                    label: 'Locations'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "location", "locationMenu", "locationDetails"]);
                    }]
                }
            })

            .state('MD.WMS.locationDashboard', {
                url: '/location-dashboard',
                templateUrl: 'app/mdm/warehouse/locations/location-dashboard/location-dashboard.html',
                controller: "LocationDashboardController as LocationDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Location'
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
                        return $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "locationDashboard"]);
                    }]
                }
            })
            .state('MD.vehicle', {
                url: '/vehicle',
                templateUrl: 'app/mdm/vehicle/vehicle.html',
                controller: "VehicleController as VehicleCtrl",
                ncyBreadcrumb: {
                    label: 'Vehicle'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "MasterWarehouse", "Vehicle", "VehicleMenu", "VehicleGeneral"]);
                    }]
                }
            })
            //Transport Masters
            .state('MD.TMS', {
                abstract: true,
                url: '/TMS',
                templateUrl: 'app/mdm/transports/transports.html',
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
                        return $ocLazyLoad.load(["MDMTransports"]);
                    }]
                }
            })
            .state('MD.TMS.mhu', {
                url: '/mhu',
                templateUrl: 'app/mdm/transports/mhu/mhu.html',
                controller: "MhuController as MhuCtrl",
                ncyBreadcrumb: {
                    label: 'MHU'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "mhu", "mhuMenu", "mhuGeneral", "mhuRelatedOrg"]);
                    }]
                }
            })
            .state('MD.TMS.journey', {
                url: '/journey',
                templateUrl: 'app/mdm/transports/journey/journey.html',
                controller: "JourneyController as JourneyCtrl",
                ncyBreadcrumb: {
                    label: 'Journey'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "journey", "journeyGeneral"]);
                    }]
                }
            })
            .state('MD.TMS.leg', {
                url: '/leg',
                templateUrl: 'app/mdm/transports/leg/leg.html',
                controller: "LegController as LegCtrl",
                ncyBreadcrumb: {
                    label: 'Leg'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "leg", "legGeneral"]);
                    }]
                }
            })
            .state('MD.TMS.zone', {
                url: '/zone',
                templateUrl: 'app/mdm/transports/zone/zone.html',
                controller: "ZoneController as ZoneCtrl",
                ncyBreadcrumb: {
                    label: 'Zone'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "zone", "zoneGeneral"]);
                    }]
                }
            })
            .state('MD.TMS.nonWorkingDays', {
                url: '/non-working-days',
                templateUrl: 'app/mdm/transports/non-working-days/non-working-days.html',
                controller: "NonWorkingDaysController as NWDaysCtrl",
                ncyBreadcrumb: {
                    label: 'Non Working Days'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "nonWorkingDays", "nonWorkingDaysGeneral"]);
                    }]
                }
            })
            .state('MD.TMS.region', {
                url: '/region',
                templateUrl: 'app/mdm/transports/region/region.html',
                controller: "RegionController as RegionCtrl",
                ncyBreadcrumb: {
                    label: 'Region'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "region", "regionGeneral"]);
                    }]
                }
            })
            .state('MD.TMS.mapping', {
                url: '/mapping',
                templateUrl: 'app/mdm/transports/mapping/mapping.html',
                controller: "MappingController as MappingCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "MDMTransports", "mapping", "mappingMenu", "mappingSenderCarrier", "mappingSenderReceiver", "mappingCarrierVehicle", "mappingStoreDepot", "mappingDcDepotStore", "mappingServiceType", "mappingContainermhu", "mappingSenderReceiverCons", "mappingReceiverCarrier"]);
                    }]
                }
            })
            .state('MD.TMS.types', {
                url: '/types',
                templateUrl: 'app/mdm/transports/types/types.html',
                controller: "TypeController as TypeCtrl",
                ncyBreadcrumb: {
                    label: 'Type'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "MDMTransports", "types", "typesMenu", "typesServiceType", "typesTags", "typesVehicleType", "typesLevelLoadType", "typesManifestType", "typesConsolEvent"]);
                    }]
                }
            })
            // Currency Master by Rajesh
            // begin
            .state('MD.currency', {
                url: '/currency',
                templateUrl: 'app/mdm/currency/currency.html',
                controller: "CurrencyController as CurrencyCtrl",
                ncyBreadcrumb: {
                    label: 'Currency'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        //  }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["currency", "currencyMenu", "currencyGeneral", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })
            .state('MD.exchangerate', {
                url: '/exchangerate',
                templateUrl: 'app/mdm/exchangeRate/exchangeRate.html',
                controller: "ExchangerateController as ExchangeRateCtrl",
                ncyBreadcrumb: {
                    label: 'Exchange Rate'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        //  }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["exchangeRate", "exchangeRateMenu", "exchangeRateGeneral", "Finance", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })

            // end
            .state('MD.glaccount', {
                url: '/glaccount',
                templateUrl: 'app/mdm/glaccount/glaccount.html',
                controller: "GLaccountController as GLaccountCtrl",
                ncyBreadcrumb: {
                    label: 'GL Account'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        // }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["Finance", "glaccount", "glaccountMenu", "glaccountGeneral", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })
            .state('MD.financialperiod', {
                url: '/financialperiod',
                templateUrl: 'app/mdm/financialperiod/financialperiod.html',
                controller: "FinancePeriodController as FinancePeriodCtrl",
                ncyBreadcrumb: {
                    label: 'Financial Period'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        // }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["Finance", "financeperiod", "financeperiodMenu", "financeperiodGeneral", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })

            .state('MD.creditor', {
                url: '/creditor',
                templateUrl: 'app/mdm/creditor/creditor.html',
                controller: "CreditorController as CreditorCtrl",
                ncyBreadcrumb: {
                    label: 'Creditor'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        // }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["Finance", "creaditor", "creaditorMenu", "creaditorGeneral", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })
            .state('MD.debtor', {
                url: '/debtor',
                templateUrl: 'app/mdm/debtor/debtor.html',
                controller: "DebtorController as DebtorCtrl",
                ncyBreadcrumb: {
                    label: 'Debtor'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        //  }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["Finance", "debtor", "debtorMenu", "debtorGeneral", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })
            .state('MD.tax', {
                url: '/tax',
                templateUrl: 'app/mdm/tax/tax.html',
                controller: "TaxController as TaxCtrl",
                ncyBreadcrumb: {
                    label: 'Tax'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        //  }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["tax", "taxMenu", "taxGeneral", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning"]);
                    }]
                }
            })
            .state('MD.chargecode', {
                url: '/chargecode',
                templateUrl: 'app/mdm/chargecode/chargecode.html',
                controller: "ChargecodeController as ChargecodeCtrl",
                ncyBreadcrumb: {
                    label: 'ChargeCode'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        deferred.resolve();
                        //  }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chargeCode", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning", "Finance", "chargeCodeGeneral", "chargeCodeMenu", "chargeCodeDetails", "chargeCodeTaxcode", "chargeCodeGLposting", "chargeCodeInvoice"]);
                    }]
                }
            });
    }
})();
