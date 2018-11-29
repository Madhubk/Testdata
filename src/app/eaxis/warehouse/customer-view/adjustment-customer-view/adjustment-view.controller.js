(function(){
    "use strict";

    angular
         .module("Application")
         .controller("AdjustmentViewController",AdjustmentViewController);

    AdjustmentViewController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "adjustmentViewConfig", "$timeout", "toastr", "appConfig","$rootScope", "$scope", "$window"];

    function AdjustmentViewController($location, APP_CONSTANT, authService, apiService, helperService, adjustmentViewConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window){

        var AdjustmentViewCtrl = this;

        function Init() {
            
            AdjustmentViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Adjustment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": adjustmentViewConfig.Entities
            };

            AdjustmentViewCtrl.ePage.Masters.dataentryName = "AdjustmentCustomerView";
            AdjustmentViewCtrl.ePage.Masters.taskName = "AdjustmentCustomerView";
            AdjustmentViewCtrl.ePage.Masters.TabList = [];
            adjustmentViewConfig.TabList = [];
            AdjustmentViewCtrl.ePage.Masters.activeTabIndex = 0;
            AdjustmentViewCtrl.ePage.Masters.isNewClicked = false;
            AdjustmentViewCtrl.ePage.Masters.IsTabClick = false;

            //functions
            AdjustmentViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AdjustmentViewCtrl.ePage.Masters.AddTab = AddTab;
            AdjustmentViewCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AdjustmentViewCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AdjustmentViewCtrl.ePage.Masters.Config = adjustmentViewConfig;

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                AdjustmentViewCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewAdjustment();
            }
        }
            
        function AddTab(currentAdjustment, isNew) {
            AdjustmentViewCtrl.ePage.Masters.currentAdjustment = undefined;

            var _isExist = AdjustmentViewCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentAdjustment.entity.WorkOrderID)
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
                AdjustmentViewCtrl.ePage.Masters.IsTabClick = true;
                var _currentAdjustment = undefined;
                if (!isNew) {
                    _currentAdjustment = currentAdjustment.entity;
                } else {
                    _currentAdjustment = currentAdjustment;
                }

                adjustmentViewConfig.GetTabDetails(_currentAdjustment, isNew).then(function (response) {
                    AdjustmentViewCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        AdjustmentViewCtrl.ePage.Masters.activeTabIndex = AdjustmentViewCtrl.ePage.Masters.TabList.length;
                        AdjustmentViewCtrl.ePage.Masters.CurrentActiveTab(currentAdjustment.entity.WorkOrderID);
                        AdjustmentViewCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Adjustment already opened ');
            }
        }
            
        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            AdjustmentViewCtrl.ePage.Masters.currentAdjustment = currentTab;
        }

            
        function RemoveTab(event, index, currentAdjustment) {
            event.preventDefault();
            event.stopPropagation();
            var currentAdjustment = currentAdjustment[currentAdjustment.label].ePage.Entities;
            AdjustmentViewCtrl.ePage.Masters.TabList.splice(index, 1);
        }
 
        Init();

    }
})();