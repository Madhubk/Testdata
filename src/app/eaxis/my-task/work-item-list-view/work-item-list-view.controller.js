(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WorkItemListViewController", WorkItemListViewController);

    WorkItemListViewController.$inject = ["$timeout", "$location", "$uibModalInstance", "helperService", "toastr", "workItemListViewConfig", "param"];

    function WorkItemListViewController($timeout, $location, $uibModalInstance, helperService, toastr, workItemListViewConfig, param) {
        /* jshint validthis: true */
        var WorkItemListViewCtrl = this;

        function Init() {
            WorkItemListViewCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTaskSentItems",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": workItemListViewConfig.Entities
            };

            WorkItemListViewCtrl.ePage.Masters.Param = param;
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView = {};
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.CloseModal = CloseModal;
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.SelectedGridRow = SelectedGridRow;
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.RemoveTab = RemoveTab;
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.CurrentActiveTab = CurrentActiveTab;

            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.DefaultFilter = WorkItemListViewCtrl.ePage.Masters.Param._filter;

            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.dataentryName = "EBPMWorkItem";
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.config = WorkItemListViewCtrl.ePage.Entities;
            workItemListViewConfig.TabList = [];
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.TabList = [];
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.activeTabIndex = 0;
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.IsTabClick = false;

            if ($location.path().indexOf("my-task") != -1) {
                WorkItemListViewCtrl.ePage.Masters.WorkItemListView.ProcessInstanceMode = 2;
            } else if ($location.path().indexOf("control-tower") != -1) {
                WorkItemListViewCtrl.ePage.Masters.WorkItemListView.ProcessInstanceMode = 3;
            }
        }

        function CloseModal() {
            $uibModalInstance.dismiss('cancel');
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                AddTab($item.data, false);
            }
        }

        function AddTab(currentProcessInstance, isNew) {
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.currentProcessInstance = undefined;
            var _isExist = WorkItemListViewCtrl.ePage.Masters.WorkItemListView.TabList.some(function (value) {
                if (!isNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentProcessInstance.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                WorkItemListViewCtrl.ePage.Masters.WorkItemListView.IsTabClick = true;
                var _currentProcessInstance = undefined;
                if (!isNew) {
                    _currentProcessInstance = currentProcessInstance.entity;
                } else {
                    _currentProcessInstance = currentProcessInstance;
                }
                workItemListViewConfig.GetTabDetails(_currentProcessInstance, isNew).then(function (response) {
                    if (response) {
                        if (response.length > 0) {
                            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.TabList = response;

                            $timeout(function () {
                                WorkItemListViewCtrl.ePage.Masters.WorkItemListView.activeTabIndex = WorkItemListViewCtrl.ePage.Masters.WorkItemListView.TabList.length;
                                WorkItemListViewCtrl.ePage.Masters.WorkItemListView.CurrentActiveTab(currentProcessInstance.entity.PSI_InstanceNo);
                                WorkItemListViewCtrl.ePage.Masters.WorkItemListView.IsTabClick = false;
                            });
                        } else {
                            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.IsTabClick = false;
                        }
                    } else {
                        WorkItemListViewCtrl.ePage.Masters.WorkItemListView.IsTabClick = false;
                    }
                });
            } else {
                toastr.warning("Order Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentProcessInstance) {
            event.preventDefault();
            event.stopPropagation();
            var _currentProcessInstance = currentProcessInstance[currentProcessInstance.label].ePage.Entities;
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            WorkItemListViewCtrl.ePage.Masters.WorkItemListView.currentProcessInstance = currentTab;
        }

        Init();
    }
})();
