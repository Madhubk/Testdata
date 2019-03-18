(function () {
    "use strict";

    angular
        .module("Application")
        .factory('inwardConfig', InwardConfig);

    InwardConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function InwardConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/InwardHeaderActivityClose/",
                        },
                        "Warehouse": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        },
                        "Summary": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardSummary/FindAll",
                            "FilterID": "WMSINSUM"
                        },
                        "InwardSummary": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventoryByProduct/FindAll",
                            "FilterID": "INVBPRO"
                        },
                        "GetInwardByDate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/GetInwardByDate",
                            "FilterID": "WMSINW"
                        },
                        "GetInwardByClient": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/GetInwardByClient",
                            "FilterID": "WMSINW"
                        },
                        "FindAllInward": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/FindAll",
                            "FilterID": "WMSINW"
                        }
                    },
                    "Meta": {

                    },
                    "Message": false
                }

            },

            "TabList": [],
            "ValidationValues": "",
            "SaveAndClose": false,
            "ProductSummaryList": {},
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
            "ProductSummary": ProductSummary,
        };

        return exports;

        function GetTabDetails(currentInward, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertInward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardList/Insert"
                            },
                            "UpdateInward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardList/Update"
                            },
                            "UpdateInwardProcess": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardList/ProcessUpdate"
                            },
                            "Containers": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderContainer/FindAll",
                                "FilterID": "WMSWORKC"
                            },
                            "References": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderReference/FindAll",
                                "FilterID": "WMSWORKR"
                            },
                            "AllocateLocation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardWorkOrderLine/WmsInwardLineWithLocation/FindAll"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsInwardWorkOrderLine/Delete/"
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
                            "AsnLines": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsAsnLine/FindAll",
                                "FilterID": "WMSASNL"
                            },
                            "AsnLinesDelete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsAsnLine/Delete/",
                                "FilterID": "WMSASNL"
                            },
                            "LineSummary": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsLineSummary/FindAll",
                                "FilterID": "WMSLNSM"
                            },
                            "Inventory": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "Putaway": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WMSProductParamsByWmsAndClient/FindAll",
                                "FilterID": "WMSPPWNC"
                            },
                            "InsertReceiveLine": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsUploadLineItems/Insert"
                            },
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "WmsInwardList/GetById/",
                                "FilterID": "WMSWORK"
                            },
                            "CmpDepartment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CmpDepartment/FindAll",
                                "FilterID": "CMPDEPT"
                            },

                        },

                        "Meta": {
                            "MenuList": [
                                {
                                    "DisplayName": "My Task",
                                    "Value": "MyTask",
                                    "Icon": "menu-icon icomoon icon-my-task",
                                    "IsDisabled": false
                                },
                                {
                                    "DisplayName": "General",
                                    "Value": "General",
                                    "Icon": "fa fa-file",
                                    "GParentRef": "general",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "ASN Lines",
                                    "Value": "AsnLines",
                                    "Icon": "glyphicon glyphicon-indent-left",
                                    "GParentRef": "asnlines",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Receive Lines",
                                    "Value": "ReceiveLines",
                                    "Icon": "glyphicon glyphicon-saved",
                                    "GParentRef": "receivelines",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Product Summary",
                                    "Value": "ProductSummary",
                                    "Icon": "glyphicon glyphicon-list-alt",
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
                                "ExternalReference": helperService.metaBase(),
                                "CustomerReference": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "ArrivalDate": helperService.metaBase(),
                                "WorkOrderSubType": helperService.metaBase(),
                                "UIWmsAsnLine": helperService.metaBase(),
                                "UIWmsWorkOrderLine": helperService.metaBase(),
                                "UIWmsWorkOrderContainer": helperService.metaBase(),
                                "UIWmsWorkOrderReference": helperService.metaBase(),
                                "UIJobServices": helperService.metaBase(),
                                "PutOrPickCompDateTime": helperService.metaBase(),
                                "PutOrPickStartDateTime": helperService.metaBase(),
                            },
                        },
                        "GlobalVariables": {
                            "Loading": false,
                            "NonEditable": false,
                            "Receiveline": false,
                            "PercentageValues": false,
                        },
                        "TableProperties": {
                            "UIWmsWorkOrderContainer": {
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":350
                                },
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
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":170
                                },
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
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":170
                                },
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
                            "ProductSummaryList": {
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":350
                                },
                                "HeaderProperties": [{
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "ssno",
                                    "position": "1",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "sproductcode",
                                    "position": "2",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "sproductdescription",
                                    "position": "3",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Expected Packs",
                                    "isenabled": true,
                                    "property": "expectedpacks",
                                    "position": "4",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Received Packs",
                                    "isenabled": true,
                                    "property": "receivedpacks",
                                    "position": "5",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Expected Quantity",
                                    "isenabled": true,
                                    "property": "expectedqty",
                                    "position": "6",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Received Quantity",
                                    "isenabled": true,
                                    "property": "receivedqty",
                                    "position": "7",
                                    "width": "160",
                                    "display": true
                                },
                                {
                                    "columnname": "Damaged Quantity",
                                    "isenabled": true,
                                    "property": "damagedqty",
                                    "position": "8",
                                    "width": "160",
                                    "display": true
                                }],
                                "ssno": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "40"
                                },
                                "sproductcode": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "100"
                                },
                                "sproductdescription": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "100"
                                },
                                "expectedpacks": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "160"
                                },
                                "receivedpacks": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "160"
                                },
                                "expectedqty": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "160"
                                },
                                "receivedqty": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "160"
                                },
                                "damagedqty": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "160"
                                }
                            },
                            "UIWmsAsnLine": {
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":350
                                },
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "acheckbox",
                                    "position": '1',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "asno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "aproductcode",
                                    "position": "3",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "aproductdescription",
                                    "position": "4",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Commodity",
                                    "isenabled": true,
                                    "property": "acommodity",
                                    "position": "5",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Pack",
                                    "isenabled": true,
                                    "property": "apack",
                                    "position": "6",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Pack UQ",
                                    "isenabled": true,
                                    "property": "apackuq",
                                    "position": "7",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity",
                                    "isenabled": true,
                                    "property": "aquantity",
                                    "position": "8",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity UQ",
                                    "isenabled": true,
                                    "property": "aquantityuq",
                                    "position": "9",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Condition",
                                    "isenabled": true,
                                    "property": "aproductcondition",
                                    "position": "10",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Pallet ID",
                                    "isenabled": true,
                                    "property": "apalletid",
                                    "position": "11",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "audf1",
                                    "position": "12",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "audf2",
                                    "position": "13",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "audf3",
                                    "position": "14",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "apackingdate",
                                    "position": "15",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "aexpirydate",
                                    "position": "16",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Additional Reference1",
                                    "isenabled": true,
                                    "property": "aadditionalreference1",
                                    "position": "17",
                                    "width": "100",
                                    "display": true
                                }],
                                "acheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "45"
                                },
                                "asno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "aproductcode": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "150"
                                },
                                "aproductdescription": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "100"
                                },
                                "acommodity": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "100"
                                },
                                "apack": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "100"
                                },
                                "apackuq": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "100"
                                },
                                "aquantity": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "100"
                                },
                                "aquantityuq": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "100"
                                },
                                "aproductcondition": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "100"
                                },
                                "apalletid": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "100"
                                },
                                "audf1": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "120"
                                },
                                "audf2": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "120"
                                },
                                "audf3": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "120"
                                },
                                "apackingdate": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "120"
                                },
                                "aexpirydate": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "120"
                                },
                                "aadditionalreference1": {
                                    "isenabled": true,
                                    "position": "17",
                                    "width": "100"
                                }
                            },
                            "UIWmsWorkOrderLine": {
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":250
                                },
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
                                    "width": "100",
                                    "display": true
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
                                    "columnname": "Pallet ID",
                                    "isenabled": true,
                                    "property": "rpalletid",
                                    "position": "11",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "rudf1",
                                    "position": "12",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "rudf2",
                                    "position": "13",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "rudf3",
                                    "position": "14",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "rpackingdate",
                                    "position": "15",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "rexpirydate",
                                    "position": "16",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Status",
                                    "isenabled": true,
                                    "property": "rstatus",
                                    "position": "17",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Location",
                                    "isenabled": true,
                                    "property": "rlocation",
                                    "position": "18",
                                    "width": "120",
                                    "display": true
                                },
                                {
                                    "columnname": "Location Status",
                                    "isenabled": true,
                                    "property": "rlocationstatus",
                                    "position": "19",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Area Type",
                                    "isenabled": true,
                                    "property": "rareatype",
                                    "position": "20",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Area Name",
                                    "isenabled": true,
                                    "property": "rareaname",
                                    "position": "21",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Comments",
                                    "isenabled": true,
                                    "property": "rcomments",
                                    "position": "22",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Additional Reference1",
                                    "isenabled": true,
                                    "property": "radditionalreference1",
                                    "position": "23",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Documents",
                                    "isenabled": true,
                                    "property": "rdocuments",
                                    "position": "24",
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
                                "rpalletid": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "100"
                                },
                                "rudf1": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "150"
                                },
                                "rudf2": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "150"
                                },
                                "rudf3": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "150"
                                },
                                "rpackingdate": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "150"
                                },
                                "rexpirydate": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "150"
                                },
                                "rstatus": {
                                    "isenabled": true,
                                    "position": "17",
                                    "width": "100"
                                },
                                "rlocation": {
                                    "isenabled": true,
                                    "position": "18",
                                    "width": "120"
                                },
                                "rlocationstatus": {
                                    "isenabled": true,
                                    "position": "19",
                                    "width": "100"
                                },
                                "rareatype": {
                                    "isenabled": true,
                                    "position": "20",
                                    "width": "100"
                                },
                                "rareaname": {
                                    "isenabled": true,
                                    "position": "21",
                                    "width": "100"
                                },
                                "rcomments": {
                                    "isenabled": true,
                                    "position": "22",
                                    "width": "100"
                                },
                                "radditionalreference1": {
                                    "isenabled": true,
                                    "position": "23",
                                    "width": "100"
                                },
                                "rdocuments": {
                                    "isenabled": true,
                                    "position": "24",
                                    "width": "100"
                                }
                            },
                        }
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentInward.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentInward.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentInward.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentInward.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentInward.WorkOrderID,
                        code: currentInward.WorkOrderID,
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
                "SubModuleCode": "INW"
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

            OnChangeValues(_input.UIWmsInwardHeader.Client, 'E3001', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsInwardHeader.Warehouse, 'E3002', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsInwardHeader.WorkOrderSubType, 'E3004', false, undefined, $item.label);

            //Asn Lines Validation
            if (_input.UIWmsAsnLine.length > 0) {
                angular.forEach(_input.UIWmsAsnLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E3005', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Packs), 'E3006', true, key, $item.label);

                    OnChangeValues(value.PAC_PackType, 'E3007', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Quantity), 'E3030', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E3031', true, key, $item.label);

                    OnChangeValues('value', 'E3040', true, key, $item.label);
                });
            }

            //Check Duplicate
            if (_input.UIWmsAsnLine.length > 1) {
                var finishloop = false;
                for (var i = 0; i < _input.UIWmsAsnLine.length; i++) {
                    for (var j = i + 1; j < _input.UIWmsAsnLine.length; j++) {
                        if (!finishloop) {
                            if ((_input.UIWmsAsnLine[i].POR_FK == _input.UIWmsAsnLine[j].POR_FK) && (_input.UIWmsAsnLine[i].Quantity == _input.UIWmsAsnLine[j].Quantity) && (_input.UIWmsAsnLine[i].Packs == _input.UIWmsAsnLine[j].Packs) && (_input.UIWmsAsnLine[i].PAC_PackType == _input.UIWmsAsnLine[j].PAC_PackType) && (_input.UIWmsAsnLine[i].PartAttrib1 == _input.UIWmsAsnLine[j].PartAttrib1) && (_input.UIWmsAsnLine[i].PartAttrib2 == _input.UIWmsAsnLine[j].PartAttrib2) && (_input.UIWmsAsnLine[i].PartAttrib3 == _input.UIWmsAsnLine[j].PartAttrib3) && (_input.UIWmsAsnLine[i].PackingDate == _input.UIWmsAsnLine[j].PackingDate) && (_input.UIWmsAsnLine[i].ExpiryDate == _input.UIWmsAsnLine[j].ExpiryDate) && (_input.UIWmsAsnLine[i].PalletId == _input.UIWmsAsnLine[j].PalletId) && (_input.UIWmsAsnLine[i].AdditionalRef1Code == _input.UIWmsAsnLine[j].AdditionalRef1Code)) {
                                OnChangeValues(null, 'E3040', true, i, $item.label);
                                OnChangeValues(null, 'E3040', true, j, $item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Receive Lines Validation
            if (_input.UIWmsWorkOrderLine.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E3008', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Packs), 'E3009', true, key, $item.label);

                    OnChangeValues(value.PAC_PackType, 'E3010', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Units), 'E3032', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E3033', true, key, $item.label);

                    OnChangeValues(value.ProductCondition, 'E3049', true, key, $item.label);

                    if (!value.PRO_FK && value.ProductCode || value.PRO_FK && value.ProductCode)
                        OnChangeValues(value.PRO_FK, 'E3046', true, key, $item.label);

                    if (!value.WLO_FK && value.WLO_Location || value.WLO_FK && value.WLO_Location)
                        OnChangeValues(value.WLO_FK, 'E3047', true, key, $item.label);

                    if (!value.IsPartAttrib1ReleaseCaptured) {
                        if (_input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 || _input.UIWmsInwardHeader.IMPartAttrib1Type == 'MAN' && value.UsePartAttrib1 || _input.UIWmsInwardHeader.IMPartAttrib1Type == 'BAT' && value.UsePartAttrib1) {
                            if (!value.PartAttrib1 || value.PartAttrib1)
                                OnChangeValues(value.PartAttrib1, 'E3018', true, key, $item.label);
                        }
                    }

                    if (!value.IsPartAttrib2ReleaseCaptured) {
                        if (_input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 || _input.UIWmsInwardHeader.IMPartAttrib2Type == 'MAN' && value.UsePartAttrib2 || _input.UIWmsInwardHeader.IMPartAttrib2Type == 'BAT' && value.UsePartAttrib2) {
                            if (!value.PartAttrib2 || value.PartAttrib2)
                                OnChangeValues(value.PartAttrib2, 'E3019', true, key, $item.label);
                        }
                    }

                    if (!value.IsPartAttrib3ReleaseCaptured) {
                        if (_input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 || _input.UIWmsInwardHeader.IMPartAttrib3Type == 'MAN' && value.UsePartAttrib3 || _input.UIWmsInwardHeader.IMPartAttrib3Type == 'BAT' && value.UsePartAttrib3) {
                            if (!value.PartAttrib3 || value.PartAttrib3)
                                OnChangeValues(value.PartAttrib3, 'E3020', true, key, $item.label);
                        }
                    }

                    if (value.UsePackingDate) {
                        if (!value.PackingDate || value.PackingDate)
                            OnChangeValues(value.PackingDate, 'E3035', true, key, $item.label);
                    }

                    if (value.UseExpiryDate) {
                        if (!value.ExpiryDate || value.ExpiryDate)
                            OnChangeValues(value.ExpiryDate, 'E3036', true, key, $item.label);
                    }

                    if ((_input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 && parseFloat(value.Units) != 1 && !value.IsPartAttrib1ReleaseCaptured) || (_input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 && parseFloat(value.Units) != 1 && !value.IsPartAttrib2ReleaseCaptured) || (_input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 && parseFloat(value.Units) != 1 && !value.IsPartAttrib3ReleaseCaptured)) {
                        OnChangeValues(null, 'E3038', true, key, $item.label);
                    } else {
                        OnChangeValues('value', 'E3038', true, key, $item.label);
                    }

                    if ((_input.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && (value.UsePartAttrib1 || value.IsPartAttrib1ReleaseCaptured)) || (_input.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && (value.UsePartAttrib2 || value.IsPartAttrib2ReleaseCaptured)) || (_input.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && (value.UsePartAttrib3 || value.IsPartAttrib3ReleaseCaptured))) {
                        if ((parseFloat(value.Units) % 1) != 0) {
                            OnChangeValues(null, "E3063", true, key, $item.label);
                        } else {
                            OnChangeValues('value', "E3063", true, key, $item.label);
                        }
                    }

                    OnChangeValues('value', 'E3021', true, key, $item.label);
                    OnChangeValues('value', 'E3022', true, key, $item.label);
                    OnChangeValues('value', 'E3023', true, key, $item.label);
                });
            }


            //Check Duplicate
            if (_input.UIWmsWorkOrderLine.length > 1) {
                var finishloop = false;

                for (var i = 0; i < _input.UIWmsWorkOrderLine.length; i++) {
                    for (var j = i + 1; j < _input.UIWmsWorkOrderLine.length; j++) {
                        if (!finishloop) {
                            if (!_input.UIWmsWorkOrderLine[j].IsPartAttrib1ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib1 && _input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER') {
                                if (_input.UIWmsWorkOrderLine[j].PartAttrib1) {
                                    if ((_input.UIWmsWorkOrderLine[i].PartAttrib1 == _input.UIWmsWorkOrderLine[j].PartAttrib1) && (_input.UIWmsWorkOrderLine[i].PRO_FK == _input.UIWmsWorkOrderLine[j].PRO_FK)) {
                                        OnChangeValues(null, 'E3021', true, i, $item.label);
                                        OnChangeValues(null, 'E3021', true, j, $item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if (!_input.UIWmsWorkOrderLine[j].IsPartAttrib2ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib2 && _input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER') {
                                if (_input.UIWmsWorkOrderLine[j].PartAttrib2) {
                                    if ((_input.UIWmsWorkOrderLine[i].PartAttrib2 == _input.UIWmsWorkOrderLine[j].PartAttrib2) && (_input.UIWmsWorkOrderLine[i].PRO_FK == _input.UIWmsWorkOrderLine[j].PRO_FK)) {
                                        OnChangeValues(null, 'E3022', true, i, $item.label);
                                        OnChangeValues(null, 'E3022', true, j, $item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if (!_input.UIWmsWorkOrderLine[j].IsPartAttrib3ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib3 && _input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER') {
                                if (_input.UIWmsWorkOrderLine[j].PartAttrib3) {
                                    if ((_input.UIWmsWorkOrderLine[i].PartAttrib3 == _input.UIWmsWorkOrderLine[j].PartAttrib3) && (_input.UIWmsWorkOrderLine[i].PRO_FK == _input.UIWmsWorkOrderLine[j].PRO_FK)) {
                                        OnChangeValues(null, 'E3023', true, i, $item.label);
                                        OnChangeValues(null, 'E3023', true, j, $item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                        }
                    }
                }
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

        //Get Product SummaryList
        function ProductSummary(item) {
            var _filter = {
                "WOD_FK": item.Data.PK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": item.API.LineSummary.FilterID
            };

            apiService.post("eAxisAPI", item.API.LineSummary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var myvalue = angular.copy(item.Data.PK);
                    exports.ProductSummaryList[myvalue] = response.data.Response;
                }
            });
        }
    }
})();


