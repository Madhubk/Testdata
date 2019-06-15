(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVGatepassOutwardController", SRVGatepassOutwardController);

    SRVGatepassOutwardController.$inject = ["$location", "$injector", "apiService", "helperService", "appConfig"];

    function SRVGatepassOutwardController($location, $injector, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var SRVGatepassOutwardCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("outwardConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVGatepassOutwardCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            Config.ValidationFindall();
            SRVGatepassOutwardCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVGatepassOutwardCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVGatepassOutwardCtrl.ePage.Masters.Entity.WorkOrderID;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVGatepassOutwardCtrl.ePage.Masters.Entity.WorkOrderID) {
                            SRVGatepassOutwardCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    var _curRecord = {
                        PK: SRVGatepassOutwardCtrl.ePage.Masters.Entity.PK,
                        WorkOrderID: SRVGatepassOutwardCtrl.ePage.Masters.Entity.WorkOrderID
                    };
                    GetTabDetails(_curRecord);
                }
            } else {
                var _curRecord = {
                    PK: SRVGatepassOutwardCtrl.ePage.Masters.Entity.PK,
                    WorkOrderID: SRVGatepassOutwardCtrl.ePage.Masters.Entity.WorkOrderID
                };
                GetTabDetails(_curRecord);
            }
        }

        function GetDynamicLookupConfig() {

            var _filter = {
                pageName: 'WarehouseOutward'
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
                        if (value.label === SRVGatepassOutwardCtrl.ePage.Masters.Entity.WorkOrderID) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVGatepassOutwardCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        Init();
    }
})();
