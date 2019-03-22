(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDashboardController", DynamicDashboardController);

    DynamicDashboardController.$inject = ["helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService"];

    function DynamicDashboardController(helperService, $filter, dynamicDashboardConfig, appConfig, apiService) {

        var DynamicDashboardCtrl = this;

        function Init() {
            DynamicDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicDashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            DynamicDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            DynamicDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;

            DynamicDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
            DynamicDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;

            DynamicDashboardCtrl.ePage.Masters.Config = dynamicDashboardConfig;
            GetWarehouseValues()
        }

        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = DynamicDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    GetJson();
                }
            });
        }

        function WarehouseChanged() {
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.ComponentList);
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = _ComponentList;
        }

        function dropCallback(selectedComponent, ComponentList, index, external) {
            var _ComponentList = angular.copy(ComponentList)
            angular.forEach(_ComponentList, function (value, key) {
                if (value.Directive == selectedComponent.Directive && value.ComponentName == selectedComponent.ComponentName) {
                    var _obj = selectedComponent;
                    _ComponentList.splice(key, 1);
                    _ComponentList.splice(index - 1, 0, _obj);
                    DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
                    DynamicDashboardCtrl.ePage.Masters.ComponentList = _ComponentList;
                }
            });
            angular.forEach(_ComponentList, function (v, k) {
                v.SequenceNo = k + 1;
            });
        }

        function LoadMore() {
            dynamicDashboardConfig.LoadMoreCount = dynamicDashboardConfig.LoadMoreCount + 4;
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.ComponentList);
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = _ComponentList;
        }

        function GetJson() {
            var _obj = [{
                "ComponentName": "AsnReceivedWithStatus",
                "Directive": "asn-received-status",
                "SequenceNo": 1,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "AsnTrend",
                "Directive": "asn-trend",
                "SequenceNo": 3,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "KPI",
                "Directive": "kpi-directive",
                "SequenceNo": 2,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "MyTask",
                "Directive": "my-task-directive",
                "SequenceNo": 5,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "PutawayStatus",
                "Directive": "putaway-status",
                "SequenceNo": 6,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "OpenSO",
                "Directive": "open-so",
                "SequenceNo": 4,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "PickWithShortfall",
                "Directive": "pick-with-shortfall",
                "SequenceNo": 8,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "GrnStatus",
                "Directive": "grn-status",
                "SequenceNo": 9,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "CycleCountJobs",
                "Directive": "cycle-count-jobs",
                "SequenceNo": 7,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Notification",
                "Directive": "notification",
                "SequenceNo": 10,
                "IsShow": false,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Exception",
                "Directive": "exception-directive",
                "SequenceNo": 11,
                "IsShow": false,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }];

            var LoadedAsDefaultDetails = $filter('filter')(_obj, { IsLoadAsDefault: true })
            if (LoadedAsDefaultDetails.length > 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            DynamicDashboardCtrl.ePage.Masters.ComponentList = _obj;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.ComponentList, 'SequenceNo');

        }

        Init();

    }

})();