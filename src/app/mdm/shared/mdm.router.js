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
                        return $ocLazyLoad.load(['confirmation', 'navBar', 'sideBar', 'chromeTab', 'changePassword', 'customDatepicker', 'dynamicListModal', "dynamicControl", "dynamicGrid", "dynamicList", "dynamicTable", "dynamicLookup", "standardMenu", "JsonModal", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Event", "EventModal", "Exception", "ExceptionModal", "DataEvent", "DataEventModal", "AuditLog", "AuditLogModal", "EmailTemplate", "EmailTemplateModal", 'MD']);
                    }]
                }
            })
            .state('MD.home', {
                abstract: true,
                url: '/home',
                templateUrl: 'app/Mdm/home/home.html',
                controller: "MdmHomeController as MdmHomeCtrl",
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
                        return $ocLazyLoad.load(['MDHome']);
                    }]
                }
            })
            .state('MD.home.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/mdm/dashboard/dashboard.html',
                controller: "MdmDashboardController as MdmDashboardCtrl",
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
                        return $ocLazyLoad.load('MDDashboard');
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
                        return $ocLazyLoad.load(["errorWarning", "organization", "organizationMenu", "organizationGeneral", "organizationGeneralModal", "organizationAddress", "organizationAddressModal", "organizationContact", "organizationContactModal", "organizationCompany", "organizationCompanyModal", "organizationEmployee", "organizationEmployeeModal", "organizationRelatedParties", "organizationRelatedPartiesModal", "organizationVisibility", "organizationConsignee", "organizationConsigneeModal", "organizationConsigneeDocModal", "organizationConsignor", "organizationConsignorModal", "organizationConsignorDocModal", "organizationWarehouse", "organizationWarehouseModal", "organizationGenRelatedPartiesModal", "organizationGenRelatedParties", "organizationReference", "organizationReferenceModal"]);
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
                        return $ocLazyLoad.load(["products", "productMenu", "productGeneral", "general", "unitConversions", "relatedOrganization", "productWarehouse", "pickFace", "bom", "barcodes", "additionalDetails"]);
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
                        return $ocLazyLoad.load(["warehouse"]);
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
                        return $ocLazyLoad.load(["warehouse", "warehouses", "warehousesMenu", "warehousesDetails", "warehouseAddress"]);
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
                        return $ocLazyLoad.load(["areas", "areasDetails", "areasMenu"]);
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
                        return $ocLazyLoad.load(["locationDashboard"]);
                    }]
                }
            })
            .state('MD.WMS.locationDashboardV2', {
                url: '/location-dashboardv2',
                templateUrl: 'app/mdm/warehouse/locations/location-dashboard-V2/location-dashboardV2.html',
                controller: "LocationDashboardControllerV2 as LocationDashboardCtrlV2",
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
                        return $ocLazyLoad.load(["locationDashboardV2", "location", "locationMenu", "locationDetails"]);
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
                        return $ocLazyLoad.load(["warehouse", "location", "locationMenu", "locationDetails", "LocationDashboardModal"]);
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
                        return $ocLazyLoad.load(["Transports"]);
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
                        return $ocLazyLoad.load(['Transports', "mhu", "mhuMenu", "mhuGeneral", "mhuRelatedOrg"]);
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
                        return $ocLazyLoad.load(['Transports', "journey"]);
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
                        return $ocLazyLoad.load(['Transports', "leg"]);
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
                        return $ocLazyLoad.load(['Transports', "zone"]);
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
                        return $ocLazyLoad.load(['Transports', "mapping", "mappingMenu", "mappingSenderCarrier", "mappingSenderReceiver", "mappingCarrierVehicle", "mappingStoreDepot", "mappingDcDepotStore"]);
                    }]
                }
            })

    }
})();
