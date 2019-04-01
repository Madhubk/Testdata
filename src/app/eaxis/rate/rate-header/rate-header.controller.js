(function(){
    "use strict";

    angular
         .module("Application")
         .controller("RateHeaderController",RateHeaderController);

    RateHeaderController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "rateheaderConfig", "$timeout", "toastr", "appConfig"];

    function RateHeaderController($location, APP_CONSTANT, authService, apiService, helperService, rateheaderConfig, $timeout, toastr, appConfig){

        var RateHeaderCtrl = this;

        function Init() {
            
            RateHeaderCtrl.ePage = {
                "Title": "",
                "Prefix": "RateHeader",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": rateheaderConfig.Entities
            };

            RateHeaderCtrl.ePage.Masters.dataentryName = "RateHeader";
            RateHeaderCtrl.ePage.Masters.taskName = "RateHeader";
            RateHeaderCtrl.ePage.Masters.TabList = [];
            RateHeaderCtrl.ePage.Masters.activeTabIndex = 0;
            RateHeaderCtrl.ePage.Masters.isNewClicked = false;
            RateHeaderCtrl.ePage.Masters.IsTabClick = false;
            RateHeaderCtrl.ePage.Masters.Config = rateheaderConfig;
            // Remove all Tabs 
            rateheaderConfig.TabList = [];

            //functions
            RateHeaderCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            RateHeaderCtrl.ePage.Masters.AddTab = AddTab;
            RateHeaderCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            RateHeaderCtrl.ePage.Masters.RemoveTab = RemoveTab;
            RateHeaderCtrl.ePage.Masters.CreateNewRateHeader = CreateNewRateHeader;
            RateHeaderCtrl.ePage.Masters.SaveandClose = SaveandClose;

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                RateHeaderCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewRateHeader();
            }
        }
            
        function AddTab(currentRateHeader, isNew) {
            RateHeaderCtrl.ePage.Masters.currentRateHeader = undefined;

            var _isExist = RateHeaderCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentRateHeader.entity.RateRefNo)
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
                RateHeaderCtrl.ePage.Masters.IsTabClick = true;
                var _currentRateHeader = undefined;
                if (!isNew) {
                    _currentRateHeader = currentRateHeader.entity;
                } else {
                    _currentRateHeader = currentRateHeader;
                 }

                rateheaderConfig.GetTabDetails(_currentRateHeader, isNew).then(function (response) {
                    RateHeaderCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        RateHeaderCtrl.ePage.Masters.activeTabIndex = RateHeaderCtrl.ePage.Masters.TabList.length;
                        RateHeaderCtrl.ePage.Masters.CurrentActiveTab(currentRateHeader.entity.RateRefNo);
                        RateHeaderCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Rate Header already opened ');
            }
        }
            
        function CurrentActiveTab(currentTab) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            }
            RateHeaderCtrl.ePage.Masters.currentRateHeader = currentTab;
        }

            
        function RemoveTab(event, index, currentRateHeader) {
            event.preventDefault();
            event.stopPropagation();
            var currentRateHeader = currentRateHeader[currentRateHeader.label].ePage.Entities;
            RateHeaderCtrl.ePage.Masters.TabList.splice(index, 1);
        }
            
            
        function CreateNewRateHeader() {
            var _isExist = RateHeaderCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                RateHeaderCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(RateHeaderCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                            // Validations:response.data.Response.Validations
                        };
                        RateHeaderCtrl.ePage.Masters.AddTab(_obj, true);
                        RateHeaderCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Rate Header response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }
            
        function SaveandClose(index, currentRateHeader){
            var currentRateHeader = currentRateHeader[currentRateHeader.label].ePage.Entities;
            RateHeaderCtrl.ePage.Masters.TabList.splice(index-1, 1);
            RateHeaderCtrl.ePage.Masters.Config.SaveAndClose = false;
            RateHeaderCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }
})();