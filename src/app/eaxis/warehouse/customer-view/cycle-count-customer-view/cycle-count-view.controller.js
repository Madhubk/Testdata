(function(){
    "use strict";

    angular
         .module("Application")
         .controller("CycleCountViewController",CycleCountViewController);

    CycleCountViewController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "cycleCountViewConfig", "$timeout", "toastr", "appConfig","$rootScope", "$scope", "$window"];

    function CycleCountViewController($location, APP_CONSTANT, authService, apiService, helperService, cycleCountViewConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window){

        var CycleCountViewCtrl = this;

        function Init() {
            
            CycleCountViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Cycle Count",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": cycleCountViewConfig.Entities
            };

            CycleCountViewCtrl.ePage.Masters.dataentryName = "CycleCountCustomerView";
            CycleCountViewCtrl.ePage.Masters.taskName = "CycleCountCustomerView";
            CycleCountViewCtrl.ePage.Masters.TabList = [];
            cycleCountViewConfig.TabList = [];
            CycleCountViewCtrl.ePage.Masters.activeTabIndex = 0;
            CycleCountViewCtrl.ePage.Masters.isNewClicked = false;
            CycleCountViewCtrl.ePage.Masters.IsTabClick = false;

            //functions
            CycleCountViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CycleCountViewCtrl.ePage.Masters.AddTab = AddTab;
            CycleCountViewCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CycleCountViewCtrl.ePage.Masters.RemoveTab = RemoveTab;
            CycleCountViewCtrl.ePage.Masters.Config = cycleCountViewConfig;

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                CycleCountViewCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }
            
        function AddTab(currentCycleCount, isNew) {
            CycleCountViewCtrl.ePage.Masters.currentCycleCount = undefined;

            var _isExist = CycleCountViewCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentCycleCount.entity.StocktakeNumber)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });
            
            if (!_isExist) {
                CycleCountViewCtrl.ePage.Masters.IsTabClick = true;
                var _currentCycleCount = undefined;
                if (!isNew) {
                    _currentCycleCount = currentCycleCount.entity;
                } else {
                    _currentCycleCount = currentCycleCount;
                }

                cycleCountViewConfig.GetTabDetails(_currentCycleCount, isNew).then(function (response) {
                    CycleCountViewCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        CycleCountViewCtrl.ePage.Masters.activeTabIndex = CycleCountViewCtrl.ePage.Masters.TabList.length;
                        CycleCountViewCtrl.ePage.Masters.CurrentActiveTab(currentCycleCount.entity.StocktakeNumber);
                        CycleCountViewCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Cycle Count already opened ');
            }
        }
        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            CycleCountViewCtrl.ePage.Masters.currentCycleCount = currentTab;
        }
            
        function RemoveTab(event, index, currentCycleCount) {
            event.preventDefault();
            event.stopPropagation();
            var currentCycleCount = currentCycleCount[currentCycleCount.label].ePage.Entities;
            CycleCountViewCtrl.ePage.Masters.TabList.splice(index, 1);
        }
 
        Init();

    }
})();