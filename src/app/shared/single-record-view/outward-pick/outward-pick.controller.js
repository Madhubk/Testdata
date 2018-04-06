(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOutwardPickController", SRVOutwardPickController);

    SRVOutwardPickController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVOutwardPickController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVOutwardPickCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("pickConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVOutwardPickCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            Config.ValidationFindall();
            SRVOutwardPickCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVOutwardPickCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVOutwardPickCtrl.ePage.Masters.Entity.PickNo;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVOutwardPickCtrl.ePage.Masters.Entity.PickNo) {
                            SRVOutwardPickCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    var _curRecord = {
                        PK: SRVOutwardPickCtrl.ePage.Masters.Entity.PK,
                        PickNo: SRVOutwardPickCtrl.ePage.Masters.Entity.PickNo
                    };
                    GetTabDetails(_curRecord);
                }
            } else {
                var _curRecord = {
                    PK: SRVOutwardPickCtrl.ePage.Masters.Entity.PK,
                    PickNo: SRVOutwardPickCtrl.ePage.Masters.Entity.PickNo
                };
                GetTabDetails(_curRecord);
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "Warehouse,WarehouseLocation,WarehouseOutward,ProductRelatedParty";
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
                    SRVOutwardPickCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }



        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVOutwardPickCtrl.ePage.Masters.Entity.PickNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVOutwardPickCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
