(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVPendingPickupController", SRVPendingPickupController);

    SRVPendingPickupController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig", "errorWarningService"];

    function SRVPendingPickupController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig, errorWarningService) {
        /* jshint validthis: true */
        var SRVPendingPickupCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("pickupConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVPendingPickupCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            SRVPendingPickupCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVPendingPickupCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SRVPendingPickupCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // validation findall call
            Config.ValidationFindall();
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVPendingPickupCtrl.ePage.Masters.Entity.WorkOrderID;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVPendingPickupCtrl.ePage.Masters.Entity.WorkOrderID) {
                            SRVPendingPickupCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    var _curRecord = {
                        PK: SRVPendingPickupCtrl.ePage.Masters.Entity.PK,
                        WorkOrderID: SRVPendingPickupCtrl.ePage.Masters.Entity.WorkOrderID
                    };
                    GetTabDetails(_curRecord);
                }
            } else {
                var _curRecord = {
                    PK: SRVPendingPickupCtrl.ePage.Masters.Entity.PK,
                    WorkOrderID: SRVPendingPickupCtrl.ePage.Masters.Entity.WorkOrderID
                };
                GetTabDetails(_curRecord);
            }
        }

        function GetDynamicLookupConfig() {

            var _filter = {
                pageName: 'PickupRequest'
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
                        if (value.label === SRVPendingPickupCtrl.ePage.Masters.Entity.WorkOrderID) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVPendingPickupCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        Init();
    }
})();
