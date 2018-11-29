(function () {
    "use strict";

    angular
        .module("Application")
        .factory('three_shipmentConfig', three_shipmentConfig);

    three_shipmentConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr", "appConfig", "errorWarningService", "$timeout"];

    function three_shipmentConfig($rootScope, $location, $q, apiService, helperService, toastr, appConfig, errorWarningService, $timeout) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentList/buyer/getByid/"
                        },
                        "ShipmentActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentList/buyer/shipmentactivityclose/"
                        }
                    },
                    "GlobalVar": "Shipment",
                    "Meta": {}
                },
                "TableProperties": {
                    "UIConShpMappings": {
                        "HeaderProperties": {
                            "ConsolNo": {
                                "columnname": "ConsolNo",
                                "isenabled": true,
                                "property": "consolNo",
                                "position": "1",
                                "width": "300",
                                "display": true
                            },
                            "POL": {
                                "columnname": "POL",
                                "isenabled": true,
                                "property": "POL",
                                "position": "2",
                                "width": "250",
                                "display": true
                            },
                            "POD": {
                                "columnname": "POD",
                                "isenabled": true,
                                "property": "POD",
                                "position": "3",
                                "width": "250",
                                "display": true
                            },
                            "MBL": {
                                "columnname": "MBL",
                                "isenabled": true,
                                "property": "MBL",
                                "position": "4",
                                "width": "250",
                                "display": true
                            },
                            "Mode": {
                                "columnname": "Mode",
                                "isenabled": true,
                                "property": "mode",
                                "position": "5",
                                "width": "250",
                                "display": true
                            },
                            "Action": {
                                "columnname": "Action",
                                "isenabled": true,
                                "property": "action",
                                "position": "5",
                                "width": "50",
                                "display": true
                            }
                        },
                        "consolNo": {
                            "isenabled": true,
                            "width": "300",
                            "position": "1"
                        },
                        "POL": {
                            "isenabled": true,
                            "width": "250",
                            "position": "2"
                        },
                        "POD": {
                            "isenabled": true,
                            "width": "250",
                            "position": "3"
                        },
                        "MBL": {
                            "isenabled": true,
                            "width": "250",
                            "position": "3"
                        },
                        "Mode": {
                            "isenabled": true,
                            "width": "250",
                            "position": "3"
                        },
                        "Action": {
                            "isenabled": true,
                            "width": "50",
                            "position": "3"
                        }
                    },
                    "ContainerList": {
                        "HeaderProperties": {
                            "ContainerNo": {
                                "columnname": "ContainerNo",
                                "isenabled": true,
                                "property": "ContainerNo",
                                "position": "1",
                                "width": "200",
                                "display": true
                            },
                            "ContainerCount": {
                                "columnname": "ContainerCount",
                                "isenabled": true,
                                "property": "ContainerCount",
                                "position": "2",
                                "width": "200",
                                "display": true
                            },
                            "RC_Type": {
                                "columnname": "RC_Type",
                                "isenabled": true,
                                "property": "RC_Type",
                                "position": "3",
                                "width": "200",
                                "display": true
                            },
                            "SealNo": {
                                "columnname": "SealNo",
                                "isenabled": true,
                                "property": "SealNo",
                                "position": "4",
                                "width": "200",
                                "display": true
                            },
                        },
                        "ContainerNo": {
                            "isenabled": true,
                            "width": "200",
                            "position": "1"
                        },
                        "ContainerCount": {
                            "isenabled": true,
                            "width": "200",
                            "position": "2"
                        },
                        "RC_Type": {
                            "isenabled": true,
                            "width": "200",
                            "position": "3"
                        },
                        "SealNo": {
                            "isenabled": true,
                            "width": "200",
                            "position": "4"
                        }
                    }
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "PortsComparison": PortsComparison
        };
        return exports;

        function GetTabDetails(currentShipment, isNew) {
            // Set configuration object to individual shipment
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertShipment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "shipmentlist/buyer/insert"
                            },
                            "UpdateShipment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "shipmentlist/buyer/update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Quick View",
                                "Value": "QuickView",
                                "Icon": "fa-plane",
                                "IsDisabled": true
                            }, {
                                "DisplayName": "My Task",
                                "Value": "MyTask",
                                "Icon": "menu-icon icomoon icon-my-task",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa-plane",
                                "GParentRef": "General",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Link Orders",
                                "Value": "Order",
                                "Icon": "fa-cart-plus",
                                "GParentRef": "linkorders",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Consol & Packing",
                                "Value": "ConsolAndPacking",
                                "Icon": "fa-suitcase",
                                "GParentRef": "consolandpacking",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Service & Reference",
                                "Value": "ServiceAndReference",
                                "Icon": "fa-wrench",
                                "GParentRef": "serviceandreference",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Routing",
                                "Value": "Routing",
                                "Icon": "fa-ship",
                                "GParentRef": "routing",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Related Shipment",
                                "Value": "RelatedShipment",
                                "Icon": "fa-link",
                                "GParentRef": "relatedshipment",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Pickup & Delivery",
                                "Value": "PickupAndDelivery",
                                "Icon": "fa-train",
                                "GParentRef": "pickupanddelivery",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Job",
                                "Value": "Job",
                                "Icon": "fa-gg",
                                "GParentRef": "job",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o",
                                "GParentRef": "address",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Documents",
                                "Value": "Documents",
                                "Icon": "fa-address-card-o",
                                "GParentRef": "documents",
                                "IsDisabled": true
                            }, {
                                "DisplayName": "Dynamic Table",
                                "Value": "DynamicTable",
                                "Icon": "fa-address-card-o",
                                "GParentRef": "dynamictable",
                                "IsDisabled": true
                            }],
                            "PacksUOM": helperService.metaBase(),
                            "ServiceLevel": helperService.metaBase(),
                            "Currency": helperService.metaBase(),
                            "ProfitLoss": helperService.metaBase(),
                            "Country": helperService.metaBase(),
                            "Container": helperService.metaBase()

                        }
                    },
                    "Container": {
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "ContainerNo",
                                "displayName": "Container #"
                            }, {
                                "field": "ContainerCount",
                                "displayName": "Count"
                            }, {
                                "field": "RC_Type",
                                "displayName": "Type"
                            }, {
                                "field": "SealNo",
                                "displayName": "Seal #"
                            }]
                        }

                    },
                    "Service": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "ServiceCode",
                                "displayName": "Service Code",
                            }, {
                                "field": "Booked",
                                "displayName": "Booked",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "Duration",
                                "displayName": "Duration",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | duration}}</div>",
                            }, {
                                "field": "ServiceCount",
                                "displayName": "Service Count",
                            }, {
                                "field": "Completed",
                                "displayName": "Completed",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }]
                        }
                    },
                    "Reference": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "EntryNum",
                                "displayName": "Number"
                            }, {
                                "field": "EntryType",
                                "displayName": "Number Type"
                            }]
                        }
                    },
                    "ShipmentJobCharge": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobCharge/FindAll",
                                "FilterID": "JOBCHAR"
                            }
                        },
                        "Meta": {},
                        "Grid": {
                            "ColumnDef": [{
                                "field": "ChargeType",
                                "displayName": "ChargeType",
                            }, {
                                "field": "Desc",
                                "displayName": "Desc",
                            }, {
                                "field": "BRN_FK",
                                "displayName": "BRN_FK",
                            }, {
                                "field": "DEP_FK",
                                "displayName": "DEP_FK",
                            }, {
                                "field": "CostRated",
                                "displayName": "CostRated",
                            }, {
                                "field": "OSCostAmt",
                                "displayName": "OSCostAmt",
                            }, {
                                "field": "EstimatedCost",
                                "displayName": "EstimatedCost",
                            }, {
                                "field": "LocalCostAmt",
                                "displayName": "LocalCostAmt",
                            }, {
                                "field": "SellRatingOverrideComment",
                                "displayName": "SellRatingOverrideComment",
                            }, {
                                "field": "OSSellAmt",
                                "displayName": "OSSellAmt",
                            }, {
                                "field": "EstimatedRevenue",
                                "displayName": "EstimatedRevenue",
                            }, {
                                "field": "LocalSellAmt",
                                "displayName": "LocalSellAmt",
                            }, {
                                "field": "LocalSellAmt",
                                "displayName": "LocalSellAmt",
                            }, {
                                "field": "JOB_FK",
                                "displayName": "JOB_FK",
                            }],
                            "GridConfig": {
                                "_gridHeight": 230,
                                "_enableRowSelection": true,
                                "_enableRowHeaderSelection": true,
                                "_multiSelect": false,
                                "_exporterCsvFilename": "data",
                                "_exporterPdfFilename": "data",
                                "_enablePaginationControls": false,
                                "_enableGridMenu": false,
                                "_enableColumnMenus": false,
                                "_enableCellSelection": false,
                                "_enableCellEdit": false,
                                "_enableSorting": true,
                                "_useExternalSorting": false,
                                "_useExternalPagination": false,
                                "_isAPI": false,
                                "_rowTemplate": "",
                                "_columnPrefix": "ATH_",
                                "_sortColumn": "PK",
                                "_sortType": "ASC",
                                "_pageNumber": 1,
                                "_paginationPageSize": 25,
                                "_paginationPageSizes": [25, 50, 100]
                            }
                        }
                    },
                    "ShipmentConsol": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "ConsolNo",
                                "displayName": "Consol #",
                            }, {
                                "field": "FirstLoadPort",
                                "displayName": "POL",
                            }, {
                                "field": "LastDischargePort",
                                "displayName": "POD",
                            }, {
                                "field": "MasterBillNo",
                                "displayName": "MBL",
                            }, {
                                "field": "ContainerMode",
                                "displayName": "Mode",
                            }]
                        }
                    },
                    "ShipmentOrder": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderItem/FindAll",
                                "FilterID": "ORDITEM"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderItem/Upsert",
                            },
                            "OrderAttach": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderHeader/UpdateRecords"
                            }
                        },
                        "Meta": {},
                        "Grid": {
                            "ColumnDef": [{
                                "field": "OrderNo",
                                "displayName": "Order No",
                            }, {
                                "field": "OrderDate",
                                "displayName": "Order Date",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.OrderDate | date:'dd-MMM-yyyy  hh:mm a'}}</div>"
                            }, {
                                "field": "GoodsDescription",
                                "displayName": "Goods Description",
                            }, {
                                "field": "OrderStatus",
                                "displayName": "Order Status",
                            }, {
                                "field": "Packs",
                                "displayName": "Packs",
                            }, {
                                "field": "TransportMode",
                                "displayName": "Transport Mode",
                            }, {
                                "field": "ContainerMode",
                                "displayName": "Container Mode",
                            }, {
                                "field": "GoodsAvailableAt",
                                "displayName": "Load Port",
                            }, {
                                "field": "GoodsDeliveredTo",
                                "displayName": "Discharge Port",
                            }],
                            "GridConfig": {
                                "_gridHeight": 230,
                                "_enableRowSelection": true,
                                "_enableRowHeaderSelection": true,
                                "_multiSelect": false,
                                "_exporterCsvFilename": "data",
                                "_exporterPdfFilename": "data",
                                "_enablePaginationControls": false,
                                "_enableGridMenu": false,
                                "_enableColumnMenus": false,
                                "_enableCellSelection": false,
                                "_enableCellEdit": false,
                                "_enableSorting": true,
                                "_useExternalSorting": false,
                                "_useExternalPagination": false,
                                "_isAPI": false,
                                "_rowTemplate": "",
                                "_columnPrefix": "POH_",
                                "_sortColumn": "OrderNo",
                                "_sortType": "ASC",
                                "_pageNumber": 1,
                                "_paginationPageSize": 25,
                                "_paginationPageSizes": [25, 50, 100]
                            }
                        }
                    },
                    "TrackShipmentOrder": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderHeader/FindAll",
                                "FilterID": "ORDHEAD"
                            }
                        },
                        "Meta": {},
                        "Grid": {
                            "ColumnDef": [{
                                "field": "OrderCumSplitNo",
                                "displayName": "Order #",
                                "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",

                            }, {
                                "field": "OrderDate",
                                "displayName": "Order Date",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "Origin",
                                "displayName": "Origin",
                            }, {
                                "field": "RequiredDeliveryDate",
                                "displayName": "Req. Instore",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "RequiredExWorksDate",
                                "displayName": "Req.ExWorks",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "CustomDate1",
                                "displayName": "Custom Date1",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "CustomDate2",
                                "displayName": "Custom Date2",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }],
                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": false,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "rowTemplate": ""
                            }
                        }
                    },
                    "TrackShipmentPackage": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobPackLines/FindAll",
                                "FilterID": "JOBPACK"
                            }
                        },
                        "Grid": {
                            "ColumnDef": [{
                                "field": "PackageCount",
                                "displayName": "Pack Cnt",
                            }, {
                                "field": "F3_NKPackType",
                                "displayName": "Pack Type",
                                "width": "100px",
                            }, {
                                "field": "Length",
                                "displayName": "Length",
                            }, {
                                "field": "Width",
                                "displayName": "Width",
                            }, {
                                "field": "Height",
                                "displayName": "Height",
                            }, {
                                "field": "UnitOfDimension",
                                "displayName": "UD",
                            }, {
                                "field": "ActualWeight",
                                "displayName": "Weight",
                            }, {
                                "field": "ActualWeightUQ",
                                "displayName": "UW",
                                "width": "50px"
                            }, {
                                "field": "ActualVolume",
                                "displayName": "Volume",
                            }, {
                                "field": "ActualVolumeUQ",
                                "displayName": "UV",
                            }, {
                                "field": "Description",
                                "displayName": "Description",
                                "width": "130px",
                            }],
                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": false,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "rowTemplate": ""
                            }
                        }
                    },
                    "TrackShipmentContainer": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/FindAll",
                                "FilterID": "CONTHEAD"
                            }
                        },
                        "Grid": {
                            "ColumnDef": [{
                                "field": "ContainerNo",
                                "displayName": "Container #",
                                "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                            }, {
                                "field": "ContainerMode",
                                "displayName": "Type",
                            }, {
                                "field": "SealNo",
                                "displayName": "Seal1",
                            }, {
                                "field": "SealNo2",
                                "displayName": "Seal2",
                            }],
                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": false,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "rowTemplate": ""
                            }
                        }
                    },
                    "TrackShipmentConsol": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConConsolHeader/FindAll",
                                "FilterID": "CONSHEAD"
                            },
                            "MappingFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConShpMapping/FindAll",
                                "FilterID": "CONSHPMAP"
                            }
                        },
                        "Grid": {
                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": false,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false
                            },
                            "ColumnDef": [{
                                "field": "ConsolNo",
                                "displayName": "Consol #",
                            }, {
                                "field": "TransportMode",
                                "displayName": "Mode",
                            }, {
                                "field": "LegOrder",
                                "displayName": "Leg Order",
                            }, {
                                "field": "TransportType",
                                "displayName": "Transport Type",
                            }, {
                                "field": "Vessel",
                                "displayName": "Vessel",
                            }, {
                                "field": "Voyage Flight",
                                "displayName": "VoyageFlight",
                            }, {
                                "field": "FirstLoadPort",
                                "displayName": "Load Port",
                            }, {
                                "field": "LastDischargePort",
                                "displayName": "Disc Port",
                            }, {
                                "field": "ETD",
                                "displayName": "ETD",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "ATD",
                                "displayName": "ATD",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "ETA",
                                "displayName": "ETA",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "ATA",
                                "displayName": "ATA",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }]
                        }
                    },
                    "RelatedShipment": {
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "API": {
                            "ShipmentAttach": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ShipmentHeader/UpdateRecords"
                            }
                        },
                        "Grid": {
                            "ColumnDef": [{
                                "field": "ShipmentNo",
                                "displayName": "Shipment #",
                                "width": "100px"
                            }, {
                                "field": "ShipmentType",
                                "displayName": "Shipment Type",
                                "width": "100px"
                            }, {
                                "field": "ORG_Consignee_Code",
                                "displayName": "Consignee",
                                "width": "100px"
                            }, {
                                "field": "ORG_Shipper_Code",
                                "displayName": "Shipper",
                                "width": "100px"
                            }, {
                                "field": "Origin",
                                "displayName": "Origin",
                                "width": "100px"
                            }, {
                                "field": "Destination",
                                "displayName": "Destination",
                                "width": "100px"
                            }, {
                                "field": "HouseBill",
                                "displayName": "HBL",
                                "width": "100px"
                            }, {
                                "field": "OuterPackCount",
                                "displayName": "Outer Pac.Count",
                                "width": "100px"
                            }, {
                                "field": "OuterPackType",
                                "displayName": "Outer Pac.Type",
                                "width": "100px"
                            }, {
                                "field": "InnerPackCount",
                                "displayName": "Inner Pac.Count",
                                "width": "100px"
                            }, {
                                "field": "InnerPackType",
                                "displayName": "Inner Pac.Type",
                                "width": "100px"
                            }, {
                                "field": "Weight",
                                "displayName": "Weight",
                                "width": "100px"
                            }, {
                                "field": "UnitOfWeight",
                                "displayName": "UOW",
                                "width": "100px"
                            }, {
                                "field": "Volume",
                                "displayName": "Volume",
                                "width": "100px"
                            }, {
                                "field": "UnitOfVolume",
                                "displayName": "UOV",
                                "width": "100px"
                            }, {
                                "field": "ETD",
                                "displayName": "ETD",
                                "width": "100px",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "ETA",
                                "displayName": "ETA",
                                "width": "100px",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }],
                            /*"GridConfig": {
                                "_gridHeight": 230,
                                "_enableRowSelection": true,
                                "_enableRowHeaderSelection": true,
                                "_multiSelect": false,
                                "_exporterCsvFilename": "data",
                                "_exporterPdfFilename": "data",
                                "_enablePaginationControls": false,
                                "_enableGridMenu": false,
                                "_enableColumnMenus": false,
                                "_enableCellSelection": false,
                                "_enableCellEdit": false,
                                "_enableSorting": true,
                                "_useExternalSorting": false,
                                "_useExternalPagination": false,
                                "width" : "100px"
                                "_isAPI": false,
                                "_rowTemplate": "",
                                "_columnPrefix": "SHP_",
                                "width" : "100px"
                                "_sortColumn": "ShipmentNo",
                                "_sortType": "ASC",
                                "_pageNumber": 1,
                                "width" : "100px"
                                "_paginationPageSize": 25,
                                "_paginationPageSizes": [25, 50, 100]
                            }*/
                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": false,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "rowTemplate": ""
                            }
                        }
                    },
                    "Package": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "PackageCount",
                                "displayName": "Pack Cnt",
                            }, {
                                "field": "F3_NKPackType",
                                "displayName": "Pack Type",
                            }, {
                                "field": "Length",
                                "displayName": "Length",
                            }, {
                                "field": "Width",
                                "displayName": "Width",
                            }, {
                                "field": "Height",
                                "displayName": "Height",
                            }, {
                                "field": "UnitOfDimension",
                                "displayName": "UD",
                            }, {
                                "field": "ActualWeight",
                                "displayName": "Weight",
                            }, {
                                "field": "ActualWeightUQ",
                                "displayName": "UW",
                            }, {
                                "field": "ActualVolume",
                                "displayName": "Volume",
                            }, {
                                "field": "ActualVolumeUQ",
                                "displayName": "UV",
                            }, {
                                "field": "Description",
                                "displayName": "Description",
                            }]
                        }
                    },
                    "ShipmentDangerousGoods": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DGDataItems/FindAll",
                                "FilterID": "DG_DATA"
                            }
                        },
                        "Meta": {},
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                    "field": "DG_NKSubs",
                                    "displayName": "DG_NKSubs",
                                }, {
                                    "field": "IMOClass",
                                    "displayName": "IMO Class",
                                }, {
                                    "field": "DGFlashPoint",
                                    "displayName": "DGFlashPoint",
                                }, {
                                    "field": "DGVolume",
                                    "displayName": "DGVolume",
                                }, {
                                    "field": "UnitOfVolume",
                                    "displayName": "UnitOfVolume",
                                }, {
                                    "field": "DGWeight",
                                    "displayName": "DGWeights",
                                },
                                // {
                                //     "field": "UnitOfWeight",
                                //     "displayName": "UnitOfWeight",
                                // }, {
                                //     "field": "TechnicalName",
                                //     "displayName": "TechnicalName",
                                // }, {
                                //     "field": "MPMarinePollutant",
                                //     "displayName": "MPMarinePollutant",
                                // }, {
                                //     "field": "PackageCount",
                                //     "displayName": "PackageCount",
                                // }, {
                                //     "field": "F3_NKPackType",
                                //     "displayName": "F3_NKPackType",
                                // }
                            ]
                        }
                    },
                    "ShipmentJobLocation": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobPackLocation/FindAll",
                                "FilterID": "JOBPACK"
                            }
                        },
                        "Meta": {},
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "WarehouseLocation",
                                "displayName": "Location",
                            }, {
                                "field": "NoPackages",
                                "displayName": "Packs",
                            }]
                        }

                    },
                    "ShipmentDocumentsTracking": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobRequiredDocument/FindAll",
                                "FilterID": "JOBREQU"
                            }
                        },
                        "Meta": {
                            "DocTypeMasterType": helperService.metaBase(),
                            "PeriodType": helperService.metaBase(),
                            "DocumentUsage": helperService.metaBase()
                        },
                        "Grid": {
                            "ColumnDef": [{
                                "field": "DocCategory",
                                "displayName": "Category",
                            }, {
                                "field": "DocType",
                                "displayName": "Type",
                            }, {
                                "field": "DocPeriod",
                                "displayName": "Period",
                            }, {
                                "field": "DateReceived",
                                "displayName": "DateReceived",
                            }, {
                                "field": "ValidToDate",
                                "displayName": "Valid To Date",
                            }, {
                                "field": "DocNumber",
                                "displayName": "Doc Number",
                            }, {
                                "field": "DocUsage",
                                "displayName": "Usage",
                            }, {
                                "field": "CreditControlDoc",
                                "displayName": "Credit Control",
                            }],
                            "GridConfig": {
                                "_gridHeight": 230,
                                "_enableRowSelection": true,
                                "_enableRowHeaderSelection": true,
                                "_multiSelect": false,
                                "_exporterCsvFilename": "data",
                                "_exporterPdfFilename": "data",
                                "_enablePaginationControls": false,
                                "_enableGridMenu": false,
                                "_enableColumnMenus": false,
                                "_enableCellSelection": false,
                                "_enableCellEdit": false,
                                "_enableSorting": true,
                                "_useExternalSorting": false,
                                "_useExternalPagination": false,
                                "_isAPI": false,
                                "_rowTemplate": "",
                                "_columnPrefix": "DOC_",
                                "_sortColumn": "DocCategory",
                                "_sortType": "ASC",
                                "_pageNumber": 1,
                                "_paginationPageSize": 25,
                                "_paginationPageSizes": [25, 50, 100]
                            }
                        }
                    },

                    "GlobalVar": {
                        "IsOrgMapping": true,
                        "IsShowEditActivityPage": false,
                        "ActivityName": "",
                        "IsActiveShipmentEnable": false,
                        "Input": []
                    }
                }

            };
            if (isNew) {
                _exports.Entities.Header.Data = currentShipment.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentShipment.entity.ShipmentNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Shipment details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentShipment.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentShipment.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: currentShipment.ShipmentNo,
                        code: currentShipment.ShipmentNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }

            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.code).toggleClass("open");
        }

        function GeneralValidation($item) {
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            var _deferred = $q.defer();
            var _obj = {
                ModuleName: ["Shipment"],
                Code: [$item.code],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: "SHP_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                _deferred.resolve(errorWarningService);
            });
            return _deferred.promise;

        }

        function PortsComparison(Str1, Str2) {
            if (!Str1 || !Str2) {
                return false
            }
            if (Str1 && Str2) {
                if (Str1.slice(0, 2) == Str2.slice(0, 2)) {
                    return true
                } else {
                    return false
                }
            }
        }

    }
})();