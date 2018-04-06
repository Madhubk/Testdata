(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVShipmentController", SRVShipmentController);

    SRVShipmentController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVShipmentController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVShipmentCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("shipmentConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVShipmentCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVShipmentCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SRVShipmentCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true,
                "data-event": true
            };
             // Save
            SRVShipmentCtrl.ePage.Masters.Save = Save;
            SRVShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVShipmentCtrl.ePage.Masters.IsDisableSave = false;
            
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVShipmentCtrl.ePage.Masters.Entity.Code;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVShipmentCtrl.ePage.Masters.Entity.Code) {
                            SRVShipmentCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVShipmentCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVShipmentCtrl.ePage.Masters.Entity.PK,
                            ShipmentNo: SRVShipmentCtrl.ePage.Masters.Entity.Code
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVShipmentCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVShipmentCtrl.ePage.Masters.Entity.PK,
                        ShipmentNo: SRVShipmentCtrl.ePage.Masters.Entity.Code
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    SRVShipmentCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetRecordDetails() {
            var _api = "ShipmentHeader/FindAll";
            var _filter = {
                "SortColumn": "SHP_ShipmentNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 5,
                "ShipmentNo": SRVShipmentCtrl.ePage.Masters.Entity.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "SHIPHEAD"
            };
            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVShipmentCtrl.ePage.Masters.Entity.Code) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVShipmentCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        function Save($item) {
            SRVShipmentCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            SRVShipmentCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            // Change True/false to 0 o/1 in billing Tab
            // if (_input.UIJobHeaders[0].JobBufferPercentOverride == true) {
            //     _input.UIJobHeaders[0].JobBufferPercentOverride = 1;
            // } else {
            //     _input.UIJobHeaders[0].JobBufferPercentOverride = 0;
            // }

            // Push addresslist to jobaddress
            var _array = [];
            for (var i in _Data.Header.Meta.AddressContactObject) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Meta.AddressContactObject[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });

            var _isEmpty = angular.equals({}, _Data.Header.Meta.AddressContactObject);
            if (_isEmpty) {
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_FK = _Data.Header.Meta.AddressContactObject.PAG.PK;
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_Code = _Data.Header.Meta.AddressContactObject.PAG.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.PickupFrom_FK = _Data.Header.Meta.AddressContactObject.CRG.PK;
                _Data.Header.Data.UIShipmentHeader.PickupFromCode = _Data.Header.Meta.AddressContactObject.CRG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.PickupFromAddress_FK = _Data.Header.Meta.AddressContactObject.CRG.OAD_Address_FK;

                _Data.Header.Data.UIShipmentHeader.DeliveryTo_FK = _Data.Header.Meta.AddressContactObject.CEG.PK;
                _Data.Header.Data.UIShipmentHeader.DeliveryToCode = _Data.Header.Meta.AddressContactObject.CEG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.DeliveryToAddress_FK = _Data.Header.Meta.AddressContactObject.CEG.OAD_Address_FK;
            }

            if ($item.isNew) {
                _input.UIShipmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Shipment').then(function (response) {
                if (response.Status === "success") {
                    var _index = Config.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(SRVShipmentCtrl.ePage.Masters.currentShipment);

                    if (_index !== -1) {
                        Config.TabList[_index][Config.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        Config.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                SRVShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
                SRVShipmentCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
     
        Init();
    }
})();
