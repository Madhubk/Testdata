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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "JsonModal", "errorWarning", "dynamicTable", "GenerateDBScript", "organization", "organizationMenu", "organizationGeneral", "organizationAddress", "organizationContact", "organizationCompany", "organizationEmployee", "organizationRelatedParties", "organizationRelatedPartiesModal", "organizationVisibility", "organizationConsignee", "organizationConsigneeModal", "organizationConsigneeDocModal", "organizationConsignor", "organizationConsignorModal", "organizationConsignorDocModal", "organizationWarehouse", "organizationGenRelatedPartiesModal", "organizationGenRelatedParties", "organizationReference",  "organizationAccessRights", "ExpressionFormatter", "ExpressionGroupFormatter", "NotificationFormatter", "NotificationTemplateFormatter", "TaskConfigFormatter", "PartyMapping"]);
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
                        return $ocLazyLoad.load(['MDDepartment', 'MDDepartmentMenu', 'MDDepartmentDetails', 'MDDepartmentDetailsModal']);
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
                        return $ocLazyLoad.load(['MDBranch', 'MDBranchMenu', 'MDBranchDetails', 'MDBranchDetailsModal']);
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
                        return $ocLazyLoad.load(['MDCompany', 'MDCompanyMenu', 'MDCompanyDetails', 'MDCompanyDetailsModal']);
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "products", "productBulkUpload", "productMenu", "productGeneral", "general", "unitConversions", "relatedOrganization", "productWarehouse", "pickFace", "bom", "barcodes", "additionalDetails"]);
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "MasterWarehouse", "MasterWarehouses", "MasterWarehousesMenu", "MasterWarehousesDetails", "MasterWarehouseAddress"]);
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "areas", "areasDetails", "areasMenu"]);
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "location", "locationMenu", "locationDetails"]);
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "MasterWarehouse", "Vehicle", "VehicleMenu", "VehicleGeneral"]);
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "mhu", "mhuMenu", "mhuGeneral", "mhuRelatedOrg"]);
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "journey", "journeyGeneral"]);
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "leg", "legGeneral"]);
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "zone", "zoneGeneral"]);
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "nonWorkingDays", "nonWorkingDaysGeneral"]);
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "MDMTransports", "region", "regionGeneral"]);
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
            });
    }
})();
