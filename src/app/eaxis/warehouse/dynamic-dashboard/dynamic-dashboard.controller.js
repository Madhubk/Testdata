(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDashboardController", DynamicDashboardController);

    DynamicDashboardController.$inject = ["helperService", "$filter"];

    function DynamicDashboardController(helperService, $filter) {

        var DynamicDashboardCtrl = this;

        function Init() {
            DynamicDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicDashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            GetJson();
            DynamicDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            DynamicDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            DynamicDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;
            DynamicDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
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
            DynamicDashboardCtrl.ePage.Masters.templateDir = '<dynamic-dashboard-directive component-list="DynamicDashboardCtrl.ePage.Masters.ComponentList"></dynamic-dashboard-directive>';
            angular.element(DynamicDashboardCtrl.ePage.Masters.templateDir);
        }

        function GetJson() {
            DynamicDashboardCtrl.ePage.Masters.ComponentList = [{
                "ComponentName": "AsnReceivedWithStatus",
                "Directive": "asn-received-status",
                "SequenceNo": 1,
                "IsShow": true
            },
            {
                "ComponentName": "AsnTrend",
                "Directive": "asn-trend",
                "SequenceNo": 3,
                "IsShow": true
            },
            {
                "ComponentName": "Notification",
                "Directive": "notification",
                "SequenceNo": 5,
                "IsShow": true
            }, {
                "ComponentName": "KPI",
                "Directive": "kpi-directive",
                "SequenceNo": 2,
                "IsShow": true
            }, {
                "ComponentName": "MyTask",
                "Directive": "my-task-directive",
                "SequenceNo": 4,
                "IsShow": true
            }, {
                "ComponentName": "PutawayStatus",
                "Directive": "putaway-status",
                "SequenceNo": 6,
                "IsShow": true
            }, {
                "ComponentName": "OpenSO",
                "Directive": "open-so",
                "SequenceNo": 7,
                "IsShow": true
            }, {
                "ComponentName": "PickWithShortfall",
                "Directive": "pick-with-shortfall",
                "SequenceNo": 8,
                "IsShow": true
            },{
                "ComponentName": "GrnStatus",
                "Directive": "grn-status",
                "SequenceNo": 9,
                "IsShow": true
            },{
                "ComponentName": "CycleCountJobs",
                "Directive": "cycle-count-jobs",
                "SequenceNo": 10,
                "IsShow": true
            }];
            DynamicDashboardCtrl.ePage.Masters.ComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.ComponentList, 'SequenceNo');
        }

        Init();

    }

})();