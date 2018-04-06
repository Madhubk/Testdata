(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountController", CycleCountController);

    CycleCountController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "cycleCountConfig", "$timeout", "toastr", "appConfig"];

    function CycleCountController($location, APP_CONSTANT, authService, apiService, helperService, cycleCountConfig, $timeout, toastr, appConfig) {

        var CycleCountCtrl = this;

        function Init() {


            CycleCountCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCount",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": cycleCountConfig.Entities
            };

            CycleCountCtrl.ePage.Masters.taskName = "WarehouseCycleCount";
            CycleCountCtrl.ePage.Masters.dataentryName = "WarehouseCycleCount";
            CycleCountCtrl.ePage.Masters.TabList = [];
            CycleCountCtrl.ePage.Masters.activeTabIndex = 0;
            CycleCountCtrl.ePage.Masters.isNewCycleCountClicked = false;
            CycleCountCtrl.ePage.Masters.IsTabClick = false;

            //functions
            CycleCountCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CycleCountCtrl.ePage.Masters.AddTab = AddTab;
            CycleCountCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CycleCountCtrl.ePage.Masters.RemoveTab = RemoveTab;
            CycleCountCtrl.ePage.Masters.CreateNewCycleCount = CreateNewCycleCount;
            CycleCountCtrl.ePage.Masters.SaveandClose = SaveandClose;

            CycleCountCtrl.ePage.Masters.Config = cycleCountConfig;

            cycleCountConfig.ValidationFindall();

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                CycleCountCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewCycleCount();
            }
        }

        function AddTab(currentCycleCount, isNew) {
            CycleCountCtrl.ePage.Masters.currentCycleCount = undefined;

            var _isExist = CycleCountCtrl.ePage.Masters.TabList.some(function (value) {
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
                CycleCountCtrl.ePage.Masters.IsTabClick = true;
                var _currentCycleCount = undefined;
                if (!isNew) {
                    _currentCycleCount = currentCycleCount.entity;
                } else {
                    _currentCycleCount = currentCycleCount;
                }

                cycleCountConfig.GetTabDetails(_currentCycleCount, isNew).then(function (response) {
                    CycleCountCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        CycleCountCtrl.ePage.Masters.activeTabIndex = CycleCountCtrl.ePage.Masters.TabList.length;
                        CycleCountCtrl.ePage.Masters.CurrentActiveTab(currentCycleCount.entity.StocktakeNumber);
                        CycleCountCtrl.ePage.Masters.IsTabClick = false;
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
            CycleCountCtrl.ePage.Masters.currentCycleCount = currentTab;
        }

        function RemoveTab(event, index, currentCycleCount) {
            event.preventDefault();
            event.stopPropagation();
            var currentCycleCount = currentCycleCount[currentCycleCount.label].ePage.Entities;
            CycleCountCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewCycleCount() {
            var _isExist = CycleCountCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                CycleCountCtrl.ePage.Masters.isNewCycleCountClicked = true;

                helperService.getFullObjectUsingGetById(CycleCountCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsCycleCountHeader,
                            data: response.data.Response.Response,
                            Validations: response.data.Response.Validations
                        };
                        CycleCountCtrl.ePage.Masters.AddTab(_obj, true);
                        CycleCountCtrl.ePage.Masters.isNewCycleCountClicked = false;
                    } else {
                        console.log("Empty New Cycle Count response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }

        function SaveandClose(index, currentCycleCount){
            var currentCycleCount = currentCycleCount[currentCycleCount.label].ePage.Entities;
            CycleCountCtrl.ePage.Masters.TabList.splice(index-1, 1);
            CycleCountCtrl.ePage.Masters.Config.SaveAndClose = false;
            CycleCountCtrl.ePage.Masters.activeTabIndex = 0;
        }


        Init();

    }

})();