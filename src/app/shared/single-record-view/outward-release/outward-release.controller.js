(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOutwardReleaseController", SRVOutwardReleaseController);

    SRVOutwardReleaseController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVOutwardReleaseController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVOutwardReleaseCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("releaseConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVOutwardReleaseCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVOutwardReleaseCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVOutwardReleaseCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVOutwardReleaseCtrl.ePage.Masters.Entity.PickNo;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVOutwardReleaseCtrl.ePage.Masters.Entity.PickNo) {
                            SRVOutwardReleaseCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    var _curRecord = {
                        PK: SRVOutwardReleaseCtrl.ePage.Masters.Entity.PK,
                        PickNo: SRVOutwardReleaseCtrl.ePage.Masters.Entity.PickNo
                    };
                    GetTabDetails(_curRecord);
                }
            } else {
                var _curRecord = {
                    PK: SRVOutwardReleaseCtrl.ePage.Masters.Entity.PK,
                    PickNo: SRVOutwardReleaseCtrl.ePage.Masters.Entity.PickNo
                };
                GetTabDetails(_curRecord);
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "Warehouse,WarehouseLocation,WarehouseOutward,OrganizationList,MstServiceLevel,CarrierServiceLevel";
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
                    SRVOutwardReleaseCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVOutwardReleaseCtrl.ePage.Masters.Entity.PickNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVOutwardReleaseCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        Init();
    }
})();
