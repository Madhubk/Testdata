(function () {
    "use strict";

    angular
        .module("Application")
        .factory("outwardConfig", OutwardConfig);

    OutwardConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function OutwardConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                        "Summary": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardSummary/FindAll",
                            "FilterID": "WMSOUTSUM"
                        },
                        "Warehouse": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        },
                        "GetOutwardByDate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/GetOutwardByDate",
                            "FilterID": "WMSOUT"
                        },
                        "GetOutwardByClient": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/GetOutwardByClient",
                            "FilterID": "WMSOUT"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/OutwardHeaderActivityClose/",
                        },
                        "WmsPickInsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickList/Insert",
                        },
                        "WmsBatchUploadFiles": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsBatchUploadFiles/UploadFile"
                        },
                    },
                    "Meta": {

                    },
                    "Message": false
                }

            },
            "TabList": [],
            "ValidationValues": "",
            "IsSaveManifest": false,
            "SaveAndClose": false,
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
        };

        return exports;

        function GetTabDetails(currentOutward, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertOutward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsOutwardList/Insert"
                            },
                            "UpdateOutward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsOutwardList/Update"
                            },
                            "References": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderReference/FindAll",
                                "FilterID": "WMSWORKR"
                            },
                            "Containers": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderContainer/FindAll",
                                "FilterID": "WMSWORKC"
                            },
                            "ContainerDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderContainer/Delete/"
                            },
                            "ReferenceDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderReference/Delete/"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsOutwardWorkOrderLine/Delete/"
                            },
                            "LineSummary": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderLineSummary/FindAll",
                                "FilterID": "WMSWLS"
                            },
                            "InsertLine": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsUploadLineItems/Insert"
                            },
                            "MstContainer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstContainer/FindAll",
                                "FilterID": "MSTCONT"
                            },
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "My Task",
                                "Value": "MyTask",
                                "Icon": "menu-icon icomoon icon-my-task",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa fa-file",
                                "GParentRef": "general",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Line",
                                "Value": "Line",
                                "Icon": "glyphicon glyphicon-list-alt",
                                "GParentRef": "line",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Pick",
                                "Value": "Pick",
                                "Icon": "icomoon icon-pick",
                                "GParentRef": "pick",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Dispatch",
                                "Value": "Dispatch",
                                "Icon": "fa fa-truck",
                                "GParentRef": "dispatch",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Containers",
                                "Value": "Containers",
                                "Icon": "fa fa-truck",
                                "GParentRef": "containers",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "References & Services",
                                "Value": "References & Services",
                                "Icon": "fa fa-pencil-square-o",
                                "GParentRef": "referencesandserivces",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Documents",
                                "Value": "Documents",
                                "Icon": "fa fa-file-pdf-o",
                                "IsDisabled": false

                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Client": helperService.metaBase(),
                                "CustomerReference": helperService.metaBase(),
                                "ExternalReference": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "RequiredDate": helperService.metaBase(),
                                "TransferWarehouse": helperService.metaBase(),
                                "UIWmsWorkOrderLine": helperService.metaBase(),
                                "UIWmsWorkOrderContainer": helperService.metaBase(),
                                "UIWmsWorkOrderReference": helperService.metaBase(),
                                "UIJobServices": helperService.metaBase(),
                                "TransporterCode": helperService.metaBase(),
                                "ManifestType": helperService.metaBase(),
                                "VehicleTypeCode": helperService.metaBase(),
                                "LoadType": helperService.metaBase(),
                                "TransportMode": helperService.metaBase(),
                                "TransportRefNo": helperService.metaBase(),
                                "VehicleNo": helperService.metaBase(),
                                "DriveName": helperService.metaBase(),
                                "DriverContactNo": helperService.metaBase(),
                                "EstimatedDeliveryDate": helperService.metaBase(),
                                "EstimatedDispatchDate": helperService.metaBase()
                            },
                        },
                        "GlobalVariables": {
                            "Loading": false,
                            "NonEditable": false,
                            "PercentageValues": false,
                        },
                        "TableProperties": {
                            "UIWmsWorkOrderContainer": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "containercheckbox",
                                    "position": '1',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "containersno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Container No",
                                    "isenabled": true,
                                    "property": "containerno",
                                    "position": "3",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Seal No",
                                    "isenabled": true,
                                    "property": "sealno",
                                    "position": "4",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Type",
                                    "isenabled": true,
                                    "property": "type",
                                    "position": "5",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Chargeable",
                                    "isenabled": true,
                                    "property": "chargeable",
                                    "position": "6",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Palletized",
                                    "isenabled": true,
                                    "property": "palletized",
                                    "position": "7",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Items Count",
                                    "isenabled": true,
                                    "property": "items",
                                    "position": "8",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Pallets Count",
                                    "isenabled": true,
                                    "property": "pallets",
                                    "position": "9",
                                    "width": "120",
                                    "display": true
                                }],
                                "containercheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "45"
                                },
                                "containersno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "containerno": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "160"
                                },
                                "sealno": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "160"
                                },
                                "type": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "160"
                                },
                                "chargeable": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "120"
                                },
                                "palletized": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "120"
                                },
                                "items": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "120"
                                },
                                "pallets": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "120"
                                },
                            },
                            "UIWmsWorkOrderReference": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "referencecheckbox",
                                    "position": '1',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "referencesno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Reference Type",
                                    "isenabled": true,
                                    "property": "referencetype",
                                    "position": "3",
                                    "width": "470",
                                    "display": true
                                },
                                {
                                    "columnname": "Reference",
                                    "isenabled": true,
                                    "property": "reference",
                                    "position": "4",
                                    "width": "470",
                                    "display": true
                                }],
                                "referencecheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "45",
                                },
                                "referencesno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "referencetype": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "470"
                                },
                                "reference": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "470"
                                }
                            },
                            "UIJobServices": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "servicecheckbox",
                                    "position": '1',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "servicesno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Type",
                                    "isenabled": true,
                                    "property": "servicetype",
                                    "position": "3",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Date Booked",
                                    "isenabled": true,
                                    "property": "datebooked",
                                    "position": "4",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Completed Date",
                                    "isenabled": true,
                                    "property": "completeddate",
                                    "position": "5",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Contractor",
                                    "isenabled": true,
                                    "property": "contractor",
                                    "position": "6",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Count",
                                    "isenabled": true,
                                    "property": "count",
                                    "position": "7",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Service Location",
                                    "isenabled": true,
                                    "property": "servicelocation",
                                    "position": "8",
                                    "width": "160",
                                    "display": true
                                }],
                                "servicecheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "45"
                                },
                                "servicesno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "servicetype": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "160"
                                },
                                "datebooked": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "160"
                                },
                                "completeddate": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "160"
                                },
                                "contractor": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "160"
                                },
                                "count": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "160"
                                },
                                "servicelocation": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "160"
                                }
                            },
                            "UIWmsWorkOrderLine": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "rcheckbox",
                                    "position": '1',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "rsno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "rproductcode",
                                    "position": "3",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "rproductdescription",
                                    "position": "4",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Commodity",
                                    "isenabled": true,
                                    "property": "rcommodity",
                                    "position": "5",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Pack",
                                    "isenabled": true,
                                    "property": "rpack",
                                    "position": "6",
                                    "width": "100", "display": true
                                },
                                {
                                    "columnname": "Pack UQ",
                                    "isenabled": true,
                                    "property": "rpackuq",
                                    "position": "7",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity",
                                    "isenabled": true,
                                    "property": "rquantity",
                                    "position": "8",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity UQ",
                                    "isenabled": true,
                                    "property": "rquantityuq",
                                    "position": "9",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Condition",
                                    "isenabled": true,
                                    "property": "rproductcondition",
                                    "position": "10",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity Met",
                                    "isenabled": true,
                                    "property": "rquantitymet",
                                    "position": "11",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Shortfall Qty",
                                    "isenabled": true,
                                    "property": "rshortfallqty",
                                    "position": "12",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Reserved Qty",
                                    "isenabled": true,
                                    "property": "rreservedqty",
                                    "position": "13",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Comment",
                                    "isenabled": true,
                                    "property": "rcomment",
                                    "position": "14",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "rudf1",
                                    "position": "15",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "rudf2",
                                    "position": "16",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "rudf3",
                                    "position": "17",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "rpackingdate",
                                    "position": "18",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "rexpirydate",
                                    "position": "19",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Additional Reference1",
                                    "isenabled": true,
                                    "property": "radditionalreference1",
                                    "position": "20",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Documents",
                                    "isenabled": true,
                                    "property": "rdocuments",
                                    "position": "21",
                                    "width": "100",
                                    "display": true
                                }],
                                "rcheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "45"
                                },
                                "rsno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "rproductcode": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "150"
                                },
                                "rproductdescription": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "100"
                                },
                                "rcommodity": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "100"
                                },
                                "rpack": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "100"
                                },
                                "rpackuq": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "100"
                                },
                                "rquantity": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "100"
                                },
                                "rquantityuq": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "100"
                                },
                                "rproductcondition": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "150"
                                },
                                "rquantitymet": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "100"
                                },
                                "rshortfallqty": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "100"
                                },
                                "rreservedqty": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "100"
                                },
                                "rcomment": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "100"
                                },
                                "rudf1": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "150"
                                },
                                "rudf2": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "150"
                                },
                                "rudf3": {
                                    "isenabled": true,
                                    "position": "17",
                                    "width": "150"
                                },
                                "rpackingdate": {
                                    "isenabled": true,
                                    "position": "18",
                                    "width": "150"
                                },
                                "rexpirydate": {
                                    "isenabled": true,
                                    "position": "19",
                                    "width": "150"
                                },
                                "radditionalreference1": {
                                    "isenabled": true,
                                    "position": "20",
                                    "width": "100"
                                },
                                "rdocuments": {
                                    "isenabled": true,
                                    "position": "21",
                                    "width": "100"
                                }
                            },
                            "UIWmsPickLine": {
                                "HeaderProperties": [{
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "psno",
                                    "position": "1",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Client",
                                    "isenabled": true,
                                    "property": "pclient",
                                    "position": "2",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "pproductcode",
                                    "position": "3",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "pproductdescription",
                                    "position": "4",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Units",
                                    "isenabled": true,
                                    "property": "punits",
                                    "position": "5",
                                    "width": "60",
                                    "display": true
                                },
                                {
                                    "columnname": "UQ",
                                    "isenabled": true,
                                    "property": "puq",
                                    "position": "6",
                                    "width": "60",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Condition",
                                    "isenabled": true,
                                    "property": "pproductcondition",
                                    "position": "7",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Location",
                                    "isenabled": true,
                                    "property": "plocation",
                                    "position": "8",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "pudf1",
                                    "position": "9",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "pudf2",
                                    "position": "10",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "pudf3",
                                    "position": "11",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "ppackingdate",
                                    "position": "12",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "pexpirydate",
                                    "position": "13",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Picked Date Time",
                                    "isenabled": true,
                                    "property": "ppickeddatetime",
                                    "position": "14",
                                    "width": "100",
                                    "display": true
                                }],
                                "psno": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "40"
                                },
                                "pclient": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "150"
                                },
                                "pproductcode": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "100"
                                },
                                "pproductdescription": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "100"
                                },
                                "punits": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "60"
                                },
                                "puq": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "60"
                                },
                                "pproductcondition": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "80"
                                },
                                "plocation": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "100"
                                },
                                "pudf1": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "100"
                                },
                                "pudf2": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "100"
                                },
                                "pudf3": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "100"
                                },
                                "ppackingdate": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "100"
                                },
                                "pexpirydate": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "100"
                                },
                                "ppickeddatetime": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "100"
                                }
                            },
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentOutward.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentOutward.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentOutward.PK).then(function (response) {
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentOutward.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentOutward.WorkOrderID,
                        code: currentOutward.WorkOrderID,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }
        function PushErrorWarning(Code, Message, MessageType, IsAlert, MetaObject, EntityObject, IsArray, RowIndex, ColIndex, DisplayName, ParentRef, GParentRef) {
            if (Code) {
                var _obj = {
                    "Code": Code,
                    "Message": Message,
                    "MessageType": MessageType,
                    "IsAlert": IsAlert,
                    "MetaObject": MetaObject,
                    "ParentRef": ParentRef,
                    "GParentRef": GParentRef
                };

                if (IsArray) {
                    _obj.RowIndex = RowIndex;
                    _obj.ColIndex = ColIndex;
                    _obj.DisplayName = DisplayName;
                    _obj.Message = Message + ' In Line No ' + (RowIndex + 1);
                }

                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {

                    if (!IsArray) {
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            return value.Code == Code;
                        });
                    } else {
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            if (value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
                                return true;
                        });
                    }

                    if (!_isExistGlobal) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.push(_obj);
                    }

                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsArray = IsArray;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ParentRef = ParentRef;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].GParentRef = GParentRef;

                    if (MessageType === "W") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = true;

                        if (!IsArray) {
                            var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        } else {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if (val.Code == Code && val.RowIndex == RowIndex && val.ColIndex == ColIndex)
                                    return val.Code;
                            }).indexOf(Code);
                        }

                        if (_indexWarning === -1) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.push(_obj);
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING[_indexWarning] = _obj;
                        }

                        if (IsAlert) {
                            toastr.warning(Code, Message);
                        }
                    } else if (MessageType === "E") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = true;

                        if (!IsArray) {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        } else {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if (val.Code == Code && val.RowIndex == RowIndex && val.ColIndex == ColIndex)
                                    return val.Code;
                            }).indexOf(Code);
                        }

                        if (_indexError === -1) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.push(_obj);
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR[_indexError] = _obj;
                        }

                        if (IsAlert) {
                            toastr.error(Code, Message);
                        }
                    }
                }
            }
        }

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject, IsArray, RowIndex, ColIndex) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    if (!IsArray) {
                        var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                            return value.Code;
                        }).indexOf(Code);
                    } else {
                        var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                            if (value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
                                return value.Code;
                        }).indexOf(Code);
                    }


                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
                        if (!IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                    if (value.Code === Code) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR = [];
                            }
                        } else if (IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                    if (value.Code == Code && value.ColIndex == ColIndex && value.RowIndex == RowIndex) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR = [];
                            }
                        }
                    } else if (MessageType === "W") {
                        if (!IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                    if (value.Code == Code) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING = [];
                            }
                        } else if (IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                    if (value.Code == Code && value.ColIndex == ColIndex && value.RowIndex == RowIndex) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING = [];
                            }
                        }
                    }
                }
            }
        }

        function GetErrorWarningCountParent(ParentId, EntityObject, Type, ParentType) {
            var _parentList = [];
            var _index = exports.TabList.map(function (value, key) {
                return value.label;
            }).indexOf(EntityObject);

            if (_index !== -1) {
                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value1, key1) {
                    // ParentIdList.map(function (value2, key2) {
                    if (ParentType == "GParent") {
                        if (value1.GParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    } else if (ParentType == "Parent") {
                        if (value1.ParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    }
                    // });
                });
            }
            return _parentList;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
            if (EntityObject[EntityObject.label].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.length == 0) {
                $("#errorWarningContainer" + EntityObject.label).removeClass("open");
            }
        }

        // Validations
        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode": "OUT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues = (response.data.Response);
                }
            });
        }

        function GeneralValidation($item) {
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            OnChangeValues(_input.UIWmsOutwardHeader.Client, 'E3501', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsOutwardHeader.Warehouse, 'E3502', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsOutwardHeader.RequiredDate, 'E3503', false, undefined, $item.label);

            if (_input.UIWmsOutwardHeader.WorkOrderSubType == "MTR") {
                OnChangeValues(_input.UIWmsOutwardHeader.TransferWarehouse, 'E3542', false, undefined, $item.label);
            } else {
                OnChangeValues('value', 'E3542', false, undefined, $item.label);
            }
            // Manifest Validation
            if (_input.UIWmsOutwardHeader.AdditionalRef1Code) {
                var _ManifestDetails = $item[$item.label].ePage.Entities.Header.ManifestDetails;
                if (_ManifestDetails) {
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.TransporterCode, 'E3064', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.ManifestType, 'E3065', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.VehicleTypeCode, 'E3066', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.LoadType, 'E3067', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.TransportMode, 'E3068', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.TransportRefNo, 'E3069', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.VehicleNo, 'E3070', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.DriveName, 'E3071', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.DriverContactNo, 'E3072', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.EstimatedDispatchDate, 'E3073', false, undefined, $item.label);
                    OnChangeValues(_ManifestDetails.TmsManifestHeader.EstimatedDeliveryDate, 'E3074', false, undefined, $item.label);
                }
            }

            //Receive Lines Validation
            if (_input.UIWmsWorkOrderLine.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E3504', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Packs), 'E3505', true, key, $item.label);

                    OnChangeValues(value.PAC_PackType, 'E3506', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Units), 'E3520', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E3521', true, key, $item.label);

                    OnChangeValues(value.ProductCondition, 'E3543', true, key, $item.label);

                    if (!value.PRO_FK && value.ProductCode || value.PRO_FK && value.ProductCode)
                        OnChangeValues(value.PRO_FK, 'E3530', true, key, $item.label);
                });
            }

            //Containers Validation
            if (_input.UIWmsWorkOrderContainer.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderContainer, function (value, key) {
                    OnChangeValues(value.ContainerNumber, 'E3013', true, key, $item.label);

                    OnChangeValues(value.Type, 'E3014', true, key, $item.label);

                });
            }

            //Containers Validation
            if (_input.UIWmsWorkOrderReference.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderReference, function (value, key) {
                    OnChangeValues(value.RefType, 'E3015', true, key, $item.label);

                    OnChangeValues(value.Reference, 'E3016', true, key, $item.label);

                });
            }

            //Services Validation
            if (_input.UIJobServices.length > 0) {
                angular.forEach(_input.UIJobServices, function (value, key) {
                    OnChangeValues(value.ServiceCode, 'E3017', true, key, $item.label);
                });
            }


        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex, label) {
            angular.forEach(exports.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label);
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label) {
            if (!IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, undefined, undefined, undefined, undefined, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
            });
        }
    }
})();


