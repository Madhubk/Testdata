(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVBookingController", SRVBookingController);

    SRVBookingController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVBookingController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */

        var SRVBookingCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("BookingConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVBookingCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView_Booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVBookingCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVBookingCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SRVBookingCtrl.ePage.Masters.StandardMenuConfig = {
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
            SRVBookingCtrl.ePage.Masters.Save = Save;
            SRVBookingCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVBookingCtrl.ePage.Masters.IsDisableSave = false;
            
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVBookingCtrl.ePage.Masters.Entity.Code;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVBookingCtrl.ePage.Masters.Entity.Code) {
                            SRVBookingCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVBookingCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVBookingCtrl.ePage.Masters.Entity.PK,
                            ShipmentNo: SRVBookingCtrl.ePage.Masters.Entity.Code
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVBookingCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVBookingCtrl.ePage.Masters.Entity.PK,
                        ShipmentNo: SRVBookingCtrl.ePage.Masters.Entity.Code
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
                    SRVBookingCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
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
                "ShipmentNo": SRVBookingCtrl.ePage.Masters.Entity.Code
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
                        if (value.label === SRVBookingCtrl.ePage.Masters.Entity.Code) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVBookingCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.Booking;
                            SRVBookingCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        function Save($item) {
            SRVBookingCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            SRVBookingCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIShipmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Shipment').then(function (response) {
                if (response.Status === "success") {
                    var _index = Config.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(SRVBookingCtrl.ePage.Masters.currentShipment);

                    if (_index !== -1) {
                        Config.TabList[_index][Config.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        Config.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                SRVBookingCtrl.ePage.Masters.SaveButtonText = "Save";
                SRVBookingCtrl.ePage.Masters.IsDisableSave = false;
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
