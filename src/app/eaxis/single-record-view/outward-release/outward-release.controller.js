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
            Config.ValidationFindall();
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
            var _filter = {
                pageName: 'WarehouseRelease'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);
                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
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
