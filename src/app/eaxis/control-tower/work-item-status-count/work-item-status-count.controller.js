(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WorkItemStatusCountController", WorkItemStatusCountController);

    WorkItemStatusCountController.$inject = ["authService", "apiService", "helperService", "eaxisConfig", "$ocLazyLoad"];

    function WorkItemStatusCountController(authService, apiService, helperService, eaxisConfig, $ocLazyLoad) {
        /* jshint validthis: true */
        var WorkItemStatusCountCtrl = this;

        function Init() {
            WorkItemStatusCountCtrl.ePage = {
                "Title": "",
                "Prefix": "WorkItemStatusCount",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            WorkItemStatusCountCtrl.ePage.Masters.OnWorkItemClick = OnWorkItemClick;

            ConfigAPICall();
        }

        function ConfigAPICall() {
            WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = [];
            if (WorkItemStatusCountCtrl.code == "General") {
                GetWorkItemCountListCTGeneral();
            } else if (WorkItemStatusCountCtrl.code == "ProActive") {
                GetWorkItemCountListCTProActive();
            } else if (WorkItemStatusCountCtrl.code == "Overdue") {
                GetWorkItemCountListCTOverdue();
            } else if (WorkItemStatusCountCtrl.code == "History") {
                GetWorkItemCountListCTHistory();
            } else {
                WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = [];
            }
        }

        function GetWorkItemCountListCTGeneral() {
            WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = undefined;
            var _filter = {
                SortColumn: "WIP_ProcessName",
                SortType: "PASC",
                PageNumber: "1",
                PageSize: "1",
                PivotCount: "0",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };

            if (WorkItemStatusCountCtrl.filterInput) {
                var _isEmpty = angular.equals({}, WorkItemStatusCountCtrl.filterInput);
                if (!_isEmpty) {
                    for (var x in WorkItemStatusCountCtrl.filterInput) {
                        if (WorkItemStatusCountCtrl.filterInput[x]) {
                            _filter[x] = WorkItemStatusCountCtrl.filterInput[x];
                        }
                    }
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": eaxisConfig.Entities.EBPMControlTower.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMControlTower.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = response.data.Response;
                } else {
                    WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = [];
                }

                WorkItemStatusCountCtrl.workItemList = WorkItemStatusCountCtrl.ePage.Masters.WorkItemList;
            });
        }

        function GetWorkItemCountListCTProActive() {
            GetWorkItemCountListCTOverdue();
        }

        function GetWorkItemCountListCTOverdue() {
            WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = undefined;
            var _filter = {
                SortColumn: "CTM_ProcessName",
                SortType: "PASC",
                PageNumber: "1",
                PageSize: "1",
                PivotCount: "0",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };

            if (WorkItemStatusCountCtrl.filterInput) {
                var _isEmpty = angular.equals({}, WorkItemStatusCountCtrl.filterInput);
                if (!_isEmpty) {
                    for (var x in WorkItemStatusCountCtrl.filterInput) {
                        if (WorkItemStatusCountCtrl.filterInput[x]) {
                            _filter[x] = WorkItemStatusCountCtrl.filterInput[x];
                        }
                    }
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": eaxisConfig.Entities.vwWorkItemControlTowerMoreInfo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.vwWorkItemControlTowerMoreInfo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = response.data.Response;
                } else {
                    WorkItemStatusCountCtrl.ePage.Masters.WorkItemList = [];
                }

                WorkItemStatusCountCtrl.workItemList = WorkItemStatusCountCtrl.ePage.Masters.WorkItemList;
            });
        }

        function GetWorkItemCountListCTHistory() {
            GetWorkItemCountListCTGeneral();
        }

        function OnWorkItemClick($item, count, userStatus, tab, status) {
            WorkItemStatusCountCtrl.ePage.Masters.ActiveWorkItemCount = $item;
            if (userStatus) {
                WorkItemStatusCountCtrl.ePage.Masters.ActiveWorkItemCount.UserStatus = userStatus;
            } else {
                WorkItemStatusCountCtrl.ePage.Masters.ActiveWorkItemCount.UserStatus = undefined;
            }

            if (count) {
                if (count > 0) {
                    $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicControl", "dynamicGrid", "TaskAssignStartComplete", "confirmation"]).then(function(){
                        var _item = {
                            Data: WorkItemStatusCountCtrl.ePage.Masters.ActiveWorkItemCount,
                            WorkItemList: WorkItemStatusCountCtrl.ePage.Masters.WorkItemList,
                            Status: status
                        };
                        WorkItemStatusCountCtrl.selectedItem({
                            $item: _item
                        });
                    });
                }
            }
        }

        Init();
    }
})();
