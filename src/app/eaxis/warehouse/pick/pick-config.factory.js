(function () {
    "use strict";

    angular
        .module("Application")
        .factory('pickConfig', PickConfig);

    PickConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function PickConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickList/GetById/"
                        },
                        "InsertPick": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickList/Insert"
                        },
                        "UpdatePick": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickList/Update"
                        },
                        "OutwardGetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/GetById/",
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickList/PickHeaderActivityClose/",
                        },
                    },
                    "Meta": {


                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ValidationValues": "",
            "SaveAndClose": false,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall

        };

        return exports;

        function GetTabDetails(currentPick, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertPick": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickList/Insert"
                            },
                            "UpdatePick": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickList/Update"
                            },
                            "Inventory": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsOutwardWorkOrderLine/Delete/"
                            },
                            "AllocateStock": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickList/WmsAllocateStock",
                            },
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Details",
                                "Value": "Details",
                                "Icon": "fa fa-info-circle",
                                "GParentRef": "details"
                            }, {
                                "DisplayName": "Pick Allocation",
                                "Value": "PickAllocation",
                                "Icon": "fa fa-suitcase",
                                "GParentRef": "pickallocation"
                            }, {
                                "DisplayName": "Pick Slip",
                                "Value": "PickSlip",
                                "Icon": "fa fa-list-alt",
                                "GParentRef": "pickslip"
                            }, {
                                "DisplayName": "Documents",
                                "Value": "Documents",
                                "Icon": "fa fa-file-pdf-o",
                            }],
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "PickNo": helperService.metaBase(),
                                "PickOption": helperService.metaBase(),
                                "WarehouseCode": helperService.metaBase(),
                                "PickedQty": helperService.metaBase(),
                                "UIWmsPickLineSummary": helperService.metaBase()
                            },
                        },
                        "GlobalVariables": {
                            "NonEditable": false,
                            "Loading": false,
                            "FetchingInventoryDetails": false,
                            "MiscServDetails": []
                        },
                        "TableProperties": {
                            "UIWmsOutward": {
                                "HeaderProperties": [{
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "osno",
                                    "position": "1",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Outward No",
                                    "isenabled": true,
                                    "property": "ooutwardno",
                                    "position": "2",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Warehouse",
                                    "isenabled": true,
                                    "property": "owarehouse",
                                    "position": "3",
                                    "width": "200",
                                    "display": true
                                },
                                {
                                    "columnname": "Client",
                                    "isenabled": true,
                                    "property": "oclient",
                                    "position": "4",
                                    "width": "200",
                                    "display": true
                                },
                                {
                                    "columnname": "Consignee",
                                    "isenabled": true,
                                    "property": "oconsignee",
                                    "position": "5",
                                    "width": "200",
                                    "display": true
                                },
                                {
                                    "columnname": "Order No",
                                    "isenabled": true,
                                    "property": "oorderno",
                                    "position": "6",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Outward Type",
                                    "isenabled": true,
                                    "property": "ooutwardtype",
                                    "position": "7",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Status",
                                    "isenabled": true,
                                    "property": "ostatus",
                                    "position": "8",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Required Date",
                                    "isenabled": true,
                                    "property": "orequireddate",
                                    "position": "9",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Finalized Date",
                                    "isenabled": true,
                                    "property": "ofinalizeddate",
                                    "position": "10",
                                    "width": "100",
                                    "display": true
                                }],
                                "osno": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "40"
                                },
                                "ooutwardno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "100"
                                },
                                "owarehouse": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "200"
                                },
                                "oclient": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "200"
                                },
                                "oconsignee": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "200"
                                },
                                "oorderno": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "150"
                                },
                                "ooutwardtype": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "100"
                                },
                                "ostatus": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "100"
                                },
                                "orequireddate": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "100"
                                },
                                "ofinalizeddate": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "100"
                                }
                            },
                            "UIWmsPickLineSummary": {
                                "HeaderProperties": [{
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "ssno",
                                    "position": "1",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Client",
                                    "isenabled": true,
                                    "property": "sclient",
                                    "position": "2",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "sproductcode",
                                    "position": "3",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "sproductdescription",
                                    "position": "4",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Packs",
                                    "isenabled": true,
                                    "property": "spacks",
                                    "position": "5",
                                    "width": "40",
                                    "display": true
                                },
                                {
                                    "columnname": "Pack Type",
                                    "isenabled": true,
                                    "property": "spacktype",
                                    "position": "6",
                                    "width": "60",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity",
                                    "isenabled": true,
                                    "property": "squantity",
                                    "position": "7",
                                    "width": "40",
                                    "display": true
                                },
                                {
                                    "columnname": "Quanity UQ",
                                    "isenabled": true,
                                    "property": "squantityuq",
                                    "position": "8",
                                    "width": "60",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Condition",
                                    "isenabled": true,
                                    "property": "sproductcondition",
                                    "position": "9",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Location",
                                    "isenabled": true,
                                    "property": "slocation",
                                    "position": "10",
                                    "width": "70",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "sudf1",
                                    "position": "11",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "sudf2",
                                    "position": "12",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "sudf3",
                                    "position": "13",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "spackingdate",
                                    "position": "14",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "sexpirydate",
                                    "position": "15",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Picked Date Time",
                                    "isenabled": true,
                                    "property": "spickedqty",
                                    "position": "16",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Picked Qty",
                                    "isenabled": true,
                                    "property": "spickeddatetime",
                                    "position": "17",
                                    "width": "150",
                                    "display": true
                                }],
                                "ssno": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "40"
                                },
                                "sclient": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "150"
                                },
                                "sproductcode": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "100"
                                },
                                "sproductdescription": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "100"
                                },
                                "spacks": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "40"
                                },
                                "spacktype": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "60"
                                },
                                "squantity": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "40"
                                },
                                "squantityuq": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "60"
                                },
                                "sproductcondition": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "80"
                                },
                                "slocation": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "70"
                                },
                                "sudf1": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "100"
                                },
                                "sudf2": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "100"
                                },
                                "sudf3": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "100"
                                },
                                "spackingdate": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "80"
                                },
                                "sexpirydate": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "80"
                                },
                                "spickedqty": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "150"
                                },
                                "spickeddatetime": {
                                    "isenabled": true,
                                    "position": "17",
                                    "width": "100"
                                },

                            },
                            "UIWmsOutwardLines": {
                                "HeaderProperties": [{
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "lsno",
                                    "position": "1",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Client",
                                    "isenabled": true,
                                    "property": "lclient",
                                    "position": "2",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "lproductcode",
                                    "position": "3",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "lproductdescription",
                                    "position": "4",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Packs",
                                    "isenabled": true,
                                    "property": "lpacks",
                                    "position": "5",
                                    "width": "50",
                                    "display": true
                                },
                                {
                                    "columnname": "Packs UQ",
                                    "isenabled": true,
                                    "property": "lpacksuq",
                                    "position": "6",
                                    "width": "70",
                                    "display": true
                                },
                                {
                                    "columnname": "UQ",
                                    "isenabled": true,
                                    "property": "luq",
                                    "position": "7",
                                    "width": "60",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Condition",
                                    "isenabled": true,
                                    "property": "lproductcondition",
                                    "position": "8",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Ordered Qty",
                                    "isenabled": true,
                                    "property": "lorderedqty",
                                    "position": "9",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Shortfall Qty",
                                    "isenabled": true,
                                    "property": "lshortfallqty",
                                    "position": "10",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Allocated Qty",
                                    "isenabled": true,
                                    "property": "lallocatedqty",
                                    "position": "11",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "ludf1",
                                    "position": "12",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "ludf2",
                                    "position": "13",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "ludf3",
                                    "position": "14",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "lpackingdate",
                                    "position": "15",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "lexpirydate",
                                    "position": "16",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Status",
                                    "isenabled": true,
                                    "property": "lstatus",
                                    "position": "17",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Outward No",
                                    "isenabled": true,
                                    "property": "lorderno",
                                    "position": "18",
                                    "width": "100",
                                    "display": true
                                }],
                                "lsno": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "40"
                                },
                                "lclient": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "150"
                                },
                                "lproductcode": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "100"
                                },
                                "lproductdescription": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "100"
                                },
                                "lpacks": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "50"
                                },
                                "lpacksuq": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "70"
                                },
                                "luq": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "60"
                                },
                                "lproductcondition": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "80"
                                },
                                "lorderedqty": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "80"
                                },
                                "lshortfallqty": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "80"
                                },
                                "lallocatedqty": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "80"
                                },
                                "ludf1": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "100"
                                },
                                "ludf2": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "100"
                                },
                                "ludf3": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "100"
                                },
                                "lpackingdate": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "100"
                                },
                                "lexpirydate": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "100"
                                },
                                "lstatus": {
                                    "isenabled": true,
                                    "position": "17",
                                    "width": "100"
                                },
                                "lorderno": {
                                    "isenabled": true,
                                    "position": "18",
                                    "width": "100"
                                }
                            },
                            "PickInventoryList": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "icheckbox",
                                    "position": '1',
                                    "width": "80",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "isno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "iproductcode",
                                    "position": "3",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "iproductdescription",
                                    "position": "4",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Location",
                                    "isenabled": true,
                                    "property": "ilocation",
                                    "position": "5",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Allocated Qty",
                                    "isenabled": true,
                                    "property": "iallocatedqty",
                                    "position": "6",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "In Location Qty",
                                    "isenabled": true,
                                    "property": "iinlocationqty",
                                    "position": "7",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Available To Pick",
                                    "isenabled": true,
                                    "property": "iavailabletopick",
                                    "position": "8",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Committed Qty",
                                    "isenabled": true,
                                    "property": "icommittedqty",
                                    "position": "9",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Reserved Qty",
                                    "isenabled": true,
                                    "property": "ireservedqty",
                                    "position": "10",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "InTransit Qty",
                                    "isenabled": true,
                                    "property": "iinstransitqty",
                                    "position": "11",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Total Qty",
                                    "isenabled": true,
                                    "property": "itotalqty",
                                    "position": "12",
                                    "width": "80",
                                    "display": true
                                },
                                {
                                    "columnname": "Inventory Status",
                                    "isenabled": true,
                                    "property": "iinventorystatus",
                                    "position": "13",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Location Status",
                                    "isenabled": true,
                                    "property": "ilocationstatus",
                                    "position": "14",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Arrival Date",
                                    "isenabled": true,
                                    "property": "iarrivaldate",
                                    "position": "15",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "iudf1",
                                    "position": "16",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "iudf2",
                                    "position": "17",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "iudf3",
                                    "position": "18",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "ipackingdate",
                                    "position": "19",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "iexpirydate",
                                    "position": "20",
                                    "width": "100",
                                    "display": true
                                }],
                                "icheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "80"
                                },
                                "isno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "iproductcode": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "100"
                                },
                                "iproductdescription": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "100"
                                },
                                "ilocation": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "100"
                                },
                                "iallocatedqty": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "100"
                                },
                                "iinlocationqty": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "80"
                                },
                                "iavailabletopick": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "80"
                                },
                                "icommittedqty": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "80"
                                },
                                "ireservedqty": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "80"
                                },
                                "iinstransitqty": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "80"
                                },
                                "itotalqty": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "80"
                                },
                                "iinventorystatus": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "100"
                                },
                                "ilocationstatus": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "100"
                                },
                                "iarrivaldate": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "100"
                                },
                                "iudf1": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "100"
                                },
                                "iudf2": {
                                    "isenabled": true,
                                    "position": "17",
                                    "width": "100"
                                },
                                "iudf3": {
                                    "isenabled": true,
                                    "position": "18",
                                    "width": "100"
                                },
                                "ipackingdate": {
                                    "isenabled": true,
                                    "position": "19",
                                    "width": "100"
                                },
                                "iexpirydate": {
                                    "isenabled": true,
                                    "position": "20",
                                    "width": "100"
                                }
                            },
                        }
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentPick.data;
                _exports.Entities.Header.GetById = currentPick.data;
                _exports.Entities.Header.Validations = currentPick.Validations;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentPick.entity.PickNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentPick.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentPick.PickNo]: {
                            ePage: _exports
                        },
                        label: currentPick.PickNo,
                        code: currentPick.PickNo,
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
                "SubModuleCode": "WPK"
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
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            OnChangeValues(_input.UIWmsPickHeader.PickNo, 'E8001', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsPickHeader.PickOption, 'E8002', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsPickHeader.WarehouseCode, 'E8003', false, undefined, $item.label);

        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex, label) {
            angular.forEach(exports.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label);
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label) {
            if (IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), label, undefined, undefined, undefined, undefined, undefined, undefined);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), label);
                }
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), label);
            });
        }
    }
})();


