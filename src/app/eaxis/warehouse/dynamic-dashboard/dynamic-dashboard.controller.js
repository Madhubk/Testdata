(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDashboardController", DynamicDashboardController);

    DynamicDashboardController.$inject = ["helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService", "$timeout"];

    function DynamicDashboardController(helperService, $filter, dynamicDashboardConfig, appConfig, apiService, $timeout) {

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
            DynamicDashboardCtrl.ePage.Masters.ApplyBtnText = "Save";
            DynamicDashboardCtrl.ePage.Masters.IsApplyBtnDisable = false;

            DynamicDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
            DynamicDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;
            DynamicDashboardCtrl.ePage.Masters.Apply = Apply;

            DynamicDashboardCtrl.ePage.Masters.Config = dynamicDashboardConfig;
            GetWarehouseValues()
        }

        function Apply(event) {
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
            if (LoadedAsDefaultDetails.length > 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = LoadedAsDefaultDetails;
            }, 100);
            $(".dropdown").removeClass("open");
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
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }

        function dropCallback(selectedComponent, ComponentList, index, external) {
            var _ComponentList = angular.copy(ComponentList)
            angular.forEach(_ComponentList, function (value, key) {
                if (value.Directive == selectedComponent.Directive && value.ComponentName == selectedComponent.ComponentName) {
                    var _obj = selectedComponent;
                    _ComponentList.splice(key, 1);
                    _ComponentList.splice(index - 1, 0, _obj);
                    dynamicDashboardConfig.LoadedDirectiveCount = 0;
                    DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
                    $timeout(function () {
                        DynamicDashboardCtrl.ePage.Masters.ComponentList = _ComponentList;
                    }, 100);
                }
            });
            angular.forEach(_ComponentList, function (v, k) {
                v.SequenceNo = k + 1;
            });
        }

        function LoadMore() {
            dynamicDashboardConfig.LoadMoreCount = dynamicDashboardConfig.LoadMoreCount + 4;
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }

        function GetJson() {
            var _obj = [{
                "ComponentName": "ASN Received With Status",
                "Directive": "asn-received-status",
                "SequenceNo": 1,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "ASN Trend",
                "Directive": "asn-trend",
                "SequenceNo": 3,
                "IsShow": false,
                "SetAsDefault": false,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "KPI",
                "Directive": "kpi-directive",
                "SequenceNo": 2,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "My Task",
                "Directive": "my-task-directive",
                "SequenceNo": 5,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "Putaway Status",
                "Directive": "putaway-status",
                "SequenceNo": 6,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Open SO",
                "Directive": "open-so",
                "SequenceNo": 4,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Pick With Shortfall",
                "Directive": "pick-with-shortfall",
                "SequenceNo": 8,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "GRN Status",
                "Directive": "grn-status",
                "SequenceNo": 9,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Cycle Count Jobs",
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

            _obj = $filter('orderBy')(_obj, 'SequenceNo');
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(_obj);
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_obj, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
            if (LoadedAsDefaultDetails.length > 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            DynamicDashboardCtrl.ePage.Masters.ComponentList = angular.copy(LoadedAsDefaultDetails);
        }

        Init();

    }

})();