(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVConsignmentOutwardController", SRVConsignmentOutwardController);

    SRVConsignmentOutwardController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig", "warehouseConfig"];

    function SRVConsignmentOutwardController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig, warehouseConfig) {
        /* jshint validthis: true */
        var SRVConsignOutwardCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("outwardConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");
        function Init() {
            SRVConsignOutwardCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            Config.ValidationFindall();
            SRVConsignOutwardCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVConsignOutwardCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            GetOrderDetails();
        }

        function GetOrderDetails() {
            var _filter = {
                "WorkOrderID": SRVConsignOutwardCtrl.ePage.Masters.Entity.WorkOrderID
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsWorkOrder.API.FindAll.FilterID,
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsWorkOrder.API.FindAll.Url, _input).then(function (response) {
                SRVConsignOutwardCtrl.ePage.Masters.OrderDetails = response.data.Response;
                SRVConsignOutwardCtrl.ePage.Masters.Entity.PK = response.data.Response[0].PK;
                InitOrder(SRVConsignOutwardCtrl.ePage.Masters.Entity, false);
            });
        }

        function InitOrder(currentOutward, IsNew) {
            SRVConsignOutwardCtrl.ePage.Masters.currentOutward = undefined;
            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVConsignOutwardCtrl.ePage.Masters.Entity.WorkOrderID;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVConsignOutwardCtrl.ePage.Masters.IsTabClick = true;
                var _currentOutward = undefined;
                if (!IsNew) {
                    _currentOutward = currentOutward;
                } else {
                    _currentOutward = currentOutward;
                }
                GetTabDetails(_currentOutward, IsNew)
            } else {
                toastr.info('Pick already opened ');
            }
        }
        // Get DataEntryNameList 
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

        function GetTabDetails(curRecord, IsNew) {
            GetDynamicLookupConfig();
            var currentObj;

            Config.GetTabDetails(curRecord, IsNew).then(function (response) {
                SRVConsignOutwardCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVConsignOutwardCtrl.ePage.Masters.Entity.WorkOrderID) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConsignOutwardCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConsignOutwardCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
