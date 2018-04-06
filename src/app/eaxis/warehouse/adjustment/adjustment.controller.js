(function(){
    "use strict";

    angular
         .module("Application")
         .controller("AdjustmentController",AdjustmentController);

    AdjustmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "adjustmentConfig", "$timeout", "toastr", "appConfig"];

    function AdjustmentController($location, APP_CONSTANT, authService, apiService, helperService, adjustmentConfig, $timeout, toastr, appConfig){

        var AdjustmentCtrl = this;

        function Init() {
            
            AdjustmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Adjustment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": adjustmentConfig.Entities
            };

            AdjustmentCtrl.ePage.Masters.dataentryName = "WarehouseAdjustments";
            AdjustmentCtrl.ePage.Masters.taskName = "WarehouseAdjustments";
            AdjustmentCtrl.ePage.Masters.TabList = [];
            AdjustmentCtrl.ePage.Masters.activeTabIndex = 0;
            AdjustmentCtrl.ePage.Masters.isNewClicked = false;
            AdjustmentCtrl.ePage.Masters.IsTabClick = false;

            //functions
            AdjustmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AdjustmentCtrl.ePage.Masters.AddTab = AddTab;
            AdjustmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AdjustmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AdjustmentCtrl.ePage.Masters.CreateNewAdjustment = CreateNewAdjustment;
            AdjustmentCtrl.ePage.Masters.Config = adjustmentConfig;
            AdjustmentCtrl.ePage.Masters.SaveandClose = SaveandClose;
            
            adjustmentConfig.ValidationFindall();

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                AdjustmentCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewAdjustment();
            }
        }
            
        function AddTab(currentAdjustment, isNew) {
            AdjustmentCtrl.ePage.Masters.currentAdjustment = undefined;

            var _isExist = AdjustmentCtrl.ePage.Masters.TabList.some(function (value) {
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
                AdjustmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentAdjustment = undefined;
                if (!isNew) {
                    _currentAdjustment = currentAdjustment.entity;
                } else {
                    _currentAdjustment = currentAdjustment;
                }

                adjustmentConfig.GetTabDetails(_currentAdjustment, isNew).then(function (response) {
                    AdjustmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        AdjustmentCtrl.ePage.Masters.activeTabIndex = AdjustmentCtrl.ePage.Masters.TabList.length;
                        AdjustmentCtrl.ePage.Masters.CurrentActiveTab(currentAdjustment.entity.WorkOrderID);
                        AdjustmentCtrl.ePage.Masters.IsTabClick = false;
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
            AdjustmentCtrl.ePage.Masters.currentAdjustment = currentTab;
        }

            
        function RemoveTab(event, index, currentAdjustment) {
            event.preventDefault();
            event.stopPropagation();
            var currentAdjustment = currentAdjustment[currentAdjustment.label].ePage.Entities;
            AdjustmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }
            
            
        function CreateNewAdjustment() {
            var _isExist = AdjustmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                AdjustmentCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(AdjustmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIAdjustmentHeader,
                            data: response.data.Response.Response,
                            Validations:response.data.Response.Validations
                        };
                        AdjustmentCtrl.ePage.Masters.AddTab(_obj, true);
                        AdjustmentCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Adjustment response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }
            
        function SaveandClose(index, currentAdjustment){
            var currentAdjustment = currentAdjustment[currentAdjustment.label].ePage.Entities;
            AdjustmentCtrl.ePage.Masters.TabList.splice(index-1, 1);
            AdjustmentCtrl.ePage.Masters.Config.SaveAndClose = false;
            AdjustmentCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }
})();