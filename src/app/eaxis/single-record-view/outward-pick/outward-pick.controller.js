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
        
            var _filter = {
                pageName: 'WarehousePick'
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
